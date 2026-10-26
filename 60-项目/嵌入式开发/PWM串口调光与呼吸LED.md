---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# PWM串口调光与呼吸LED

- 关联课程主页：[[程序设计原理]]。

推送对应日期为 2026-10-09，实际补写与核验日期为 2026-10-11。

## 完整题干与来源

真实源文件为 [task1_pwm_breath_led.cpp](<D:/CppWork/3026248210/09-Timer-PWM/task1_pwm_breath_led.cpp>)，绝对路径 `D:\CppWork\3026248210\09-Timer-PWM\task1_pwm_breath_led.cpp`。源码原题要求新建 STM32F103ZET6 工程，SYS 配 Serial Wire、外部晶振、主频 72 MHz，将板载 LED 引脚（以 PB5 为例）配置为 PWM 输出，实现比较值逐渐增加再减少的呼吸灯。

同时，[本章 README](<D:/CppWork/3026248210/09-Timer-PWM/README.md>) 的正式任务还要求串口收到 `a` 增加亮度、收到 `d` 减少亮度、收到 `z` 开始呼吸；CCR 在 0—99 变化、呼吸包络更新频率为 100 Hz。本篇把串口控制与呼吸一起讲解，保留这些正式要求。源码与 README 已读取，作业源文件未修改。

目标是区分高频 PWM 载波与低频亮度包络，用状态保存手动或呼吸模式，同时轮询单字节命令。每次手动调节 5 个比较值单位、重复 `z` 不重启相位，是本骨架明确采用的行为。

## 最小可编译示例

```cpp
#include <cstdint>
#include <cassert>
#include <iostream>

struct Brightness {
    uint32_t phase = 0, duty = 0, last = 0;
    bool breathing = true;
    void command(char c, uint32_t now) {
        if (c == 'a') {
            breathing = false;
            duty = duty >= 94 ? 99 : duty + 5;
        } else if (c == 'd') {
            breathing = false;
            duty = duty <= 5 ? 0 : duty - 5;
        } else if (c == 'z' && !breathing) {
            breathing = true; phase = duty; last = now;
        }
    }
    void update(uint32_t now) {
        if (!breathing) return;
        uint32_t steps = uint32_t(now - last) / 10;
        if (steps == 0) return;
        last += steps * 10;
        phase = (phase + steps % 198) % 198;
        duty = phase <= 99 ? phase : 198 - phase;
    }
};
int main() {
    Brightness b;
    b.update(990); assert(b.duty == 99);
    b.update(1980); assert(b.duty == 0);
    b.command('a', 1980); assert(b.duty == 5 && !b.breathing);
    b.command('d', 1980); assert(b.duty == 0);
    b.command('z', 1980); b.update(1990);
    assert(b.duty == 1 && b.breathing);
    std::cout << "brightness state checks passed\n";
}
```

## 可替换 HAL 骨架

将结构体存为 `brightness.hpp`，去掉示例 `main`。外部绑定的句柄和通道必须按实际生成工程定义。

```cpp
#include "main.h"
#include "brightness.hpp"

extern TIM_HandleTypeDef& appLedTimer;
extern UART_HandleTypeDef& appCommandUart;
extern const uint32_t appLedChannel;
static Brightness brightness;

HAL_StatusTypeDef App_PwmBegin() {
    if (appCommandUart.Init.WordLength != UART_WORDLENGTH_8B
        || appCommandUart.Init.Parity != UART_PARITY_NONE) return HAL_ERROR;
    if (__HAL_TIM_GET_AUTORELOAD(&appLedTimer) != 99U) return HAL_ERROR;
    brightness = Brightness{};
    brightness.last = HAL_GetTick();
    __HAL_TIM_SET_COMPARE(&appLedTimer, appLedChannel, 0U);
    return HAL_TIM_PWM_Start(&appLedTimer, appLedChannel);
}
HAL_StatusTypeDef App_PwmStep() {
    uint8_t byte = 0;
    uint32_t now = HAL_GetTick();
    HAL_StatusTypeDef status = HAL_UART_Receive(&appCommandUart, &byte, 1, 0);
    if (status == HAL_OK) brightness.command(static_cast<char>(byte), now);
    else if (status != HAL_TIMEOUT) return status;
    brightness.update(now);
    __HAL_TIM_SET_COMPARE(&appLedTimer, appLedChannel, brightness.duty);
    return HAL_OK;
}
// GPIO、UART、TIM 初始化后调用 App_PwmBegin()，检查返回状态；
// 主循环反复调用 App_PwmStep()，不要同时让另一个接收模块使用该 UART。
```

这是接口骨架，需要自己的句柄绑定、PWM 通道配置和错误处理；未完成实际板卡接线与构建验证。

## 语法、API 与寄存器为什么需要

