# 博文素材 v2：旧手机变服务器

## 核心定调
不是技术教程，不是产品推广。就是：这台手机放着可惜，我把它接上充电器插在桌角，折腾了一番，现在每天都在用。

**文风要求**：
- 去掉博主腔、去掉刻意感、去掉油腻的感叹
- 更像随手写下来的记录，说人话
- 不说"太方便了！""效果惊艳""体验极佳"这类词
- 可以有轻微口语，但不要刻意装随意

---

## 硬件
红米 K30S Ultra，骁龙865，8GB RAM，退役主力机，刷了 LineageOS，不当手机用了。

方案：Termux + chroot-distro，在 Android 里 chroot 进 Ubuntu 24.04。
关键词：真 root、真 chroot、共享内核，不是虚拟机，不是 proot。

---

## 运行的服务（这是重点，分类列出，各说几句）

### 基础层
- **sshd** — 最基本的，SSH 进去就是 Linux
- **supervisord** — 所有服务统一托管，开机自启，挂了自动重拉
- **Cloudflare 隧道** — 家里没公网 IP，靠它每个服务都有自己的 `*.johnnren.qzz.io` 域名，内网出发，外面能访问

### 访问与桌面
- **ttyd** — Web 终端，浏览器开就能用，公网可访问（`term.johnnren.qzz.io`）
- **noVNC + LXDE** — 完整 Linux 图形桌面，浏览器里打开（`vnc.johnnren.qzz.io`），做需要图形界面的事用这个（比如 camoufox 浏览器自动化就跑在这个桌面上）

### 网络与代理
- **Clash (mihomo)** — 代理服务，不只给自己用，容器内所有服务都走这个出
- **聚合搜索 (degoog)** — 整合多个搜索引擎的搜索服务，主要给 AI agent 用

### AI 工具层（这是最核心最有意思的部分）

**cliproxyapi (cpa)** — AI 接口网关，把各家 AI API（Claude、Gemini、DeepSeek 等）代理转发，统一接口格式，跑在手机上，不绑定某台电脑，随时能用。这台手机上的模型调用全走这个。

**DeepSeek Harness (dsh)** — AI 对话助手的 Web 界面，装在这台手机上作为实验。它的两个插件特别值得说：
  - **dsh-proactive**：定时/事件触发，AI 主动发消息给你。比如设置一个 agent，开机后自动检查状态，或者在特定时间给你发提醒，或者跑 living agent（虚拟角色有自己的日程，每天按时"过日子"并给你发消息）。手机 24 小时在线，这个用起来很合适。
  - **dsh-im**：把 AI 对话接到 IM（微信/QQ/Telegram 等），手机发消息就能和 AI 对话，回复有打字效果，像真人一样分段发。因为服务跑在本地，延迟低，不依赖云端。

**codeg** — 另一个 AI coding agent 的 Web 界面（"AI Coding Agent Conversation Manager"），界面体验好，支持多个 harness（不只是 dsh），作为备用入口。有时候想换个界面或者用不同的 agent 框架，走这个。

### 文件与存储
- **AList** — 聚合网盘，把各种云盘统一管起来（`pan.johnnren.qzz.io`）
- **WebDAV** — 网盘协议服务端，需要 WebDAV 挂载的用这个（`webdav.johnnren.qzz.io`）

---

## 踩过的坑（简洁记录形式，代码块或列表，不展开叙事）

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

---

## 现状
手机插着充电器放在桌角，7×24 在线。骁龙865 跑这些服务毫无压力，8GB 还有余量。主要价值：手机一直在线、功耗低、安静，适合跑需要持续在线的服务（proactive、IM bot、网关等）。

---

## 写作格式要求
- 输出：`/root/projects/yet-another-ai-generated-blog/src/content/posts/2026-09-24-phone-as-server.md`
- frontmatter：title/date/summary/tags(≤3)/model/duration_s/steps/tokens_in/tokens_out/polished
- 踩坑部分用代码块原样放进去，不要改成叙述
- 其余部分自由发挥，但文风要素朴，去掉一切刻意感
