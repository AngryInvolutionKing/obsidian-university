---
type: 作业讲解
course: 程序设计原理
tags: [课程/程序设计原理, 专题/嵌入式开发, 状态/已整理]
created: 
---

# PID速度环与采样时序

- 关联课程主页：[[程序设计原理]]。

对应推送与资料核验日期：2026-10-13。已检查当天日期和此前专题，此题未讲过。

## 完整题干与真实源文件

源文件：[task3_speed_loop.cpp](<D:/CppWork/3026248210/10-PID/task3_speed_loop.cpp>)，绝对路径 `D:\CppWork\3026248210\10-PID\task3_speed_loop.cpp`。

原题要求：在 PWM 任务已经能控制电机并记录速度的基础上，将 PID 引入电机控制，进行速度环闭环控制，并用 VOFA+、JCOM、serial 等任意示波软件展示。章 README 明确要求展示速度设定值、速度测量值和输出占空比。提交两个视频：第一段用手转动电机，展示编码器读取的速度；第二段展示输入期望速度后，电机在 PID 控制下达到期望速度的过程。

源文件的实施要求为：搬入第 9 章测速代码，统一为 rad/s 或 rpm；以固定周期执行“读速度→PID→PWM”，例如 10ms；输出限幅；按上位机协议发送曲线数据；通过串口、按键或代码阶梯值改变目标，观察阶跃响应并录制上述视频。

章目录、README、题目与 `D:\CppWork\3026248210\10-PID\pid.h`、`pid.cpp` 均已读取。PID 库目前只有 TODO，计算函数固定返回零，不能直接当成已实现算法。本篇给独立教学代码，原仓库不修改。整合作业时仍须按原要求把声明与实现分别放入头文件和源文件。

## 最小可编译示例

受控量是测得的角速度，参考量是期望角速度，控制量是归一化有符号 PWM 指令。下面的增益只用于电脑算式检查，没有为实际电机调参。代码展示条件积分和输出限幅、微分先行两个优化思路。

```cpp
#include <algorithm>
#include <cmath>
#include <cassert>
#include <iostream>

struct SpeedPid {
    float kp = 0, ki = 0, kd = 0, limit = 1;
    float integral = 0, previousFeedback = 0;
    bool primed = false;

    bool settingsValid() const {
        return std::isfinite(kp) && std::isfinite(ki)
            && std::isfinite(kd) && std::isfinite(limit)
            && kp >= 0 && ki >= 0 && kd >= 0
            && limit > 0 && limit <= 1;
    }
    void reset() {
        integral = 0; previousFeedback = 0; primed = false;
    }
    bool step(float reference, float feedback, float dt, float& out) {
        out = 0;
        if (!settingsValid() || !std::isfinite(reference)
            || !std::isfinite(feedback) || !std::isfinite(dt)
            || dt <= 0) { reset(); return false; }
        float e = reference - feedback;
        // 优化 B：微分先行，只对反馈求导，首帧不计算微分。
        float d = primed ? -kd * (feedback - previousFeedback) / dt : 0;
        float nextIntegral = integral + ki * e * dt;
        float trial = kp * e + nextIntegral + d;
        if (!std::isfinite(trial) || !std::isfinite(nextIntegral)) {
            reset(); return false;
        }
        // 优化 A：输出饱和且误差继续向外推动时，暂停积分。
        bool pushesOut = (trial > limit && e > 0)
                      || (trial < -limit && e < 0);
        if (!pushesOut) integral = nextIntegral;
        float raw = kp * e + integral + d;
        if (!std::isfinite(raw)) { reset(); return false; }
        out = std::clamp(raw, -limit, limit);
        previousFeedback = feedback; primed = true;
        return true;
    }
};

int main() {
    SpeedPid pid;
    pid.kp = 0.3f; pid.ki = 0.5f;
    float duty = 0;
    assert(pid.step(2.0f, 1.0f, 0.01f, duty));
    assert(std::fabs(duty - 0.305f) < 0.00001f);
    std::cout << "reference_radps,feedback_radps,duty\n";
    std::cout << "2,1," << duty << '\n';
    assert(!pid.step(2.0f, 1.0f, 0.0f, duty));
    assert(duty == 0 && pid.integral == 0);
}
```

首次误差为 1rad/s，比例项 0.3，积分项增加 $0.5\times1\times0.01=0.005$，微分项为零，所以输出 0.305。输出的单位是归一化指令，不能直接当作 CCR 数值。

## 可替换的采样与硬件接口骨架

将结构体放入 `speed_pid.hpp`，不带测试 main。以下 Board 函数是需要实现的应用接口，不是 HAL 已提供的函数，尚未绑定真实硬件。所有调用在同一个主循环线程进行；中断或 DMA 并发访问时需要另行同步。

