# 博文素材：旧手机变服务器

## 核心主题
讲"我把旧手机变成了家庭服务器，跑了一堆有趣服务"这件事。
**语气**：像跟朋友聊，轻松有料。不是教程，不是推广，就是分享"我折腾了什么、踩了哪些坑、用起来有多爽"。

---

## 硬件情况
- **设备**：红米 K30S Ultra（骁龙 865，8GB RAM，ARM64）
- **系统**：LineageOS 23.2（刷了第三方 ROM，真 root）
- **方案**：Termux + chroot-distro Ubuntu 24.04，在 Android 里跑一个真正的 Linux 容器
  - **关键点**：是真 chroot，不是虚拟机，不是 proot 降级方案，是真 root、共享内核
  - 骁龙 865 ARM64，跑 Ubuntu 毫无违和感

---

## 跑的服务（来一一介绍几个有意思的）
1. **sshd** - 最基本，SSH 进去用手机当 Linux 机器
2. **ttyd** - Web 终端，浏览器里就能用，不用装 SSH 客户端
3. **noVNC + LXDE** - 有桌面！浏览器里打开就是完整 Linux 图形界面，可以在上面操作
4. **Cloudflare 隧道（cloudflared）** - 这个是关键！手机在家，但服务都有公网域名，走 CF 隧道，没有公网 IP 也能访问
5. **Clash/mihomo** - 代理服务，不只是自己用，作为基础设施给所有容器内服务都走代理
6. **AList** - 聚合网盘管理，把各种云盘统一管起来
7. **WebDAV** - 网盘协议，手机作为服务端
8. **cliproxyapi (cpa)** - AI 接口网关，把各家 AI API 代理转发，统一接口
9. **DeepSeek Harness (dsh)** - 对话式 AI 助手 Web GUI（这个不要重点说，用户特别说了不是推广自己开发的项目）
10. **degoog** - 聚合搜索服务，组合多个搜索引擎
11. **supervisord** - 服务管理器，所有服务都归它托管，自动重启，开机自启

---

## 踩过的主要坑（这些是真实经历，写进去会有血肉感）

### 坑一：chroot 里 /dev /proc /sys 的挂载问题
- Android 每次开机，/dev 是重建的 tmpfs，chroot 环境需要把宿主 /dev bind 进去
- 踩坑：光 bind /dev 不够，还要 /proc、/sys，而且三个都要设置 `--make-rprivate`（断开挂载传播）
- 否则：/dev 活着但 /proc 死了，git add 报错，各种奇怪报错
- 最终方案：Magisk service.d 脚本，开机自动完成所有挂载

### 坑二：没有 /dev/shm
- Android 宿主的 /dev 是 tmpfs，没有 /dev/shm
- 某些程序（Python multiprocessing、POSIX 信号量）依赖它
- 解决：启动脚本里手动 mount tmpfs 进去

### 坑三：Termux 闪退
- LineageOS 23.2 的 devpts 挂载权限设置有问题（ptmxmode=000）
- 导致 Termux app 打开就闪退，根本没法用终端
- 排查：SELinux 日志 + setenforce 0 测试确认
- 修复：Magisk policy 动态注入 SELinux 规则，remount devpts 改权限
- 教训：解法很精妙，就几行，但排查过程花了很长时间

### 坑四：开机启动链的问题
- 最初的方案：Termux:Boot 应用触发启动 → 用 chroot-distro 登录 → 起服务
- 问题：chroot-distro 的 su 路径查找找不到 Magisk su 的位置，全链条失败
- 最终：改用 Magisk service.d 钩子直接在宿主 root 权限下挂载 + 启动，绕过了所有中间层

### 坑五：supervisord 进程锁泄漏
- 用 flock 防止重复启动，但 fd 没关，supervisord 继承了锁
- 导致每次重启脚本都因为"锁被占用"失败
- 修复：启动 supervisord 时加 `9>&-`，子进程关闭继承的锁 fd

### 坑六：公网访问
- 家里是运营商路由，没有公网 IP（电信 FTTR，双层 NAT）
- 解决方案：Cloudflare 隧道（cloudflared），完全不需要公网 IP，内网出发建立隧道
- 每个服务都有自己的域名，手机服务变成了有公网入口的"服务器"

---

## 用起来有多爽（这些是亮点）
- 随时 SSH 进手机，就是一台 Linux 服务器
- 浏览器打开就是桌面，不用在电脑上装任何东西
- AI 接口网关跑在手机上，不受限于一台电脑
- 手机一直联网、一直充电（插着用），7x24 在线
- 骁龙 865 性能够用，跑这些轻量服务毫不吃力
- 8GB RAM 支撑十几个服务余量还有
- 手机零噪音、功耗低，比台式机省太多电

---

## 写作要求
- 文风：轻松，像跟朋友聊，有时可以带一点口语/感叹，但不要油腻或矫情
- 不要写成教程（不需要每一步怎么做）
- 不要推广任何产品（包括 DSH / DeepSeek Harness，不要说）
- 重点在：这事儿可以做、我折腾了、踩了坑、用起来真的爽
- 踩坑的部分要有点血肉感，不是枚举，而是让人感受到"哦原来是这么发现/解决的"
- 长度：适中，博文风格，不用太长，有看点就够

## 博客 frontmatter 模板
```yaml
---
title: 标题
date: 2026-09-24
summary: 一句话摘要
tags: [标签]
model: claude-4.6-sonnet
polished: false
---
```
输出到：`/root/projects/yet-another-ai-generated-blog/src/content/posts/2026-09-24-phone-as-server.md`
