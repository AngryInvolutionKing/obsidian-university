'use strict';
/**
 * pdf-drop-bridge / main.js  （Obsidian 插件本体）
 *
 * 解决的痛点：Copilot 的聊天输入框只接受「库内文件」作为上下文，从 Windows 资源管理器
 * 拖进去的 PDF 会被静默丢弃（它只认 image/*）。而 Copilot 自己不给开发者接口，
 * 改它的 main.js 又会被插件升级覆盖。
 *
 * 这个插件不碰 Copilot 一个字节，只在最外层接住「带文件的拖放」：
 *   资源管理器拖入 PDF ──▶ 复制进库（默认 40-Attachments/_imported/）
 *                        ──▶ Miyo CLI 提取正文（失败回退 pdfread）
 *                        ──▶ 生成带 frontmatter 的提取笔记
 *                        ──▶ 把「读这条笔记」的提示语复制到剪贴板 + Notice 提示
 * 于是「拖进来 → 粘贴 → 发送」即可让 Copilot（或任何 agent）用很低的 token 读完整篇。
 */

const { Plugin, PluginSettingTab, Setting, Notice, Modal } = require('obsidian');
const fs = require('fs');
const os = require('os');
const path = require('path');
// 注意：Obsidian 插件里的 require 不解析相对路径（会落到 Electron 的 require 上，
// 报 "Cannot find module './bridge.js'"），所以延迟到 onload 里用绝对路径加载。
let bridge = null;
function loadBridge(pluginDir, vaultBase) {
  if (bridge) return bridge;
  let dir = pluginDir || '';
  // Obsidian 1.9 的 manifest.dir 是「相对库根」的路径（形如 .obsidian\plugins\pdf-drop-bridge），
  // 必须补成绝对路径，否则 Node 的 require 会按 cwd 解析而找不到文件。
  if (dir && !path.isAbsolute(dir) && vaultBase) dir = path.resolve(vaultBase, dir);
  const target = path.join(dir, 'bridge.js');
  // Obsidian 重载插件时不会清 Node 的模块缓存，改过 bridge.js 后必须自己清，否则还在跑旧代码。
  try { delete require.cache[target]; } catch (_) {}
  bridge = require(target);
  return bridge;
}

const DEFAULT_SETTINGS = {
  scope: 'copilot',                       // copilot | vault
  importFolder: '40-Attachments/_imported',
  writeExtractNote: true,
  copyPrompt: true,
  openNote: false,
  maxMB: 200,
  promptTemplate: '读一下这份 PDF 的提取正文：[[{note}]]（原件 [[{pdf}]]，{pages} 页，提取工具 {extractor}）',
  miyoCli: '',                            // 空 = 用 bridge.js 里的默认路径
  python: '',
  pdfread: '',
  renderScanned: true,      // 扫描/手写件：渲染前几页成 PNG（Copilot 读手写只能走图片通道）
  renderPages: 5,
  renderDpi: 150,
};

function bufToArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function eleFrom(target) {
  if (!target) return null;
  if (target.nodeType === 1) return target;
  return target.parentElement || null;
}

