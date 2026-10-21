---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# NVIC 抢占优先级中断嵌套验证

- 关联课程主页：[[程序设计原理]]
- 对应任务：第 6 章 NVIC 与 EXTI，任务 3“打断与被打断”

## 完整题干与真实来源

真实题目文件：`D:\CppWork\3026248210\06-NVIC-EXTI\README.md`。

任务 3“打断与被打断”的原文要求如下：

- 两个按键：KEY1 配置低抢占优先级，例如 2；KEY2 配置高抢占优先级，例如 0。
- KEY1 的中断回调中放一个较长的 `for` 循环空转，例如 5000 万次空循环，模拟耗时操作；循环结束后点亮 LED1。
- KEY2 的中断回调中直接点亮 LED2，不做任何延时。
- 先按 KEY1 触发低优先级中断，在它仍空转、LED1 尚未亮时立即按 KEY2，观察 LED2 是否先于 LED1 亮起。
- 反向测试：交换优先级，令 KEY1 高、KEY2 低；先按 KEY1 再按 KEY2，观察 LED2 是否要等 LED1 亮起后才亮。

题目说明还要求空转只用于演示嵌套，实际开发不能在中断内写耗时循环；`__NOP()` 比空循环更不易被编译器删去。题目以 F103 主频 72 MHz 时的 5000 万次空操作约为 0.5—1 秒作经验说明，实际时长仍受编译器、优化选项和时钟配置影响。

## 题目目标与前置条件

本题的目标是观察 NVIC 的抢占机制：KEY1 已进入低抢占优先级中断并忙等时，KEY2 的更高抢占优先级中断能保存 KEY1 的现场、先执行并点亮 LED2；KEY2 返回后，KEY1 从被打断位置继续，最后点亮 LED1。

一个必须先核验的条件是两个按键要能进入不同的 NVIC IRQ 通道。STM32F1 设备头文件列出了独立的 `EXTI0_IRQn` 至 `EXTI4_IRQn`，也列出了共享的 `EXTI9_5_IRQn` 与 `EXTI15_10_IRQn`。如果 KEY1 和 KEY2 落在同一共享 EXTI IRQ，NVIC 只有这一条 IRQ 的一个优先级，不能给两枚按键分别配置可嵌套的抢占优先级；必须改用不同 IRQ 通道，或按老师确认的其他中断源重新设计。

## CubeMX 配置要点

1. 为两枚按键各自配置 GPIO EXTI，并依据实际按下电平选择上升沿或下降沿；不要从题意猜测电平极性。
2. 在 NVIC 页面确认两个按键对应不同的 IRQ 通道，且两条 IRQ 都已启用。
3. 选择能保留抢占优先级位的 Priority Group；将 KEY1 对应 IRQ 的 Preemption Priority 设为 2，将 KEY2 对应 IRQ 设为 0，Sub Priority 先保持相同值。
4. 生成代码后，确认每个实际 `EXTIx_IRQHandler` 都调用 `HAL_GPIO_EXTI_IRQHandler()`，且传入的是对应按键掩码。
5. 完成第一轮测试后，交换两条 IRQ 的抢占优先级，保持其他配置、按键顺序和 LED 观察条件不变。

`HAL_NVIC_SetPriority(IRQn_Type IRQn, uint32_t PreemptPriority, uint32_t SubPriority)` 是本机 F1 HAL 声明的优先级设置接口。CubeMX 通常替你生成此类初始化代码；本题应以生成工程中的实际 IRQ 名称和优先级分组为准。

## 可替换的代码骨架

下面代码只实现任务要求的控制逻辑。`KEY1_Pin`、`KEY2_Pin`、LED 的端口/引脚及其有效电平都必须替换为实际 CubeMX 生成的名称和原理图事实。`Board_SetLed1()` 与 `Board_SetLed2()` 当前不驱动硬件，因此这不是已烧录或已验证的完整实现。

```cpp
#include "main.h"
#include <cstdint>

static volatile uint32_t g_key1_enter_count = 0U;
static volatile uint32_t g_key2_enter_count = 0U;
static volatile bool g_key1_busy = false;
static volatile bool g_key2_preempted_key1 = false;

static void Board_SetLed1(bool requested_on)
{
    (void)requested_on;
    // TODO: 根据原理图调用 HAL_GPIO_WritePin 设置 LED1。
}

static void Board_SetLed2(bool requested_on)
{
    (void)requested_on;
    // TODO: 根据原理图调用 HAL_GPIO_WritePin 设置 LED2。
}

static void DemoLongIsrWork(void)
{
    for (volatile uint32_t i = 0U; i < 50000000UL; ++i) {
        __NOP();
    }
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (GPIO_Pin == KEY1_Pin) {
        ++g_key1_enter_count;
        g_key1_busy = true;
        DemoLongIsrWork();
        Board_SetLed1(true);
        g_key1_busy = false;
        return;
    }

    if (GPIO_Pin == KEY2_Pin) {
        ++g_key2_enter_count;
        if (g_key1_busy) {
            g_key2_preempted_key1 = true;
        }
        Board_SetLed2(true);
    }
}
```

