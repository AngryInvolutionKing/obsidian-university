---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# 舵机接线验证与PWM脉宽换算

- 关联课程主页：[[程序设计原理]]。

推送与核验日期：2026-10-12。已核对既有专题和章目录，此题未讲过。

## 完整题干与真实路径

源文件：[task2_servo_check.cpp](<D:/CppWork/3026248210/09.5-Motor-Servo/task2_servo_check.cpp>)，绝对路径 `D:\CppWork\3026248210\09.5-Motor-Servo\task2_servo_check.cpp`。

题目要求：舵机使用 5V 供电，接在单片机的 5V 引脚上，板子 Type-C 需要外接供电；负极接 GND；控制信号使用 PWM，信号线接自己的 PWM 输出引脚；三根线连在一起，用公对母杜邦线分开。接线自检为红线到 5V、棕/黑线到 GND、橙/黄信号线到 PWM 输出脚。初始化后让舵机在几个角度之间来回走，可复用第 9 章 task3 的角度换算；抖动或不转时检查 5V 是否真的有输出及共地。交付本文件及舵机转动现象。

章 README 和题目文件已读取。关联源文件为 `D:\CppWork\3026248210\09-Timer-PWM\task3_servo_drive.cpp`：它要求先查数据手册确认控制方式、PWM 周期、脉宽与角度关系，再反推 PSC、ARR、CCR；其中仅说周期常见 20ms，没有给本舵机的实际参数。原作业源码未修改。

题目目标是把接线、供电和 PWM 时间参数连成一条可检查流程。这里的角度映射用于位置型舵机，不能直接用于把脉宽解释为速度的连续旋转舵机。

## 最小可编译示例

以下 0—180 度、1000—2000 微秒、20ms 只是电脑测试数据，不是实际舵机标定，也不能据此直接接通舵机。实际参数在确认后由配置传入。

```cpp
#include <cstdint>
#include <cmath>
#include <cassert>
#include <iostream>

struct ServoConfig {
    float angleMin, angleMax;
    uint32_t pulseMinUs, pulseMaxUs, periodUs;
    bool verified;
};

bool angleToCompare(float angle, const ServoConfig& c,
                    uint32_t tickHz, uint32_t& compare) {
    if (!c.verified || !std::isfinite(angle)
        || !std::isfinite(c.angleMin) || !std::isfinite(c.angleMax)
        || c.angleMin >= c.angleMax || tickHz == 0
        || c.pulseMinUs == 0 || c.pulseMinUs >= c.pulseMaxUs
        || c.pulseMaxUs >= c.periodUs) return false;
    if (angle < c.angleMin) angle = c.angleMin;
    if (angle > c.angleMax) angle = c.angleMax;
    double ratio = (double(angle) - c.angleMin)
                 / (double(c.angleMax) - c.angleMin);
    double pulse = c.pulseMinUs
                 + ratio * (c.pulseMaxUs - c.pulseMinUs);
    long long counts = std::llround(pulse * tickHz / 1000000.0);
    uint64_t frame = uint64_t(tickHz) * c.periodUs;
    if (frame % 1000000U != 0 || frame / 1000000U > 65536U
        || counts <= 0 || counts > 65535
        || uint64_t(counts) >= frame / 1000000U) return false;
    compare = uint32_t(counts);
    return true;
}

int main() {
    ServoConfig test{0, 180, 1000, 2000, 20000, true};
    uint32_t compare = 0;
    assert(angleToCompare(90, test, 1000000, compare));
    assert(compare == 1500);
    assert(angleToCompare(-10, test, 1000000, compare));
    assert(compare == 1000);
    assert(angleToCompare(190, test, 1000000, compare));
    assert(compare == 2000);
    test.verified = false;
    assert(!angleToCompare(90, test, 1000000, compare));
    std::cout << "servo conversion checks passed\n";
}
```

## 可替换 HAL 骨架

把结构体和换算函数存为 `servo_math.hpp`，去掉测试 main。下列绑定由自己的工程提供；`verified` 在核对型号和安全范围前保持假。PWM 通道须配置向上计数、PWM 模式 1、有效高电平及比较值预装载。

```cpp
#include "main.h"
#include "servo_math.hpp"

extern TIM_HandleTypeDef& appServoTimer;
extern const uint32_t appServoChannel;
extern const uint32_t appServoTimerClockHz;
extern const ServoConfig appServoConfig;
static uint32_t servoTickHz = 0, lastMoveMs = 0;
static unsigned nextPosition = 0;
static bool servoStarted = false;

HAL_StatusTypeDef App_ServoSetAngle(float angle) {
    uint32_t compare = 0;
    if (!angleToCompare(angle, appServoConfig, servoTickHz, compare))
        return HAL_ERROR;
    __HAL_TIM_SET_COMPARE(&appServoTimer, appServoChannel, compare);
    return HAL_OK;
}

HAL_StatusTypeDef App_ServoBegin() {
    if (servoStarted) return HAL_BUSY;
    if (appServoTimer.Init.CounterMode != TIM_COUNTERMODE_UP)
        return HAL_ERROR;
    uint32_t divisor = appServoTimer.Instance->PSC + 1U;
    if (divisor == 0 || appServoTimerClockHz == 0
        || appServoTimerClockHz % divisor != 0) return HAL_ERROR;
    servoTickHz = appServoTimerClockHz / divisor;
    uint64_t frame = uint64_t(servoTickHz) * appServoConfig.periodUs;
    if (frame % 1000000U != 0
        || uint64_t(__HAL_TIM_GET_AUTORELOAD(&appServoTimer)) + 1U
           != frame / 1000000U) return HAL_ERROR;
    float midpoint = float((double(appServoConfig.angleMin)
                          + appServoConfig.angleMax) / 2.0);
    if (App_ServoSetAngle(midpoint) != HAL_OK) return HAL_ERROR;
    HAL_StatusTypeDef status = HAL_TIM_PWM_Start(
        &appServoTimer, appServoChannel);
    if (status == HAL_OK) {
        servoStarted = true;
        lastMoveMs = HAL_GetTick();
        nextPosition = 0;
    }
    return status;
}

HAL_StatusTypeDef App_ServoStep() {
    if (!servoStarted) return HAL_ERROR;
    uint32_t now = HAL_GetTick();
    if (uint32_t(now - lastMoveMs) < 1000U) return HAL_OK;
    const double ratios[3] = {0.25, 0.5, 0.75};
    float angle = float(appServoConfig.angleMin
        + ratios[nextPosition] * (double(appServoConfig.angleMax)
                                 - appServoConfig.angleMin));
    HAL_StatusTypeDef status = App_ServoSetAngle(angle);
    if (status == HAL_OK) {
        nextPosition = (nextPosition + 1) % 3;
        lastMoveMs = now;
    }
    return status;
}
```

