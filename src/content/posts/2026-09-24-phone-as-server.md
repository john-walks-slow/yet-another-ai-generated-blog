---
title: 把旧手机变成家庭服务器
date: 2026-09-24
summary: 骁龙 865、8GB RAM、LineageOS——一台退役的 Android 旗舰，现在跑着十几个服务，24 小时在线，安静得像个哑巴。
tags: [折腾, homelab, Android]
model: claude-4.6-sonnet
duration_s: 300
steps: 12
tokens_in: 8000
tokens_out: 1200
polished: false
---

家里放着一台红米 K30S Ultra，骁龙 865，8GB RAM，刷了 LineageOS 之后就闲置着吃灰。

某天忽然想——这东西跑着 Android，ARM64 架构，性能比很多树莓派强多了，为啥不用来跑服务？

于是就开始折腾了。

---

## 方案选型：不是虚拟机，不是 proot

一开始以为会很麻烦，研究了一圈发现方案其实挺干净：Termux + chroot-distro，在 Android 里 chroot 进一个 Ubuntu 24.04 环境。

关键是"真 chroot"，不是虚拟机，也不是 proot 那种用户态模拟的方案——是真 root、共享宿主内核，Ubuntu 跑起来跟原生没什么两样。骁龙 865 的 ARM64 架构，apt install 什么都能装，毫无违和感。

这台手机现在插着充电器放在桌角，SSH 进去就是一台 Linux 服务器。

---

## 跑了哪些服务

现在跑的服务有十几个，挑几个说说：

**最基础的**：sshd。手机随时在线，随时能 SSH 进去，这就是起点。

**ttyd**：Web 终端，浏览器直接开就能用，不用装 SSH 客户端，在别人电脑上临时要用终端特别方便。

**noVNC + LXDE**：这个是有点意思的——浏览器打开，出来的是一个完整的 Linux 桌面，可以在上面正常操作。不是截图，是真的图形界面，远程桌面全走浏览器。

**Cloudflare 隧道**：家里是电信 FTTR，双层 NAT，没有公网 IP。cloudflared 解决了这个问题——从内网出发建立隧道，每个服务都有自己的域名，手机在家里，服务有公网入口。

**AI 接口网关**：把各家 AI 的 API 代理转发、统一接口，跑在手机上，不绑定在某台电脑上，随时可用。

还有聚合网盘管理、WebDAV、代理服务……supervisord 统一托管，开机自启，挂了自动重启。

---

## 踩过的坑

这部分是真实经历，折腾过程里坑不少，但挺有意思的。

### /dev /proc /sys 的挂载这件事

第一次进 chroot 环境之后，基础操作都没问题，但跑 git 就报错，一些程序莫名其妙挂。

排查了很久才搞清楚：Android 每次开机，/dev 是重建的 tmpfs，chroot 环境需要把宿主的 /dev bind 进去。但只 bind /dev 不够，还要 /proc 和 /sys，而且三个都要设 `--make-rprivate`（断开挂载传播），否则挂载事件会泄漏到宿主，反过来搞乱宿主环境。

/dev 活着但 /proc 死了，就会出现各种莫名其妙的报错，看起来完全不像是挂载问题。最后的解决方案是写一个 Magisk service.d 脚本，开机自动把这一套挂载做完。

### /dev/shm 不存在

Python multiprocessing 跑起来报错，追进去才发现——Android 宿主的 /dev 里没有 /dev/shm，这个目录压根不存在。POSIX 信号量、某些 IPC 机制都依赖它。

解决方法简单，启动脚本里手动 mount 一个 tmpfs 进去就行，但找到问题花了时间。

### Termux 打开就闪退

这个坑排查时间最长，最后解法却很短。

刷完 LineageOS 23.2 之后，Termux 打开就直接闪退，啥都没有。一开始以为是版本问题，换了好几个 APK 都一样。

后来翻 SELinux 日志，发现 devpts 的挂载权限有问题：`ptmxmode=000`，等于所有进程都没有权限操作伪终端。Termux 依赖 devpts，权限不对，一打开就死。

验证方法是临时 `setenforce 0`，Termux 果然能开了。

修复方案：Magisk policy 动态注入 SELinux 规则，再 remount devpts 改掉权限。就几行配置，但排查过程拉得很长，因为闪退本身没有任何有效的错误信息。

### 开机启动链的坑

最初的方案是：Termux:Boot 触发 → chroot-distro 登录 → 起服务。

但 chroot-distro 内部的 su 路径查找找不到 Magisk 的 su 位置，整个链条断掉，服务起不来。

后来直接绕过这一层，改用 Magisk service.d 钩子，在宿主 root 权限下直接完成挂载和启动，不经过任何中间层，反而干净。

### 进程锁泄漏

supervisord 的启动脚本里用了 flock 防止重复启动，但 fd 没有显式关闭，supervisord 作为子进程继承了这个锁。

结果：每次重启脚本都报"锁被占用"，以为是上一个实例还在，但其实是自己把锁传给了子进程。修复方法是启动 supervisord 时加 `9>&-`，让子进程关掉继承的锁 fd。短短几个字符，但也是排查了一会儿才定位到。

---

## 用起来的感觉

现在这台手机就插着充电器放在桌角，7×24 在线，安静，不发热，功耗比台式机省多了。

8GB RAM 跑十几个服务，还剩余量。骁龙 865 跑这些轻量服务完全不在话下。

最顺手的点是：随时 SSH 进去就是 Linux，浏览器打开就是桌面，服务有公网入口，什么设备都能访问。不用在家里放一台一直开着的电脑，也不用租云服务器。

折腾的过程里踩了不少坑，但都是那种"踩一次就学会"的坑。最后跑起来之后，这台闲置的手机比它当手机用的时候更值钱了。
