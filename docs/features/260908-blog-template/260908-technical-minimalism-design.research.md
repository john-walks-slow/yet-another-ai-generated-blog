# 《又是一个 AI 生成的博客》技术极简主义 × 前卫动效 标杆调研

> - **日期**：2026-09-08
> - **目的**：为 v2「技术极简主义」模板方向（冷、简单、无衬线、尖锐、黑白、技术化 + 用动效炫耀高技术力）提供设计语言与动效语言输入
> - **产出**：具体站点清单（含 URL、实测状态）+ 每站设计/动效语言分析 + 可迁移手法总结 + 「什么会让技术动效显得廉价」反面清单
> - **覆盖**：工程美学产品站 / Awwwards 级 motion 前卫站 / 字体工坊 / 终端·CLI 美学谱系 / 蓝本·网格美学谱系 / 日文·中文环境实践
> - **验证**：主清单 URL 均于 2026-09-08 用 curl 逐站实测（HTTP 200，重定向已追踪）；重点站另用真实浏览器（Camoufox/Firefox，1440×900 / 1280×720）开屏实测并截图存档于本目录 `assets/v2-*.png`；token 级细节来自各站 CSS 抓取与多个第三方 DESIGN.md 目录的交叉比对，冲突处已注明
> - **关系**：本文档接替已否决的 v1 设计调研（`260908-design-inspiration.research.md`，印刷人文方向）。v1 已覆盖且结论不变的站点（rauno.me / paco.me / gwern.net / antfu.me / 宝玉等）只做交叉引用，不再重复展开
> - **站长保留元素**：荧光笔划线、侧栏批注——本文 §10.4 专门给出它们的「技术化重铸」方案

---

## 0. 结论速览（TL;DR）

技术极简主义 + 前卫动效的当代标杆可以收敛为一个**三层组合**：

1. **视觉骨架：Linear / Vercel 式「token 精度的黑白工程美学」**——近黑而非纯黑（`#08090a`，不是 `#000000`）、亮度阶梯代替阴影、几何无衬线配激进负字距 + 等宽字体做「技术声部」、单一强调色只出现在交互态、0–6px 小圆角、8px 网格。**关键结论：这套语言的高级感全部来自减法与 token 精度，不来自任何装饰**（"The aesthetic emerges from subtraction. Most developers try to add their way to polish. Linear got there by cutting."）。
2. **动效骨架：spring 物理微动效 + 「事件驱动」原则 + 少量签名式大动效**——几十毫秒级、带轻微过冲的弹簧动效（接近原生 macOS 而非网页感）；一切运动皆有原因，事件结束即停，无循环环境动画；页级转场与滚动叙事保持统一节奏（"editorial cuts, not standard fades"）。动效是内容不是装修。
3. **差异层：把「工程遥测」做成内容**——darkroom.engineering 的 Activity Log（带日期的 shipping 记录）与三地实时时钟、Obys 导航栏里的实时 CET 时钟、chrislemke 参考站 footer 里的 `Build: a3f8c41`。**机器数据即装饰（Data Is the Ornament）**——这与本博客「AI 生成记录元数据块」（模型/步数/token）是同一件事，后者因此从「彩蛋」升格为「设计语言的正统成员」。

**空位判断**：中文个人博客中，「冷黑白 + 前卫动效 + 工程遥测」的组合目前无人占据（§9.5）；日文侧 Shiftbrain 已在商业级证明该审美可以做到 Awwwards SOTD 水准。同时 Unseen Studio（该语言的前顶流）2025–26 已转向粉雾色 3D 梦幻风（§3.5）——**顶流离场、语言成熟、个人站层面空缺**，正是新站拿走这套语言的最佳时机。

---

## 1. 调研方法与说明

- **候选池来源**：Exa / Degoog / Firecrawl 多引擎搜索；Awwwards 站点页（含 palette、技术栈、评分数据）；设计策展画廊（godly.website、hoverstat.es、Awwwards minimal 分类）；Codrops 案例访谈；第三方 DESIGN.md token 目录（refero.design、getdesign.md、designmd.app、webdesignhot——**注意：此类站点为 AI 辅助生成的 spec 目录，个别数值互相冲突，本文只采用多源一致的部分**）；GitHub README（Shiro、Lenis、terminal portfolio 系列）。
- **验证方式**：2026-09-08 对 40+ 个候选 URL 逐站 curl（跟随重定向、桌面 UA）；重点站用浏览器实际打开（观察到 Obys 的加载计数器与实时时钟、Unseen 的声音门与字标逐字动画、darkroom 的完整 DOM 结构）；截屏存档 `assets/v2-obys-home.png`、`assets/v2-unseen-home.png`（375×812 移动视口）、`assets/v2-darkroom-home.png`。
- **标注约定**：★ = 重点范本；〔实测〕= 本轮直接抓取/浏览器观察到；〔token 多源〕= 多个第三方 DESIGN.md 目录交叉一致；无标注的视觉描述 = 基于通识，仅验证过可达性，采信前建议自行开屏。
- **两个总体观察**：
  1. **Linear 语汇已是第二代抄袭对象**："Linear is the most-copied product company in design-led SaaS for the second year running... Linear's moat is not the interface, it is the stack of decisions under it."（brainy.ink）——意味着「看起来像 Linear」不再稀缺，稀缺的是 token 纪律与动效纪律。本博客要做的是**借语言、加遥测、做个人站形态**，不是复刻一个 SaaS 落地页。
  2. **黑白工程美学的「产品站」与「工作室站」正在分岔**：产品站（Linear/Vercel/Warp）越做越克制、把动效藏进微交互；获奖工作室站（Obys/aino/MCLN）反而敢在大动效上激进。本博客是阅读站，应当**产品站的克制 + 工作室站的签名时刻**：列表与正文极冷，转场与批注极锋利。

---

## 2. 工程美学产品站：token 级标杆

这一批站点定义了「冷、黑白、无衬线、技术化」的当代标准。共同点：**黑白是结果，减法是方法，token 精度是质感来源**。

### 2.1 Linear — https://linear.app ★★★〔实测可访问；token 多源〕

被模仿最多的产品界面，也是「技术极简主义」最完整的公开实现。

- **色彩**：营销页画布 `#08090a`（近黑带极微冷紫倾向，**不是纯黑**）；面板 `#0f1011` / 抬升面 `#191a1b`——层与层之间只差 1–3 个 RGB 值，「深度靠亮度台阶，不靠阴影」；正文 `#f7f8f8`（**不是纯白**），次级 `#d0d6e0`，三级 `#8a8f98`；边框一律 `rgba(255,255,255,0.05–0.08)` 的半透明白（"moonlight on glass"，普通框架给 10–15%，Linear 给 6%）；唯一彩色是靛紫 `#5e6ad2` / `#7170ff`，**只出现在选中态、焦点环、主 CTA**。
- **字体**：Inter Variable，全局启用 OpenType 特性 `"cv01"`（单层 a）与 `"ss03"`——「这两个特性不是装饰，它们把 Inter 变成了 Linear 的字体」；**签名字重 510 与 590**（介于 regular/medium、medium/semibold 之间的「中间字重」，只有可变字体技术做得到）——「510 创造出潜意识里注册、却从不喊叫的强调，一种比 bold 更响的排印耳语」；展示尺寸激进负字距：72px 配 −1.584px、48px 配 −1.056px、32px 配 −0.704px，16px 以下恢复正常；等宽层用 **Berkeley Mono**（付费、为美而生的终端字体，弃 SF Mono 本身就是表态）。正文 14px/21px，标签 13–14px、行高 1.4–1.5、字距 −0.01～−0.02em。
- **形状与网格**：圆角体系 1/4/7px，「没有 12px、16px 的『卡片』圆角」；8 点网格；零填充的结构元素。
- **动效语言**：**spring 物理**——issue 列表滑入带重量的弹跳，modal 不做半秒淡入而是「snap + 极小过冲」，接近原生 macOS 应用；**时长纪律**：过渡短到感觉瞬时、又长到能看清缓动曲线；**事件驱动**：「没有循环环境动画，没有闲置状态动效，没有滚动触发的华彩。一切移动皆因某件事发生，事件结束后立刻停止」；**快而非慢**：「慢速动效在作品集里读作奢侈，在工具里读作摩擦」。Curvo 的分析把这点说透：动效是**反馈形式而非品牌个性**。
- **哲学**（WeLoveDaily）：「装饰即可见的延迟（decoration is latency made visible）」；「品牌不是关于速度——品牌**就是**速度，被翻译成排印与空间形式」；营销站与产品是同一表面，没有「品牌→工具」的边界。
- **2026-03 刷新**（linear.app/now/behind-the-latest-design-refresh）：侧栏调暗数档、tab 缩小、图标减量、默认色从冷蓝灰转向更暖的灰——「如果大多数人没有立刻注意到什么变了，那大概是个好迹象」。
- **对本博客**：token 表（§10.1）的蓝本；「中间字重」思路可用可变 CJK 字体复刻（§10.5）；「事件驱动 + 快」是动效验收标准。

