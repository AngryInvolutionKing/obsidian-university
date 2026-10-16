---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# UART上位机四通道波形帧与采样率

- 关联课程主页：[[程序设计原理]]。

对应推送与资料核验日期：2026-10-16。已读取仓库根 README、作业清单、第 7 章 README、题目源文件、HAL 接口和既有专题历史；此前未讲解此源文件。原作业仓库保持原样，未提交、未烧录。

## 完整题干与真实源文件

源文件：[exp4_scope_waveform.cpp](<D:/CppWork/3026248210/07-UART/exp4_scope_waveform.cpp>)，绝对路径 `D:\CppWork\3026248210\07-UART\exp4_scope_waveform.cpp`。

第 7 章实验 4 的完整要求是：“使用 VOFA+ 或 JCOM 或 Android 手机端蓝牙调试器 app 显示 sin x、sin 2x、cos x、cos 2x 的图像。”源文件进一步要求先选定上位机、弄清其帧格式，例如 VOFA+ 的 firewater 或 justfloat 协议；自行确定采样间隔并检查串口波特率是否足够；随后打包四个值并通过串口发送。提交物是本文件及上位机截图或视频。

## 题目目标与协议边界

目标是以稳定采样周期生成四个浮点通道并通过 UART 连续输出，让上位机把它们绘制为四条曲线。题目没有指定上位机、波特率或线上协议，因而不能把某种 CSV、firewater 或 justfloat 格式写成唯一答案。

下方骨架使用一条**教学用 ASCII CSV 行**：

~~~text
sin(x),sin(2x),cos(x),cos(2x)\n
~~~

它便于用串口终端检查，亦可作为支持 CSV 行输入工具的测试协议。若选用 VOFA+、JCOM 或手机 app 的其他格式，必须按该工具的文档替换 `formatCsv` 和发送端帧尾；本篇不声称 CSV 是这些软件的已核验默认协议。

## 可替换的代码骨架

~~~cpp
#include "main.h"
#include <cmath>
#include <cstdint>
#include <cstdio>

extern UART_HandleTypeDef huart_user;  // 替换为实际 CubeMX 句柄

struct Waves {
    float sin_x;
    float sin_2x;
    float cos_x;
    float cos_2x;
};

static constexpr uint32_t kSamplePeriodMs = 20U;  // 教学设置：50 Hz
static float phase_x = 0.0F;
static uint32_t nextSampleMs = 0U;
static volatile uint32_t droppedFrames = 0U;

// Board_QueueTx 必须复制数据；调用后不能保存栈数组的裸指针。
bool Board_QueueTx(const uint8_t* data, uint16_t size);
void Board_ServiceTx();

static Waves makeWaves(float x) {
    return {
        std::sin(x),
        std::sin(2.0F * x),
        std::cos(x),
        std::cos(2.0F * x),
    };
}

static bool formatCsv(const Waves& w, char out[80], uint16_t& used) {
    const int count = std::snprintf(
        out, 80, "%.6f,%.6f,%.6f,%.6f\n",
        static_cast<double>(w.sin_x),
        static_cast<double>(w.sin_2x),
        static_cast<double>(w.cos_x),
        static_cast<double>(w.cos_2x));

    if (count < 0 || count >= 80) {
        return false;
    }
    used = static_cast<uint16_t>(count);
    return true;
}

void App_WaveStreamBegin() {
    phase_x = 0.0F;
    nextSampleMs = HAL_GetTick();
}

void App_WaveStreamService() {
    const uint32_t now = HAL_GetTick();

    while (now - nextSampleMs >= kSamplePeriodMs) {
        nextSampleMs += kSamplePeriodMs;

        const Waves w = makeWaves(phase_x);
        phase_x += static_cast<float>(kSamplePeriodMs) / 1000.0F;

        char frame[80];
        uint16_t used = 0;
        if (!formatCsv(w, frame, used)
            || !Board_QueueTx(reinterpret_cast<const uint8_t*>(frame), used)) {
            ++droppedFrames;
        }
    }

    Board_ServiceTx();
}

extern "C" void HAL_UART_TxCpltCallback(UART_HandleTypeDef* huart) {
    if (huart == &huart_user) {
        Board_ServiceTx();
    }
}
~~~

初始化 UART、NVIC 和 HAL tick 后调用 `App_WaveStreamBegin()`，主循环反复调用 `App_WaveStreamService()`。`Board_QueueTx` 应维护一个有限长度发送队列；当 UART 空闲时以 `HAL_UART_Transmit_IT` 发送队首，`HAL_UART_TxCpltCallback` 触发后再推进下一帧。若只把局部数组地址交给非阻塞发送函数，函数返回后数组失效，串口数据可能被后续栈内容覆盖。

