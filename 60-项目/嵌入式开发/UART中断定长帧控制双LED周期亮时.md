---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# UART中断定长帧控制双LED周期亮时

- 关联课程主页：[[程序设计原理]]。

对应推送与资料核验日期：2026-10-15。已读取仓库根 README、作业清单、第 7 章 README、题目源文件和已讲专题历史；此前未讲解这个源文件。原作业仓库保持原样，未提交、未烧录。

## 完整题干与真实源文件

源文件：[exp3_it_fixed_length.cpp](<D:/CppWork/3026248210/07-UART/exp3_it_fixed_length.cpp>)，绝对路径 `D:\CppWork\3026248210\07-UART\exp3_it_fixed_length.cpp`。

源文件的完整题干是：“让两个小灯周期性亮灭，用手机蓝牙工具的专业调试功能来控制两个小灯在 1s 内亮的时间，控件形式自选。”第 7 章 README 进一步规定：小灯以 1s 为周期变化，可以分别控制两个小灯亮起的时间（ms）。题目文件固定了 `uint8_t rxFrame[8]`，并提示应与手机端约定定长格式；讲义提示专业调试模式涉及包头、包尾和校验。

## 题目目标与协议边界

目标是通过 UART 中断收到一帧固定 8 字节数据，先验证帧，再分别更新两盏灯每个一秒周期内的点亮时长。这里的“亮时”是数字输出在一个周期中保持点亮的时间，不等同于 PWM 调光或模拟亮度。

题目没有指定手机工具的二进制帧格式。下面骨架采用教学协议：字节 0、1 为包头 `0xAA, 0x55`；字节 2—3 是 LED0 的小端亮时毫秒数；字节 4—5 是 LED1 的小端亮时毫秒数；字节 6 是前六字节的异或校验；字节 7 为包尾 `0x0D`。两个亮时均限制在 0 到 1000ms。该协议只用于解释与电脑端自检；实际手机工具的包头、包尾、校验、字节序必须按它的设置替换，不能把本篇示例当作讲义已经给定的格式。

## 可替换的 HAL 代码骨架

下列代码要求在 CubeMX 生成的工程中将 `huart_user` 替换为真实 UART 句柄，并实现 `Board_WriteLed` 与临界区包装器。它是可替换的集成骨架，不是已在目标板验证的完整固件。

~~~cpp
#include "main.h"
#include <cstdint>
#include <cstring>

extern UART_HandleTypeDef huart_user;  // 替换为实际 CubeMX 生成的句柄

struct DutyTimes {
    uint16_t led0_ms;
    uint16_t led1_ms;
};

static uint8_t rxFrame[8];
static uint8_t readyFrame[8];
static volatile bool frameReady = false;
static volatile uint32_t droppedFrames = 0;
static volatile uint32_t rxRearmFailures = 0;

static DutyTimes activeDuty{0, 0};
static DutyTimes pendingDuty{0, 0};
static bool pendingReady = false;
static uint32_t cycleStartMs = 0;

// 以下三个 Board_ 函数不是 HAL 自带接口，必须按实际板卡实现。
uint32_t Board_EnterCritical();
void Board_ExitCritical(uint32_t savedState);
void Board_WriteLed(unsigned ledIndex, bool logicalOn);

static uint8_t xorFirstSix(const uint8_t frame[8]) {
    uint8_t value = 0;
    for (uint8_t i = 0; i < 6; ++i) {
        value ^= frame[i];
    }
    return value;
}

static bool decodeFrame(const uint8_t frame[8], DutyTimes& out) {
    if (frame[0] != 0xAA || frame[1] != 0x55 || frame[7] != 0x0D) {
        return false;
    }
    if (frame[6] != xorFirstSix(frame)) {
        return false;
    }

    const uint16_t led0 = static_cast<uint16_t>(frame[2])
                        | (static_cast<uint16_t>(frame[3]) << 8);
    const uint16_t led1 = static_cast<uint16_t>(frame[4])
                        | (static_cast<uint16_t>(frame[5]) << 8);
    if (led0 > 1000 || led1 > 1000) {
        return false;
    }

    out = {led0, led1};
    return true;
}

static bool takeReadyFrame(uint8_t out[8]) {
    const uint32_t savedState = Board_EnterCritical();
    const bool gotFrame = frameReady;
    if (gotFrame) {
        std::memcpy(out, readyFrame, sizeof(readyFrame));
        frameReady = false;
    }
    Board_ExitCritical(savedState);
    return gotFrame;
}

HAL_StatusTypeDef App_UartBegin() {
    frameReady = false;
    pendingReady = false;
    cycleStartMs = HAL_GetTick();
    return HAL_UART_Receive_IT(&huart_user, rxFrame, sizeof(rxFrame));
}

extern "C" void HAL_UART_RxCpltCallback(UART_HandleTypeDef* huart) {
    if (huart != &huart_user) {
        return;
    }

    if (!frameReady) {
        std::memcpy(readyFrame, rxFrame, sizeof(readyFrame));
        frameReady = true;
    } else {
        ++droppedFrames;
    }

    if (HAL_UART_Receive_IT(&huart_user, rxFrame, sizeof(rxFrame)) != HAL_OK) {
        ++rxRearmFailures;
    }
}