### 2.2 Vercel / Geist — https://vercel.com ★★★〔实测可访问；vercel.com/geist 官方页 + token 多源〕

**浅色版的同一语言**——证明技术极简不等于深色模式，黑白两面都成立。Geist 设计系统公开在 vercel.com/geist（颜色/排印/材质/网格/图标），本身就是「设计系统作为公共物」的姿态（承 IBM Carbon 开源谱系）。

- **色彩**：近白画布 `#fafafa` + 墨色 `#171717`（不同时期的抓取一作纯黑白、一作 `#fafafa`/`#171717`，方向一致：**永远不用极端值**）；深度用发丝线边框（stacked box-shadow `0 0 0 1px rgba(0,0,0,0.08)`）而非投影；表面阶梯 `#fafafa → #ebebeb → #171717`。
- **字体**：自研 **Geist Sans + Geist Mono** 同族双面（2023 年换掉 Inter 后「整个品牌身份锁死」）；展示字重 400–450（**hero 不用 bold**）配 −0.06em 字距、行高 1.0；「Geist Sans 负责阅读，Geist Mono 负责盖章」——mono 以 11–12px、0.071em 字距、全大写出现在所有 eyebrow/标签/元数据；两族只有 8 个字号。
- **三角形 ▲ 是唯一装饰**：CLI 前缀、hero 剪影、加载指示、折叠标记——**唯一允许用纯 `#000000` 的元素**。
- **「终端即营销」**：命令面板直接嵌在页面里（`▲ deploy` / `✓` 绿色确认）——营销页面自己演示产品。
- **官方反刻板提醒**（vercel.com/design）：「不要因为回避默认值就产出无菌的反设计模板。Vercel 的克制是精确层级、优秀排印、清晰证据、强对齐与有意的张力。**它不只是黑、白、细线与大留白**。」——这是给所有模仿者的预防针。
- **对本博客**：浅色模式的 token 蓝本；「mono 盖章层」的用法（全大写 + 宽字距 + 小字号）可直接搬到中文站的西文/数字元数据层；▲ 式「单一几何记号」思路。

### 2.3 Warp — https://warp.dev ★★〔实测可访问；token 多源（两版抓取有差异，已注明）〕

「营销站即终端」的极端样本：整页读起来像一次 CLI 会话长出了营销层。两个时期的第三方抓取分别记录了冷黑版（`#121212`，贴近 macOS Terminal 默认底）与暖炭版（`#2b2622` 暖近黑 + `#faf9f6` 暖米白文字 + Matter/Inter + DM Mono + Instrument Serif 罕见斜体）——**同一品牌在「冷黑」与「暖炭」两个 register 之间迭代**，本身就是重要数据点。

- **结构**：hero「Warp is the agentic development environment」以 Inter 500、72–96px、行高 1.0–1.05 居中——「像 man page 标题，不像 SaaS pitch」；下载 CTA 是**纯白药丸 + 黑字 7px 圆角**（照搬 Apple 系统软件下载页的 affordance）——「这一个动作让它读作系统应用而非 SaaS」。
- **招牌反转**：表面阶梯是页面 `#121212` → 卡片 `#1a1a1a` → 终端截图 `#0e0e0e`——**截图比卡片更深**，「像在页面里开了一扇窗」，而非常规的「卡片比页面更亮」。
- **色彩配给**：霓虹柠檬绿 `#c2ff00` 光标**只存在于真实产品截图内部**，营销表面保持无彩——「彩色只在你看到真实软件时进入页面」。
- **动效 token**〔token 多源〕：`ease-terminal: steps(1, end)`（终端式瞬时转场，光标闪烁 ~1s 周期）；时长 100/180/320ms；`prefers-reduced-motion` 下光标停闪、transform 退化为 opacity。**用 steps() 缓动模拟终端帧感**是「用缓动曲线表达世界观」的最佳例证。
- **对本博客**：「彩色只出现在真实产物里」直接适用于：强调色（荧光划线）只在标记/交互出现；steps() 可用于代码块与生成记录的呈现；「窗口比页面深」可用于文章页的代码块/终端框。

### 2.4 Raycast — https://raycast.com 〔实测可访问；视觉描述为通识〕

命令面板（⌘K/Spotlight）范式的当代定义者。深色画布 + 色调阶梯 + 渐变光晕的营销视觉——与 Linear 的「无渐变」纪律构成同族语言的**彩色分岔**，证明这条谱系的变量是「强调色的配给量」。作为对照样本收录。

### 2.5 Bun — https://bun.sh 〔实测可访问；视觉描述为通识〕

以终端安装命令 + 硬基准数字做 hero 的开发者工具站代表；「速度数字本身是视觉元素」。本博客「机器遥测」（篇数/字数/token 总量）的呈现可参考其把数据当排印主体的做法。

### 2.6 IBM Carbon — https://carbondesignsystem.com 〔实测可访问；通识〕

企业级工程设计语言的源头之一：2x 网格、IBM Plex Sans/Mono、「productive/expressive」双主题、开放数据可视化色板。Geist/Linear「把设计系统当公共物发布」的动作承自此谱系。作为谱系坐标收录，不作为模仿对象。

---

## 3. Motion 前卫获奖站（Awwwards 级）

### 3.1 Obys — https://obys.agency ★★★〔实测：浏览器开屏 + 截图 `assets/v2-obys-home.png`〕

乌克兰基辅工作室，技术极简 + 排印驱动动效的当代标杆（Awwwards PRO 级，多枚 SOTD/Developer Award；其实验空间子站 Obys® Experiment Space 的调色盘被 Awwwards 记录为纯 `#000000`/`#ffffff` 双色）。

- **实测开屏**：加载屏为纯黑底 + 白色几何 logo + **百分比计数器**（拍到 50%）；进入后是**巨型压缩无衬线「OBYS®」**左上角镇场；**三栏不对称网格**——左列作品纵索引（19 项、编号 01–19、悬停态分明）、中列灰阶图像、右列工作室自述与联系；导航栏带**实时 CET 时钟**（滴答走字）；左下角是**布局引擎切换器：「Vertical, / Horizontal, / Grid」三个按钮**——首页本身就是一次布局系统的现场演示。
- **动效语言**（综合其获奖作品的公认特征 + Experiment Space 的 GSAP/Three.js 标注）：排印遮罩转场、文字逐行揭示、索引列表悬停联动图像、自定义光标、网格覆盖层。其作品《AI Modernism of Kharkiv》恰是 AI×排印主题——与本博客内容气质直接相关。
- **对本博客**：布局切换器（同一个内容索引、多种排布模式）是「设计即工程演示」的绝佳低成本签名；实时时钟/计数器这类「活着的元数据」最容易被个人站借用；**纯黑白 + 巨型压缩字标**是冷感的黄金配方。

### 3.2 Aino — https://aino.agency ★★〔实测可访问；Awwwards SOTD 7.24 + Dev Award 7.78〕

「文字即媒介」的技术上限样本。Awwwards 记录其调色盘仅两色 `#f5f5f0`/`#181818`，技术标签 Vanilla JS，官方介绍：**「Aino 从零重建他们的网站，探索文字作为媒介的可能性——ASCII、2D 物理、实时 morphing——全部在 30KB JS 内完成。」**

- **对本博客**：这是「客户端 JS 预算」最有力的事实依据——v2 方向允许有意识的 JS 预算（见 MEMORY），Aino 证明 30KB 足够装下物理模拟 + 文字 morphing。**预算本身可以写成站点的 colophon 条目**：把「本站动效总 JS ≤ XX KB」亮出来，就是最诚实的炫耀。

### 3.3 MCLN（Francesco Michelini）— https://francescomichelini.com ★★〔实测可访问；Behance 档案〕

