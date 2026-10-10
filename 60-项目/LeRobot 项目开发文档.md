---
type: 项目开发文档
tags: [项目/LeRobot, 主题/具身智能]
source: "https://huggingface.co/docs/lerobot/index"
created: 2026-09-20
---

# LeRobot 项目开发文档

> [!info] 文档说明
> - 来源：LeRobot 官方文档（首页 Index、Installation、Cheat Sheet、Compute & Hardware Guide）
> - 整理时间：2026-09-20
> - 抓取说明：`huggingface.co` 与 `github.com` 直连超时，正文经镜像 `hf-mirror.com` 读取；文中链接保留官方地址。

## 一、项目概况

**LeRobot** 是 Hugging Face 的开源机器人库，定位是「面向真实世界机器人的前沿机器学习」：

- **硬件无关、Python 原生的真机控制接口**：从 SO-ARM101 这类低成本机械臂一直到全尺寸人形机器人。
- **数据集全链路工具**：录制、存储、分享。所有数据统一使用 **LeRobotDataset** 格式（同步视频 + 动作 / 状态数据），可直接从 Hugging Face Hub 流式加载。
- **开箱即用的 SOTA 策略**：从轻量的模仿学习模型 **ACT**，到大型视觉-语言-动作模型 **π₀**、**SmolVLA**；训练、分享、部署都用同一套 CLI 命令完成。
- **目标**：降低机器人入门门槛，让所有人都能贡献并受益于共享数据集与预训练模型。

## 二、核心工作流

**遥操作 → 录制 → 训练 → 部署**

| 阶段                  | 说明                            |
| ------------------- | ----------------------------- |
| 1. Teleoperate（遥操作） | 由你用主臂、键盘或手机亲自控制机器人，让它从你的动作中学习 |
| 2. Record（录制）       | 每次演示保存为一个数据集：同步的相机视频 + 你发出的动作 |
| 3. Train（训练）        | 策略（控制机器人的神经网络）学习模仿你的演示        |
| 4. Deploy（部署）       | 在机器人上运行训练好的策略，让它自主完成任务        |

## 三、三条入门路径

- **我有机器人**：官方主推 **SO-101**（旗舰低成本机械臂）、**LeKiwi**（移动底盘 + 机械臂）、**Koch v1.1**（社区长期热门）；装配并校准后即可按模仿学习教程录数据、训第一个策略。也可以用 **LeLab**（浏览器 GUI）完全跳过命令行，完成同样的流程。
- **暂时没有硬件**：直接在 Hub 上现成的 LeRobot 数据集上训练；在仿真中评估（**LIBERO**、**Meta-World** 等基准）；或使用免费 Colab notebook，无需安装。
- **想贡献**：先读 Contributing 指南，再新增 policy 或接入自己的硬件。

## 四、环境要求与安装

**基本要求**：推荐用 `conda`（miniforge）管理环境；若用 `uv` / `venv` 等其他方式，需自行满足 **Python ≥ 3.12** 与 **PyTorch ≥ 2.10**。

```bash
# 1. 建环境
conda create -y -n lerobot python=3.12
conda activate lerobot          # 每次开新 shell 都要执行

# 2. 视频解码依赖 ffmpeg（TorchCodec 需要）
conda install ffmpeg -c conda-forge
# 若出现 libsvtav1 缺失等版本问题，可固定版本：
conda install ffmpeg=7.1.1 -c conda-forge

# 3a. 从源码安装（打算改代码 / 贡献时用）
git clone https://github.com/huggingface/lerobot.git
cd lerobot
pip install -e ".[core_scripts]"   # 机器人工作流：录制、回放、校准
pip install -e ".[training]"       # 训练策略
pip install -e ".[all]"            # 全部（策略、仿真环境、硬件、开发工具）

# 3b. 从 PyPI 安装
pip install lerobot                # 只装核心 ML 依赖，多数工作流需再加 extras
```

**功能 extras**（可组合，如 `.[core_scripts,pi,pusht]`；完整清单见仓库 `pyproject.toml`）：