`phase` 表示三角波相位，0—197 共 198 步；映射到比较值后形成 0—99—0 的周期。每 10 毫秒走一步，理论完整周期为 1.98 秒。`last += steps*10` 保留不足一整步的余量；主循环稍慢时按经过时间计算相位，不通过长延时占住处理器。`command` 中 `a`、`d` 退出呼吸并限幅，`z` 只在手动进入呼吸时重新设定相位，避免连续收到 `z` 使呼吸一直从头开始。

`extern` 引入在其他编译单元定义的硬件绑定，引用句柄避免复制 HAL 的状态对象；这些名字是应用自己定义的接口，不是 HAL 内置句柄名。`static` 让状态只在本文件内部使用，且跨主循环调用保存。`static_cast<char>` 明确把接收字节用于字符命令。比较表达式全部放在代码块中，笔记正文不使用行内双等号。

定时器的 PSC 决定预分频，ARR 决定计数周期，CCR 决定比较位置。在向上计数、PWM 模式 1 的通常配置下，计数器从零到 ARR，载波频率为 $f_{\mathrm{TIM}}/((PSC+1)(ARR+1))$，有效占空比为 $CCR/(ARR+1)$。若实际定时器时钟为 72 MHz，拟用 PSC=71、ARR=99，则载波为 10 kHz；这是建议配置，实际定时器时钟须检查 APB 分频及其倍频规则。

100 Hz 是比较值更新频率，不是 PWM 载波。ARR=99 时 CCR=99 对应 99% 的有效占空比；不能因为数字上限是 99 就把它说成 100%。本骨架保留题目要求的 0—99 范围。点亮时的物理极性须由 LED 接线与 PWM 输出极性共同确定。

`HAL_TIM_PWM_Start` 使能 PWM 通道，并在普通非从模式条件下启动计数；不必再无条件叠加 `HAL_TIM_Base_Start`。`__HAL_TIM_GET_AUTORELOAD` 读 ARR，用来核对代码尺度与配置一致；`__HAL_TIM_SET_COMPARE` 写所选 CCR 寄存器，改变 PWM 有效时间。`HAL_UART_Receive` 的长度为 1、超时为零，尝试立即接收一个字节；无数据的超时用于继续主循环，其他错误单独返回。这个骨架适用于低速人工命令，若要求连续高速流应改用中断或 DMA 接收。

PB5 在 STM32F103 对应 TIM3_CH2 的部分重映射路线；ST 官方 RM0008 的 TIM3 引脚映射表及 AFIO_MAPR 描述已用 `pdfread search/text` 核对。配置需要启用 AFIO 并选择 TIM3 部分重映射，不能把 PB5 当作默认 TIM3_CH2 引脚。该对应关系不证明用户板载 LED 实际接在 PB5。

## 控制流程、常见错误与最小自检

初始化比较值为零并启动 PWM；每轮尝试取一个命令，更新模式或手动比较值，然后按当前毫秒时间推进呼吸相位并写 CCR。未知字符、回车、换行不改变模式。

常见错误是把 PWM 载波设成 100 Hz；在长延时循环中调 CCR，期间无法响应串口；ARR 改了而比较值尺度不改；PB5 没做重映射；两个接收模块争用同一 UART；用 GPIO 写电平去干预已经配置为复用 PWM 的引脚。

最小自检先运行电脑示例，检查 990 毫秒峰值、1980 毫秒归零及手动切换。再测试多次 `a`、`d` 不越界，重复 `z` 不重置正在进行的相位，以及毫秒回绕。目标板检查应先用逻辑分析仪或示波器测载波频率及比较值，再观察亮度；肉眼亮度不是准确占空比测量。

## 疑问与核验状态

实际 LED 引脚与点亮极性、串口实例与引脚、板上晶振频率、定时器时钟及所用通道仍须对照原理图和生成工程核验。PB5 是原题示例，不能当作已确认的板卡接线。

原题、章任务、STM32F1 HAL 的 PWM 与串口接口、RM0008 映射说明已核验。代码为可替换骨架；未构建目标固件、未烧录、未运行实物。电脑逻辑自检只覆盖亮度状态机，不覆盖硬件配置，作业仓库未修改或提交。

独立代码核验：正文最小示例与 HAL 骨架已用本机 g++ 的 C++17 模式编译并运行。ARR 检查、三角相位峰谷、手动上下限、重复 z、毫秒回绕和 UART 忙状态检查通过；没有验证实际 PWM 时钟、引脚映射或串口电气条件。

字节格式条件：此骨架明确选择八位数据、无校验的串口配置，启动时检查格式；这是教学骨架的约束，实际串口格式仍须与发端共同核验。STM32F1 HAL 在九位且无校验时按 uint16_t 元素接收，不能把同样调用直接用于本例的单字节缓冲区。波特率与停止位按具体工程和发端配置核对。
