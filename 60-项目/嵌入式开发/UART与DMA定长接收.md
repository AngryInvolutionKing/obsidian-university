---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# UART与DMA定长接收

- 关联课程主页：[[程序设计原理]]。

推送对应日期与资料核验日期均为 2026-10-11。此题与已讲的 UART 轮询定长收发不同，重点是 DMA 接收、中断回调和缓冲区所有权。

## 完整题干与真实来源

源文件为 [task1_uart_dma.cpp](<D:/CppWork/3026248210/08-DMA/task1_uart_dma.cpp>)，绝对路径 `D:\CppWork\3026248210\08-DMA\task1_uart_dma.cpp`。原题以 STM32F103ZETx 的串口 4 Rx 为例，要求：（1）DMA Settings 中 Add，选择 Rx 或 Tx；（2）配置优先级、Normal 或 Circular 模式、数据宽度；（3）在 NVIC Settings 中开启串口全局中断；（4）启动 DMA 接收；（5）在传输完成回调中置标志；（6）主循环处理 128 字节缓冲区，并思考 `volatile` 的作用和两种 DMA 模式的差别。

[章 README](<D:/CppWork/3026248210/08-DMA/README.md>) 给出的四道思考题原文为：“1. 说明启用串口 DMA 时 CubeMX 的相关配置过程；2. 说明 DMA 中断发生的整个流程；3. DMA 的‘地址增量’配置有什么意义？外设地址和内存地址是否都需要开启增量？为什么？4. 在 DMA 循环模式下，若缓冲区大小为 128 字节，当第 130 个字节到来时，缓冲区中的数据会如何变化？此时 CPU 读取数据需要注意什么？”

本篇选择 Normal 模式、单次 128 字节完整块接收，便于先理解 CPU 何时可以安全处理数据。题目标题涉及收发，明确给出的动手场景是 Rx；发送 DMA 可在理解同样的启动与完成流程后独立扩展。本骨架没有声称已完成连续高速收发系统。

## 最小可编译示例

先在电脑上模拟“一块接满后停止写入、主循环处理后再接收”的所有权规则。

```cpp
#include <array>
#include <cstdint>
#include <cassert>
#include <iostream>

struct NormalReceiver {
    std::array<uint8_t, 128> data{};
    unsigned position = 0;
    bool receiving = false, ready = false;
    void begin() { position = 0; receiving = true; ready = false; }
    bool feed(uint8_t byte) {
        if (!receiving) return false;
        data[position++] = byte;
        if (position == data.size()) { receiving = false; ready = true; }
        return true;
    }
    uint32_t checksum() const {
        uint32_t sum = 0;
        for (uint8_t byte : data) sum += byte;
        return sum;
    }
};
int main() {
    NormalReceiver receiver;
    receiver.begin();
    for (unsigned i = 0; i < 128; ++i) assert(receiver.feed(uint8_t(i)));
    assert(receiver.ready && receiver.checksum() == 8128);
    assert(!receiver.feed(130));
    std::cout << "full block checksum=" << receiver.checksum() << '\n';
    receiver.begin(); assert(receiver.feed(7));
}
```

这模拟的是缓冲区规则，未模拟 USART、DMA 或真实中断。额外字节不能直接进入停止的接收过程，提示 Normal 模式重新启动之间存在接收空隙。

## 可替换的 HAL 接收骨架