个人作品集做「功利主义技术美学」的获奖范本（Awwwards SOTD/Developer Award/Portfolio Honors）。Behance 档案原文：**「MCLN 是一台写代码的、技术性的杀戮机器（a code-writing, technological killing machine）。我们发展出一种带编码与技术暗示的功利主义美学……重等宽字体的排印系统」**。Colophon：Neue Haas Grotesk Pro + **Favorit Mono（Dinamo）** + Monorama；设计方 Unlearn Studio。

- **对本博客**：个人站（而非 agency）做这套语言的最直接参照；「重等宽」三字可以写进字体策略——mono 不是点缀层而是身份层。

### 3.4 basement.studio — https://basement.studio ★〔实测可访问；站点 schema 抓取〕

阿根廷马德普拉塔工作室，「We make cool shit that performs」。客户名单即本章的浓缩图鉴：**xAI、Vercel、Next.js、Linear、Cursor、Scale**——给「工程美学公司」做网站的那家工作室。获奖记录：Next.js Conf 2024「Raising the Bar, Again」（SOTD + Dev Award）、Daylight「Simplicity in Motion」（SOTD + Dev Award + FWA）、KidSuper（Webby）等。技术栈 Next.js + GSAP + WebGL + 字体设计。作为「谁在给 Linear 们做站」的谱系证据收录。

### 3.5 Unseen Studio — https://unseen.co ★〔实测：浏览器开屏 + 声音门交互 + 截图 `assets/v2-unseen-home.png`〕

**历史标杆 + 转向警示，双重价值。**

- **历史**（~2020–2024 通识）：黑底单色 WebGL 噪声/流体站点，Awwwards 级获奖常客，站点自述「Design Studio of the Year – Awwwards」；其黑底噪点流体曾是无数工作室站的模仿源。
- **实测现状**（2026-09-08）：开屏是**逐字母拼合的字标动画**（拍到中间帧「N [」）；随后出现**声音门：「Enter / Enter without audio」**（把音频做成显式选择——本身就是著名的设计决策）；进入后已是**粉雾/薰衣草/奶油色的梦幻 3D 建筑场景**，斜体衬线 + 粗无衬线的「Creating the unexpected」混排标题，药丸 CTA——**完全离开了技术极简语言**。保留的技术残余：字距拉开的导航（`I n d e x`）、编号导航（01–04）、`⮡` 前缀链接、Toggle Sound 常驻。
- **对本博客**：① 声音门模式（若做 UI 音效，必须显式门控）；② **顶流已离开纯黑白 → 该语言在个人站层面反而新鲜**；③ 千万别照抄任何一版 Unseen——抄 2020 版显得过时，抄 2026 版方向就错了。

### 3.6 其他获奖工作室简表（均实测 HTTP 200；视觉为通识描述，采信前建议开屏）

- **Lusion** — https://lusion.co：英国工作室，实时 WebGL 与物理动效的代名词，多次 Awwwards 年度提名。
- **Active Theory** — https://activetheory.net：洛杉矶工作室，自研 Galactic WebGL 框架，深色沉浸式站点常客。
- **Waaark** — https://waaark.com：法国里昂工作室，WebGL + 暖深色，长滚动叙事。
- **Igloo Inc** — https://igloo.inc：黑底 WebGL 冰面/镜面质感的获奖站（Awwwards 多项）。
- 用途：动机参考与「动效工程力」的天花板标尺；对阅读型博客而言**不可整体模仿**（信息密度与加载成本都不匹配），但个别手法（滚动速度驱动画面撕裂/自愈、difference 混合保持文字可读）可微量移植（见 §7.4 omolism 案例与 §10.2）。

### 3.7 案例研究：1820 Productions ——「Minimal Design, Maximal Motion」〔来源：Codrops 访谈，tympanus.net/codrops，2026-02-13；站点实测可访问〕

这是与本博客方向**方法论重合度最高**的公开案例：刻意剥掉视觉复杂度之后，靠什么维持高品质感？

> "How do you make something feel high quality and engaging when you're deliberately stripping away visual complexity? **The answer, for us, was motion.**"

- **设计**：黑白系统（"We choose a black and white system to keep attention on form, spacing, and motion"）；极少的字号层级（"a structured typographic system — very few font sizes"）；压缩体标题字 + 无衬线正文的配对。
- **动效方法论**（可直接照抄的清单）：
  1. **线动画做章节标记**——线条引入新 section、给页面定节奏；
  2. **图片视差**（纵/横双向滚动都触发）——「不加内容地加深度」；
  3. **「编辑部剪辑式」转场**——"Transitions feel closer to editorial cuts than standard fades"；
  4. **悬停快而清晰**——"Hover states react fast and clearly"；
  5. **全场统一节拍**——"Page changes and project navigation keep the same tempo and logic"；
  6. **动效是核心设计元素而非装饰**——先在 Figma 里做 motion 草稿，复杂序列进 Jitter；
- **结论句**（原文）：**"Minimal doesn't mean static... it feels alive because every interaction has been considered."**

### 3.8 案例研究：omolism《D:ualSpace》— https://omolism.cargo.site 〔实测可访问；内容来自其自述〕

**个人站做 1-bit 技术动效的完整技术方案**（作者 Danci Shen，tech art / virtual production 背景）——比 agency 案例更接近本博客的体量。其自述要点：

- **严格 1-bit 黑白**：Three.js 渲染 3D 模型 → 自写 GLSL 后处理（亮度 → **Bayer 8×8 有序抖动** → 单色阈值）——「在渐变与玻璃的 feed 里，真正的 1-bit 场域读作一种深思熟虑的技术声音」；
- **色彩配给给运动**：静止时画面是干净黑白；快速滚动/切维度时 RGB 通道撕裂出彩色边缘，静止后重新对齐——**"fast motion tears the frame, stillness heals it"**；
- **技术制图语汇**：布局由包围盒、角节点、坐标读数构成；小检测框浮在 3D 物体周围，实时投影 x/y 坐标并随物体转动跟踪；
- **基建**：Lenis 惯性滚动（经 GSAP ticker 重整时）+ ScrollTrigger 分段绑定 + difference 混合让大字在任何底色反转下都可读。
- **对本博客**：抖动（dither）管线可与 v1 调研的 Low-tech Magazine 太阳能站连成同一条「约束美学」谱系；「滚动速度驱动撕裂/自愈」是低成本高记忆点的签名动效候选；坐标读数/跟踪标注可改造为侧栏批注的视觉语言（§10.4）。

---

## 4. 字体工坊：技术极简的殿堂级示范

字体工坊是「用网站本身演示技术实力」的祖师爷——**字体即内容，工具即 specimen**。

### 4.1 Klim Type Foundry — https://klim.co.nz ★★〔实测可访问；Red Dot 设计奖评语 + token 多源〕

- **结构**：「黑盒子里的排印画廊」——每个字体家族占一条**通栏横带（band）**，用该字体本身排印自己、零装饰；背景在 `#000000 / #1c1c1c / #3c585f / #f9f9f9` 间轮换形成节奏——**用底色带代替分隔线做导航**（「观者靠带的颜色追踪位置，而非章节标题」）；UI chrome 压到一条细黑 header + 橙色小标签（Flare Orange `#d33c03` 是签名点缀）；2px 近锐角圆角；零投影零渐变。
- **技术炫耀方式**：Red Dot 评语——「**字体样张的生成是随机化的、基于一套排印应如何展示的规则系统**」（randomised specimen generation based on defined rules）+「单个字母的超凡动画」。把「生成系统」做成展示——这与本博客「AI 生成流水线」的展示欲完全同构。
- **Söhne 的自我描述**值得抄进 mood board："the memory of Akzidenz-Grotesk framed through the reality of Helvetica"。

### 4.2 ABC Dinamo — https://abcdinamo.com ★★〔实测可访问；站点 + It's Nice That 访谈 + Darkroom 子站〕

柏林/巴塞尔工坊，「Fonts are (great looking) tools」。

- **Darkroom（abcdinamo.com/darkroom）**：**Font Gauntlet**——上传任意可变字体，自动播放所有变量轴组合的动画，暴露字体缺陷；定位是「test drive the truth of variable fonts」。**Pipeline**：自称「可变字体的 Netflix」的流式 specimen 展厅。
- **可变字体动效哲学**（It's Nice That 访谈 + WeLoveDaily 分析，原文值得整段抄录）：
  > "On the web, all the information that is packed in a variable font can be controlled by **anything from the position of your cursor to the weather in the Bahamas**... The design can be a direct and flexible mirror of its underlying and changing content."
  >
  > "letters that breathe, expand, and contract in response to interaction. This wasn't decorative novelty. It was a demonstration of an idea: **that a typeface is not a fixed object but a system of relationships, and that those relationships become visible when you allow them to move.**"
- **对本博客**：中文站同样有可变字体（Noto Sans SC weight 100–900 全可变）——**标题字重随滚动位置/悬停呼吸**是中文环境下几乎无人用的动效词汇；「字体的变量轴是可被数据驱动的界面参数」这个观念本身就可以进设计文档。

### 4.3 Grilli Type — https://grillitype.com ★〔实测可访问；内容抓取〕

瑞士独立工坊。每个新字体发布配一个独立工程化的 minisite（gt-mechanik.com、gt-standard.com……）；免费试用字体直接下载；GT Academy 在 Instagram guides 里连载字体设计课；委托案例（Decathlon、**Figma Sans**）公开过程。「**每个内容对象一个专属微型站点**」——对本博客的启示：重要文章值得单独的视觉处理（与 v1 的「文章即作品」结论一致，但工具从插画换成了排印工程）。

### 4.4 Pangram Pangram — https://pangrampangram.com / Arrow Type — https://arrowtype.com 〔均实测可访问；通识〕

Pangram Pangram：商品化 specimen 电商范本（现代无衬线家族矩阵）。Arrow Type：Stephen Nixon 的独立工坊，以可变字体玩具与开源工具（Recursive 等）著称。作为字体层选型时的 specimen 参考收录。

---

## 5. 开发者工具美学：OSS 工作室与动效基建

### 5.1 darkroom.engineering — https://darkroom.engineering ★★★〔实测：浏览器开屏 + 截图 `assets/v2-darkroom-home.png`〕

Lenis 的母工作室，「where things get developed」。**对本博客参考价值最高的单一站点**——一个把「我们在造什么」作为全部内容的工作室官网。

- **实测结构**：hero 是词典体自我定义——「[ Darkroom ], noun: A Lightproof Room for Developing Photographs. / A Studio Engineering Creativity into Reality.」；H1「WHERE THINGS GET DEVELOPED」堆叠展示字；
- **OSS 工具切换器**：Satus / Lenis / Hamo / Tempus / Elastica / Aniso / cc-settings 的 tab 化展示——每个工具一段克制的介绍 + 仓库链接；
- **Activity Log（活动日志）**：一条按日期倒序的「我们 ship 了什么」流水——「2026/02/06 Satus hardened — Zod validation, proxy.ts, typed env, integration registry, **432 tests**」「2026/01/26 **mc.darkroom.engineering — Midnight Commander 风格的本站另一版本**」「2025/04/09 new site, who dis?」——甚至有「[REDACTED] 签了 retainers」这种保密梗；
- **Footer 三地实时时钟**：`ARG 01:11 PM / CET 06:11 PM / WET 05:11 PM`（分布式团队的工程遥测）；
- **Inspiration 链接区**：侏罗纪公园原著、黑客帝国、KOTOR——在页脚边缘放人格；
- **mc.darkroom.engineering**：**用 Midnight Commander（TUI 文件管理器）语言重做的整站替代版本**——「同一内容、另一种界面」的终极演示。
- **对本博客**：① Activity Log 就是「生成记录」的视觉原型——把 AI 流水线的事件（构建、校验、部署）做成一条站内 changelog；② mc. 子域证明「换个界面语言重做一遍本站」是可承受的签名项目（对本博客：`tui.本站` 终端版？）；③ 三地时钟 → 本站可放「模型时区/构建时间」类的活元数据。

### 5.2 Lenis — https://lenis.dev ★★〔实测可访问；站点 + GitHub（~14k stars）〕

平滑滚动的行业事实标准，也是**「正确做法」的规范文本**：包装原生滚动（`position: sticky`、锚点、无障碍全部保留）；零运行时依赖、<5KB；「为一个内部工具而生——同步 WebGL 与 DOM，一帧不差」；"Get smooth or die trying"。其新官网本身用 "scroll to explore" 演示自家产品（**网站即产品 demo**），showcase 列表：Netflix、Unseen、Lando Norris。

- **对本博客**：若做平滑滚动，**只允许 Lenis 路线**（原生滚动 + 可访问性保留），禁止 CSS transform 劫持滚动条（反面清单 §11）。

### 5.3 动效与灵感基建（均实测可访问）

- **GSAP** — https://gsap.com：行业标准动画库（Obys/Shiftbrain/basement 等的技术底座）。
- **Motion** — https://motion.dev：Motion One / Framer Motion 的家，现代轻量路线。
- **Hover States** — https://hoverstat.es：**专收 hover/交互状态的画廊**——微动效研究的定向弹药库。
- **Codrops** — https://tympanus.net/codrops：前卫动效教程与案例访谈的长期源头（§3.7 的 1820 访谈即出自此处）。
- **godly.website / godly.design** — 均实测可访问：策展画廊，minimal/dark 分类可订阅式巡览。
- **Awwwards minimal 分类** — https://www.awwwards.com/websites/minimal/：持续更新的极简获奖站。

---

## 6. 终端 / CLI 美学谱系

「技术化视觉语言」的第一谱系。按「终端是皮肤 / 终端是内容 / 终端是信仰」三层展开：

**a) 终端是皮肤（产品站的拟终端语言）**
- Warp 的 `steps(1, end)` 缓动 + 1s 光标闪烁（§2.3）；
- Vercel 的 `▲` CLI 前缀与 `✓` 确认符（§2.2）；
- Linear 的键盘优先（Cmd-K、快捷键体系）——「每个其他决定都从『键盘是主输入』流出」。

