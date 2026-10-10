---
title: "3D-Printable Parts"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# 3D-Printable Parts

[[60-项目/Microduck/02-项目文档/print/README|简体中文]] · **English**

Every STL for the whole robot, split into **print these** and **buy these**, with bilingual filenames.

| Directory | Count | What it is |
|---|---|---|
| [[`打印件/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%89%93%E5%8D%B0%E4%BB%B6)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%89%93%E5%8D%B0%E4%BB%B6) (print) | **37** | Structural parts you print yourself |
| [[`标准件-无需打印/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%A0%87%E5%87%86%E4%BB%B6-%E6%97%A0%E9%9C%80%E6%89%93%E5%8D%B0)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/%E6%A0%87%E5%87%86%E4%BB%B6-%E6%97%A0%E9%9C%80%E6%89%93%E5%8D%B0) (do not print) | **9** | Models of bought parts — servos, bearings, battery, PCBs. **For fit and interference checking only** |

> These are **individual parts**, for printing.
> For **assembly relationships** see [[`../cad/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/cad) — 16 sub-assemblies merged along the kinematic tree.

## Filename convention

```
upper_leg_left_左上腿.stl
└─ upstream name ─┘└ zh ─┘
```

The first half is the original filename from `microduck_rl`, so it cross-references the MJCF and the
source; the second half is Chinese, so a Chinese-speaking builder can tell what it is at a glance.

## Differences from upstream

Upstream `microduck_rl` ships **53 STLs**. This directory carries **46**.

**The 7 left out** are XL330 test-bench fixtures, not robot parts:

```
bench_holder  weight  spacer  axis  arm  part_1 … part_5
```

**One duplicate removed**: the same left upper leg ships upstream under two names
(`upper_leg_left` and `left_upper_leg`), byte-for-byte identical. Only
`upper_leg_left_左上腿.stl` is kept here.

> ⚠️ **Do not mistake `upper_leg_left` and `upper_leg_right` for the same part** — they are
> different geometry. You need both.

## Printing notes

No official print settings exist (upstream never published any). Measured findings so far are in
[[60-项目/Microduck/02-项目文档/BUILD-LOG.en|[[60-项目/Microduck/02-项目文档/BUILD-LOG.en|BUILD-LOG.en]]]].

A few things the geometry itself tells you:

- **Head and trunk shells** are cosmetic — 0.12–0.16 mm layers
- **Leg structural parts** carry load — increase perimeters and infill
- **`soft_mouth_top` / `jaw_soft`** are named *soft*; the originals are presumably a flexible
  material (TPU family)
- **`tire_轮胎`** likewise — a roller-skating tyre printed in rigid filament will simply slip
- Use **heat-set inserts** for the M2 holes rather than tapping the plastic. Screw list:
  [[60-项目/Microduck/02-项目文档/docs/fastener-reconstruction.en|[[60-项目/Microduck/02-项目文档/docs/fastener-reconstruction.en|fastener-reconstruction.en]]]]

## Licence

These STLs are a **derivative** (renaming and sorting) of files published by upstream
`pollen-robotics/microduck_rl`, and carry the same **CC BY-NC-SA 4.0** terms: attribution,
share-alike, non-commercial.

See [[60-项目/Microduck/02-项目文档/NOTICE|[[60-项目/Microduck/02-项目文档/NOTICE|NOTICE]]]].

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/01-机械与模型/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/print/README.en.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/print/README.en.md)
