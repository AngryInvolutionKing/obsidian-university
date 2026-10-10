---
title: "Contributing"
type: microduck-doc
tags:
  - Microduck
  - Microduck/项目文档
---
# Contributing

For working on the daemons themselves. To use a robot rather than change it, see the
[[60-项目/Microduck/02-项目文档/upstream/microduck/README|README]].

## Building and testing

Needs Rust **1.89+** (stable). The robot is aarch64 Linux; you develop on Linux or macOS, and
the two are not quite the same checkout — see below.

```bash
cargo test --workspace
```

No hardware, no network, no Docker. If they pass, your checkout is sound.

**On Linux** that command needs some C libraries first, the same ones CI installs: [`padd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/padd) binds
`libudev` through `gilrs`, and [`mediad`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/mediad)'s pipeline is `cfg(target_os = "linux")`, so a Linux host
compiles GStreamer where a Mac does not.

```bash
sudo apt-get install -y libudev-dev libgstreamer1.0-dev
```

```bash
sudo apt-get install -y libgstreamer-plugins-base1.0-dev libgstreamer-plugins-bad1.0-dev
```

**On macOS** the command above is the whole of it — **942 tests passing**, nothing excluded. Two
of the ToF driver's own tests do not run there, because there is no driver to run them against:
`vendor/platform.c` reaches the bus through `linux/i2c.h`, so `build.rs` compiles it on Linux
targets only and `sensor.rs` offers a `Sensor` that cannot be opened. `tofd` still builds and
`tofd --fake` still serves frames, which is the only way it runs off a board anyway.

Those tests are also where the engine's failure paths are: a bad signature, a release that comes
up unhealthy, a post-install hook that fails, power loss between the swap and the health gate.
Each drives the real engine with the fault injected rather than a mock of it, so
[`updater/tests/apply.rs`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/updater/tests/apply.rs) is the honest answer to "what does this actually guarantee" — more so
than anything you could run by hand.

One crate at a time, and formatting:

```bash
cargo test -p <crate>
```

```bash
cargo fmt --all
```

[`configd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/configd)'s NetworkManager client and [`btd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/btd)'s BlueZ client are **Linux-only**, so a host build and
a green test run say nothing about them. Lint against the board's target or the breakage ships:

```bash
RUSTFLAGS="-D warnings" cargo clippy -p configd --all-targets --target aarch64-unknown-linux-gnu
```

[`scripts/board-test.sh`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/scripts/board-test.sh) runs in CI against the userland we ship: it cross-compiles for the board
and executes 60 assertions — rollback, tampered-artifact refusal, boot-counter recovery, socket
modes, peer-credential authorization, and everything `setup-board.sh` and `install.sh` do to a
board — on Debian 13 (Trixie). `BOARD_IMAGES=` runs it against another.

To run a change on a real robot without publishing it, `scripts/dev-push.sh <user@board>` builds
here and installs there as an ordinary gated update. It cross-compiles with `cargo zigbuild` by
default, or with `--docker` builds inside the board's userland instead, which needs no toolchain
set up at all. Setup, the flags and the failure modes:
[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/dev-push|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/robot/dev-push|dev-push]]]].

## The layout

```
the daemons — one crate each, one unit each, all in the same release artifact
  robotd/         control daemon: the 50 Hz loop, the voice, the theremin, the chorale
  updater/        engine + updaterd
  configd/        wifi · robot name · pairing PIN · reboot · gamepad pairing
  btd/            the BLE front door
  padd/           gamepad → intents — an ordinary socket client, no privileged access
  mediad/         camera, mic, WebRTC, the remote gateway, and the console it serves
  tof/            tofd: the head's 8×8 depth sensor. Publishes frames, reads nothing

the libraries they drive — no sockets, no systemd, nothing starts them
  duck-ipc-proto/ the wire contract
  duck-control/   the control core: model · bus · IMU · observations · policy · safety
  kinematics/     the MJCF model and forward kinematics; head and hand chains
  odometry/       where the robot has been, from foot contacts and the IMU
  sounds/         synthesis, per-robot voice personality, the chorale's score
  pet-detect/     a small CNN that hears head scratches on the onboard mic
  robotd-params/  robotd's startup parameters: schema, defaults, validation

the tools
  robotctl/       the local CLI, including `monitor`
  duckctl/        the laptop-side client — never shipped, never cross-built
  xtask/          package · sign · promote — build tooling, never shipped
  test-support/   signed-release fixtures for tests; never shipped

deploy/         what a robot is configured with: updater.toml, robotd.toml, trust anchor, journald
hooks/          preinstall · postinstall — what runs inside an update, from the artifact,
                and the only thing that runs on every board on every update: anything
                install.sh does to a board belongs here too (updater-design.md §9.1)
scripts/        provision-board.sh · dev-push.sh + dev-build.Dockerfile (from your machine) ·
                provision.sh → setup-board.sh → setup-gstreamer.sh · setup-rkaiq.sh ·
                migrate-network.sh · install.sh (on the board) ·
                setup-login.sh · setup-quiet-boot.sh (install.sh and postinstall both run these) ·
                robot-boot-check · robot-rescue (recovery, installed to /usr/local/sbin) ·
                pad-link-test.sh · pad-stack-report.sh (gamepad radio, on the board) ·
                board-test.sh · systemd-test.sh (CI) · cross-sysroot.sh (cross-builds) ·
                bake-duck-mesh.py (the monitor's 3D model, run by hand)
docs/           robot/ (using one) · design/ (how it works) · project/ (roadmap, records) ·
                ideas/ (not designed yet)
```

