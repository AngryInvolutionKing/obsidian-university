---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# TIM2 一秒频闪与中断分层

- 关联课程主页：[[程序设计原理]]
- 对应任务：第 9 章定时器与 PWM 思考题 2

## 完整题干与真实来源

题干：设计基于 STM32CubeMX 和 HAL 库的“LED 1 秒频闪”功能（定时器中断实现），梳理完整配置流程，需包含：

- 时钟树配置：如何选择时钟源（如 HSE）并将系统主频配到 72 MHz，TIMx 时钟如何推导；
- 定时器参数配置：选择哪个定时器（如 TIM2）、PSC / ARR 的值如何设定（需匹配 1 秒）。

真实题目文件：`D:\CppWork\3026248210\09-Timer-PWM\思考题.md`。

相关说明：`D:\CppWork\3026248210\09-Timer-PWM\README.md`。该说明的 Task 1 采用 F103ZET6、外部晶振和 72 MHz 的配置；本题可沿用这一时钟口径，但实际板卡、晶振频率和 CubeMX 工程仍须核对。

## 题目目标与时序口径

目标是由 TIM2 的更新中断产生稳定节拍，主循环再依据节拍请求改变 LED 状态；不使用阻塞式延时来维持周期。这样中断服务程序只记录事件，GPIO 极性和具体引脚留在板级函数中处理。

在 README 所述的 72 MHz 系统配置中，若 APB1 分频系数为 2，则 $PCLK1=36\text{ MHz}$；STM32F1 的该类定时器在 APB 预分频不为 1 时使用两倍的 APB 时钟，因此 TIM2 时钟为 $72\text{ MHz}$。计时关系为：

$$
f_{cnt}=\dfrac{f_{tim}}{PSC+1},\qquad
T_{update}=\dfrac{(PSC+1)(ARR+1)}{f_{tim}}.
$$

取 $PSC=7199$，计数器频率为 $10\text{ kHz}$；取 $ARR=9999$，一次更新为 $1\text{ s}$。本页代码按“每隔 1 秒切换一次 LED 状态”解释题意，因此完整的亮—灭循环为 2 秒。

“1 秒频闪”也可能被要求为完整亮—灭循环恰为 1 秒。这时应让更新中断每 $0.5\text{ s}$ 发生一次，即保持 $PSC=7199$ 并改为 $ARR=4999$。题面没有定义这两种口径中的哪一种，提交前应按实验要求确认。

## CubeMX 配置步骤

1. 在 `RCC` 中根据实物时钟源选择 HSE（晶振或旁路模式必须与硬件一致），在 Clock Configuration 中确认系统时钟为 72 MHz。
2. 在时钟树中确认 APB1 分频和 TIM2 的实际输入时钟。只有显示为 72 MHz 时，下面的 $PSC=7199$、$ARR=9999$ 才直接成立。
3. 在 `Timers > TIM2` 选择 Internal Clock、Up Counter，填入 Prescaler 7199、Counter Period 9999；不需要配置 PWM 通道。
4. 在 `NVIC Settings` 使能 TIM2 global interrupt，生成代码后由 `MX_TIM2_Init()` 初始化 `htim2`。
5. 在初始化完成后调用 `HAL_TIM_Base_Start_IT(&htim2)`；确认生成的 `TIM2_IRQHandler()` 交给 `HAL_TIM_IRQHandler(&htim2)`。
6. 将下面的 `Board_SetStatusLed()` 替换为本工程已核验的 GPIO 写入函数，再观察节拍和 LED 状态。

## 可替换的 HAL 代码骨架

下面的骨架假定 CubeMX 已生成 `htim2` 和 `MX_TIM2_Init()`。`Board_SetStatusLed()` 故意返回错误，避免在不知道 LED 引脚及高低有效电平时伪装成已验证的硬件实现；确认板级条件后才替换其函数体。

```c
#include "main.h"
#include <stdint.h>

extern TIM_HandleTypeDef htim2;

enum { kTim2Prescaler = 7199U, kTim2AutoReload = 9999U };
static volatile uint32_t g_tim2_update_count = 0U;

static HAL_StatusTypeDef Board_SetStatusLed(uint8_t requested_on)
{
    /* TODO: 按原理图替换为正确 GPIO 端口、引脚和有效电平。 */
    (void)requested_on;
    return HAL_ERROR;
}

HAL_StatusTypeDef App_Tim2Begin(void)
{
    if (htim2.Init.Prescaler != kTim2Prescaler ||
        htim2.Init.Period != kTim2AutoReload) {
        return HAL_ERROR;
    }

    g_tim2_update_count = 0U;
    return HAL_TIM_Base_Start_IT(&htim2);
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim == &htim2) {
        ++g_tim2_update_count;
    }
}

HAL_StatusTypeDef App_Tim2Service(void)
{
    static uint32_t consumed_count = 0U;
    static uint8_t led_requested_on = 0U;

    while (consumed_count != g_tim2_update_count) {
        ++consumed_count;
        led_requested_on = (uint8_t)!led_requested_on;
        if (Board_SetStatusLed(led_requested_on) != HAL_OK) {
            return HAL_ERROR;
        }
    }
    return HAL_OK;
}
```