void App_UartAndLedService() {
    uint8_t localFrame[8];
    if (takeReadyFrame(localFrame)) {
        DutyTimes decoded{};
        if (decodeFrame(localFrame, decoded)) {
            pendingDuty = decoded;
            pendingReady = true;
        }
        // 无效帧可在这里另计数；不要修改 activeDuty。
    }

    const uint32_t now = HAL_GetTick();
    while (now - cycleStartMs >= 1000U) {
        cycleStartMs += 1000U;
        if (pendingReady) {
            activeDuty = pendingDuty;
            pendingReady = false;
        }
    }

    const uint32_t phaseMs = now - cycleStartMs;
    Board_WriteLed(0, phaseMs < activeDuty.led0_ms);
    Board_WriteLed(1, phaseMs < activeDuty.led1_ms);
}
~~~

初始化 UART、GPIO、SysTick 和 NVIC 后调用 `App_UartBegin()`，主循环持续调用 `App_UartAndLedService()`。每收到一帧，程序把新亮时暂存到 `pendingDuty`，只在下一个一秒周期边界生效，因此不会在同一周期中途突变。接收回调始终再次调用 `HAL_UART_Receive_IT`，否则只有第一帧能进入回调。

`Board_WriteLed` 内部可调用 `HAL_GPIO_WritePin`，但实际 GPIO 端口、引脚和高电平是否代表点亮均未在这道作业的源码或 README 中给出，必须按真实原理图与 CubeMX 配置核验。`Board_EnterCritical` 与 `Board_ExitCritical` 必须正确保存并恢复原中断屏蔽状态；`volatile` 只能防止编译器省略对标志的访问，不能替代这段缓冲区复制所需的临界区保护。

## 语法、API 与寄存器概念

`uint8_t rxFrame[8]` 精确表达“八个无符号字节”，避免把二进制帧当作以空字符结束的字符串。`uint16_t` 用于保存 0 到 1000 的毫秒值；小端重组时先把高字节转换为 16 位，再左移 8 位，避免在 8 位范围内丢失高位。`static` 让接收缓冲区、状态和周期起点在中断回调与主循环之间持续存在，而不会因函数返回失效。

`HAL_UART_Receive_IT(UART_HandleTypeDef*, uint8_t*, uint16_t)` 启动非阻塞定长接收；在指定字节数全部到达后，HAL 调用 `HAL_UART_RxCpltCallback`。本机 STM32F1 HAL 头文件声明了这两个接口，驱动源码说明完成接收后执行该回调。实际 `USARTx_IRQHandler` 必须保留 `HAL_UART_IRQHandler(&huart_user)`，并在 CubeMX 中启用相应 NVIC 中断，否则字节到达不会进入 HAL 回调。

接收端的 RXNE 表示接收数据寄存器非空；HAL 在中断处理中读取数据寄存器并递减剩余接收计数。回调只复制八字节帧、记录丢帧并再次武装接收，避免在中断里等待一秒、更新 GPIO 或执行长时间解析。`HAL_GetTick` 提供 HAL 的时间基准；代码把它按毫秒解释，因此工程必须使用默认的一千赫兹 HAL tick，或按实际 tick 频率换算一秒。

`HAL_GPIO_WritePin(GPIO_TypeDef*, uint16_t, GPIO_PinState)` 是本机 HAL 已声明的 GPIO 写入接口。它为什么需要 Board 层，是因为“逻辑点亮”到物理高低电平的映射取决于 LED 接法：有的板卡输出低电平点亮，有的输出高电平点亮。源码没有给出这项硬件条件，不能直接写死。

## 控制流程

手机端发送一帧八字节数据后，UART 接收中断累计满八字节，HAL 调用接收完成回调。回调把帧放入单槽邮箱，立即重启下一帧接收。主循环在临界区取出完整帧，检查包头、包尾、校验和亮时范围，合法时仅更新待生效的亮时。时间基准跨过一秒边界时，待生效值成为当前值；随后按本周期已过去的毫秒数决定两盏灯的逻辑开关。若主循环尚未消费上一帧，新帧计入 `droppedFrames`，而不会覆盖旧帧。

## 常见错误

只在初始化时调用一次 `HAL_UART_Receive_IT` 会导致第一帧之后再也收不到数据。回调中直接使用阻塞延时会卡住中断处理；将“亮时”误做成 PWM 比较值会偏离本题的周期亮灭要求；没有校验就使用长度固定的任意八字节会把噪声当命令；亮时超过 1000ms 会破坏一秒周期；缓冲区访问只加 `volatile` 而不进入临界区会发生竞争；手机端、MCU 两端的波特率、字长、校验、停止位或二进制帧格式不一致也会导致解析失败。

## 最小自检

主机端独立测试文件位于 `C:\Users\zhang\.codex\artifacts\uart-fixed-frame-20261015\protocol_test.cpp`，已用本机 g++ 的 C++17、`-Wall -Wextra -Werror` 编译运行。测试覆盖有效帧、LED0 的 250ms 亮时、LED1 的 750ms 亮时、下一周期边界生效、错误校验和和超过 1000ms 的非法值。输出为 `fixed frame and one-second pattern checks passed`。

硬件最小自检应先令手机端连续发送一帧合法协议，观察 LED0、LED1 分别在一秒中点亮相应时长；再分别测试 0ms、1000ms、错误校验和、越界亮时和连续快速发送。需要记录接收重启失败数和丢帧数。没有串口抓取、LED 现象或定时测量证据时，不应把作业标为已完成。

## 疑问与核验状态

待核验项包括实际 UART 句柄、TX/RX 引脚、波特率、字长、校验、停止位、蓝牙模块电平、两个 LED 的 GPIO 与点亮极性、手机工具真实帧格式，以及 HAL tick 是否保持一毫秒。题干、真实路径、根 README、作业清单、第 7 章 README、STM32F1 本地 HAL 接口与可移植协议逻辑已核验；真实 UART、NVIC、GPIO 和 LED 硬件均未运行验证。