```cpp
#include "main.h"
#include <cstdint>

extern UART_HandleTypeDef& appDmaUart;
static constexpr uint16_t RX_LEN = 128;
static uint8_t rxBuffer[RX_LEN];
static volatile bool blockReady = false;
static volatile bool receiveFault = false;
volatile uint32_t appDmaBlocks = 0;
volatile uint32_t appDmaChecksum = 0;
volatile uint32_t appDmaErrorCode = 0;

HAL_StatusTypeDef App_DmaBegin() {
    if (appDmaUart.Init.WordLength != UART_WORDLENGTH_8B
        || appDmaUart.Init.Parity != UART_PARITY_NONE) return HAL_ERROR;
    if (appDmaUart.hdmarx == nullptr) return HAL_ERROR;
    if (appDmaUart.hdmarx->Init.Mode != DMA_NORMAL) return HAL_ERROR;
    blockReady = false; receiveFault = false;
    appDmaErrorCode = 0;
    return HAL_UART_Receive_DMA(&appDmaUart, rxBuffer, RX_LEN);
}
extern "C" void HAL_UART_RxCpltCallback(UART_HandleTypeDef* uart) {
    if (uart == &appDmaUart) blockReady = true;
}
extern "C" void HAL_UART_ErrorCallback(UART_HandleTypeDef* uart) {
    if (uart != &appDmaUart) return;
    appDmaErrorCode = uart->ErrorCode;
    receiveFault = true;
}
HAL_StatusTypeDef App_DmaStep() {
    if (receiveFault) {
        blockReady = false;
        HAL_StatusTypeDef status = HAL_UART_AbortReceive(&appDmaUart);
        return status == HAL_OK ? HAL_ERROR : status;
    }
    if (!blockReady) return HAL_OK;
    blockReady = false;
    uint32_t sum = 0;
    for (uint16_t i = 0; i < RX_LEN; ++i) sum += rxBuffer[i];
    appDmaChecksum = sum;
    ++appDmaBlocks;
    return HAL_UART_Receive_DMA(&appDmaUart, rxBuffer, RX_LEN);
}
// 在生成的 GPIO、DMA、UART 初始化后调用 App_DmaBegin()。
// 主循环调用 App_DmaStep()，失败时记录状态并停止正常处理；
// 查明错误后才重新调用 App_DmaBegin()，不要在回调中长时间处理数据。
```

骨架要求项目已有正确的 UART—DMA 句柄连接和 IRQ 转发。若生成工程已定义同名回调，应在已有回调中合并逻辑，不能定义两份。接收缓冲区是静态数组，其寿命覆盖异步 DMA；不能把函数栈上的临时数组交给 DMA 后立即返回。

## 语法、API、寄存器与配置解析

`static constexpr` 给出编译期缓冲区长度，`uint8_t` 表示字节，`uint16_t` 与 HAL 长度参数相符。`extern` 引入自己的 UART 绑定，引用句柄避免复制内部状态。`nullptr` 检查 DMA 接收句柄已配置。C++ 中的 `extern "C"` 保证回调按 C 链接名称覆盖 HAL 的弱回调，回调参数还必须匹配原型。

`volatile` 让主循环实际读取可能在中断中更新的标志，不能把它优化成永远不变。它没有让整个缓冲区变成线程安全对象，也不能阻止 DMA 在 Circular 模式下继续覆盖内存。本骨架在 Normal 模式的完成回调之后处理数据，随后才重新启动，缓冲区所有权是正确性的关键。这里累加字节仅用于方便检查，并不是用于检测通信错误的强校验协议。

CubeMX 需要选择 Peripheral-to-Memory、外设地址固定、内存地址递增、两侧数据宽度均为字节，并选择 Normal 模式。USART 接收数据寄存器位置固定，每个新字节都从相同外设地址读取；内存地址递增才能依次写入缓冲区不同位置。优先级按其他 DMA 通道负载选择，不能把提高优先级当作无限吞吐量保证。

DMA 的外设地址寄存器 CPAR 指向 USART 数据寄存器，内存地址寄存器 CMAR 指向缓冲区，计数寄存器 CNDTR 随传输递减。`HAL_UART_Receive_DMA` 设置接收状态和 DMA，启动后立即返回；此时主循环可做其他工作，不能立即认为整块数据已经到齐。128 字节传完后，DMA 完成标志引发相应 DMA 通道中断，生成的 IRQ Handler 调用 `HAL_DMA_IRQHandler`，再由 HAL 的 UART 接收完成路径调用 `HAL_UART_RxCpltCallback`。回调只置标志，主循环随后处理。

