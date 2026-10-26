---
type: 作业题讲解
course: 北洋机甲电控培训
topic: GPIO 按键轮询与 LED 输出
source_status: 已核验本地原题；未在目标板编译或烧录
tags: [嵌入式, STM32, GPIO, HAL, 按键, LED]
---

# GPIO 按键控制 LED（轮询）

## 原题

实现“按下 KEY0 时 LED0 亮起，按下 KEY1 时 LED1 亮起”。讲义建议把按键配置为 `GPIO_Input`，持续检测电平变化。

题目框架：[task2_key_control_led.cpp](file:///D:/CppWork/3026248210/05-GPIO/task2_key_control_led.cpp)。配套要求：[05-GPIO/README.md](file:///D:/CppWork/3026248210/05-GPIO/README.md)。源码中的 `main.h` 仍被注释，且没有给出目标板实际引脚号、LED 极性或完整 CubeMX 工程，因此下面给出的是可替换的 HAL 结构，尚未宣称已在硬件上运行。

## 先确定控制逻辑

这是轮询，不是“按一下翻转一次”。`while (1)` 每转一轮就读一次两个按键，把每个按键当前的 `GPIO_PIN_SET` 或 `GPIO_PIN_RESET` 翻译成布尔值，再独立写回对应 LED。两个按键要用两个独立判断；写成 `if ... else if ...` 会导致同时按住时只能更新其中一个 LED。

讲义推荐输入上拉。上拉输入通常意味着未按下为高电平、按下把引脚接地后为低电平；但这仍取决于实际原理图。讲义提出“为什么 LED 亮要保持低电压”，说明该板很可能低电平点亮，但不能代替实测。把“按下”和“点亮”各自写成常量，改板卡时只需改常量。

## HAL 代码骨架

```cpp
#include "main.h"

// 以下四项必须按原理图或单灯实验确认。
constexpr GPIO_PinState KEY0_PRESSED_LEVEL = GPIO_PIN_RESET;
constexpr GPIO_PinState KEY1_PRESSED_LEVEL = GPIO_PIN_RESET;
constexpr GPIO_PinState LED0_ON_LEVEL = GPIO_PIN_RESET;
constexpr GPIO_PinState LED0_OFF_LEVEL = GPIO_PIN_SET;
constexpr GPIO_PinState LED1_ON_LEVEL = GPIO_PIN_RESET;
constexpr GPIO_PinState LED1_OFF_LEVEL = GPIO_PIN_SET;

void keyScan(void)
{
    const bool key0Pressed =
        HAL_GPIO_ReadPin(KEY0_GPIO_Port, KEY0_Pin) == KEY0_PRESSED_LEVEL;
    const bool key1Pressed =
        HAL_GPIO_ReadPin(KEY1_GPIO_Port, KEY1_Pin) == KEY1_PRESSED_LEVEL;

    HAL_GPIO_WritePin(LED0_GPIO_Port, LED0_Pin,
        key0Pressed ? LED0_ON_LEVEL : LED0_OFF_LEVEL);
    HAL_GPIO_WritePin(LED1_GPIO_Port, LED1_Pin,
        key1Pressed ? LED1_ON_LEVEL : LED1_OFF_LEVEL);
}

int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();

    while (1) {
        keyScan();
    }
}
```

`KEY0_GPIO_Port`、`KEY0_Pin` 等名称不是本题源文件已给出的事实，而是 CubeMX 常见的宏名占位。应以生成的 `main.h` 为准替换。题目文件后缀为 `.cpp`，所以上例中的 `constexpr` 可以使用；若把同一逻辑放进 CubeMX 生成的 C 文件，则可改用 `const` 或 `#define`。

## 语法与 API 逐点解析

`void keyScan(void)` 声明一个不返回结果的函数。C 里参数表的 `void` 明确表示“无参数”；C++ 中它与空参数表等价。把扫描逻辑放进函数能使 `while (1)` 只承担“持续执行”的职责。

`GPIO_PinState` 是 HAL 用来表示引脚电平的枚举类型，常见取值为 `GPIO_PIN_RESET` 和 `GPIO_PIN_SET`。`HAL_GPIO_ReadPin(KEY0_GPIO_Port, KEY0_Pin)` 返回当前电平；随后将该返回值与“KEY0 被按下时应有的电平”常量 `KEY0_PRESSED_LEVEL` 比较，得到一个 `bool` 结果。`const bool` 表示该轮扫描得到的判断结果之后不再修改。

`?:` 是条件运算符：`条件 ? 真值 : 假值`。因此 `key0Pressed ? LED0_ON_LEVEL : LED0_OFF_LEVEL` 的意思是“KEY0 被按下时取点亮电平，否则取熄灭电平”。`HAL_GPIO_WritePin(端口, 引脚, 电平)` 才是真正把输出寄存器设为相应电平的调用。

`while (1)` 的条件恒为真，因此控制器会不断扫描。这里不需要 `HAL_Delay`：题意要的是按住期间 LED 保持对应状态。若改成“按一次闪烁若干次”，才需要额外做边沿检测、消抖和状态机，不能沿用这一段简单轮询逻辑。

## CubeMX 与最小自检

在 CubeMX 中，把 KEY0、KEY1 设置为 `GPIO_Input`，按原理图选择 Pull-up 或 Pull-down；把 LED0、LED1 设置为 `GPIO_Output`、Push-Pull。生成代码后确认 `MX_GPIO_Init()` 已在初始化阶段执行，并检查 `main.h` 中实际的端口与引脚宏名。

依次验证：只按 KEY0 时只 LED0 亮；只按 KEY1 时只 LED1 亮；同时按住时两灯都亮；松开后均熄灭。若松手后仍亮，先检查 `OFF_LEVEL`；若不按也随机变化，检查输入是否悬空；若两个按键互相抢占，检查是否错误使用了 `else if`。这些现象均比盲目改逻辑更能定位问题。
