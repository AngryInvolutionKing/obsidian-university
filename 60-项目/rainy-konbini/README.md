# 雨宿り · 雨夜便利店

无人物、无界面控件的微缩雨夜街角。鼠标左键拖拽旋转，滚轮缩放，右键拖拽平移；触屏双指缩放。Home 复位视角。

网页包含持续降雨、屋檐滴水、玻璃水痕、地面波纹、动态反射、自动门周期性开合、招牌轻微闪烁与交通信号变化。所有依赖打包在本地，无需外部 CDN。

## 本地运行

```bash
npm install
npm run build
npm run dev
```

打开 http://127.0.0.1:4173 。

## Blender 工程

`rainy-konbini.blend` 为同一套场景几何的可编辑工程，贴图已打包。使用 Blender 5.2.3 LTS 生成；包含摄像机、分组模型、雨线与自动门关键帧，`rainy-konbini.png` 为 Cycles 渲染预览。网页的实时材质和反射采用 Three.js，和 Blender 渲染略有差异。

重新导出几何使用 `node export-model.mjs`，然后运行 `blender --background --python build-blender.py`。
