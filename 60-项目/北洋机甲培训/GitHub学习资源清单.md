---
tags:
  - 北洋机甲
  - 电控培训
  - 学习资源
  - GitHub
整理: 2026-10-05
核查方式: GitHub 官方 API（star / 最近推送 / 许可证 / 是否归档），2026-10-05 实测
---

# GitHub 学习资源清单（电控培训配套）

> 搜法：按培训 10 个主题逐条搜，用 GitHub 官方 API 核查 **star / 最近推送 / 许可证 / 是否归档**，
> 只保留「还在维护 + 许可可用 + 真的对口」的。star 数不是主要标准，**能不能用在你的工具链上**才是。

## ⚠️ 先说一个硬事实：你的组合几乎没人用

| 你的配置 | 公开仓库的普遍情况 |
|---|---|
| STM32**F103ZET6** | F103 的库绝大多数是 **C8T6**（蓝药丸）或 **VET6** |
| **CLion + CMake + OpenOCD** | F103 例程绝大多数是**正点原子 Keil 工程 → 对你直接不可用** |
| 少数 CLion + CMake 模板 | 几乎全是 **H750 / H7B0 / H730**（H7 系列，不能直接套 F1） |

**结论**：不存在「拿来就能跑」的仓库。下面每个我都标了**要改什么**，别期待直接 clone 就能编译。

---

## 一、和你的工具链真正匹配的（优先级最高）

### 1. bfmhno3/clion_for_stm32 — 68★ / 2026-02-12 / MIT
<https://github.com/bfmhno3/clion_for_stm32>

**唯一还在维护、且明确针对「用 CLion 替代 Keil 开发 STM32」的中文教程。** 你的第 1 讲就是这个主题。
→ 用途：环境配置排错（OpenOCD 调试、CMake 工具链），比讲义更细。
→ 注意：不针对 F103ZET6 具体型号，讲的是通用配置流程。

### 2. Gralerfics/STM32F103VET6-StdPeriph-Driver-Template-For-CLion — 3★ / 2022-12-03 / 无许可
<https://github.com/Gralerfics/STM32F103VET6-StdPeriph-Driver-Template-For-CLion>

**唯一找到的 F103 + CLion 工程模板**（VET6 与你的 ZET6 只差 Flash/RAM 容量，GPIO 基本一致）。
→ 用途：看**工程怎么组织**（CMakeLists 怎么写、启动文件/链接脚本怎么配）。
→ 注意：2022 年后没动过；用**标准库**不是 HAL，与你讲义路数不同。**只当参考，别当基线。**

### 3. MaJerle/stm32-usart-uart-dma-rx-tx — **1827★** / 2026-09-12 / **MIT**
<https://github.com/MaJerle/stm32-usart-uart-dma-rx-tx>

**第 7、8 讲（UART + DMA）最值得看的仓库**，作者是嵌入式圈知名开发者（lwOW、lwESP 同一人）。
→ 用途：DMA + 空闲中断收不定长数据的**标准做法**、双缓冲、错误恢复。
→ 注意：面向 **M4/M7**（F4/F7/H7），F1 的 DMA 控制器不同，要改寄存器层。

---

## 二、直接覆盖你某几讲的

### 4. JerryZheng89/stm32_hal_uart_dma — 2★ / 2020-12-27 / 无许可
<https://github.com/JerryZheng89/stm32_hal_uart_dma>

描述写明「**stm32f103zet6**, HAL library, uart idle interrupt and dma」——**芯片型号和你完全一致**。
→ 用途：UART 空闲中断 + DMA 的 **F103ZET6 具体实现**，可直接对照引脚和寄存器。
→ 注意：2020 年后停更、star 极低（2 星），代码质量没保证。**当参照不当范本。**

### 5. drifting-cloudlet/BalanceCar — 17★ / 2026-01-23 / 无许可
<https://github.com/drifting-cloudlet/BalanceCar>

「基于 **STM32F103 + HAL 库**开发的两轮自平衡车，模块化设计，含 MPU6050 驱动、姿态解算、**PID**」。
→ 用途：**第 10 讲 PID 的实战参照**。你的校内赛要速度环闭环，这个项目是完整闭环（含传感器+控制）。
→ 注意：平衡车 ≠ 你的赛道车，但**速度环 + 编码器 + PID 的结构可以直接借鉴**。

### 6. MootSeeker/STM32_Embedded_CPP — 23★ / 2026-04-20 / MIT
<https://github.com/MootSeeker/STM32_Embedded_CPP>

「A learning space for **modern Embedded C++** on STM32」。
→ 用途：**第 2 讲（C++ 阶段电控培训）**的内容延伸。你现在正好在 C++ 阶段。
→ 注意：是学习空间不是成品库，按主题翻。

### 7. Waynehzw/JiangKeXie_STM32CubeMX — 6★ / 2025-09-11
<https://github.com/Waynehzw/JiangKeXie_STM32CubeMX>

「基于 **B 站江协科技 STM32 入门教程**，采用 **CubeMX** 建工程」。
→ 用途：江协科技是中文 STM32 入门最流行的视频课，这个仓库把它**改成了 CubeMX 版**——正好对上你们用 CubeMX 的路数（原版是标准库 + Keil）。
→ 注意：原教程是 F103C8T6，引脚要按你的 ZET6 改。

