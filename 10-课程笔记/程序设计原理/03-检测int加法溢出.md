---
type: 题目
course: 程序设计原理
source: 00-合集.cpp
顺序: 3
---

# 03 检测 int 加法溢出

**考点**：有符号溢出是 UB，用宽类型兜底

## 题目

读入两个 `int`：a、b。如果 `a + b` 超出 `int` 范围，输出 `OVERFLOW`，否则输出和。

## 代码

```cpp
void solve03() {
    int a, b;
    cin >> a >> b;

    long long s = (long long)a + b;   // 先用 64 位算

    if (s < INT_MIN || s > INT_MAX) {
        cout << "OVERFLOW\n";
    } else {
        cout << s << "\n";
    }
}
```

## 要点

- `(long long)a + b`：只要加法的一边是 64 位，整个表达式就按 64 位算，不会溢出。
- 算完再拿 `INT_MIN`、`INT_MAX` 当边界比一比。

## 坑

- 不能写 `if (a + b < 0)` 这种判断：`int` 溢出是未定义行为，编译器可以做任何事，判断本身已经不可信。
- `(long long)(a + b)` 是错的：先按 `int` 加完（已经 UB）才转换，顺序反了。