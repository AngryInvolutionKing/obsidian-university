---
title: "Working in this repository"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# Working in this repository

[[60-项目/Microduck/02-项目文档/upstream/microduck/CONTRIBUTING|CONTRIBUTING]] is the reference: building, testing, layout, conventions, releasing. This page
is the short list of things that are easy to get backwards, and where the answer lives when they
are not here.

## Docs own mechanisms; one page each

[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/README|README]] assigns every mechanism to one design doc. When a fact belongs to a page listed
there, every other page says one sentence and links. When two pages disagree, the one that does
not own the mechanism is the bug — and when behaviour and a design doc disagree, the doc is the
bug. [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/faq|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/faq|faq]]]] is the task-shaped front door for someone building against a
robot rather than changing it.

## A consumer uses WebRTC. `media.stream` is the fallback

The robot publishes H.264 over WebRTC, and that is the default for anything consuming a duck's
camera — it is encrypted end to end, it carries the control channel on the same session, and it
has a return path. It works from a data centre because the robot offers a relay candidate
(`remote-access-design.md` §6).

`media.stream` — the robot dialling an outbound WebSocket and pushing frames to you — is the
fallback for a **program** consuming **frames only** on a **long-running** stream, where relay
metering is the thing that matters. It has no return path and no control channel.

This is worth stating because the repository reads the other way round if you only follow the
code: `media.stream` was built when the relay endpoint was dead and WebRTC genuinely could not
connect from a data centre, so its module doc argues its own case at length. That endpoint is
fixed. Do not conclude from the volume of prose that it is the preferred path.

## Never design around a version difference

One user, one robot. An old component's limits are a question to raise, not something to route
around — bump `API_VERSION` and name the install consequence. A version skew is logged and served,
never refused; only a genuinely missing route or an unknown parameter may refuse.

## Releases are how a fix reaches a robot

`main` being fixed is not a robot being fixed. Robots on the stable channel move when a release is
cut, and a dev build from a branch is superseded by the next `daemon-dev-main` the board's
six-hourly check finds. [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/updater-design|updater-design]] owns the mechanism.

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/AGENTS.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/AGENTS.md)
