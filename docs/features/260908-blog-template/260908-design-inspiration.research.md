# 《又是一个 AI 生成的博客》设计灵感调研

> - **日期**：2026-09-08
> - **目的**：为新博客《又是一个 AI 生成的博客》（Yet Another AI-Generated Blog）的网站模板设计提供灵感输入
> - **产出**：具体网站清单（含 URL）+ 每站设计语言分析 + 可迁移设计手法总结
> - **覆盖**：西方极简标杆 / 数字刊物编辑设计 / 中文·日文 CJK 排印实践 / 与「AI 生成 + 反讽 + 技术思辨」气质相符的多种设计方向
> - **验证**：文中主清单所有 URL 均于 2026-09-08 逐站实测可访问；部分站点提取了实际 CSS 设计 token（字体/色板），见各条目标注

---

## 0. 结论速览（TL;DR）

针对本博客「minimal but highly designed + 中文为主 + AI 生成 + 反讽 + 技术思辨 + 认真对待不认真」的画像，调研结论是**三层组合**：

1. **骨架主线：Works in Progress 式「印刷品」编辑设计**——等宽字体做界面层（导航/元数据/标签）+ 衬线做正文层、纸感底色替代纯白、单一强调色（链接色即品牌色）、零圆角的锐利感。这是「简洁但极具设计感」的最优解，也天然抵抗 AI 生成网站的「均质感」。
2. **气质辅线：gwern.net 式「认真的学究气」**——灰阶克制、侧栏注（sidenote）、首字下沉、防失效存档。把「认真」做到极致，与站名的「不认真」形成自嘲张力——**「认真对待不认真」最直接的视觉表达**。
3. **反讽元层：slopfair / vibe-coded.lol 式自反幽默**——不是全站玩梗，而是在 colophon（版权页）、404、文章元数据等「边缘地带」埋自嘲彩蛋。尤其是：**把「AI 生成」本身做成可见、诚实的元数据**（模型名、prompt 链、人工投入时长），把「刻意压低人力投入」变成站点的签名式幽默。

CJK 适配参照：端传媒（中文长文杂志级排印）+ The Type（中文排印权威话语）+ antfu.me（中英双语实践）。

---

## 1. 调研方法与说明

- **候选池来源**：多引擎搜索（Degoog / Exa / Firecrawl）、设计策展画廊（Awwwards minimal 分类、MUUUUU.ORG、Sankou!）、知乎/日文设计社区的经典讨论帖、以及候选人站之间的互链（个人站圈高度互联，「谁被谁引用」是质量信号）。
- **验证方式**：2026-09-08 对全部主清单 URL 逐站抓取实测；对 Works in Progress、宝玉的分享两站用 branding 提取方式拿到了实际 CSS 中的字体族与色板；gwern.net 的字体清单来自其公开的站点设计说明书与仓库。
- **标注约定**：★ = 重点范本；〔实测 token〕= 本调研中提取到的实际设计参数。对仅凭通识描述、未经逐像素核验的细节，措辞上保持克制。
- **一个总体观察**：2024–2026 年个人网站的「文艺复兴」仍在持续，且明显分化为两条路——**Vercel/Linear 系的「产品级极简」**（Geist 字体、卡片、深色模式）与**印刷复兴系「纸上编辑设计」**（衬线正文、纸色底、等宽元数据）。后者正成为对抗「AI 生成网站均质感」的主流答案，这与本博客的调性高度契合。

---

## 2. 西方极简标杆：个人网站与博客

这一批站点定义了「个人网站的当代水准线」。共同点：**克制是手段，细节密度才是内容**。

### 2.1 Rauno Freiberg — https://rauno.me ★

- **定位**：Vercel 前 design engineer（设计系统/官网/仪表盘作者），现以《Craft》文集闻名——把「设计细节学」本身做成内容资产。
- **版式**：当前首页是一页极简宣言——"Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. **Make it.**" 首页即宣言，是「少即是多」的极端演示；站点核心内容在 `/craft` 文集（Invisible Details of Interaction Design、Designing Depth、Logo Carousel 等）。
- **设计语言**：无多余色彩、克制的字号阶梯、以微交互为灵魂。2023–2025 年间曾以「桌面操作系统」隐喻的版本（dock、窗口、界面音效）广为流传并被收录展示，足见其「敢推倒重来」。
- **细节处理**：其《Invisible Details of Interaction Design》给出了微交互的分类词汇表：Responsive Gestures / Fluid Morphing / Frequency & Novelty / Fidget / Scroll Landmarks / Touch Content Visibility / Implicit Input / Fitts's Law——**这份 taxonomy 本身就是博客动效设计的现成 checklist**。
- **可迁移**：「宣言式首页」；把方法论写成系列文集；动效只做「有名字的动效」（能说清为什么存在的动效）。

### 2.2 Paco Coursey — https://paco.me

- **定位**：Linear 的 Webmaster，前 Vercel，"Crafting interfaces"。个人站是「安静型极简」的教科书。
- **设计语言**：黑底暗色为默认、近乎无彩的配色、极少的字号层级；自我介绍只有一句 "Developing skill through doing, guiltlessly exploring passion and interests, imbuing quality"。项目列表短得惊人（命令菜单组件、纯文本编辑器、"Perfect Dark Mode"）。
- **细节处理**：悬停态、焦点态等微状态处理极精细；写作有《Return to simplicity》《Infrequent thoughts on design and code》——连标题都在践行低频高质。
- **可迁移**：无彩色方案；「少而完整」的项目呈现；标题/正文/元数据的三层信息模型。