```cpp
#include "main.h"
#include "speed_pid.hpp"
#include <cstdint>
#include <limits>

struct SpeedSettings {
    float kp, ki, kd, dutyLimit, maxAbsReference;
    bool verified;
};
struct SpeedSample {
    uint32_t timeMs;
    float reference, feedback, duty;
    bool valid;
};
extern const SpeedSettings appSpeedSettings;
bool Board_ResetEncoderBaseline();
bool Board_ReadOmega(float dtSeconds, float& omegaRadps);
bool Board_SetSignedDuty(float duty);
bool Board_QueueSample(const SpeedSample& sample);
void Board_ServiceTelemetry();

static SpeedPid controller;
static bool running = false, closedLoop = false;
static float target = 0;
static uint32_t lastControlMs = 0, lastReportMs = 0;
static uint32_t droppedReports = 0;

bool Control_Stop() {
    running = false; controller.reset();
    return Board_SetSignedDuty(0);
}
bool Control_Start(bool enableClosedLoop) {
    if (running) return false;
    if (!Board_SetSignedDuty(0) || !Board_ResetEncoderBaseline()) return false;
    controller.kp = appSpeedSettings.kp;
    controller.ki = appSpeedSettings.ki;
    controller.kd = appSpeedSettings.kd;
    controller.limit = appSpeedSettings.dutyLimit;
    controller.reset();
    if (enableClosedLoop && (!appSpeedSettings.verified
        || !controller.settingsValid()
        || !std::isfinite(appSpeedSettings.maxAbsReference)
        || appSpeedSettings.maxAbsReference <= 0)) return false;
    target = 0; closedLoop = enableClosedLoop;
    lastControlMs = lastReportMs = HAL_GetTick();
    running = true;
    return true;
}
bool Control_SetTarget(float reference) {
    if (!running || !closedLoop || !std::isfinite(reference)
        || std::fabs(reference) > appSpeedSettings.maxAbsReference) return false;
    target = reference;
    return true;
}
static bool Control_Fault(uint32_t now, float feedback) {
    Control_Stop();
    if (!Board_QueueSample({now, target, feedback, 0, false})) ++droppedReports;
    return false;
}
bool Control_Step() {
    if (!running) return false;
    uint32_t now = HAL_GetTick();
    uint32_t elapsed = uint32_t(now - lastControlMs);
    if (elapsed < 10U) return true;
    float omega = std::numeric_limits<float>::quiet_NaN();
    if (elapsed > 100U) return Control_Fault(now, omega);
    lastControlMs = now;
    float dt = float(elapsed) / 1000.0f;
    if (!Board_ReadOmega(dt, omega) || !std::isfinite(omega))
        return Control_Fault(now, omega);
    float duty = 0;
    if (closedLoop && !controller.step(target, omega, dt, duty))
        return Control_Fault(now, omega);
    if (!Board_SetSignedDuty(duty)) return Control_Fault(now, omega);
    if (uint32_t(now - lastReportMs) >= 50U) {
        lastReportMs = now;
        if (!Board_QueueSample({now, target, omega, duty, true})) ++droppedReports;
    }
    return true;
}
```

GPIO、编码器、PWM 与串口初始化后，第一段视频用 `Control_Start(false)` 进入仅观测模式，输出指令始终为零；主循环反复调用 `Control_Step()` 和 `Board_ServiceTelemetry()`。确认测速比例、符号和驱动逻辑后，先停机，再以 `Control_Start(true)` 启动闭环，通过 `Control_SetTarget()` 设置已确认范围内的目标。目标可由串口、按键或代码阶梯传入，返回假表示该请求未接受。

名义控制间隔 10ms、报告间隔 50ms、超过 100ms 判为调度异常，是本教学骨架选择，非讲义给出的全部参数。主循环调度存在抖动，故 PID 使用实际经过时间；若要求严格固定 10ms，应使用定时器触发或周期任务，并测量执行时间与抖动。不能用一次旧测量补算多次 PID 冒充漏掉的真实采样。

## 三个硬件接口必须完成什么

`Board_ResetEncoderBaseline` 在编码器已经启动后记录当前 CNT，作为下次求差起点。`Board_ReadOmega` 应在本次调用读取新 CNT，用传入的本次时间间隔求有符号模差并换算 $\omega=2\pi\Delta N/(N_{rev}\Delta t)$，再更新基线；回绕条件、计数倍率和每圈计数必须核对。不能只是返回未更新的上一帧缓存。此前讲义给出的 3960 仅适用于对应电机参数已经确认的情况。

