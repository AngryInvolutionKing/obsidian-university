---
type: 课堂笔记
course: 程序设计原理
tags: [课程/程序设计, 专题/C风格字符串, 状态/已整理]
created:
---

# C风格字符串基础

- 关联课程主页：[[程序设计原理]]
- 关联专题索引：[[知识点专题]]

本页根据本次课件截图整理，沿用课件的 C++17 语境。标为“课件整理”的部分来自截图；“补充解释”用于拆解代码，不作为课件原文。示例补齐了必要的头文件与 `main`。

## 1. 长度与容量：strlen 和 sizeof

**课件整理。**

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[10] = "abc";
    cout << strlen(s) << " " << sizeof(s) << '\n';
    s[1] = '\0';
    cout << s << " " << strlen(s) << " " << sizeof(s) << '\n';
}
```

输出：

```text
3 10
a 1 10
```

**补充解释。** 数组有 10 个位置，初始化后各位置的内容如下。结束符 `\0` 是值为零的字符，与数字字符 `'0'` 不同。

```text
下标：  0    1    2     3     4     5     6     7     8     9
内容： 'a'  'b'  'c'  '\0'  '\0'  '\0'  '\0'  '\0'  '\0'  '\0'
```

`strlen(s)` 从头往后数，遇到第一个 `\0` 停下，不计结束符，所以是 3。`sizeof(s)` 看整个数组占多少字节；一个 `char` 占 1 字节，因此这里是 10。

执行 `s[1] = '\0'` 后，只改了下标 1 的那个位置：

```text
内容： 'a'  '\0'  'c'  '\0'  '\0'  '\0'  '\0'  '\0'  '\0'  '\0'
```

`'c'` 还在数组里，但字符串在前一个位置就结束了，所以输出 `s` 时只显示 `a`，`strlen(s)` 也变成 1。数组没有变小，`sizeof(s)` 仍是 10。

| 问题 | 本例中怎样回答 |
| --- | --- |
| 当前字符串内容有多长？ | `strlen(s)`，数到第一个 `\0` 之前 |
| 整个数组占多少字节？ | `sizeof(s)`，数组全部 10 个位置都算 |
| 最多能保存多少个内容字符？ | 9 个，还要留 1 个位置放 `\0` |

**课件中的类型说明。** `strlen` 返回 `size_t`，不要假设它一定是 `unsigned int`；`sizeof` 的结果类型也是 `size_t`。当前可先把它理解为用于表示大小和长度的无符号整数类型。

**课件中的传参提醒。** 在 `void f(char s[])` 这样的函数形参中，`s` 实际按指针处理，函数内的 `sizeof(s)` 得到指针大小，无法恢复调用者数组的容量。数组名在不同语境下的行为见 [[知识点专题#K02 字符串的本体：首地址 + '\0'（传参机制）]]；这里的 `sizeof` 直接作用于数组时，不会把它转换成指针。

## 2. 手工求长度与复制：循环为什么这样写

**课件整理。**

```cpp
#include <iostream>
using namespace std;

int main() {
    char src[] = "abc";
    char dst[8] = {};
    int len = 0;
    while (src[len] != '\0') ++len;
    for (int i = 0; i <= len; ++i)
        dst[i] = src[i];
    cout << len << " " << dst << '\n';
}
```

输出 `3 abc`。

**补充解释。** `len` 初始为 0。检查 `src[0]` 是 `a`，加到 1；检查 `src[1]` 是 `b`，加到 2；检查 `src[2]` 是 `c`，加到 3；检查 `src[3]` 是 `\0`，循环结束。最终 `len=3`，恰好也是结束符的下标。

复制循环里的 `i <= len` 会让 `i` 依次取 0、1、2、3，因此把 `a`、`b`、`c` 和 `\0` 一起复制。只复制内容而遗漏结束符，不能一般性地保证目标是合法的 C 风格字符串。本例的 `dst` 虽然已被零初始化，复制算法仍明确包含结束符。

复制前要确保目标容量至少是 `len + 1`。本例容量 8 足够；`src[] = "abc"` 的源数组容量则是 4，因为编译器还要放入末尾的 `\0`。

**课件中的手工拼接。** 对 `s1[20] = "abcde"` 和 `s2[] = "xyzf"`，先扫描到 `s1[5]` 的结束符，再从这个位置写入 `s2` 的内容，最后在 `s1[9]` 写入新的 `\0`，得到 `abcdexyzf`。所需容量是 $5+4+1=10$。完整的“找到尾部 → 复制内容 → 补结束符”机制归入 [[知识点专题#4. 为什么一个地址就能代表整串字符：靠 '\0']]，对应习题见 [[10-字符串拼接]]。

**补充解释：拆开自增。** 课件中的 `s1[i++] = s2[j++];` 在这里可展开理解为先执行 `s1[i] = s2[j];`，再分别执行 `++i;`、`++j;`。初读代码时先拆开看，不必同时处理赋值与后置自增。

## 3. 单词输入：cin 与 setw

**课件整理。**

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    char word[10] = {};
    if (cin >> setw(10) >> word)
        cout << word << '\n';
}
```

