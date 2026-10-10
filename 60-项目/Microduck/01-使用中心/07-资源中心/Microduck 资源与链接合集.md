---
title: "Microduck 资源与链接合集"
type: microduck-doc
tags:
  - Microduck
  - Microduck/使用中心
---
# Microduck 资源与链接合集

集中收录官方上游仓库、CAD 图纸、硬件调试、模型策略、采购和社区资源。

# Microduck 资源中心

把主仓库、三个上游仓库、在线资源和本地工具集中到同一入口。分类 Word 可直接阅读，完整链接总表用于快速检索，CSV 用于 Excel 筛选或后续脚本处理。

## 分类导航

| **分类** | **收录数** | **Word 入口** | **内容** |
| --- | --- | --- | --- |
| 官方仓库与源码 | 16 | [[60-项目/Microduck/01-使用中心/07-资源中心/01-官方仓库与源码|01-官方仓库与源码.docx]] | Pollen Robotics 官方源码、HAT 工程、运行时、训练栈和本仓库本地副本。 |
| CAD、图纸与打印 | 11 | [[60-项目/Microduck/01-使用中心/07-资源中心/02-CAD图纸与打印|02-CAD图纸与打印.docx]] | 可编辑 CAD、整机与部件 STL、装配图、三维打印工程和在线打印入口。 |
| 硬件、电控与调试 | 18 | [[60-项目/Microduck/01-使用中心/07-资源中心/03-硬件电控与调试|03-硬件电控与调试.docx]] | 主控、舵机、总线、ToF、开发板系统、调试软件和硬件参考文档。 |
| 模型、策略与仿真 | 5 | [[60-项目/Microduck/01-使用中心/07-资源中心/04-模型策略与仿真|04-模型策略与仿真.docx]] | 官方与社区的 ONNX 策略、网页模拟器、训练环境、可视化与数据集。 |
| 采购资源 | 52 | [[60-项目/Microduck/01-使用中心/07-资源中心/05-采购资源|05-采购资源.docx]] | 电控和机械采购清单中的国内商城链接，价格与库存是 2026-09 快照。 |
| 社区与第三方项目 | 29 | [[60-项目/Microduck/01-使用中心/07-资源中心/06-社区与第三方项目|06-社区与第三方项目.docx]] | 第三方复刻、训练工具、跟踪项目、MCP、历史镜像和社区动态。 |
| 文档与参考资料 | 1 | [[60-项目/Microduck/01-使用中心/07-资源中心/07-文档与参考资料|07-文档与参考资料.docx]] | 官方手册、器件资料和未归入以上分类的补充资源。 |

## 本地仓库与工具

