---
type: 项目开发文档
tags: [项目/AMASS, 数据集/动作捕捉]
source: "https://amass.is.tue.mpg.de/"
created: 2026-09-20
---

# AMASS 项目开发文档

> [!info] 文档说明
> - 来源：AMASS 官网（首页 / News / License / Register 页面）
> - 整理时间：2026-09-20
> - 下载页（Downloads）与 Extra 页须登录后访问，本次未登录，相关内容暂未收录。

## 一、数据集概况

**AMASS**（**A**rchive of **M**otion Capture as **S**urface **S**hapes，动作捕捉表面形状档案库）是一个大规模人体动作捕捉（mocap）数据库：将 **15 个**不同的光学标记动捕数据集统一到同一框架与参数化之下，可直接用于动画、可视化，以及为深度学习生成训练数据。

| 项目 | 内容 |
| --- | --- |
| 全称 | AMASS: Archive of Motion Capture as Surface Shapes |
| 发布 | ICCV 2019 |
| 作者 | Naureen Mahmood、Nima Ghorbani、Nikolaus F. Troje、Gerard Pons-Moll、Michael J. Black |
| 所属机构 | 马克斯·普朗克智能系统研究所（Max Planck Institute for Intelligent Systems），Perceiving Systems 组 |
| 核心方法 | MoSh++：将动捕数据转换为由带骨骼绑定的人体模型表示的逼真 3D 人体网格 |
| 数据规模 | 40+ 小时运动数据、300+ 名受试者、11,000+ 段动作 |
| 参数化格式 | SMPL-H；SMPL-X（自 2022-02-14 起提供，含中性与性别特定版本） |
| 许可用途 | 非商业科学研究、非商业教育、非商业艺术项目 |
| 获取方式 | 官网注册后免费下载（注册时须接受数据许可） |

## 二、官方资源链接

| 资源 | 链接 |
| --- | --- |
| 官网首页 | <https://amass.is.tue.mpg.de/> |
| 论文 PDF | <http://files.is.tue.mpg.de/black/papers/amass.pdf> |
| 补充材料 | <http://files.is.tue.mpg.de/black/papers/amass-sup.pdf> |
| 演示视频 | <https://youtu.be/cceRrlnTCEs> |
| 海报（ICCV'19） | <http://files.is.tue.mpg.de/black/papers/amass_iccv_poster.pdf> |
| 教程代码（GitHub） | <https://github.com/nghorbani/amass> |
| 汇总引用文件 amass.bib | <https://download.is.tue.mpg.de/amass/amass.bib> |
| 注册页 | <https://amass.is.tue.mpg.de/register.php> |
| 下载页（需登录） | <https://amass.is.tue.mpg.de/download.php> |

## 三、论文摘要要点

- **动机**：大型数据集是深度学习进展的基石；现有动捕数据集规模小、动作种类有限，且各使用不同的身体参数化，难以整合成统一的元数据集，阻碍人体运动建模研究。
- **方法**：提出 **MoSh++**，将动捕数据转换为由带骨骼绑定的 **SMPL** 人体模型表示的逼真 3D 网格；适用于任意标记布局，可恢复软组织动力学（soft-tissue dynamics）与真实手部运动。
- **评估**：使用新采集的「4D 人体扫描 + 同步标记动捕」数据集评估 MoSh++ 并调节超参数。
- **结果**：统一 15 个光学标记动捕数据集；AMASS 超过 40 小时、300+ 受试者、11,000+ 段动作，显著丰富于以往的人体运动集合。
- **意义**：统一的表示方式使其可直接用于动画、可视化，以及生成深度学习训练数据。

## 四、数据内容与格式

- **数据来源**：15 个光学标记动捕数据集（含 CMU、BMLmovi、BMLhandball、DanceDB、HUMAN4D、MOYO、DFaust、SSM 等，详见「更新日志」）。
- **提供内容**：每段动捕序列对应的身体模型参数（body model parameters），以及教程代码（用于数据可视化、深度学习任务的基础工具）。
- **参数化说明**：论文中人体由带骨骼绑定的 SMPL 模型表示；官网目前提供 **SMPL-H** 与 **SMPL-X**（中性 / 性别特定）参数，SMPL-X 版本由 MoSh++ 在原始动捕标记上重新拟合得到（2022-02-14 公告）。
- **特色数据**：包含双人交互序列（CMU multi-subject，约 8.07 分钟）、专业舞蹈（DanceDB）、手球投掷（BMLhandball）、瑜伽（MOYO）等专项动作；重建结果包含软组织动态与手部运动细节。

## 五、网站栏目与更新日志

网站栏目：Home（首页）｜ News（更新）｜ Downloads（下载，需登录）｜ License（许可）｜ Extra（附加资源，需登录）。

主要更新（倒序）：

