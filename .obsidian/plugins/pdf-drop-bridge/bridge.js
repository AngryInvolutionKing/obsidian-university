'use strict';
/**
 * pdf-drop-bridge / bridge.js
 *
 * 纯 Node 逻辑：不 require('obsidian')，因此可以用
 *   node -e "require('./bridge.js')..."
 * 在 Obsidian 之外单独做端到端验证。
 *
 * 提取优先级：
 *   1) Miyo CLI   %LOCALAPPDATA%\Miyo\bin\miyo\miyo.exe parse <pdf> --json
 *   2) pdfread    python <...>\.codex\tools\pdfread\pdfread.py text <pdf> --out <md> --no-pages
 *
 * 为什么要落临时文件/走 --json：Windows 控制台的代码页会把中文打成乱码，
 * 所以正文一律从 JSON 字段或落盘文件里读，绝不从 stdout 直接抓正文。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const DOC_EXT = new Set(['.pdf', '.epub', '.docx']);

const DEFAULT_TOOLS = {
  miyoCli: path.join(
    process.env.LOCALAPPDATA || 'C:\\Users\\zhang\\AppData\\Local',
    'Miyo', 'bin', 'miyo', 'miyo.exe'
  ),
  python: 'C:\\Program Files\\Python312\\python.exe',
  pdfread: 'C:\\Users\\zhang\\.codex\\tools\\pdfread\\pdfread.py',
  timeoutMs: 15 * 60 * 1000,
  maxBuffer: 512 * 1024 * 1024,
};

function isDocName(name) {
  return DOC_EXT.has(path.extname(String(name || '')).toLowerCase());
}

function tempWorkDir(tag) {
  const dir = path.join(
    os.tmpdir(), 'pdf-drop-bridge',
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${String(tag || 'doc').slice(0, 24).replace(/[^\w.-]/g, '_')}`
  );
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function parseJsonLoose(text) {
  if (!text) return null;
  const t = String(text).trim();
  try { return JSON.parse(t); } catch (_) { /* 落到下面的宽松解析 */ }
  const i = t.indexOf('{');
  const j = t.lastIndexOf('}');
  if (i >= 0 && j > i) {
    try { return JSON.parse(t.slice(i, j + 1)); } catch (_) { /* 放弃 */ }
  }
  return null;
}

function runSync(cmd, args, o) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8', windowsHide: true, timeout: o.timeoutMs, maxBuffer: o.maxBuffer,
  });
  return {
    code: r.status === null ? -1 : r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    error: r.error ? String(r.error.message || r.error) : '',
  };
}

function runAsync(cmd, args, o) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { windowsHide: true });
    } catch (e) {
      resolve({ code: -1, stdout: '', stderr: '', error: String(e.message || e) });
      return;
    }
    let stdout = '', stderr = '', done = false;
    const timer = setTimeout(() => {
      if (!done) { try { child.kill(); } catch (_) {} }
    }, o.timeoutMs);
    child.stdout.on('data', (d) => { stdout += d.toString('utf8'); });
    child.stderr.on('data', (d) => { stderr += d.toString('utf8'); });
    child.on('error', (e) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ code: -1, stdout, stderr, error: String(e.message || e) });
    });
    child.on('close', (code) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ code: code === null ? -1 : code, stdout, stderr, error: '' });
    });
  });
}

function toolsOf(opts) {
  const o = Object.assign({}, DEFAULT_TOOLS, opts || {});
  if (!o.miyoCli) o.miyoCli = DEFAULT_TOOLS.miyoCli;
  if (!o.python) o.python = DEFAULT_TOOLS.python;
  if (!o.pdfread) o.pdfread = DEFAULT_TOOLS.pdfread;
  return o;
}

/* ---------- 两个提取器 ---------- */

async function miyoParse(docPath, o, sync) {
  if (!fs.existsSync(o.miyoCli)) {
    return { ok: false, reason: `Miyo CLI 不存在：${o.miyoCli}` };
  }
  const args = ['parse', docPath, '--json'];
  const r = sync ? runSync(o.miyoCli, args, o) : await runAsync(o.miyoCli, args, o);
  const j = parseJsonLoose(r.stdout);
  if (r.code === 0 && j && typeof j.text === 'string' && j.text.trim()) {
    return {
      ok: true, extractor: 'miyo-cli', text: j.text,
      meta: {
        pages: j.page_count, format: j.format, title: j.title,
        pdf_type: j.pdf_type, pages_needing_ocr: j.pages_needing_ocr,
        failed_page_count: j.failed_page_count,
      },
    };
  }
  const tail = (r.stderr || r.error || '').trim().split(/\r?\n/).slice(-2).join(' ');
  return { ok: false, reason: `miyo parse exit=${r.code}${tail ? ' :: ' + tail.slice(0, 240) : ''}` };
}

async function pdfreadParse(docPath, o, work, sync) {
  if (!fs.existsSync(o.pdfread)) return { ok: false, reason: `pdfread 不存在：${o.pdfread}` };
  const out = path.join(work, 'pdfread-text.md');
  const args = [o.pdfread, 'text', docPath, '--out', out, '--no-pages'];
  const r = sync ? runSync(o.python, args, o) : await runAsync(o.python, args, o);
  if (r.code === 0 && fs.existsSync(out)) {
    const text = fs.readFileSync(out, 'utf8');
    if (text.trim()) return { ok: true, extractor: 'pdfread', text, meta: {} };
  }
  return { ok: false, reason: `pdfread exit=${r.code}` };
}