主函数保留 CubeMX 生成的 `HAL_Init()`、时钟初始化和 GPIO/EXTI/NVIC 初始化；进入主循环后本题没有周期性业务，可使用空循环或低功耗等待。回调函数由生成的 IRQ handler 间接调用，不能从主循环手工调用回调来代替真实中断。

## 语法、HAL API 与寄存器概念

`volatile` 表示这些状态会在中断上下文中改变，调试器和主循环读取时不能假定其永远不变。它不能让多步骤读改写自动变成线程安全操作；本题只以单字读写状态标记来辅助观察，不把它当作通用并发机制。

`HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)` 是 HAL 提供的回调入口。参数是触发源的 GPIO 引脚掩码，不是按键当前读取到的逻辑电平，所以两段 `if` 都要先筛选来源。`HAL_GPIO_EXTI_IRQHandler()` 位于更上游的 IRQ 链中，负责处理 EXTI 挂起状态后再转入用户回调；用户不应在回调内重复调用它。

`HAL_GPIO_WritePin()` 需要 GPIO 端口、引脚掩码和输出电平。它能写出高或低，但“高电平是否点亮 LED”取决于板级接线，故被封装在待替换的 `Board_SetLed` 函数中。`__NOP()` 是 CMSIS 的无操作指令；本机 GCC CMSIS 头文件把它定义为内联 `nop` 汇编，可防止示例循环退化成无可观察的空循环，却不能提供精确计时。

NVIC 的优先级寄存器保存 IRQ 优先级，Priority Group 决定其中多少位表达抢占优先级、多少位表达响应优先级。数值更小的抢占优先级更高：KEY2 的 0 可以中断 KEY1 的 2。响应优先级只在同一抢占层级的多个待响应 IRQ 中决定服务次序，不能让一个正在运行的中断被打断。

## 控制流程、常见错误与最小自检

正确流程为：KEY1 的电平跳变进入 EXTI，NVIC 调度 KEY1 IRQ，IRQ handler 转发给 HAL，回调将 `g_key1_busy` 置为真并执行演示空转；此时触发 KEY2，若 KEY2 属于独立 IRQ 且抢占优先级更高，NVIC 先服务 KEY2，LED2 请求点亮，随后回到 KEY1，LED1 在空转结束后请求点亮。交换优先级后，KEY2 应保持待处理，直至 KEY1 返回。

常见错误包括两枚按键共享同一 EXTI IRQ 却期望出现 NVIC 嵌套；只改 Sub Priority；没有开启 NVIC；IRQ handler 没有转发到 HAL；在中断中使用 `HAL_Delay`；使用可被优化掉的空循环；忽略按键抖动；以及按未知有效电平直接写死 LED 的高低电平。演示完成后应删除长 ISR 工作，真实耗时操作应拆给主循环、定时器或任务调度。

最小自检先确认两枚按键的 EXTI 线和 IRQ 名称，随后让 KEY1 为低抢占优先级、KEY2 为高抢占优先级。按下 KEY1 后趁 LED1 尚未亮按 KEY2，预期 `g_key2_preempted_key1` 变为真，并观察到 LED2 先于 LED1 的状态变化。交换抢占优先级、复位标志后重做同一按键顺序，预期 KEY2 的动作在 LED1 之后出现。两次测试都要记录按键抖动是否造成多次回调；若多次发生，先在硬件或主循环方案中明确消抖，再重新做观察。

## 待核验条件与状态

- 题目未给出 KEY1、KEY2、LED1、LED2 的端口、引脚、有效电平和外部上拉/下拉，均待原理图或 CubeMX 工程核验。
- 实际 EXTI 映射与 IRQ 是否独立、Priority Group 的位分配、两个 IRQ 的生成名称和优先级设置都待目标工程核验。
- 题目中的 72 MHz 与 5000 万次空转只能提供演示窗口，实际持续时间待编译器、优化等级和系统时钟实测。
- 已核验题干、仓库 README 和本机 STM32F1 HAL/CMSIS 的回调、NVIC、GPIO 写入及 `__NOP()` 声明；未修改作业源码、未编译、未烧录、未观察任何实体 LED。