- **2024-11-08**：MOYO 新增动作（Nexus 子集、私有测试集）；全部 MOYO 序列补充 mp4 渲染。
- **2024-01-16**：发布 MOYO 的 SMPL-H / SMPL-X 参数；专业瑜伽教练动作，含 AMASS 中目前最极端的姿势。
- **2022-02-14**：发布 AMASS 的 SMPL-X 中性与性别特定格式（重新运行 MoSh++ 得到）。
- **2021-10-13**：随动捕自动标注工具包 SOMA 发布 MoSh++ 代码（可将 SMPL-X 拟合至动捕标记甚至点云）。
- **2021-10-07**：发布 HUMAN4D 数据集的 SMPL+H 参数。
- **2021-05-07**：发布 DanceDB 舞蹈数据（20 名受试者、153 段序列、约 3.5 小时）。
- **2020-08-27**：新增 BMLhandball（10 名男性受试者、649 段手球投掷、共 102 分钟）。
- **2020-07-16**：发布 amass.bib，便于引用各子数据集。
- **2020-03-24**：BMLmovi 发布与动捕标记同步标定的视频录像。
- **2019-12-10**：CMU 双人交互序列完成 MoSh 并加入 AMASS（约 8.07 分钟）。
- **2019-11-06**：ICCV'19 海报开放下载。
- **2019-10-24**：整合 BMLmovi 数据集（使用 MoSh 的 67 标记布局）。
- **2019-09-12**：加入 SSM 数据集同步 4D 扫描与原始动捕；加入 DFaust 合成标记的 MoSh++ 结果。
- **2019-08-15**：DFaust 合成动捕标记数据开放下载。
- **2019-08-14**：在 GitHub 发布 AMASS 教程代码。

## 六、获取流程（注册与下载）

1. 打开注册页 <https://amass.is.tue.mpg.de/register.php>，填写邮箱与密码（至少 8 位）并确认密码。
2. 勾选接受隐私声明（privacy statement）与数据许可（仅限非商业研究用途），可选勾选接收数据集 / 代码更新邮件。
3. 注册并登录后，进入 Downloads 页获取各数据集的 body model 参数与教程代码。

> [!note] 备注
> 下载页与 Extra 页需登录后访问；本次整理未登录，具体数据包列表暂未收录，后续注册后可回填。

## 七、许可证要点（务必遵守）

> [!warning] 仅限非商业用途
> 数据仅授权用于非商业科学研究、非商业教育和非商业艺术项目；任何商业使用（包括用其训练商业用途的算法 / 神经网络、集成进商业产品或服务等）均被禁止，商业授权请联系 <ps-license@tue.mpg.de>。

- **授权范围**：单用户、非独占、不可转让的免费使用权；仅限上述非商业用途。
- **禁止行为**：商业用途、色情用途、逆向工程；未经 Max-Planck 书面许可不得修改数据集或以任何形式提供给第三方。
- **分发限制**：不得复制、共享、分发、转售、转让或再许可（仅可保留一份存档副本）。
- **免责声明**：数据来自基础研究，按「原样（AS IS）」提供，可能包含错误，使用风险自负；无任何明示或默示担保。
- **责任限制**：依据德国民法典（BGB）第 521 条等规定，许可方仅对故意和重大过失负责；无维护、更新、纠错义务。
- **商业授权**：联系 <ps-license@tue.mpg.de>；协议适用德国法律。

许可原文：<https://amass.is.tue.mpg.de/license.html>

## 八、引用要求

任何使用 AMASS 的发表物必须适当引用 ICCV 2019 论文：

```bibtex
@conference{AMASS:ICCV:2019,
  title = {{AMASS}: Archive of Motion Capture as Surface Shapes},
  author = {Mahmood, Naureen and Ghorbani, Nima and Troje, Nikolaus F. and Pons-Moll, Gerard and Black, Michael J.},
  booktitle = {International Conference on Computer Vision},
  pages = {5442--5451},
  month = oct,
  year = {2019},
  month_numeric = {10}
}
```

- 引用 AMASS 中的全部子数据集时，可使用官方汇总文件：<https://download.is.tue.mpg.de/amass/amass.bib>
- License 页另给出等价条目：`booktitle = {The IEEE International Conference on Computer Vision (ICCV)}`，并附有 `url = {https://amass.is.tue.mpg.de}`。

## 九、相关工具与项目

- **MoSh++**（动捕标记 / 点云拟合 SMPL-X）：<https://github.com/nghorbani/moshpp>
- **SOMA**（动捕自动标注工具包）：<https://soma.is.tue.mpg.de/>（代码：<https://github.com/nghorbani/soma>）
- **SMPL-X 人体模型**：<https://smpl-x.is.tue.mpg.de/>
- **MOYO**（瑜伽动作数据集）：<https://moyo.is.tue.mpg.de/>
- **DFaust**：<http://dfaust.is.tue.mpg.de/>
- **BMLmovi**：<http://www.biomotionlab.ca/movi/>

## 十、联系与贡献

- **咨询 / 数据贡献**：<amass@tue.mpg.de>（若有动捕数据愿共享用于研究，官方可代为 MoSh 处理并加入 AMASS）
- **商业授权**：<ps-license@tue.mpg.de>
- **托管与制作**：Perceiving Systems（<https://ps.is.mpg.de>），马克斯·普朗克智能系统研究所（<https://is.mpg.de>）
- **版权**：© 2020 Max-Planck-Gesellschaft

## 十一、项目接入清单（待办）

- [ ] 注册 AMASS 账号并登录，确认可下载的数据包与格式（SMPL-H / SMPL-X）
- [ ] 明确项目所需的参数化与身体模型版本（中性 / 性别特定）
- [ ] 克隆教程代码仓库并跑通数据可视化：<https://github.com/nghorbani/amass>
- [ ] 阅读论文与 MoSh++ / SOMA 文档，理解「动捕标记 → SMPL」转换流程
- [ ] 核对项目用途符合非商业许可；如涉及商业场景，提前联系商业授权
- [ ] 在项目成果中按第八节要求添加引用
- [ ] 补充项目名称、目标与技术路线（待完善）