在生成工程完成 GPIO 和 TIM 初始化后检查 `App_ServoBegin()`；主循环调用 `App_ServoStep()`，错误状态交由上层处理。三个位置是已确认安全范围的四分之一、中间和四分之三，每秒换一次，为教学选择。此骨架没有角度传感器反馈，等待一秒不证明实际已经到位。

## 语法、API 与寄存器解析

`ServoConfig` 把角度范围、脉宽范围、周期和核验标志放在一起。常量引用形参避免复制配置，输出引用返回 CCR，布尔返回计算是否有效。`isfinite` 拒绝 NaN 和无穷大，限幅让请求留在已确认范围内。`double` 用于中间换算，`llround` 四舍五入到计数，`uint64_t` 避免周期与频率相乘时发生 32 位溢出。

角度按线性关系换成有效高电平宽度，$t_p=t_{min}+(\theta-\theta_{min})(t_{max}-t_{min})/(\theta_{max}-\theta_{min})$。这个两点线性关系须由型号说明或标定确认，不代表机械角度天然精确线性。CCR 约为 $t_p f_{CNT}$，其中秒和微秒须正确换算。

PSC 是预分频，ARR 是周期上限，CCR 是有效高电平结束的位置。向上计数、PWM 模式 1 下，$f_{CNT}=f_{TIM}/(PSC+1)$，$T=(ARR+1)/f_{CNT}$，$t_p=CCR/f_{CNT}$。若仅用测试条件且定时器时钟为 72MHz，PSC=71 得到每微秒一计数，ARR=19999 得到 20ms，CCR=1500 得到 1500 微秒。这是公式演示，实际时钟、周期和脉宽必须另行核验。舵机关注脉宽，不能把 LED 的亮度占空比换算直接照搬。

`__HAL_TIM_GET_AUTORELOAD` 读 ARR，启动前检查配置周期；`__HAL_TIM_SET_COMPARE` 写选定 CCR；`HAL_TIM_PWM_Start` 使能 PWM 输出。比较值预装载让更新在周期边界生效，降低中途改 CCR 造成异常脉冲的风险。`HAL_GetTick` 用于主循环非阻塞等待，无符号时间差支持计数回绕；它不提供角度测量。`extern` 引入实际板卡绑定，引用句柄避免复制 HAL 状态，`static` 保存运行状态。

## 控制流程、常见错误与最小自检

流程是核对舵机类型和手册→确认 5V、GND 和信号连接→核对定时器时钟与映射→填入已确认安全配置→预置中间脉宽→启动 PWM→主循环每秒切换三个位置。原题中的线色和板子供电方式已核验为讲义要求，实际线序仍应核对实物型号。

常见错误是板子 5V 引脚实际无输出、供电电流不足、没有共地、信号线接错通道、把微秒当毫秒、遗漏 PSC/ARR 的加一、套用别的型号脉宽范围，以及把连续旋转舵机当位置舵机。GPIO 极性、PWM 模式或中心对齐配置不同，也会让公式与波形不一致。

最小自检先运行电脑示例，检查中点、两端限幅和未核验配置拒绝启动；再测 NaN、错误周期和时钟配置。接实物前先测 5V 和共地，并用示波器或逻辑分析仪检查 PWM 周期与脉宽；随后在已确认范围内观察三个位置。抖动时核对供电和波形，不能未经手册确认继续扩大脉宽。没有完成实物观察就不把作业标成完成。

## 疑问与核验状态

舵机具体型号、位置型或连续旋转类型、周期、脉宽上下限、角度范围、信号有效电平、MCU 引脚与复用通道、真实定时器时钟和电源电流能力均待核验。原题未给这些参数，因此骨架采用外部配置，不能直接作为已验证的完整固件。

题干、真实路径和章 README 已核验；Context7 已读取 STM32F1 HAL PWM 接口，本地驱动源码可用于核对寄存器宏。电脑换算示例及接口模拟检查结果与硬件验证分开记录。本次未修改作业源码、未提交、未烧录或驱动实物舵机。

独立代码核验：正文最小示例及 HAL 模拟接口已用本机 g++、C++17、Wall/Wextra 和警告视为错误选项编译运行通过，检查中点换算、两端限幅、未核验配置拒绝、错误周期、三个位置切换、NaN、计时回绕及重复启动。模拟接口不验证实际供电、PWM 波形和舵机到位。
