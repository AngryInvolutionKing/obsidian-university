const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require('C:/Users/zhang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const assert = (condition, message) => { if (!condition) throw new Error(message); };
(async () => {
  const browser = await playwright.chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
    await page.waitForFunction(() => !!window.cabinetDemo);
    const checks = await page.evaluate(() => {
      const demo = window.cabinetDemo, c = demo.constants;
      let maxRodError = 0;
      for (let i = 0; i <= 1000; i++) {
        const g = demo.geometry(i / 1000, 230);
        maxRodError = Math.max(maxRodError, Math.abs(Math.hypot(g.d, g.h) - c.rod));
        if (g.lid < c.hinge - 1e-6 && g.objectTop > c.rim - c.margin) throw new Error('盖板进入运动时展品净空不足');
        if (g.move > 0 && !(g.baseLocked && g.lidLocked && g.feet < 1e-6 && g.lid < 1e-6)) throw new Error('移动联锁不成立');
      }
      return { samples: 1001, maxRodError, high: demo.geometry(0, 230), low: demo.geometry(1, 230) };
    });
    assert(checks.maxRodError < 1e-8, '剪叉杆长不守恒');
    assert(checks.low.clearance === 65, '净空与概念尺寸不一致');
    fs.mkdirSync(path.join(__dirname, 'verification'), { recursive: true });
    const top = () => page.evaluate(() => window.scrollTo(0, 0));
    await top();
    await page.screenshot({ path: path.join(__dirname, 'verification', '01-display.png') });
    await page.locator('[data-progress="0.32"]').click();
    assert((await page.locator('#stateTitle').innerText()).includes('下降'), '下降阶段跳转失败');
    await top();
    await page.screenshot({ path: path.join(__dirname, 'verification', '02-lowering.png') });
    await page.locator('[data-progress="1"]').click();
    assert((await page.locator('#stateTitle').innerText()).includes('推行'), '移动阶段跳转失败');
    await top();
    await page.screenshot({ path: path.join(__dirname, 'verification', '03-stored.png') });
    await page.locator('#cutaway').uncheck();
    await top();
    await page.screenshot({ path: path.join(__dirname, 'verification', '03b-stored-solid.png') });
    await page.locator('#manualBtn').click();
    assert(await page.locator('#manualBtn').getAttribute('aria-pressed') === 'true', '驱动模式切换失败');
    await page.locator('#viewBtn').click();
    assert((await page.locator('#viewLabel').innerText()).includes('正视'), '正视模式切换失败');
    await page.locator('#cutaway').uncheck();
    await page.locator('#dims').uncheck();
    await top();
    await page.screenshot({ path: path.join(__dirname, 'verification', '04-solid-front.png') });
    await page.locator('#objectHeight').evaluate(el => { el.value = '320'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    const blocked = await page.evaluate(() => ({ p: window.cabinetDemo.getState().p, g: window.cabinetDemo.geometry(window.cabinetDemo.getState().p) }));
    assert(blocked.p === .64 && blocked.g.lid === checks.high.lid && blocked.g.move === 0, '过高展品未阻止合盖与移动');
    assert((await page.locator('#stateTitle').innerText()).includes('阻止'), '异常状态没有显示');
    await page.locator('#objectHeight').evaluate(el => { el.value = '230'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.locator('#electricBtn').click();
    await page.locator('#viewBtn').click();
    await page.locator('#cutaway').check();
    await page.locator('#dims').check();
    await page.locator('[data-progress="0"]').click();
    await page.locator('#speed').selectOption('2');
    await page.locator('#storeBtn').click();
    await page.waitForFunction(() => window.cabinetDemo.getState().p > .02);
    await page.locator('#pauseBtn').click();
    const paused = await page.evaluate(() => window.cabinetDemo.getState().p);
    await page.waitForTimeout(120);
    assert((await page.evaluate(() => window.cabinetDemo.getState().p)) === paused, '暂停后进度仍在变化');
    await page.locator('#pauseBtn').click();
    await page.waitForFunction(() => window.cabinetDemo.getState().p === 1, { timeout: 15000 });
    await page.locator('#showBtn').click();
    await page.waitForFunction(() => window.cabinetDemo.getState().p === 0, { timeout: 15000 });
    await page.locator('#cycleBtn').click();
    await page.waitForFunction(() => window.cabinetDemo.getState().target === 0, { timeout: 15000 });
    await page.waitForFunction(() => !window.cabinetDemo.getState().running && window.cabinetDemo.getState().p === 0, { timeout: 15000 });
    const downloadWait = page.waitForEvent('download');
    await page.locator('#exportBtn').click();
    const download = await downloadWait;
    const exportPath = path.join(__dirname, 'verification', 'export.svg');
    await download.saveAs(exportPath);
    assert(fs.readFileSync(exportPath, 'utf8').includes('<svg'), 'SVG 导出为空');
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert(!overflow, `页面在 ${width}px 宽度溢出`);
      await top();
      if (width === 390) await page.screenshot({ path: path.join(__dirname, 'verification', '05-mobile.png'), fullPage: false });
    }
    assert(errors.length === 0, `浏览器运行错误: ${errors.join('; ')}`);
    const report = { result: 'PASS', checks: ['1001 个剪叉状态的杆长守恒', '合盖前净空与移动前锁止顺序', '阶段跳转、驱动切换、剖视与正视切换', '过高展品阻止合盖与移动', '播放、暂停、继续、反向展开', '当前 SVG 导出', '390 / 768 / 1440px 无水平溢出', '无浏览器脚本错误'], samples: checks.samples, rodLengthError: checks.maxRodError, storedClearanceMM: checks.low.clearance };
    fs.writeFileSync(path.join(__dirname, 'verification', 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