### 2.3 Josh Comeau — https://www.joshwcomeau.com

- **定位**：互动式前端教程的天花板，个人站「可玩性」的极限样本。
- **版式**：标准博客结构，但正文内嵌大量交互演示组件（可直接操作的 CSS/React demo）。
- **色彩**：这是刻意「不极简」的对照组——粉/青渐变、明快的插画色板。证明「设计感」不等于「冷淡」。
- **动效**：动画深色模式开关、"party mode"（点击后全站彩虹律动）等签名式彩蛋；正文组件随滚动入场。
- **可迁移**：文章页内嵌交互演示的思路（AI 主题文章天然适合内嵌 demo）；「一个可发现的彩蛋」带来的记忆点远超十个普通动画。

### 2.4 Anthony Fu — https://antfu.me

- **定位**：Vite/Nuxt/Vue 生态核心开发者；**中英双语个人站的最佳实践**（与本博客「中文为主、可能中英混排」直接相关）。
- **设计语言**：干净、快、现代；标志性细节是**主题切换的圆形扩散动画**（clip-path 从点击处展开），已成为被广泛模仿的「签名式动效」范本。
- **可迁移**：双语站点的内容组织；一个足够好的签名动效胜过满页普通动效；开发者工具感与阅读感的平衡。

### 2.5 Lee Robinson — https://leerob.io

- **定位**：Vercel VP，个人站即 Vercel 设计语言（Geist 字体族）的民用化示范。
- **设计语言**：单列 + 卡片、Geist Sans、默认深色、Newsletter 置于视觉焦点。信息架构完全围绕「订阅转化」组织。
- **可迁移**：「产品级极简」的干净范式；Newsletter 作为个人站一级公民的排布。

### 2.6 Guillermo Rauch — https://rauchg.com

- **定位**：Vercel CEO 的个人站，「无装饰」哲学的极限样本：单列文章列表，几乎零视觉元素，**排印即全部设计**。
- **可迁移**：证明「零装饰」与「有设计」并不矛盾的前提是排印功底；对「每周两更」的博客，这种列表即全站的形态维护成本最低。

### 2.7 Derek Sivers — https://sive.rs

- **定位**：「做减法」的精神图腾。整站只有寥寥数页（主页 + about 为主），无评论、无跟踪。
- **设计语言**：衬线正文、简单的层级、页面即文章。他把「网站可以多小」本身变成了设计声明。
- **可迁移**：小而完整的站点结构；「关于我」一页写清楚的叙事功力（他的 about 页是业内公认的范文）。

### 2.8 Brian Lovin — https://brianlovin.com

- **定位**：产品经理个人站的干净范本（结构化的「现在在做什么/做过什么」）。
- **可迁移**：「Now」页面的传统（nownownow.com 运动的代表作之一）；结构化自我呈现。

### 2.9 Sam Henri Gold — https://samhenri.gold

- **定位**：「反设计但有品味」的代表——粗野主义（brutalism）在个人站上的正确打开方式。
- **设计语言**：刻意的装饰性、玩梗、字面化的幽默；与 rauno/paco 的精致路线构成光谱两端。
- **可迁移**：证明「丑得很真诚」是一种可行人格——但要求幽默感真实、执行到位，否则就是真丑。对本博客：可作为「边缘页面」的调味参考，不宜做主线。

### 2.10 Gwern Branwen — https://gwern.net ★〔实测 token，来源：站点自述设计页 gwern.net/design 及其开源仓库〕

- **定位**：独立研究员，写了大量关于 AI/统计/决策论的长文。**全站是一个「学术暗黑风」（dark academia）与超文本工程学的极端实验**，与本博客「AI + 哲学」主题气质最接近的单站。
- **字体**〔实测〕：正文 Source Serif 4（400/600/700/900），界面 Source Sans 3，代码 IBM Plex Mono；首字下沉使用 Goudy Initialen、Cheshire Initials 等古典装饰字体。
- **色彩**：全站灰阶实验——"palette is deliberately kept to grayscale as an experiment in consistency"。黑、白、多层灰，零彩色。
- **版式与超文本特性**：宽屏下用**侧栏注（sidenotes）替代脚注**；链接悬停弹出**预览浮窗**（popup/popover，可再展开全文转写）；可折叠章节 + 「语义缩放」（semantic zoom）实现「冰山页面」——大量信息默认隐藏、读者按需下钻；维基百科式链接图标与信息框；自动通胀换算的货币；对抗链失效的本地存档体系。
- **设计哲学**（其自述）：四原则——悦目的极简主义、渐进增强（JS 非必需，elinks 文本浏览器也能读）、速度、语义缩放。并引用禅僧一休「Attention！」：内容之外皆是干扰。他在自述中还有一个精彩观点：**「先做减法清空场地之后，才赚得添加『多余』装饰的权利」**——dropcap 与 small caps 是在灰阶克制之上才成立的美。
- **可迁移**：灰阶 + 单色实验；侧栏注；链接预览弹窗；折叠式信息密度管理；「先极简、后点缀」的装饰授权论——与「认真对待不认真」几乎同构。

### 2.11 Maggie Appleton — https://maggieappleton.com ★

