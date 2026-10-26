---
type: 作业题讲解
course: 程序设计原理
topic: UART 轮询定长收发与双 LED 控制
created: 2026-10-07
source: D:/CppWork/3026248210/07-UART/exp1_polling_fixed_length.cpp
source_status: 原题与 HAL 已核验；主机模拟通过；目标工程与硬件待核验
tags: [STM32, UART, HAL, 轮询, 位运算]
---

# UART 轮询定长收发与双 LED 控制

2026-10-07：原题、章节 README 和本地 STM32F1 HAL 源码已读取。下面是可移植到目标 CubeMX 工程的教学骨架；主机模拟验证了协议和控制流程，目标工程编译、引脚配置及硬件效果仍待核验。

**原题与来源。** 真实源文件为 `D:\CppWork\3026248210\07-UART\exp1_polling_fixed_length.cpp`，章节要求为 `D:\CppWork\3026248210\07-UART\README.md`。README 记录的实验 1 完整题干如下：

```text
1、轮询接收和发送定长数据：
使用HAL_UART_Transmit，HAL_UART_Receive，用电脑发送消息控制两个小灯亮灭变化，当小灯亮
灭改变时发送哪个小灯亮/灭了
tip:可以给小灯用十六进制数编号，用0，1表示亮灭
```

原题文件目前只含 TODO：接收一帧、解析两个灯的目标状态、控制 GPIO、回发状态；`main.h` 仍被注释，`main` 直接返回。文件中的四字节数组附注“长度按你的协议定”，因此长度不是必须为四。README 的完整题干要求状态回传，框架将回传注为可选；这里按完整题干保留回传。

**目标与协议。** 电脑发送一个二进制字节，它的低两位分别规定 LED0、LED1 的目标状态：一表示亮，零表示灭；高六位必须为零。这是本讲解选定的协议，题目没有指定唯一格式。每条命令固定一字节，可以同时控制两个灯。

| 发送的十六进制字节 | LED0 | LED1 |
| --- | --- | --- |
| `00` | 灭 | 灭 |
| `01` | 亮 | 灭 |
| `02` | 灭 | 亮 |
| `03` | 亮 | 亮 |

开发板对每条合法命令回复三个二进制字节：`A5`、变化位掩码、当前状态掩码。变化位最低位为一表示 LED0 改变，第二位为一表示 LED1 改变；当前状态掩码沿用上表。重复命令也回包，变化位为零，便于电脑确认命令已处理。非法字节不改变灯，也不回包。这里回报的是软件已写入 GPIO 的状态；LED 是否实际点亮还取决于已核验的接线和有效电平。

从两个灯全灭开始，依次发送以下命令，预期收到：

```text
发 01  → 收 A5 01 01   LED0 由灭变亮
发 03  → 收 A5 02 03   LED1 由灭变亮
发 03  → 收 A5 00 03   两个灯均不改变
发 02  → 收 A5 01 02   LED0 由亮变灭
发 00  → 收 A5 02 00   LED1 由亮变灭
发 FF  → 不回包，保持原状态
```

串口助手需要选择“十六进制发送”和“十六进制接收”，关闭自动追加换行。文本模式发送字符 `1`，线上得到的是 ASCII 字节 `31`，本协议会拒绝它；十六进制模式输入 `01`，线上才是数值为一的单个字节。命令 `00` 是有效数据，不能用字符串结束符的思路处理。

**先补齐板级映射。** 在自己的目标工程中建立 `uart_led_bindings.h`，包含实际 UART 句柄的声明头，并用宏绑定下列九项。CubeMX 若独立生成外设文件，该声明头通常是 `usart.h`；若配置不同，应按实际工程调整。原题没有给出这些值，不能直接套用另一个工程的引脚。

