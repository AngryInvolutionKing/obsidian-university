---
tags:
  - 课程笔记
  - 工程力学
  - 习题
---

# 习题 4-3：梁与刚架的支座约束力 (b)(d)(f)

![[2026-10-02-题4-3-梁与刚架支座约束力(b)(d)(f).jpg]]

**题目（4-3）**：试求下列各梁或刚架的支座约束力。（设 $A$、$B$ 处分别为固定铰支座与滚动支座；力矩以逆时针为正，$x$ 右、$y$ 上。）

## (b) 简支梁 + 斜面滚动支座

**读图**：水平梁 $AB$ 长 $3a$；$A$ 为固定铰（$F_{Ax},F_{Ay}$）；$B$ 为滚动支座，支承面与水平成 $30^\circ$（斜面右高左低），故约束力 $N_B$ 垂直于斜面、指向左上，与竖直方向成 $30^\circ$：$N_B=(-N_B\sin30^\circ,\ N_B\cos30^\circ)$。载荷：$F_1\downarrow$ 于 $x=a$，$F_2\downarrow$ 于 $x=2a$。

**解**：

$$\sum M_A=0:\quad N_B\cos30^\circ\cdot 3a-F_1\cdot a-F_2\cdot 2a=0\ \Rightarrow\ N_B=\frac{F_1+2F_2}{3\cos30^\circ}=\frac{2\sqrt{3}}{9}(F_1+2F_2)\approx0.385(F_1+2F_2)$$

$$\sum F_x=0:\quad F_{Ax}-N_B\sin30^\circ=0\ \Rightarrow\ F_{Ax}=\frac{N_B}{2}=\frac{\sqrt{3}}{9}(F_1+2F_2)\approx0.192(F_1+2F_2)\ (\rightarrow)$$

$$\sum F_y=0:\quad F_{Ay}+N_B\cos30^\circ-F_1-F_2=0\ \Rightarrow\ F_{Ay}=(F_1+F_2)-\frac{F_1+2F_2}{3}=\frac{2F_1+F_2}{3}\ (\uparrow)$$

**结论**：$N_B=\dfrac{2\sqrt3}{9}(F_1+2F_2)$，垂直斜面指向左上（偏竖直 $30^\circ$）；$A$ 处 $F_{Ax}=\dfrac{\sqrt3}{9}(F_1+2F_2)$（向右）、$F_{Ay}=\dfrac{2F_1+F_2}{3}$（向上）。

## (d) 外伸梁 + 力偶

**读图**：$A$ 为固定铰（$x=0$）；$B$ 为水平面滚动支座（$N_B\uparrow$，$x=2a$）；外伸端 $C$（$x=3a$）受 $F\downarrow$；$A、B$ 之间作用逆时针力偶 $M$（力偶位置不影响力矩方程）。

**解**：

$$\sum F_x=0:\quad F_{Ax}=0$$

$$\sum M_A=0:\quad M+N_B\cdot 2a-F\cdot 3a=0\ \Rightarrow\ N_B=\frac{3Fa-M}{2a}=\frac{3F}{2}-\frac{M}{2a}\ (\uparrow)$$

$$\sum F_y=0:\quad F_{Ay}+N_B-F=0\ \Rightarrow\ F_{Ay}=F-N_B=\frac{M-Fa}{2a}=\frac{M}{2a}-\frac{F}{2}\ (\uparrow,\ \text{若为负则实际向下})$$

**结论**：$F_{Ax}=0$；$N_B=\dfrac{3F}{2}-\dfrac{M}{2a}$（向上）；$F_{Ay}=\dfrac{M}{2a}-\dfrac{F}{2}$（代数值，正为向上）。

## (f) 门式刚架 + 水平力 + 力偶

**读图**：$A(0,0)$ 为固定铰；$B(2,0)$ 为水平面滚动支座（$N_B\uparrow$）；两柱高 $4\ \text{m}$、间距 $2\ \text{m}$；水平力 $F\rightarrow$ 作用于左柱高 $2\ \text{m}$ 处 $(0,2)$；逆时针力偶 $M$ 作用于右柱（力偶位置不限）。

**解**：

$$\sum F_x=0:\quad F_{Ax}+F=0\ \Rightarrow\ F_{Ax}=-F\quad(\text{即大小 } F,\ \leftarrow)$$

$$\sum M_A=0:\quad M-F\cdot 2+N_B\cdot 2=0\ \Rightarrow\ N_B=\frac{2F-M}{2}=F-\frac{M}{2}\ (\uparrow)$$

$$\sum F_y=0:\quad F_{Ay}+N_B=0\ \Rightarrow\ F_{Ay}=-N_B=\frac{M}{2}-F\ (\uparrow,\ \text{若为负则实际向下})$$

**结论**：$A$ 处水平反力大小 $F$、方向向左；竖直方向 $F_{Ay}=\dfrac{M}{2}-F$ 与 $N_B=F-\dfrac{M}{2}$ 等值反向（构成力偶平衡 $M$ 与 $F$ 对 $A$ 的矩）。

## 结果汇总

| 图 | $A$ 处约束力 | $B$ 处约束力 |
| --- | --- | --- |
| (b) | $F_{Ax}=\frac{\sqrt3}{9}(F_1+2F_2)\ (\rightarrow)$，$F_{Ay}=\frac{2F_1+F_2}{3}\ (\uparrow)$ | $N_B=\frac{2\sqrt3}{9}(F_1+2F_2)$，⊥斜面（偏竖直 $30^\circ$，左上） |
| (d) | $F_{Ax}=0$，$F_{Ay}=\frac{M}{2a}-\frac{F}{2}\ (\uparrow)$ | $N_B=\frac{3F}{2}-\frac{M}{2a}\ (\uparrow)$ |
| (f) | $F_{Ax}=F\ (\leftarrow)$，$F_{Ay}=\frac{M}{2}-F\ (\uparrow)$ | $N_B=F-\frac{M}{2}\ (\uparrow)$ |

**要点**：滚动支座的约束力永远**垂直于支承面**（(b) 中斜面 ⇒ 反力倾斜 $30^\circ$；(d)(f) 中水平面 ⇒ 反力竖直）；力偶在矩方程中直接加 $M$（带转向符号），与位置无关；优先对固定铰取矩，一次消去两个未知量。

**关联**：[[工程力学#五、平面一般力系的平衡条件和平衡方程|平衡条件与平衡方程]]、[[工程力学#应用平衡方程解平衡问题|应用平衡方程解平衡问题]]。