- **定位**：人类学家出身的 AI 界设计研究者（GitHub Next），「数字花园」（digital garden）运动最重要的布道者与实践者之一。
- **版式**：首页即花园目录：Essays（有立场的长文）/ Notes（半成品笔记）/ Patterns（观察模式）/ Library（书单）四区分层；每篇配**手绘 SVG 插图**——这是抵抗「AI 生成均质感」的最有效手段之一。
- **设计语言**：暖色纸感底色 + 手绘插图 + 花园生长阶段的元数据隐喻（幼苗/成长/常青）。
- **可迁移**：数字花园的内容分层（对本博客：正式文章 vs 碎念）；手绘/非 AI 视觉元素的运用；首页即内容地图而非营销页。

### 2.12 Simon Willison — https://simonwillison.net

- **定位**：高产 AI/LLM 博主的事实标准。**实用主义反证样本**：设计完全让位于内容——经典列表、朴素排印、标签 + 搜索。
- **可迁移**：对「每周两更、AI 主题」的博客，它证明内容节奏 > 视觉设计；但反过来说，**在内容同等情况下，设计就是差异化**——本博客完全可以在 Simon 的内容形态上叠加 WiP/gwern 的视觉层。

### 2.13 Bret Victor — https://worrydream.com

- **定位**：交互设计思想者，《Magic Ink》作者。个人站是「每篇文章都是一次独立艺术指导」的极端示范。
- **可迁移**：重要文章值得单独设计（封面、插图、版式）；「文章即作品」的内容观。

### 2.14 经典老站群像（均已验证存活）

- **Daring Fireball** — https://daringfireball.net — John Gruber。「链接列表（linked list）+ 长文」双体裁的鼻祖；二十年不换设计本身成了设计。**对每周两更的博客：短评 + 长文的双体裁结构直接可抄。**
- **kottke.org** — https://kottke.org — "home of fine hypertext products since 1998"。自嘲式 footer（"Beloved by 86.47% of the web"）与会员制（评论仅会员可见）是「认真对待不认真」的老前辈。随机变色的 logo 是低成本的签名细节。
- **iA（Information Architects）** — https://ia.net — 「Web Design is 95% Typography」的源头（东京/柏林公司）。瑞士极简 + 排印理论高地，所有字体选型前值得重读。
- **Motherfucking Website** — https://motherfuckingwebsite.com — 2016 年的反装饰宣言（自述为 satire）："Good design is as little design as possible."（出自 Dieter Rams）。本博客的「认真对待不认真」与它精神同源，但方向相反：它拒绝设计，我们要的是**把设计做得看起来毫不费力**。

---

## 3. 数字刊物与编辑设计标杆

博客想「极具设计感」，最成熟的范本其实是数字刊物。它们的共同手法：**印刷时代的编辑设计语言（衬线正文、纸色、等宽元数据、零圆角）+ 网络原生的交互**。

### 3.1 Works in Progress — https://worksinprogress.co ★★〔实测 token〕

- **定位**：关于科学/技术与进步思想的刊物（隶属 Future/Institute for Progress 系）。**本调研中最值得整站模仿的对象**。
- **字体**〔实测 CSS〕：标题与 UI 层用 **GT America Mono**（Light/Bold）——等宽字体做「机器层」；正文用窄身衬线 **Editor**（Editor-Regular/Bold）做「阅读层」。**等宽 + 衬线的双字体分工是它最核心的可迁移手法**。
- **色彩**〔实测 CSS〕：背景奶油白 `#FFF7F4`（不是纯白！）、主强调黄油黄 `#F4D06F`、辅助鼠尾草绿 `#CEE0DC`、链接靛蓝 `#363B8F`、正文墨黑 `#000000`。**「纸感底色 + 一两个低饱和暖色 + 深色链接」是反「AI 渐变紫」的完整答案**。
- **细节**〔实测 CSS〕：**全局圆角为零**（border-radius: 0px）、4px 基准间距网格——锐利、印刷感。按钮为黄底黑字黑边、无阴影无圆角。
- **版式**：issue（期）为单位组织内容，每期配专门封面插画；文章页大图 + 单列正文 + 脚注文化；每篇文章有独立的视觉资产（封面图/插画）。
- **设计沿革**：由 And—Now（and-now.co.uk）设计，2020 年首版、2023 年全面改版，设计哲学延续至今。
- **可迁移**：字体分工（mono=机器/UI，serif=人/正文）；纸感底色；零圆角；每篇文章独立视觉资产；「期」的叙事单位。**对本博客的适配度满分**——AI 主题 + 技术思辨 + 每周两更，几乎就是它的个人站版。

### 3.2 Stripe Press — https://press.stripe.com ★

- **定位**：Stripe 的出版品牌，网页工艺（web craft）的公开展厅。
- **设计语言**：**每本书一个单独设计的页面**——3D 地球、可旋转的数据环、漩涡式滚动交互（《The Scaling Era》——一本关于 AI 计算历史的书，页面做成信息漩涡/甜甜圈界面，上下滚动产生信息被吸入或喷出的感觉）。
- **可迁移**：内容对象级别的艺术指导（重要内容单独设计）；把「网页」当「藏品」做的心态；对 AI 主题内容，Stripe Press 证明**技术内容可以做得很感性**。

### 3.3 Aeon — https://aeon.co