| Extra | 增加内容 | 典型用途 |
| --- | --- | --- |
| `dataset` | `datasets`、`av`、`torchcodec`、`jsonlines` | 加载与创建数据集 |
| `training` | `dataset` + `accelerate`、`wandb` | 训练策略 |
| `hardware` | `pynput`、`pyserial`、`deepdiff` | 连接真实机器人 |
| `viz` | `rerun-sdk` | 录制 / 评估时的可视化 |
| `core_scripts` | `dataset` + `hardware` + `viz` | `lerobot-record` / `-replay` / `-calibrate` |
| `evaluation` | `av` | `lerobot-eval`（按需再加 policy / env extras） |
| `dataset_viz` | `dataset` + `viz` | `lerobot-dataset-viz`、`lerobot-imgtransform-viz` |
| `pi` / `smolvla` / `diffusion` | 对应策略依赖（`diffusion` 需 `diffusers`） | 指定策略 |
| `aloha` / `pusht` | 仿真环境（gym-aloha / gym-pusht） | 仿真训练与评估 |
| `feetech` / `dynamixel` | 电机 SDK | SO100 / SO101 / Moss 用 Feetech；Koch v1.1 用 Dynamixel |

**CUDA 版本选择（仅 Linux 需要关心）**：源码 + `uv` 安装默认钉在 **CUDA 12.8** 索引（驱动下限 570.86，覆盖 Ampere / Ada / Hopper / Blackwell）；PyPI 默认的 torch 轮子是 **cu130** 捆绑版（驱动下限 580.65）。需要指定版本时：

```bash
# pip / conda：先装指定 CUDA 的 torch，再装 lerobot
pip install --index-url https://download.pytorch.org/whl/cu128 torch torchvision
pip install -e ".[all]"

# uv 一行搞定（uv ≥ 0.6）
uv pip install --torch-backend cu128 lerobot
# 可选值：auto、cpu、cu126、cu128、cu129、cu130，以及 rocm* / xpu
```

> [!tip] Windows / WSL 注意
> - 在 WSL 里安装需要额外装 `evdev`：`conda install evdev -c conda-forge`（uv 路线：`sudo apt install libevdev-dev` + `uv pip install evdev`）。
> - TorchCodec 在 macOS Intel、Linux ARM，以及 **PyTorch < 2.8 的 Windows** 上不可用，此时 LeRobot 会自动回退到 `pyav`，可以不装 ffmpeg。
> - PyTorch ≥ 2.10（TorchCodec ≥ 0.10）才能动态链接系统级 ffmpeg；更老的版本必须用 `conda install ffmpeg -c conda-forge`。
> - 构建报错时补系统依赖：`sudo apt-get install cmake build-essential python3-dev pkg-config libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libswresample-dev libavfilter-dev`。

**其他可选依赖**：实验跟踪用 Weights & Biases（包含在 `training` extra 中），执行 `wandb login` 登录。

## 五、常用 CLI 命令速查

