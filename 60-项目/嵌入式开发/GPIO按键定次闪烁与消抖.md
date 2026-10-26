---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# GPIO按键定次闪烁与消抖

- 关联课程主页：[[程序设计原理]]。

推送对应日期为 2026-10-08，实际补写与核验日期为 2026-10-11。

## 完整题干与来源

真实源文件为 [task3_key_blink_times.cpp](<D:/CppWork/3026248210/05-GPIO/task3_key_blink_times.cpp>)，绝对路径 `D:\CppWork\3026248210\05-GPIO\task3_key_blink_times.cpp`。原题：“尝试按一次 KEY0 闪烁 10 次 LED0，按一次 KEY1 闪烁 5 次 LED1。”源码要求写一个次数作为参数的闪烁函数，循环完成“点亮—延时—熄灭—延时”，并思考如何保证一次按下只触发一次。章 README 与题目文件均已读取，作业源码保持原样。

目标是分别保存两个按键与两盏灯的状态，消除长按重复触发，准确累计十次或五次闪烁。这里一次闪烁定义为一次点亮并熄灭。题目允许在主循环中使用 `HAL_Delay`；本骨架采用轮询时间状态机，让两路灯可以同时运行。20 毫秒消抖、250 毫秒半周期、忙时排队追加次数均为教学设计，不是原题指定参数。

## 最小可编译示例

这段代码只验证消抖、单次触发和闪烁计数，可在电脑上独立编译运行。

```cpp
#include <cstdint>
#include <limits>
#include <cassert>
#include <iostream>

struct Button {
    bool raw = false, stable = false;
    uint32_t changed = 0;
    bool update(bool pressed, uint32_t now) {
        if (pressed != raw) { raw = pressed; changed = now; }
        if (uint32_t(now - changed) >= 20 && stable != raw) {
            stable = raw;
            return stable;
        }
        return false;
    }
};

struct Blink {
    uint32_t remaining = 0, changed = 0;
    bool on = false;
    bool add(uint32_t count, uint32_t now) {
        if (count > std::numeric_limits<uint32_t>::max() - remaining)
            return false;
        if (count == 0) return true;
        if (remaining == 0) { on = true; changed = now; }
        remaining += count;
        return true;
    }
    void update(uint32_t now) {
        if (remaining == 0 || uint32_t(now - changed) < 250) return;
        changed = now;
        if (on) { on = false; --remaining; }
        else { on = true; }
    }
};

int main() {
    Button key;
    Blink led;
    unsigned presses = 0, rises = 0;
    bool previousOn = false;
    for (uint32_t t = 0; t <= 6000; ++t) {
        bool pressed = t >= 10 && t < 1000;
        if (key.update(pressed, t)) { ++presses; led.add(10, t); }
        led.update(t);
        if (led.on && !previousOn) ++rises;
        previousOn = led.on;
    }
    assert(presses == 1 && rises == 10 && !led.on);
    std::cout << "presses=" << presses << ", flashes=" << rises << '\n';
}
```

## 可替换的 HAL 接口骨架

把上面的两个结构体放入 `key_blink.hpp`，不带测试 `main`。板卡绑定单独定义，避免猜引脚或有效电平。

```cpp
#include "main.h"
#include "key_blink.hpp"

struct GpioBinding {
    GPIO_TypeDef* port;
    uint16_t pin;
    GPIO_PinState active;
};
// 在自己的 board_bindings.cpp 中按原理图定义这两个数组。
extern const GpioBinding appKeys[2];
extern const GpioBinding appLeds[2];
static Button buttons[2];
static Blink lamps[2];

static bool isPressed(unsigned i) {
    return HAL_GPIO_ReadPin(appKeys[i].port, appKeys[i].pin)
           == appKeys[i].active;
}
static void writeLed(unsigned i, bool on) {
    GPIO_PinState off = appLeds[i].active == GPIO_PIN_SET
                     ? GPIO_PIN_RESET : GPIO_PIN_SET;
    HAL_GPIO_WritePin(appLeds[i].port, appLeds[i].pin,
                      on ? appLeds[i].active : off);
}
void App_BlinkInit() {
    uint32_t now = HAL_GetTick();
    for (unsigned i = 0; i < 2; ++i) {
        buttons[i] = Button{};
        buttons[i].raw = buttons[i].stable = isPressed(i);
        buttons[i].changed = now;
        lamps[i] = Blink{};
        writeLed(i, false);
    }
}
bool App_BlinkStep() {
    uint32_t now = HAL_GetTick();
    for (unsigned i = 0; i < 2; ++i) {
        if (buttons[i].update(isPressed(i), now))
            if (!lamps[i].add(i == 0 ? 10U : 5U, now)) return false;
        lamps[i].update(now);
        writeLed(i, lamps[i].on);
    }
    return true;
}
// 在 CubeMX 生成的 main 中，GPIO 初始化后调用 App_BlinkInit()；
// while (1) 内反复调用 App_BlinkStep()，返回 false 时处理排队溢出。
```