**b) 终端是内容（整站即 shell）**
- **mc.darkroom.engineering**：Midnight Commander 风格的整站替代版（§5.1）；
- **terminal portfolio 类型学**（GitHub 上已成流派）：SouleymaneSy7/terminal-portfolio-website——46 条真命令（weather/crypto/quiz/todo，均带 `--help` 与 man page）、31 套 OKLCH 主题、15 款等宽字体、Tab 补全、Ctrl+R 历史检索、Web Audio 键盘声（零音频文件）、**WCAG AA + ARIA live regions + prefers-reduced-motion**；khriztianmoreno.com——虚拟文件系统（`ls/cd/cat` 真实可用）+ ⌘K 命令面板 + Warp 配色主题。
- **类型学教训**：这类站的分水岭是「命令是否做真事」——46 条真命令 + 无障碍投入 = 工程力展示；只有 `help/whoami/about` 三条假命令 + 满屏绿字 = 廉价 hacker 装（进反面清单）。

**c) 终端是信仰（CLI 优先的价值观表达）**
- DIYgod《上古神器 Beancount》原文〔实测内容抓取〕：
  > "很多时候我们觉得记账麻烦，并不是 UI 不够漂亮、交互不够顺滑，而是记账方法不够科学。当方法足够科学时，**你甚至不需要 UI，一个 CLI + 几个纯文本文件 + 一套清晰语法**，就能把财务世界描述得非常准确。"
- chrislemke 的 Techno Minimalism 参考站（§6.1）把这套价值观完整 codify。

### 6.1 Techno Minimalism 宣言（转译）— https://chrislemke.github.io/website_designs/examples/Techno_Minimalism.html ★★〔实测：整站 CSS 与内容已抓取〕

一个把「技术极简主义」写成 living spec 的参考站（v1.0.0，"Last updated: 2026-03-04"，footer 带 `Build: a3f8c41`）。**这是本方向最现成的 token 起点之一**：

- **token**：GitHub-dark 表面系（`#0D1117/#161B22/#21262D/#010409`）+ 边框（`#30363D/#21262D/#484F58`）+ 文本（`#C9D1D9/#8B949E/#484F58/#F0F6FC`）+ **语义化**强调色（蓝=链接/绿=成功/红=错误/琥珀=警告——「Green is success. Red is error. Always.」）；JetBrains Mono（结构/命令层）+ Inter（长文层）——**"Two fonts. No exceptions."**；8px 严格网格；6px 圆角（"-994px vs pill"——与全圆角势不两立）；
- **语法装饰**：section 标签 `// ` 前缀、品牌名 `> ` 提示符前缀、命令行 `$ ` 前缀、`$ npx create-tm-app my-project` 的可点击复制 hero；
- **CSS 效果库**（纯 CSS、无 canvas、无库——"Functional motion only"）：扫描线（repeating-linear-gradient）、**网格矩阵**（双轴渐变网格缓慢位移）、数据流（低透明度二进制文本纵向滚动）、焦点辉光、**色阶步进**（shade stepping——「背景色阶代替阴影表达深度」）、状态点（语义色圆点 + 扩散环动画）；
- **宣言四原则**（原文转译）：
  1. **功能决定形式**——深色背景为长时间阅读降低疲劳；等宽让数据按可预测的列对齐；发丝边框定义结构而不加视觉重量；**没有任何东西是装饰**。
  2. **透明即信任**——暴露系统状态、版本号、时间戳、构建状态：「界面越多揭示引擎盖下的事，越可信。什么都不藏。给一切贴标签。」
  3. **一致即善意**——完全相同的间距、字号、圆角；8px 网格不容商量；偏差制造认知负担。
  4. **半夜可读**——深底精调对比、WCAG AA、全交互元素有焦点指示：「尊重凌晨两点还在读的开发者。」
