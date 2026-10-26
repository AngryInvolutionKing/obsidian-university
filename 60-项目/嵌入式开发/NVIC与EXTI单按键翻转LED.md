---
course: 程序设计原理
topic: 嵌入式开发
source: "D:\\CppWork\\3026248210\\06-NVIC-EXTI\\task1_key_toggle_led.cpp"
tags:
  - STM32
  - NVIC
  - EXTI
  - GPIO
  - 中断
---

# NVIC 与 EXTI：单按键翻转 LED

> [!warning] 当前状态
> 2026-10-06 已读取真实题目框架与章节 README，尚未修改作业源码、创建 CubeMX 工程、编译、烧录或接入开发板。下面的程序是待替换引脚名的 HAL 骨架，不是已在某块板上验证完成的作业。

## 原题与来源

真实源文件：`D:\CppWork\3026248210\06-NVIC-EXTI\task1_key_toggle_led.cpp`。

章节 README 的任务 1 原文为：“利用一个按键控制小灯的亮灭，即按下一个按键，小灯亮起，再按下相同的按键，小灯熄灭。”伪代码要求实现 `HAL_GPIO_EXTI_Callback(GPIO_Pin)`，先确认触发源是按键对应的 EXTI 线，再反转 LED 引脚。题目框架还明确要求在 CubeMX 中把按键配置成 GPIO 外部中断、在 NVIC 中使能相应中断，并提示中断回调中不要使用 `HAL_Delay`。

源文件目前只有 TODO：它包含 `cstdint`，把 `main.h` 注释掉，定义了空的 `HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)` 和直接返回的 `main`。这意味着题目给的是待填框架，不能把下面的示例误认为仓库已有实现。

## 这道题真正要完成什么

轮询版的按键程序是在 `while (1)` 里反复读取输入；本题把“发现按下”交给硬件中断。一次合格的按键边沿应沿着下面的链路到达用户代码：

```text
按键电平发生有效边沿
    → GPIO/AFIO 把该引脚映射到 EXTI 线
    → EXTI 置位 pending 标志
    → NVIC 按使能与优先级响应对应 IRQ
    → CubeMX 生成的 EXTIx_IRQHandler 调用 HAL_GPIO_EXTI_IRQHandler(按键引脚)
    → HAL 清除本次 pending 标志并调用 HAL_GPIO_EXTI_Callback(GPIO_Pin)
    → 用户筛选引脚、消抖、翻转 LED 输出
```

`HAL_GPIO_EXTI_Callback` 的参数不是“读取到的高低电平”，而是发生事件的 GPIO 引脚掩码。一个工程可以让多条 EXTI 线共用同一个回调，因此必须先判断它是不是目标按键；否则另一个中断源也会把 LED 翻转。

## 可替换的最小代码骨架

下列骨架对应题目要求。`KEY_Pin`、`LED_GPIO_Port`、`LED_Pin` 必须替换为 CubeMX 生成的 `main.h` 中实际宏名；这些名字和端口不能从当前作业框架推断出来。`HAL_Init`、时钟配置和 `MX_GPIO_Init` 也应保留为目标工程生成的版本。

```cpp
#include "main.h"

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    // 同一回调可能由多条 EXTI 线进入，先筛选来源。
    if (GPIO_Pin != KEY_Pin) {
        return;
    }

    // 将指定输出引脚的当前状态翻转一次。
    HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);
}

int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();

    // 之后无需轮询按键；CPU 可在此处处理其他非阻塞任务。
    while (1) {
    }
}
```

本机独立的 F1 HAL 头文件 `D:\CppWork\3026248210\Stm32Blink\Drivers\STM32F1xx_HAL_Driver\Inc\stm32f1xx_hal_gpio.h` 声明了 `HAL_GPIO_TogglePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)`、`HAL_GPIO_EXTI_IRQHandler(uint16_t GPIO_Pin)` 和 `HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)`。这只核验了本机可用 HAL 接口的函数签名；它不是本作业板卡的引脚配置证据。STM32F1 HAL 文档也说明，前一个 IRQ 处理函数检查并清除 EXTI 挂起状态后，再调用用户实现的回调函数。

不要在回调里再调用 `HAL_GPIO_EXTI_IRQHandler`，也不要手工重复清 pending 标志；它们属于 IRQ 处理链的上游。通常应检查 CubeMX 生成的 `stm32f1xx_it.c` 中对应的 `EXTIx_IRQHandler` 是否已经把按键引脚交给该 HAL 函数。当前题目文件没有附带生成后的中断源文件，故具体 IRQ 名称待工程生成后核验。

## 语法与 API 逐点解析

`uint16_t GPIO_Pin` 的 `uint16_t` 来自 `<cstdint>` 或 HAL 头文件，表示无符号 16 位整数。在 HAL 中它通常承载诸如 `GPIO_PIN_0` 一类的位掩码，所以它不能简单理解为“第几个引脚”的普通编号。形参名使用 `GPIO_Pin` 与 HAL 保持一致，回调收到的值可直接与 `KEY_Pin` 比较。