`Board_SetSignedDuty` 将归一化正负指令映射到 PWM 幅值与驱动方向，保持最后指令直到下一次更新。CNT 负责测速，CCR 负责输出，ARR 决定 PWM 周期；普通向上计数、PWM 模式 1 的占空比为 $CCR/(ARR+1)$。编码器与 PWM 不共用同一定时器计数配置。停机、反转和方向电平需依实际驱动实现，不能照抄未知板卡引脚。

`Board_QueueSample` 将时间、目标、测量、输出指令和有效标志放入有界发送队列，立即返回；队列满时计数，不等待发送完成。`Board_ServiceTelemetry` 在主循环服务串口。可先用文本 CSV 检查列值，示波软件解析协议须单独确认，不能宣称任意软件默认都识别 CSV。无效标志与 NaN 表示异常，不能把故障记录成正常零速度。日志中的 duty 是控制指令，不能单靠它证明实物引脚已输出相同占空比。

## PID、语法与时间基准解析

离散计算为 $e_k=r_k-\omega_k$、$P_k=k_pe_k$、候选积分 $I_k=I_{k-1}+k_ie_k\Delta t$，微分先行项为 $D_k=-k_d(\omega_k-\omega_{k-1})/\Delta t$。积分状态保存的是积分输出项。rad/s 和 rpm 二选一并始终一致，本篇使用 rad/s；改单位后原增益也需换算，不能混用。

比例项随当前误差变动；积分项累积误差以抵消持续偏差；微分项对测量变化施加作用。饱和且误差继续把输出往外推时暂停积分，误差转向时允许积分恢复。微分先行避免仅因目标阶跃产生微分突跳，但仍会放大测速噪声；实际起步可先令 Kd 为零，逐步确认效果，示例增益不能直接用于真实电机。

`struct` 汇集参数与状态。`settingsValid() const` 只检查而不改变状态；`reset` 清除积分和上一测量，使停机后重新开始不会继承残留。输出引用返回指令，布尔返回值区分正常零输出与计算失败。`primed` 使首次调用不制造微分突跳，`isfinite` 检查输入和计算结果，`std::clamp` 实施输出限幅。

`static` 保存主循环状态，`extern const` 引入自己的已确认配置；聚合初始化构造一帧日志。`uint32_t` 无符号时间差处理毫秒回绕，在实际间隔小于一个计数周期的条件下有效。`HAL_GetTick` 读取 HAL 时间基准，本地源码返回 uwTick；必须保证其正常按毫秒推进。它不保证控制循环固定周期。名义100Hz控制与最高约20Hz曲线发送分别处理，避免阻塞式串口打印占住控制时间。

## 常见错误与最小自检

常见错误是直接使用仍返回零的 pidCalc；积分遗漏时间因子或微分遗漏除以时间；目标用 rpm、反馈用 rad/s；仅限幅输出却持续积累积分；启用微分后未考虑量化噪声；编码器符号与电机方向相反，形成正反馈；把旧测速缓存当新数据；在控制循环中长时间打印；切换模式后不复位积分；手转视频仍保持闭环驱动。

最小自检先在电脑核对首帧输出 0.305、饱和时条件积分暂停、解除饱和后可继续积分、目标跳变而反馈不变时微分不突跳，以及非法时间或 NaN 返回失败。接口模拟检查仅观测模式零输出、两种模式切换、目标范围拒绝、实际时间传入、计时回绕、超时与测量故障、队列满时不阻塞。实物先完成视频一的测速和符号核验，再检查输出范围与负反馈方向，最后调整实际增益并记录目标、速度和指令阶跃曲线；没有实物数据就不能报告已达到期望速度。

## 疑问与核验状态

板卡、编码器引脚与有效电平、电机每圈计数、驱动真值表、PWM 通道、实际时钟、安全目标范围、适用增益和示波协议均待核验。Board 接口尚需按实际工程实现，严格固定周期也需目标平台测试。

题干、章 README、库的 TODO 状态和真实路径已核验；本地 HAL 源码及 Context7 时间基准资料已读取。电脑验证与硬件验证分开记录。本次未修改作业源码、未提交、未烧录或驱动电机，原作业的两个视频尚未完成。

独立代码核验：正文最小示例、PID 算式检查、已确认配置的控制接口模拟、未确认配置的拒绝分支共四个程序，均通过本机 g++ 的 C++17 编译运行，开启 Wall/Wextra 并把警告视为错误。检查包含条件积分暂停与恢复、测量微分、实际时间步长、NaN 和溢出、仅观测零指令、目标范围、队列满、计时回绕、调度超时、测量及板级接口失败。以上只证明所列软件检查通过，未验证实际电机响应。
