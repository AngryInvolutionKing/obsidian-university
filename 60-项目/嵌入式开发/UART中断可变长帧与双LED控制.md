---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# UART中断可变长帧与双LED控制

- 关联课程主页：[[程序设计原理]]。

对应推送与资料核验日期：2026-10-14。已检查已讲历史，源文件未被此前专题使用。

## 完整题干与真实源文件

源文件：[exp2_it_variable_length.cpp](<D:/CppWork/3026248210/07-UART/exp2_it_variable_length.cpp>)，绝对路径 `D:\CppWork\3026248210\07-UART\exp2_it_variable_length.cpp`。

第 7 章实验 2 的完整要求是：用电脑发送消息控制两个小灯亮灭；小灯状态改变时回发哪个小灯亮或灭；一条消息能同时控制两灯；接收形式自行设计，可直接接收后拼数据，也可用 idle 接收不定长数据，只要采用中断收发即可。作业 README 还要求了解 `HAL_UART_Transmit_IT`、`HAL_UART_Receive_IT`、`HAL_UARTEx_ReceiveToIdle_IT` 在 CubeMX 默认代码下的中断时机。

本篇采用一条以换行结尾的 ASCII 帧：`L0=1,L1=0\n`。`0` 表示熄灭，`1` 表示点亮；一帧同时携带两灯目标状态。换行是本次自定义协议的帧边界，载荷不能包含未转义的换行。它满足题目“接收形式自定”的范围，不是讲义规定的唯一格式。原作业源码、README 和工程配置均未修改。

## 最小可编译示例

下面代码只验证帧组装、溢出、单槽邮箱和命令解析，不依赖 HAL，也不证明串口硬件已经工作。

```cpp
#include <array>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <cassert>
#include <iostream>
#include <string>

struct Frame {
    std::array<char, 32> text{};
    uint8_t len = 0;
};

struct LedCommand {
    bool led0 = false;
    bool led1 = false;
};

struct RxMailbox {
    Frame building{};
    Frame ready{};
    uint8_t used = 0;
    bool discarding = false;
    volatile bool readyFlag = false;
    volatile uint32_t overflowLines = 0;
    volatile uint32_t droppedLines = 0;

    // 此函数只由接收中断调用。
    void push(char byte) {
        if (byte == '\r') return;
        if (byte == '\n') {
            if (discarding) {
                discarding = false;
                used = 0;
            } else if (used != 0) {
                if (readyFlag) {
                    ++droppedLines;
                } else {
                    building.text[used] = '\0';
                    building.len = used;
                    ready = building;
                    readyFlag = true;
                }
                used = 0;
            }
            return;
        }
        if (discarding) return;
        if (static_cast<std::size_t>(used) + 1 >= building.text.size()) {
            ++overflowLines;
            used = 0;
            discarding = true;
            return;
        }
        building.text[used++] = byte;
    }

    // 在 MCU 上调用者必须在临界区内执行本函数。
    bool take(Frame& out) {
        if (!readyFlag) return false;
        out = ready;
        readyFlag = false;
        return true;
    }
};

bool parseCommand(const Frame& frame, LedCommand& command) {
    if (frame.len != 9) return false;
    const char* p = frame.text.data();
    if (p[0] != 'L' || p[1] != '0' || p[2] != '='
        || p[4] != ',' || p[5] != 'L' || p[6] != '1'
        || p[7] != '=') return false;
    if ((p[3] != '0' && p[3] != '1')
        || (p[8] != '0' && p[8] != '1')) return false;
    command.led0 = p[3] == '1';
    command.led1 = p[8] == '1';
    return true;
}

int main() {
    RxMailbox box;
    for (char c : std::string("L0=1,L1=0\r\n")) box.push(c);
    Frame frame;
    LedCommand cmd;
    assert(box.take(frame));
    assert(parseCommand(frame, cmd));
    assert(cmd.led0 && !cmd.led1);

    for (int i = 0; i < 40; ++i) box.push('x');
    box.push('\n');
    assert(box.overflowLines == 1 && !box.take(frame));
    std::cout << "variable-length line checks passed\n";
}
```