Services talk over unix sockets, JSON-RPC 2.0 one object per line. The contract lives in
[`duck-ipc-proto`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/duck-ipc-proto), which depends on serde and semver and nothing else — so [`btd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/btd) and [`robotd`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/robotd)
never inherit the update engine's http/tar/crypto tree.

[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/architecture|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/design/architecture|architecture]]]] §1 has what each service is and why it is its own
process. [[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/roadmap|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/roadmap|roadmap]]]] has what actually works today.

## Conventions

- **Comments say why, not what.** The reason a thing is the way it is outlives the code.
- **Every non-obvious decision gets a test**, and the test's comment says which failure it
  exists to prevent. The rollback paths especially: they only ever run when something else has
  already gone wrong, so they are the code most likely to be quietly broken.
- **Reach for an existing crate** before writing it yourself. Dependency count is not the thing
  being optimised; maintenance is.
- Commit trailers use `Assisted-by:`, not `Co-Authored-By:`, for AI assistance.

## Media in the README

The videos and the hero image are **GitHub attachments, not files in this repo**: drop a clip into
the comment box of any issue or pull request and GitHub hands back a
`https://github.com/user-attachments/assets/<id>` URL. Nothing to commit, nothing to keep in sync —
and nothing in a clone either, so those tiles are blank without a network.

Inside the README's `<table>` the URL has to go in an element, because markdown is not parsed in
block HTML and a bare URL there stays text:

```html
<video src="https://github.com/user-attachments/assets/<id>" controls width="100%"></video>
```

**A video cannot autoplay or loop.** Verified against the renderer itself
(`POST https://api.github.com/markdown`): of `src autoplay muted loop controls playsinline preload
poster width`, only `src`, `muted`, `controls` and `width` survive the sanitiser. So a video waits
for a click, and the only media that moves on its own is an animated image — a GIF, or an animated
WebP at a fraction of the size:

```bash
ffmpeg -i clip.mp4 -vf "fps=15,scale=560:-1:flags=lanczos" -loop 0 -q:v 55 walk.webp
```

Two or three seconds, treated as a moving thumbnail. Use a video where sound or length matters.

## Releasing

Releases are signed **in CI**, never locally. The entry point is the GitHub releases page, and the
tag decides what happens:

| you create | what CI does |
|---|---|
| a **pre-release** tagged `daemon-staging-v0.4.0` | builds, signs, verifies through the real update engine, publishes to **staging** |
| a **release** tagged `daemon-v0.4.0` | **promotes** staging 0.4.0 if it exists — the same bytes, re-signed — otherwise builds 0.4.0 directly |

Pushing either tag from a terminal does the same thing:

```bash
git tag daemon-staging-v0.4.0 && git push --tags
```

The canaried path is two steps on purpose: publish the pre-release, install it on a robot, then
create the release. Creating a release with no staging build to promote is allowed and says so in its
own notes — verified in CI, never run on a robot.

Bump the workspace version first. `xtask package` refuses a tag that disagrees with [`Cargo.toml`](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/Cargo.toml),
which is what stops a robot reporting a version it is not running.

`gh workflow run promote --field version=0.4.0` is the same promotion without a release to create
first, and is where `min_supported` lives.

[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/ci-setup|[[60-项目/Microduck/02-项目文档/upstream/microduck/docs/project/ci-setup|ci-setup]]]] covers key custody, the secrets, and rotation.

---

> [!info] 导航与源文件
> [[60-项目/Microduck/00-Microduck 总览|Microduck 总览]] · [[60-项目/Microduck/01-使用中心/00-使用中心索引|使用中心索引]] · [[60-项目/Microduck/02-项目文档/00-项目文档索引|项目文档索引]] · [[60-项目/Microduck/01-使用中心/04-软件与算法/00-使用教程|相关教程 (../)]]
> [使用中心 Word](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/11-Word%E7%89%88/upstream/microduck/CONTRIBUTING.docx) · [Markdown 原稿](file:///C:/Users/zhang/Desktop/Microduck%20%E4%BD%BF%E7%94%A8%E4%B8%AD%E5%BF%83/08-%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93/microduck-replica/upstream/microduck/CONTRIBUTING.md)