必须开启实际 Rx DMA 通道的 IRQ，并让它转发到对应 DMA 句柄；串口全局 IRQ 也按原题开启并调用 `HAL_UART_IRQHandler`，用于 UART 错误等事件。不能把 DMA 块完成中断说成仅由串口 IRQ 代替。DMA 请求通道、UART 引脚及中断函数名必须从所用芯片和生成工程确定。

`HAL_UART_AbortReceive` 在故障后终止接收；骨架记录错误并让上层处理，未把自动重试伪装成无丢包恢复。`HAL_OK` 表示启动或处理成功，不表示通信内容正确；`HAL_BUSY`、`HAL_ERROR` 等都应保留检查。Normal 模式到齐后停止，下一块需要重新启动；如果发端不停发送，处理和重启间隙可能导致丢字节或溢出。该骨架适合发端按块发送并留出间隔的入门验证，持续高速流应另做循环缓冲和溢出检测设计。

## 循环缓冲区第 130 个字节

假设从第 1 个字节开始依次填充一个 128 字节 Circular 缓冲区：第 1—128 个字节占据下标 0—127；第 129 个覆盖下标 0，第 130 个覆盖下标 1。因此此时下标 0、1 存最新两个字节，下标 2—127 仍存第 3—128 个字节。原来的第 1、2 个字节已被覆盖。

CPU 不能把整个数组从下标零顺读当作最新数据的时间顺序，也不能仅凭一次完成标志证明没有覆盖未处理数据。需要维护读写位置、按半满或完成事件处理安全区段，并监测消费者跟不上生产者的情况。单看 CNDTR 的瞬时位置不能得知此前已经绕过多少整圈。这个问题属于循环模式扩展，本篇 Normal 骨架没有解决它。

## 控制流程、常见错误与最小自检

控制流程为初始化和检查 DMA→启动完整块接收→DMA 搬运→DMA IRQ→完成回调置标志→主循环处理静止缓冲区→重新启动。错误回调记录错误，主循环中止接收并上报。

常见错误是 DMA 启动后马上读整块；只开 UART IRQ 却漏掉 DMA IRQ；两侧都开地址增量；把 Normal 骨架直接改成 Circular 却仍在完成后读取整块；把中断标志当作无丢包保证；在回调中做长延时或大量串口打印；缓冲区太短寿命；未检查重启返回值。

最小自检先运行电脑例子，0—127 的 128 字节总和应为 8128。逻辑接口检查中，127 字节不能报告完成，第 128 字节才产生一块；完成后未重启的下一字节应报告无法接收。目标板先按块发送包含零字节的二进制 128 字节数据，确认块数和校验和；留出处理间隔，再尝试连续发送观察空隙限制。不要把带字符串结束符的字符串长度误当作固定二进制块长度。

## 疑问与核验状态

实际板卡是否为讲义示例的 STM32F103ZETx、使用哪个 UART 实例、引脚与 USB 转串口电平、DMA 通道和 IRQ、波特率、PC 发端留出的块间隔，均待按现有工程核验。题目未规定变长帧协议；本骨架只有完整 128 字节回调，不包含 IDLE 变长接收。

源题与 README 已核验；Context7 已检索 STM32F1 HAL 的 DMA 接收和回调路径，并以本地驱动源码核对接口。电脑示例只验证块缓冲逻辑，没有运行真实 DMA。未修改作业源码、未构建目标固件、未提交或烧录。

独立代码核验：正文最小示例与 HAL 模拟接口程序已用本机 g++ 的 C++17 模式编译并运行。127/128 字节完成边界、校验和、停止接收时的缓冲区所有权、重新启动、非目标 UART 回调和错误状态检查通过；DMA 总线时序、实际 IRQ 和持续流丢包尚未实测。

字节格式条件：此骨架明确选择八位数据、无校验的串口配置，启动时检查格式；这是教学骨架的约束，实际串口格式仍须与发端共同核验。STM32F1 HAL 在九位且无校验时按 uint16_t 元素接收，不能把同样调用直接用于本例的单字节缓冲区。波特率与停止位按具体工程和发端配置核对。
