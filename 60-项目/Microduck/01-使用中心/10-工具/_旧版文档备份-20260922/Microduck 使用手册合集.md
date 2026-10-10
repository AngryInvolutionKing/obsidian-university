---
title: "Microduck 使用手册合集"
type: microduck-doc
tags:
  - Microduck
  - Microduck/使用中心
---
# Microduck 使用手册合集

本手册按使用中心顺序收录全部教程和文件说明。

# Microduck 使用中心

这个文件夹是 Microduck 复刻项目的统一入口，不复制原仓库数据。所有图纸、代码、文档和脚本仍保存在：

```text
`C:\Users\zhang\Desktop\Microduck 使用中心\08-项目仓库\microduck-replica`
```

这样做的好处是只有一个数据源，使用中心里的快捷方式和教程不会和原仓库版本脱节。

## 先做一次路线选择

Microduck 有两条硬件路线，后面的打印件、舵机参数、软件和策略都会受影响：

| **路线** | **特点** | **适合情况** |
| --- | --- | --- |
| 原版 XL330 | 官方运行时和 ONNX 策略可直接复用；舵机贵、电压超出官方额定值 | 目标是尽量接近官方整机 |
| 飞特 HD-1910 | 成本更低、力矩更大；需要更换部分结构件、修改协议并重新训练策略 | 目标是可承担成本的实物复刻和二次开发 |

本仓库作者已经装出飞特版实物，并将飞特作为当前主线。第一次使用建议先读：

- [双路线对照](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/README.docx)

- [执行器选型](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E6%89%A7%E8%A1%8C%E5%99%A8%E9%80%89%E5%9E%8B.docx)

- [硬件入门](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%A1%AC%E4%BB%B6%E5%85%A5%E9%97%A8.docx)

## 总入口

| **快捷方式** | **用途** |
| --- | --- |
| `00-打开控制台.lnk` | 打开统一菜单，可查看资料和运行生成脚本 |
| `01-打开STL查看器.lnk` | 在浏览器里查看 STL，支持旋转、平移、缩放和尺寸显示 |
| `02-打开项目目录.lnk` | 打开原始仓库目录 |

终端里也可以在任何 PowerShell 或 CMD 窗口使用：

```text
`microduck``microduck status``microduck view``microduck render`
```

完整命令见 [快速使用](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E5%BF%AB%E9%80%9F%E4%BD%BF%E7%94%A8.docx)。

## 按任务找

| **你的任务** | **进入目录** |
| --- | --- |
| 看机器人长什么样、拆装关系、零件分组 | [`01-机械与模型`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/01-%E6%9C%BA%E6%A2%B0%E4%B8%8E%E6%A8%A1%E5%9E%8B) |
| 准备打印、采购机械件或电子件 | [`02-打印与采购`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/02-%E6%89%93%E5%8D%B0%E4%B8%8E%E9%87%87%E8%B4%AD) |
| 做舵机配置、电路、总线、PCB、台架调试 | [`03-电控与调试`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/03-%E7%94%B5%E6%8E%A7%E4%B8%8E%E8%B0%83%E8%AF%95) |
| 跑官方运行时、训练策略、改软件 | [`04-软件与算法`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/04-%E8%BD%AF%E4%BB%B6%E4%B8%8E%E7%AE%97%E6%B3%95) |
| 重新生成装配图、CAD、孔位分析 | [`05-工具与重现`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/05-%E5%B7%A5%E5%85%B7%E4%B8%8E%E9%87%8D%E7%8E%B0) |
| 看进度、踩坑和当前状态 | [`06-项目进度与排错`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/06-%E9%A1%B9%E7%9B%AE%E8%BF%9B%E5%BA%A6%E4%B8%8E%E6%8E%92%E9%94%99) |
| 查某个文件到底干什么 | [[60-项目/Microduck/01-使用中心/99-文件总表|文件总表]] |

## 使用顺序

**1. **先看装配图和整机 STL，建立整机印象。

**2. **再看 BOM 和打印清单，确认路线与预算。

**3. **看硬件入门，弄清五块电子模块。

**4. **按调试记录配舵机 ID、保护和零点。

**5. **最后进入官方运行时或训练仓库做软件开发。

## 当前状态

- 飞特 HD-1910 版整机已经装配完成。

- 15 颗舵机已经配置 ID 并装机。

- 台架总线联调仍在进行。

- `imu_to_dxl` PCB 已设计完成，但未完成实物验证。

- 仓库没有 `imu_to_dxl` 固件，固件需要按逆向协议自行实现。

## 许可边界

机械网格及相关衍生图纸受 `CC BY-NC-SA 4.0` 约束，不得用于商业产品。代码部分以各上游仓库许可证为准。

# 机械与模型：介绍与教程

这个分类解决三个问题：机器人是什么样、零件怎么安装、怎样在自己的 CAD 里打开。

## 文件介绍