主循环中应在 `MX_TIM2_Init()` 后先检查 `App_Tim2Begin()` 的返回值，并反复调用 `App_Tim2Service()`。若 CubeMX 没有生成对应中断入口，可在 `stm32f1xx_it.c` 中补入如下转发；若该函数已经生成，不能重复定义。

```c
void TIM2_IRQHandler(void)
{
    HAL_TIM_IRQHandler(&htim2);
}
```

## 语法、HAL API 与寄存器概念

`extern TIM_HandleTypeDef htim2` 引用 CubeMX 生成的全局定时器句柄；它不重新创建或重新配置 TIM2。`enum` 中的两个常量让程序能在启动时检查 CubeMX 配置是否被误改。`volatile` 告诉编译器该计数器会在中断中变化，主循环不能把它当作不变值缓存。

`HAL_TIM_Base_Start_IT()` 启动基本定时器并开启更新中断，不能用不带 `_IT` 的 `HAL_TIM_Base_Start()` 替代。HAL 源码 `D:\CppWork\3026248210\Stm32Blink\Drivers\STM32F1xx_HAL_Driver\Src\stm32f1xx_hal_tim.c` 中，`HAL_TIM_IRQHandler()` 检查更新中断使能位和更新标志位，清除标志后调用 `HAL_TIM_PeriodElapsedCallback()`。因此回调函数只应处理属于 `htim2` 的事件。

从寄存器角度看，`TIM_DIER.UIE` 控制更新中断使能，`TIM_SR.UIF` 表示更新事件已经发生，`TIM_CR1.CEN` 使能计数器。PSC 和 ARR 的寄存器值都要加 1 才是参与计时的分频数和计数长度，这也是上面的公式使用 $PSC+1$ 与 $ARR+1$ 的原因。

`App_Tim2Service()` 以 `while` 消费已经累计的节拍，避免主循环短暂被其他工作占用时少切换一次状态。它仍要求主循环在计数器绕回前得到运行机会；本题的一秒节拍下这是合理的基本要求。GPIO 写入被放在主循环而非回调中，便于以后替换成较慢的板级操作，也让中断路径保持短小。

## 控制流程、常见错误与最小自检

控制流是：RCC 配出时钟树，TIM2 以 PSC 和 ARR 形成更新事件，NVIC 进入 `TIM2_IRQHandler()`，HAL 分发到周期回调，回调累加事件数，主循环消费事件并请求改变 LED 状态。LED 的真实电平最终由 `Board_SetStatusLed()` 根据原理图决定。

常见错误包括：把 $PCLK1$ 直接当作 TIM2 时钟而遗漏 APB 分频后的定时器倍频；忘记 PSC 和 ARR 的加一语义；只调用 `HAL_TIM_Base_Start()` 导致没有中断；未在 NVIC 中使能 TIM2；手写了第二个同名 IRQ 入口；把 LED 的高低有效极性、端口或引脚想当然写死；把“每秒切换一次”误当作“亮灭完整循环一秒”。

最小自检分三层。先人工代入参数，确认 $72000000/(7199+1)/(9999+1)=1\text{ Hz}$。再在调试器中观察 `g_tim2_update_count`：10 秒内应增加约 10 次；本页采用的口径下，LED 请求状态也应约切换 10 次。最后根据已核验的 LED 极性测量实际亮灭：若验收要求完整亮—灭循环为 1 秒，改用 $ARR=4999$ 后，在 10 秒内应看到约 20 次状态切换。

## 待核验条件与状态

- 题目文件没有给出实际板卡的 LED 端口、引脚和高低有效电平，`Board_SetStatusLed()` 必须按原理图或已验证工程替换。
- README 的 72 MHz、APB1 分频为 2 的时钟口径来自该章 Task 1；TIM2 工程的 Clock Configuration 需要在目标 `.ioc` 中再次确认。
- 当前仓库没有可直接复用的 TIM2 中断工程，也没有给出本题的硬件运行记录；本文完成了公式和 HAL 调用链的静态核验，未声称已烧录或已观察到 LED 频闪。