`>>` 默认跳过开头的空白，开始读取后遇到空格、制表符或换行等空白就停止。本课 C++17 示例使用 `setw(容量)`，给结束符预留一个位置；这里最多读入 9 个内容字符，并写入 `\0`。每次相关读取结束后宽度会复位，重复读取时应重新设置。

**补充解释。** 输入 `New York`，第一次读取只得到 `New`，后面的空格和 `York` 留待后续输入操作处理。`setw(10)` 限制本次能写入的数量，不会把空格变成可以读取的内容。若连续输入超过 9 个非空白字符，超出的部分仍留在输入流中，不会被自动丢掉。

`if (cin >> ...)` 是课件附带的输入检查：尝试读取，成功后才执行输出。先理解里面的读取语句，再理解外面的成功与失败判断。

## 4. 整行输入：cin.getline

**课件整理。**

```cpp
#include <iostream>
#include <limits>
using namespace std;

int main() {
    char line[30] = {};
    if (cin.getline(line, 30)) {
        cout << line << '\n';
    } else {
        cout << "Input too long or failed\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
}
```

`cin.getline(line, 30)` 允许内容中出现空格，默认读到换行；换行符被取走、丢弃，不放进数组。最多保存 29 个内容字符，另写入一个 `\0`。当还有内容要读、却没有空间继续保存时，设置失败状态。

**补充解释。** 输入 `New York` 时，数组里得到的是完整的 `New York`。这里先区分两种输入目标：读一个单词用上一节的 `>>`，保留行内空格用 `getline`。

`else` 中的两行是输入失败后的处理。`cin.clear()` 清除失败标志，让后面的流操作可以继续；它不会清空尚未读取的字符。`cin.ignore(..., '\n')` 随后丢弃当前行剩余的内容，直到并包括换行符。

`numeric_limits<streamsize>::max()` 来自 `<limits>`，表示流计数类型的最大值；与 `ignore` 配合时，这里用来取消数量上的限制，读到换行或文件结束为止。初学时可以先读懂整句的用途，再展开这个类型写法。

## 5. 混合输入：读数字以后为什么会读到空行

**课件整理。** 假设年龄在第一行，姓名在下一行：

```cpp
#include <iostream>
#include <limits>
using namespace std;

int main() {
    int age;
    char name[40] = {};
    if (!(cin >> age)) return 0;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    if (cin.getline(name, 40))
        cout << age << " " << name << '\n';
}
```

**补充解释。** 假设输入的两行是：

```text
18
New York
```

`cin >> age` 取走数字 18，通常把后面的换行留在输入流中。如果立刻 `getline`，它首先遇到的就是这个换行，于是得到空字符串，程序看起来像是跳过了姓名输入。

中间的 `ignore` 先把年龄所在行的剩余内容和换行丢掉，`getline` 才会从下一行的 `N` 开始。这种写法依赖“姓名另起一行”的输入约定；如果姓名就在年龄后面的同一行，它也会被这一句丢掉。

课件还提醒：`std::ws` 会跳过全部前导空白，包括空格和换行；需要保留行首空格或空行时，不应随意用它替代这里的处理。

## 6. 复制、拼接与比较：cstring 函数