---

## 三、值得收藏的索引（用来找东西，不是用来学）

| 仓库 | star | 最近推送 | 许可 | 说明 |
|---|---|---|---|---|
| [nhivp/Awesome-Embedded](https://github.com/nhivp/Awesome-Embedded) | **9173** | 2026-09-06 | Unlicense | 嵌入式资源总索引，最全 |
| [Luyi365/awesome-embedded](https://github.com/Luyi365/awesome-embedded) | 160 | 2026-09-18 | CC0-1.0 | **中文**，300+ 开源库速查表，按功能分类 |
| [Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP) | 311 | **2026-10-05** | MIT | 系统化现代 C++ 教程（C++11→C++23 + STL） |

第三个小技巧：**「要什么功能搜什么」比「看教程」快**——`awesome-embedded` 那类表就是干这个的。

---

## 四、后面会用到（电机 / FOC 方向）

| 仓库 | star | 最近推送 | 许可 | 说明 |
|---|---|---|---|---|
| [liujycode/awesome-FOC-motor-control](https://github.com/liujycode/awesome-FOC-motor-control) | 4 | 2026-09-28 | MIT | FOC 学习路径 + 资源，**分层学习路线**，不是代码库 |
| [skaiui2/SKRTOS_sparrow](https://github.com/skaiui2/SKRTOS_sparrow) | 501 | 2026-03-11 | MIT | 模块化 RTOS 微内核 + 教程，嵌入式方向进阶 |

你现在**不需要** FOC（讲义用的是 L298N + 霍尔编码器，属于有刷直流电机方案）。等真上无刷再回来看。

---

## 五、我**不**推荐 / 要留意的

| 仓库 | 为什么不推荐 |
|---|---|
| [Staok/stm32_framework](https://github.com/Staok/stm32_framework) — 478★ | 集成了 FreeRTOS/LWIP/FATFS，但许可是 **AGPL-3.0** ⚠️——**传染性许可**，抄进你的作业仓库会污染整个仓库。学习可以，**别复制代码** |
| Prry/stm32-uart-dma — 395★ | 质量不错但 **2022-10 停更**，且是标准库路线 |
| wujique/stm32_tech — 69★ | F103 中文教程，但 **2021-10 停更** |
| HL-ESLAB/Balance-Car — 13★ | 2023-10 停更 |
| atomLabsRepo/HowToUseSTM32HalLibrariesWithoutSTM32CubeMX — 2★ | **2020 停更**，且与你们「用 CubeMX」的路数相反 |
| Peakors/STM32H7xxx_Template 系列 | 质量不错但**全是 H7 系列**，不能直接用在 F1 |

---

## 六、按你的讲义逐条对号

| 讲义 | 推荐看哪个 | 要改什么 |
|---|---|---|
| 1. CLion 开发 | **bfmhno3/clion_for_stm32**、Gralerfics 模板 | 通用流程可直接用 |
| 2. C++ 阶段 | **MootSeeker/STM32_Embedded_CPP**、Tutorial_AwesomeModernCPP | 无 |
| 3. Git/Gitee | 无专用仓库（你已经会了） | — |
| 4. 通识 | 无推荐（看讲义 + CubeMX 官方文档即可） | — |
| 5. GPIO | 江协科技 CubeMX 版 | C8T6→ZET6 引脚 |
| 6. NVIC/EXTI | 同上 | 同上 |
| 7. UART | **MaJerle/stm32-usart-uart-dma-rx-tx**、JerryZheng89 | M4→F1 DMA 控制器 |
| 8. DMA | 同上（MaJerle 是重点） | 同上 |
| 9. 定时器与 PWM | 无好仓库，见下方缺口 | — |
| 9.5 电机与舵机 | 无好仓库 | — |
| 10. PID | **drifting-cloudlet/BalanceCar** | 平衡车→速度环 |

## 七、缺口（GitHub 上找不到，得靠别的渠道）

1. **F103ZET6 + 编码器模式 + 定时器的好例程**：搜出来的全是 0~2 星、多年未更新。这个主题**建议直接看 ST 官方参考手册 RM0008 的 TIM 章节 + 你板子的原理图**（编码器模式是硬件功能，代码很短，难在理解 4 倍频和计数方向）。
2. **L298N + 500~1000Hz PWM 的具体实现**：没有像样的仓库，属于「看讲义 + 自己写」的量级。
3. **F103 的 CLion + CMake 工程基线**：没有维护良好的模板。**建议自己建一个然后长期用**——这个我可以帮你做（见下）。

---

## 八、我能直接帮你做的事

- [ ] **搭一个 F103ZET6 的 CLion + CMake 工程基线**（对标你的 OpenOCD + ST-Link 流程），
      以后每讲的作业在这个基线上加外设，不用每次重建工程
- [ ] 把上面某几个仓库 clone 到本地并**核对是否真能编译**（很多老仓库在 ARM GCC 13 上会挂）
- [ ] 针对第 9 讲**编码器模式**写一个独立验证工程（3960 脉冲/圈那条公式实测对不对）
- [ ] 把「讲义 ↔ 仓库」的对照表做成可点击的双链笔记

> 相关：[[北洋机甲培训]]、[[硬件与采购清单]]、[[01-CLion开发]]
