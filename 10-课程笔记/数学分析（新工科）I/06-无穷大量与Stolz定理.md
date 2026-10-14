---
课程: 数学分析（新工科）I
章节: 2.3 无穷大量
讲义日期: 2026-10-10
tags:
  - 数学分析
  - 数列极限
  - 无穷大量
  - Stolz定理
---

# 06-无穷大量与 Stolz 定理

> **讲义**：2026-10-10，§2.3 无穷大量。
> **上游**：[[05-数列极限]]（2.2 数列极限的定义与性质）
> **下游**：[[07-数列的收敛准则与无理数e]]（2.4 收敛准则、自然常数 e）

## 目录

- [[#1. 定义 2.3.1（无穷大量）]]
- [[#2. 例 2.3.1（几何数列的无穷大性）]]
- [[#3. 例 2.3.2（有理式的无穷大性）]]
- [[#4. 定理 2.3.2（无穷小量与无穷大量的关系）]]
- [[#5. 无穷大量的四则运算性质]]
- [[#6. 定理 2.3.3（无穷大量与有下界数列之积）]]
- [[#7. 例 2.3.3（有理分式的极限）]]
- [[#8. 待定型与 Stolz 定理]]
- [[#9. 定理 2.3.4（Stolz 定理）]]
- [[#10. Stolz 定理的几何解释]]
- [[#11. 例 2.3.4～2.3.5（Stolz 定理的应用）]]
- [[#12. 易错点与小结]]

---

## 1. 定义 2.3.1（无穷大量）

（讲义 2026-10-10：一、无穷大量。）

数列极限的 $\varepsilon$-$N$ 定义（[[05-数列极限#1. 定义 2.2.1（数列极限的 ε-N 定义）|定义 2.2.1]]）要求极限 $a$ 是**与 $n$ 无关的给定常数**，不含 $\pm\infty$。本节把"极限为 $\pm\infty$"单独定义，注意它**不是**极限存在。

**定义 2.3.1.** 设 $\{a_n\}$ 为数列，$G>0$ 为任意给定的正数（对应 $\varepsilon$-$N$ 定义中的 $\varepsilon$，越小越好；这里反过来，越大越好）。

**(1) 正无穷大**：若 $\forall G>0$，$\exists N\in\mathbb N^*$，s.t. 当 $n>N$ 时有 $a_n>G$，则称 $\{a_n\}$ 为**正无穷大量**，记作
$$\lim_{n\to\infty}a_n=+\infty .$$

**(2) 负无穷大**：若 $\forall G>0$，$\exists N\in\mathbb N^*$，s.t. 当 $n>N$ 时有 $a_n<-G$，则称 $\{a_n\}$ 为**负无穷大量**，记作
$$\lim_{n\to\infty}a_n=-\infty .$$

**(3) 无穷大**：若 $\forall G>0$，$\exists N\in\mathbb N^*$，s.t. 当 $n>N$ 时有 $|a_n|>G$，则称 $\{a_n\}$ 为**无穷大量**。

> **注意 (1)(3) 的区别**：$+\infty$ 要求**最终全都**很大且为正，而"无穷大"只要求**绝对值**最终很大，符号可以反复跳。例：$\{n\}$ 是正无穷大，$\{(-2)^n\}$ 是无穷大。$+\infty$ 成立则"无穷大"必成立，反之不然。

**数列发散且趋于 $\pm\infty$，极限仍属"不存在"**，只是把这种特定的发散方式起了名字、给了记号。

### 与"无穷小量"的对比

定义 2.2.1 中的极限为 $0$ 的数列称为**无穷小量**（讲义 2026-09-30）：$\forall\varepsilon>0$，$\exists N\in\mathbb N^*$，$n>N$ 时 $|a_n|<\varepsilon$。把 $\varepsilon$ 换成 $G$、把 $|a_n|<\varepsilon$ 换成 $a_n>G$，"越小越好"换成"越大越好"，就得到无穷大量——两者是同一种"$\varepsilon$-$N$ 句式"的大小两个方向。

---

## 2. 例 2.3.1（几何数列的无穷大性）

**例 2.3.1.** 若 $|g|>1$，证明 $\{g^n\}$ 是无穷大量。

**证明：** 设 $G>1$（$G\le 1$ 时任何 $n$ 都自动满足 $|g|^n>G$，只需取 $N=1$，故不妨设 $G>1$）。

要使 $|g|^n>G$，两边取对数（$|g|>1\Rightarrow\ln|g|>0$，不等号方向不变）得
$$n>\frac{\ln G}{\ln|g|}=\log_{|g|}G,$$
故取 $N=\left[\log_{|g|}G\right]+1\in\mathbb N^*$，则当 $n>N$ 时必有 $|g|^n>G$。由定义 2.3.1(3)，
$$\lim_{n\to\infty}g^n=\infty\qquad(|g|>1). \qquad\blacksquare$$

> **注**：$|g|>1$ 时极限记作 $\infty$ 而**不是** $+\infty$，因为 $g<0$ 时 $g^n$ 的符号正负交替。结合 [[05-数列极限#4. 例 2.2.4（Cauchy 命题）|例 2.2.4]]：$|g|<1$ 时 $g^n\to 0$（无穷小量），$|g|>1$ 时 $g^n\to\infty$（无穷大量）——这正是 [[06-无穷大量与Stolz定理#4. 定理 2.3.2（无穷小量与无穷大量的关系）|定理 2.3.2]] 的倒数关系。

---

## 3. 例 2.3.2（有理式的无穷大性）

**例 2.3.2.** 证明 $\lim\limits_{n\to\infty}\dfrac{n^2-1}{n+5}=+\infty$。

**证明：** 先做**放缩**找一个更简单的下界。当 $n>5$ 时，
$$\frac{n^2-1}{n+5}>\frac{n^2}{n+5}>\frac{n^2}{n+n}=\frac n2 .$$

$\forall G>0$，取 $N=[2G]+5\in\mathbb N^*$，则当 $n>N$ 时
$$\frac{n^2-1}{n+5}>\frac n2>G\ \Longrightarrow\ \lim_{n\to\infty}\frac{n^2-1}{n+5}=+\infty . \qquad\blacksquare$$

> **注（放缩的方向）**：要证"$>G$"就得**往下界放**（把分子缩小、分母放大），放出来的量还要**趋于 $+\infty$**。这里分母 $n+5$ 放大成 $2n$（只要 $n>5$ 就成立），分子 $n^2-1$ 缩小成 $n^2$，得 $\dfrac n2$。**放缩必须在"最终"成立**（$n>5$ 以后），这正对应定义里那个 $N$。

---

## 4. 定理 2.3.2（无穷小量与无穷大量的关系）

**定理 2.3.2.** 设 $x_n\ne 0$，则
$$\{x_n\}\text{ 是无穷大量}\iff\left\{\frac1{x_n}\right\}\text{ 是无穷小量}.$$

**证明：**

**（$\Rightarrow$）** 设 $\{x_n\}$ 是无穷大量。$\forall\varepsilon>0$，要证最终 $\left|\dfrac1{x_n}-0\right|<\varepsilon$。

由无穷大量定义（定义 2.3.1(3)），取 $G=\dfrac1\varepsilon>0$，则 $\exists N\in\mathbb N^*$，当 $n>N$ 时有
$$|x_n|>G=\frac1\varepsilon\iff\left|\frac1{x_n}\right|<\varepsilon .$$
故 $\lim\limits_{n\to\infty}\dfrac1{x_n}=0$，即 $\left\{\dfrac1{x_n}\right\}$ 是无穷小量。

**（$\Leftarrow$）** 设 $\left\{\dfrac1{x_n}\right\}$ 是无穷小量。$\forall G>0$，要证最终 $|x_n|>G$。

由无穷小量定义，取 $\varepsilon=\dfrac1G>0$，则 $\exists N\in\mathbb N^*$，当 $n>N$ 时有
$$\left|\frac1{x_n}\right|<\varepsilon=\frac1G\iff|x_n|>G .$$
故 $\lim\limits_{n\to\infty}x_n=\infty$。$\blacksquare$

> **关键一步**：两个方向都是"把要证的结论当作已知极限里的 $\varepsilon$ 或 $G$ 反解出来"——$G=\frac1\varepsilon$ 与 $\varepsilon=\frac1G$ 互为倒数。这说明**无穷大量与无穷小量在 $\varepsilon$-$N$ 语言下完全对称**，只是"小"与"大"的追求方向相反。

**注.** $x_n>0$ 时更精细：
$$\{x_n\}\text{ 是正无穷大量}\iff\left\{\frac1{x_n}\right\}\to 0^{+}.$$

---

讲义原始板书（2026-10-10，共 5 页）：

![[40-Attachments/数学分析（新工科）I/2026-10-10-定义2.3.1-无穷大量.jpg|板书 p1：定义 2.3.1 正无穷大/负无穷大/无穷大；例 2.3.1 $|g|>1\Rightarrow g^n\to\infty$；例 2.3.2；定理 2.3.2 证明开头（2026-10-10）]]
![[40-Attachments/数学分析（新工科）I/2026-10-10-定理2.3.2-倒数关系.jpg|板书 p2：定理 2.3.2 双向证明收尾 + 注 $x_n>0$ 时 $\{x_n\}$ 正无穷大 $\iff\{1/x_n\}\to0^+$；无穷大量的四则运算性质 (1)(2)(3)；定理 2.3.3 与两推论；例 2.3.3 有理分式的极限（2026-10-10）]]
![[40-Attachments/数学分析（新工科）I/2026-10-10-待定型与Stolz定理.jpg|板书 p3：注"无穷大量 $\Rightarrow$ 无界，反之不然"；待定型 $0\cdot\infty$、$\infty-\infty$、$0^0$、$\frac\infty\infty$、$1^\infty$；定理 2.3.4 Stolz 定理（$*/\infty$ 型，离散的 L'Hospital 法则）；证明 Case 1 开始（2026-10-10）]]
![[40-Attachments/数学分析（新工科）I/2026-10-10-Stolz定理证明.jpg|板书 p4：Stolz 定理 Case 1（$a$ 有限）证明全过程——由差分夹逼推出 $-\varepsilon<\frac{x_n}{y_n}-a<\varepsilon$；Case 2（$a=+\infty$，化为 Case 1 的倒数）；Case 3（$a=-\infty$）（2026-10-10）]]
![[40-Attachments/数学分析（新工科）I/2026-10-10-Stolz应用与几何解释.jpg|板书 p5：Stolz 定理的几何解释（把 $(y_n,x_n)$ 看作 $xy$ 平面上的点列 $M_n$，$y_n\uparrow+\infty$）；例 2.3.4（Cauchy 命题，即例 2.2.4 的新证法）；例 2.3.5 $\lim\frac{1^k+2^k+\cdots+n^k}{n^{k+1}}=\frac1{k+1}$（2026-10-10）]]

---

## 5. 无穷大量的四则运算性质

（讲义 2026-10-10：二、无穷大量的性质。）

**(1) 同号相加保持：**
$$(+\infty)+(+\infty)=+\infty,\qquad(-\infty)+(-\infty)=-\infty .$$

**(2) 反向相减为同号无穷：**
$$(-\infty)-(+\infty)=-\infty,\qquad(+\infty)-(-\infty)=+\infty .$$

**(3) 同号相乘为正、异号相乘为负：**
$$(+\infty)\cdot(+\infty)=+\infty,\qquad(-\infty)\cdot(+\infty)=-\infty,\qquad(-\infty)\cdot(-\infty)=+\infty .$$

> **注（为什么只列这几条）**：这些记号是**简写**，每一步背后都是定义 2.3.1 的直接验证。**没有**列出的组合正是 [[06-无穷大量与Stolz定理#8. 待定型与 Stolz 定理|待定型]]：$(+\infty)+(-\infty)$、$0\cdot\infty$、$\dfrac\infty\infty$ 都没有确定答案，必须具体问题具体分析。

---

## 6. 定理 2.3.3（无穷大量与有下界数列之积）

**定理 2.3.3.** 设 $\{x_n\}$ 是无穷大量，$\{y_n\}$ 满足：$\exists N_0\in\mathbb N^*$ 与 $\delta>0$，s.t. 当 $n>N_0$ 时有 $|y_n|>\delta>0$（即 $y_n$ **最终有正的下界**），则
$$\{x_n y_n\}\text{ 是无穷大量}.$$

**证明思路：** $\forall G>0$，由 $\{x_n\}$ 是无穷大量，$\exists N_1$，$n>N_1$ 时 $|x_n|>\dfrac G\delta$。取 $N=\max\{N_0,N_1\}$，当 $n>N$ 时
$$|x_n y_n|=|x_n|\cdot|y_n|>\frac G\delta\cdot\delta=G . \qquad\blacksquare$$

> **注（"$\delta$ 不能省"）**：条件必须是"最终 $|y_n|$ 有**正**下界"，不能只写"$y_n\ne0$"——例如 $y_n=\dfrac1n$ 处处非零，但 $n\cdot\dfrac1n=1$ 不是无穷大量。**取 $N=\max\{N_0,N_1\}$** 是本课程反复出现的合流手法（对照 [[05-数列极限#6. 定理 2.2.4（夹逼性/迫敛性）|定理 2.2.4]] 的 $N=\max\{N_0,N_1,N_2\}$）。

**推论 1.** 若 $\{x_n\}$ 是无穷大量，$\lim\limits_{n\to\infty}y_n=b\ne0$，则 $\{x_ny_n\}$ 与 $\left\{\dfrac{x_n}{y_n}\right\}$ 均为无穷大量。

（由 [[05-数列极限#5. 定理 2.2.3（保序性）|定理 2.2.3]] 的推论：$b\ne0$ 时最终 $|y_n|>\dfrac{|b|}2>0$，取 $\delta=\dfrac{|b|}2$ 即可用定理 2.3.3。）

**推论 2.** $C\ne0$ 为常数，$\{x_n\}$ 是无穷大量 $\Rightarrow\{Cx_n\}$ 为无穷大量。

（取 $y_n\equiv C$，$\delta=|C|$。）

---

## 7. 例 2.3.3（有理分式的极限）

**例 2.3.3.** 讨论 $\lim\limits_{n\to\infty}\dfrac{a_0n^k+a_1n^{k-1}+\cdots+a_{k-1}n+a_k}{b_0n^l+b_1n^{l-1}+\cdots+b_{l-1}n+b_l}$，其中 $k,l\in\mathbb N^*$，$a_0\ne0$，$b_0\ne0$，$a_i,b_i\in\mathbb R$。

**结论（按 $k$ 与 $l$ 的大小分三种情形）：**

| 情形 | 极限 | 理由 |
|---|---|---|
| $k<l$ | $0$ | 分母次数高，"分母跑得更快" |
| $k=l$ | $\dfrac{a_0}{b_0}$ | 最高次项系数之比 |
| $k>l$ | $\infty$ | 分子次数高，是无穷大量 |

**证明（$k<l$ 的情形）：** 分子分母同除以 $n^l$（$l$ 是两者的较大次数）：
$$\text{原式}=\lim_{n\to\infty}\frac{\dfrac{a_0}{n^{l-k}}+\dfrac{a_1}{n^{l-k+1}}+\cdots+\dfrac{a_k}{n^l}}{b_0+\dfrac{b_1}{n}+\cdots+\dfrac{b_l}{n^l}} .$$
由 $l-k\ge1$，分子每一项都是 $\dfrac{\text{常数}}{n^{\text{正整数}}}\to0$，故分子 $\to0$；分母 $\to b_0+0=b_0\ne0$。由[[05-数列极限#1. 定义 2.2.1（数列极限的 ε-N 定义）|极限的商法则]]（分母极限非零）得原式 $=\dfrac0{b_0}=0$。

**另两种情形：** $k=l$ 时同除 $n^k$ 立刻得 $\dfrac{a_0}{b_0}$；$k>l$ 时同除 $n^l$，分子 $\to a_0\ne0$、分母 $\to b_0\ne0$，由推论 1（取 $x_n$ 为分子、$b\ne0$ 为分母极限）得原式 $=\infty$。

> **板书错误示范（红叉）**：直接写成 $\lim\limits_{n\to\infty}\dfrac{a_0n^k}{b_0n^l}$ 是**错的**——分子分母的**低次项一个都不能丢**（它们决定同除之后分子/分母是否还有非零极限），正确做法是"同除较高次数、把每一项的走向一条条看清"。这条错误示范与 [[05-数列极限#6. 定理 2.2.4（夹逼性/迫敛性）|定理 2.2.4]] 板书里的循环论证同属"想当然跳步"。

---

## 8. 待定型与 Stolz 定理

**注（重要区分）：**
$$\text{无穷大量}\ \Longrightarrow\ \text{无界},\qquad\text{反之不然}.$$

即**无界只是无穷大的必要条件**。反例：$x_n=\begin{cases}n,&n\text{ 为偶数}\\0,&n\text{ 为奇数}\end{cases}$ 无界，但取 $G=1$ 时 $n$ 奇数处 $|x_n|=0\not>1$，故不是无穷大量。

**二、待定型（未定式）及 Stolz 定理 —— 解决 $\dfrac{**}{**}$ 型未定式**

$$\frac00,\qquad \infty-\infty,\qquad 0^0,\qquad \frac{\infty}{\infty},\qquad 1^{\infty}$$

> **为什么叫"待定"**：这些记号本身不携带信息，结果完全取决于**两个数列各自趋于 $0$ 或 $\infty$ 的"速度"**。

**两条预处理约定：**

1. **有限项不影响数列的极限**——所以考虑数列极限时可以只关心"**自某项之后**"的性质（考察"最终"性质）。
2. **"单调"也可以弱化为"自某项之后单调"**——这也是 [[06-无穷大量与Stolz定理#9. 定理 2.3.4（Stolz 定理）|Stolz 定理]] 里要求"$\{y_n\}$ 最终严格单调"的原因。

---

## 9. 定理 2.3.4（Stolz 定理）

**定理 2.3.4（Stolz 定理，$\dfrac{**}{\infty}$ 型）.** 设 $\{y_n\}$ 是**最终严格单调**的**正无穷大量**，且
$$\lim_{n\to\infty}\frac{x_{n+1}-x_n}{y_{n+1}-y_n}=a\qquad(a\text{ 为有限数、}+\infty\text{ 或 }-\infty),$$
则
$$\lim_{n\to\infty}\frac{x_n}{y_n}=a .$$

> 这是**离散的 L'Hospital 法则**：把"求导"换成"求差分"，把"$\dfrac00$ 或 $\dfrac\infty\infty$"换成"分母是无穷大量"。注意它**只解决 $\dfrac{**}{\infty}$ 型**（分母必须是无穷大量）。

### 证明（用极限的定义证）

**Case 1：$a$ 为有限数。**

由 $\lim\limits_{n\to\infty}\dfrac{x_n-x_{n-1}}{y_n-y_{n-1}}=a$ 知，$\forall\varepsilon>0$，$\exists N_1\in\mathbb N^*$，当 $n>N_1$ 时有
$$a-\frac\varepsilon2<\frac{x_{n+1}-x_n}{y_{n+1}-y_n}<a+\frac\varepsilon2 .$$

即对每个 $k>N_1$，
$$\left(a-\frac\varepsilon2\right)(y_{k+1}-y_k)<x_{k+1}-x_k<\left(a+\frac\varepsilon2\right)(y_{k+1}-y_k).$$

$\{y_n\}\uparrow+\infty$，故最终 $y_{k+1}-y_k>0$（严格单调递增）。把 $k=N_1+1,N_1+2,\dots,n-1$ 的这些不等式**相加**（不等号方向不变，且中间项 $x_{N_1+2},\dots,x_{n-1}$ 全部** telescoping 抵消**），得
$$\left(a-\frac\varepsilon2\right)(y_n-y_{N_1})<x_n-x_{N_1}<\left(a+\frac\varepsilon2\right)(y_n-y_{N_1}).$$

除以 $y_n>0$ 并减去 $a$：
$$-\frac\varepsilon2+\frac{x_{N_1}-\left(a-\frac\varepsilon2\right)y_{N_1}}{y_n}<\frac{x_n}{y_n}-a<\frac\varepsilon2+\frac{x_{N_1}-\left(a+\frac\varepsilon2\right)y_{N_1}}{y_n} \tag{①}$$

（这里需 $n>N_2>N_1$ 使 $y_n>0$ 以保证除法方向；$N_1$ 固定后 $\left(a\mp\dfrac\varepsilon2\right)y_{N_1}$ 都是**常数**。）

又 $\lim\limits_{n\to\infty}y_n=+\infty$，故 $\lim\limits_{n\to\infty}\dfrac{x_{N_1}-\left(a\pm\frac\varepsilon2\right)y_{N_1}}{y_n}=0$（**常数除以无穷大量**，由[[06-无穷大量与Stolz定理#4. 定理 2.3.2（无穷小量与无穷大量的关系）|定理 2.3.2]]）。于是 $\exists N_3>N_2$，当 $n>N_3$ 时
$$\left|\frac{x_{N_1}-\left(a\pm\frac\varepsilon2\right)y_{N_1}}{y_n}\right|<\frac\varepsilon2 . \tag{②}$$

当 $n>N_3$ 时由 ①② 得
$$-\varepsilon=-\frac\varepsilon2-\frac\varepsilon2<\frac{x_n}{y_n}-a<\frac\varepsilon2+\frac\varepsilon2=\varepsilon,$$
即 $\lim\limits_{n\to\infty}\dfrac{x_n}{y_n}=a$。

**Case 2：$a=+\infty$。**

由 $\lim\limits_{n\to\infty}\dfrac{x_{n+1}-x_n}{y_{n+1}-y_n}=+\infty$，$\exists N\in\mathbb N^*$，当 $n>N$ 时 $\dfrac{x_{n+1}-x_n}{y_{n+1}-y_n}>1$；又最终 $y_{n+1}-y_n>0$，故
$$x_{n+1}-x_n>y_{n+1}-y_n>0,$$
于是 $\{x_n\}$ **自某项后严格单调递增**，且 $x_n-x_N>y_n-y_N$，由 $y_n\to+\infty$ 得 $\{x_n\}$ 是**正无穷大量**，从而 $\dfrac{y_n}{x_n}\to0^{+}$（定理 2.3.2），即
$$\lim_{n\to\infty}\frac{y_{n+1}-y_n}{x_{n+1}-x_n}=0^{+}.$$
对数列对 $\{y_n\},\{x_n\}$ 应用 **Case 1**（此时 $a=0$），得 $\lim\limits_{n\to\infty}\dfrac{y_n}{x_n}=0^{+}$，再由定理 2.3.2 取倒数得
$$\lim_{n\to\infty}\frac{x_n}{y_n}=+\infty .$$

**Case 3：$a=-\infty$。**

由 $\lim\limits_{n\to\infty}\dfrac{x_{n+1}-x_n}{y_{n+1}-y_n}=-\infty$ 得 $\lim\limits_{n\to\infty}\dfrac{(-x_{n+1})-(-x_n)}{y_{n+1}-y_n}=+\infty$，对 $\{-x_n\}$ 用 Case 2 得 $\lim\limits_{n\to\infty}\dfrac{-x_n}{y_n}=+\infty$，故
$$\lim_{n\to\infty}\frac{x_n}{y_n}=-\infty . \qquad\blacksquare$$

> **证明结构回顾**：Case 2、Case 3 都是**化归到 Case 1**（取倒数 / 取相反数），真正需要 $\varepsilon$ 论证的只有 Case 1。Case 1 的三步是：**① 由差分不等式逐项相加得 telescoping 夹逼；② 得 ① 式（把 $\frac{x_n}{y_n}-a$ 夹在"$\pm\frac\varepsilon2$ + 常数/$y_n$"之间）；③ 用"常数/无穷大量 $\to0$"把那个常数项压到 $\frac\varepsilon2$ 以下**。这是"固定块 + 尾块"手法的又一次出现（对照 [[05-数列极限#4. 例 2.2.4（Cauchy 命题）|例 2.2.4]]）。

---

## 10. Stolz 定理的几何解释

**把 $(y_n,x_n)$ 看成 $xy$ 平面上的点 $M_n$，$y_n\uparrow+\infty$。**

![[40-Attachments/数学分析（新工科）I/2026-10-10-Stolz定理几何解释-点列斜率.jpg|板书：Stolz 定理的几何解释——点列 $M_1,M_2,\dots,M_n$ 沿 $y$ 轴方向越走越远，$\frac{x_n}{y_n}$ 是 $OM_n$ 的斜率，$\frac{x_{n+1}-x_n}{y_{n+1}-y_n}$ 是割线 $M_nM_{n+1}$ 的斜率（2026-10-10）]]

- $\dfrac{x_n}{y_n}$ 是原点 $O$ 到 $M_n$ 的连线 $OM_n$ 的**斜率**；
- $\dfrac{x_{n+1}-x_n}{y_{n+1}-y_n}$ 是**相邻两点割线** $M_nM_{n+1}$ 的斜率。

Stolz 定理的几何含义：**当点列沿 $y\to+\infty$ 方向越来越远、相邻两点割线的斜率趋于 $a$ 时，从原点看过去的斜率 $\frac{x_n}{y_n}$ 也趋于 $a$**——"局部斜率决定整体斜率"，这正是 L'Hospital 法则的几何直觉。

---

## 11. 例 2.3.4～2.3.5（Stolz 定理的应用）

### 例 2.3.4（Cauchy 命题：算术平均的极限）

**例 2.3.4.** 若 $\lim\limits_{n\to\infty}a_n=a$（$a$ 为有限数、$+\infty$ 或 $-\infty$），则
$$\lim_{n\to\infty}\frac{a_1+a_2+\cdots+a_n}{n}=a .$$

**证明（$\Rightarrow$，即"用法"）：** 令
$$x_n=a_1+a_2+\cdots+a_n,\qquad y_n=n\ \uparrow+\infty .$$
则 $y_n$ 是正无穷大量且严格单调递增，且 $x_{n+1}-x_n=a_{n+1}$、$y_{n+1}-y_n=1$，于是
$$\text{原式}=\lim_{n\to\infty}\frac{x_n}{y_n}=\lim_{n\to\infty}\frac{x_n-x_{n-1}}{y_n-y_{n-1}}=\lim_{n\to\infty}\frac{a_n}{1}=a . \qquad\blacksquare$$

> **与 [[05-数列极限#4. 例 2.2.4（Cauchy 命题）|例 2.2.4]] 的关系**：这是**同一个命题**，2026-10-09 用极限的定义（分拆固定块/尾块）证明，今天用 Stolz 定理**一行证完**。可见 Stolz 定理的威力：把"平均"这种**累积型**的极限直接转化为"通项"的极限。$a=\pm\infty$ 的情形同样被 Stolz 定理涵盖（Case 2/3），而定义法证明时需单独处理。

### 例 2.3.5（幂和公式）

**例 2.3.5.** $k\in\mathbb N^*$，求 $\lim\limits_{n\to\infty}\dfrac{1^k+2^k+\cdots+n^k}{n^{k+1}}$。

（括号注：$=\displaystyle\int_0^1x^k\,dx=\dfrac1{k+1}$——这是后续"定积分定义"给出的**另一个**算法，两法结果一致。）

**解：** 令
$$x_n=1^k+2^k+\cdots+n^k,\qquad y_n=n^{k+1}\ \uparrow+\infty .$$
由 Stolz 定理，
$$\text{原式}=\lim_{n\to\infty}\frac{x_n}{y_n}=\lim_{n\to\infty}\frac{x_n-x_{n-1}}{y_n-y_{n-1}}=\lim_{n\to\infty}\frac{n^k}{n^{k+1}-(n-1)^{k+1}} .$$

由二项式定理 $n^{k+1}-(n-1)^{k+1}$ 中 $n^{k+1}$ 相消，主项为 $(k+1)n^k$，故
$$=\lim_{n\to\infty}\frac{n^k}{(k+1)n^k+o(n^k)}=\frac1{k+1}. \qquad\blacksquare$$

> **注**：$y_{n+1}-y_n=n^{k+1}-(n-1)^{k+1}$ 的显式展开是 $(k+1)n^k-\dfrac{(k+1)k}2n^{k-1}+\cdots$，分子分母同除 $n^k$ 即得。**这类"分子是累积和、分母是高一次的幂"的题目是 Stolz 定理最典型的靶子**。

---

## 12. 易错点与小结

**易错点**

1. **混淆 $+\infty$ 与 $\infty$**：极限为 $\infty$ 只需 $|a_n|\to+\infty$，符号可交替；写 $+\infty$ 就必须验证符号。
2. **"无界"当成"无穷大"**：无界 $\not\Rightarrow$ 无穷大（反例见 [[06-无穷大量与Stolz定理#8. 待定型与 Stolz 定理|第 8 节]]）。
3. **待定型当运算法则**：$(\infty)+(-\infty)$、$0\cdot\infty$、$\dfrac\infty\infty$、$1^\infty$ 都**没有**通用结论，必须回到定义或找到合适的工具（Stolz 定理、夹逼、后面的定积分定义等）。
4. **放缩方向搞反**：证 $>G$ 要往下界放，且放缩必须在"最终"成立（$n$ 充分大以后）。
5. **Stolz 定理用错类型**：分母必须是无穷大量（$\dfrac{**}{\infty}$ 型）；分母趋于有限数时**不能**用。此外要检查 $\{y_n\}$ 最终单调（这里是递增）。
6. **有理分式极限丢掉低次项**：见 [[06-无穷大量与Stolz定理#7. 例 2.3.3（有理分式的极限）|例 2.3.3]] 的红叉示范。

**小结（本章方法论）**

| 工具 | 适用对象 | 关键点 |
|---|---|---|
| 定义 2.3.1 | 直接证 $a_n\to\infty$ | 把结论当作 $|a_n|>G$ 反解 $n$ |
| 定理 2.3.2 | 无穷大 $\leftrightarrow$ 无穷小 | $G$ 与 $\varepsilon$ 互为倒数 |
| 定理 2.3.3 | 无穷大 $\times$ 有正下界的量 | $\delta>0$ 不可省，$N=\max\{N_0,N_1\}$ |
| Stolz 定理 2.3.4 | $\dfrac{**}{\infty}$ 型、累积和/幂 | 离散版 L'Hospital；差分代替导数 |

**下一步**：[[07-数列的收敛准则与无理数e]]——2.4 节用"单调有界原理"定义自然常数 $\mathrm e$，并证明 $\mathrm e$ 是无理数。

---

**相关笔记**：[[05-数列极限]] ｜ [[05-数列极限-习题2-3]]（习题里的 Stolz 应用）｜ [[07-数列的收敛准则与无理数e]] ｜ [[数学分析（新工科）I]]