- **定位**：哲学/文化/思想刊物，与本博客「哲学」主题直接对口。
- **设计语言**：大图开篇 + 衬线正文 + 分类标签（essay/video/idea）+ 沉思式的慢节奏排版；命题式配图（每篇一张强概念的摄影/插画）。
- **可迁移**：哲学内容的「沉思型」排版——更大留白、更慢的视觉节奏；essay/idea 的体裁区分。

### 3.4 Noema — https://www.noemamag.com

- **定位**：Berggruen 研究所的思想刊物，核心栏目就叫 "Technology & the Human"——**与本博客主题矩阵（AI/技术/哲学）重合度最高的刊物**。
- **设计语言**：竖幅主视觉插画 + 优雅衬线大标题 + Feature/Essay 分体裁；配图大量使用定制插画而非照片，形成独特的「思想刊物」气质。
- **可迁移**：栏目叙事化（把分类写成世界观）；插画驱动的视觉策略。

### 3.5 The Pudding — https://pudding.cool

- **定位**：数据叙事/视觉随笔（visual essays）的标杆，每篇都是一个小型定制应用。
- **设计语言**：高饱和、大胆的标题排印、每篇独立设计；反「无菌数据新闻」的编辑立场。
- **可迁移**：重要文章用「视觉随笔」形态做差异化；数据/论证性内容的交互化表达。

### 3.6 Palladium — https://www.palladiummag.com

- **定位**：治理/社会哲学刊物（近年大量 AI 与制度、AI 与精神的文章，主题契合）。〔实测：主题色深棕 `#282520`〕
- **可迁移**：深色暖棕的独特主题色——避开蓝紫俗套的又一证据；Substack 通讯 + 主站的双轨发行。

### 3.7 Quanta Magazine — https://quantamagazine.org

- **定位**：科学报道的编辑设计标杆，抽象概念插画体系成熟。
- **可迁移**：抽象概念的插画转译；衬线标题 + 无衬线正文的反向组合方案。

### 3.8 Asterisk — https://asteriskmag.com ／ Logic — https://logicmag.io

- **定位**：Asterisk 是新的科学/进展思想刊物（编辑设计干净克制）；Logic 是技术批评杂志（已停更、存档状态），双栏编辑排印 + 强排印传统，其「技术的人文批评」定位与本博客内容气质相投。
- **可迁移**：技术批评类内容的编辑设计语汇；「停更但存档完好」本身也提示：**博客要设计好归档与永久链接**。

### 3.9 The New Inquiry — https://thenewinquiry.com

- **定位**：「反讽编辑设计」的代表作——拼贴、梗图、故意不精致的版面，配合文化批评的锋利文风。
- **可迁移**：**「故意的粗糙」需要极强的排版控制力才不垮**；对本博客的价值在于：证明反讽可以成为视觉语言，但要用在刀刃上。

### 3.10 Distill — https://distill.pub ⚠️ 已存档（2021 起停更，站点完好）

- **定位**：机器学习交互式期刊，**AI 内容排版的黄金标准**：卡片式首页、正文内嵌交互图、边注引用、把「同行评审」做成 GitHub issue 的透明机制；其自述文《Communicating with Interactive Articles》本身值得一读。
- **可迁移**：AI/技术内容的图解与交互规范；引用进边注；**「已存档但依然是最常被引用的设计」——好的设计比运营寿命长**。

---

## 4. CJK 排印优秀实践（中文/日文）

中文为主的站点，设计上限受制于 CJK 排印质量。这一章的站点证明：**中文网页可以做到杂志级**。

### 4.1 端传媒 — https://theinitium.com ★

- **定位**：中文深度报道的排印标杆。〔实测：主题色冷静蓝 `#29A6C9`；现基于 Ghost 平台，繁体为主〕
- **设计语言**：**宋体正文**（思源宋体系）+ 大图叙事 + 专题（series）化组织 + 会員制；文章页阅读节奏克制、层级分明；速递/解读/评论的分体裁导航。
- **可迁移**：中文长文的杂志级排印基准——宋体正文、单列、克制用色；「速递（短）/解读（中）/评论（长）」的三档体裁对本博客「每周两更 + 碎念」的结构直接可参考。

### 4.2 The Type（Type is Beautiful）— https://thetype.com ★

- **定位**：中文排印/字体设计的权威话语场。《字谈字畅》播客已至 290 期；另有字体商店（在售「铁宋」等）、会员体系、「孔雀计划：中文字体排印的思路」专题。
- **可迁移**：中文排印问题的第一参考源；「研究专题 + 播客 + 周边商店」的多形态内容运营思路；其站点本身的中西文混排细节值得逐页学习。

### 4.3 宝玉的分享 — https://www.baoyu.io ★〔实测 token〕

- **定位**：中文 AI 圈最高产的博客之一（LLM/Agent/Prompt/软件工程），与本博客主题和「AI 辅助生产」模式最接近的中文先行者。内容大量为 AI 辅助翻译与写作，**中英混排自然**。
- **设计语言**〔实测 CSS〕：Inter 字族、纯白背景 `#FFFFFF`、近黑正文 `#0A0A0A`、4px 基准网格、4px 圆角；首页为日期倒序的文章列表，每条一句话摘要。
- **可迁移**：「一句话摘要 + 日期」的列表形态（信息密度高、维护成本极低）；中英混排的字距处理；证明 Inter 一类中性无衬线足以承载中文为主的 AI 内容——**但也正因太「标准」，留出了做出差异化的空间**。