| 宏名 | 必须绑定的内容 |
| --- | --- |
| `APP_UART_HANDLE` | 实际生成的 `UART_HandleTypeDef` 句柄对象，不能填寄存器地址或句柄指针 |
| `APP_LED0_PORT`、`APP_LED1_PORT` | 各 LED 对应的 GPIO 端口指针 |
| `APP_LED0_PIN`、`APP_LED1_PIN` | 各 LED 对应的 GPIO 引脚掩码 |
| `APP_LED0_ON`、`APP_LED1_ON` | 各 LED 点亮时使用的 `GPIO_PinState` |
| `APP_LED0_OFF`、`APP_LED1_OFF` | 各 LED 熄灭时使用的 `GPIO_PinState` |

宏定义形式例如下面这样，其中 `YOUR_UART_HANDLE` 是必须替换的占位名称，不能原样编译：

```cpp
#define APP_UART_HANDLE YOUR_UART_HANDLE
```

ON/OFF 值应依据原理图或单灯实验确定。`GPIO_PIN_SET` 表示输出高电平，`GPIO_PIN_RESET` 表示输出低电平；哪一个点亮 LED 由接法决定。目标工程还必须完成 GPIO 输出初始化、UART 收发初始化及对应时钟配置。可将双方测试参数约定为 115200 波特、8 数据位、无校验、1 停止位；这是本次建议的测试配置，不代表仓库已经完成该配置。实际 UART 实例、TX/RX 引脚、板卡型号与接口电平仍待核验。

**可替换的 C++ 应用骨架。** 下面代码保存在自己的应用源文件中，包含已补齐的映射头。在生成的初始化完成后调用它；它会持续运行轮询循环。

```cpp
#include "main.h"
#include "uart_led_bindings.h"
#include <cstdint>

// 仅用于调试查看最近一次发送状态。
volatile HAL_StatusTypeDef g_uart_led_tx_status = HAL_OK;

static void WriteLeds(std::uint8_t state)
{
    const bool led0On = (state & 0x01u) != 0u;
    const bool led1On = (state & 0x02u) != 0u;

    HAL_GPIO_WritePin(APP_LED0_PORT, APP_LED0_PIN,
                      led0On ? APP_LED0_ON : APP_LED0_OFF);
    HAL_GPIO_WritePin(APP_LED1_PORT, APP_LED1_PIN,
                      led1On ? APP_LED1_ON : APP_LED1_OFF);
}

// C 链接使 CubeMX 生成的 main.c 可以调用这个 C++ 函数。
extern "C" void App_UartLedPolling(void)
{
    std::uint8_t currentState = 0u;
    std::uint8_t rxBuf[1] = {0u};
    WriteLeds(currentState);

    while (true)
    {
        const HAL_StatusTypeDef rxStatus = HAL_UART_Receive(
            &APP_UART_HANDLE, rxBuf,
            static_cast<std::uint16_t>(sizeof(rxBuf)), 100u);

        if (rxStatus != HAL_OK)
        {
            continue;  // 不解析接收失败或超时后的缓冲区。
        }

        const std::uint8_t nextState = rxBuf[0];
        if ((nextState & 0xFCu) != 0u)
        {
            continue;  // 高六位必须为零，拒绝非法命令。
        }

        const std::uint8_t changedMask =
            static_cast<std::uint8_t>(currentState ^ nextState);

        if (changedMask != 0u)
        {
            WriteLeds(nextState);
            currentState = nextState;
        }

        // 每条合法命令都响应；重复命令的 changedMask 为零。
        std::uint8_t txBuf[3] = {0xA5u, changedMask, currentState};
        g_uart_led_tx_status = HAL_UART_Transmit(
            &APP_UART_HANDLE, txBuf,
            static_cast<std::uint16_t>(sizeof(txBuf)), 100u);
    }
}
```

如果 CubeMX 生成的是 `main.c`，在声明区添加下面的声明，并在实际 GPIO、UART 初始化均已完成后调用。保留生成的时钟和外设初始化代码，改动放在相应 USER CODE 区域。

```c
void App_UartLedPolling(void);

/* GPIO 与实际 UART 初始化完成之后： */
App_UartLedPolling();
```