这是一份需要板卡绑定和生成工程的可替换骨架。初始化把当前按键状态作为基线，因此上电时已经按住的键必须先松开、再按下才触发。

## 语法与 API、寄存器解析

`struct` 把每个实体的状态放在一起；两个结构体数组保证 KEY0、KEY1 不会共用一个消抖标志。`bool` 表示逻辑按下或点亮，先把物理电平转换成逻辑含义。默认成员初始化防止第一次运行读取未定义状态。`uint32_t` 保存毫秒计时和剩余次数；`uint32_t(now-changed)` 使用无符号差计算经过时间，在单次间隔小于计数器一个周期的条件下能跨越毫秒计数回绕。

`Button::update` 先记原始状态改变的时刻，持续观察到同一状态至少 20 毫秒后才更新稳定状态，只在稳定状态变为按下时返回真。松开负责重新允许下一次触发，长按不持续触发。轮询消抖判断的是采样观察，要求主循环频繁运行，不能证明采样之间电气信号绝无抖动。

`Blink::add` 的参数是要新增的闪烁次数；`std::numeric_limits` 给出类型上限，用减法检查追加不会溢出。`update` 每到一个半周期改变相位，只在亮转灭时减少次数。因此最后一次完成后保持熄灭。主循环若临时卡顿，灯的周期会变慢，代码不会为了追赶时间跳过应有的闪烁次数。

`HAL_GPIO_ReadPin` 读取输入电平，底层对应 GPIO 输入数据寄存器 IDR；按键的上下拉、接线和有效电平共同决定“按下”。`HAL_GPIO_WritePin` 输出预先确认的亮或灭电平，STM32F1 HAL 使用置位/复位寄存器 BSRR 完成写入。`HAL_GetTick` 提供时间基准，依赖正常的 HAL tick；它不自动保证主循环执行周期。CubeMX 必须把按键配为合适的输入、灯配为输出，并使能对应 GPIO 时钟。

## 控制流程、常见错误与最小自检

控制流程为读取按键→消抖→稳定按下沿触发→相应灯追加十次或五次→按时间更新相位→输出电平。两路每轮都检查；灯忙时新的有效按下会追加次数，不覆盖之前尚未完成的闪烁。

常见错误是按电平直接触发，导致长按不断重启；把“亮一次、灭一次”计成两次；用一个状态变量同时管理两盏灯；把按键有效电平直接当作 LED 点亮电平；在主循环加入很长延时，导致消抖和第二个按键都来不及观察。

最小自检先运行电脑示例，应得到一次触发、十次点亮。再在逻辑仿真中加入短于 20 毫秒的抖动，确认不新增触发；松开并再次稳定按下应新增一批；KEY0 长按和 KEY1 单击同时进行时，应分别完成十次和五次；从接近毫秒计数上限开始测试，检查计时回绕；排队追加后的总点亮次数应等于所有批次之和。

## 疑问与核验状态

KEY0、KEY1、LED0、LED1 的实际端口、引脚、上下拉和有效电平未在这个题目文件中给全，必须据板卡原理图与现有工程核验。上述半周期和消抖时间可调整，不能当作讲义硬件参数。

题干、真实路径与 HAL API 概念已核验。电脑上的逻辑检查只能核验软件状态转移，未进行目标板构建、烧录或实物测试；不能据此声称实际按键与灯已工作。作业仓库未改动、未提交。

独立代码核验：已将正文代码原样提取，用本机 g++ 按 C++17、开启警告并视警告为错误编译。最小示例与 HAL 模拟接口检查通过，涵盖两种有效电平、两路十次/五次计数、短抖动、忙时追加和毫秒回绕。模拟 HAL 只提供软件接口环境，这些结果不验证真实 GPIO。