/** 从拖放事件里拿这个文件在磁盘上的绝对路径（拿不到也不算错：正文会从 bytes 走） */
function osPathFor(file, dt) {
  try {
    const electron = require('electron');
    const webUtils = electron && electron.webUtils;
    if (webUtils && typeof webUtils.getPathForFile === 'function') {
      const p = webUtils.getPathForFile(file);
      if (p) return p;
    }
  } catch (_) { /* 老版本 Electron 没有 webUtils */ }
  if (file && typeof file.path === 'string' && file.path) return file.path;
  try {
    const uri = dt && dt.getData('text/uri-list');
    if (uri) {
      const first = String(uri).split(/\r?\n/).find((l) => l && !l.startsWith('#'));
      if (first) {
        return decodeURIComponent(first.replace(/^file:\/\/\//i, '')).replace(/\//g, '\\');
      }
    }
  } catch (_) { /* ignore */ }
  return '';
}

function isCopilotTarget(target) {
  let el = eleFrom(target);
  let hops = 0;
  while (el && hops < 40) {
    const dt = el.getAttribute ? el.getAttribute('data-type') : null;
    if (dt && String(dt).startsWith('copilot')) return true;
    el = el.parentElement;
    hops++;
  }
  return false;
}

function normalizeFolder(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

/* ---------------- 手动导入（绝对路径）的输入框 ---------------- */

class PathModal extends Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: '导入并解析一个 PDF' });
    contentEl.createEl('p', {
      text: '粘贴磁盘上的完整路径（例如 C:\\Users\\zhang\\Desktop\\数学\\a.pdf）。也可以直接从资源管理器把 PDF 拖进 Copilot 面板，效果相同。',
    });
    let value = '';
    new Setting(contentEl)
      .setName('PDF 路径')
      .addText((t) => {
        t.setPlaceholder('D:\\...\\file.pdf').onChange((v) => { value = v; });
        t.inputEl.style.width = '100%';
        setTimeout(() => t.inputEl.focus(), 0);
      })
      .addButton((b) => b.setButtonText('导入').setCta().onClick(() => {
        const p = value.trim().replace(/^"|"$/g, '');
        if (!p) { new Notice('路径为空'); return; }
        this.close();
        this.onSubmit(p);
      }));
  }
  onClose() { this.contentEl.empty(); }
}

/* ---------------- 插件本体 ---------------- */

class PdfDropBridge extends Plugin {
  async onload() {
    loadBridge(this.manifest.dir, (this.app.vault.adapter.getBasePath && this.app.vault.adapter.getBasePath()) || '');
    await this.loadSettings();
    this.addSettingTab(new PdfDropBridgeSettingTab(this.app, this));
    this.queue = Promise.resolve();

    this.addCommand({
      id: 'import-pdf-by-path',
      name: '导入并解析 PDF（粘贴绝对路径）',
      callback: () => new PathModal(this.app, (p) => this.ingestPath(p)).open(),
    });

    this.addCommand({
      id: 'copy-next-rendered-page',
      name: '复制下一页渲染图（扫描/手写件）',
      callback: () => this.copyNextRendered(),
    });

    // 捕获阶段接住拖放：Copilot 自己的处理器只认图片，我们在它之前把 PDF 拿走。
    this.registerDomEvent(document, 'dragover', (evt) => {
      if (this.wantsDrop(evt)) {
        evt.preventDefault();
        try { evt.dataTransfer.dropEffect = 'copy'; } catch (_) {}
      }
    }, true);

    this.registerDomEvent(document, 'drop', (evt) => this.onDrop(evt), true);

    // 给自测/脚本用：window.pdfDropBridge.ingestPath('D:\\...\\x.pdf')
    window.pdfDropBridge = {
      plugin: this,
      ingestPath: (p, o) => this.ingestPath(p, o),
      ingestBytes: (name, bytes, osPath) => this.ingestBytes(name, Buffer.from(bytes), osPath || '', {}),
      settings: () => this.settings,
      version: '0.1.0',
    };

    console.log('[pdf-drop-bridge] loaded (scope=' + this.settings.scope + ', folder=' + this.settings.importFolder + ')');
  }

  onunload() {
    try { delete window.pdfDropBridge; } catch (_) {}
    console.log('[pdf-drop-bridge] unloaded');
  }

  wantsDrop(evt) {
    const dt = evt && evt.dataTransfer;
    if (!dt || !dt.types) return false;
    const types = Array.from(dt.types);
    if (!types.includes('Files')) return false;
    if (this.settings.scope === 'copilot') return isCopilotTarget(evt.target);
    const el = eleFrom(evt.target);
    if (el && el.closest && el.closest('.nav-files-container')) return false; // 交给 Obsidian 自己的导入
    return true;
  }