`building` 只由接收中断写，`ready` 只在一条完整且未丢弃的行出现后发布。若主循环尚未取走上一帧，下一条完整帧被计入 `droppedLines`，而不会覆盖待处理命令。超过 31 个有效字符的行进入丢弃状态，直到下一个换行重新同步。这个策略牺牲部分突发吞吐，换取可观察的有限内存行为；连续高速数据更适合 DMA 加循环缓冲区。

## 可替换的 HAL 接口骨架

把上述 `Frame`、`LedCommand`、`RxMailbox` 和 `parseCommand` 放进 `uart_line.hpp`，去掉测试 main。下面的 `Board_` 函数和临界区包装器由现有工程实现；它们不是 HAL 自带函数。`Board_QueueTx` 必须在内部复制文本，不能保存传入栈数组的裸指针。

```cpp
#include "main.h"
#include "uart_line.hpp"

extern UART_HandleTypeDef& appUart;
static uint8_t rxByte = 0;
static RxMailbox rxMailbox;
static volatile uint32_t rxRearmFaults = 0;

bool Board_SetLed(unsigned index, bool on);
bool Board_GetLed(unsigned index, bool& on);
bool Board_QueueTx(const char* data, uint8_t len);
void Board_ServiceTx();
uint32_t Board_EnterCritical();
void Board_ExitCritical(uint32_t state);

HAL_StatusTypeDef App_UartBegin() {
    rxMailbox = RxMailbox{};
    rxRearmFaults = 0;
    return HAL_UART_Receive_IT(&appUart, &rxByte, 1);
}

extern "C" void HAL_UART_RxCpltCallback(UART_HandleTypeDef* uart) {
    if (uart != &appUart) return;
    rxMailbox.push(static_cast<char>(rxByte));
    if (HAL_UART_Receive_IT(&appUart, &rxByte, 1) != HAL_OK)
        ++rxRearmFaults;
}

static void reportState(bool led0, bool led1) {
    char text[11] = {'L','0','=', led0 ? '1' : '0', ',',
                     'L','1','=', led1 ? '1' : '0', '\n', '\0'};
    Board_QueueTx(text, 10);
}

void App_UartPoll() {
    Frame frame;
    uint32_t state = Board_EnterCritical();
    bool gotFrame = rxMailbox.take(frame);
    Board_ExitCritical(state);

    if (gotFrame) {
        LedCommand cmd;
        if (parseCommand(frame, cmd)) {
            bool old0 = false, old1 = false;
            if (Board_GetLed(0, old0) && Board_GetLed(1, old1)
                && Board_SetLed(0, cmd.led0)
                && Board_SetLed(1, cmd.led1)
                && (old0 != cmd.led0 || old1 != cmd.led1)) {
                reportState(cmd.led0, cmd.led1);
            }
        } else {
            static const char error[] = "ERR\n";
            Board_QueueTx(error, 4);
        }
    }
    Board_ServiceTx();
}

extern "C" void HAL_UART_TxCpltCallback(UART_HandleTypeDef* uart) {
    if (uart == &appUart) Board_ServiceTx();
}

extern "C" void HAL_UART_ErrorCallback(UART_HandleTypeDef* uart) {
    if (uart == &appUart) ++rxRearmFaults;
}
```

UART、GPIO 和 NVIC 初始化后调用 `App_UartBegin()`；主循环持续调用 `App_UartPoll()`。生成工程中的 `USARTx_IRQHandler` 必须继续调用 `HAL_UART_IRQHandler(&appUart)`，不能建立第二份同名中断处理函数。接收回调中只做单字节组装和再次启动接收，不解析字符串、不写灯、不等待发送。

发送队列在主循环有待发文本且发送器空闲时，以 `HAL_UART_Transmit_IT` 发送队首；`HAL_UART_TxCpltCallback` 仅标记前一帧完成或启动下一帧。若发送正在进行时复用同一缓冲区，电脑将收到混合文本。`Board_QueueTx` 队列满时应返回失败并计数，不能在接收回调中阻塞等待。

## API、寄存器与控制流程