上游源码和工程已经保存在 `microduck-replica` 中，资源中心使用快捷方式引用原目录，不重复复制约 64 MB 的第三方仓库，避免版本分叉。

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方运行时源码](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/01-%E5%AE%98%E6%96%B9%E8%BF%90%E8%A1%8C%E6%97%B6%E6%BA%90%E7%A0%81.lnk) | Rust 板载运行时的本地完整副本，可直接查看控制环、设备路径、摄像头、ToF 和更新器 | 本地资源 |
| [官方强化学习训练仓库](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/02-%E5%AE%98%E6%96%B9%E8%AE%AD%E7%BB%83%E4%BB%93%E5%BA%93.lnk) | 本地完整副本，包含 MJCF、STL、训练环境、策略和仿真资产 | 本地资源 |
| [官方 HAT 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/03-%E5%AE%98%E6%96%B9HAT%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 本地完整副本，包含 KiCad、Gerber、BOM、贴片坐标和 STEP | 本地资源 |
| [本项目机械采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E6%9C%BA%E6%A2%B0%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 轴承、紧固件、热熔螺母、压头和打印材料的采购快照 | 本地资源 |
| [本项目电控采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%B5%E6%8E%A7%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 主控、摄像头、ToF、电源、PCB 和线材的采购快照 | 本地资源 |
| [项目生态导航](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%9F%E6%80%81%E5%AF%BC%E8%88%AA.docx) | 官方仓库、HuggingFace、社区项目的原始分类索引 | 本地资源 |
| [可编辑 CAD 与装配 STL](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/04-%E5%8F%AF%E7%BC%96%E8%BE%91CAD%E4%B8%8E%E8%A3%85%E9%85%8DSTL.lnk) | 包含整机装配体和 15 个部件 STL，适合查看装配关系和导入 CAD | 本地资源 |
| [可打印零件目录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/05-%E5%8F%AF%E6%89%93%E5%8D%B0%E9%9B%B6%E4%BB%B6%E7%9B%AE%E5%BD%95.lnk) | 30 种 / 41 件结构件和无需打印标准件的 STL，切片时从这里选单件 | 本地资源 |
| [装配图与爆炸图](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/06-%E8%A3%85%E9%85%8D%E5%9B%BE%E4%B8%8E%E7%88%86%E7%82%B8%E5%9B%BE.lnk) | 7 张装配图与爆炸图，用于理解零件顺序和相对位置 | 本地资源 |
| [imu_to_dxl 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/07-imu_to_dxl%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 原理图、PCB、STEP、接线表、立创工程和评审说明 | 本地资源 |
| [飞特 FD 调试工具](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/08-%E9%A3%9E%E7%89%B9FD%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.lnk) | FD 1.9.8.5、CH340 驱动、许可证和来源说明，适合舵机调试 | 本地资源 |
| [本地 STL 查看器](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/09-%E6%9C%AC%E5%9C%B0STL%E6%9F%A5%E7%9C%8B%E5%99%A8.lnk) | 无需安装 CAD，浏览器中拖入 STL 即可旋转、平移、缩放并查看包围盒尺寸 | 本地资源 |
| [Microduck 硬件图集 PDF](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/10-Microduck%E7%A1%AC%E4%BB%B6%E5%9B%BE%E9%9B%86.lnk) | 7 张 A3 硬件图，标记主控、HAT、IMU、ToF、摄像头和电源的位置 | 本地资源 |
| [完整 BOM](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/BOM.docx) | 整机物料清单、选型依据、替代件和采购注意事项 | 本地资源 |
| [舵机调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx) | XL330 与飞特舵机配置、FD 软件、总线和调零记录 | 本地资源 |

## 使用建议

- 查官方实现：从“官方仓库与源码”进入，优先读本地 [`upstream`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream) 副本。

- 改机械结构：使用 SolidWorks 打开 CAD 仓库源文件；整机 STL 只用于查看和测量。

- 打印零件：从本地 [`print`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print) 目录选择单件 STL，不用整机装配体直接切片。

- 调舵机：先使用本地 [`tools/飞特`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9)，再参考飞特在线文档和调试记录。

- 训练策略：从 `microduck_rl`、官方 ONNX 策略和社区训练项目开始。

资源清单生成日期：2026-09-20。

# 官方仓库与源码

Pollen Robotics 官方源码、HAT 工程、运行时、训练栈和本仓库本地副本。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 硬件源码

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [elec_RPI_Robot_HAT 官方硬件工程](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) | 官方完全开源的 HAT 板工程，包含 KiCad、Gerber、BOM、贴片坐标、STEP 和器件手册 | BOM.en.md、BOM.md、NOTICE.md、PROGRESS.md、README.en.md、README.md、docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件入门.md、docs/硬件方案逆向.md、docs/硬件规格速查.md、docs/社区动态.md、hardware/imu_to_dxl/README.md、microduck.ps1、scripts/fetch_upstream.sh |
| [Pollen lib_KiCAD 元件库](https://github.com/pollen-robotics/lib_KiCAD) | 官方 KiCad 符号、封装和 3D 模型库，打开 HAT 工程前需要先安装 | BOM.en.md、BOM.md、docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md |

## 执行器参考

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Pollen Amazing Hand](https://github.com/pollen-robotics/AmazingHand) | 使用 SCS0009 舵机的开源机械手项目，与 Microduck 执行器选型相关 | docs/actuator-selection.en.md、docs/执行器选型.md |

## 核心源码

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [microduck 官方运行时](https://github.com/pollen-robotics/microduck) | 板载 Rust 运行时。控制环、更新器、BLE、摄像头、ToF、语音以及硬件设备路径和寄存器都在这里 | NOTICE.md、docs/ecosystem.en.md、docs/不打HAT.md、docs/生态导航.md、microduck.ps1、scripts/fetch_upstream.sh |
| [microduck_rl 官方训练仓库](https://github.com/pollen-robotics/microduck_rl) | 官方强化学习训练环境，包含完整 MJCF、47 个 STL、训练配置和策略相关代码 | NOTICE.md、README.en.md、README.md、docs/ecosystem.en.md、docs/生态导航.md、microduck.ps1、scripts/fetch_upstream.sh |

## 配套软件

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [microduck-gst-plugins](https://github.com/pollen-robotics/microduck-gst-plugins) | 面向 aarch64 的 GStreamer 插件，提供 Rockchip 硬件编码和 WebRTC 能力 | docs/ecosystem.en.md、docs/生态导航.md |
| [rustypot Dynamixel 通信库](https://github.com/pollen-robotics/rustypot) | Pollen 使用的 Rust Dynamixel 通信库，运行时通过它控制 XL330 舵机 | docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md、docs/硬件规格速查.md |

## 部署脚本

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方开发板 provision 脚本](https://raw.githubusercontent.com/pollen-robotics/microduck/main/scripts/provision.sh) | 官方 Radxa Zero 3W 系统初始化脚本原始地址，部署开发板时参考 | docs/不打HAT.md |

## 硬件缺口追踪

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方 Issue #173：3D 打印源文件](https://github.com/pollen-robotics/microduck/issues/173) | 社区要求官方公开可编辑的 3D 打印源文件，官方当时回复没有 | docs/硬件规格速查.md、docs/社区动态.md |
| [官方 Issue #174：电池充电与电源板原理图](https://github.com/pollen-robotics/microduck/issues/174) | 追踪原位充电方案和电源板原理图是否开源，是硬件复刻的未决问题 | docs/硬件规格速查.md、docs/社区动态.md |
| [官方 Issue #175：STEP 文件](https://github.com/pollen-robotics/microduck/issues/175) | 社区要求提供 STEP 模型，避免 STL 曲面出现多边形块；官方当时回复没有 | docs/硬件规格速查.md、docs/社区动态.md |

## 本仓库

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [microduck-replica 本项目主仓库](https://github.com/fanhao375/microduck-replica) | 第三方复刻研究仓库，包含硬件逆向、装配图、CAD、打印件、采购文档和本地工具 | PROGRESS.md |

## 官方入口

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Pollen Robotics Microduck 官方产品页](https://pollen-robotics.com/microduck/) | 官方产品定位、规格、价格和发布信息，是核对复刻目标的第一入口 | README.en.md、README.md |

## 本地上游仓库

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方 HAT 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/03-%E5%AE%98%E6%96%B9HAT%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 本地完整副本，包含 KiCad、Gerber、BOM、贴片坐标和 STEP | 本地资源 |
| [官方强化学习训练仓库](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/02-%E5%AE%98%E6%96%B9%E8%AE%AD%E7%BB%83%E4%BB%93%E5%BA%93.lnk) | 本地完整副本，包含 MJCF、STL、训练环境、策略和仿真资产 | 本地资源 |
| [官方运行时源码](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/01-%E5%AE%98%E6%96%B9%E8%BF%90%E8%A1%8C%E6%97%B6%E6%BA%90%E7%A0%81.lnk) | Rust 板载运行时的本地完整副本，可直接查看控制环、设备路径、摄像头、ToF 和更新器 | 本地资源 |

# CAD、图纸与打印

可编辑 CAD、整机与部件 STL、装配图、三维打印工程和在线打印入口。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 在线打印

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [拓竹 MakerWorld 一键打印](https://makerworld.com.cn/zh/models/2963569-microduck#profileId-3478428) | 已经排盘的 Microduck 飞特版打印工程，可直接在 Bambu Studio 中切片 | README.en.md、README.md、cad/README.md、print/README.md、构建日志.md |

## 三维打印

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Bambu Studio 排盘工程](https://github.com/fanhao375/microduck-replica-cad/tree/master/打印) | 包含 5 盘已经排好的打印工程，可以下载 3MF 后直接切片 | README.en.md、README.md、cad/README.md、print/README.md |

## 可编辑 CAD

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [CAD 图纸 v1.1：原版 XL330](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) | 原版 XL330 路线的可编辑 CAD 版本，适合与官方尺寸和结构对照 | README.en.md、README.md |
| [CAD 图纸 v2.0：飞特 HD-1910](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.0) | 飞特 HD-1910 路线的可编辑 CAD 版本，文件带 -FT 后缀，建议用 SolidWorks 打开 | README.en.md、README.md |
| [microduck-replica-cad 可编辑图纸](https://github.com/fanhao375/microduck-replica-cad) | 飞特 HD-1910 版本的可编辑 CAD 图纸仓库，安装 SolidWorks 后优先使用这里修改结构 | NOTICE.md、README.en.md、README.md、cad/README.md、docs/HD-1910训练前数据清单.md、构建日志.md |

## 装配资料

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Microduck 装配安装说明书](https://github.com/fanhao375/microduck-replica-cad/blob/master/安装说明书/microduck装配安装说明书.pdf) | 21 页装配说明书 PDF，按步骤说明零件顺序、方向和紧固关系 | cad/README.md |

## 📐 Want editable parametric models? Different repo

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [机械行者Robo](https://github.com/fanhao375/microduck-replica-cad#图纸作者机械行者Robo) | 📐 Want editable parametric models? Different repo；> 机械行者Robo | README.en.md、README.md |

## 本地目录

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [可打印零件目录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/05-%E5%8F%AF%E6%89%93%E5%8D%B0%E9%9B%B6%E4%BB%B6%E7%9B%AE%E5%BD%95.lnk) | 30 种 / 41 件结构件和无需打印标准件的 STL，切片时从这里选单件 | 本地资源 |
| [可编辑 CAD 与装配 STL](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/04-%E5%8F%AF%E7%BC%96%E8%BE%91CAD%E4%B8%8E%E8%A3%85%E9%85%8DSTL.lnk) | 包含整机装配体和 15 个部件 STL，适合查看装配关系和导入 CAD | 本地资源 |
| [装配图与爆炸图](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/06-%E8%A3%85%E9%85%8D%E5%9B%BE%E4%B8%8E%E7%88%86%E7%82%B8%E5%9B%BE.lnk) | 7 张装配图与爆炸图，用于理解零件顺序和相对位置 | 本地资源 |

## 本地工具

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [本地 STL 查看器](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/09-%E6%9C%AC%E5%9C%B0STL%E6%9F%A5%E7%9C%8B%E5%99%A8.lnk) | 无需安装 CAD，浏览器中拖入 STL 即可旋转、平移、缩放并查看包围盒尺寸 | 本地资源 |

# 硬件、电控与调试

主控、舵机、总线、ToF、开发板系统、调试软件和硬件参考文档。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 舵机资料

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Robotis XL330-M288 手册](https://emanual.robotis.com/docs/en/dxl/x/xl330-m288/) | XL330 舵机规格、控制表、电气参数和通信说明 | BOM.en.md、BOM.md、docs/actuator-selection.en.md、docs/执行器选型.md |
| [Unitree J288/S288 舵机手册](https://www.unitree.com/images/%E6%97%A0%E5%88%B7%E6%95%B0%E5%AD%97%E8%88%B5%E6%9C%BAJ288S288%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pdf) | Unitree 无刷数字舵机的 11 页使用手册，用于执行器选型对照 | docs/执行器选型.md |
| [Unitree 数字舵机产品页](https://www.unitree.com/cn/DigitalServo/) | Unitree 数字舵机规格与型号入口，用于和 XL330、HD-1910 做选型对照 | docs/actuator-selection.en.md、docs/执行器选型.md |

## IMU 驱动

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [LSM6DSV16X 传感器融合示例](https://github.com/STMicroelectronics/STMems_Standard_C_drivers/blob/master/lsm6dsv16x_STdC/examples/lsm6dsv16x_sensor_fusion.c) | ST 官方 SFLP 初始化示例，包含 FIFO、融合率和量程配置顺序 | BOM.md |
| [ST LSM6DSV16X PID 驱动](https://github.com/STMicroelectronics/lsm6dsv16x-pid) | ST 官方 IMU 驱动和传感器融合示例，imu_to_dxl 固件开发参考 | BOM.md |

## 系统与开发板

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Armbian 自动配置文档](https://docs.armbian.com/user-guide/autoconfig/) | Radxa Zero 3W 系统 overlay、设备树和板级自动配置的官方参考 | docs/不打HAT.md |
| [Radxa Zero 3W Armbian 镜像](https://mirrors.bfsu.edu.cn/armbian-releases/radxa-zero3/archive/Armbian_26.8.1_Radxa-zero3_trixie_vendor_6.1.115_minimal.img.xz) | 面向 Radxa Zero 3W 的 Armbian 最小系统镜像，用于主控首次点亮和部署 | docs/不打HAT.md |
| [泰山派资料下载中心](https://openkits-wiki.easyeda.com/zh-hans/tspi-rk3566/download-center.html) | RK3566 开发板原理图、系统镜像、工具和板级资料下载 | docs/电控采购清单.md |
| [立创泰山派开源硬件工程](https://oshwhub.com/li-chuang-kai-fa-ban/li-chuang-tai-shan-pai-kai-fa-ban) | RK3566 开发板的完整原理图和 PCB，可参考电源树、DDR 布线和外设连接 | docs/电控采购清单.md |

## 飞特调试

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [飞特 FD 调试软件](https://gitee.com/ftservo/fddebug) | 飞特官方 FD 调试工具与 CH340 驱动来源，本仓库已在 tools/飞特 中保存副本 | NOTICE.md、tools/飞特/README.md、调试记录.md |
| [飞特 Gitee 代码仓库组](https://gitee.com/ftservo) | 飞特舵机例程、通信协议、内存表和工具仓库的集中入口 | 调试记录.md |
| [飞特入手教程 PDF](https://www.feetech.cn/Data/feetechrc/upload/file/20220618/%E5%85%88%E7%9C%8B%E8%BF%99%E9%87%8C-%E5%85%A5%E6%89%8B%E6%95%99%E7%A8%8B2-1.pdf) | 飞特舵机的连接、调试和基础使用教程，适合第一次上手时阅读 | 调试记录.md |
| [飞特在线文档](http://doc.feetech.cn) | 飞特总线舵机通信协议、寄存器、内存表和型号资料入口 | docs/硬件方案逆向.md、hardware/imu_to_dxl/imu_to_dxl-接线表.md |
| [飞特官网软件下载页](https://www.feetech.cn/software.html) | 飞特软件下载入口，可获取 FD 调试工具及更新版本 | 调试记录.md |

## 本地目录

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [imu_to_dxl 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/07-imu_to_dxl%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 原理图、PCB、STEP、接线表、立创工程和评审说明 | 本地资源 |

## 本地工具

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [飞特 FD 调试工具](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/08-%E9%A3%9E%E7%89%B9FD%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.lnk) | FD 1.9.8.5、CH340 驱动、许可证和来源说明，适合舵机调试 | 本地资源 |

## 本地资料

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Microduck 硬件图集 PDF](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/10-Microduck%E7%A1%AC%E4%BB%B6%E5%9B%BE%E9%9B%86.lnk) | 7 张 A3 硬件图，标记主控、HAT、IMU、ToF、摄像头和电源的位置 | 本地资源 |

## 本地文档

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [舵机调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx) | XL330 与飞特舵机配置、FD 软件、总线和调零记录 | 本地资源 |

# 模型、策略与仿真

官方与社区的 ONNX 策略、网页模拟器、训练环境、可视化与数据集。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 模拟器

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方网页模拟器](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) | 无需安装即可在浏览器中操作 Microduck 的官方仿真演示 | docs/ecosystem.en.md、docs/生态导航.md |

## 可视化

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Microduck Anatomy 结构可视化](https://huggingface.co/spaces/mishig/microduck-anatomy) | 社区制作的结构解剖网页，用于查看机器人各部件关系 | docs/ecosystem.en.md、docs/生态导航.md |

## 策略模型

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Flamingo Cycle 单脚站立策略](https://huggingface.co/RemiFabre/microduck-flamingo-cycle) | Rémi 发布的单脚站立循环策略，适合研究动作和策略结构 | docs/ecosystem.en.md、docs/生态导航.md |
| [官方 9 个 ONNX 策略](https://huggingface.co/pollen-robotics/microduck-policies) | 官方发布的运动策略模型。原版硬件可直接使用，改硬件后需要重新训练和适配 | docs/ecosystem.en.md、docs/生态导航.md |

## 数据集

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [楼梯挑战数据集](https://huggingface.co/datasets/craigm26/microduck-stairs-challenge) | 社区爬楼梯任务的数据集，用于训练和评测楼梯运动策略 | docs/ecosystem.en.md、docs/生态导航.md |

# 采购资源

电控和机械采购清单中的国内商城链接，价格与库存是 2026-09 快照。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 一、轴承（共 14 个，两种规格）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 539024647147](https://item.taobao.com/item.htm?id=539024647147) | 店铺：NBZH 永天轴承（16年老店）；说明：不锈钢超薄壁 ET2216ZZ / MR16224 / SET2216 / DDA2216，16×22×4；价格：¥2.2 | docs/机械采购清单.md |
| [taobao 670727787832](https://item.taobao.com/item.htm?id=670727787832) | 店铺：鑫燚轴承（7年老店）；说明：NSK 微型轴承，同一链接同时有 10×15×3 和 16×22×4；价格：¥5 | docs/机械采购清单.md |

## 螺丝套装

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 842110292995](https://item.taobao.com/item.htm?id=842110292995) | 店铺：广州信邦电子（10年老店，包邮）；说明：600 pcs 盒装不锈钢 沉/平头内六角 M2/M2.5/M3 组合，送扳手；价格：¥26.8；销量：42 | docs/机械采购清单.md |
| [taobao 842400332284](https://item.taobao.com/item.htm?id=842400332284) | 店铺：宏顺通五金工厂店（8年老店）；说明：600 pcs M2/M2.5/M3 沉头内六角 + 螺母 + 送工具；价格：¥23；销量：2 | docs/机械采购清单.md |
| [taobao 888186264852](https://item.taobao.com/item.htm?id=888186264852) | 店铺：广州信邦电子（10年老店，包邮）；说明：304 不锈钢 M2–M8 盘头内六角 + 螺母 + 垫片套装；价格：¥19.8；销量：71 | docs/机械采购清单.md |

## 热熔螺母 + 压头

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 1000673642588](https://item.taobao.com/item.htm?id=1000673642588) | 店铺：深圳市榕誉微电子（6年老店）；说明：400 PCS M2 + M3 热熔铜螺母，双通道滚花；价格：¥22；销量：200+ | docs/机械采购清单.md |
| [taobao 902798112263](https://item.taobao.com/item.htm?id=902798112263) | 店铺：烙铁工具（7年老店）；说明：3D 热熔螺母压头套件 M2–M8，适用 936 / T12 / T65；价格：¥13；销量：800+ | docs/机械采购清单.md |
| [taobao 922318148975](https://item.taobao.com/item.htm?id=922318148975) | 店铺：深圳市榕誉微电子（6年老店）；说明：80/220 PCS M2–M6 热熔铜螺母；价格：¥18；销量：1000+ | docs/机械采购清单.md |
| [taobao 966212633086](https://item.taobao.com/item.htm?id=966212633086) | 店铺：外茂优品（包邮）；说明：同类 M2–M8 压头套件；价格：¥11.5；销量：200+ | docs/机械采购清单.md |
| [tmall 809364062256](https://detail.tmall.com/item.htm?id=809364062256) | 店铺：天卓五金官方旗舰店（包邮）；说明：土八热熔螺母 M1–M8，按规格散买；价格：¥0.77 起；销量：4万+ | docs/机械采购清单.md |

## 螺纹胶（金属对金属螺丝位防松）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 663963768247](https://item.taobao.com/item.htm?id=663963768247) | 店铺：LOCTITE 乐泰企业店；说明：243 / 263 螺纹锁固剂；价格：¥18.4；销量：700+ | docs/机械采购清单.md |
| [taobao 925965306702](https://item.taobao.com/item.htm?id=925965306702) | 店铺：工业胶厂家直销（包邮）；说明：乐泰 243 / 242 / 263；价格：¥16.8；销量：600+ | docs/机械采购清单.md |
| [tmall 653848839737](https://detail.tmall.com/item.htm?id=653848839737) | 店铺：LOCTITE 乐泰旗舰店；说明：汉高乐泰 243 中强度可拆卸螺纹锁固剂；价格：¥19.11；销量：1万+ | docs/机械采购清单.md |

## 渠道 —— 国内电商价格全线虚高

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [ALLNET China](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w) | 官方分销商 ALLNET China 实价（USD，约 ¥7.2/$）： | docs/电控采购清单.md |
| [mcuzone 杭州野芯科技店](https://item.taobao.com/item.htm?id=1055301489376) | mcuzone 杭州野芯科技店（做了整套 Zero 3W 扩展板，大概率有裸板货源） | docs/电控采购清单.md |
| [taobao 1044607515575](https://item.taobao.com/item.htm?id=1044607515575) | 店铺：鹭控自动化工控；配置：未注明（议价）；价格：¥690 | docs/电控采购清单.md |
| [tmall 752703346347](https://detail.tmall.com/item.htm?id=752703346347) | 店铺：findboard旗舰店；配置：8G+64G「套餐6」（含摄像头/电源/32G卡/HDMI线/散热）；价格：¥1469 | docs/电控采购清单.md |

## 套餐别买

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [¥19.99](https://item.taobao.com/item.htm?id=788387010174) | microHDMI 线 ｜ ❌ Microduck 跑 headless；配件：散热片 | docs/电控采购清单.md |

## 二、主控备选 · 立创·泰山派（评估过，塞不进去）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [item.szlcsc.com/20558171](https://item.szlcsc.com/20558171.html) | 渠道：立创商城官方；配置：2G+16G；实价：¥580（原 ¥228，DDR 涨价上调） | docs/电控采购清单.md |
| [taobao 1017038620459](https://item.taobao.com/item.htm?id=1017038620459) | 渠道：RK开发板（9年老店）；配置：2G+16G 单主板；实价：¥428（+¥10 运费） | docs/电控采购清单.md |
| [taobao 800894187326](https://item.taobao.com/item.htm?id=800894187326) | 渠道：电子元件shop（12年老店，46付款）；配置：2G+16G 单板；实价：¥480.8（免运费） | docs/电控采购清单.md |

## 三、摄像头 · IMX219（MIPI CSI）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 596521821696](https://item.taobao.com/item.htm?id=596521821696) | 店铺：盛成威科技（11年老店）；价格：¥38；销量：84 | docs/电控采购清单.md |
| [taobao 709927597121](https://item.taobao.com/item.htm?id=709927597121) | 店铺：亚博智能（14年老店，有技术文档）；价格：¥44；销量：15 | docs/电控采购清单.md |
| [taobao 760446989892](https://item.taobao.com/item.htm?id=760446989892) | 店铺：树莓派零售商（包邮，48h发）；价格：¥68；销量：100+ | docs/电控采购清单.md |
| [taobao 771618094322](https://item.taobao.com/item.htm?id=771618094322) | 店铺：德创信摄像头；价格：¥32.8；销量：27 | docs/电控采购清单.md |
| [tmall 775872575316](https://detail.tmall.com/item.htm?id=775872575316) | 店铺：DECXIN旗舰店；价格：¥32.8；销量：100+ | docs/电控采购清单.md |
| [tmall 874789708454](https://detail.tmall.com/item.htm?id=874789708454) | 店铺：findboard旗舰店（瑞莎官方版）；价格：¥129.99；销量：9 | docs/电控采购清单.md |

## 排线：15 针 ⇄ 22 针转接（可能需要，买最短的）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 654755002992](https://item.taobao.com/item.htm?id=654755002992) | 店铺：汇博视捷科技工厂店；说明：15转22Pin 金手指 FPC，4 cm 短版；长度：4cm；价格：¥1.88 | docs/电控采购清单.md |
| [taobao 678057486394](https://item.taobao.com/item.htm?id=678057486394) | 店铺：Tytion（15年老店）；说明：标题明确写 15P 1.0 转 22P 0.5；长度：15cm；价格：¥2.5 | docs/电控采购清单.md |
| [taobao 784739658496](https://item.taobao.com/item.htm?id=784739658496) | 店铺：树莓派精品销售商（13年老店，包邮）；说明：官方线，135/200/300/500 mm 可选；长度：多档；价格：¥5.8 | docs/电控采购清单.md |
| [taobao 819560127110](https://item.taobao.com/item.htm?id=819560127110) | 店铺：摄像头生产厂家（11年老店）；说明：Pi Zero Camera Cable；长度：16cm；价格：¥1.88 | docs/电控采购清单.md |

## 四、ToF 测距 · VL53L8CX（8×8 多区）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 1025775539663](https://item.taobao.com/item.htm?id=1025775539663) | 店铺：森科源电子；型号：VL53L8CX；价格：¥70；销量：1 | docs/电控采购清单.md |
| [taobao 939165242465](https://item.taobao.com/item.htm?id=939165242465) | 店铺：勇泰发电子（11年老店，包邮）；型号：VL53L8CX；价格：¥84.8；销量：14 | docs/电控采购清单.md |
| [taobao 942554129061](https://item.taobao.com/item.htm?id=942554129061) | 店铺：都会明武电子（包邮，回头客2万）；型号：VL53L7CX / L8CX；价格：¥75；销量：100+ | docs/电控采购清单.md |
| [taobao 967946231167](https://item.taobao.com/item.htm?id=967946231167) | 店铺：深圳优信电子（技术文档，包邮，对公）；型号：VL53L8CX；价格：¥78.5；销量：31 | docs/电控采购清单.md |
| [taobao 977907234039](https://item.taobao.com/item.htm?id=977907234039) | 店铺：深圳市渱雯电子；型号：VL53L8CX；价格：¥74.98；销量：0 | docs/电控采购清单.md |
| [tmall 725486284128](https://detail.tmall.com/item.htm?id=725486284128) | 店铺：归吉星旗舰店；型号：ST 官方 P-NUCLEO-53L8A1 评估套件；价格：¥98；销量：1 | docs/电控采购清单.md |

## 五、电源

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [tmall 658975825526](https://detail.tmall.com/item.htm?id=658975825526) | 件：NP-F 电池仓（取电用）；店铺：腾壶旗舰店；价格：¥17.8；销量：99 | docs/电控采购清单.md |
| [tmall 926961598924](https://detail.tmall.com/item.htm?id=926961598924) | 件：NP-F 供电扣板（Type-C 快充）；店铺：拓普赛旗舰店；价格：¥19；销量：58 | docs/电控采购清单.md |

## RPI Robot HAT —— 买不到，只能打样；但你不一定需要它

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 1005305041207](https://item.taobao.com/item.htm?id=1005305041207) | 店铺：Fashion脖子（13年老店，90付款）；说明：串口总线舵机驱动板，适用 ST/SC 系列；价格：¥22 | docs/电控采购清单.md |
| [taobao 570100064201](https://item.taobao.com/item.htm?id=570100064201) | 店铺：众灵科技企业店（200+付款）；说明：ZLink USB/TTL 调试板 + 总线舵机转接；价格：¥22.5 | docs/电控采购清单.md |
| [taobao 954634564409](https://item.taobao.com/item.htm?id=954634564409) | 店铺：芯板坊（7年老店）；说明：微雪 串口总线舵机驱动板，适用 ST/SC；价格：¥24 | docs/电控采购清单.md |
| [taobao 983866781632](https://item.taobao.com/item.htm?id=983866781632) | 店铺：灵影智能企业店（200+付款）；说明：ST/SC 飞特总线舵机 TTL 驱动板 TTL_Adapter_(A)；价格：¥26 | docs/电控采购清单.md |

## 七、线材与工具

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [taobao 575365901461](https://item.taobao.com/item.htm?id=575365901461) | 件：URT-2 调试板；店铺：深圳飞特舵机厂家；说明：同类；价格：¥45 | docs/电控采购清单.md |
| [taobao 587191439333](https://item.taobao.com/item.htm?id=587191439333) | 件：舵机连接线（多长度）；店铺：松甲科技（300+付款）；说明：母对母 5264-3P，10/15/20/30/50/70 cm；价格：¥2 | docs/电控采购清单.md |
| [taobao 603181554943](https://item.taobao.com/item.htm?id=603181554943) | 件：FE-URT-1 调试板；店铺：深圳飞特舵机工厂店（官方店）；说明：USB 转 485/TTL；价格：¥45 | docs/电控采购清单.md |
| [taobao 616460581906](https://item.taobao.com/item.htm?id=616460581906) | 件：舵机总线连接线；店铺：深圳飞特舵机工厂店；说明：三针四针 5264 接口；价格：¥1.8 | docs/电控采购清单.md |
| [taobao 712781832610](https://item.taobao.com/item.htm?id=712781832610) | 件：URT 调试板（第三方）；店铺：云驱者科技企业店；说明：同类；价格：¥40 | docs/电控采购清单.md |
| [taobao 769633088382](https://item.taobao.com/item.htm?id=769633088382) | 件：舵机线材；店铺：鸿翊电子舵机工厂店；说明：飞特串口总线，3针/4针 5264 端子；价格：¥2.5 | docs/电控采购清单.md |

## 本地文档

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [完整 BOM](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/BOM.docx) | 整机物料清单、选型依据、替代件和采购注意事项 | 本地资源 |
| [本项目机械采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E6%9C%BA%E6%A2%B0%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 轴承、紧固件、热熔螺母、压头和打印材料的采购快照 | 本地资源 |
| [本项目电控采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%B5%E6%8E%A7%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 主控、摄像头、ToF、电源、PCB 和线材的采购快照 | 本地资源 |

# 社区与第三方项目

第三方复刻、训练工具、跟踪项目、MCP、历史镜像和社区动态。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 1. BAM 单舵机摆锤辨识

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [BAM](https://github.com/Rhoban/bam) | 四条轨迹（sin_time_square / lift_and_drop / up_and_down / sin_sin）是 BAM 工具的标准激励。官方 XL330 用 BAM M6 模型，参数（【逆向】microduck_constants.py）：kp_fw=200、vin_range=(6.5, 8.2)、vin_min=6.0、delay 3–6 步 | docs/HD-1910训练前数据清单.md、docs/actuator-selection.en.md、docs/执行器选型.md |

## How the model number was pinned down

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@Allyakutaku](https://x.com/Allyakutaku/status/2095331280233926948) | @Allyakutaku reported identifying the | docs/actuator-selection.en.md、docs/执行器选型.md |

## 结论：没有中间路线

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Open Duck Mini v2](https://github.com/apirrone/Open_Duck_Mini) | 保 XL330 ｜ 机械件可直接用本仓库导出的 CAD，官方策略直接跑。舵机成本约 ¥4500；路线：换 STS3215 | docs/actuator-selection.en.md、docs/执行器选型.md |

## 工具与框架

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [duckkit](https://github.com/craigm26/duckkit) | 纯 Swift 实现的策略和运动学实验项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-mcp](https://github.com/aj-dev-smith/microduck-mcp) | 通过 MCP 客户端驱动 Microduck 模拟器的社区项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [quackd 自然语言控制](https://github.com/rokbenko/quackd) | 用自然语言指挥 Microduck 或 Open Duck Mini 的社区项目 | docs/ecosystem.en.md、docs/生态导航.md |

## 训练与仿真

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [isaaclab-microduck](https://github.com/kabilankb/isaaclab-microduck) | 基于 Isaac Lab 3.0 和 Newton MJWarp 的仿真环境 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-lab](https://github.com/jonathanhawkins/microduck-lab) | 在普通 Mac 上训练强化学习策略的社区项目，不要求 CUDA | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-playground](https://github.com/Vottivott/microduck-playground) | 可复现的强化学习实验、策略和仿真资产 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-rl-genesis](https://github.com/Macmachi/microduck-rl-genesis) | Genesis 移植版，可在 AMD 显卡上训练 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-tracking](https://github.com/AlexBodner/microduck-tracking) | Microduck 多目标跟踪实验项目 | docs/ecosystem.en.md、docs/生态导航.md |

## 资料索引

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [awesome-microduck](https://github.com/joeynyc/awesome-microduck) | 社区维护的 Microduck 英文资源列表 | docs/ecosystem.en.md、docs/生态导航.md |

## 复刻与硬件

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Microban 对照项目](https://github.com/Rhoban/microban) | 不是 Microduck，但使用同一块 HAT；公开 BOM 和装配指南适合采购对照 | docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md |
| [microduck-3d](https://github.com/boris721/microduck-3d) | 从上游整理的 STL 和 MJCF 资源 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-diy](https://github.com/ScrapMeta/microduck-diy) | 中文社区的一个月手搓挑战记录 | docs/ecosystem.en.md、docs/生态导航.md |
| [MicroDuckModels](https://github.com/IronSpiderMan/MicroDuckModels) | 中文社区制作的三维网页查看器，按运动学层级浏览模型 | docs/ecosystem.en.md、docs/生态导航.md |
| [open-microduck](https://github.com/SaberOnGo/open-microduck) | 中英双语硬件文档项目，目前没有完整 PCB 文件 | docs/ecosystem.en.md、docs/生态导航.md |

## 历史资料

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [原型机运行时公开镜像](https://github.com/TommyZihao/microduck_runtime) | 原型机运行时的历史镜像，保留了 BNO055 等早期硬件线索 | docs/ecosystem.en.md、docs/生态导航.md |

## Microduck Replica

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@tspy](https://x.com/tspy/status/2094249218735300630) | > ✅ Independently verified. On 2026-08-31, @tspy | README.en.md、docs/硬件规格速查.md、docs/社区动态.md |

## 官方发布推

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@ClementDelangue](https://x.com/ClementDelangue/status/2092931447644442635) | 点赞：11,974；浏览：449 万 | docs/社区动态.md |
| [@pollenrobotics](https://x.com/pollenrobotics/status/2092915032052879425) | 点赞：4,761；浏览：156 万 | docs/社区动态.md |
| [@Thom_Wolf](https://x.com/Thom_Wolf/status/2092923071829049592) | 点赞：7,833；浏览：256 万 | docs/社区动态.md |

## 销售

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@DataChaz](https://x.com/DataChaz/status/2094028777634533518) | - 🔴 「7 小时销售额破 100 万美元」—— 来自 @DataChaz（826 赞） | docs/社区动态.md |

## 四、社区已做出的东西（发布 4 天内）

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@cdngdev](https://x.com/cdngdev/status/2093721082582933639) | 内容：训练它玩「500 万根干草里找一根针」的游戏；反响：852 ♥ | docs/社区动态.md |
| [@onusoz](https://x.com/onusoz/status/2093763495846441348) | 内容：训练 130 万参数小 LLM 输出情绪标签，再用 Rust 合成器程序化生成 R2D2 风格音效，跑在浏览器里；反响：543 ♥ | docs/社区动态.md |
| [@Rhodium](https://x.com/__Rhodium__/status/2093404140454265205) | 内容：训练霹雳舞；反响：610 ♥ | docs/社区动态.md |
| [@Thom_Wolf](https://x.com/Thom_Wolf/status/2092959363992326236) | 内容：vibe-code 了图像检测集成，让机器人追踪激光笔；反响：3,065 ♥ | docs/社区动态.md |

## 🔴 「Microdino」—— 不建议接触

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@davidfeldt](https://x.com/davidfeldt/status/2093491570867884322) | X 上 @davidfeldt 声称做了 | docs/社区动态.md |

## 项目协作

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [本项目 Issue 入口](https://github.com/fanhao375/microduck-replica/issues) | 报告文档、图纸或复刻过程中的问题，也可查看现有讨论和修正记录 | README.en.md、README.md、hardware/imu_to_dxl/README.md |

# 文档与参考资料

官方手册、器件资料和未归入以上分类的补充资源。

外部链接来自项目原始文档，收录日期为 2026-09-20。价格、销量、星数和链接有效性可能变化。

## 本地文档

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [项目生态导航](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%9F%E6%80%81%E5%AF%BC%E8%88%AA.docx) | 官方仓库、HuggingFace、社区项目的原始分类索引 | 本地资源 |

# Microduck 完整资源链接总表

本表覆盖主仓库自有文档中的外部链接和资源中心收录的本地资源。每行第一列是可点击入口，CSV 中包含原始网址，方便批量筛选。

## 官方仓库与源码

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [官方 HAT 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/03-%E5%AE%98%E6%96%B9HAT%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 本地完整副本，包含 KiCad、Gerber、BOM、贴片坐标和 STEP | 本地资源 |
| [官方强化学习训练仓库](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/02-%E5%AE%98%E6%96%B9%E8%AE%AD%E7%BB%83%E4%BB%93%E5%BA%93.lnk) | 本地完整副本，包含 MJCF、STL、训练环境、策略和仿真资产 | 本地资源 |
| [官方运行时源码](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/01-%E5%AE%98%E6%96%B9%E8%BF%90%E8%A1%8C%E6%97%B6%E6%BA%90%E7%A0%81.lnk) | Rust 板载运行时的本地完整副本，可直接查看控制环、设备路径、摄像头、ToF 和更新器 | 本地资源 |
| [elec_RPI_Robot_HAT 官方硬件工程](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) | 官方完全开源的 HAT 板工程，包含 KiCad、Gerber、BOM、贴片坐标、STEP 和器件手册 | BOM.en.md、BOM.md、NOTICE.md、PROGRESS.md、README.en.md、README.md、docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件入门.md、docs/硬件方案逆向.md、docs/硬件规格速查.md、docs/社区动态.md、hardware/imu_to_dxl/README.md、microduck.ps1、scripts/fetch_upstream.sh |
| [microduck 官方运行时](https://github.com/pollen-robotics/microduck) | 板载 Rust 运行时。控制环、更新器、BLE、摄像头、ToF、语音以及硬件设备路径和寄存器都在这里 | NOTICE.md、docs/ecosystem.en.md、docs/不打HAT.md、docs/生态导航.md、microduck.ps1、scripts/fetch_upstream.sh |
| [microduck-gst-plugins](https://github.com/pollen-robotics/microduck-gst-plugins) | 面向 aarch64 的 GStreamer 插件，提供 Rockchip 硬件编码和 WebRTC 能力 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-replica 本项目主仓库](https://github.com/fanhao375/microduck-replica) | 第三方复刻研究仓库，包含硬件逆向、装配图、CAD、打印件、采购文档和本地工具 | PROGRESS.md |
| [microduck_rl 官方训练仓库](https://github.com/pollen-robotics/microduck_rl) | 官方强化学习训练环境，包含完整 MJCF、47 个 STL、训练配置和策略相关代码 | NOTICE.md、README.en.md、README.md、docs/ecosystem.en.md、docs/生态导航.md、microduck.ps1、scripts/fetch_upstream.sh |
| [Pollen Amazing Hand](https://github.com/pollen-robotics/AmazingHand) | 使用 SCS0009 舵机的开源机械手项目，与 Microduck 执行器选型相关 | docs/actuator-selection.en.md、docs/执行器选型.md |
| [Pollen lib_KiCAD 元件库](https://github.com/pollen-robotics/lib_KiCAD) | 官方 KiCad 符号、封装和 3D 模型库，打开 HAT 工程前需要先安装 | BOM.en.md、BOM.md、docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md |
| [Pollen Robotics Microduck 官方产品页](https://pollen-robotics.com/microduck/) | 官方产品定位、规格、价格和发布信息，是核对复刻目标的第一入口 | README.en.md、README.md |
| [rustypot Dynamixel 通信库](https://github.com/pollen-robotics/rustypot) | Pollen 使用的 Rust Dynamixel 通信库，运行时通过它控制 XL330 舵机 | docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md、docs/硬件规格速查.md |
| [官方 Issue #173：3D 打印源文件](https://github.com/pollen-robotics/microduck/issues/173) | 社区要求官方公开可编辑的 3D 打印源文件，官方当时回复没有 | docs/硬件规格速查.md、docs/社区动态.md |
| [官方 Issue #174：电池充电与电源板原理图](https://github.com/pollen-robotics/microduck/issues/174) | 追踪原位充电方案和电源板原理图是否开源，是硬件复刻的未决问题 | docs/硬件规格速查.md、docs/社区动态.md |
| [官方 Issue #175：STEP 文件](https://github.com/pollen-robotics/microduck/issues/175) | 社区要求提供 STEP 模型，避免 STL 曲面出现多边形块；官方当时回复没有 | docs/硬件规格速查.md、docs/社区动态.md |
| [官方开发板 provision 脚本](https://raw.githubusercontent.com/pollen-robotics/microduck/main/scripts/provision.sh) | 官方 Radxa Zero 3W 系统初始化脚本原始地址，部署开发板时参考 | docs/不打HAT.md |

## CAD、图纸与打印

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [可打印零件目录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/05-%E5%8F%AF%E6%89%93%E5%8D%B0%E9%9B%B6%E4%BB%B6%E7%9B%AE%E5%BD%95.lnk) | 30 种 / 41 件结构件和无需打印标准件的 STL，切片时从这里选单件 | 本地资源 |
| [可编辑 CAD 与装配 STL](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/04-%E5%8F%AF%E7%BC%96%E8%BE%91CAD%E4%B8%8E%E8%A3%85%E9%85%8DSTL.lnk) | 包含整机装配体和 15 个部件 STL，适合查看装配关系和导入 CAD | 本地资源 |
| [本地 STL 查看器](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/09-%E6%9C%AC%E5%9C%B0STL%E6%9F%A5%E7%9C%8B%E5%99%A8.lnk) | 无需安装 CAD，浏览器中拖入 STL 即可旋转、平移、缩放并查看包围盒尺寸 | 本地资源 |
| [装配图与爆炸图](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/06-%E8%A3%85%E9%85%8D%E5%9B%BE%E4%B8%8E%E7%88%86%E7%82%B8%E5%9B%BE.lnk) | 7 张装配图与爆炸图，用于理解零件顺序和相对位置 | 本地资源 |
| [Bambu Studio 排盘工程](https://github.com/fanhao375/microduck-replica-cad/tree/master/打印) | 包含 5 盘已经排好的打印工程，可以下载 3MF 后直接切片 | README.en.md、README.md、cad/README.md、print/README.md |
| [CAD 图纸 v1.1：原版 XL330](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) | 原版 XL330 路线的可编辑 CAD 版本，适合与官方尺寸和结构对照 | README.en.md、README.md |
| [CAD 图纸 v2.0：飞特 HD-1910](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.0) | 飞特 HD-1910 路线的可编辑 CAD 版本，文件带 -FT 后缀，建议用 SolidWorks 打开 | README.en.md、README.md |
| [Microduck 装配安装说明书](https://github.com/fanhao375/microduck-replica-cad/blob/master/安装说明书/microduck装配安装说明书.pdf) | 21 页装配说明书 PDF，按步骤说明零件顺序、方向和紧固关系 | cad/README.md |
| [microduck-replica-cad 可编辑图纸](https://github.com/fanhao375/microduck-replica-cad) | 飞特 HD-1910 版本的可编辑 CAD 图纸仓库，安装 SolidWorks 后优先使用这里修改结构 | NOTICE.md、README.en.md、README.md、cad/README.md、docs/HD-1910训练前数据清单.md、构建日志.md |
| [拓竹 MakerWorld 一键打印](https://makerworld.com.cn/zh/models/2963569-microduck#profileId-3478428) | 已经排盘的 Microduck 飞特版打印工程，可直接在 Bambu Studio 中切片 | README.en.md、README.md、cad/README.md、print/README.md、构建日志.md |
| [机械行者Robo](https://github.com/fanhao375/microduck-replica-cad#图纸作者机械行者Robo) | 📐 Want editable parametric models? Different repo；> 机械行者Robo | README.en.md、README.md |

## 硬件、电控与调试

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [imu_to_dxl 硬件工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/07-imu_to_dxl%E7%A1%AC%E4%BB%B6%E5%B7%A5%E7%A8%8B.lnk) | 原理图、PCB、STEP、接线表、立创工程和评审说明 | 本地资源 |
| [Microduck 硬件图集 PDF](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/10-Microduck%E7%A1%AC%E4%BB%B6%E5%9B%BE%E9%9B%86.lnk) | 7 张 A3 硬件图，标记主控、HAT、IMU、ToF、摄像头和电源的位置 | 本地资源 |
| [舵机调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx) | XL330 与飞特舵机配置、FD 软件、总线和调零记录 | 本地资源 |
| [飞特 FD 调试工具](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/08-%E9%A3%9E%E7%89%B9FD%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.lnk) | FD 1.9.8.5、CH340 驱动、许可证和来源说明，适合舵机调试 | 本地资源 |
| [Armbian 自动配置文档](https://docs.armbian.com/user-guide/autoconfig/) | Radxa Zero 3W 系统 overlay、设备树和板级自动配置的官方参考 | docs/不打HAT.md |
| [LSM6DSV16X 传感器融合示例](https://github.com/STMicroelectronics/STMems_Standard_C_drivers/blob/master/lsm6dsv16x_STdC/examples/lsm6dsv16x_sensor_fusion.c) | ST 官方 SFLP 初始化示例，包含 FIFO、融合率和量程配置顺序 | BOM.md |
| [Radxa Zero 3W Armbian 镜像](https://mirrors.bfsu.edu.cn/armbian-releases/radxa-zero3/archive/Armbian_26.8.1_Radxa-zero3_trixie_vendor_6.1.115_minimal.img.xz) | 面向 Radxa Zero 3W 的 Armbian 最小系统镜像，用于主控首次点亮和部署 | docs/不打HAT.md |
| [Robotis XL330-M288 手册](https://emanual.robotis.com/docs/en/dxl/x/xl330-m288/) | XL330 舵机规格、控制表、电气参数和通信说明 | BOM.en.md、BOM.md、docs/actuator-selection.en.md、docs/执行器选型.md |
| [ST LSM6DSV16X PID 驱动](https://github.com/STMicroelectronics/lsm6dsv16x-pid) | ST 官方 IMU 驱动和传感器融合示例，imu_to_dxl 固件开发参考 | BOM.md |
| [Unitree J288/S288 舵机手册](https://www.unitree.com/images/%E6%97%A0%E5%88%B7%E6%95%B0%E5%AD%97%E8%88%B5%E6%9C%BAJ288S288%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pdf) | Unitree 无刷数字舵机的 11 页使用手册，用于执行器选型对照 | docs/执行器选型.md |
| [Unitree 数字舵机产品页](https://www.unitree.com/cn/DigitalServo/) | Unitree 数字舵机规格与型号入口，用于和 XL330、HD-1910 做选型对照 | docs/actuator-selection.en.md、docs/执行器选型.md |
| [泰山派资料下载中心](https://openkits-wiki.easyeda.com/zh-hans/tspi-rk3566/download-center.html) | RK3566 开发板原理图、系统镜像、工具和板级资料下载 | docs/电控采购清单.md |
| [立创泰山派开源硬件工程](https://oshwhub.com/li-chuang-kai-fa-ban/li-chuang-tai-shan-pai-kai-fa-ban) | RK3566 开发板的完整原理图和 PCB，可参考电源树、DDR 布线和外设连接 | docs/电控采购清单.md |
| [飞特 FD 调试软件](https://gitee.com/ftservo/fddebug) | 飞特官方 FD 调试工具与 CH340 驱动来源，本仓库已在 tools/飞特 中保存副本 | NOTICE.md、tools/飞特/README.md、调试记录.md |
| [飞特 Gitee 代码仓库组](https://gitee.com/ftservo) | 飞特舵机例程、通信协议、内存表和工具仓库的集中入口 | 调试记录.md |
| [飞特入手教程 PDF](https://www.feetech.cn/Data/feetechrc/upload/file/20220618/%E5%85%88%E7%9C%8B%E8%BF%99%E9%87%8C-%E5%85%A5%E6%89%8B%E6%95%99%E7%A8%8B2-1.pdf) | 飞特舵机的连接、调试和基础使用教程，适合第一次上手时阅读 | 调试记录.md |
| [飞特在线文档](http://doc.feetech.cn) | 飞特总线舵机通信协议、寄存器、内存表和型号资料入口 | docs/硬件方案逆向.md、hardware/imu_to_dxl/imu_to_dxl-接线表.md |
| [飞特官网软件下载页](https://www.feetech.cn/software.html) | 飞特软件下载入口，可获取 FD 调试工具及更新版本 | 调试记录.md |

## 模型、策略与仿真

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [Flamingo Cycle 单脚站立策略](https://huggingface.co/RemiFabre/microduck-flamingo-cycle) | Rémi 发布的单脚站立循环策略，适合研究动作和策略结构 | docs/ecosystem.en.md、docs/生态导航.md |
| [Microduck Anatomy 结构可视化](https://huggingface.co/spaces/mishig/microduck-anatomy) | 社区制作的结构解剖网页，用于查看机器人各部件关系 | docs/ecosystem.en.md、docs/生态导航.md |
| [官方 9 个 ONNX 策略](https://huggingface.co/pollen-robotics/microduck-policies) | 官方发布的运动策略模型。原版硬件可直接使用，改硬件后需要重新训练和适配 | docs/ecosystem.en.md、docs/生态导航.md |
| [官方网页模拟器](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) | 无需安装即可在浏览器中操作 Microduck 的官方仿真演示 | docs/ecosystem.en.md、docs/生态导航.md |
| [楼梯挑战数据集](https://huggingface.co/datasets/craigm26/microduck-stairs-challenge) | 社区爬楼梯任务的数据集，用于训练和评测楼梯运动策略 | docs/ecosystem.en.md、docs/生态导航.md |

## 采购资源

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [完整 BOM](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/BOM.docx) | 整机物料清单、选型依据、替代件和采购注意事项 | 本地资源 |
| [本项目机械采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E6%9C%BA%E6%A2%B0%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 轴承、紧固件、热熔螺母、压头和打印材料的采购快照 | 本地资源 |
| [本项目电控采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%B5%E6%8E%A7%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx) | 主控、摄像头、ToF、电源、PCB 和线材的采购快照 | 本地资源 |
| [ALLNET China](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w) | 官方分销商 ALLNET China 实价（USD，约 ¥7.2/$）： | docs/电控采购清单.md |
| [item.szlcsc.com/20558171](https://item.szlcsc.com/20558171.html) | 渠道：立创商城官方；配置：2G+16G；实价：¥580（原 ¥228，DDR 涨价上调） | docs/电控采购清单.md |
| [mcuzone 杭州野芯科技店](https://item.taobao.com/item.htm?id=1055301489376) | mcuzone 杭州野芯科技店（做了整套 Zero 3W 扩展板，大概率有裸板货源） | docs/电控采购清单.md |
| [taobao 1000673642588](https://item.taobao.com/item.htm?id=1000673642588) | 店铺：深圳市榕誉微电子（6年老店）；说明：400 PCS M2 + M3 热熔铜螺母，双通道滚花；价格：¥22；销量：200+ | docs/机械采购清单.md |
| [taobao 1005305041207](https://item.taobao.com/item.htm?id=1005305041207) | 店铺：Fashion脖子（13年老店，90付款）；说明：串口总线舵机驱动板，适用 ST/SC 系列；价格：¥22 | docs/电控采购清单.md |
| [taobao 1017038620459](https://item.taobao.com/item.htm?id=1017038620459) | 渠道：RK开发板（9年老店）；配置：2G+16G 单主板；实价：¥428（+¥10 运费） | docs/电控采购清单.md |
| [taobao 1025775539663](https://item.taobao.com/item.htm?id=1025775539663) | 店铺：森科源电子；型号：VL53L8CX；价格：¥70；销量：1 | docs/电控采购清单.md |
| [taobao 1044607515575](https://item.taobao.com/item.htm?id=1044607515575) | 店铺：鹭控自动化工控；配置：未注明（议价）；价格：¥690 | docs/电控采购清单.md |
| [taobao 539024647147](https://item.taobao.com/item.htm?id=539024647147) | 店铺：NBZH 永天轴承（16年老店）；说明：不锈钢超薄壁 ET2216ZZ / MR16224 / SET2216 / DDA2216，16×22×4；价格：¥2.2 | docs/机械采购清单.md |
| [taobao 570100064201](https://item.taobao.com/item.htm?id=570100064201) | 店铺：众灵科技企业店（200+付款）；说明：ZLink USB/TTL 调试板 + 总线舵机转接；价格：¥22.5 | docs/电控采购清单.md |
| [taobao 575365901461](https://item.taobao.com/item.htm?id=575365901461) | 件：URT-2 调试板；店铺：深圳飞特舵机厂家；说明：同类；价格：¥45 | docs/电控采购清单.md |
| [taobao 587191439333](https://item.taobao.com/item.htm?id=587191439333) | 件：舵机连接线（多长度）；店铺：松甲科技（300+付款）；说明：母对母 5264-3P，10/15/20/30/50/70 cm；价格：¥2 | docs/电控采购清单.md |
| [taobao 596521821696](https://item.taobao.com/item.htm?id=596521821696) | 店铺：盛成威科技（11年老店）；价格：¥38；销量：84 | docs/电控采购清单.md |
| [taobao 603181554943](https://item.taobao.com/item.htm?id=603181554943) | 件：FE-URT-1 调试板；店铺：深圳飞特舵机工厂店（官方店）；说明：USB 转 485/TTL；价格：¥45 | docs/电控采购清单.md |
| [taobao 616460581906](https://item.taobao.com/item.htm?id=616460581906) | 件：舵机总线连接线；店铺：深圳飞特舵机工厂店；说明：三针四针 5264 接口；价格：¥1.8 | docs/电控采购清单.md |
| [taobao 654755002992](https://item.taobao.com/item.htm?id=654755002992) | 店铺：汇博视捷科技工厂店；说明：15转22Pin 金手指 FPC，4 cm 短版；长度：4cm；价格：¥1.88 | docs/电控采购清单.md |
| [taobao 663963768247](https://item.taobao.com/item.htm?id=663963768247) | 店铺：LOCTITE 乐泰企业店；说明：243 / 263 螺纹锁固剂；价格：¥18.4；销量：700+ | docs/机械采购清单.md |
| [taobao 670727787832](https://item.taobao.com/item.htm?id=670727787832) | 店铺：鑫燚轴承（7年老店）；说明：NSK 微型轴承，同一链接同时有 10×15×3 和 16×22×4；价格：¥5 | docs/机械采购清单.md |
| [taobao 678057486394](https://item.taobao.com/item.htm?id=678057486394) | 店铺：Tytion（15年老店）；说明：标题明确写 15P 1.0 转 22P 0.5；长度：15cm；价格：¥2.5 | docs/电控采购清单.md |
| [taobao 709927597121](https://item.taobao.com/item.htm?id=709927597121) | 店铺：亚博智能（14年老店，有技术文档）；价格：¥44；销量：15 | docs/电控采购清单.md |
| [taobao 712781832610](https://item.taobao.com/item.htm?id=712781832610) | 件：URT 调试板（第三方）；店铺：云驱者科技企业店；说明：同类；价格：¥40 | docs/电控采购清单.md |
| [taobao 760446989892](https://item.taobao.com/item.htm?id=760446989892) | 店铺：树莓派零售商（包邮，48h发）；价格：¥68；销量：100+ | docs/电控采购清单.md |
| [taobao 769633088382](https://item.taobao.com/item.htm?id=769633088382) | 件：舵机线材；店铺：鸿翊电子舵机工厂店；说明：飞特串口总线，3针/4针 5264 端子；价格：¥2.5 | docs/电控采购清单.md |
| [taobao 771618094322](https://item.taobao.com/item.htm?id=771618094322) | 店铺：德创信摄像头；价格：¥32.8；销量：27 | docs/电控采购清单.md |
| [taobao 784739658496](https://item.taobao.com/item.htm?id=784739658496) | 店铺：树莓派精品销售商（13年老店，包邮）；说明：官方线，135/200/300/500 mm 可选；长度：多档；价格：¥5.8 | docs/电控采购清单.md |
| [taobao 800894187326](https://item.taobao.com/item.htm?id=800894187326) | 渠道：电子元件shop（12年老店，46付款）；配置：2G+16G 单板；实价：¥480.8（免运费） | docs/电控采购清单.md |
| [taobao 819560127110](https://item.taobao.com/item.htm?id=819560127110) | 店铺：摄像头生产厂家（11年老店）；说明：Pi Zero Camera Cable；长度：16cm；价格：¥1.88 | docs/电控采购清单.md |
| [taobao 842110292995](https://item.taobao.com/item.htm?id=842110292995) | 店铺：广州信邦电子（10年老店，包邮）；说明：600 pcs 盒装不锈钢 沉/平头内六角 M2/M2.5/M3 组合，送扳手；价格：¥26.8；销量：42 | docs/机械采购清单.md |
| [taobao 842400332284](https://item.taobao.com/item.htm?id=842400332284) | 店铺：宏顺通五金工厂店（8年老店）；说明：600 pcs M2/M2.5/M3 沉头内六角 + 螺母 + 送工具；价格：¥23；销量：2 | docs/机械采购清单.md |
| [taobao 888186264852](https://item.taobao.com/item.htm?id=888186264852) | 店铺：广州信邦电子（10年老店，包邮）；说明：304 不锈钢 M2–M8 盘头内六角 + 螺母 + 垫片套装；价格：¥19.8；销量：71 | docs/机械采购清单.md |
| [taobao 902798112263](https://item.taobao.com/item.htm?id=902798112263) | 店铺：烙铁工具（7年老店）；说明：3D 热熔螺母压头套件 M2–M8，适用 936 / T12 / T65；价格：¥13；销量：800+ | docs/机械采购清单.md |
| [taobao 922318148975](https://item.taobao.com/item.htm?id=922318148975) | 店铺：深圳市榕誉微电子（6年老店）；说明：80/220 PCS M2–M6 热熔铜螺母；价格：¥18；销量：1000+ | docs/机械采购清单.md |
| [taobao 925965306702](https://item.taobao.com/item.htm?id=925965306702) | 店铺：工业胶厂家直销（包邮）；说明：乐泰 243 / 242 / 263；价格：¥16.8；销量：600+ | docs/机械采购清单.md |
| [taobao 939165242465](https://item.taobao.com/item.htm?id=939165242465) | 店铺：勇泰发电子（11年老店，包邮）；型号：VL53L8CX；价格：¥84.8；销量：14 | docs/电控采购清单.md |
| [taobao 942554129061](https://item.taobao.com/item.htm?id=942554129061) | 店铺：都会明武电子（包邮，回头客2万）；型号：VL53L7CX / L8CX；价格：¥75；销量：100+ | docs/电控采购清单.md |
| [taobao 954634564409](https://item.taobao.com/item.htm?id=954634564409) | 店铺：芯板坊（7年老店）；说明：微雪 串口总线舵机驱动板，适用 ST/SC；价格：¥24 | docs/电控采购清单.md |
| [taobao 966212633086](https://item.taobao.com/item.htm?id=966212633086) | 店铺：外茂优品（包邮）；说明：同类 M2–M8 压头套件；价格：¥11.5；销量：200+ | docs/机械采购清单.md |
| [taobao 967946231167](https://item.taobao.com/item.htm?id=967946231167) | 店铺：深圳优信电子（技术文档，包邮，对公）；型号：VL53L8CX；价格：¥78.5；销量：31 | docs/电控采购清单.md |
| [taobao 977907234039](https://item.taobao.com/item.htm?id=977907234039) | 店铺：深圳市渱雯电子；型号：VL53L8CX；价格：¥74.98；销量：0 | docs/电控采购清单.md |
| [taobao 983866781632](https://item.taobao.com/item.htm?id=983866781632) | 店铺：灵影智能企业店（200+付款）；说明：ST/SC 飞特总线舵机 TTL 驱动板 TTL_Adapter_(A)；价格：¥26 | docs/电控采购清单.md |
| [tmall 653848839737](https://detail.tmall.com/item.htm?id=653848839737) | 店铺：LOCTITE 乐泰旗舰店；说明：汉高乐泰 243 中强度可拆卸螺纹锁固剂；价格：¥19.11；销量：1万+ | docs/机械采购清单.md |
| [tmall 658975825526](https://detail.tmall.com/item.htm?id=658975825526) | 件：NP-F 电池仓（取电用）；店铺：腾壶旗舰店；价格：¥17.8；销量：99 | docs/电控采购清单.md |
| [tmall 725486284128](https://detail.tmall.com/item.htm?id=725486284128) | 店铺：归吉星旗舰店；型号：ST 官方 P-NUCLEO-53L8A1 评估套件；价格：¥98；销量：1 | docs/电控采购清单.md |
| [tmall 752703346347](https://detail.tmall.com/item.htm?id=752703346347) | 店铺：findboard旗舰店；配置：8G+64G「套餐6」（含摄像头/电源/32G卡/HDMI线/散热）；价格：¥1469 | docs/电控采购清单.md |
| [tmall 775872575316](https://detail.tmall.com/item.htm?id=775872575316) | 店铺：DECXIN旗舰店；价格：¥32.8；销量：100+ | docs/电控采购清单.md |
| [tmall 809364062256](https://detail.tmall.com/item.htm?id=809364062256) | 店铺：天卓五金官方旗舰店（包邮）；说明：土八热熔螺母 M1–M8，按规格散买；价格：¥0.77 起；销量：4万+ | docs/机械采购清单.md |
| [tmall 874789708454](https://detail.tmall.com/item.htm?id=874789708454) | 店铺：findboard旗舰店（瑞莎官方版）；价格：¥129.99；销量：9 | docs/电控采购清单.md |
| [tmall 926961598924](https://detail.tmall.com/item.htm?id=926961598924) | 件：NP-F 供电扣板（Type-C 快充）；店铺：拓普赛旗舰店；价格：¥19；销量：58 | docs/电控采购清单.md |
| [¥19.99](https://item.taobao.com/item.htm?id=788387010174) | microHDMI 线 ｜ ❌ Microduck 跑 headless；配件：散热片 | docs/电控采购清单.md |

## 社区与第三方项目

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [@Allyakutaku](https://x.com/Allyakutaku/status/2095331280233926948) | @Allyakutaku reported identifying the | docs/actuator-selection.en.md、docs/执行器选型.md |
| [@cdngdev](https://x.com/cdngdev/status/2093721082582933639) | 内容：训练它玩「500 万根干草里找一根针」的游戏；反响：852 ♥ | docs/社区动态.md |
| [@ClementDelangue](https://x.com/ClementDelangue/status/2092931447644442635) | 点赞：11,974；浏览：449 万 | docs/社区动态.md |
| [@DataChaz](https://x.com/DataChaz/status/2094028777634533518) | - 🔴 「7 小时销售额破 100 万美元」—— 来自 @DataChaz（826 赞） | docs/社区动态.md |
| [@davidfeldt](https://x.com/davidfeldt/status/2093491570867884322) | X 上 @davidfeldt 声称做了 | docs/社区动态.md |
| [@onusoz](https://x.com/onusoz/status/2093763495846441348) | 内容：训练 130 万参数小 LLM 输出情绪标签，再用 Rust 合成器程序化生成 R2D2 风格音效，跑在浏览器里；反响：543 ♥ | docs/社区动态.md |
| [@pollenrobotics](https://x.com/pollenrobotics/status/2092915032052879425) | 点赞：4,761；浏览：156 万 | docs/社区动态.md |
| [@Rhodium](https://x.com/__Rhodium__/status/2093404140454265205) | 内容：训练霹雳舞；反响：610 ♥ | docs/社区动态.md |
| [@Thom_Wolf](https://x.com/Thom_Wolf/status/2092923071829049592) | 点赞：7,833；浏览：256 万 | docs/社区动态.md |
| [@Thom_Wolf](https://x.com/Thom_Wolf/status/2092959363992326236) | 内容：vibe-code 了图像检测集成，让机器人追踪激光笔；反响：3,065 ♥ | docs/社区动态.md |
| [@tspy](https://x.com/tspy/status/2094249218735300630) | > ✅ Independently verified. On 2026-08-31, @tspy | README.en.md、docs/硬件规格速查.md、docs/社区动态.md |
| [awesome-microduck](https://github.com/joeynyc/awesome-microduck) | 社区维护的 Microduck 英文资源列表 | docs/ecosystem.en.md、docs/生态导航.md |
| [BAM](https://github.com/Rhoban/bam) | 四条轨迹（sin_time_square / lift_and_drop / up_and_down / sin_sin）是 BAM 工具的标准激励。官方 XL330 用 BAM M6 模型，参数（【逆向】microduck_constants.py）：kp_fw=200、vin_range=(6.5, 8.2)、vin_min=6.0、delay 3–6 步 | docs/HD-1910训练前数据清单.md、docs/actuator-selection.en.md、docs/执行器选型.md |
| [duckkit](https://github.com/craigm26/duckkit) | 纯 Swift 实现的策略和运动学实验项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [isaaclab-microduck](https://github.com/kabilankb/isaaclab-microduck) | 基于 Isaac Lab 3.0 和 Newton MJWarp 的仿真环境 | docs/ecosystem.en.md、docs/生态导航.md |
| [Microban 对照项目](https://github.com/Rhoban/microban) | 不是 Microduck，但使用同一块 HAT；公开 BOM 和装配指南适合采购对照 | docs/ecosystem.en.md、docs/hardware-teardown.en.md、docs/生态导航.md、docs/硬件方案逆向.md |
| [microduck-3d](https://github.com/boris721/microduck-3d) | 从上游整理的 STL 和 MJCF 资源 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-diy](https://github.com/ScrapMeta/microduck-diy) | 中文社区的一个月手搓挑战记录 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-lab](https://github.com/jonathanhawkins/microduck-lab) | 在普通 Mac 上训练强化学习策略的社区项目，不要求 CUDA | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-mcp](https://github.com/aj-dev-smith/microduck-mcp) | 通过 MCP 客户端驱动 Microduck 模拟器的社区项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-playground](https://github.com/Vottivott/microduck-playground) | 可复现的强化学习实验、策略和仿真资产 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-rl-genesis](https://github.com/Macmachi/microduck-rl-genesis) | Genesis 移植版，可在 AMD 显卡上训练 | docs/ecosystem.en.md、docs/生态导航.md |
| [microduck-tracking](https://github.com/AlexBodner/microduck-tracking) | Microduck 多目标跟踪实验项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [MicroDuckModels](https://github.com/IronSpiderMan/MicroDuckModels) | 中文社区制作的三维网页查看器，按运动学层级浏览模型 | docs/ecosystem.en.md、docs/生态导航.md |
| [Open Duck Mini v2](https://github.com/apirrone/Open_Duck_Mini) | 保 XL330 ｜ 机械件可直接用本仓库导出的 CAD，官方策略直接跑。舵机成本约 ¥4500；路线：换 STS3215 | docs/actuator-selection.en.md、docs/执行器选型.md |
| [open-microduck](https://github.com/SaberOnGo/open-microduck) | 中英双语硬件文档项目，目前没有完整 PCB 文件 | docs/ecosystem.en.md、docs/生态导航.md |
| [quackd 自然语言控制](https://github.com/rokbenko/quackd) | 用自然语言指挥 Microduck 或 Open Duck Mini 的社区项目 | docs/ecosystem.en.md、docs/生态导航.md |
| [原型机运行时公开镜像](https://github.com/TommyZihao/microduck_runtime) | 原型机运行时的历史镜像，保留了 BNO055 等早期硬件线索 | docs/ecosystem.en.md、docs/生态导航.md |
| [本项目 Issue 入口](https://github.com/fanhao375/microduck-replica/issues) | 报告文档、图纸或复刻过程中的问题，也可查看现有讨论和修正记录 | README.en.md、README.md、hardware/imu_to_dxl/README.md |

## 文档与参考资料

| **资源** | **介绍** | **来源** |
| --- | --- | --- |
| [项目生态导航](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%9F%E6%80%81%E5%AF%BC%E8%88%AA.docx) | 官方仓库、HuggingFace、社区项目的原始分类索引 | 本地资源 |

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/Microduck%20%E8%B5%84%E6%BA%90%E4%B8%8E%E9%93%BE%E6%8E%A5%E5%90%88%E9%9B%86.docx)