  onDrop(evt) {
    const dt = evt && evt.dataTransfer;
    if (!dt) return;
    const files = Array.from(dt.files || []);
    if (!files.length) return;
    const docs = files.filter((f) => bridge.isDocName(f.name));
    if (!docs.length) return;
    if (!this.wantsDrop(evt)) return;

    evt.preventDefault();
    // 千万不要 stopPropagation：Copilot 自己的 drop 监听要收到这次事件才会收起它那个
    // 「Drop files here…」遮罩，否则拖完之后遮罩卡住、整个面板像被钉住（用户实测反馈）。
    this.clearDropOverlay(evt);

    // DataTransfer 在这一轮事件之后会失效：同步取好路径、启动读取
    const items = docs.map((f) => ({
      name: f.name, size: f.size, osPath: osPathFor(f, dt), bytes: f.arrayBuffer(),
    }));
    for (const it of items) {
      this.queue = this.queue.then(() => this.ingestItem(it)).catch((e) => {
        console.error('[pdf-drop-bridge]', e);
        new Notice('PDF Drop Bridge 出错：' + (e && e.message ? e.message : e), 12000);
      });
    }
  }

  /** 兜底：补一次 dragleave/dragend，让宿主（Copilot）的拖放遮罩无论如何都能收起来 */
  clearDropOverlay(evt) {
    try {
      const t = eleFrom(evt && evt.target) || document.body;
      for (const type of ['dragleave', 'dragend']) {
        t.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true }));
        document.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true }));
      }
    } catch (_) { /* 老 Electron 构造不了 DragEvent 就算了 */ }
  }

  tools() {
    const o = {};
    if (this.settings.miyoCli) o.miyoCli = this.settings.miyoCli;
    if (this.settings.python) o.python = this.settings.python;
    if (this.settings.pdfread) o.pdfread = this.settings.pdfread;
    return o;
  }

  async ensureFolder(folder) {
    if (!folder) return;
    const parts = normalizeFolder(folder).split('/').filter(Boolean);
    let cur = '';
    for (const p of parts) {
      cur = cur ? cur + '/' + p : p;
      if (!this.app.vault.getAbstractFileByPath(cur)) {
        try { await this.app.vault.createFolder(cur); } catch (_) { /* 已存在等竞态 */ }
      }
    }
  }

  async copyText(text) {
    try {
      const electron = require('electron');
      if (electron && electron.clipboard && electron.clipboard.writeText) {
        electron.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* 回退 navigator */ }
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { return false; }
  }

  async ingestItem(item) {
    const notice = new Notice(`PDF Drop Bridge：正在导入 ${item.name} …`, 15000);
    try {
      const buf = Buffer.from(await item.bytes);
      await this.ingestBytes(item.name, buf, item.osPath, { notice });
    } catch (e) {
      notice.hide();
      new Notice('导入失败：' + (e && e.message ? e.message : e), 12000);
    }
  }

  async ingestPath(absPath) {
    if (!absPath || !fs.existsSync(absPath)) { new Notice('文件不存在：' + absPath, 10000); return; }
    const buf = fs.readFileSync(absPath);
    await this.ingestBytes(path.basename(absPath), buf, absPath, {});
  }

  /** 核心：字节进库 → 提取 → 建笔记 → 复制提示语 */
  async ingestBytes(name, buf, osPath, ctx) {
    const notice = (ctx && ctx.notice) || null;
    const mb = buf.length / 1048576;
    if (mb > this.settings.maxMB) {
      if (notice) notice.hide();
      new Notice(`文件 ${mb.toFixed(1)} MB 超过上限 ${this.settings.maxMB} MB（可在插件设置里调大）`, 12000);
      return;
    }

    const folder = normalizeFolder(this.settings.importFolder);
    await this.ensureFolder(folder);

    const { base, ext } = bridge.splitName(name);
    const exists = (p) => !!this.app.vault.getAbstractFileByPath(p);
    const relPdf = bridge.uniqueName(exists, folder, base, ext);
    await this.app.vault.createBinary(relPdf, bufToArrayBuffer(buf));

    // 提取：优先用磁盘上的原路径（能拿到），否则把字节落到临时文件再交给 CLI
    let srcPath = osPath && fs.existsSync(osPath) ? osPath : '';
    if (!srcPath) {
      const work = bridge.tempWorkDir(base);
      srcPath = path.join(work, name);
      fs.writeFileSync(srcPath, buf);
    }

    if (notice) notice.setMessage(`PDF Drop Bridge：${name} 已入库，正在提取正文 …`);

    const res = await bridge.parseDoc(srcPath, this.tools());
    const pages = res.meta && (res.meta.pages != null ? res.meta.pages : null);

    // 扫描/手写件：Miyo 会以 exit=9 明确拒绝，回退的 pdfread 顶多抽到页眉几行字
    const thin = res.ok ? bridge.looksThin(res.text, pages) : false;
    const miyoNoText = (res.attempts || []).some(
      (a) => !a.ok && /exit=9|no extractable text/i.test(String(a.reason || ''))
    );
    const warning = !thin ? '' : (miyoNoText
      ? '⚠️ 这份 PDF 没有可用文字层（Miyo 判定为扫描件/纯图片；回退提取只拿到极少文本）。手写内容 OCR 无效，需要把页面渲染成图交给有视觉的模型：pdfread render "<pdf>" --pages N --dpi 120'
      : '⚠️ 抽到的正文异常短，可能是扫描件或版式特殊，建议抽查几页确认。');

    // 扫描/手写件：OCR 读不了（实测乱码），唯一通道是把页面渲染成图交给有视觉的模型。
    let rendered = null;
    if (thin && this.settings.renderScanned) {
      if (notice) notice.setMessage(`PDF Drop Bridge：${name} 疑似扫描/手写，正在渲染前 ${this.settings.renderPages} 页 …`);
      try {
        rendered = await this.renderScannedPages({ srcPath, base });
      } catch (e) {
        rendered = { ok: false, relPaths: [], reason: String(e && e.message ? e.message : e) };
      }
    }

    if (!res.ok) {
      if (notice) notice.hide();
      new Notice(
        `已导入 ${relPdf}，但正文提取失败（${String(res.reason || '').slice(0, 160)}）。\n` +
        '这是典型的扫描件/手写件：正文没有文字层，只能看图片。\n' +
        (rendered && rendered.relPaths && rendered.relPaths.length
          ? `已渲染 ${rendered.relPaths.length} 页图片 → ${rendered.dir}/\n第 1 页图片已复制：到 Copilot 输入框 Ctrl+V（或 + → Images 多选几页）。`
          : '渲染页面失败：' + String((rendered && rendered.reason) || '未知原因')),
        25000
      );
      return;
    }

    let relNote = null;
    if (this.settings.writeExtractNote) {
      relNote = bridge.uniqueName(exists, folder, base, '.md');
      const content = bridge.buildExtractNote({
        relPdf, relNote, originalPath: osPath || srcPath,
        extractor: res.extractor, meta: res.meta || {}, text: res.text,
        attempts: res.attempts, stamp: bridge.stamp(), warning,
      });
      await this.app.vault.create(relNote, content);
    }

    const prompt = bridge.promptFor({
      template: this.settings.promptTemplate,
      relNote: relNote, relPdf: relPdf,
      pages: pages, extractor: res.extractor,
    });
    const copied = this.settings.copyPrompt ? await this.copyText(prompt) : false;

    // 扫描/手写件：剪贴板里要留的是「图片」而不是提示语 —— 图片是他自己粘贴不出来的那一半。
    let imageCopied = false;
    if (rendered && rendered.ok && rendered.relPaths && rendered.relPaths.length) {
      imageCopied = await this.copyImage(this.absPath(rendered.relPaths[0]));
    }

    if (notice) notice.hide();
    const kb = Math.round(Buffer.byteLength(res.text, 'utf8') / 1024);
    new Notice(
      `PDF Drop Bridge：${base}${ext} 已入库（${mb.toFixed(1)} MB）\n` +
      `正文 ${kb} KB${pages ? `／${pages} 页` : ''}（${res.extractor}）` +
      (relNote ? `\n提取笔记：${relNote}` : '') +
      (imageCopied
        ? `\n手写/扫描件：已渲染 ${rendered.relPaths.length} 页图 → ${rendered.dir}/` +
          '\n第 1 页图片已在剪贴板 —— 到 Copilot 输入框 Ctrl+V，让它「看」这一页（翻页：命令「复制下一页渲染图」）' +
          `\n提示语（可手打）：${prompt}`
        : (rendered && rendered.ok && rendered.relPaths.length
            ? `\n已渲染 ${rendered.relPaths.length} 页图 → ${rendered.dir}/（图片写剪贴板失败）`
            : '') +
          (copied ? '\n提示语已复制 —— 到 Copilot 聊天框粘贴发送即可' : '')) +
      (warning ? '\n' + warning : ''),
      warning ? 25000 : (copied ? 12000 : 20000)
    );

    if (this.settings.openNote && relNote) {
      const f = this.app.vault.getAbstractFileByPath(relNote);
      if (f) await this.app.workspace.getLeaf(false).openFile(f);
    }
  }

  /** 扫描/手写件：把前 N 页渲染成 PNG 落库，并把第 1 页写进剪贴板（Copilot 只有图片通道） */
  async renderScannedPages(opt) {
    const src = (opt && opt.srcPath) || '';
    const base = (opt && opt.base) || 'pages';
    const tmp = bridge.tempWorkDir(base + '-pages');
    const r = await bridge.renderPages(src, {
      pages: `1-${Math.max(1, Number(this.settings.renderPages) || 5)}`,
      dpi: Number(this.settings.renderDpi) || 150,
      outDir: tmp,
      python: this.settings.python || undefined,
      pdfread: this.settings.pdfread || undefined,
    });
    if (!r.ok) {
      new Notice(`渲染页面失败：${r.reason || '未知原因'}`, 15000);
      return { ok: false, relPaths: [], dir: tmp, reason: r.reason };
    }
    const folder = normalizeFolder(this.settings.importFolder) + '/' + base + '-pages';
    await this.ensureFolder(folder);
    const exists = (p) => !!this.app.vault.getAbstractFileByPath(p);
    const relPaths = [];
    for (const abs of r.files) {
      const rel = bridge.uniqueName(exists, folder, path.basename(abs, '.png'), '.png');
      await this.app.vault.createBinary(rel, bufToArrayBuffer(fs.readFileSync(abs)));
      relPaths.push(rel);
    }
    this.lastRendered = { relPaths, index: 0, base };
    const copied = await this.copyImage(r.files[0]);
    return { ok: true, relPaths, dir: folder, tmp, copied };
  }

  /** 图片进剪贴板（Copilot 输入框只认粘贴/拖入的图片） */
  async copyImage(absPng) {
    try {
      const electron = require('electron');
      if (electron && electron.clipboard && electron.nativeImage) {
        const img = electron.nativeImage.createFromPath(absPng);
        if (img && !img.isEmpty()) { electron.clipboard.writeImage(img); return true; }
      }
    } catch (_) { /* 回退到写路径 */ }
    try { await navigator.clipboard.writeText(absPng); } catch (_) {}
    return false;
  }

  absPath(rel) {
    const b = (this.app.vault.adapter.getBasePath && this.app.vault.adapter.getBasePath()) || '';
    return b ? path.join(b, rel.split('/').join(path.sep)) : rel;
  }

  async copyNextRendered() {
    const last = this.lastRendered;
    if (!last || !last.relPaths || !last.relPaths.length) {
      new Notice('还没有渲染过的页面：先把一份扫描/手写 PDF 拖进来。', 10000);
      return;
    }
    last.index = (last.index + 1) % last.relPaths.length;
    const rel = last.relPaths[last.index];
    const ok = await this.copyImage(this.absPath(rel));
    new Notice(
      `已复制第 ${last.index + 1}/${last.relPaths.length} 页 → ${rel}` +
      (ok ? '' : '（图片写入剪贴板失败，剪贴板里放的是文件路径）'),
      12000
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() { await this.saveData(this.settings); }
}

/* ---------------- 设置面板 ---------------- */

class PdfDropBridgeSettingTab extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'PDF Drop Bridge' });
    containerEl.createEl('p', {
      text: '从资源管理器把 PDF 拖进 Obsidian（默认只在 Copilot 面板生效）→ 自动入库 + 提取正文 + 生成笔记 + 复制提示语。',
    });

    new Setting(containerEl)
      .setName('接住拖放的范围')
      .setDesc('copilot = 只有拖到 Copilot 面板才处理（推荐）；vault = 库内任何地方都处理（文件列表除外，那里交给 Obsidian 原生导入）')
      .addDropdown((d) => d
        .addOption('copilot', '仅 Copilot 面板')
        .addOption('vault', '整个库窗口')
        .setValue(this.plugin.settings.scope)
        .onChange(async (v) => { this.plugin.settings.scope = v; await this.plugin.saveSettings(); }));

    new Setting(containerEl)
      .setName('导入目录')
      .setDesc('拖入的文件与提取笔记都放这里（库内相对路径）')
      .addText((t) => t
        .setPlaceholder('40-Attachments/_imported')
        .setValue(this.plugin.settings.importFolder)
        .onChange(async (v) => { this.plugin.settings.importFolder = v; await this.plugin.saveSettings(); }));

    new Setting(containerEl)
      .setName('生成提取笔记（.md）')
      .setDesc('正文落成 Markdown（带 frontmatter：source_pdf / pages / extractor），agent 读它就等于读了 PDF，且能进 Obsidian 搜索')
      .addToggle((t) => t.setValue(this.plugin.settings.writeExtractNote)
        .onChange(async (v) => { this.plugin.settings.writeExtractNote = v; await this.plugin.saveSettings(); }));

    new Setting(containerEl)
      .setName('把提示语复制到剪贴板')
      .setDesc('复制「读一下这份提取正文：[[...]]」这类提示语，粘贴到 Copilot 发送即可')
      .addToggle((t) => t.setValue(this.plugin.settings.copyPrompt)
        .onChange(async (v) => { this.plugin.settings.copyPrompt = v; await this.plugin.saveSettings(); }));

    new Setting(containerEl)
      .setName('提示语模板')
      .setDesc('可用占位符：{note} {pdf} {pages} {extractor}')
      .addTextArea((t) => {
        t.setValue(this.plugin.settings.promptTemplate)
          .onChange(async (v) => { this.plugin.settings.promptTemplate = v; await this.plugin.saveSettings(); });
        t.inputEl.style.width = '100%';
        t.inputEl.rows = 2;
      });

    new Setting(containerEl)
      .setName('提取后打开笔记')
      .addToggle((t) => t.setValue(this.plugin.settings.openNote)
        .onChange(async (v) => { this.plugin.settings.openNote = v; await this.plugin.saveSettings(); }));

    new Setting(containerEl)
      .setName('单文件大小上限（MB）')
      .addText((t) => t.setValue(String(this.plugin.settings.maxMB))
        .onChange(async (v) => {
          const n = parseInt(v, 10);
          if (!isNaN(n) && n > 0) { this.plugin.settings.maxMB = n; await this.plugin.saveSettings(); }
        }));

    containerEl.createEl('h3', { text: '提取器路径（留空用默认）' });
    const tools = [
      ['miyoCli', 'Miyo CLI', '%LOCALAPPDATA%\\Miyo\\bin\\miyo\\miyo.exe'],
      ['python', 'Python', 'C:\\Program Files\\Python312\\python.exe'],
      ['pdfread', 'pdfread 脚本（回退用）', 'C:\\Users\\zhang\\.codex\\tools\\pdfread\\pdfread.py'],
    ];
    for (const [key, label, ph] of tools) {
      new Setting(containerEl)
        .setName(label)
        .addText((t) => t.setPlaceholder(ph)
          .setValue(this.plugin.settings[key] || '')
          .onChange(async (v) => { this.plugin.settings[key] = v.trim(); await this.plugin.saveSettings(); }));
    }

    containerEl.createEl('p', {
      text: '手动导入：命令面板 →「PDF Drop Bridge: 导入并解析 PDF（粘贴绝对路径）」。自测入口：控制台执行 window.pdfDropBridge.ingestPath("D:\\\\...\\\\x.pdf")。',
    });
  }
}

module.exports = PdfDropBridge;