| **文件或目录** | **内容** | **怎么用** |
| --- | --- | --- |
| `assembly-drawings/01` 至 `04` | 正面、侧面、背面、四分之三装配态 | 先建立整机外形和关节位置印象 |
| `assembly-drawings/05` 至 `06` | 侧面和立体爆炸图 | 看运动链、零件层级和左右镜像关系 |
| `assembly-drawings/07` | 分色对照装配态 | 和爆炸图配合确认每个颜色对应哪个部件 |
| [`cad/00_Microduck_整机装配体.stl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad/00_Microduck_%E6%95%B4%E6%9C%BA%E8%A3%85%E9%85%8D%E4%BD%93.stl) | 已应用世界变换的整机 STL | 用查看器或 CAD 直接打开 |
| `cad/01` 至 `15` | 按刚体分组的部件 STL | 查单个部件的几何和相对位置 |
| [`cad/零件对照表.json`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad/%E9%9B%B6%E4%BB%B6%E5%AF%B9%E7%85%A7%E8%A1%A8.json) | 每个部件由哪些上游网格组成 | 追溯零件来源和面数 |
| [`print/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print) | 可打印件和外购标准件模型 | 真正打印前转到 [`02-打印与采购`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/02-%E6%89%93%E5%8D%B0%E4%B8%8E%E9%87%87%E8%B4%AD) |

原仓库入口：

- [CAD 说明](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/cad/README.docx)

- [打印件说明](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/print/README.docx)

- [装配爆炸图目录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/06-%E8%A3%85%E9%85%8D%E5%9B%BE%E4%B8%8E%E7%88%86%E7%82%B8%E5%9B%BE.lnk)

## 教程一：最快看懂整机

**1. **双击 `00-打开控制台.lnk`。

**2. **选择 `1 Open STL viewer`，或直接双击 `01-打开STL查看器.lnk`。

**3. **把整机 STL 拖进浏览器窗口。

**4. **左键拖动旋转，右键拖动平移，滚轮缩放。

**5. **查看器会显示三角面数和包围盒尺寸；整机目标尺寸约为 `144.1 x 141.0 x 264.0 mm`。

## 教程二：按零件查看

**1. **先打开 `06_爆炸图_四分之三.png`，找到目标部件。

**2. **再到 `07_分色对照_装配态.png` 确认它在整机上的位置。

**3. **打开对应编号的 `cad/01` 至 `15` STL。

**4. **如果需要知道它由哪些原始网格拼成，查 [`cad/零件对照表.json`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad/%E9%9B%B6%E4%BB%B6%E5%AF%B9%E7%85%A7%E8%A1%A8.json)。

常用部件编号：

| **编号** | **部件** |
| --- | --- |
| 01 | 躯干主体 |
| 04-06 | 左大腿、左小腿、左踝脚 |
| 07-10 | 颈根、颈俯仰、头 yaw/roll、头部总成 |
| 13-15 | 右大腿、右小腿、右踝脚 |

## 教程三：进入可编辑 CAD 和装配说明书

本仓库的 STL 可以测量、装配和切片，但不能直接参数化修改。需要改尺寸、改壁厚或出工程图时，使用配套 SolidWorks 仓库：