### 4.4 广正 — https://guangzhengli.com

- **定位**：双语（中/英）独立开发者博客，现代极简 + 双语切换的干净实现。
- **可迁移**：双语站点的内容组织（zh/en 路径分流）；开发者个人站的现代排印组合。

### 4.5 阮一峰的网络日志 — https://www.ruanyifeng.com/blog/

- **定位**：中文技术博客的「原生感」标本。每周五《科技爱好者周刊》连载多年（2250+ 篇），几乎零装饰、系统默认样式、纯信息密度。
- **可迁移**：「完全不设计也是一种设计声明」的中文证明；**周刊体裁**（本周值得分享的科技内容）对本博客「每周两更」是现成的内容框架之一；其长青证明了**节奏感 > 视觉**——但注意：它赢在 20 年先发，新站不能只靠这个。

### 4.6 云风 的博客 — https://blog.codingnow.com

- **定位**：游戏程序员博客，二十余年不变的经典样式——**时间本身成了设计**。
- **可迁移**：稳定性与密度优先的价值观；提醒我们：博客的敌人不是「不够时髦」，而是「停更」。

### 4.7 少数派 — https://sspai.com

- **定位**：中文效率/数码媒体的排印与信息架构范本。
- **可迁移**：卡片流与长文页的平衡；中文正文行高/行长的舒适区间参考。

### 4.8 挾土秀平（左官） — https://www.syuhei.jp ★（日文）

- **定位**：日本 plaster（左官）工艺家官方网站 "Thinking Through Earth"。**罕见地在 web 上同时使用纵排与横排日文排印**（设计界评价：当代罕见的双向排印实践），由 10 Planning 制作。
- **设计语言**：工艺质感的图像、直排标题与横排正文混排、自然素材色系、大量留白 + 沉浸式滚动。
- **可迁移**：CJK 排印的可能性边界——纵排元素（哪怕只用于站名/章节标题/装饰性文字）能瞬间建立「印刷品」气质；**「手艺感」如何转译成网页语言**。

### 4.9 ゆたかさをデザインするブログ — https://nagaseyutaka.com（日文）

- **定位**：日本「被认真设计过的个人随笔博客」样本（透析生活中的调酒师/书评/随笔），栏目自述即气质：「精神衛生上心地よいポートフォリオ」（对精神卫生有益的作品集）。
- **可迁移**：日文个人博客「设计但不商业」的中间态；生活流 + 设计感的共存。

### 4.10 CJK 排印要点小结（面向本博客的实现清单）

- **行长**：中文正文每行 30–45 字（约等效 68ch 西文）；单列、居中、两侧大量留白。
- **行高**：中文 1.8–2.0（西文 1.5–1.6）；段落间距用 `margin` 而非空行。
- **字体栈**（正文，宋体路线）：`"Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", serif`；（界面/UI，无衬线路线）：`"Inter", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`；（等宽层）：`"IBM Plex Mono", "Geist Mono", "JetBrains Mono", monospace`。思源宋体/思源黑体开源免费可自托管；追求手写感可用霞鹜文楷（开源）做标题层。
- **中英混排**：中西文之间加空格（「盘古之白」，可用 pangu 类库或直接在渲染时处理）；西文与数字单独指定西文字体（中文字体的内嵌西文普遍质量差）；引号、破折号、省略号遵循中文标点规范。
- **对齐**：中文正文慎用 `text-align: justify`（浏览器断行会拉伸字距）；左对齐 + 合理行长更稳。
- **深色模式**：中文宋体在深色底上渲染更「糊」，需加大字重或改用黑体；`font-synthesis` 注意事项。
- **权威参考**：W3C《中文排版需求》（clreq）—— https://www.w3.org/TR/clreq/ （本次未逐节核验，规范地址长期稳定）；The Type 的「孔雀计划」专题系列。

---

## 5. 「AI 生成 + 反讽 + 技术思辨」气质的设计方向谱系

把调研对象按「气质」重新聚类，得到七个方向。**关键结论：不需要单选，主线 + 边缘点缀的混合最优**。

### 方向 A：极客极简（产品级干净）
代表：rauchg.com / leerob.io / antfu.me / paco.me / swyx.io
特征：单列、卡片、Geist/Inter 系、默认深色、快。
匹配度：★★★☆☆ — 干净、低维护，但**与 AI slop 的视觉默认值距离太近**（vibe-coded.lol 戏仿的正是这套语言的滥用版），需要额外细节拉开差距。

### 方向 B：学者书卷（dark academia / 学术暗黑）
代表：gwern.net / Aeon / 端传媒文章页
特征：灰阶或纸色、衬线正文、侧栏注、首字下沉、密集引文。
匹配度：★★★★★ — 「认真到反差萌」，与站名自嘲形成张力；适配哲学/长思辨内容。**成本：排印工程量大。**

### 方向 C：印刷编辑（print editorial revival）
代表：Works in Progress / Stripe Press / Asterisk
特征：等宽元数据 + 衬线正文、纸感底色、零圆角、每篇独立视觉。
匹配度：★★★★★ — 「minimal but highly designed」的字面答案；反 AI 均质感的最优解。**推荐主线。**

