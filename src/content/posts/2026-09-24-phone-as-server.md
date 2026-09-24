---
title: 把旧手机变成家庭服务器
date: 2026-09-24
summary: 骁龙 865、8GB RAM、LineageOS——一台退役的 Android 旗舰，现在插着充电器放在桌角，跑着十几个服务。
tags: [折腾, homelab, Android]
model: claude-4.6-sonnet
duration_s: 600
steps: 22
tokens_in: 15000
tokens_out: 2000
polished: false
---

红米 K30S Ultra，骁龙 865，8GB RAM，换了新手机之后就一直放着。

想着反正是 ARM64，性能比树莓派强，接上充电器插在桌角，折腾了一番，现在它一直在跑东西。

---

## 方案

Termux + chroot-distro，在 Android 里 chroot 进 Ubuntu 24.04。真 root、真 chroot、共享内核，不是虚拟机，也不是 proot 那种用户态模拟。进去之后就是正经 Linux，该装什么装什么，ARM64 生态现在也挺完整的。

---

## 跑着什么

### 基础层

**sshd** — 最基本的，SSH 进去就是 Linux。

**supervisord** — 所有服务统一托管，开机自启，挂了自动重拉。

**Cloudflare 隧道** — 家里没公网 IP，靠 cloudflared 从内网建隧道出去。每个服务都挂在自己的域名下，手机在家，外面也能访问。

**Clash（mihomo）** — 代理服务。不只自己用，容器里所有服务的出站流量都走这里。

### 访问与桌面

**ttyd** — Web 终端，浏览器打开就能敲命令，不用装 SSH 客户端。用别人电脑临时要开终端时很方便。

**noVNC + LXDE** — 浏览器打开出来的是完整 Linux 图形桌面。做需要图形界面的事走这个，比如浏览器自动化任务就跑在这个桌面上，可以实时看到操作过程。

### AI 工具

这部分是折腾这台手机最主要的动力。

**cliproxyapi（cpa）** — AI 接口网关，把 Claude、Gemini、DeepSeek 这些 API 代理转发，统一接口格式。跑在手机上，不绑定某台电脑，随时能用。这台手机上所有的模型调用都经过它。

**DeepSeek Harness（dsh）** — AI 对话的 Web 界面，在这台手机上当实验跑。本体不算特别特别，有意思的是两个插件：

- **dsh-proactive**：定时或事件触发，让 AI 主动给你发消息。可以设 agent 开机后自动检查状态，或者在特定时间发提醒，也可以跑 living agent——虚拟角色有自己的日程，每天按时"过日子"，到了时间就给你发消息。手机 7×24 在线，这类需要持续运行的功能放在这里刚好。

- **dsh-im**：把 AI 对话接进 IM，可以在微信、QQ、Telegram 里直接跟 AI 说话。回复有打字效果、分段发送。因为服务跑在本地，延迟比走云端低一些。

**codeg** — 另一个 AI coding agent 的 Web 界面，支持接入多种 agent 框架，UX 比较顺手，当备用入口用。有时候想换个界面风格，或者用不同的 agent 后端，走这个。

### 文件与存储

**AList** — 聚合网盘，把各种云盘统一管起来，一个界面进去。

**WebDAV** — 需要 WebDAV 协议挂载的，走这个服务端。

**聚合搜索（degoog）** — 整合多个搜索引擎，主要给 AI agent 调用，不是给人用的。

---

## 踩过的坑

```
PROBLEM: Termux 打开闪退
CAUSE:   LineageOS 23.2 的 devpts 挂载 ptmxmode=000，SELinux 缺少 untrusted_app_27 规则
FIX:     Magisk policy 动态注入 SELinux 规则 + remount devpts ptmxmode=666

PROBLEM: chroot 里 git / apt / python 莫名报错
CAUSE:   /proc 和 /sys 没挂，或者挂了但没设 --make-rprivate，挂载事件相互传播
FIX:     /dev /proc /sys 三个都挂，三个都 rprivate

PROBLEM: Python multiprocessing / POSIX 信号量 ENOENT
CAUSE:   Android /dev 是 tmpfs，没有 /dev/shm
FIX:     启动脚本里 mount tmpfs /dev/shm

PROBLEM: 开机后服务起不来
CAUSE:   Termux:Boot → chroot-distro 链路里 su 路径查找找不到 Magisk su
FIX:     改用 Magisk service.d 钩子，在宿主 root 下直接挂载+启动，绕过中间层

PROBLEM: 每次执行启动脚本都报"锁被占用"
CAUSE:   flock fd 没关闭，supervisord 作为子进程继承了这个锁
FIX:     启动 supervisord 时加 9>&-，子进程关闭继承的 fd
```

---

## 现在的状态

就这么放着，安静，不烫，不吵。骁龙 865 跑这些服务没什么压力，8GB RAM 跑完还有余量。

这类持续在线的服务——proactive agent、IM bot、API 网关——放在一台一直插着电的手机上比放在电脑上合适，不用担心睡眠、关机、或者被其他任务抢资源。