- **点睛引文**（站内 blockquote）：**"The interface is infrastructure — purposeful, observable, and maintainable. It speaks the visual language of git diff, JSON payloads, and systemd logs."**
- **对本博客**：这份宣言几乎就是 v2 的设计需求书；「透明即信任」原则直接接住「生成记录元数据」的需求。

---

## 7. 蓝本 / 网格 / 技术制图美学谱系

「技术化视觉语言」的第二谱系：**把「图纸/测量/坐标系」的视觉词汇搬进界面**。

**a) 网格作为身份**
- Vercel Geist 官方页把 **Grid 列为系统五大模块之一**（"A core part of the Vercel aesthetic"）——网格不是布局工具，是品牌资产；
- chrislemke 的网格矩阵效果（§6.1）；Klim 的底色带节奏（§4.1）；瑞士网格的老家（Grilli Type / NORM 谱系）。

**b) 包围盒 + 坐标读数 + 跟踪标注（viewport 语汇）**
- omolism 的「布局由包围盒、角节点、坐标读数构成；检测框实时投影 x/y 并跟踪物体」（§3.8）；
- GitHub 上 STRUCT/monolith 类高分作品（参考案例，非收录站点）：hero 巨型遮罩字 + 侧边技术指标（`REF_ID #ST-MONO-2026`、`42,500 PSI`）+ **实时 UTC 坐标 ticker**（`LAT 34°03'N / LON 118°15'W`）+ **随滚动速度加速的无限等宽 marquee** + `[PAGE 04 OF 05]` 的专著式页码——「重 CAD 终端 + 印刷专著」的混血语汇。

**c) 1-bit / 抖动谱系（约束美学）**
- omolism 的 Bayer 8×8 有序抖动（§3.8）↔ v1 调研的 **Low-tech Magazine 太阳能站**（https://solar.lowtechmagazine.com，dithered 位图 + 电池余量表）——两站共享同一个方法论：**用技术约束生成视觉**（一个被带宽/能耗约束，一个被 1-bit 色彩约束）。对本博客：「AI 生成 + 人力最小化」是第三种约束，同一条谱系。

**d) 色调 elevation（技术黑的深度学）**
- Linear 的 1–3 RGB 亮度差分层（§2.1）；Warp 的「窗口比页面深」反转（§2.3）；Klim 的带状背景（§4.1）；chrislemke 的 shade stepping（§6.1）——**全谱系共识：深色界面不用投影，用亮度台阶**；边界永远是半透明白发丝线，不是实色深边框。

---

## 8. 日文环境实践

### 8.1 SHIFTBRAIN — https://shiftbrain.com ★★〔实测可访问（shiftbrain.co.jp 301 → 此域，加载较慢）；浏览器 DOM 实测：作品索引、分类筛选、诗句文案全部确认〕

东京「Design & Tech Studio」，日本工程美学 + 排印级动效的最佳商业证明（Awwwards：54 件作品、多枚 SOTD/Developer Award/HM——含 Harajuku Sun-Ad、LIONES GOOD NEWS、HITOBA workkit、Denim Karuta）。

- **实测首页**：编号作品索引（1–5）纵向排布；**垂直书写的日文诗句随作品切换**（「こころが、こころと、編まれてく。」「舞え、花びら。」「届け、花言葉。」）；分类筛选 All/Brand/Global/Independent/Promotion/Recruit/Media；客户：Panasonic Holdings、Panasonic VISION UX（设计总部）、Diver-X、45R、NTT DATA 等。
- **公认语言**（通识，其获奖作品的共性）：日文排印的像素级控制 + 物理正确的滚动动画（GSAP/ScrollTrigger 系）、大留白、克制的黑白结构里做精确的时序编排。
- **对本博客**：证明「CJK + 工程美学 + 高精度动效」完全可行；其「垂直排布的诗句做章节转场」是 CJK 特权的动效词汇——中文站同样可用竖排诗句/竖排章节题做转场素材。

### 8.2 Zenn — https://zenn.dev ★〔实测可访问；DOM 抓取；浏览器截屏因会话中断未存档〕

「エンジニアのための情報共有コミュニティ」——日本工程写作的事实平台。实测：Inter（600/700 子集）做 UI、主题系统（light / dark-blue / system 三态、`data-theme` 属性驱动）、Trending/Following 双流、hackathon/contest 运营位、Twemoji 按平台降级。整体：**干净、密集、功能主义**——平台级「不设计的设计」，是内容平台的天花板形态，但个人站不应满足于此（它恰好是「太标准」的对照面）。

### 8.3 tha ltd. — https://www.tha.jp 〔实测可访问；通识〕

东京老牌交互工作室，其官网长期被视为日本「工程感 UI」的基准之一（mono 驱动、精确网格）。作为日文谱系坐标收录。

---

## 9. 中文环境实践

### 9.1 DIYgod — https://diygod.cc ★★〔实测可访问；内容全量抓取〕

中文个人博客里与本博客**气质重合度最高**的站点（Astro 构建、双语切换、Day/Night 切换、导航：首页/文章/项目/友邻/关于；两字诗意分类：创作集 26 / 分享境 17 / 研习坊 16 / 日记本 13 / 闲言语 11 / 事件簿 5 / 新玩意 1）。

- **决定性发现——她的自我介绍就是一段 AI prompt**〔实测原文〕：
  > "你是一个擅于模仿真实人类写博客的 AI，请模仿一个坐标新加坡、热爱动漫和编程、可爱、纯粹、没有脱离低级趣味的人类，你的名字叫 DIYgod，你正在与 justcc、哈哈、酸奶组建家庭。"
  
  ——**「把 AI 生成身份写成系统提示词」的中文先行者**。本博客的站名自嘲与「生成记录」元数据在精神上同源，但她已占位「可爱的 AI 人格」；本博客应占位「冷峻的 AI 机器」——一个是拟人反讽，一个是非人反讽，恰好互补不撞车。
- 签名句「写代码是热爱，写到世界充满爱！」；文章一句话摘要 + 日期 + 分类 + 标签的列表形态；CLI 信仰（§6-c 的 Beancount 引文）。
- **对本博客**：列表信息架构（一句话摘要 + 元数据行）可直接继承；「AI prompt 式自我介绍」启发生成记录的呈现（把原始 prompt 折叠展示——已在 MEMORY 中定为需求）。

### 9.2 Innei / Shiro — https://innei.in ★★〔实测可访问；GitHub README + 设计自述文〕

中文个人站动效工程的天花板。Shiro 主题（开源，~4k stars）："A minimalist personal website embodying the purity of paper and freshness of snow / 一个极简主义的个人网站主题，如纸的纯净，似雪的清新。"

- **动效哲学**：「**采用符合物理学的 Spring 弹性动画，每一帧都如自然般舒适**」；所有锚点滚动也走弹性曲线；导航栏 1000 行代码、四种交互场景判断；
- **随机强调色系统**：服务端每次会话随机注入一种强调色（日/夜成对，如 `#69a6cc` / `#A0A7D4`）+ 对应噪点纹理——「强调色并不唯一，但一次会话内固定」；
- **实时存在感**：ProcessReporter（Swift 客户端）+ 云函数 + WebSocket，主页实时显示站长正在用的 App/听的歌；WebSocket 实时推送新文章通知；
- 技术栈：Next.js App Router / Jotai / Motion / Radix / Tailwind；Lighthouse Performance & Best Practice 90+；
- 后续：**Yohaku（余白）**——全新独立设计语言的个人博客项目；付费版 Shiroi（白い）含 WebGPU 雪花粒子、萤火虫等高级效果。
- **对本博客**：Shiro 证明了「中文站 + spring 物理动效」的可行性；但它的气质是「纸的纯净」（暖、软、可爱）——**恰是 v2 要避开的伪人文方向**。学其工程（spring、实时性、性能），弃其气质（纸、雪、萌）。对照价值大于模仿价值。