### 方向 D：反设计/粗野主义（anti-design）
代表：samhenri.gold / The New Inquiry / motherfuckingwebsite.com
特征：故意的装饰、玩梗、字面化幽默。
匹配度：★★★☆☆ — 反讽浓度高，但执行门槛极高（做不好就是真丑），且长期阅读疲劳。**适合 404/彩蛋/footer 等边缘地带。**

### 方向 E：数字花园/手绘（garden & illustration）
代表：maggieappleton.com / 挟土秀平
特征：手绘 SVG、生长阶段元数据、暖纸色。
匹配度：★★★★☆ — 手绘是抵抗 AI 均质感的最强武器，但**与「人力投入刻意最低」的博客画像冲突**（插图要么 AI 生成——正中主题的幽默——要么放弃）。

### 方向 F：约束美学（constraint as design）
代表：solar.lowtechmagazine.com — https://solar.lowtechmagazine.com
特征：太阳能供电站点、**抖动（dithered）位图插图**、电池余量表、静态化、复古系统字体——把技术约束变成视觉语言。
匹配度：★★★★☆ — **方法论上最同构**：Low-tech 用「离网供电的约束」生成视觉，本博客可以用「AI 生成 + 人力最小化」的约束生成视觉与元数据。抖动位图风格低成本且高辨识度。

### 方向 G：自反式 AI 戏仿（meta-irony）★ 本博客独有赛道
代表：
- **The World Fair of Slop** — https://slopfair.bisks.net — 「AI 默认设计世博会」，像博物馆一样给陈词滥调编号并配拉丁学名：The Gradient Hero（*Purpurea diagonalis*，紫渐变英雄区）、The Trust Badge Wall（*Credibilitas simulata*，信任徽章墙）、The Testimonial Rotunda（*Quinque stellae semper*，永远五星的推荐语）、The Bullet Point Emoji Garden（*Emoji anteponens*，emoji 列表）、The Not-Just-X-It's-Y Pavilion（*Non modo, sed*，「不只是 X，更是 Y」馆）、The Chatbot Greeting Booth、The Stat Counter Fountain、The Glassmorphism Card Grid。**这是现成的「设计审查负面清单」。**
- **vibe-coded.lol** — https://vibe-coded.lol — 《Hey Look, It's Every AI-Coded Website Ever》：故意保留 `{{COMPANY_NAME}}`、`{{CEO_NAME}}` 模板变量，署名 "Lovingly crafted by Claude while Jimmy K stood by and took all the credit"，还有 "Someone said 'not enough tailwind. 6/10.' So here's a literal tail in the wind"（一张风吹狗尾巴的照片）。
- **Distill**（AI 内容的正面黄金标准，见 3.10）。
匹配度：★★★★★ — **没有任何一个已存在的博客同时做「方向 C 的认真排印」+「方向 G 的自反幽默」**。这个组合位是空的，而站名《又是一个 AI 生成的博客》天生就站在这里。

---

## 6. 可迁移设计手法总结

### 6.1 版式
1. **首页即目录**（rauchg / 阮一峰 / Simon Willison）：日期倒序 + 一句话摘要，克制到不需要「设计」，靠排印取胜。
2. **双体裁结构**（Daring Fireball）：「链接/短评 + 长文」两种内容类型分列，适配「每周两更」中的轻/重内容。
3. **单列正文 + 68ch 行长 + 居中**（WiP / gwern / 端传媒）：唯一被反复验证的长文版式。
4. **期/专题叙事**（WiP / Noema / 端传媒）：把时间线组织成「期」，弱化博客的时间流、强化编辑感。
5. **数字花园分层**（maggieappleton）：正式文章 vs 半成品笔记的分层，允许「不完美发布」。

### 6.2 字体排印
1. **等宽 = 机器层，衬线 = 人的层**（WiP 的 GT America Mono + Editor）：导航/日期/标签/元数据用等宽，正文用衬线。中文版实现：**界面与元数据用等宽西文 + 中文黑体，正文用宋体**。
2. **三层字体模型**（gwern）：正文衬线 / 界面无衬线 / 代码等宽，各司其职。
3. **古典点缀**（gwern）：首字下沉、small caps、链接图标——但**必须建立在整体克制之上**（gwern 的「装饰授权论」）。
4. **中文要点**：行长 30–45 字、行高 1.8–2.0、盘古之白、慎用 justify、宋体做正文黑体做界面（详见 4.10）。

### 6.3 色彩
1. **纸感底色替代纯白**（WiP `#FFF7F4`）：一点点暖，成本为零，瞬间脱离「AI 默认感」。
2. **单一强调色，链接色即品牌色**（WiP 靛蓝 `#363B8F` / 端传媒 `#29A6C9`）：全站只有一个彩色元素——链接。
3. **灰阶实验**（gwern）：无彩色 + 灰阶层次也能成立，且极具个性。
4. **反 slop 色彩清单**（slopfair）：紫→蓝渐变、玻璃拟态卡片底渐变、「不敢用非圆形圆角」——全部禁用。

### 6.4 留白与密度
1. **奢侈留白（刊物级）** vs **密度即诚实（原生级）**是两条都成立的路线（WiP vs 阮一峰/云风/HN），**但不要停在中间**——半密不疏最平庸。
2. 章节间距大到「眼睛可以休息但不觉得空」（Tufte：留白不是设计的缺席，留白就是设计）。