- [microduck-replica-cad](https://github.com/fanhao375/microduck-replica-cad)

- [v2.0 飞特版图纸](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.0)

- [v1.1 原版图纸](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1)

配套仓库内含 16 个装配体、40 个零件和 21 页装配安装说明书。飞特版文件名带 `-FT` 后缀。

## 关键注意

- STL 来自仿真模型，外形和惯量可信，但不保证配合公差、螺纹、热熔螺母座和走线空间。

- 飞特 HD-1910 的舵盘是凸的，XL330 是凹的，不能直接照打原版配合件。

- 几何数据为非商用许可，做产品前先核对 [[60-项目/Microduck/02-项目文档/NOTICE|NOTICE]]。

# 打印与采购：介绍与教程

真正开始做实物时，先确定路线，再采购，最后打印。顺序反过来最容易买错。

## 先选路线

| **项目** | **原版 XL330** | **飞特 HD-1910** |
| --- | --- | --- |
| 舵机 | Dynamixel XL330-M288-T x15 | HD-1910-C001 x15 |
| 结构件 | 上游 STL 可直接参考 | 8 个舵盘配合件需要飞特版 |
| 电路 | HAT + `imu_to_dxl` | 同左，飞特连接器为 2.0 mm |
| 软件 | 官方运行时和策略可直接复用 | 要改协议并重新训练策略 |
| 当前实物状态 | 纸上分析和首批打印件 | 整机已装出，台架调试中 |

## 文件介绍

| **文件或目录** | **内容** |
| --- | --- |
| [[60-项目/Microduck/02-项目文档/BOM|BOM]] | 整机物料清单，含舵机、轴承、紧固件、PCB 器件和采购数量 |
| [`print/打印件/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%89%93%E5%8D%B0%E4%BB%B6) | 30 种、41 件步行结构件 |
| [`print/标准件-无需打印/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%A0%87%E5%87%86%E4%BB%B6-%E6%97%A0%E9%9C%80%E6%89%93%E5%8D%B0) | 舵机、轴承、电池、电路板等对位模型 |
| [`print/变体-轮滑/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E5%8F%98%E4%BD%93-%E8%BD%AE%E6%BB%91) | 轮滑替换件，不做轮滑不用打 |
| [`print/上游已删除/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E4%B8%8A%E6%B8%B8%E5%B7%B2%E5%88%A0%E9%99%A4) | 上游删除件，仅供存档 |
| [[60-项目/Microduck/02-项目文档/docs/机械采购清单|机械采购清单]] | 轴承、M2 螺丝、热熔螺母、耗材的国内采购记录 |
| [[60-项目/Microduck/02-项目文档/docs/电控采购清单|电控采购清单]] | 主控、摄像头、ToF、电源、PCB、线材和调试板 |

原仓库入口：

- [BOM](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/BOM.docx)

- [打印件目录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/07-%E8%B5%84%E6%BA%90%E4%B8%AD%E5%BF%83/%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F/05-%E5%8F%AF%E6%89%93%E5%8D%B0%E9%9B%B6%E4%BB%B6%E7%9B%AE%E5%BD%95.lnk)

- [机械采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E6%9C%BA%E6%A2%B0%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx)

- [电控采购清单](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%94%B5%E6%8E%A7%E9%87%87%E8%B4%AD%E6%B8%85%E5%8D%95.docx)

## 教程一：原版 XL330 路线

**1. **打开 [[60-项目/Microduck/02-项目文档/BOM|BOM]]，确认 15 颗 XL330 和 14 颗轴承。

**2. **从 [`print/打印件/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%89%93%E5%8D%B0%E4%BB%B6) 找出要打印的 30 种文件。

**3. **按打印 README 的数量表增加重复件。

**4. **用 [[60-项目/Microduck/02-项目文档/docs/机械采购清单|机械采购清单]] 补齐 M2 螺丝、热熔螺母和耗材。

**5. **电路按 [[60-项目/Microduck/02-项目文档/docs/电控采购清单|电控采购清单]] 下单。

## 教程二：飞特 HD-1910 路线

**1. **不要把本仓库的原始 STL 直接全部打成飞特版。

**2. **从 [SolidWorks v2.0](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.0) 下载带 `-FT` 的图纸。

**3. **也可使用 [MakerWorld 飞特版一键打印](https://makerworld.com.cn/zh/models/2963569-microduck#profileId-3478428)。

**4. **买 15 颗 HD-1910-C001。

**5. **舵机线连接器是 2.0 mm，调试板转接和 PCB 座子要单独核对。

**6. **进入 [`03-电控与调试`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/03-%E7%94%B5%E6%8E%A7%E4%B8%8E%E8%B0%83%E8%AF%95) 完成配 ID 和参数设置。

## 必须打多份的零件

| **零件** | **数量** |
| --- | --- |
| `leg_腿部` | 4 |
| `hip_l_髋部左` | 2 |
| `neck_颈部` | 2 |
| `power_support_电源支架` | 2 |
| `sole_left_左脚底` | 2 |
| `sole_right_右脚底` | 2 |
| `upper_leg_rigidity_plate_上腿加固板` | 2 |
| `yaw2roll_偏航转横滚` | 2 |
| `bearing_roll_横滚轴承压盖` | 2 |

其余 21 种各打印 1 件。完整数量仍以 [[60-项目/Microduck/02-项目文档/print/README|README]] 为准。

## 采购避坑

- 电池是 `NP-F550`，不是 F970；上游网格文件名 `np_f970` 是误导。

- 原版 XL330 在 HAT 上直接吃 2S 电池电压，属于超压使用。

- 飞特满电 8.4 V 是上限，堵转测试不要在满电状态做。

- Radxa Zero 3W 国内溢价很高，优先官方分销或可靠渠道。

- 摄像头是 90 度安装，不是 180 度。

- ToF 要买 VL53L5CX 或 VL53L8CX，不能买单点 VL53L0X。

# 电控与调试：介绍与教程

这个分类覆盖整机电源、树莓派形态主控、Dynamixel 总线、IMU 板、ToF、摄像头和舵机调试。

## 五个核心模块

| **模块** | **作用** | **来源** |
| --- | --- | --- |
| Radxa Zero 3W | 运行 Linux、ONNX 策略和视觉 | 市售 |
| RPI Robot HAT | 配电、音频、舵机总线接口 | 官方开源工程，自己打样 |
| `imu_to_dxl` | 把 LSM6DSV16X 伪装成 ID 200 的 Dynamixel 从机 | 第三方逆向设计，未打样验证 |
| IMX219 | 头部摄像头 | 市售 |
| VL53L5CX/L8CX | 8x8 多区 ToF | 市售 |

主控、HAT 和摄像头都在头部。舵机总线和电池供电线穿过脖子，MIPI 摄像头排线不穿脖子。

## 文件介绍

| **文件** | **内容** |
| --- | --- |
| [[60-项目/Microduck/02-项目文档/docs/硬件入门|硬件入门]] | 第一份应该读的硬件总览 |
| [[60-项目/Microduck/02-项目文档/docs/硬件规格速查|硬件规格速查]] | 一页纸芯片、地址、总线、引脚规格 |
| [[60-项目/Microduck/02-项目文档/docs/硬件方案逆向|硬件方案逆向]] | 从官方运行时源码推导硬件的完整证据链 |
| [[60-项目/Microduck/02-项目文档/docs/不打HAT|不打HAT]] | 用 UBEC 和半双工转接板替代 HAT |
| [[60-项目/Microduck/02-项目文档/docs/电控采购清单|电控采购清单]] | 国内采购和替代方案 |
| [`hardware/imu_to_dxl/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/hardware/imu_to_dxl) | 原理图、PCB、STEP、板框、接线表和嘉立创工程 |
| [[60-项目/Microduck/02-项目文档/调试记录|调试记录]] | 舵机配置和逐日电气调试记录 |
| [`assets/hw/Microduck硬件图集.pdf`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/assets/hw/Microduck%E7%A1%AC%E4%BB%B6%E5%9B%BE%E9%9B%86.pdf) | 7 张 A3 硬件图 |

原仓库入口：

- [硬件入门](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%A1%AC%E4%BB%B6%E5%85%A5%E9%97%A8.docx)

- [硬件规格速查](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%A1%AC%E4%BB%B6%E8%A7%84%E6%A0%BC%E9%80%9F%E6%9F%A5.docx)

- [硬件方案逆向](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/docs/%E7%A1%AC%E4%BB%B6%E6%96%B9%E6%A1%88%E9%80%86%E5%90%91.docx)

- [调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx)

- [imu_to_dxl 工程](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/hardware/imu_to_dxl/README.docx)

## 教程一：先读懂总线

一条 1 Mbps 单线半双工 TTL 总线连接全部设备：

```text
`Radxa UART2``  |-- 右腿 ID 10-14``  |-- 左腿 ID 20-24``  |-- 颈头嘴 ID 30-34``  `-- imu_to_dxl ID 200`
```

每个控制周期先用一次 `sync_read` 读取 IMU 和 15 颗舵机，再运行策略，最后用一次 `sync_write` 下发 14 个动作。

## 教程二：配置 15 颗舵机

完整操作步骤在 [调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx)。简要流程：

**1. **安装飞特 FD 调试软件，选择 `1000000` 波特率和正确 COM 口。

**2. **按 Signal、Vcc、GND 的顺序接 URT 调试板；只配 ID 时可以只用 USB 5 V 供电。

**3. **一次只接一颗舵机，因为出厂 ID 全是 1。

**4. **修改 ID，并打开过流和过压保护。

**5. **断电重启后重新搜索，确认参数写入。

**6. **贴上关节名和 ID 标签。

ID 对照：

| **ID** | **关节** | **位置** |
| --- | --- | --- |
| 10-14 | 右腿 | 髋 yaw、髋 roll、髋 pitch、膝、踝 |
| 20-24 | 左腿 | 髋 yaw、髋 roll、髋 pitch、膝、踝 |
| 30-34 | 颈头嘴 | 颈 pitch、头 pitch、头 yaw、头 roll、嘴 |
| 200 | IMU 板 | 固件固定，不在舵机里配置 |

## 教程三：装机后校零

**1. **零点定义为机器人笔直站立、腿是直柱、脚平放、头平视。

**2. **舵机转到 2048 后安装舵盘。

**3. **手动把关节摆到零点，使用 FD 的中位校准把当前位置写入 2048。

**4. **从零点慢慢拉到行程上下限，检查结构干涉和线束拉扯。

**5. **官方站立姿态不是零点，不要错误地把站姿校成 2048。

## 教程四：`imu_to_dxl` 打样

**1. **打开 [imu_to_dxl README](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/hardware/imu_to_dxl/README.docx)。

**2. **用立创 EDA 专业版打开 `imu_to_dxl.eprj2`。

**3. **下单前检查器件标准化、丝印、连接器高度和生产文件。

**4. **核对 J1/J2 与 J4/J5 的脚序；飞特和 Dynamixel 的脚序不同。

**5. **打样后先上电测电源和保护，再接总线。

**6. **固件需要自行实现，仓库目前只有硬件和协议资料。

## 安全注意

- 外接电源不要灌入 URT 的 V1 端子，可能反灌电脑 USB。

- 总线电源是 2S 电池原压，不是 5 V。

- 不要带电插拔舵机总线；DATA 线应加 TVS。

- `imu_to_dxl` 是未验证设计，不能把它当成已经工作的成品。

# 软件与算法：介绍与教程

这个分类对应官方运行时、策略模型、训练代码和针对飞特硬件的迁移工作。

## 上游目录介绍

本机已经拉取三个官方仓库：

| **目录** | **内容** |
| --- | --- |
| [`upstream/microduck`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck) | 板载运行时，Rust，面向 Rockchip RK3566 和 Radxa Zero 3W |
| [`upstream/microduck_rl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck_rl) | MJCF、仿真资产、强化学习训练栈和策略相关内容 |
| [`upstream/elec_RPI_Robot_HAT`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/elec_RPI_Robot_HAT) | 官方 HAT 的 KiCad、Gerber、BOM 和贴片文件 |

