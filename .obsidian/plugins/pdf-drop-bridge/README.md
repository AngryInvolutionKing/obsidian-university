# PDF Drop Bridge（Obsidian 插件）

**一句话**：把 PDF 从 Windows 资源管理器拖进 Obsidian（默认拖到 Copilot 面板就行），它会自动
**复制进库 → 用本地 Miyo 提取正文 → 生成可读的 Markdown 笔记 → 把「读这条笔记」的提示语复制到剪贴板**。
于是「拖进来 → 粘贴 → 发送」就能让 Copilot / Claude / Codex 用很低的 token 读完整篇 PDF。

## 为什么需要它

Copilot 的聊天输入框只接受**库内文件**作为上下文（合法类型 `md/canvas/base/pdf`），从资源管理器拖进去的
文件它只认 `image/*`，PDF 会被**静默丢弃**。而 Copilot 不对外提供接口，直接改它的 `main.js` 又会被插件升级覆盖。
本插件不碰 Copilot 任何代码，只在外层 `document` 的捕获阶段接住「带文件的 drop」事件。

## 安装 / 启用

目录：`D:\学习笔记\大学\.obsidian\plugins\pdf-drop-bridge\`
（`manifest.json` + `main.js` + `bridge.js`）

在 Obsidian 里：**设置 → 第三方插件 → 已安装插件 → 启用 PDF Drop Bridge**（或重载界面后自动启用）。

## 用法

1. 从资源管理器把 `.pdf`（也支持 `.epub` / `.docx`）拖到 **Copilot 面板**上；
2. 顶部会弹提示：`已入库 → 正在提取正文`，几秒后变成 `正文 xx KB／n 页（miyo-cli）`；
3. 库内多了两个文件（默认 `40-Attachments/_imported/`）：
   - `<名字>.pdf`：原件副本（这样它就是「库内文件」，Copilot 的 `[[` 提及也能用）
   - `<名字>.md`：提取出的正文，frontmatter 记了 `source_pdf / pages / extractor / original_path`
4. 剪贴板里已有提示语（默认：`读一下这份 PDF 的提取正文：[[<名字>.md]]（原件 [[<名字>.pdf]]，n 页，提取工具 miyo-cli）`），
   到 Copilot 聊天框粘贴发送即可。

手动导入：命令面板 → **PDF Drop Bridge: 导入并解析 PDF（粘贴绝对路径）**。

## 设置项

| 设置 | 默认 | 说明 |
|---|---|---|
| 接住拖放的范围 | 仅 Copilot 面板 | 另一个选项是「整个库窗口」（文件列表除外，那里交给 Obsidian 原生导入） |
| 导入目录 | `40-Attachments/_imported` | 原件与提取笔记都放这里 |
| 生成提取笔记 | 开 | 关掉就只入库、不落正文 |
| 复制提示语 | 开 | 关掉则不碰剪贴板 |
| 提示语模板 | 见上 | 占位符 `{note} {pdf} {pages} {extractor}` |
| 提取后打开笔记 | 关 | 开了会切换当前笔记 |
| 单文件大小上限 | 200 MB | 超过就拒绝 |
| Miyo CLI / Python / pdfread | 空 = 默认路径 | 提取器路径 |

## 提取链路

1. `%LOCALAPPDATA%\Miyo\bin\miyo\miyo.exe parse <file> --json` → 取 JSON 的 `text`（顺带拿到 `page_count`、`pages_needing_ocr`）
2. 失败回退：`python C:\Users\zhang\.codex\tools\pdfread\pdfread.py text <file> --out <md> --no-pages`

> 中文控制台会乱码，所以正文只从 **JSON 字段**或**落盘文件**里读，绝不从 stdout 直接抓正文。

## 已知边界

- **扫描件 / 手写件**：Miyo 会报告 `pages_needing_ocr`；手写内容 OCR 无效（实测），需要 `pdfread render` 成图交给有视觉的模型。
- 拿不到磁盘路径时（老 Electron 且没有 `file.path`）：正文从拖入的字节流走临时文件，功能不受影响，只是 `original_path` 记空。
- 它**不**往 Copilot 的输入框里塞文字（Copilot 没有对外接口）——粘贴那一步是刻意保留的。

## 实现注意（改这个插件前先读）

- 插件里的 `require('./bridge.js')` **不解析相对路径**：Obsidian 会把相对路径交给 Electron 的 require，报
  `Plugin failure: pdf-drop-bridge | Error: Cannot find module './bridge.js'`，而且只在控制台留一行 `console.error`，
  `app.plugins.plugins[id]` 里看不到实例。所以 `bridge.js` 是在 `onload()` 里用**绝对路径**加载的（见 `loadBridge`）。
- `this.manifest.dir` 在 Obsidian 1.9 是**相对库根**的路径（`.obsidian\plugins\pdf-drop-bridge`），必须先用
  `this.app.vault.adapter.getBasePath()` 补成绝对路径，否则 require 会按 cwd 解析失败。
- 排查通道：`Obsidian.exe --remote-debugging-port=9222`，用 CDP 订阅 `Runtime.consoleAPICalled` / `Runtime.exceptionThrown`，
  `Plugin failure:` 那一行就是真因（脚本见 dsh 工作区 `.scratch\obs-console.mjs`）。