### 6.5 动效
1. **签名式动效**：全站只需要一个被记住的动效（antfu 的圆形主题切换）。低成本高记忆点。
2. **有名字的动效**（rauno taxonomy）：每个动效都要能说清楚它为什么存在（预期反馈/状态连续性/焦点引导）。
3. **内容级动效**（Stripe Press / Pudding）：只在重点内容上做定制交互。
4. **零动效也是立场**（rauchg / DF）；无论如何：尊重 `prefers-reduced-motion`。

### 6.6 细节工艺（craft details）
1. **每篇文章独立 OG 图**（WiP / Noema）：社交分享即门面。
2. **链接预览弹窗 / 侧栏注**（gwern）：长思辨文体的两大利器。
3. **抖动位图处理图片**（Low-tech Magazine）：统一视觉 + 极低成本 + 高辨识度。
4. **自嘲式 footer / colophon**（kottke / vibe-coded.lol）：把「本站由 AI 生成、字体清单、技术栈、人工投入统计」写成一页版权页。
5. **永久链接与归档**（Logic 存档 / gwern 抗链失效存档）：博客的长期主义。

### 6.7 反 AI-slop 设计审查清单（综合 slopfair + vibe-coded.lol + 调研观察）
发布任何页面前自查：
- [ ] 首屏有没有出现「紫→蓝渐变 + 未定义动词大标题」？（Unlock / Supercharge / Elevate）
- [ ] 有没有「模糊到无法辨认的 logo 墙」和「永远 99% 的统计数字」？
- [ ] 列表是不是 emoji 开头、形容词承重、无任何数字/截图/引用？
- [ ] 是不是「不只是博客，更是一种生活方式」？（Not-Just-X-It's-Y 结构）
- [ ] 每个按钮/卡片是不是同一个圆角、同一种阴影、同一套间距？（AI 均质感的指纹）
- [ ] 界面字体是不是就是模型默认输出那几款，且没有任何元数据层的字体对比？
- [ ] 有没有任何一处「只有这个站才有」的细节？（签名动效/彩蛋/元数据设计/colophon）

---

## 7. 对本博客的落地建议

### 7.1 推荐组合
- **主线（方向 C）**：WiP 式印刷编辑骨架——等宽元数据层 + 宋体正文层 + 纸感底色 + 单一强调色 + 零圆角。
- **气质（方向 B）**：重要长文启用 gwern 弯：侧栏注、首字下沉、灰阶配图。
- **元层（方向 G，本博客的差异化核心）**：把「AI 生成」做成**可见的诚实元数据**。

### 7.2 设计 token 草案（可直接作为模板起点）
```
背景      #FAF7F2（暖纸白；深色模式 #171512）
正文墨色   #1A1815（近黑，不用纯黑）
强调色    #363B8F（靛蓝，仅用于链接与交互）——或换成深绿/赭石系
辅助色    一个低饱和暖色（黄/赭），仅用于标记/分类点
字体层 1  正文：Noto Serif SC（思源宋体）+ Source Serif 4（西文/数字）
字体层 2  界面/元数据：IBM Plex Mono 或 Geist Mono（西文）+ 思源黑体（中文）
圆角      0（锐利印刷感）或 2px（极小）
间距      4px 基准网格；正文列宽 30–45 汉字；行高 1.9
动效      全站一个签名动效（建议：主题切换圆形扩散，致敬 antfu）
```

### 7.3 「AI 生成」元数据设计（特色机会，调研中无人在做）
每篇文章头部/尾部展示结构化的生成信息，例如：
- 模型与版本（「本文由 Claude/GPT-? 于 2026-09 协作生成」）
- 人工投入时长（「作者投入：17 分钟，全部花在选题和删稿上」）——**把「刻意压低人力」从需要遮掩的事实变成站点的签名幽默**，这是「认真对待不认真」最诚实的实现
- prompt/大纲链接（像 commit 记录一样公开）
- token 成本或修订次数
表现形式用等宽字体元数据行（方向 C 的机器层），与宋体正文形成「机器写了 / 人签了字」的双层叙事。

### 7.4 风险与反模式
- **不要全站玩梗**（方向 D 的教训）：反讽会疲劳；主线必须是可以安静阅读两百次的排印。
- **不要 A 方向的「干净」**：与 AI slop 视觉距离太近；至少要做纸色 + 字体双层分工。
- **不要手工插图负担**：图片用抖动位图/生成图 + 统一处理管线，呼应「人力最小化」主题。
- **维护成本约束**：所有设计决定必须兼容「每周两更 + 人工投入最低」——零装饰的列表页（rauchg/宝玉式）+ 高定制的文章页（WiP 式）是最优分工。
- **中英混排**：默认全中文排印规则，西文/数字/代码走独立字体栈与盘古之白。

---

## 附录 A：站点清单总表（全部于 2026-09-08 验证可访问）