完整本地路径：

- [`C:\Users\zhang\Desktop\Microduck 使用中心\08-项目仓库\microduck-replica\upstream\microduck`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck)

- [`C:\Users\zhang\Desktop\Microduck 使用中心\08-项目仓库\microduck-replica\upstream\microduck_rl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck_rl)

- [`C:\Users\zhang\Desktop\Microduck 使用中心\08-项目仓库\microduck-replica\upstream\elec_RPI_Robot_HAT`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/elec_RPI_Robot_HAT)

## 相关文档

| **文件** | **用途** |
| --- | --- |
| [[60-项目/Microduck/02-项目文档/README|README]] | 整个项目总览 |
| [[60-项目/Microduck/02-项目文档/docs/生态导航|生态导航]] | 官方仓库、模型、数据集和社区资源导航 |
| [[60-项目/Microduck/02-项目文档/docs/执行器选型|执行器选型]] | XL330、HD-1910、STS3215 和 S288 对比 |
| [[60-项目/Microduck/02-项目文档/docs/HD-1910训练前数据清单|HD-1910训练前数据清单]] | 换飞特后重训策略需要补齐的数据 |
| [[60-项目/Microduck/02-项目文档/docs/硬件方案逆向|硬件方案逆向]] | 总线、寄存器、IMU 数据和设备路径依据 |

## 教程一：确认本地环境

在任意终端执行：

```text
`microduck status`
```

看到三个上游仓库、MuJoCo、SciPy、NumPy 和 Pillow 都是 `OK` 后，再进入源码目录。

## 教程二：阅读和运行官方运行时

**1. **打开 `02-打开-官方运行时.lnk`。

**2. **先读上游 [[60-项目/Microduck/02-项目文档/README|README]]、`deploy/README.md` 和各模块文档。

**3. **运行时目标是 Radxa Zero 3W + Armbian，不是普通 Windows 主机。

**4. **核对设备树、`/dev/ttyS2`、I2C、I2S 和 MIPI CSI 配置。

**5. **硬件同款时，再考虑使用官方 9 个 ONNX 策略。

## 教程三：仿真与训练

**1. **打开 `03-打开-官方训练仓库.lnk`。

**2. **[`upstream/microduck_rl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck_rl) 内包含 MJCF 和 47 个 STL，本仓库的 CAD 就是从它导出。

