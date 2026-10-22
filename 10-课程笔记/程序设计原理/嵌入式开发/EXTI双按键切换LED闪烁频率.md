---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# EXTI 双按键切换 LED 闪烁频率

- 关联课程主页：[[程序设计原理]]
- 对应任务：第 6 章 NVIC 与 EXTI，任务 2“双按键控制 LED 不同频率闪烁”

## 完整题干与真实来源

真实题目文件：`D:\CppWork\3026248210\06-NVIC-EXTI\README.md`。

任务 2 的原文要求：利用两个按键控制一个小灯，按一个按键让小灯高频率闪烁，按另一个按键让小灯低频率闪烁。题目特别提示：中断里不能用延时函数，不能把闪烁控制代码放在中断回调函数里，应把小灯闪烁逻辑放在 `while` 循环中。伪代码以 `toggle_time` 表示闪烁时间，外部中断回调根据 KEY1/KEY2 改写该值，主循环反转小灯后等待对应时间；实现方式不限。

## 题目目标与设计边界

本题要验证的是“按键中断只改变控制请求，周期性输出由主循环按时间基准执行”。KEY1 和 KEY2 可以共享一个 EXTI IRQ；这种共享不妨碍本任务工作，因为同一个 HAL 回调仍可由 `GPIO_Pin` 参数分辨事件来源。闪烁快慢的具体毫秒数没有在题目中给出，下文的 $100$ ms 与 $500$ ms 半周期仅作可替换的教学示例，不是讲义规定的验收值。

## CubeMX 配置要点

1. 把两枚按键配置成 GPIO EXTI，触发边沿依据真实按下电平与上拉/下拉方式决定。
2. 在 NVIC 中使能对应 EXTI IRQ。若两条 EXTI 线共享 IRQ，生成的 handler 需要逐一转发给两次 `HAL_GPIO_EXTI_IRQHandler()`。
3. 把 LED 配为 GPIO 输出，并确认默认状态对应灭灯；高低有效电平不能由题意猜测。
4. 保留 HAL tick 的时间基准，主循环通过 `HAL_GetTick()` 获得毫秒计数；不要把 `HAL_Delay()` 放入按键回调。

## 可替换的代码骨架

以下骨架将两种按键事件转化为待执行模式，再由主循环使用非阻塞时间判断翻转 LED。`KEY1_Pin`、`KEY2_Pin` 和 `Board_SetLed()` 都需替换为实际 CubeMX 标签与板级实现；代码未绑定任何真实引脚。

```cpp
#include "main.h"
#include <cstdint>

enum class BlinkMode : uint8_t {
    Stopped,
    Fast,
    Slow,
};

constexpr uint32_t kFastHalfPeriodMs = 100U; // 示例值，非题目给定。
constexpr uint32_t kSlowHalfPeriodMs = 500U; // 示例值，非题目给定。

static volatile BlinkMode g_requested_mode = BlinkMode::Stopped;

static void Board_SetLed(bool requested_on)
{
    (void)requested_on;
    // TODO: 按 LED 引脚和有效电平调用 HAL_GPIO_WritePin。
}

static uint32_t HalfPeriodMs(BlinkMode mode)
{
    if (mode == BlinkMode::Fast) {
        return kFastHalfPeriodMs;
    }
    if (mode == BlinkMode::Slow) {
        return kSlowHalfPeriodMs;
    }
    return 0U;
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (GPIO_Pin == KEY1_Pin) {
        g_requested_mode = BlinkMode::Fast;
        return;
    }
    if (GPIO_Pin == KEY2_Pin) {
        g_requested_mode = BlinkMode::Slow;
    }
}

void App_BlinkService(void)
{
    static BlinkMode active_mode = BlinkMode::Stopped;
    static uint32_t last_toggle_ms = 0U;
    static bool led_requested_on = false;

    const uint32_t now_ms = HAL_GetTick();
    const BlinkMode requested = g_requested_mode;
    if (requested != active_mode) {
        active_mode = requested;
        led_requested_on = false;
        Board_SetLed(false);
        last_toggle_ms = now_ms;
    }

    const uint32_t half_period_ms = HalfPeriodMs(active_mode);
    if (half_period_ms == 0U) {
        return;
    }

    const uint32_t elapsed_ms = now_ms - last_toggle_ms;
    if (elapsed_ms < half_period_ms) {
        return;
    }

    const uint32_t elapsed_steps = elapsed_ms / half_period_ms;
    if ((elapsed_steps & 1U) != 0U) {
        led_requested_on = !led_requested_on;
        Board_SetLed(led_requested_on);
    }
    last_toggle_ms += elapsed_steps * half_period_ms;
}
```