> [!warning] 所有命令里的端口、名称、id 都要换成你自己的值
> 示例中的 `/dev/ttyACM0`、`&#36;{HF_USER}` 只是占位；实际端口用 `lerobot-find-port` 查出后替换。另有 [quickstart.ipynb](https://github.com/huggingface/lerobot/blob/main/examples/notebooks/quickstart.ipynb) 可以按你的配置自动生成命令。

```bash
# —— 工具：查串口 / 查相机 ——
lerobot-find-port        # 按提示拔掉 USB 再回车，脚本会打印该机器人的正确串口
lerobot-find-cameras     # 打印相机信息，测试帧存到 lerobot/outputs/captured_images

# —— 校准（每台机器人和遥操设备通常只需一次；校准前让各关节大致居中）——
lerobot-calibrate \
    --robot.type=so101_follower \
    --robot.port=/dev/ttyACM0 \
    --robot.id=my_follower_arm
# 注意：后续脚本必须使用校准时相同的 id，LeRobot 靠它定位校准文件

# —— 遥操作（双相机 + Rerun 实时显示）——
lerobot-teleoperate \
    --robot.type=so101_follower \
    --robot.port=/dev/ttyACM0 \
    --robot.id=my_follower_arm \
    --robot.cameras="{ top: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}, wrist: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30} }" \
    --teleop.type=so101_leader \
    --teleop.port=/dev/ttyACM1 \
    --teleop.id=my_leader_arm \
    --display_data=true

# —— 录制数据集（需先 hf auth login）——
lerobot-record \
    --robot.type=so101_follower \
    --robot.port=/dev/ttyACM0 \
    --robot.id=my_follower_arm \
    --robot.cameras="{ top: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}, wrist: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30} }" \
    --teleop.type=so101_leader \
    --teleop.port=/dev/ttyACM1 \
    --teleop.id=my_leader_arm \
    --dataset.repo_id=&#36;{HF_USER}/so101_dataset_test \
    --dataset.num_episodes=30 \
    --dataset.single_task="put the red brick in a bowl" \
    --dataset.streaming_encoding=true \
    --display_data=true

# —— 训练 ACT 策略 ——
lerobot-train \
    --dataset.repo_id=&#36;{HF_USER}/so101_dataset_test \
    --policy.type=act \
    --output_dir=outputs/train/act_so101_test \
    --job_name=act_so101_test \
    --policy.device=cuda \
    --wandb.enable=true \
    --policy.repo_id=&#36;{HF_USER}/policy_test \
    --steps=20000

# —— 微调已有模型（给了 path 就可以省略 type）——
lerobot-train \
    --dataset.repo_id=&#36;{HF_USER}/so101_dataset_test \
    --policy.path=username/the_policy_to_finetune \
    --policy.device=cuda \
    --policy.repo_id=&#36;{HF_USER}/policy_test \
    --output_dir=outputs/train/act_so101_test \
    --steps=20000

# —— 部署推理（在机器人上跑训练好的策略）——
lerobot-rollout \
    --strategy.type=base \
    --policy.path=&#36;{HF_USER}/my_policy \
    --robot.type=so101_follower \
    --robot.port=/dev/ttyACM1 \
    --robot.cameras="{ up: {type: opencv, index_or_path: /dev/video1, width: 640, height: 480, fps: 30}, side: {type: opencv, index_or_path: /dev/video5, width: 640, height: 480, fps: 30}}" \
    --task="Put lego brick into the transparent box" \
    --duration=60
```

**录制过程中的键盘控制**：`→` 保存当前 episode 并进入下一个；`←` 删除当前 episode 重录；`ESC` 停止、编码视频并上传。

**上传数据集**：录制的数据会自动上传到 Hub 的 `repo_id` 下，先用 `hf auth login` 登录，token 在 <https://huggingface.co/settings/tokens> 获取。

**训练参数要点**：

- 策略类型：`act`、`diffusion`、`smolvla`、`pi05`
- 设备：`cuda`（NVIDIA）、`mps`（Apple Silicon）、`cpu`
- 本地无 GPU：加 `--job.target=<flavor>`（如 `a10g-small`）即可把 `lerobot-train` 交给 Hugging Face Jobs 跑，它会自动上传本地数据集并推送训练好的模型；用 `hf jobs hardware` 查看可选配置
- 断点续训：`--config_path=<checkpoint 路径或 Hub repo id> --resume=true`（也可叠加 `--job.target` 在云上续训）

**深度录制与视频编码**：

- Intel RealSense 相机写成 `type: intelrealsense` 并设 `use_depth: true` 即可录深度流；深度被量化为 12-bit 编码并单独存成一路视频，配合 `--dataset.depth_encoder.depth_min/depth_max/shift/use_log` 调参
- RGB 与深度两路的编码参数互相独立：`--dataset.rgb_encoder.vcodec=h264`、`--dataset.rgb_encoder.pix_fmt=yuv420p`、`--dataset.rgb_encoder.crf=23`；深度可用 `--dataset.depth_encoder.vcodec=hevc` 加 `--dataset.depth_encoder.extra_options='{"x265-params": "lossless=1"}'`

**部署注意**：`lerobot-rollout` 的相机配置必须与采集数据集时一致；`--duration` 单位为秒，不指定则一直运行。若使用旧版本 V0.5.1，推理要用 `lerobot-record` 而不是 `lerobot-rollout`。

## 六、算力规划：显存与训练时长

> 官方强调下列数字是**量级参考**，用于选硬件，不是精确预测；实际吞吐受数据集 I/O、图像分辨率、batch size、GPU 数量影响较大，偏差可能 ±50%。

**按策略分组的显存需求**（峰值显存基于 batch size 8 + AdamW；显存与 batch 近似线性；AdamW 的优化器状态会比单纯前反向多出约 30–100%）：

| 分组 | 策略 | 峰值显存 | 可用的入门 GPU |
| --- | --- | ---: | --- |
| 轻量行为克隆 | `act`、`vqbet`、`tdmpc` | ~2–6 GB | 笔记本 GPU（RTX 3060）、L4、A10G |
| Diffusion | `diffusion`、`multi_task_dit` | ~8–14 GB | RTX 4070+ / L4 / A10G |
| 小型 VLA | `smolvla` | ~10–16 GB | RTX 4080+ / L4 / A10G |
| 大型 VLA | `pi0`、`pi0_fast`、`pi05`、`xvla`、`wall_x` | ~24–40 GB | A100 40 GB+（24 GB 卡在 batch 1 很勉强） |
| 多模态 | `groot`、`eo1` | ~24–40 GB | A100 40 GB+ |
| 强化学习 | `sac` | 随配置而定 | 见 HIL-SERL 指南 |

**显存不够怎么办**：降低 batch size（近似线性下降）、用梯度累积把有效 batch 补回来；SmolVLA 可以保持 `freeze_vision_encoder=True`。

**训练时长估算**：机器人模仿学习通常 **5–10 个 epoch** 就会收敛，而不是几十万步。

```text
total_frames    = 所有 episode 的帧数总和        # 例：50 ep × 30 fps × 30 s ≈ 45,000
steps_per_epoch = ceil(total_frames / (num_gpus × batch_size))
total_steps     = epochs × steps_per_epoch
wall_clock      ≈ total_steps × per_step_time
```

常见场景（5 epochs、约 50 episode / 45k 帧、640×480 图像、AdamW）：

| 硬件 | 策略 | Batch | 墙钟时间 |
| --- | --- | ---: | ---: |
| 单卡 RTX 4090 / 3090（24 GB） | `act` | 8 | ~30–60 min |
| 单卡 RTX 4090 / 3090（24 GB） | `diffusion` | 8 | ~2–4 h |
| 单卡 L4 / A10G（24 GB） | `act` | 8 | ~1–2 h |
| 单卡 L4 / A10G（24 GB） | `smolvla` | 4 | ~3–6 h |
| 单卡 A100 40 GB | `smolvla` | 16 | ~1–2 h |
| 单卡 A100 40 GB | `pi0` / `pi05` | 4 | ~4–8 h |
| 4×H100 80 GB（`accelerate`） | `diffusion` | 32 | ~30–60 min |
| 4×H100 80 GB（`accelerate`） | `smolvla` | 32 | ~1–2 h |
| Apple Silicon M1/M2/M3 Max（MPS） | `act` | 4 | ~6–14 h |

**多卡很关键**：`accelerate launch --num_processes=N` 是最省事的加速方式，计算密集型任务 4 卡≈4 倍加速。判断瓶颈看 `dataloading_s` 与 `update_s` 的比值：当 `dataloading_s` 逼近 `update_s` 时，加 GPU 已经没用了，应先调 `--num_workers`、图像分辨率和磁盘速度。

**缩短训练时要同步缩短学习率日程**：如果只跑 5k–10k 步，请把 `--policy.scheduler_decay_steps` 设到接近 `--steps`，否则学习率一直停在峰值不衰减；`--save_freq` 同理。

**跑在哪**（VRAM 是第一筛选项，`$` 表示相对价位）：

| 类别 | 显存 | 价位 | 适合 |
| --- | --- | --- | --- |
| RTX 3090 / 4090（消费级） | 24 GB | `$` | 轻量 BC、Diffusion、SmolVLA；VLA 在 batch 1 时很紧张 |
| L4 / A10G（云） | 24 GB | `$–$$` | 同上；Google Cloud、RunPod、AWS `g5/g6` 常见 |
| A100 40 GB | 40 GB | `$$$` | 任何策略、合理 batch |
| A100 / H100 80 GB | 80 GB | `$$$$` | 多卡集群；VLA 大 batch |
| 纯 CPU | — | — | 别训练，用 Colab 或租 GPU |

**Hugging Face Jobs（云端托管训练）**：按秒计费，不用自己买 GPU，`lerobot-train` 会自动提交并流式返回日志：

```bash
lerobot-train \
  --policy.type=act --dataset.repo_id=<USER>/<DATASET> \
  --policy.repo_id=<USER>/act_<task> \
  --job.target=a10g-large
```

- 提交前执行一次 `hf auth login`，任务以你的 token 运行
- `--job.target` 可选：`t4-small` / `t4-medium`（T4，仅适合 ACT）、`l4x1` / `l4x4`（L4 24 GB）、`a10g-small/large/largex2/largex4`（A10G 24 GB 可扩展）、`a100-large`（A100）；`hf jobs hardware` 列出当前目录与价格
- 默认超时 `2d`（48 小时），可用 `--job.timeout=4h` 覆盖；命令跑完任务自动停止

## 七、数据、仿真与生态

- **LeRobotDataset**：官方标准格式，可从 Hub 加载、流式读取、可视化机器人数据集
- **Hub 组织**：<https://huggingface.co/lerobot>
- **仿真与基准**：EnvHub / 仿真环境文档；LIBERO、Meta-World 等基准可作评估；仿真环境包 `aloha`（gym-aloha）、`pusht`（gym-pusht）
- **LeLab**：浏览器 GUI，覆盖校准、录制、训练全流程，不想用命令行时的首选
- **电机驱动**：Koch v1.1 → Dynamixel SDK；SO100 / SO101 / Moss → Feetech SDK
- **实验跟踪**：Weights & Biases（`training` extra 自带）

## 八、常见问题

- **相机画面模糊、不可用** → 光照比分辨率更重要，见 Cameras 指南
- **构建或安装报错**（`cmake`、`ffmpeg`、CUDA）→ 见安装指南的 Troubleshooting 小节
- **不确定哪个策略适配自己的 GPU** → 见 Compute & Hardware Guide
- **还是卡住** → Discord 社区（LeRobot 团队也在里面）：<https://discord.gg/s3KuuzsPFb>

## 九、官方文档索引

| 内容 | 链接 |
| --- | --- |
| 文档首页 | <https://huggingface.co/docs/lerobot/index> |
| 安装指南 | <https://huggingface.co/docs/lerobot/installation> |
| 命令速查表 | <https://huggingface.co/docs/lerobot/cheat-sheet> |
| 算力与硬件指南 | <https://huggingface.co/docs/lerobot/hardware_guide> |
| LeRobotDataset | <https://huggingface.co/docs/lerobot/lerobot-dataset-v3> |
| LeLab（GUI） | <https://huggingface.co/docs/lerobot/lelab> |
| 策略（从 ACT 开始） | <https://huggingface.co/docs/lerobot/act> |
| 仿真与基准 | <https://huggingface.co/docs/lerobot/envhub> |
| 相机 | <https://huggingface.co/docs/lerobot/cameras> |
| 多 GPU 训练 | <https://huggingface.co/docs/lerobot/multi_gpu_training> |
| HIL-SERL（强化学习） | <https://huggingface.co/docs/lerobot/hilserl> |
| Hub 组织页 | <https://huggingface.co/lerobot> |
| HF Jobs | <https://huggingface.co/docs/hub/jobs> |
| 代码仓库 | <https://github.com/huggingface/lerobot> |
| Discord | <https://discord.gg/s3KuuzsPFb> |

> 注：`huggingface.co` / `github.com` 直连可能超时，国内可用镜像 <https://hf-mirror.com/docs/lerobot/index> 阅读文档。

## 十、本项目接入清单（待办）

- [ ] 明确项目目标与可用硬件：有无 SO-101 / LeKiwi，还是先走纯仿真 + Hub 数据集路线
- [ ] 搭环境：conda + Python 3.12，按 CUDA 版本选 torch 索引（Windows 注意 TorchCodec / `pyav` 回退）
- [ ] 无硬件起步：选一个 Hub 上的 LeRobot 数据集，用 `act` 跑通训练，并在仿真基准上评估
- [ ] 有硬件起步：`lerobot-find-port` → `lerobot-find-cameras` → `lerobot-calibrate` → `lerobot-teleoperate` → `lerobot-record`
- [ ] 选策略：入门用 `act`（2–6 GB 显存）；有 10–16 GB 可试 `smolvla`；`pi0` / `pi05` 需 A100 级或云端
- [ ] 估算数据量与训练预算（epoch 数、总帧数、墙钟时间），必要时用 HF Jobs 云端训练
- [ ] 用 W&B 跟踪实验；规划 `repo_id` 命名规范，数据集与策略都推到自己的 Hub 空间
- [ ] 部署前核对：相机配置与采集时一致、`--duration` 合理、安全急停方案

## 关联笔记

- [[具身智能]]
- [[人工智能]]
- [[AMASS 项目开发文档]]