### 9.3 tw93 — https://tw93.fun / Pseudoyu — https://pseudoyu.com 〔均实测可访问〕

- tw93（杭州产品工程师，"Be yourself and don't go with the flow"）：自研 cosy-jekyll-theme（无 jQuery、SVG/Canvas 极客细节、定制 404、PC 端二维码引导手机阅读、中国网络优化）；内容矩阵：博客 + 潮流周刊 + hi.tw93.fun 个人门户；近年内容全是 AI 工程（Claude Code 手册、Agent 架构、具身智能、GEO、"The Death of the Manual Programmer"）。**产品工程师式的干净实用主义**。
- Pseudoyu：技术周记型博客，干净现代的开发者站样本。两者共同构成中文「实用派」基线——干净但不动效、不冷峻，反衬出 v2 的空位。

### 9.4 反设计谱系（内容即全部）

- **王垠** — https://yinwang.org〔实测可访问〕：零装饰的原生 HTML，反 CSS 立场的极端样本——「完全不设计」在中文圈的存在证明。
- **云风** — https://blog.codingnow.com〔实测可访问〕：二十余年不变的样式，时间即设计（v1 结论维持）。
- **V2EX** — https://v2ex.com：中文技术社区审美的原点（极简、密集、蓝灰）。**本轮 curl 无法连接**（可能屏蔽非浏览器流量），列附录 B 待复核；作为谱系参考仍值得保留。

### 9.5 空位分析（结论）

把 §8–§9 的地图叠起来：

| 象限 | 日文 | 中文 |
|---|---|---|
| 工程美学 + 前卫动效 | **Shiftbrain（商业级，SOTD 常客）** | **空位** |
| 工程美学 + 无动效/实用 | Zenn（平台级） | tw93 / Pseudoyu / 宝玉 |
| 动效工程 + 暖系气质 | — | **Shiro/Innei（spring 动效天花板）** |
| AI 身份自反 | — | **DIYgod（prompt 式自我介绍）** |

**没有任何中文个人站同时占据「冷黑白工程美学 + 前卫动效 + 机器遥测」**。Shiro 证明了动效工程力、DIYgod 证明了 AI 身份反讽、Shiftbrain 证明了 CJK 工程美学的上限——三块拼图都在，无人拼合。站名《又是一个 ai 生成的博客》天然适配这个空位：**用最冷的工程界面，包裹最坦白的机器自白**。

---

## 10. 可迁移手法总结

### 10.1 设计 token 层（黑白工程美学完整 token 表）

```
色彩（深色默认，参照 Linear/Warp 冷黑版）
  画布        #0A0A0B（近黑，非纯黑；或 Linear 式 #08090a）
  面板        与画布差 3–6 个 RGB 值（如 #121214）
  抬升面      再 +3–6（如 #1A1A1D）——「深度=亮度台阶，永远不用投影」
  正文        #F2F2F0（非纯白）
  次级文本    #A8A8AC / 三级 #6E6E74（用亮度做层级，不用色相）
  边框        rgba(255,255,255,0.06)（≤8%，发丝线；绝不用实色深边框）
  唯一强调色  = 荧光划线色（见 §10.4），只用于：划线高亮、::selection、
              当前态、焦点环——「强调色到处用 = 系统崩溃」（SeedFlip）
浅色模式（参照 Vercel/Geist）
  画布 #FAFAFA + 墨 #171717；同一套语义 token 双面映射

字体
  西文界面    Inter Variable（启用 cv01+ss03）或 Geist Sans
              ——展示尺寸负字距：64px/-1.4px、48px/-1.1px、32px/-0.7px
  中文本体    Noto Sans SC（可变字重 100–900）——**中间字重 350/450
              复刻 Linear 510/590 的「工程感强调」**；CJK 字符不加负字距
  等宽技术层  JetBrains Mono / Berkeley Mono / Geist Mono
              ——11–13px、全大写、+0.07em 宽字距，只做「盖章」：
              标签、日期、ID、坐标、遥测数字（tabular-nums）

形状与网格
  圆角        0–4px（按钮 2–3px）；药丸形只允许出现在光标/状态点上
  网格        8px 基准；版心 12 列；96–128px 章节间距、不加分隔线
  深度        亮度台阶 + 发丝边框；零投影零渐变零 glow
```

### 10.2 动效词汇表（按场景分类，全部有出处）

**转场（页面级）**
1. **编辑部剪辑式页面切换**〔1820〕：Astro View Transitions（ClientRouter）做冷感的 clip-path 擦除/反相切换，禁止软绵绵的 cross-fade；
2. **全场统一节拍**〔1820〕：所有页面切换/导航动效共用同一时长与缓动 token（如 180ms + 同一条曲线）；
3. **snap 而非 fade**〔Linear〕：层级的进出带轻微过冲，不要 0.5s 淡入。

**滚动**
4. **Lenis 平滑滚动**（原生滚动包装、无障碍保留、<5KB）——要做平滑滚动只有这一条路；
5. **CSS scroll-driven animations**（`animation-timeline: view()/scroll()`）做入场——零 JS；
6. **速度驱动效果**〔omolism〕：滚动快时允许一点撕裂/位移（RGB 分离、行错位），静止即自愈——"fast motion tears, stillness heals"；
7. **阅读进度终端化**：`[####------] 42%` 式进度条（等宽字符本身就是 UI）。

**hover 微动效**
8. **快而清晰**〔1820〕：hover 反应 <100ms、状态变化明确（边框亮度、背景色阶 +1、文字变亮——**永远不用 glow**）；
9. **索引列表 ↔ 图像联动**〔Obys〕：文章列表 hover 时预览图跟随光标；
10. **光标**：终端方块光标闪烁（`steps(1,end)`、~1s 周期）用于输入态；全局自定义光标可选，但必须有功能语义（如「可点击=十字准星」）。

**文字动效**
11. **遮罩揭示**：标题按行/按字用 clip 遮罩扫入（不是 opacity 淡入）；
12. **可变字体呼吸**〔Dinamo〕：标题字重随滚动位置在 350–550 间插值——中文环境几乎无人用；
13. **等宽打字态**：元数据/生成记录用逐字出现 + 光标闪烁（steps() 缓动，非 ease）；
14. **数字滚动**：token 计数、字数等遥测数字用 tabular-nums 滚动到位。

**环境遥测（ambient，唯一允许的「无事件动效」——因为它们本来就是活数据）**
15. **实时时钟**〔Obys/darkroom〕：footer 或导航放一个滴答走字的时钟（可玩：显示「上次模型调用以来的时间」）；
16. **构建指纹**〔chrislemke〕：footer 放 `v1.0.0 · build a3f8c41 · 2026-09-08T09:00:00Z`；
17. **状态点**：语义色小圆点 + 扩散环（「全部文章已通过校验」绿点常亮）。

**声音（可选，默认关闭）**
18. **声音门**〔Unseen〕：若做 UI 音效，入口必须显式二选一（Enter / Enter without audio）；键盘声用 Web Audio 合成、零音频文件〔terminal portfolio〕。

### 10.3 为什么这些动效显得「高技术力」而不是廉价（机制分析）

1. **精度可感知**：人眼分辨得出 6% 与 12% 透明度的边框、分辨得出 100ms 与 300ms 的 hover——token 精度是「被调过」的信号，像机床公差。"The aesthetic lives in token precision — not a mood board and a prayer."
2. **物理合理性**：spring/过冲暗示质量与约束；`steps()` 暗示帧与离散性——**缓动曲线就是世界观声明**（Linear 的弹性 vs Warp 的终端步进）。
3. **事件因果**：一切运动有原因、结束即停——「系统在响应你」而非「网站在表演你」。循环环境动效只有一种合法形态：真实数据流（时钟、状态）。
4. **速度即立场**：慢=奢侈品逻辑；工具必须快。「Slow motion reads luxurious in a portfolio and reads as friction in a tool.」
5. **诚实展示**：彩色只出现在真实产物里（Warp 的柠檬绿只在截图内）；真截图、真数据、真时钟；假指标一眼廉价。
6. **减法的罕见性**：满屏动效时代，克制本身就是稀缺信号——但前提是「克制的部分」精度到位，否则就是「没做完」。
7. **预算可见性**：Aino 的 30KB、Lenis 的 <5KB、Satus 的 432 tests——**把工程预算亮出来，本身就是最高级的炫耀**。这与本博客「生成记录元数据」（模型/步数/token）完全同构：遥测即装饰（Data Is the Ornament）。