**语法逐点解析。** `<cstdint>` 提供固定宽度整数类型。`std::uint8_t` 用来表示零到 255 的一个字节，适合协议数据；`std::uint16_t` 对应 HAL 参数中的接收或发送元素数量。`rxBuf[1]` 是一个元素的数组，不是指针变量。把数组名传给 HAL 时，它转换为首元素地址，HAL 才能把收到的数据写入该空间。

`sizeof(rxBuf)` 在本函数内求得整个数组的字节数，值为一；发送数组对应三。`static_cast<std::uint16_t>` 明确转换为 HAL 接口要求的长度类型。这个写法依赖当前对象确实是数组；若函数参数只是一个指针，`sizeof` 求到的是指针大小，就不能用它推断数据长度。

按位与用来取出指定的位：与 `01` 相与得到 LED0 对应位，与 `02` 相与得到 LED1 对应位；再判断结果是否非零，得到 `bool`。与 `FC` 相与用于检查高六位，存在任何保留位就拒绝命令。异或用来找出变化的位：旧状态与新状态同一位相同，结果为零；不同，结果为一。因而从 `01` 到 `03` 的变化掩码是 `02`，只改变 LED1。

条件运算符根据 `led0On` 或 `led1On` 选择 ON/OFF 电平，将协议中的逻辑状态转换为实际引脚电平。`const` 防止当前步骤中的接收结果、目标状态和变化掩码被意外改写。`continue` 结束本次循环并开始下一次，因此接收失败或命令非法时不会走到 GPIO 更新。接收成功后才读取缓冲区，可避免超时后重复执行上一次留下的数据。

`static` 修饰 `WriteLeds`，使函数只在这个源文件内可见。`extern "C"` 指定应用入口使用 C 链接名称，使生成的 C 文件能够链接到 C++ 实现；它不会把函数体变成 C 语言。`g_uart_led_tx_status` 用 `volatile` 保留调试时可观察的发送状态，`volatile` 不提供线程同步或原子性。本骨架在一个主循环中顺序操作 UART。