**课件整理。** 以下函数使用头文件 `<cstring>`。先看完整示例，再对照各操作：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char city[30] = "Chicago";
    strcpy(city, "New York");
    cout << city << '\n';

    char shortName[4] = {};
    strncpy(shortName, "New York", 3);
    shortName[3] = '\0';
    cout << shortName << '\n';

    char s[10] = "abc";
    strcat(s, "def");
    cout << s << '\n';
    size_t remain = sizeof(s) - strlen(s) - 1;
    strncat(s, "XYZ123", remain);
    cout << s << '\n';

    char a[] = "abc", b[] = "abg";
    cout << (strcmp(a, b) < 0) << '\n';
    cout << strcmp(a, "abc") << '\n';
    cout << strncmp(a, b, 2) << '\n';
}
```

输出：

```text
New York
New
abcdef
abcdefXYZ
1
0
0
```

**补充解释：先区分任务。** `strcpy` 把源串复制到目标开头，覆盖原内容；`strcat` 从目标原来的结束符处追加；`strcmp` 比较内容，不修改字符串。字符数组声明后不能用 `city = "New York";` 给整个数组重新赋值。

| 操作 | 函数 | 结束符与容量要求 |
| --- | --- | --- |
| 完整复制 | `strcpy(dst, src)` | 连同结束符复制；目标容量至少是源长度加 1 |
| 限量复制 | `strncpy(dst, src, n)` | 写入 `n` 个位置；源长不足 `n` 时补零，源长达到或超过 `n` 时不保证有结束符 |
| 完整拼接 | `strcat(dst, src)` | 目标容量至少是原目标长度、源长度之和再加 1 |
| 限量拼接 | `strncat(dst, src, n)` | 最多追加 `n` 个源内容字符，另写结束符；`n` 不代表目标总容量 |
| 完整比较 | `strcmp(a, b)` | 按第一个不同字符判定先后，返回负数、0 或正数 |
| 限量比较 | `strncmp(a, b, n)` | 最多比较前 `n` 个位置，遇到结束符会相应终止比较 |

`strncpy(shortName, "New York", 3)` 取走 `N`、`e`、`w`，这次调用本身不写结束符；随后的 `shortName[3] = '\0'` 明确把结果封口。目标必须至少容纳这次写入的 3 个位置以及手动补写的结束符。

拼接例中，`strcat` 后 `s` 的内容长 6、容量为 10，因此还能追加 $10-6-1=3$ 个内容字符。`remain` 得到 3，`strncat` 只追加 `XYZ`，末尾仍有空间放 `\0`。这个容量算法要求 `s` 在此处确实是数组，并且已经是合法的 C 风格字符串。

比较 `abc` 与 `abg`，前两个字符相同，第一个不同的位置是 `c` 与 `g`，因此 `strcmp(a,b)` 为负。`strncmp(a,b,2)` 只检查前两个位置，结果为 0。只判断返回值的符号，不假定一定返回 `-1` 或 `1`；内容判等写 `strcmp(a,b) == 0`，不要用两个数组名之间的 `==` 代替。

**课件统一要求。** 确保源字符串有效、目标容量足够，并正确处理结束符。读写缓冲区重叠时，不使用 `strcpy`、`strncpy`、`strcat`、`strncat`；函数名带 `n` 也仍然需要程序员计算容量。

## 7. 字符分类与大小写转换

**课件整理。** `<cctype>` 提供 `isalpha`、`isdigit`、`isalnum`、`isspace`、`isupper`、`islower` 等判断函数，以及 `toupper`、`tolower`。判断函数返回非零表示成立，不保证一定返回 1；大小写转换函数返回 `int`。

各函数的详细解释沿用 [[知识点专题#K04 字符函数 <cctype> —— 判断与转换的现成工具]]。本次课件新增的完整遍历示例及 `unsigned char` 参数转换说明，放在该节的“5. 课件补充：遍历字符串时的参数转换”中；输入 `Ab3 x` 对应的数组内容，处理后输出 `AB3 X 1`。

## 8. 字符串与数字转换

**课件整理。**

```cpp
#include <iostream>
#include <cstdlib>
#include <string>
using namespace std;

int main() {
    cout << atoi("65") + atoi("4") << '\n';
    cout << atof("65.5") + atof("4.4") << '\n';
    string text = to_string(100);
    cout << text << '\n';
}
```

输出 `69`、`69.9`、`100`，各占一行。`<cstdlib>` 中 `atoi`、`atol`、`atof` 分别把数字文本转换为 `int`、`long`、`double`。`std::to_string` 来自 `<string>`，把数字转换为 `std::string` 对象；这里的 `text` 已经不是 `char` 数组。

**补充解释。** `"65"` 是两个数字字符组成的文本，`atoi("65")` 才得到可以参与整数加法的数值 65。反过来，`to_string(100)` 得到文本 `"100"`。

课件提醒：`atoi("0")` 与 `atoi("abc")` 都会得到 0，不能靠返回值可靠地区分有效的零和转换失败。需要检查错误时，可进一步学习 `strtol` 并检查结束位置与范围；`itoa` 不是标准 C++ 函数。

## 复习顺序（补充建议）

先掌握第 1、2 节：画出字符数组，找到第一个 `\0`，区分内容长度和数组容量，再手写扫描与复制循环。这些是后面函数行为的基础。

接着掌握第 3–5 节：单词与整行读取有什么区别，读数字后为什么可能留下换行。先用正常输入跟踪读到了哪里，再看课件中的失败检查和恢复语句。

最后读第 6–8 节：先按“复制、追加、比较、转换”辨认函数的任务，再检查结束符与容量。`size_t`、长的 `ignore` 参数和两次类型转换各自有独立用途，可以逐项理解，不必在第一次阅读时同时展开全部细节。

## 疑问

- “单词输入”截图底部被截断，未逐字还原被截文字；本页关于 `New York` 的读取过程标为补充解释。

## 参考与关联笔记

- **已核验**：[GNU C Library — String Length](https://sourceware.org/glibc/manual/latest/html_node/String-Length.html)、[Copying Strings and Arrays](https://sourceware.org/glibc/manual/latest/html_node/Copying-Strings-and-Arrays.html)、[Truncating Strings](https://sourceware.org/glibc/manual/latest/html_node/Truncating-Strings.html)：核对 `strlen`、`strcpy`、`strncpy`、`strncat` 的长度与结束符行为。
- **已核验**：[Microsoft Learn — istream operators](https://learn.microsoft.com/en-us/cpp/standard-library/istream-operators?view=msvc-170)、[basic_istream](https://learn.microsoft.com/en-us/cpp/standard-library/basic-istream-class?view=msvc-170)：核对字符数组输入的宽度限制、`getline` 的分隔符处理和 `ignore` 的用途。
- [[知识点专题]]：K01–K04 的字符、指针和字符函数基础。
- [[10-字符串拼接]]：手工拼接与读写双指针的习题。