### 10.4 保留元素的技术化重铸（荧光划线 + 侧栏批注）

**荧光笔划线 → 唯一信号色（The One Accent）**
- 全站唯一的彩色 = 荧光黄绿（acid yellow，如 `#D9FF4B`/`#E8FF47` 一类；参照 Warp 柠檬绿 `#c2ff00` 的配给纪律）；
- **出现场合严格配给**：`<mark>` 高亮、`::selection`、当前激活态、焦点环——除此之外全站无彩（「彩色只在信号出现时进入页面」）；
- 动效：划线以**马克笔扫过**的方式入场（clip-path inset 从左到右 0→100%，滚动进入视口时触发）；悬停高亮短语时轻微亮度脉冲（「墨迹未干」）；
- 深浅模式反相时用 **difference 混合**（omolism 技术）保证划线上的文字在任何底色下可读；
- 语义升华：荧光 = 「人类审读留下的痕迹」——站长在 AI 生成文中亲手划的重点，是全站唯一的手工痕迹（但以纯数据形式呈现，不抒情）。

**侧栏批注 → 调试通道 / 注释 gutter**
- 视觉语言：代码编辑器的 gutter——正文行号（可选）、发丝线连接线（像电路走线/跟踪标注）、批注本体用等宽字体 + 小号；
- 元数据头样式可模拟调试输出：`[annotation #03 · line 142 · ref: gwern.net/...]`；
- 交互：默认悬停展开/收起；窄屏降级为行内脚注 chip（点击展开）；
- 功能参照系不变（gwern sidenotes / Tufte，v1 已验证），**变的只是皮**：从「学者页边注」换成「机器调试注释」——同一信息， colder 皮肤；
- 侧栏批注与「AI 审读意见」天然兼容：批注者可以是站长本人（`role: human`）也可以是审读模型（`role: reviewer-model`）——批注层变成人机共同批注的 diff 视图。

### 10.5 CJK 适配要点

1. **中间字重移植**：Noto Sans SC 可变（100–900）→ 用 350 做正文强调、450 做标题（复刻 Linear 510/590 的「耳语式强调」）；
2. **负字距只作用于西文**：CJK 字符字距保持 0（或 +0.01em），Latin run 内才启用 −0.02～−0.06em；
3. **等宽层 = 西文等宽 + CJK 黑体**（JetBrains Mono + Noto Sans SC）；数字一律 `font-variant-numeric: tabular-nums`；
4. **盘古之白**在构建期处理（Astro rehype 插件），不在运行时；
5. 正文行长 30–45 汉字、行高 1.8–1.9（v1 §4.10 结论维持，冷感来自字重与色彩而非压缩行高）；
6. 深色模式中文黑体渲染偏糊 → 深色下正文字重 +50（可变字重一键解决）；
7. **竖排转场素材**（Shiftbrain 启发）：章节题/站名可用竖排中文做转场文字层——CJK 特权，西文站做不了。

### 10.6 技术栈映射（Astro 6 + Cloudflare Workers）

| 需求 | 实现 | 成本 |
|---|---|---|
| 页面转场（编辑部剪辑式） | Astro ClientRouter（View Transitions API） | 原生，≈0 JS |
| 入场/滚动动效 | CSS scroll-driven animations + `@starting-style` | 原生，0 JS |
| 平滑滚动（可选） | Lenis | <5KB |
| 复杂序列（划线扫入、速度撕裂） | GSAP（或 Motion One）按需 import | 按需 |
| 划线扫入 | clip-path + `animation-timeline: view()` | 0 JS |
| 打字态/时钟/计数 | 原生 JS 小模块（每处 <1KB） | 极低 |
| 可变字重呼吸 | `font-variation-settings` + scroll timeline | 0 JS |
| **JS 预算** | 对标 Aino（全站物理+morphing = 30KB）；本站建议 **≤30KB gzip** 并写进 colophon | 透明化 |

无障碍纪律：所有动效过 `prefers-reduced-motion` 门（Warp 式：光标停闪、transform 退化为 opacity）；键盘可达（Linear 式：`/` 聚焦搜索、`g h` 回首页一类快捷键可选做）。

---

## 11. 反面清单：什么会让技术动效显得廉价

### 11.1 缓动与时长
- [ ] 全站默认 `cubic-bezier` 转场（"Most copycats ship CSS transitions on default cubic-bezier and the result feels like a website with the chrome removed"）；
- [ ] 「奢侈品级」慢动效（0.5s+ 的淡入淡出）用在工具/阅读语境——那是摩擦不是优雅；
- [ ] `linear` 缓动滥用（真实的线性运动只属于机械与步进——要机械感请用 `steps()`，那是「有意的帧」）。

### 11.2 动机的诚实性
- [ ] **无事件原因的循环动画**（悬浮光斑、自动打字的假终端、永远在转的 loading）——Linear 的纪律：一切移动皆因某事发生，结束即停（唯一豁免：真实数据流，如时钟）；
- [ ] 滚动触发的、与内容结构无关的「华彩」（ random 元素乱飞、无关图片视差堆叠）；
- [ ] 说不出名字的动效（rauno taxonomy，v1 已立）：每个动效必须能回答「它为什么存在」。

### 11.3 色彩与光效
- [ ] 强调色到处用（SeedFlip：「rounded where Linear is sharp, noisy where Linear is quiet... The accent color is everywhere」——错的全套）；
- [ ] 纯黑 `#000000` 画布 / 纯白 `#FFFFFF` 文字（全谱系无一例外用近黑近白）；
- [ ] 深色界面上的投影、渐变、glow 光晕、玻璃拟态（Linear："no gradients on UI surfaces, no glowing halos, no layered blurs"）；
- [ ] 「hacker 绿字满屏」矩阵雨/扫描线壁纸化——扫描线只有绑在状态上才是语言（chrislemke 用它标记 `>_ SCAN`，不是铺背景）。

### 11.4 形状与深度
- [ ] 大圆角胶囊按钮 + 药丸卡片（Warp：「sharp-cornered button 是身份的一部分」；圆角 ≤6px）；
- [ ] 用 box-shadow 表达深度（必须用亮度台阶 + 发丝线）；
- [ ] 「卡片海」：一切内容都装进同一种圆角卡（v1 slopfair 已ban，维持）。

### 11.5 内容的诚实性
- [ ] 假指标（「99% 正常运行」）、假终端（只有 `help/whoami` 三条死命令的 terminal portfolio——46 条真命令 + man page 才配叫演示）；
- [ ] 插画/3D 渲染图冒充产品截图（Warp：彩色只许出现在真实软件里）；
- [ ] 把「dark, minimal, purple」当 mood board 抄——「That's not a design system. That's a mood board.」高级感在 token 精度，不在氛围词。

### 11.6 工程
- [ ] 用 CSS transform 劫持滚动条（要做平滑滚动只允许 Lenis 路线：原生滚动、无障碍保留）；
- [ ] 重 JS 换小效果（30KB 是全站物理引擎的预算，不是一个 hover 特效的预算）；
- [ ] 不理 `prefers-reduced-motion`；
- [ ] 帧率不稳（滚动不同步、jank）——一旦掉帧，所有「精密感」人设当场崩塌。

### 11.7 品格
- [ ] 照抄 2020 年的 Unseen/黑底噪点站（顶流已离场，你抄到的是尸体）；
- [ ] SaaS 落地页语汇直接搬到个人博客（hero 大字 + logo 墙 + testimonial——个人站没有「转化漏斗」，只有「读」）;
- [ ] 动效风格中途换语言：spring 用了一半忽然来一段 ease-in-out——**全场一个物理系**（1820：同一节拍贯穿所有页面）。

---

## 12. 对本博客的直接建议（供 plan 文档消费）

1. **Token 层**：直接采 §10.1（Linear 冷黑 + Geist 浅色双面 + 单一荧光强调色）；等宽「盖章层」覆盖全部元数据与生成记录。
2. **动效最小可行组合**（一个签名 + 两个纪律）：
   - 签名：**页面转场 = 编辑部剪辑式**（View Transitions + 统一节拍 + 划线扫入）；
   - 纪律一：微动效全部 spring 化（hover <100ms、快而清晰、事件驱动）；
   - 纪律二：环境层只放真遥测（时钟/构建指纹/状态点），零装饰动画。