**3. **用 MJCF 做运动学和动力学检查。

**4. **训练需要 GPU 环境；官方还支持远程训练任务。

**5. **换飞特舵机后，官方策略不能直接迁移，需要按协议差异和数据清单重新训练。

## 教程四：飞特路线要改什么

| **层** | **原版** | **飞特版** |
| --- | --- | --- |
| 总线协议 | Dynamixel Protocol V2 | 飞特 SCS 协议 |
| 舵机参数 | XL330 位置和负载寄存器 | HD-1910 对应寄存器 |
| 动力学 | XL330 质量和惯量 | HD-1910 重新标定 |
| 策略 | 官方 9 个 ONNX | 必须重训 |
| 机械 | 凹舵盘配合件 | 凸舵盘配合件 |

硬件物理层相同，但包格式、寄存器、PD 参数、质量和惯量不同，不能只换舵机型号后直接运行。

## 教程五：修改代码

双击 `00-打开控制台.lnk`，选择 `E` 可以用 VS Code 打开整个仓库。建议按模块单独打开上游仓库，避免把生成物和第三方代码混在一起搜索。

常用位置：

- [`upstream/microduck/duck-control/src/bus.rs`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/duck-control/src/bus.rs)：总线和设备访问。

- [`upstream/microduck/duck-control/src/model.rs`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/duck-control/src/model.rs)：关节、ID、方向和寄存器。

- [`upstream/microduck/duck-control/src/imu.rs`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/duck-control/src/imu.rs)：IMU 数据。

- [`upstream/microduck/deploy/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy)：设备树、部署配置和板级设置。

# 工具与重现：介绍与教程

这个分类负责查看模型、重新生成图纸、导出 CAD、分析孔位和调试飞特舵机。

## 工具介绍

| **工具** | **文件** | **作用** |
| --- | --- | --- |
| STL 查看器 | [`tools/stl_viewer.html`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/stl_viewer.html) | 纯本地 WebGL 查看器，无需服务器 |
| 飞特 FD | [`tools/飞特/FD1.9.8.5(250729).7z`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/FD1.9.8.5%28250729%29.7z) | 配 ID、改参数、中位校准、拉滑杆 |
| 半双工驱动 | [`tools/飞特/CH340_URT.rar`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools/%E9%A3%9E%E7%89%B9/CH340_URT.rar) | 仅老款 URT-1 需要；URT-2 是 CH343 |
| 统一控制台 | [`Microduck.cmd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/Microduck.cmd) + [`microduck.ps1`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/microduck.ps1) | 菜单和终端命令总入口 |

## 脚本介绍

| **脚本** | **输入** | **输出** | **用途** |
| --- | --- | --- | --- |
| `fetch_upstream.sh` | 无 | [`upstream/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream) | 拉取三个官方仓库 |
| `render_assembly.py` | [`upstream/microduck_rl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck_rl) | [`assembly-drawings/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/assembly-drawings) | 生成 7 张装配图和爆炸图 |
| `export_assembly_stl.py` | [`upstream/microduck_rl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck_rl) | [`cad/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad) | 按刚体导出已装配 STL |
| `analyze_holes.py` | 上游 assets 目录 | JSON | 扫描圆柱孔并反推紧固件 |

## 教程一：查看 STL

**1. **双击 `01-打开STL查看器.lnk`。

**2. **将 [`cad/00_Microduck_整机装配体.stl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad/00_Microduck_%E6%95%B4%E6%9C%BA%E8%A3%85%E9%85%8D%E4%BD%93.stl) 拖进窗口。

