---
title: "The team dev key"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# The team dev key

[`team.dev.pub`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/dev-key/team.dev.pub) — the public half of the key CI signs branch builds with, so
`robotctl update apply --ref <branch>` works on a board that trusts it.

**Not in [[`../trusted_keys/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys), deliberately.** That directory is copied onto
*every* robot by `scripts/install.sh`, and a robot that trusts this key installs anything anyone
on the team builds. This one is here instead, where nothing installs it by default —
`provision-board.sh` sends it, and `--no-dev-key` declines.

**Committing a public key gives nothing away.** Signing a build needs the private half, which
lives in `~/.duck-keys` and never leaves it. A board still only accepts dev builds if two
separate things are true — the key is in that board's `trusted_keys_dir`, *and*
`allow_dev_keys = true` in its `updater.toml`. Both are off on a customer robot, and neither is
changed by this file existing.

It was previously kept out of the repository entirely. That protected nothing the two flags above
do not already protect, and cost every new developer a round trip asking someone for a file.

Regenerating it, if the private half is ever lost — every existing dev board then needs the new
public half installed by hand, because a board only trusts what is already in its
`trusted_keys_dir`:

```bash
minisign -R -s ~/.duck-keys/team.dev.key -p team.dev.pub
```

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/deploy/dev-key/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/dev-key/README.md)
