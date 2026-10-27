# 网页版画面打磨记录（2026-10-27）

目标：把 three.js 网页版的「平、灰蓝、看起来像低模」补成 Blender 渲染稿那种**三渲二 · 雨夜 · 暖店内**的观感。Blender 工程与渲染稿未改动。

## 改了什么

### 1. 描边（inverted hull）
- `three` 的 `EdgesGeometry` 线宽在 WebGL 恒为 1px，几乎看不见；改为给每个合并后的 toon 网格追加一层
  `BackSide` + 沿视空间法线外扩的壳（`main.mjs` 的 `outlineMat`，`uThick=.014`，色 `0x060c14`）。
- 关键坑：`Reflector` 的反射相机是 `camera.clone()`，会继承 `layers`，所以「把壳放到 layer 1」**不能**把它排除出水面反射，
  结果是湿地面反光被一层黑壳吃掉。现用 `hullGroup` + 包裹 `renderer.render`，在反射那一趟临时 `visible=false`。

### 2. 明暗与色调
- 环境光 1.50 → 1.18、月光 1.70 → 1.50，压暗室外；店内点光提到 `0xffb871/17` 与 `0xffcf96/13`，门前 `0xffb060/10`，
  顶灯自发光 `0xffc37a @ 1.45` → **暖橙室内 vs 冷蓝室外**的对比才立住。
- 新增后期 `grade` ShaderPass：饱和 1.20、对比 1.06、冷暗部 `(.74,.91,1.20)` / 暖高光 `(1.07,1.00,.92)` 分离色调、径向暗角 .90。
- `scene.fog = Fog(0x121d2e, 16, 46)`：给雨丝和远景一点空气感。
- 相机 fov 35 → 33、机位 `(13.2, 11.0, 16.7)`，画面更「微缩景」。

### 3. 招牌与湿地
- 招牌自发光 `.65 → 1.16×flutter`（配合 bloom 阈值 1.10，只让最亮处起光晕，不糊成白板）；bloom `(.26, .40, 1.25)`。
- 水面 `Reflector` 混合 0.34 → 0.32（中间试过 0.26，反射太弱，湿感不够）。
- 雨 1250 → 1700 条、拉长、`0xc9dcee @ .30`。

## 怎么看
- **单文件版（离线可双击）**：`rainy-konbini-standalone.html`（620 KB，three.js 与场景全内联，
  不依赖服务器也不发任何请求；桌面另存了一份「雨夜便利店.html」）。重新生成：`node make-standalone.mjs`
- 本地：`node serve.mjs` 后开 <http://127.0.0.1:4173/>
- 对比图：`polish-before-after.png`（左＝改前，右＝改后，同机位）
- 单帧：`preview-web-v2.png`（1440×1000）

## 第二轮：拖动时「变糊」的排查（2026-10-27）
用户反馈拖动时像素发糊。用 CDP 实测（`--force-device-scale-factor=2`，模拟 2880×1800@200% 屏）：
`canvas.width` 在拖动前后恒为 2812×1606，**不是动态降分辨率**。真正的原因是两个：

1. **画布被拉大**：`renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))` 在 2x 屏上只画 1.6 倍，
   再被浏览器放大到 2 倍 → 全程轻微重采样，拖起来边缘爬行明显。改成封顶 2（原生）。
2. **bloom 把亮部糊成一片**：bloom 阈值 1.25 低于店内亮度，货架整体起光晕 → 成了白板（用户截图里的爆白）。
   改：阈值 1.60、强度 .30、分辨率 0.6；店内点光 17→13、招牌灯带 emissive 1.45→1.12。

顺带：`EffectComposer` 走自定义 RT，后处理链**不会**继承 canvas 的 `antialias`。测过 4x MSAA
（`samples:4`），2812×1606 下帧率从 48 掉到 27，故关掉；只有 `samples:0` 才跑得动。
反射贴图 768→512、`serve.mjs` 加 `Cache-Control: no-store`（避免浏览器拿旧 build）。

实测帧率（Intel Arc 核显，2812×1606 缓冲）：无 MSAA 48–50 fps，4x MSAA 27 fps。

## 还没做的
- `chatgpt.site` 上的线上版本仍是旧画面。发布只能在 Codex app 的线程
  `codex://threads/01a17e01-19ce-7921-8663-253fb0416375` 里触发（本机无远端仓库、站点需登录态）。
- 若要继续推：可试①给屋檐加体积光锥 ②玻璃水痕改成屏幕空间 ③交通灯/自动门节奏与雨声对拍。