**3. **左键旋转、右键平移、滚轮缩放。

**4. **左下信息面板会显示三角面数和尺寸。

**5. **需要看单个部件时，拖入 `cad/01` 至 `15` 中对应文件。

## 教程二：重新生成全部结果

在任意终端执行：

```text
`microduck render``microduck export``microduck holes`
```

默认输出会覆盖仓库中的 [`assembly-drawings/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/assembly-drawings)、[`cad/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad) 和 [`docs/hole_analysis.json`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/docs/hole_analysis.json)。测试时建议给命令加输出目录：

```text
`microduck render C:\Temp\microduck-render``microduck export C:\Temp\microduck-cad``microduck holes C:\Temp\microduck-holes.json`
```

## 教程三：直接运行脚本

在仓库根目录执行：

```text
`python scripts\render_assembly.py upstream\microduck_rl assembly-drawings``python scripts\export_assembly_stl.py upstream\microduck_rl cad``python scripts\analyze_holes.py upstream\microduck_rl\src\mjlab_microduck\robot\microduck\assets docs\hole_analysis.json`
```

依赖已经安装：`mujoco`、`scipy`、`numpy`、`pillow`。

## 教程四：飞特 FD 调试软件

**1. **解压 `FD1.9.8.5(250729).7z`，直接运行，无需安装。

**2. **URT-2 使用 CH343，Win10/11 一般免驱。

**3. **设备管理器确认 COM 口，FD 中选择该 COM 口和 `1000000` 波特率。

**4. **打开、搜索、修改 ID 和保护参数。

**5. **详细飞线、供电和校准步骤以 [[60-项目/Microduck/02-项目文档/调试记录|调试记录]] 为准。

## 终端命令总览

```text
`microduck help``microduck where``microduck status``microduck view``microduck render``microduck export``microduck holes``microduck editor`
```

`microduck` 已经加入当前用户可执行路径，可直接在 CMD 或 PowerShell 使用。

# 项目进度与排错：介绍与教程

这个分类用于回答三个问题：做到哪一步了、哪里容易出错、现在应该做什么。

## 文件介绍

| **文件** | **内容** |
| --- | --- |
| [[60-项目/Microduck/02-项目文档/构建日志|构建日志]] | 机械打印、试装、公差和飞特版改模过程 |
| [[60-项目/Microduck/02-项目文档/调试记录|调试记录]] | 电气与软件调试，含完整舵机配置手册 |
| [[60-项目/Microduck/02-项目文档/踩坑记录|踩坑记录]] | 买东西、打板、飞线、软件和工具中的坑 |
| [[60-项目/Microduck/02-项目文档/PROGRESS|PROGRESS]] | 项目全部批次的完成状态、决策和待办 |
| [[60-项目/Microduck/02-项目文档/BUILD-LOG.en|BUILD-LOG.en]] | 构建日志英文版 |

原仓库入口：

- [构建日志](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E6%9E%84%E5%BB%BA%E6%97%A5%E5%BF%97.docx)

- [调试记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95.docx)

- [踩坑记录](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/%E8%B8%A9%E5%9D%91%E8%AE%B0%E5%BD%95.docx)

- [项目进度](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/Word%E7%89%88/PROGRESS.docx)

## 推荐阅读顺序

**1. **[[60-项目/Microduck/02-项目文档/PROGRESS|PROGRESS]]：看全局完成度和待办。

**2. **[[60-项目/Microduck/02-项目文档/构建日志|构建日志]]：看机械实物的真实结果。

**3. **[[60-项目/Microduck/02-项目文档/调试记录|调试记录]]：按台架当前阶段操作。

**4. **[[60-项目/Microduck/02-项目文档/踩坑记录|踩坑记录]]：动手前扫一遍，避免重复踩坑。

## 遇到问题怎么查

| **现象** | **先查** |
| --- | --- |
| 舵机搜不到 | [[60-项目/Microduck/02-项目文档/调试记录|调试记录]] 的 COM、波特率、S/TTL 线和共地检查 |
| 舵机 ID 写不进去 | 断电重启后重新搜索，确认一次只接一颗 |
| 结构件装不上 | [[60-项目/Microduck/02-项目文档/构建日志|构建日志]] 和飞特版 CAD 说明 |
| 购买型号不对 | [[60-项目/Microduck/02-项目文档/BOM|BOM]]、机械采购清单、电控采购清单 |
| 主控串口被占用 | [[60-项目/Microduck/02-项目文档/README|README]] 的三条必踩坑和硬件入门 |
| 生成脚本报错 | `microduck status`，再查脚本依赖 |
| PCB 能不能直接用 | [[60-项目/Microduck/02-项目文档/hardware/imu_to_dxl/README|README]] 的未验证项 |

## 当前最重要的事实

- 飞特版机械装配已经成功。

- 15 颗 HD-1910 已经完成 ID 和参数配置。

- 整机控制还在台架总线联调阶段。

- 官方 HAT 已开源，但 `imu_to_dxl` 仍是未打样验证的第三方设计。

