---
title: "飞特舵机调试软件"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# 飞特舵机调试软件

配 ID、改参数、拉滑杆看舵机转 —— **就这两个文件，解压就能用，Windows。**

| 文件 | 干什么 | 版本 | 大小 |
|---|---|---|---|
| [`FD1.9.8.5(250729).7z`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/FD1.9.8.5%28250729%29.7z) | **FD 调试软件**。配 ID、开过流过压保护、拉滑杆测舵机 | 1.9.8.5（2025-07-29），中英文可切换 | 167 KB |
| [`CH340_URT.rar`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/CH340_URT.rar) | **USB 转串口驱动**。**URT-2 用不上** —— 它是 CH343，Win10/11 自带驱动，插上就有 COM 口（实测 2026-09-12）。老款 URT-1 是 CH340，不认串口才装这个 | — | 224 KB |

## 装法

```
1  插 URT-2 → 设备管理器「端口」里出现 USB-Enhanced-SERIAL CH343 (COMx)，记下号
   没出现才装 CH340_URT.rar（那是给老款 URT-1 的）
2  解压 FD1.9.8.5(250729).7z → 直接运行，不用安装
3  FD 里选那个 COM 口 → 波特率 1000000 → 点「打开」→ 点「搜索」
```

搜到舵机就通了。**怎么飞线、怎么供电、配 ID、改哪些参数、ID 对照表** —— 全在 [[60-项目/Microduck/02-项目文档/调试记录#舵机配置--拿到货一步一步做|调试记录 · 舵机配置]]，一步一步。

## 来源与校验

从飞特官方 Gitee 仓库 [gitee.com/ftservo/fddebug](https://gitee.com/ftservo/fddebug) master 分支原样复制（2026-09-11），**MIT 许可**（[`LICENSE`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/LICENSE) 同目录）。

```
sha256
FD1.9.8.5(250729).7z   33b92ac03ff048238bb6455a96aec98e97f6c87a97903ac197406f6d937c7734
CH340_URT.rar          546aaf96a54647f7a3ddd7e21389d64be2d198926c6058d8b19ee90e9eea4e17
```

怀疑文件坏了就 `sha256sum` 一下对这两行。

**为什么放进仓库**：Gitee 有时要登录才能下、有时改目录结构，clone 下来的人不该再去找。MIT 允许原样分发。
**要更新**：去上面那个仓库拿新版，换文件、改这里的版本号和哈希、改 [[60-项目/Microduck/02-项目文档/NOTICE|NOTICE]] 里的版本。

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/05-工具与重现/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/tools/%E9%A3%9E%E7%89%B9/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/README.md)
