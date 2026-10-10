---
tags:
  - 北洋机甲
  - 电控培训
  - 笔记
课件: "3.Git与Gitee (1).pdf"
页数: 13
整理: 2026-10-04
---

# Git 与 Gitee

## 📌 与你相关

> **你的处境**：北洋机甲社团电控培训；手上**只有 ST-Link**（CLion + ARM GCC + OpenOCD + CubeMX 都已配好 ✅），**还没有开发板**。
> 讲义全程用 **STM32F103ZET6**（板载 LED 在 **PB5**）—— 买板子/元件前先看 [[硬件与采购清单]]（含淘宝实测价）。

- **这章要的硬件**：**不需要硬件**；作业要提交到社团/自己的 Gitee 仓库
- **原课件**：[[3.Git与Gitee (1).pdf|3.Git与Gitee (1).pdf]]

## 📝 讲义里的任务/作业（原文）

```text
找到克隆的本地仓库（位置为刚才的Directory），将需要交作业的工程文件夹建立在这里，后续的作
业工程文件夹都放在这里，即CubeMx工程位置放在子文件夹中
编辑工程文件夹时，用CLion打开对于子文件夹进行编辑，也可以右键用CLion打开编辑，建议每一个
子文件夹（工程文件夹）都创建.gitignore文件，内容同git部分，接下来就可以继续看文档写作业了
🙌
❗注意：子文件夹就不要初始化git了，不然你可以交不上作业
build/
/cmake-build-debug-stm32
.cache/
.idea
.vscode
/.gitignore
!*/CMakeLists.txt
!CMakeLists.txt
当代码敲完要交作业时，再打开仓库文件夹，在下图位置填写Commit信息
确认一下Commit信息没有问题，可以直接选择Commit and Push直接发布到远程仓库，那学长学姐
就能能看到你提交的作业了😋
第一次Push要填写的信息是你注册Gitee的手机号和密码
应该没有.idea
如果已经Push了但是发现了问题
可以勾选Amend重写Commit信息，然后Commit and Push
选择Merge
修改好后的版本树长这样
远端仓库看到修改完成
-- By Scum
QQ: 3014827510
```

## 🖼 逐页图片（讲义以截图为主，这就是原件内容）

### 第 1 页

![[03-第01页.png]]

### 第 2 页

![[03-第02页.png]]

### 第 3 页

![[03-第03页.png]]

### 第 4 页

![[03-第04页.png]]

### 第 5 页

![[03-第05页.png]]

### 第 6 页

![[03-第06页.png]]

### 第 7 页

![[03-第07页.png]]

### 第 8 页

![[03-第08页.png]]

### 第 9 页

![[03-第09页.png]]

### 第 10 页

![[03-第10页.png]]

### 第 11 页

![[03-第11页.png]]

### 第 12 页

![[03-第12页.png]]

### 第 13 页

![[03-第13页.png]]

---

## 文字层（自动提取，供全文检索）

3.Git与Gitee
建议在新建工程后阅读
一、基本概念
什么是 Git？
Git 是一款分布式版本控制系统，是目前全球最主流的代码管理工具。核心作用：记录代码每一次修
改、回溯历史版本、多人协同开发，解决代码覆盖、丢失、版本混乱等问题。
什么是 Gitee？
Gitee（码云）是国内免费代码托管平台，基于 Git 实现远程仓库托管，访问速度远快于 GitHub，适合
国内开发者日常使用。
基本名词
•
工作区：电脑本地项目文件夹，日常写代码的地方
•
暂存区：临时存放修改的缓冲区，等待提交归档
•
本地仓库：本地永久保存的版本记录，生成完整版本快照
•
远程仓库：Gitee 云端仓库，用于备份、共享、团队协作
二、环境安装与初始化配置
Gitee 账号注册
1. 官网注册：https://gitee.com/
2. 完成手机号绑定、账号激活，后续用于创建远程仓库、同步代码
Git 安装
Windows
1. 官网下载：https://git-scm.com/
2. 安装全程默认下一步即可，无需修改额外配置，注意安装W路径不要含中文和空格即可
3. 安装验证：桌面/文件夹右键，出现 Git Bash Here 即为安装成功
4. 打开 Git Bash，输入命令验证版本
git --version
输出版本号（如 git version 2.55.0）说明安装完成
Mac
先安装包管理器Homebrew，然后通过Homebrew安装Git：https://brew.sh/
$ brew install git
全局身份配置（必须配置，仅一次）
Git 每次提交代码都会记录作者信息，首次使用必须配置用户名和邮箱。
# 配置用户名（自定义，建议Gitee昵称）
git config --global user.name "用户名"

