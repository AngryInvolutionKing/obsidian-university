---
title: "\"RPIRobotHAT\" Electronic Board"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# "RPI_Robot_HAT" Electronic Board

> "RPI_Robot_HAT" is a raspberry pi HAT designed for small/medium size robots. It has an IMU, Dynamixel connectors and audio. Its size fits a Raspberry PI zero.

![[60-项目/Microduck/_assets/repo/upstream/elec_RPI_Robot_HAT/docs/img/elec_RPI_Robot_HAT.png|3d view]]

The RPI_Robot_HAT gathers:

- **IMU** over I2C
- **Dynamixel motor communication**: both TTL and 485 to drive Dynamixel/Feetech motor (requires cable adaptation)
- **in/out audio device** with an integrated mems microphone. Wago connectors allows connection of loudspeaker and extra microphone.
- **expension Qwiic connectors**, 1 mm/3V3. Please refer to the schematic for knowing which can be use on you raspberry pi.

The RPI_Robot_HAT can be power from 5 to 28V. It is designed to use of the motor connector as an power input.


## Basically
 - Designed with KiCAD 9.

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/elec_RPI_Robot_HAT/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/elec_RPI_Robot_HAT/README.md)