`void HAL_GPIO_EXTI_Callback(...)` 的 `void` 表示没有返回值。HAL 为该回调提供弱定义，用户在自己的源文件中定义同名、同签名的全局函数即可覆盖默认空实现。函数名、参数类型或参数数量一旦写错，编译器就不会把它当作 HAL 的回调；因此不要自行改成无参函数，也不要给它加 `static`。

`if (GPIO_Pin != KEY_Pin) { return; }` 是中断源筛选。`!=` 比较两个掩码是否不同；当这次中断不是目标按键时立即返回，使同一回调可安全服务多个 EXTI 源。这里使用提前返回能减少嵌套层级，中断代码也更容易审查。

`HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin)` 由 HAL 根据 LED 当前输出状态写出相反状态。第一个实参是端口寄存器组的地址，例如生成代码里的 `GPIOA`；第二个实参是 LED 的位掩码。函数不需要知道“亮”是高电平还是低电平：它只做反转。因此只要初始灭灯状态正确，按下一次就会切换一次。若任务要求明确点亮或熄灭，应改用 `HAL_GPIO_WritePin` 并按真实有效电平写入，而不是继续使用 toggle。

`while (1) {}` 是无限主循环。中断发生时 Cortex-M 暂停主循环、执行中断服务链，再返回原位置；空主循环本身不是“程序停住”。实际项目可在其中放非阻塞状态机、通信处理或低功耗等待，但不应再写一段竞争同一 LED 的轮询逻辑。

CubeMX 配置里的 GPIO EXTI、触发边沿和 NVIC 缺一不可。GPIO EXTI 决定哪一条电平跳变可被捕获；上升沿、下降沿或双边沿必须与按键的上拉/下拉和按下时的真实电平一致；NVIC 使能后 CPU 才会进入对应 IRQ。抢占优先级决定一个中断能否打断另一个已在运行的低优先级中断，响应优先级只在多个待响应中断同时等待时决定先后，二者都不改变本题“只在回调内短暂翻转一次”的原则。

## 按键抖动：为什么直接骨架仍可能连跳

机械按键在一次物理按压附近会产生多次短暂跳变。若选用双边沿或有效边沿连续触发，最小骨架可能把一次按下解释成两次甚至多次中断，最终表现为 LED 看似没有变化或随机变化。题目 README 已专门提示思考消抖，因此提交前应按实际电路决定硬件 RC 消抖、只选单边沿，或添加软件时间门。

下面是可选的软件时间门；它依赖 SysTick 已正常工作。仍然不得在回调里使用 `HAL_Delay`，因为延时会占用中断上下文并阻塞其他中断。无符号减法的写法能自然处理计数器回绕。

```cpp
enum { KEY_DEBOUNCE_MS = 20U };
static uint32_t last_key_tick = 0U;

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (GPIO_Pin != KEY_Pin) {
        return;
    }

    const uint32_t now = HAL_GetTick();
    if ((uint32_t)(now - last_key_tick) < KEY_DEBOUNCE_MS) {
        return;
    }
    last_key_tick = now;
    HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);
}
```

这段代码只是候选策略，不等于“20 ms 对所有按键都正确”。若主循环也读取或写入 `last_key_tick`、按键事件标志或计数器，这类被中断与主循环共享的对象应声明为 `volatile`；如果只在本回调中访问，本例无需因为“在中断里”就盲目加 `volatile`。

## 待核验的板级事实

当前仓库没有提供任务 1 对应的 `main.h`、CubeMX `.ioc`、原理图或板卡型号。以下信息必须在实际工程或讲义中确认后才可填入，不能从题意猜测：按键的端口/引脚与 EXTI 线、LED 的端口/引脚、按下时是高还是低电平、按键应选的触发边沿、LED 高低电平与亮灭的对应关系、对应 IRQ 名称、NVIC 优先级、是否已有外部硬件消抖。`HAL_GPIO_TogglePin` 不依赖 LED 有效电平，但初始化时的“默认灭灯”和调试时的高低电平判断依赖它。

## 常见错误与最小自检

最常见的错误是只写回调却没有在 CubeMX 中开启 EXTI/NVIC；把 `HAL_Delay` 塞进中断；不筛选 `GPIO_Pin`；让主循环和中断同时控制同一 LED；误把 `GPIO_Pin` 当读到的电平；以及一按多跳却没有考虑抖动。另一个隐蔽错误是手写了回调，但生成的 IRQ handler 没有调用 `HAL_GPIO_EXTI_IRQHandler(KEY_Pin)`，此时回调永远进不去。

最小自检可按以下顺序完成：先用 `HAL_GPIO_WritePin` 在主循环中确认 LED 端口和有效电平；再给回调第一行设断点或递增一个仅供调试的计数器，确认一次有效按键能进入回调；随后检查 `GPIO_Pin` 值与目标按键掩码是否匹配；最后连续按十次，记录 LED 是否恰好翻转十次。若失败，先查看 IRQ handler、触发边沿与上拉/下拉，再处理消抖，不能先靠增加延时“碰运气”。