/**
 * 提取正文。返回 { ok, extractor, text, meta, attempts[] }
 * sync=true 时用 spawnSync（Node 侧测试用）；插件里用异步版，避免卡住 Obsidian UI。
 */
async function parseDoc(docPath, opts) {
  const o = toolsOf(opts);
  const sync = !!(opts && opts.sync);
  const work = (opts && opts.workDir) || tempWorkDir(path.basename(docPath));
  const attempts = [];

  let r = await miyoParse(docPath, o, sync);
  attempts.push({ tool: 'miyo-cli', ok: !!r.ok, reason: r.reason });
  if (r.ok) return Object.assign(r, { attempts, workDir: work });

  r = await pdfreadParse(docPath, o, work, sync);
  attempts.push({ tool: 'pdfread', ok: !!r.ok, reason: r.reason });
  if (r.ok) return Object.assign(r, { attempts, workDir: work });

  return {
    ok: false, extractor: null, text: '', meta: {}, attempts, workDir: work,
    reason: attempts.map((a) => `${a.tool}: ${a.reason || 'failed'}`).join(' | '),
  };
}

/* ---------- 命名与笔记 ---------- */

function splitName(name) {
  const ext = path.extname(name);
  return { base: name.slice(0, name.length - ext.length), ext };
}

/** 在 dir 里找一个不冲突的文件名；existsFn(relPathOrAbs) 由调用方给（库内用 vault.getAbstractFileByPath）。 */
function uniqueName(existsFn, dir, base, ext) {
  const join = (b) => (dir ? `${dir}/${b}${ext}` : `${b}${ext}`);
  if (!existsFn(join(base))) return join(base);
  for (let i = 2; i < 500; i++) {
    const candidate = join(`${base} (${i})`);
    if (!existsFn(candidate)) return candidate;
  }
  return join(`${base} (${Date.now()})`);
}

function pad2(n) { return String(n).padStart(2, '0'); }

function stamp(d) {
  const t = d || new Date();
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())} ${pad2(t.getHours())}:${pad2(t.getMinutes())}`;
}

function yamlStr(s) {
  return '"' + String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ').slice(0, 400) + '"';
}

/**
 * 正文是否「薄得可疑」：扫描/手写件常常只抽到页眉几行字。
 * pages 未知时退回绝对阈值。文字版 PDF 通常每页 ≥ 800 字符，这里取 300 作保守线。
 */
function looksThin(text, pages) {
  const n = String(text || '').trim().length;
  if (!n) return true;
  const p = Number(pages);
  if (p && p > 0) return n / p < 300;
  return n < 1200;
}

function buildExtractNote(opt) {
  const pages = (opt.meta && (opt.meta.pages != null ? opt.meta.pages : opt.meta.page_count)) || null;
  const ocrPages = (opt.meta && Array.isArray(opt.meta.pages_needing_ocr)) ? opt.meta.pages_needing_ocr : [];
  const fm = [
    '---',
    'type: PDF提取',
    `source_pdf: "[[${opt.relPdf}]]"`,
    `original_path: ${yamlStr(opt.originalPath || '')}`,
    `extractor: ${opt.extractor || 'unknown'}`,
    pages != null ? `pages: ${pages}` : null,
    `extracted: ${yamlStr(opt.stamp || stamp())}`,
    'tags: [工具/PDF提取]',
    '---',
  ].filter(Boolean).join('\n');

  const head = [
    '',
    `> 由 pdf-drop-bridge 自动提取（${opt.extractor || 'unknown' }${pages != null ? `，共 ${pages} 页` : ''}）。原件：[[${opt.relPdf}]]`,
    opt.warning ? `> ${opt.warning}` : null,
    ocrPages.length ? `> ⚠️ Miyo 报告这些页没有文字层、需要 OCR：${ocrPages.slice(0, 40).join(', ')}${ocrPages.length > 40 ? ' …' : ''}` : null,
    opt.attempts && opt.attempts.some((a) => !a.ok && a.tool !== 'miyo-cli')
      ? `> 提取链路：${opt.attempts.map((a) => `${a.tool}${a.ok ? ' ✓' : ' ✗'}`).join(' → ')}`
      : null,
    '',
    '',
  ].filter((x) => x !== null).join('\n');

  return fm + '\n' + head + String(opt.text || '').trim() + '\n';
}

function promptFor(opt) {
  const o = opt || {};
  const tpl = o.template || '读一下这份 PDF 的提取正文：[[{note}]]（原件 [[{pdf}]]，{pages} 页，提取工具 {extractor}）';
  const note = o.relNote != null && o.relNote !== '' ? o.relNote : (o.note || '');
  const pdf = o.relPdf != null && o.relPdf !== '' ? o.relPdf : (o.pdf || '');
  return tpl
    .replace(/\{note\}/g, note)
    .replace(/\{pdf\}/g, pdf)
    .replace(/\{pages\}/g, o.pages == null ? '?' : String(o.pages))
    .replace(/\{extractor\}/g, o.extractor || 'unknown');
}

module.exports = {
  DOC_EXT, DEFAULT_TOOLS, isDocName, tempWorkDir, parseJsonLoose,
  runSync, runAsync, parseDoc, miyoParse, pdfreadParse,
  splitName, uniqueName, stamp, yamlStr, buildExtractNote, promptFor, toolsOf, looksThin,
};