- 官方策略只适用于原版硬件，飞特路线必须重训。

# Microduck 文件总表

这里按原仓库路径解释主要文件和目录。数据始终以 [`C:\Users\zhang\Desktop\Microduck 使用中心\08-项目仓库\microduck-replica`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica) 为准。

## 根目录文件

| **文件** | **是什么** | **什么时候看** |
| --- | --- | --- |
| [[60-项目/Microduck/02-项目文档/README|README]] | 项目总览、双路线、BOM、CAD、电控和重现入口 | 第一次打开项目 |
| [[60-项目/Microduck/02-项目文档/README.en|README.en]] | README 英文版 | 对外交流 |
| [[60-项目/Microduck/02-项目文档/BOM|BOM]] | 整机物料清单和数量 | 采购前 |
| [[60-项目/Microduck/02-项目文档/BOM.en|BOM.en]] | BOM 英文版 | 对外交流 |
| [[60-项目/Microduck/02-项目文档/构建日志|构建日志]] | 机械打印和装配实测记录 | 打印、装机、公差问题 |
| [[60-项目/Microduck/02-项目文档/BUILD-LOG.en|BUILD-LOG.en]] | 构建日志英文版 | 对外交流 |
| [[60-项目/Microduck/02-项目文档/调试记录|调试记录]] | 舵机配置手册和电气逐日调试 | 拿到舵机和主控之后 |
| [[60-项目/Microduck/02-项目文档/踩坑记录|踩坑记录]] | 已知问题和解法清单 | 每次动手前 |
| [[60-项目/Microduck/02-项目文档/PROGRESS|PROGRESS]] | 项目状态、关键发现、决策和待办 | 想了解全局进度 |
| [[60-项目/Microduck/02-项目文档/快速使用|快速使用]] | 本机命令和入口说明 | 忘记命令时 |
| [`Microduck.cmd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/Microduck.cmd) | 双击菜单入口 | 日常使用 |
| [`microduck.ps1`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/microduck.ps1) | 控制台菜单和命令实现 | 修改命令行为 |
| [[60-项目/Microduck/02-项目文档/NOTICE|NOTICE]] | 上游来源、署名和许可说明 | 分发或商用前 |
| [`LICENSE`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/LICENSE) | 本仓库原创代码许可 | 二次开发前 |
| [`.gitignore`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/.gitignore) | 忽略上游目录和缓存 | 提交代码前 |
| [`.gitattributes`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/.gitattributes) | Git 换行和文本属性 | 跨平台协作 |

## 一级目录

| **目录** | **内容** | **对应教程** |
| --- | --- | --- |
| [`assembly-drawings/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/assembly-drawings) | 7 张装配图、爆炸图和分色图 | [`01-机械与模型`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/01-%E6%9C%BA%E6%A2%B0%E4%B8%8E%E6%A8%A1%E5%9E%8B) |
| [`assets/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/assets) | 硬件图、原理图渲染、PDF 图集和微信群图 | [`03-电控与调试`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/03-%E7%94%B5%E6%8E%A7%E4%B8%8E%E8%B0%83%E8%AF%95) |
| [`build-log/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/build-log) | 首批打印件和飞特整机照片 | [`06-项目进度与排错`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/06-%E9%A1%B9%E7%9B%AE%E8%BF%9B%E5%BA%A6%E4%B8%8E%E6%8E%92%E9%94%99) |
| [`cad/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad) | 整机和 15 个刚体分组的 STL、零件对照表 | [`01-机械与模型`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/01-%E6%9C%BA%E6%A2%B0%E4%B8%8E%E6%A8%A1%E5%9E%8B) |
| [`docs/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/docs) | 硬件、采购、执行器、训练、生态和社区文档 | 按主题进入分类目录 |
| [`hardware/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/hardware) | `imu_to_dxl` 原理图、PCB、STEP、DXF 和接线表 | [`03-电控与调试`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/03-%E7%94%B5%E6%8E%A7%E4%B8%8E%E8%B0%83%E8%AF%95) |
| [`print/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print) | 打印件、标准件、轮滑变体和归档件 | [`02-打印与采购`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/02-%E6%89%93%E5%8D%B0%E4%B8%8E%E9%87%87%E8%B4%AD) |
| [`scripts/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/scripts) | 装配图、CAD、孔位分析和上游拉取脚本 | [`05-工具与重现`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/05-%E5%B7%A5%E5%85%B7%E4%B8%8E%E9%87%8D%E7%8E%B0) |
| [`tools/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/tools) | STL 查看器、飞特 FD 软件和全局命令 shim | [`05-工具与重现`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/05-%E5%B7%A5%E5%85%B7%E4%B8%8E%E9%87%8D%E7%8E%B0) |
| [`upstream/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream) | 三个官方上游仓库，Git 忽略，不属于本仓提交 | [`04-软件与算法`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/04-%E8%BD%AF%E4%BB%B6%E4%B8%8E%E7%AE%97%E6%B3%95) |

## assembly-drawings

| **文件** | **内容** |
| --- | --- |
| `01_正面.png` | 整机正视装配态 |
| `02_侧面.png` | 整机侧视装配态 |
| `03_背面.png` | 整机背视装配态 |
| `04_四分之三.png` | 整机透视装配态 |
| `05_爆炸图_侧面.png` | 沿运动链爆炸，带名称和质量 |
| `06_爆炸图_四分之三.png` | 立体爆炸图，看左右镜像最清楚 |
| `07_分色对照_装配态.png` | 与爆炸图相同的颜色对照 |

## cad

| **文件** | **内容** |
| --- | --- |
| `00_Microduck_整机装配体.stl` | 整机单文件，已应用世界变换 |
| `01_躯干主体.stl` | 躯干刚体 |
| `02` 至 `06` | 左腿运动链五段 |
| `07` 至 `10` | 颈、头 yaw/roll 和头部总成 |
| `11` 至 `15` | 右腿运动链五段 |
| `零件对照表.json` | 刚体、源 STL、三角面数量清单 |
| [[60-项目/Microduck/02-项目文档/README|README]] | CAD 来源、坐标系、单位和导入说明 |

## docs

| **文件** | **内容** |
| --- | --- |
| `硬件入门.md` | 五块电子模块逐个讲解 |
| `硬件规格速查.md` | 芯片、地址、总线、引脚和坑 |
| `硬件方案逆向.md` | 完整推导过程和证据 |
| `执行器选型.md` | XL330、HD-1910、STS3215、S288 对比 |
| `电控采购清单.md` | 主控、传感器、PCB、线材和工具采购 |
| `机械采购清单.md` | 轴承、螺丝、热熔螺母和耗材采购 |
| `紧固件反推.md` | 从 STL 孔位反推 M2 系统 |
| `hole_analysis.json` | 全部 STL 的孔位分析结果 |
| `不打HAT.md` | 用现成模块替代官方 HAT |
| `不打HAT-接线图.html` | 替代方案的接线图 |
| `HD-1910训练前数据清单.md` | 飞特路线重训所需要的数据 |
| `生态导航.md` | 官方和社区资源索引 |
| `社区动态.md` | X、GitHub 社区情报 |
| `hardware-teardown.en.md` | 硬件逆向英文版 |
| `actuator-selection.en.md` | 执行器选型英文版 |
| `fastener-reconstruction.en.md` | 紧固件反推英文版 |
| `ecosystem.en.md` | 生态导航英文版 |

## hardware

| **文件** | **内容** |
| --- | --- |
| `imu_to_dxl/README.md` | 板子功能、选型、布局、复核查验和未验证项 |
| `imu_to_dxl-原理图.pdf` | 矢量原理图 |
| `imu_to_dxl-PCB.pdf` | PCB 布局和制造图 |
| `imu_to_dxl-PCB.step` | 用于装配干涉检查的 3D 模型 |
| `imu_to_dxl.eprj2` | 嘉立创 EDA 专业版工程 |
| `imu_to_dxl-板框-45x22-R2.dxf` | 板框导入文件 |
| `imu_to_dxl-接线表.md` | 逐网络、逐引脚接线表 |

## print

| **目录** | **内容** |
| --- | --- |
| `打印件/` | 30 种、41 件结构件 |
| `标准件-无需打印/` | 舵机、轴承、电池、PCB 等对位模型 |
| `变体-轮滑/` | 轮滑脚踝、轮辋、轮胎和滚轮叶片 |
| `上游已删除/` | 上游已经删除但保留归档的两个躯干壳 |
| [[60-项目/Microduck/02-项目文档/README|README]] | 数量表、命名规则、打印建议和勘误 |

## scripts

| **文件** | **内容** |
| --- | --- |
| `fetch_upstream.sh` | 拉取三个官方仓库 |
| `render_assembly.py` | 生成装配图和爆炸图 |
| `export_assembly_stl.py` | 按刚体导出装配好的 STL |
| `analyze_holes.py` | 扫描 STL 圆柱孔并输出 JSON |

## tools

| **文件** | **内容** |
| --- | --- |
| `stl_viewer.html` | 本地 STL 查看器 |
| `飞特/README.md` | FD 软件、驱动、端口和飞特资料说明 |
| `飞特/FD1.9.8.5(250729).7z` | 飞特 FD 调试软件 |
| `飞特/CH340_URT.rar` | 老款 URT-1 的串口驱动 |
| `microduck-global.cmd` | WindowsApps 全局命令来源 |

## upstream

| **目录** | **内容** |
| --- | --- |
| `microduck/` | 官方板载运行时，Rust |
| `microduck_rl/` | 官方 MJCF、STL、仿真和训练 |
| `elec_RPI_Robot_HAT/` | 官方 HAT 硬件开源工程 |
| [`upstream/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream) 整体 | 已被 [`.gitignore`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/.gitignore) 忽略，不进入本仓库提交 |

## 找不到文件时

**1. **在任意终端运行 `microduck where`。

**2. **打开 `00-从这里开始.md` 的任务表。

**3. **在本文件中搜索文件名或关键词。

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/10-%E5%B7%A5%E5%85%B7/_%E6%97%A7%E7%89%88%E6%96%87%E6%A1%A3%E5%A4%87%E4%BB%BD-20260922/Microduck%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%E5%90%88%E9%9B%86.docx)
