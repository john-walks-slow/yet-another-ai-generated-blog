---
title: 旧手机放着可惜，现在它是我的服务器
date: 2026-09-24
summary: 把退役的红米 K30S Ultra 刷成 Linux 服务器，7×24 跑着十几个服务。
tags: [homelab, android, linux]
model: claude-4.6-sonnet
duration_s: 420
steps: 15
tokens_in: 10000
tokens_out: 1500
polished: false
---

红米 K30S Ultra，骁龙865，8GB RAM，退役主力机，放在抽屉里吃灰了大半年。

前阵子翻出来，想着反正闲着，刷了 LineageOS，接上充电器，插在桌角，折腾了一番。现在它每天都在跑东西。

## 方案

Termux + chroot-distro，在 Android 里 chroot 进 Ubuntu 24.04。真 root、真 chroot、共享内核，不是虚拟机，不是 proot。进去之后就是正经 Linux，该装什么装什么。

## 跑着什么

**基础层先说**：sshd、supervisord、Cloudflare 隧道。家里没公网 IP，靠 Cloudflare 隧道出去，每个服务都挂在 `*.johnnren.qzz.io` 下面，外面能直接访问。supervisord 统一托管所有服务，挂了自动重拉，开机自启。

**访问和桌面**：ttyd 是个 Web 终端，浏览器打开就能敲命令，挂在 `term.johnnren.qzz.io`。noVNC + LXDE 跑着完整的 Linux 图形桌面，浏览器里开（`vnc.johnnren.qzz.io`），需要图形界面的事走这个，比如 camoufox 浏览器自动化就跑在这个桌面上。

**网络层**：Clash (mihomo) 做代理，不只给自己用，容器里所有服务都走这个出去。另外跑了个聚合搜索服务 (degoog)，主要给 AI agent 用，整合了多个搜索引擎。

**AI 工具层**，这部分最有意思：

cliproxyapi (cpa) 是个 AI 接口网关，把 Claude、Gemini、DeepSeek 这些 API 统一代理转发，接口格式标准化。跑在手机上，不绑定某台电脑，随时能用。这台手机上所有的模型调用都走它。

DeepSeek Harness (dsh) 是个 AI 对话的 Web 界面，装在这台手机上作为实验。它有两个插件值得说：

- **dsh-proactive**：定时或事件触发，AI 主动发消息给你。比如开机后自动检查状态，或者在特定时间给你发提醒，或者跑 living agent——虚拟角色有自己的日程，每天按时"过日子"并给你发消息。手机 24 小时在线，这个用起来很合适。

- **dsh-im**：把 AI 对话接到微信、QQ、Telegram 这类 IM，手机发消息就能和 AI 对话，回复有打字效果，分段发。因为服务跑在本地，延迟低，不依赖云端。

codeg 是另一个 AI coding agent 的 Web 界面，界面体验不错，支持多个 harness。有时候想换个界面或者用不同的 agent 框架，走这个。

**文件和存储**：AList 聚合网盘，把各种云盘统一管起来（`pan.johnnren.qzz.io`）。WebDAV 服务端，需要 WebDAV 挂载的走这个（`webdav.johnnren.qzz.io`）。

## 踩过的坑

```
PROBLEM: Termux 打开闪退
CAUSE:   LineageOS devpts 挂载 ptmxmode=000，SELinux 无 untrusted_app_27 规则
FIX:     Magisk policy 动态注入 SELinux 规则 + remount devpts ptmxmode=666

PROBLEM: chroot 里 git/apt/python 各种报错
CAUSE:   /dev /proc /sys 只 bind 了 /dev，另两个没挂，或没有 --make-rprivate（挂载事件传播）
FIX:     三个都挂，三个都 rprivate

PROBLEM: Python multiprocessing / POSIX 信号量 ENOENT
CAUSE:   Android /dev 是 tmpfs，没有 /dev/shm
FIX:     启动脚本里 mount tmpfs /dev/shm

PROBLEM: 开机后服务起不来
CAUSE:   原始启动链 Termux:Boot → chroot-distro 里 su 路径查找失败
FIX:     改用 Magisk service.d 钩子，直接在宿主 root 下挂载+启动

PROBLEM: 每次重启脚本都说"锁被占用"
CAUSE:   flock fd 未关，supervisord 继承了锁
FIX:     启动 supervisord 时加 9>&-
```

## 现在的状态

手机插着充电器放在桌角，7×24 在线。骁龙865 跑这些服务没什么压力，8GB 还有余量。

它的价值主要在：一直在线、功耗低、安静。适合跑需要持续在线的东西，比如 proactive agent、IM bot、API 网关这类——需要随时响应、不能断的服务，放在一台一直插着电的手机上刚好。