## 语法、API 与寄存器概念

`std::sin` 和 `std::cos` 的输入是弧度。代码中的 `phase_x` 每 20ms 增加 0.02，因此基础波周期约为 $2\pi$ 秒；`sin(2x)` 与 `cos(2x)` 的频率是前两条的两倍。`struct Waves` 将四路值绑定为一个采样时刻，避免四次独立计算导致时间戳不一致。

`std::snprintf` 返回本应写入的字符数，不含末尾空字符。骨架检查返回值，防止格式化文本超出 80 字节缓冲区。该文本帧只是可替换的教学协议；真正采用二进制浮点帧时还须确认浮点字节序、帧尾和上位机所需的同步字。

`HAL_GetTick` 返回 HAL 的时间基准。代码把它解释为毫秒，因此项目需要保留默认的一千赫兹 HAL tick，或按实际 tick 频率换算 `kSamplePeriodMs`。用 `while` 补追未发送的采样时刻，可避免一次主循环变慢后永久拖慢平均采样节奏；若发送队列已满，当前骨架计入 `droppedFrames`，不阻塞主循环。

`HAL_UART_Transmit_IT(UART_HandleTypeDef*, const uint8_t*, uint16_t)` 启动中断式非阻塞发送，并在整帧发送完成后调用 `HAL_UART_TxCpltCallback`。实际 `USARTx_IRQHandler` 必须转发到 `HAL_UART_IRQHandler(&huart_user)`，且 CubeMX 中要启用对应 NVIC 中断。TXE 表示发送数据寄存器可再装入数据；TC 表示最后一个停止位已离开串口。上位机的一帧边界不能靠 TXE 推断，而应由所选协议中的换行、帧尾或固定长度规定。

若使用八位数据、无校验、一位停止位，一字节在线上通常占十个比特。以每帧最多约 40 个 ASCII 字节、每秒 50 帧估算，所需线路速率约为 $40\times10\times50=20000$ bit/s；这只说明 115200 bit/s 常见配置下有余量，不是本作业实际波特率的证据。实际设置必须以蓝牙模块和上位机的配置为准。

## 控制流程

HAL tick 到达下一采样时刻后，主循环生成同一相位下的四个三角函数值，序列化为一帧并压入发送队列。队列的传输服务在 UART 空闲时启动中断发送；UART 发送完成回调继续服务队列。上位机按其约定的边界解出四个数，再把四个通道分别绘图。发送不及时时保留丢帧计数，不能为了“每一帧都发出”在主循环或中断里等待。

## 常见错误

常见错误包括把角度当作弧度、在主循环每次迭代都调用 `HAL_UART_Transmit_IT` 而不处理忙状态、把栈上缓冲区交给未完成的异步发送、没有保留 `HAL_UART_IRQHandler` 转发、只改采样周期却未重新估算带宽、CSV 末尾没有上位机要求的分隔符、二进制浮点帧的字节序不一致，以及把上位机显示平滑误认为 MCU 的真实采样率。选用 Bluetooth 串口模块时，还要确认模块与 MCU 的 UART 电平兼容，不能直接假定为同一电平标准。

## 最小自检

主机端独立测试文件位于 `C:\Users\zhang\.codex\artifacts\uart-waveform-20261016\waveform_test.cpp`，已用本机 g++ 的 C++17、`-Wall -Wextra -Werror` 编译运行。测试核对 $x=0$ 时四路值为 $0,0,1,1$，核对 $x=\pi/2$ 时四路值为 $1,0,0,-1$，并确认 CSV 帧含三个逗号和换行。输出为 `four-channel waveform checks passed`。

硬件最小自检应先按照选定上位机文档发送一帧静态已知值，确认四通道顺序；再在 $x=0$、$x=\pi/2$ 附近截取数据，检查数值关系。随后运行连续流，记录上位机截图或视频、实际波特率、采样周期、丢帧数和发送错误数。没有这些证据时，不能把作业标为已完成。

## 疑问与核验状态

待核验项包括实际 UART 句柄、TX 引脚、NVIC 名称、波特率、字长、校验、停止位、Bluetooth 模块电平、上位机名称及真实协议、上位机通道顺序和帧边界。题干、真实源路径、第 7 章 README、本机 STM32F1 HAL 接口与通用四路波形逻辑已核验；真实 UART 发送、上位机绘图和硬件电平均未运行验证。
