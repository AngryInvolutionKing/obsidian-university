---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# TIM3 定时中断与 PSC/ARR 加一语义

- 关联课程主页：[[程序设计原理]]。

推送对应日期与资料核验日期为 2026-10-19。本篇选择第 9 章思考题 1；此前专题讲过 PWM 的占空比、编码器与舵机，但没有单独推导 TIM3 的 $500$ ms 更新中断及寄存器“加一”的来源。

## 完整题干与真实来源

主源文件为 [思考题.md](<D:/CppWork/3026248210/09-Timer-PWM/思考题.md>)，绝对路径 `D:\CppWork\3026248210\09-Timer-PWM\思考题.md`。原题要求：“给出一组合理的 PSC / ARR 值（要求 PSC 和 ARR 均为 16 位以内整数），并解释公式中‘PSC+1’和‘ARR+1’的原因；说明若省略‘+1’会导致定时时间产生何种偏差。”

题干的具体前提来自同章 [README.md](<D:/CppWork/3026248210/09-Timer-PWM/README.md>)，绝对路径 `D:\CppWork\3026248210\09-Timer-PWM\README.md`：TIM3 挂在 APB1，APB1 预分频为 $2$、$PCLK1=36$ MHz，因此本题给定 $TIM3CLK=72$ MHz；目标是每 $500$ ms 触发一次更新中断。题目未要求接灯、烧录或给出实际板卡引脚。

## 题目目标与计算

定时器向上计数时，更新时间满足

$$
T=\frac{(PSC+1)(ARR+1)}{TIM3CLK}.
$$

取 $PSC=7199$，则计数频率为

$$
f_{CNT}=\frac{72\,000\,000}{7199+1}=10\,000\ \mathrm{Hz}.
$$

在 $500$ ms 内需要 $5000$ 个计数周期，故取 $ARR=4999$。代回可得

$$
T=\frac{7200\times5000}{72\,000\,000}=0.5\ \mathrm{s}.
$$

`PSC` 寄存器写入的是预分频因子减一，写入 $7199$ 才表示除以 $7200$；向上计数器从 $0$ 数到 $ARR$ 后才产生更新事件，因此写入 $4999$ 实际经历 $5000$ 个计数值。若错误地用 $PSC\times ARR/TIM3CLK$，会得到

$$
\frac{7199\times4999}{72\,000\,000}\approx0.4998306\ \mathrm{s},
$$

比目标短约 $169.4\ \mu\mathrm{s}$，并且这种误差会随周期事件重复累积。

## 可替换的 HAL 代码骨架

下面骨架面向仓库采用的 C++ 文件形式。它只验证配置值和更新事件的交接，不擅自绑定 LED。`htim3`、`TIM3_IRQHandler` 和 NVIC 配置均应由实际 CubeMX 工程生成或核对后替换；这不是已烧录的完整实现。

```cpp
#include "main.h"
#include <cstdint>

extern TIM_HandleTypeDef htim3;

constexpr uint32_t kTim3ClockHz = 72'000'000U;
constexpr uint16_t kTim3Psc = 7199U;
constexpr uint16_t kTim3Arr = 4999U;
constexpr uint64_t kPeriodUs =
    uint64_t(kTim3Psc + 1U) * uint64_t(kTim3Arr + 1U) * 1'000'000ULL /
    kTim3ClockHz;
static_assert(kPeriodUs == 500'000ULL);

static volatile uint32_t g_tim3UpdateCount = 0;

HAL_StatusTypeDef App_Tim3Begin() {
    if (htim3.Init.Prescaler != kTim3Psc ||
        htim3.Init.Period != kTim3Arr) {
        return HAL_ERROR;
    }
    g_tim3UpdateCount = 0;
    return HAL_TIM_Base_Start_IT(&htim3);
}

extern "C" void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef* htim) {
    if (htim == &htim3) {
        ++g_tim3UpdateCount;
    }
}

bool App_Tim3TakeUpdate() {
    static uint32_t consumed = 0;
    const uint32_t observed = g_tim3UpdateCount;
    if (observed == consumed) {
        return false;
    }
    consumed = observed;
    return true;
}
```

如果生成工程没有现成的 TIM3 中断转发，才在其 IRQ 源文件中放入以下最小转发；已有同名函数时必须在原函数中补全，不能定义第二个同名 IRQ 函数。

```cpp
extern "C" void TIM3_IRQHandler(void) {
    HAL_TIM_IRQHandler(&htim3);
}
```

## 语法、HAL API 与寄存器概念

`constexpr` 和 `static_assert` 在编译期锁住时钟、PSC、ARR 与理论周期之间的关系，`uint64_t` 防止微秒换算的乘法溢出。`static volatile` 让主循环每次重新读取可能在中断中更新的计数，但它不保证“读取后比较再写回”是原子的；本题只递增单个计数并允许主循环合并多个到期事件，复杂共享状态需进一步同步。

`HAL_TIM_Base_Start_IT(&htim3)` 是基本定时器中断启动入口。已核对的本地 HAL 源码会使能更新中断并启动计数器；其中 `TIM_DIER_UIE` 是更新中断使能位，`TIM_CR1_CEN` 是计数器使能位。更新到来后，`TIM_SR_UIF` 标志置位；生成的 IRQ 转发给 `HAL_TIM_IRQHandler`，HAL 检查 `DIER` 和 `SR`、清除更新标志，再调用用户实现的 `HAL_TIM_PeriodElapsedCallback`。回调只累计事件，把较慢的业务处理交给主循环，避免在中断内执行长延时、串口打印或复杂计算。

## 控制流程、常见错误与最小自检

流程是从时钟树确认 TIM3 时钟为 $72$ MHz→在 CubeMX 选择 TIM3 基本定时器和内部时钟→填入 PSC、ARR→开启 TIM3 全局中断并生成 IRQ 转发→调用 `App_Tim3Begin()`→每次更新进入回调累加计数→主循环以 `App_Tim3TakeUpdate()` 消费到期事件。若将来用该事件翻转 LED，翻转动作应发生在主循环；灯的端口、引脚、有效电平和时钟使能均不是本题提供的事实。

常见错误包括误把 $PCLK1=36$ MHz 当作 TIM3 时钟、把实际除数直接写进 PSC、把 ARR 写成计数次数、只调用 `HAL_TIM_Base_Start` 因而没有中断、没有在 NVIC 启用 TIM3、IRQ 未调用 `HAL_TIM_IRQHandler`、回调没有筛选定时器句柄，以及在回调中做阻塞操作。另一个错误是将 `volatile` 当作完整的并发保护，导致多字节数据或读改写状态在中断与主循环之间竞争。

最小自检先检查编译期断言得到 $500000$ 微秒；目标板上可在回调中只递增计数，在主循环每隔十次事件输出一次计数，检查约 $5$ 秒得到约 $10$ 次更新。若加 LED，需要示波器或时间戳确认相邻更新约为 $500$ ms；仅看到灯闪烁不能证明 PSC、ARR 和实际时钟都正确。

## 待核验条件与状态

`Stm32Blink` 当前源码没有现成 TIM3 配置或 `TIM3_IRQHandler`，因此实际定时器实例、IRQ 名称、CubeMX 时钟树、HSE 频率、板载 LED 引脚和有效电平都待按目标工程核验。$72$ MHz、APB1 预分频和 $PCLK1$ 的数值仅是本题 README 给定前提。题干、README、本地 STM32F1 HAL 的启动、IRQ 和更新回调路径已读取；未改作业仓库、未构建目标固件、未烧录，也未测得真实 $500$ ms 波形。