`HAL_UART_Receive_IT(&appUart,&rxByte,1)` 启动一个字节的非阻塞接收。当前 STM32F1 HAL 在接收计数归零后先关闭 RXNE、恢复 `RxState` 为 Ready，再调用 `HAL_UART_RxCpltCallback`；因此这份本地驱动可以在回调末尾重新启动一个字节接收。若接收过程中发生帧错、噪声、溢出或校验错误，HAL 走 `HAL_UART_ErrorCallback`，应记录后由主循环决定恢复策略。

F1 的 RXNE 是接收数据寄存器非空中断源，接收字节通过数据寄存器 DR 读出；TXE 表示发送数据寄存器可继续装入字节，TC 表示最后一个停止位也已经发送完；IDLE 表示总线空闲。空闲总线通常为逻辑高电平，但具体是否可作为帧边界取决于协议的发送间隔，不能把任意暂时停顿都当成可靠消息结束。

`HAL_UART_Transmit_IT` 和 `HAL_UART_Receive_IT` 都立即返回，分别在 `HAL_UART_TxCpltCallback` 和 `HAL_UART_RxCpltCallback` 中报告传输完成。CubeMX 要启用实际 USART 的 NVIC 中断并保留 HAL IRQ 转发。波特率、字长、校验、停止位和电平标准必须与电脑端一致；本题未给出 UART 实例、引脚、波特率和电气接口，不能编造。

本地 HAL 还提供 `HAL_UARTEx_ReceiveToIdle_IT`，它使用 `HAL_UARTEx_RxEventCallback` 报告 IDLE 或缓冲区填满等事件。那是一种可变长接收方案，但收到 IDLE 后仍需定义重启、缓冲区所有权和半帧处理规则。本篇选择换行协议，故只使用一字节 `HAL_UART_Receive_IT`，避免将两个帧边界机制混用。

控制流程是：电脑发送一行文本→RXNE 中断读入一个字节→回调组装或丢弃→再次武装一字节接收→主循环临界区取走完整帧→解析两灯目标→更新状态→状态变化时把报告放入 TX 队列→发送完成回调推进下一条报告。有效帧和无效帧、溢出行、队列满与重启失败都分别计数，方便诊断。

## 常见错误与最小自检

常见错误是只调用一次 `HAL_UART_Receive_IT`，导致只能收到第一个字节；把 `volatile` 当作完整并发保护；主循环与接收回调同时读写同一帧；在回调内用阻塞发送；把 CRLF 当成两条空帧；缓冲区满后仍继续写越界；不检查 `HAL_BUSY`、`HAL_ERROR` 或发送队列已满；电脑端没有发送换行；UART 两端波特率、校验或停止位不一致。

最小自检先运行电脑示例：`L0=1,L1=0\r\n` 必须解析为 LED0 点亮、LED1 熄灭；40 个无终止字符后应只计一次溢出，直到换行才恢复；上一帧未取走时下一完整行应被计为丢弃且不能覆盖旧帧；`L0=2,L1=0\n` 必须拒绝。硬件上先让电脑每秒发送一行有效帧，检查接收、状态报告和两灯同步变化；再发送过长行、错误格式和快速连续行，记录计数。没有串口抓取与灯状态证据时，不把作业标为完成。

## 疑问与核验状态

实际 UART 实例、RX/TX 引脚、板卡 3.3V 或 5V 电平标准、波特率、字长、校验、停止位、两个 LED 的引脚和点亮极性、发送队列容量及临界区实现均待核验。换行协议、32 字节接收上限和“队列满丢弃”的行为是本篇设计选择，需要和电脑端工具共同确认。

题干、真实路径、章 README、STM32F1 本地 HAL 源码和 Context7 接口资料均已核验。HAL 骨架依赖 Board 层实现，不能当作已在目标板验证的固件。本次不修改作业源码、不提交、不烧录，也不打开串口或控制 LED。

独立代码核验：正文的换行帧模块已用本机 g++、C++17、`Wall/Wextra` 和警告视为错误编译运行。测试覆盖 CRLF、两灯同帧、未消费帧保护、格式拒绝和超长帧恢复；它不模拟真实 USART 时序、NVIC、串口电平或 LED 硬件。