# 配置邮箱（必须是Gitee注册邮箱）
git config --global user.email "你的Gitee注册邮箱"
查看配置是否生效
git config --global --list
出现后两行就说明配置生效了
三、Git使用
初始化
建议先在工程根文件夹创建.gitignore文件
作用：告诉 Git 哪些文件 / 文件夹不需要被追踪、不要提交到仓库里。
写入如下内容保存
build/
/cmake-build-debug-stm32
.cache/
.idea
.vscode
/.gitignore
!*/CMakeLists.txt
!CMakeLists.txt
打开工程文件夹，在CLion终端输入git init 和git add . （这里的 . 不能省略，表示全部文
件）初始化仓库并将文件添加到仓库，如果出现如下warning忽略即可
版本管理
勾选Changes，Commit写版本信息，比如说日期，重要改动，新实现的功能或改好的bug，由于是第
一次提交，直接写init了，写好后点击Commit，不用勾选Amend，由于没有关联远程仓库，不能
Push
Commit后改动的文件颜色会改变，
上图的工具栏依次是：
↑ 上箭头：跳到上一处代码改动
↓ 下箭头：跳到下一处代码改动
↶ 回退（Revert）：放弃当前这一处修改，恢复成原来旧代码（只撤销这一块，不是整个文件）
⇄ 接受（Accept）：保留当前这一处修改（把改动确认下来，移除 diff 高亮标记）
📄 复制更改：把这一段新代码复制到剪贴板
☰ 查看所有变更列表：快速列出本文件全部改动块
Commit this change：提交这一处改动（单独把这个变更块暂存并 commit）
再次commit后可以看提交记录
右击对应记录可以 Reset Current Branch to Here，可以回退代码版本到这里
Revert Commit：生成一条新提交抵消本次修改，不会删除原有历史，适合已经推送到远程、多人协
作时安全撤销改动。
Undo Commit...：撤销最近一次 commit，文件改动保留在本地（等价 soft reset）。
Edit Commit Message... F2：修改这条提交的备注文字（commit 信息），仅能修改还没推远程的提
交。
四、Gitee使用
点击加号新建仓库
仓库名称设置为你的学号，注意仓库一定要设置为开源的！！！
仓库介绍可写可不写，其余不需要修改，直接创建就可以
点击复制
打开Clion，选择Clone Repository
粘贴刚才复制的链接，Directory选一个你能找的位置，要是空文件夹，选好后Clone
输入 git remote -v 出现仓库信息表示克隆成功
克隆后在根目录创建.gitignore输入保存
.idea
找到克隆的本地仓库（位置为刚才的Directory），将需要交作业的工程文件夹建立在这里，后续的作
业工程文件夹都放在这里，即CubeMx工程位置放在子文件夹中
编辑工程文件夹时，用CLion打开对于子文件夹进行编辑，也可以右键用CLion打开编辑，建议每一个
子文件夹（工程文件夹）都创建.gitignore文件，内容同git部分，接下来就可以继续看文档写作业了
🙌
❗注意：子文件夹就不要初始化git了，不然你可以交不上作业
build/
/cmake-build-debug-stm32
.cache/
.idea
.vscode
/.gitignore
!*/CMakeLists.txt
!CMakeLists.txt
当代码敲完要交作业时，再打开仓库文件夹，在下图位置填写Commit信息
确认一下Commit信息没有问题，可以直接选择Commit and Push直接发布到远程仓库，那学长学姐
就能能看到你提交的作业了😋
第一次Push要填写的信息是你注册Gitee的手机号和密码
应该没有.idea
如果已经Push了但是发现了问题
可以勾选Amend重写Commit信息，然后Commit and Push
选择Merge
修改好后的版本树长这样
远端仓库看到修改完成
-- By Scum
QQ: 3014827510