| # | 站点 | URL | 类别 | 调研价值 |
|---|------|-----|------|---------|
| 1 | Rauno Freiberg | https://rauno.me | 西方极简/工艺 | 微交互方法论 + 宣言式首页 |
| 2 | Paco Coursey | https://paco.me | 西方极简 | 安静型极简范本 |
| 3 | Josh Comeau | https://www.joshwcomeau.com | 西方极简/交互 | 文章内嵌交互演示 |
| 4 | Anthony Fu | https://antfu.me | 西方极简/双语 | 签名动效 + 双语实践 |
| 5 | Lee Robinson | https://leerob.io | 西方极简 | 产品级干净范式 |
| 6 | Guillermo Rauch | https://rauchg.com | 西方极简 | 零装饰极限 |
| 7 | Derek Sivers | https://sive.rs | 西方极简 | 站点做减法 |
| 8 | Brian Lovin | https://brianlovin.com | 西方极简 | Now 页面传统 |
| 9 | Sam Henri Gold | https://samhenri.gold | 反设计 | 有品味的粗野主义 |
| 10 | Gwern Branwen | https://gwern.net | 学者书卷/AI | 灰阶 + 侧栏注 + 超文本工程 |
| 11 | Maggie Appleton | https://maggieappleton.com | 数字花园/AI | 花园分层 + 手绘 |
| 12 | Simon Willison | https://simonwillison.net | AI 博客 | 实用主义内容范式 |
| 13 | Bret Victor | https://worrydream.com | 交互思想 | 文章即作品 |
| 14 | Daring Fireball | https://daringfireball.net | 经典博客 | 双体裁鼻祖 |
| 15 | kottke.org | https://kottke.org | 经典博客 | 自嘲 footer + 会员制 |
| 16 | iA | https://ia.net | 经典/排印理论 | 排印思想源头 |
| 17 | Motherfucking Website | https://motherfuckingwebsite.com | 文化参照 | 反装饰宣言 |
| 18 | Works in Progress ★ | https://worksinprogress.co | 数字刊物 | **首选模仿对象**（token 已提取） |
| 19 | Stripe Press | https://press.stripe.com | 数字刊物/工艺 | 内容级艺术指导 |
| 20 | Aeon | https://aeon.co | 思想刊物 | 哲学内容沉思排版 |
| 21 | Noema | https://www.noemamag.com | 思想刊物 | Technology & the Human |
| 22 | The Pudding | https://pudding.cool | 视觉随笔 | 数据叙事 |
| 23 | Palladium | https://www.palladiummag.com | 思想刊物 | AI×治理 + 深棕主题色 |
| 24 | Quanta Magazine | https://quantamagazine.org | 科学刊物 | 抽象概念插画 |
| 25 | Asterisk | https://asteriskmag.com | 科学刊物 | 干净编辑设计 |
| 26 | Logic Magazine | https://logicmag.io | 技术批评（存档） | 技术批评编辑语汇 |
| 27 | The New Inquiry | https://thenewinquiry.com | 反讽刊物 | 反讽编辑设计 |
| 28 | Distill | https://distill.pub | AI 期刊（存档） | AI 内容排版金标准 |
| 29 | 端传媒 ★ | https://theinitium.com | 中文刊物 | 中文杂志级排印 |
| 30 | The Type | https://thetype.com | 中文排印 | 权威参考源 |
| 31 | 宝玉的分享 ★ | https://www.baoyu.io | 中文 AI 博客 | 最接近的中文同行（token 已提取） |
| 32 | 广正 | https://guangzhengli.com | 中文双语博客 | 双语实践 |
| 33 | 阮一峰 | https://www.ruanyifeng.com/blog/ | 中文经典 | 周刊体裁 + 原生感 |
| 34 | 云风 | https://blog.codingnow.com | 中文经典 | 时间即设计 |
| 35 | 少数派 | https://sspai.com | 中文媒体 | 中文舒适排印区间 |
| 36 | 挾土秀平 | https://www.syuhei.jp | 日文/工艺 | 纵排 + 手艺感 |
| 37 | ゆたかさをデザインするブログ | https://nagaseyutaka.com | 日文随笔 | 设计而不商业 |
| 38 | Low-tech Magazine (Solar) ★ | https://solar.lowtechmagazine.com | 约束美学 | 抖动位图 + 电池表 |
| 39 | World Fair of Slop ★ | https://slopfair.bisks.net | AI 反讽 | 反面清单（拉丁学名） |
| 40 | vibe-coded.lol ★ | https://vibe-coded.lol | AI 反讽 | AI 美学戏仿标本 |
| 41 | swyx.io | https://www.swyx.io | 西方极简 | Learn in public 定位 |

## 附录 B：延伸资源（入口，未逐一深验）

- **Awwwards Minimal 分类**：https://www.awwwards.com/websites/minimal/ — 持续更新的极简站点画廊
- **MUUUUU.ORG**（日文画廊，ミニマル分类）：https://muuuuu.org/category/taglist/min
- **Sankou!**（日文画廊，シンプル分类）：https://sankoudesign.com/category/simple
- **W3C《中文排版需求》**：https://www.w3.org/TR/clreq/
- **Rauno《Craft》文集**（方法论必读）：https://rauno.me/craft
- **Gwern《Design Of This Website》**（自述设计文档）：https://gwern.net/design
- **Distill《Communicating with Interactive Articles》**：https://distill.pub/2020/communicating-with-interactive-articles/
- **And—Now（WiP 设计方）**：https://and-now.co.uk/work/works-in-progress

## 附录 C：本次调研中未通过验证的站点（避免后续浪费时间的备忘）

- `https://justine.lol`（Justine Tunney）— TLS 证书已过期（2026-06-09 到期），浏览器直连会告警
- `https://www.subtraction.com`（Khoi Vinh）— TLS 握手失败，疑似站点异常
- `https://immmmm.tw`（木木木木木）— 域名已无法解析

---

*本报告由 AI 生成，调研过程中人类投入约等于零次点击「继续」。*