CubeMX 生成的 `main` 在 GPIO、EXTI、NVIC 和 HAL tick 初始化后，持续调用 `App_BlinkService()`。回调函数只写一个枚举状态，执行时间很短；LED 的周期翻转完全在主循环发生。

## 语法、HAL API 与寄存器概念

`enum class BlinkMode` 让待处理命令只有停止、高频和低频三种取值；`volatile` 表示该请求会在中断里改变。主循环只读取一次当前请求，模式改变时重置节拍与 LED 请求状态，避免从一种频率切到另一种频率时继承旧节拍。

`HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)` 的参数是引脚掩码，必须筛选 KEY1 与 KEY2。`HAL_GPIO_EXTI_IRQHandler()` 位于 IRQ handler 内部的上游路径，负责清除 EXTI 挂起状态后调用回调；不要在回调中再调用它。`HAL_GetTick()` 在本机 F1 HAL 头文件中声明为返回 `uint32_t` 的时间计数接口，通常以毫秒为单位递增。无符号减法 `now_ms-last_toggle_ms` 能正确处理一次计数回绕后的短时间间隔。

`HAL_GPIO_WritePin()` 与 `HAL_GPIO_TogglePin()` 是 GPIO 输出 API。骨架封装了写引脚动作，原因是 LED 端口、掩码和亮灭极性没有出现在题目中。EXTI 的边沿检测先置位 pending 状态，再由 NVIC 响应相应 IRQ；本题不直接写 EXTI 或 NVIC 寄存器，但 CubeMX 的 GPIO EXTI、触发边沿和 NVIC 使能缺一不可。

## 控制流程、常见错误与最小自检

控制流程为：KEY1 或 KEY2 的电平跳变进入 EXTI，IRQ handler 进入 HAL 的外部中断处理，再到回调函数；回调把待执行模式改为快速或慢速；主循环读取系统 tick，达到半周期时请求反转 LED。若主循环暂时变慢，骨架通过 `elapsed_steps` 更新时基，避免一次长延迟后不断补偿旧时间。

常见错误包括在回调中调用 `HAL_Delay`、只写回调却未开启 EXTI/NVIC、把 `GPIO_Pin` 当作按键电平、不区分两枚按键、主循环与回调同时直接写同一 LED、频率切换时不重置节拍、用会被优化掉的空循环等待、以及按未知极性写死 LED 高低电平。按键抖动可能产生多次回调；同一按键的重复事件通常不会改变模式，但应根据实物增加硬件或软件消抖。

最小自检：先用实际引脚核对 KEY1、KEY2 的 EXTI 与 IRQ，确认主循环持续运行。按 KEY1 后，记录至少十个相邻翻转的时间差；按 KEY2 后重复记录，验证两组半周期不同且都接近已选常量。再在系统 tick 接近回绕的模拟条件下检查无符号差值逻辑。若 LED 没有变化，依次检查 EXTI、NVIC、IRQ 转发、HAL tick、主循环调用、GPIO 引脚与电平极性；不得以增加 ISR 内延时替代排查。

## 待核验条件与状态

- KEY1、KEY2、LED 的端口、引脚、上拉/下拉、触发边沿及 LED 有效电平待原理图和 CubeMX 工程核验。
- 快速/慢速闪烁的验收频率、HAL tick 实际频率和按键消抖要求未在题目中给出，待课程要求确认。
- 题干、真实路径、本机 STM32F1 HAL 的 EXTI 回调、GPIO API 与 tick API 已核验；未修改作业源码、未编译、未烧录、未观测实体 LED。
