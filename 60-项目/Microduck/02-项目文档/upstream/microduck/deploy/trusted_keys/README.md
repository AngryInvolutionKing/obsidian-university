---
title: "Trusted public keys"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# Trusted public keys

The robot's trust anchor. `scripts/install.sh` copies these into
`/etc/robot/trusted_keys/`, which is `trusted_keys_dir` in
[[`../updater.toml`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/updater.toml)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/updater.toml). An artifact is acceptable if its signature verifies
against **any** key here.

| | |
|---|---|
| [`release-1.pub`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys/release-1.pub) | signs every release and promotion today |
| [`release-2.pub`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys/release-2.pub) | first rotation target if CI or `release-1` is compromised |
| [`release-3.pub`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys/release-3.pub) | last resort; its private half should never touch a networked machine |

**All three ship from the first image, and that is the whole point.** A robot can verify
only against the set baked into it, so a robot carrying one key whose private half is
later lost or leaked cannot be given a replacement over the air — it has to be re-flashed
by hand. Shipping the spares now is free; retrofitting them is impossible. See
[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/ci-setup|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/ci-setup|ci-setup]]]] for custody.

**Public keys are not secrets.** Committing them is correct and intended: they are exactly
what has to be public for anyone to verify what we sign. The private halves live in
`~/.duck-keys` and a password manager, and only `release-1`'s is in CI.

**`team.dev.pub` is deliberately not in this directory.** A robot that trusts the dev key
installs anything anyone on the team builds. It belongs only in a developer board's
`trusted_keys_dir`, alongside `allow_dev_keys = true` in that board's local
`updater.toml` — never here, which is what every robot gets. It is committed at
[[`../dev-key/`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/dev-key)](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/dev-key), which nothing installs by default.

## Adding a rotation key

Generate it, drop the `.pub` here, and it reaches robots on their next install. Note the
asymmetry: a *new* key only becomes trusted on robots imaged after it was added, so
rotation protects the fleet going forward and cannot rescue robots already in the field.
That is why the spares exist up front.

```bash
cargo xtask keygen --kind release --name release-4 --out ~/.duck-keys
```

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/deploy/trusted_keys/README.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/deploy/trusted_keys/README.md)