3. **生成记录块的技术化皮肤**：chrislemke 式终端排版（`$ model: ... / steps: ... / tokens: ...`）+ steps() 打字入场 + 「人工润色：无」的绿点状态——**把 MEMORY 中已定的元数据需求直接映射到这套语言**。
4. **保留元素落地**：荧光划线 = 唯一信号色（§10.4）；侧栏批注 = 调试 gutter（§10.4）。
5. **远期彩蛋**（活动日志 / 终端版整站）：darkroom 的 Activity Log 与 mc. 子域证明这两个都是可承受的独立 feature——对本博客分别是「AI 流水线 changelog」与「`tui.` 终端版站点」。
6. **一句话定位**：产品站的克制（Linear 的 token 纪律）× 工作室站的锋利（Obys 的转场）× 独属于博客的诚实（生成记录遥测）——**用最冷的界面，包裹最坦白的机器自白**。

---

## 附录 A：站点清单总表（2026-09-08 验证）

| # | 站点 | URL | 类别 | 验证方式 | 调研价值 |
|---|------|-----|------|---------|---------|
| 1 | Linear ★ | https://linear.app | 工程美学产品站 | curl 200（v1 已截图） | **token 蓝本**（多源 DESIGN.md） |
| 2 | Vercel / Geist ★ | https://vercel.com | 工程美学产品站 | curl 200 + 官方系统页 | 浅色版 token + mono 盖章层 |
| 3 | Warp ★ | https://warp.dev | 工程美学产品站 | curl 200 | 终端语汇 + steps() 缓动 |
| 4 | Raycast | https://raycast.com | 工程美学产品站 | curl 200 | 彩色分岔对照 |
| 5 | Bun | https://bun.sh | 工程美学产品站 | curl 200 | 数据即排印 |
| 6 | IBM Carbon | https://carbondesignsystem.com | 设计系统谱系 | curl 200 | 谱系坐标 |
| 7 | Obys ★ | https://obys.agency | 动效前卫获奖站 | **浏览器实测 + 截图** | 布局引擎 + 巨型字标 + 实时时钟 |
| 8 | Aino ★ | https://aino.agency | 动效前卫获奖站 | curl 200 + Awwwards 数据 | 文字即媒介 + 30KB 预算 |
| 9 | MCLN ★ | https://francescomichelini.com | 个人获奖作品集 | curl 200 + Behance | 个人站做重 mono 的范本 |
| 10 | basement.studio | https://basement.studio | 动效工作室 | curl 200 + schema | 给 Linear 们做站的谱系证据 |
| 11 | Unseen Studio | https://unseen.co | 动效工作室（转向样本） | **浏览器实测 + 截图 + 交互** | 声音门 + 转向警示 |
| 12 | Lusion | https://lusion.co | 动效工作室 | curl 200 | 天花板标尺 |
| 13 | Active Theory | https://activetheory.net | 动效工作室 | curl 200 | 天花板标尺 |
| 14 | Waaark | https://waaark.com | 动效工作室 | curl 200 | 天花板标尺 |
| 15 | Igloo Inc | https://igloo.inc | 动效工作室 | curl 200 | 黑白 WebGL 标本 |
| 16 | 1820 Productions | （见 Codrops 案例） | 案例研究 | Codrops 访谈 + 域名实测 | **方法论最重合** |
| 17 | omolism D:ualSpace ★ | https://omolism.cargo.site | 个人 1-bit 动效站 | curl 200 + 自述 | 1-bit 管线 + 坐标语汇 |
| 18 | Klim ★ | https://klim.co.nz | 字体工坊 | curl 200 + Red Dot 评语 | 带状节奏 + 随机样张系统 |
| 19 | ABC Dinamo ★ | https://abcdinamo.com | 字体工坊 | curl 200 + 访谈 | **可变字体动效哲学** |
| 20 | Grilli Type | https://grillitype.com | 字体工坊 | curl 200 + 内容抓取 | 每字体一个 minisite |
| 21 | Pangram Pangram | https://pangrampangram.com | 字体工坊 | curl 200 | specimen 参考 |
| 22 | Arrow Type | https://arrowtype.com | 字体工坊 | curl 200 | 可变字体玩具 |
| 23 | darkroom.engineering ★ | https://darkroom.engineering | OSS 工作室 | **浏览器实测 + 截图** | **Activity Log + 三地时钟 + mc. 版** |
| 24 | Lenis ★ | https://lenis.dev | 动效基建 | curl 200 + GitHub | 平滑滚动唯一正解 |
| 25 | GSAP | https://gsap.com | 动效基建 | curl 200 | 行业标准库 |
| 26 | Motion | https://motion.dev | 动效基建 | curl 200 | 轻量现代路线 |
| 27 | Hover States ★ | https://hoverstat.es | 灵感画廊 | curl 200 | **hover 微动效定向弹药库** |
| 28 | Codrops | https://tympanus.net/codrops | 教程/案例 | curl 200 | 前卫动效方法论源头 |
| 29 | Godly | https://godly.website | 灵感画廊 | curl 200 | 策展画廊 |
| 30 | Techno Minimalism 参考站 ★ | chrislemke.github.io/.../Techno_Minimalism.html | codified spec | **整站 CSS 抓取** | **v2 的现成宣言与 token 起点** |
| 31 | SHIFTBRAIN ★ | https://shiftbrain.com | 日文工作室 | **浏览器 DOM 实测**（.co.jp 301→） | CJK 工程美学上限证明 |
| 32 | Zenn | https://zenn.dev | 日文平台 | curl 200 + DOM 抓取 | 平台级基线（对照面） |
| 33 | tha ltd. | https://www.tha.jp | 日文工作室 | curl 200 | 谱系坐标 |
| 34 | DIYgod ★ | https://diygod.cc | 中文个人博客 | curl 200 + 全量内容抓取 | **AI prompt 自我介绍先行者** |
| 35 | Innei / Shiro ★ | https://innei.in | 中文个人博客 | curl 200 + README | spring 动效天花板（学工程弃气质） |
| 36 | tw93 | https://tw93.fun | 中文个人博客 | curl 200 | 实用派基线 |
| 37 | Pseudoyu | https://pseudoyu.com | 中文个人博客 | curl 200 | 干净开发者站样本 |
| 38 | 王垠 | https://yinwang.org | 中文反设计 | curl 200 | 内容即全部的极端 |
| 39 | 云风 | https://blog.codingnow.com | 中文经典 | curl 200 | 时间即设计（v1 维持） |
| 40 | Low-tech Magazine（solar） | https://solar.lowtechmagazine.com | 约束美学 | v1 已验证 | 抖动谱系（与 omolism 连线） |

## 附录 B：未通过 / 未完成验证（备忘）

- `https://v2ex.com` — curl 连接失败（000，多次重试）；疑似屏蔽非浏览器流量。浏览器复核未完成，谱系参考价值保留，采信前自行开屏。
- `https://minimal.gallery` — curl 连接超时；存在性由搜索结果支持，本轮未完成浏览器复核。
- `https://rhizomatiks.net` — curl 连接失败（000）；本轮放弃，如有需要下次用浏览器直开。
- `https://zenn.dev` 浏览器截屏 — 因共享浏览器会话被打断未存档（curl 200 + DOM 抓取已完成，视觉描述基于 DOM 与通识）。
- Warp 的两版 token（冷黑 `#121212` / 暖炭 `#2b2622`）来自不同第三方目录的抓取，**未能确定哪个对应当前线上版本**——已并列呈现，落地前需实机确认。

---

## 附录 C：跨文档引用（v1 已验证、结论维持的站点）

- **rauno.me** — 微交互方法论（《Invisible Details of Interaction Design》的动效命名法是 §11.2 的理论依据）；
- **gwern.net** — 侧栏批注的功能原型（§10.4 重铸的基础）；
- **antfu.me** — 圆形扩散主题切换（若做深浅切换，这是最被模仿的实现；但冷感版可改用「整页反相 + difference 混合」）；
- **slopfair / vibe-coded.lol** — AI slop 反面清单（§11 的姊妹篇，v1 §6.7 维持有效）；
- **端传媒 / The Type** — 中文排印权威参考（§10.5 的依据）。

---

*本报告由 AI 生成。调研过程中人类投入约等于零，动效预算 30KB。*
