---
title: "Docs"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# Docs

The [[60-项目/Microduck/02-项目文档/upstream/microduck/README|README]] is the front door — what a microduck is, and where to go. If you have
one in front of you and want to drive it, start at the [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet|cheat sheet]].

[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/faq|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/faq|faq]]]] is the other front door: task-shaped questions from somebody building
*against* a duck rather than changing it — running a model too heavy for the board, getting the
camera into their own program, why a Space cannot connect.

It is also where a **publisher** starts: [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/policy-manifest|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/policy-manifest|policy-manifest]]]] is the
contract for a `manifest.json` beside a microduck `.onnx`, and it owns every field. The design
docs give the reasoning and point at it.

## [`robot/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/robot) — you have a robot

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet|`cheatsheet.md`]] | Every `robotctl` command. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/pair-a-gamepad|`pair-a-gamepad.md`]] | Once per pad: pairing mode, `pad pair`, and what to do when it will not bond. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet-dev|`cheatsheet-dev.md`]] | The commands that need a dev board: branch builds, candidates, dev pushes. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/dev-push|`dev-push.md`]] | Build on your machine and install on the board over ssh, with no CI run. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/simulation|`simulation.md`]] | The simulated duck: `scripts/duck-sim`, the real daemons against a MuJoCo body, one duck or several in containers. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/duckctl|`duckctl.md`]] | Every `duckctl` command — the robot from a laptop, over Bluetooth. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/install-dev|`install-dev.md`]] | Setting up a board for development, from nothing. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/install-by-hand|`install-by-hand.md`]] | The same install as separate commands, for testing one step at a time. |

## [`design/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/design) — you are changing the daemon

How it works and why. These change rarely; when behaviour and a design doc disagree, the doc is
the bug.

**One page owns a mechanism, and the others link to it.** The table below is that assignment: if a
fact belongs to a page listed here, every other page says one sentence and points, rather than
explaining it again. A fact written down in six places drifts in six directions, each of them locally
reasonable — which is how six documents came to promise that `updaterd` and `btd` kept their old
binaries until the next reboot, two releases after they stopped doing so, including the two pages
someone reads while diagnosing exactly that. So when two documents disagree, the one that does not
own the mechanism is the bug.

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/architecture|`architecture.md`]] | The service split, the IPC contract, state ownership, safety and authority. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/robotd-design|`robotd-design.md`]] | The control loop: the Dynamixel bus and who owns the port, the model, sensing, observations, policy, safety — and what else hangs off the tick. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/updater-design|`updater-design.md`]] | The update engine: verification, atomic swap, health gate, rollback, release format. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/policy-channel-design|`policy-channel-design.md`]] | Where the ONNX policies come from: the `policies` component, trying someone else's, and what `reset` puts back. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/restart-order|`restart-order.md`]] | Which unit restarts, at which step, on every path that moves `current` — and at boot. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/app-path-design|`app-path-design.md`]] | `btd` and `configd` — how a phone configures a robot over BLE. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/mobile-app|`mobile-app.md`]] | The phone app — what it is built from, and what the robot still owes it. The code is in [`microduck-app`](https://github.com/pollen-robotics/microduck-app). |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/remote-webrtc|`remote-webrtc.md`]] | WebRTC sessions, signalling, and the control channel — how a peer drives and observes the robot. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/webrtc-console|`webrtc-console.md`]] | The WebRTC client: serving it from the robot, finding the robot, and what the page should be. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/remote-access-design|`remote-access-design.md`]] | Reaching a duck from outside the LAN: the Hugging Face account, the device flow, and the bridge to a rendezvous service. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/boot-recovery-net|`boot-recovery-net.md`]] | Falling back to golden when the release that booted cannot start its daemons. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/simulation|`simulation.md`]] | The twin: where the seam between daemon and body is, the body protocol, the fake radio, the containers, and what it is and is not a twin of. |

## [`project/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/project) — you are running the project

Dated records rather than reference. They describe a moment, and go stale on purpose.

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/roadmap|`roadmap.md`]] | Milestones, and what works today versus what is designed. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/ci-setup|`ci-setup.md`]] | One-time setup for the release pipeline: keys, secrets, rotation. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/install-path-gap|`install-path-gap.md`]] | Why four install-path bugs reached a board, and what closed it. Closed — the rule it taught is [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/updater-design|`updater-design.md`]] §9.1. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/slice-2-bringup|`slice-2-bringup.md`]] | What a real Radxa Zero 3W did with slice 2. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/update-over-ble|`update-over-ble.md`]] | Driving the update path from a phone: what it turned up, and what rollback over a radio was decided on. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/media-bringup|`media-bringup.md`]] | What a Radxa Zero 3W does about video: the VPU, what MPP needs, and the two plugins that have to be built. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/pad-minimal-pairing|`pad-minimal-pairing.md`]] | The smallest board configuration a gamepad will bond under, found by taking one away at a time. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/idle-cpu|`idle-cpu.md`]] | What the daemons do when nobody is asking them to: four things that stopped, two that were measured and left alone, and what still wants a board. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/tof-on-demand|`tof-on-demand.md`]] | `tofd`'s idle 5% is nine parts head IMU to one part depth, and the IMU has no consumer. Why the laser and the unit were left alone and the IMU got a switch. |

## [`ideas/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/ideas) — not designed yet

Holding pens. Something that is going to need a design doc, written down before it has one, so the
thinking is not lost and does not get mistaken for a decision.

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/ideas/autonomous_behavior|`autonomous_behavior.md`]] | The behavior stack: what the runtime's brain has to give up, and the ideas the chorale and theremin work left behind. |

## Elsewhere

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/CONTRIBUTING|[[60-项目/Microduck/02-项目文档/upstream/microduck/CONTRIBUTING|CONTRIBUTING]]]] | Building, testing, repo layout, conventions, releasing. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/npu-bringup|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/npu-bringup|npu-bringup]]]] | The duck detector on the RK3566's NPU: what runs, how to benchmark it, and the frame path that is still missing. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/deploy/README|[[60-项目/Microduck/02-项目文档/upstream/microduck/deploy/README|README]]]] | What a robot image is configured with, and what provisioning actually does. |

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/docs/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/README.md)