**HAL API 为什么需要。** `HAL_UART_Receive` 的四个参数依次是句柄地址、接收缓冲区、接收数量和超时。句柄除了标识外设，还保存配置和传输状态，因此代码传入对象地址。当前约定为 8 位、无校验，数量一对应一字节；9 位且无校验时，HAL 的数据元素可能按 16 位处理，不能照搬本骨架。接收函数在内部轮询，完成指定数量才返回成功。超时参数的单位为毫秒，等待期间当前应用流程会阻塞；轮询不需要 UART 中断回调，但 HAL 时基仍需正常运行。[ST 官方 UART 说明](https://community.st.com/stm32-mcus-60/faq-stm32-hal-uart-driver-api-and-callbacks-29)也明确区分了轮询与中断模式。

`HAL_UART_Transmit` 将三个回包字节以阻塞方式发送，返回状态保存在调试变量中。发送失败时，已经写入的 LED 状态不会回滚；电脑可以重发同一合法命令，再读取状态回包。这个发送函数使用缓冲区直到调用结束，因此本骨架的局部发送数组在调用期间有效。将来改成中断或 DMA 发送时，需要重新安排缓冲区生命周期。

`HAL_GPIO_WritePin` 接收端口指针、引脚掩码和电平状态，负责写 GPIO 输出。它不负责选择哪两个引脚，也不完成 GPIO 初始化。这里两个灯分别调用一次，并使用独立的极性映射，才能兼容两者接法不同的情况。

**寄存器与控制流程。** 下列寄存器解释以仓库 `Stm32Blink` 自带的 STM32F1 HAL 和 STM32F103xB 设备定义为例；本章目标芯片尚未确认。接收数据经过 RX 引脚和接收移位电路进入数据寄存器 `DR`，状态寄存器 `SR` 的 RXNE 位提示有待读取的数据。本地接收函数等待 RXNE，再读 `DR` 到缓冲区。发送函数先等待 TXE，向 `DR` 写入下一个数据；全部写入后再等待 TC，确认最后一帧已发送完。TXE 表示数据寄存器可以接收下一项，TC 表示传输完成，两者含义不同。

| STM32F103xB 的 SR 标志 | 位号 | 本题中的用途 |
| --- | --- | --- |
| RXNE | 5 | 提示接收数据寄存器有数据，轮询接收据此读取 |
| TXE | 7 | 提示发送数据寄存器为空，可以写下一项 |
| TC | 6 | 提示当前传输完成，阻塞发送在末尾等待它 |
| IDLE | 4 | 检测接收线空闲，本题的一字节定长接收未使用它 |

软件流程为：初始化外设并将两个灯设为灭，轮询接收一字节；接收失败就保留状态并继续，收到非法值也保留状态；合法值与旧状态异或，存在变化时写 GPIO 并更新软件记录；最后回传三个字节，再接收下一条命令。主机收到完整回包后再发下一条，便于这份顺序轮询骨架处理；发送回包期间持续灌入数据可能造成接收溢出。

**常见错误。** ASCII 文本与二进制字节混用会让正确的显示文字变成非法命令；缓冲区仍设四字节却只发一个字节，会等待不足的剩余数据并超时；忽略 HAL 返回状态会解析旧缓冲区；把逻辑亮灭直接当作 GPIO 高低电平会使低有效 LED 反着工作；UART 参数不一致、TX/RX 未交叉连接、未共地或外设未初始化，都可能导致没有有效数据。使用同一串口输出调试文本，还会混入原本固定三字节的回包。LED 映射、串口实例和引脚应先核对，再检查协议。

**最小自检。** 第一步确认实际映射头可以在目标工程编译，并先单独控制两个 LED，核实 ON/OFF 电平。第二步确认串口适配器电平与板卡兼容，连接双方 TX 到对方 RX、RX 到对方 TX，并共地，双方使用一致的 UART 参数。第三步按前面的六行示例逐条发送，收到回包后再发下一条，检查变化掩码和最终灯状态。第四步重复合法命令，确认变化位为零；发 `FF` 和文本字符 `1`，确认不改变灯。第五步停止发送超过接收超时时间，确认灯保持状态，恢复发送后仍能处理合法命令；检查最近发送状态是否为成功。

**本次验证范围。** 已在独立临时目录中用 G++、C++17 及严格警告选项编译并运行同一份应用代码，HAL 与 GPIO 使用主机模拟。检查了全部 256 个输入字节值、合法状态转换、重复命令、接收超时/忙/错误、发送超时后保留输出，以及 LED0 高有效、LED1 低有效的混合映射。主机验证通过；它验证软件协议与控制流程，不验证实际串口时序、GPIO 初始化、电气接线或目标工具链。作业仓库原文件保持未完成框架，未提交、未烧录。

本地核验入口：`D:\CppWork\3026248210\Stm32Blink\Drivers\STM32F1xx_HAL_Driver\Src\stm32f1xx_hal_uart.c` 第 1138、1224 行分别为阻塞发送和接收；`D:\CppWork\3026248210\Stm32Blink\Drivers\STM32F1xx_HAL_Driver\Inc\stm32f1xx_hal_uart.h` 第 749、750 行声明接口；`D:\CppWork\3026248210\Stm32Blink\Drivers\STM32F1xx_HAL_Driver\Inc\stm32f1xx_hal_gpio.h` 第 234 行声明 GPIO 写入接口；`D:\CppWork\3026248210\Stm32Blink\Drivers\CMSIS\Device\ST\STM32F1xx\Include\stm32f103xb.h` 第 9438—9449 行定义上述标志位。Context7 已检索 STM32CubeF1 HAL Driver 并核对接收接口，ST 员工发布的官方说明已读取。题干核验基于真实源文件及 README 摘录，本次没有另行读取 `7.UART.pdf`。
