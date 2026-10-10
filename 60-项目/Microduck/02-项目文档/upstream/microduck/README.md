---
title: "README"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
![microduck](https://github.com/user-attachments/assets/c2f7c245-8217-46a1-8d1e-e0ba967cd969)


<h1 align="center">Microduck</h1>


  A tiny biped robot that moves using reinforcement learning policies.



  [Get yours here](https://pollen-robotics.com/microduck) ·
  [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet|Cheat sheet]] ·
  [Training the policies](https://github.com/pollen-robotics/microduck_rl) ·
  [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/architecture|How it works]] ·
  [[60-项目/Microduck/02-项目文档/upstream/microduck/CONTRIBUTING|Contributing]]



  ![CI](https://github.com/pollen-robotics/microduck/actions/workflows/ci.yml/badge.svg) [↗](https://github.com/pollen-robotics/microduck/actions/workflows/ci.yml)


---

**This repo is the duck's brain.** About 25 cm and 800 g of robot, run by a handful of daemons on a
Rockchip RK3566: a 50 Hz control loop driving fifteen servos from neural policies, the radios and
the camera, and the update machinery that gets new software onto a robot without bricking it.

Everything you need to run a Microduck is here. **If you want one,
[get yours here](https://pollen-robotics.com/microduck).**

The policies it runs are trained next door, in
**[microduck_rl](https://github.com/pollen-robotics/microduck_rl)** — MuJoCo and PPO, the sim2real
recipe, and the export to ONNX that this repo loads.

## It does things




  <video src="https://github.com/user-attachments/assets/356a6011-8e0d-4b28-bda9-da78646583a3" controls width="100%"></video>


  <video src="https://github.com/user-attachments/assets/abfbf250-1b1c-42cb-8430-00267e2b148a" controls width="100%"></video>




It walks. Pick up a gamepad and drive.
It rolls. Put wheels on, hold D-pad up, and it loads the other brain.



  <video src="https://github.com/user-attachments/assets/7e70c1da-e120-428f-ae0b-f4de62f25984" controls width="100%"></video>


  <video src="https://github.com/user-attachments/assets/3eef63a5-6f84-47cf-90de-e717e6d7f8f0" controls width="100%"></video>



It picks things up. Beak to the floor, one button.
It gets back up. Knock it over and it stands itself up.



It also sits, kicks a ball, rolls forward on command, and quacks in a voice that is its own.

## Where to find things

### You have a duck

| | |
|---|---|
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet|Cheat sheet]] | Every [`robotctl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/robotctl) command: drive, configure, voice, chorale, theremin, wifi, updates, logs. Start here. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet#gamepad-configd|Gamepad]] | The full button mapping, and pairing a pad — [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/pair-a-gamepad|once per pad]], plus what to do when it will not bond. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/duckctl|[`duckctl`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/duckctl)]] | The robot from a laptop over Bluetooth, with no network and no ssh. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet#updates-updaterd|Updates]] | Install, roll back, pin. Every update is verified, health-gated and reversible. |

### You are building on it

| | |
|---|---|
| [microduck_rl](https://github.com/pollen-robotics/microduck_rl) | Where the policies come from: MuJoCo, PPO, domain randomisation, and the ONNX export this repo loads. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/architecture|How it works]] | The whole system on one page — the daemons, the bus, how an update reaches a robot — then a page per part. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/install-dev|Set up a dev board]] | From a blank board to a robot that takes branch builds. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/cheatsheet-dev|Dev cheat sheet]] | Branch builds, release candidates, driving from a laptop, and the restart traps after an update. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/dev-push|Push your branch]] | Build on your machine, install over ssh, about a minute. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/simulation|The simulated duck]] | No robot on the desk? [`scripts/duck-sim`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/scripts/duck-sim) runs the real daemons against a body in MuJoCo — one duck in a window, or four as machines you log into. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/CONTRIBUTING|CONTRIBUTING.md]] | Building, testing, layout, conventions, releasing. |
| [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/README|Docs index]] | Everything, including the design pages and the open problems. |

## Under the hood

Rust, no framework, one workspace. [`robotd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/robotd) owns the control loop and the motor bus; `updaterd`
installs signed releases and rolls them back when a robot comes up unhealthy; [`configd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/configd) owns wifi
and identity; [`btd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/btd) is the Bluetooth path a phone uses; [`padd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/padd) reads the gamepad; [`mediad`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/mediad) streams
the camera over WebRTC; `tofd` serves the depth sensor. They talk over one JSON-RPC contract on
Unix sockets, and every client — the app, the console, the gamepad, your script — sends exactly the
same calls.

The interesting decisions are written down: [[`docs/design/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/design)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/design) is why things are the
way they are, and [[`docs/project/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/project)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/docs/project) is what has gone wrong and what would close it.

## A note on ducks

No duck was harmed in the making of this robot. Several were consulted.

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/README.md)
