# 《又是一个ai生成的博客》技术选型调研报告

> - **日期**：2026-09-08
> - **状态**：调研完成，含明确推荐
> - **范围**：静态站点生成器/框架与模板生态、中文网页排印、低成本部署、AI 内容自动化发布流水线
> - **方法**：基于 2025-2026 年公开网络资料的多轮检索与交叉验证（英文技术博客、中文社区实测、官方文档、一手规范）。所有关键论断均附来源链接。

---

## 1. 结论速览

| 维度 | 推荐 | 一句话理由 |
| --- | --- | --- |
| 站点框架 | **Astro 6（纯静态输出）** | 2026 年内容站事实标准；默认零 JS；Content Layer 对 AI 生成内容做 schema 级校验 |
| 主题起点 | **官方 blog 模板 + 自研极简主题**（备选：深度魔改 Fuwari） | "极简但有设计感"没有现成模板；AI 辅助编码时代自研成本已大降 |
| 正文字体 | **系统字体栈**（PingFang SC / MiSans / HarmonyOS Sans / 微软雅黑 / Noto Sans CJK） | 零加载成本、零维护；中文正文 web font 性价比低 |
| 点缀字体（可选） | 霞鹜文楷（LXGW WenKai）构建期子集化，仅用于标题/引用 | OFL 开源、24k+ stars 的文艺楷体；作者自评不适合大段正文，恰好适合做"设计感"点缀 |
| 中英混排 | **构建期 AutoCorrect 规范化 + CSS `text-autospace: normal` 渐进增强** | 双保险：RSS 与旧浏览器靠构建期，新浏览器靠 CSS |
| 版式基线 | 中文正文行高 1.75–1.85、行宽约 35em（30–40 字/行）、字号 16–17px | 中文方块字密实，需要比西文（1.2–1.5）更大的行高 |
| 部署 | **Cloudflare Pages + 自定义域名**（约 ¥60–80/年，唯一硬成本） | 静态资源不限量、500 次构建/月；`*.pages.dev` 虽被 DNS 污染，自定义域名国内多数地区可直连 |
| 评论（可选） | giscus（零维护）或 Waline/Twikoo on Cloudflare Workers（匿名评论） | 评论是博客最大的"维护面"来源，建议后置 |
| 统计（可选） | Cloudflare Web Analytics 或 Umami | 免费、无 cookie、不增加第三方依赖面 |
| 发布流水线 | **GitHub Actions + LLM API，"PR 门禁"起步，目标全自动** | 已有多个 2026 年成熟开源参考实现；质量门禁是全自动的前提 |

**总成本：域名约 ¥60–80/年 + LLM API 每月个位数人民币量级，其余全免费额度内。**

---

## 2. 选型原则：从博客画像推导工程约束

博客画像：**AI 辅助生成内容、markdown 为主要内容格式、每周两更、中文排版一等公民、极简但有设计感、部署维护成本与人的精力投入压到最低、未来发布流程尽量自动化。**

由此推导出六条选型原则（按权重排序）：

1. **内容可迁移性第一**。内容资产（markdown + 朴素 frontmatter）必须与框架解耦。有实测对比六个 SSG 处理同一批 400 篇文章后发现：构建速度是最不重要的差异，而 **frontmatter 可移植性和插件依赖面**才是决定长期成本的因素——"最快但锁死内容的生成器，一次迁移损失的时间超过五年构建节省的时间"（[JVQ 实测](https://jvq.net/i-ran-six-static-site-generators-on-the-same-400-posts.-build-time-wasnt-the-differentiator./)）。
2. **默认零 JS**。极简设计感与性能的最佳交集是"HTML + CSS 为主、按需极少量 JS"。这直接指向 islands 架构类框架。
3. **构建量小，构建速度不敏感**。每周两更、全站几百至一千篇文章的量级，任何 2026 年主流 SSG 的构建时间都在 CI 可接受范围内（数百页站点冷构建从亚秒到几分钟）。Hugo 的速度优势在本场景无实际收益。
4. **排印能力是硬指标**，不是事后补丁（详见第 5 节）。
5. **无服务器、无数据库、免费额度内**，且避免对单一免费平台的深度锁定——静态产物 + 自有域名保证随时可迁。
6. **AI 代理改变了传统选型权衡**。传统中文社区对 Astro 的主要批评是"前端开发者的工具而非写作者的工具、中文教程少、配置复杂"（[知乎 2026 横评](https://zhuanlan.zhihu.com/p/2030368654710321239)）。但本博客的"写作者"是 AI、工程师也是 AI，**工程复杂度成本被 AI 代理吸收**，因此可以选工程上限更高的框架，把收益留给排印、性能与自动化。

---

## 3. 静态站点生成器比较与推荐

### 3.1 2026 年格局

2026 年英文社区的共识相当一致：

- **Astro 是新内容站的默认选择**。"Astro, the default for new content sites in 2026"；个人博客/作品集场景的首要推荐就是 Astro（[2026 SSG Head-to-Head](https://www.youngju.dev/blog/culture/2026-05-14-static-site-generators-2026-hugo-eleventy-astro-mkdocs-docusaurus-mintlify-starlight-comparison-deep-dive.en)、[Gautam Khorana 实测对比](https://gautamkhorana.com/blog/static-site-generators-2026-astro-eleventy-hugo-jekyll-gatsby/)、[Botmonster 2026](https://botmonster.com/web-dev/the-best-static-site-generators-for-your-blog-in-2026/)）。采用方包括 Stripe、Express.js、Mistral AI（[noqta 2026 指南](https://noqta.tn/en/blog/astro-6-content-first-web-framework-developer-guide-2026)）。
- **Hugo 赢在构建速度**：万级页面分钟内完成，单二进制零依赖，但 Go 模板语法小众、现代生态集成偏少。
- **Eleventy 赢在配置极简**：适合"只要 HTML"的极简主义者，但无组件模型、生态小。
- **Gatsby 自 2023 被 Netlify 收购后持续衰退**；**Jekyll 主要残留于 GitHub Pages 老项目**。
- 中文社区：Hexo 仍有存量用户但"技术上已经偏保守，Islands Architecture 这类新概念没有跟进"，千篇以上构建明显变慢（[知乎 2026 横评](https://zhuanlan.zhihu.com/p/2030368654710321239)）；Astro 热度快速增长（[leavescn 选型指南](https://www.leavescn.com/Articles/Content/4011)）；2026 年 CSDN 教程同样以 Astro 为新建博客默认推荐（[CSDN 2026-05](https://blog.csdn.net/qq_73472828/article/details/160987764)）。

### 3.2 候选对比

| 候选 | 定位 | 构建（500 页量级） | 内容模型 | 生态/模板 | 主要短板（针对本博客） |
| --- | --- | --- | --- | --- | --- |
| **Astro 6** | content-first、默认零 JS、islands | 5–10s | Markdown/MDX + Content Layer（类型安全 schema） | 官方 blog 模板 + themes 目录；中文圈 Fuwari(5k★)/Mizuki | 需 Node 工具链；大版本升级有破坏性变更 |
| Hugo | 极速、单二进制 | <1s | Markdown + 短代码 | PaperMod/Stack/Congo/LoveIt 等大量主题 | Go 模板定制成本高；对"设计感自研"不友好 |
| Eleventy 3 | 极简 JS SSG | 2–4s | 任意模板语言 | 主题少、约定少 | 什么都要自己搭；排印/组件生态薄 |
| Hexo | 老牌中文圈 SSG | 慢（千篇级十几秒） | Markdown | 中文教程海量 | 技术保守、架构老化，新项目不推荐 |
| Next.js | 全栈框架 | 30–90s | MDX + RSC | 最大 | 对纯内容博客明显过重，React 运行时随页面下发 |

### 3.3 推荐：Astro 6，理由如下

1. **默认零 JS + islands**：与"极简但有设计感"完全对齐——设计感由 HTML/CSS 承担，不靠 JS 堆砌，Lighthouse 接近满分（[CSDN 2026](https://blog.csdn.net/qq_73472828/article/details/160987764)）。
2. **Content Layer API 是 AI 内容流水线的天然闸门**：所有文章走 Zod schema 校验（title/date/description/tags/category/draft 必填、类型正确），frontmatter 不合格直接构建失败——这对"AI 生成、少人复核"的内容管线是关键安全网（[Astro 6 发布说明](https://astro.build/blog/astro-6/)、[v6 升级指南](https://docs.astro.build/en/guides/upgrade-to/v6/)）。
3. **2026 年活跃度高**：Astro 6 于 2026 年上半年进入稳定（Beta 2026-01、稳定版 2026-02、正式公告 2026-03，[发布博客](https://astro.build/blog/astro-6/)、[noqta 指南](https://noqta.tn/en/blog/astro-6-content-first-web-framework-developer-guide-2026)），带来内置 Fonts API（字体自托管自动化）、CSP API、Live Content Collections（未来接 API/数据库内容源时无需重建）、实验性 Rust 编译器；6.3/6.4 继续快速迭代。框架本身的维护风险低于所有小众候选。
4. **模板生态覆盖两种起步路径**：官方 `npm create astro@latest -- --template blog` 极简起步，或中文社区最流行的 Fuwari/Mizuki（见第 4 节）。
5. **纯静态产物**：`astro build` 输出纯 HTML/CSS/JS，不绑定任何托管平台，满足"随时可迁移"。
6. **markdown 生态可用性**：remark/rehype 插件体系（如 remark-pangu、自定义 container）可直接挂进 Astro 的 markdown 管线，中英混排处理有现成集成点（见 5.4）。

**何时不选 Astro**：若未来想把"极简依赖"推到极致（连 Node 都不要），Hugo 是唯一备选；若站点规模到万页级且高频重建，Hugo 的 5–10 倍构建速度才有意义（[Gautam Khorana](https://gautamkhorana.com/blog/static-site-generators-2026-astro-eleventy-hugo-jekyll-gatsby/)）。两者都不适用于本博客当前画像。

---

## 4. 模板生态与主题起点策略

### 4.1 现状盘点

**Astro 阵营**：

- **官方 blog 模板**：`npm create astro@latest -- --template blog`，最干净的极简起点（Content Collections + RSS 开箱即用）。
- **Fuwari**（[saicaca/fuwari](https://github.com/saicaca/fuwari)，5.0k stars / 1.3k forks，MIT）：中文圈最流行的 Astro 博客模板。Astro + Tailwind + Swup 动画 + Pagefind 搜索 + Expressive Code 代码块 + KaTeX，明暗主题，八语言 README。注意：最后提交为 2025-12，社区 fork 极多但上游维护已放缓。
- **Mizuki**（[matsuzaka-yuki/mizuki](https://gitee.com/matsuzakayuki/Mizuki)，Fuwari 系）：在 Fuwari 基础上做中文化增强——追番页、友链页、日记页、Twikoo 评论、Umami 统计等，功能全但离"极简"更远。
- **AstroPaper** 等国际主题：SEO/无障碍做得好，但西文排印默认值，中文需要自行调整。

**Hugo 阵营**（若走 Hugo 路线）：PaperMod（快、干净、最流行）、Stack（侧边栏 + 封面图）、Congo、LoveIt；文档站则 Hextra（[YakutsukuriYuu 2026 主题推荐](https://yakutsukuriyuu.github.io/posts/2026-05/hugo%E4%B8%BB%E9%A2%98%E6%8E%A8%E8%8D%90)）。

### 4.2 推荐起点策略

**推荐：官方 blog 模板起步，自研极简主题。** 理由：

1. "极简但极具设计感"本质上是**定制需求**，任何现成主题（尤其 Fuwari 系的"圆润可爱风"）都无法直接满足；拿重主题做减法往往比从零做加法更贵。
2. 2026 年用 AI 代理实现一套 Astro 布局 + Tailwind 样式的成本，已经低于理解并魔改一个 5k stars 主题的全部约定。这与本博客"AI 生成"的气质也一致——**模板本身也是 AI 生成的**。
3. 从官方模板起步，依赖面最小（JVQ 的"插件依赖面老化"警告），frontmatter schema 完全自控。

**Fuwari 作为参考实现的价值**：它的 frontmatter 设计（`title/published/description/image/tags/category/draft/pinned/lang`）、Pagefind 搜索集成、Expressive Code 配置是经过大规模中文用户验证的方案，自研时直接借鉴其字段设计即可。若不想自研，深度魔改 Fuwari 是可接受的退路，但要接受 fork 后自维护的现实（上游已 9 个月无提交）。

---

## 5. 中文网页排印最佳实践（本博客的差异化重点）

### 5.1 版式基线

中文是方块字，字符密实、高度一致、无基线变化带来的天然行间空隙，因此**中文行高需求显著高于西文**：

- 西文正文行高约 1.2–1.5；中文需要 **1.5–2.0**（[设计师排版指南](https://zhuanlan.zhihu.com/p/207951692)），社区实测共识"中文正文 line-height 1.5 起跳"（[黑暗执行绪](https://blog.darkthread.net/blog/font-size-n-line-height)）。
- 英文主题的常见默认（21px / 1.5 / 680px 容器）对中文"会觉得字挤在一起喘不过气"——问题通常不在字号而在**行高与行宽**（[imwsz：中文网页排版，从行高开始](https://imwsz.com/posts/chinese-typesetting-on-web)）。
- 同一篇文章只调字号/行高/字距，读者平均停留时间相差约 40%——排版直接影响读完率（[SEM.tw 2026 中文网页排版指南](https://sem.tw/web-design/web-typography-chinese)）。

**建议基线**（综合多来源的工程建议值）：

```css
.prose {
  font-size: 1.0625rem;      /* 17px，可随视口微调 */
  line-height: 1.8;          /* 中文正文 1.75–1.85 */
  max-width: 35em;           /* ≈ 每行 30–40 个汉字 */
  text-align: justify;       /* 中英混排+justify 可接受；嫌两端对齐生硬可改 left */
  text-justify: inter-ideograph; /* 长词收缩优先在字间进行 */
  letter-spacing: 0.02em;    /* 中文可微加字距，慎用 */
}
```

### 5.2 CJK 字体方案

**推荐：正文走系统字体栈，web font 只做点缀。**

```css
font-family:
  system-ui, -apple-system, "Segoe UI",
  "PingFang SC",        /* macOS / iOS */
  "HarmonyOS Sans SC",  /* 华为设备 */
  "MiSans",             /* 小米设备 */
  "Microsoft YaHei",    /* Windows */
  "Noto Sans CJK SC",   /* Linux / Android */
  sans-serif;
```

理由：中文正文 web font 的代价极高——一个覆盖完整的 CJK 字体 WOFF2 压缩后仍有 **4–12MB**（[Toolbox365 字体子集化指南](https://www.toolbox365.net/tutorials/font-subset-unicode-range-and-cjk-strategy/)），而系统字体零加载成本、各家 OS 的中文字体（苹方/鸿蒙/小米兰亭/雅黑）质量都已达标。行业通行做法就是"**正文本地字体，web font 留给标题与品牌元素**"。

**点缀字体推荐霞鹜文楷（LXGW WenKai）**：基于 FONTWORKS Klee One 补全的开源楷体（[lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai)，24.4k stars，SIL OFL 1.1，可免费商用与子集化）。注意作者自评：这款字体"文艺气息"重，**可能不太适合大段正文，更适合中等长度文本或注释**——恰好匹配"标题/引用/题词点缀"的用法。已有现成 webfont 方案（[lxgw-wenkai-webfont](https://github.com/chawyehsu/lxgw-wenkai-webfont)、cdnjs 的 lxgw-wenkai-screen-webfont）与子集托管（ZSFT 字体分享计划），但自托管子集（见 5.3）更可控。

**若坚持全站 web font**（如追求跨平台完全一致的黑体观感）：候选 MiSans、HarmonyOS Sans、Noto Sans SC（Google Fonts 国内不可用，必须自托管）。此时字体加载工程是必答题。

### 5.3 Web 字体加载策略（CJK 专项）

核心问题是把 4–12MB 的整包字体降到可用体积，2026 年有三条成熟路径（[Toolbox365](https://www.toolbox365.net/tutorials/font-subset-unicode-range-and-cjk-strategy/)、[中文网字计划](https://chinese-font.netlify.app/en/post/performace_turbo)）：

1. **构建期全文子集化（静态博客的最优解）**：爬取全站 markdown/HTML，收集所有去重字符 + 常用 3500 字基线 + 标点符号，生成单一子集。一篇中文文章通常只用 600–1500 个去重字符，**子集 WOFF2 仅 30–80KB，比整包小两个数量级**。静态博客"每次发文都重建"的特性恰好化解了"新增字符需重建子集"的缺陷——本来就会重建。工具链：`pyftsubset`（fonttools）或 `cn-font-split`。
2. **unicode-range 分片按需加载（动态内容适用）**：把字体切成 100–250 个分片，浏览器只下载页面实际命中的分片。Google Fonts 对 CJK 就是这么做的。对中文页首屏典型触发 5–15 片（约 200–800KB）。
3. **常用字子集 + 稀有字懒加载**：常载最常用 3000 字（覆盖约 99.5% 阅读量），其余按需补载。

**工具推荐：[cn-font-split](https://github.com/KonghaYao/cn-font-split)（中文网字计划出品，7.0 版 Rust 引擎）**。它的分包策略比朴素均切聪明得多：按语言分段 → 用马尔可夫链预计算的**词共现排序**把高关联字聚到同一分片（避免"性能优化"四个字落在四个分片）→ **渐进式分包**（首包最核心字符，包体逐级增大），2MB 字体处理仅需约 50ms；配套 [vite-plugin-font](https://www.npmjs.com/package/vite-plugin-font) 可嵌入 Vite 系工具链（Astro 底层即 Vite，集成路径成立，落地时需验证插件兼容性）。

配套工程要点（[中文网字计划性能实践](https://chinese-font.netlify.app/en/post/performace_turbo)、[web.dev 字体最佳实践](https://web.dev/articles/font-best-practices)）：

- 只发 WOFF2（Brotli 压缩，比 WOFF 再小 ~30%，支持率 96%+）；
- `font-display: swap`（中文回退字体观感可接受时）或 `optional`（绝不接受排版跳动时）；
- **不要对分片字体用 preload**（会绕过 unicode-range 按需逻辑）；用 `<link rel="preconnect">` 预热 CDN；
- 用 `ascent-override / descent-override` 校准回退字体度量，防 CLS（vite-plugin-font 1.2.0+ 内置中文度量计算）；
- 分片文件名带 hash，CDN 设永久缓存；HTTP/2 或 HTTP/3 必开（分片高并发下载的前提）；
- 子集化时**别忘标点**（`，。「」？！…` 落在子集外会静默回退系统字体，观感割裂），并核对 CJK 扩展区（U+3400–4DBF、U+20000+）与符号区（U+3000–303F）。

另外，Astro 6 新增的内置 **Fonts API** 可自动处理拉丁字体（如正文里的西文/等宽字体）自托管与预加载（[Astro 6 发布说明](https://astro.build/blog/astro-6/)）；CJK 部分按上述策略单独处理。

### 5.4 中英混排处理

中英混排"盘古之白"（中西文间约 1/8 em 间隙）有两条互补路线，**建议两层都做**：

**第一层：CSS `text-autospace`（渐进增强，2025-11 起 Baseline）**

- `text-autospace` 于 **2025 年 11 月成为 Baseline Newly available**：Chrome/Edge 140+、Safari 18.4+ 支持，Firefox 145+ 已正式支持（QQ/UC/三星移动浏览器不支持）；实现约 1/8 em 的中西文间距（[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-autospace)、[Alex Hsu 2026-04](https://alexhsu.com/en/text-autospace)）。
- 关键细节：Chrome 最终按 Safari 的口径**默认不开启**，需显式声明 `text-autospace: normal` 才生效（[Chromium Intent to Ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/gwRvkPJ5pws/m/F3r-VeGoBAAJ)）。
- 但截至 2026-05，跨引擎实现**尚不互操作**：Blink 不支持细分值，Gecko 只支持单独使用细分值，WebKit 只在 alphanumeric 一侧加间隙；W3C i18n 的结论是"现在就把 `text-autospace` 写进 CSS 无害，且会随实现完善而受益"（[W3C: Managing inline spaces in Chinese & Japanese](https://www.w3.org/International/articles/styling/inline-space)）。
- **结论：写上 `text-autospace: normal`，但不指望它单独兜底。**

**第二层：构建期文本规范化（保底，保证 RSS/旧浏览器/邮件端一致）**

- **不推荐 pangu.js 作为主力**：项目长期失修，且已知会在 markdown 语法内部错误插空格（[Issue #127](https://github.com/vinta/pangu.js/issues/127)，[虾说全栈分析](https://xiashuo.xyz/posts/others/blog/blog_format)）。
- **推荐 [AutoCorrect](https://github.com/huacnlee/autocorrect)**（huacnlee/Rust）：面向 CJK 的 linter + formatter，自动处理中西文间距、全半角标点、重复标点等，有 CLI、GitHub Action、pre-commit 集成，中文社区实测效果优于 pangu（[菠菜眾長](https://lruihao.cn/posts/markdownlint)）。作为 CI 门禁或 remark 阶段运行均可；也可用 [remark-pangu](https://github.com/vincentbel/remark-pangu) / [remark-copywriting-correct](https://github.com/Ir1d/remark-copywriting-correct) 挂进 Astro 的 markdown 管线（选其一，注意校验其不会破坏 markdown 语法）。
- 这一层对"AI 生成内容"格外有价值：LLM 输出的标点全半角混用是高频问题，AutoCorrect 在管线里自动消化。

**标点挤压（`text-spacing-trim`）**：CJK 标点连续出现时的间隙压缩。目前仅 Blink 系支持（Chrome/Edge 123+），Firefox/Safari 未实现，且依赖字体的 OpenType 特性（[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-spacing-trim)、[W3C](https://www.w3.org/International/articles/styling/inline-space)）。**不作为依赖项**，写了也无害，随浏览器进步自然生效。

---

## 6. 低成本部署方案

### 6.1 平台对比（2026 年免费额度）

| 平台 | 免费额度 | 国内可访问性 | 备注 |
| --- | --- | --- | --- |
| **Cloudflare Pages** | **静态请求/带宽不限量**，500 次构建/月，100 项目/账号；Functions 走 Workers 免费层（10 万请求/天）（[Limits 文档](https://developers.cloudflare.com/pages/platform/limits)、[2026 实测](https://temps.sh/blog/cloudflare-pages-free-tier-limits-2026)） | `*.pages.dev` 被 DNS 污染不可用；**自定义域名 + CF 代理国内多数地区可直连**，实测优于 Vercel（[BMPI](https://www.bmpi.dev/dev/guide-to-setup-blog-site-with-zero-cost/5/)） | Workers Static Assets 是其新形态，Pages 继续可用 |
| Vercel (Hobby) | 100GB 带宽/月（[2026 定价分析](https://schematichq.com/blog/vercel-pricing)） | `*.vercel.app` 被墙；自定义域名需绕行（常见做法是域名托管 Cloudflare 做 CNAME/优选，[PID0 2026-04](https://blog.pid0.cn/posts/site-ops/vercel-cloudflare-china)、[CSDN 2026-04](https://blog.csdn.net/qq_57376018/article/details/160097635)） | 开发体验最佳，但对纯静态站无决定性优势 |
| GitHub Pages | 免费（软限制：仓库 1GB、带宽 100GB/月） | 可访问但速度慢且不稳定（[BMPI](https://www.bmpi.dev/dev/guide-to-setup-blog-site-with-zero-cost/5/)、[hsingko](https://hsingko.pages.dev/post/2023/01/03/migrate-to-cloudflare-pages)） | 构建需 GitHub Actions（公共仓库免费分钟数不限） |
| Netlify (Free) | **2026 年已改为 300 积分/月池化计费**（约等于 15GB 带宽或 20 次部署，新账号口径；[netli.fyi 2026-07](https://netli.fyi/blog/netlify-free-plan-limits-2026)） | 国内访问差（BMPI 旧方案中即为瓶颈） | 免费档持续收紧，不推荐作为新站首选 |

### 6.2 推荐架构与国内可访问性

**推荐：Cloudflare Pages + 自定义域名（免备案海外托管）。**

- **唯一必要付费项**：一个域名（.com/.dev 等，年费约 ¥60–80；建议同时作为品牌资产长期持有）。域名 DNS 托管在 Cloudflare（免费），站点构建于 Cloudflare Pages，git push 自动部署。
- **备案问题**：内容托管在海外（Cloudflare 边缘）**无需 ICP 备案**；只有使用覆盖中国大陆的 CDN 加速才必须备案，且备案要求域名与服务器都在国内体系内（[BMPI 备案分析](https://www.bmpi.dev/dev/guide-to-setup-blog-site-with-zero-cost/5/)）。备案 + 国内 CDN（阿里云/腾讯云）能换来大陆访问速度，但带来年费、实名、内容审查与流程维护——与"人的精力投入压到最低"冲突，**不推荐**。
- **接受的现实**：无备案方案下，国内不同地区/运营商访问海外节点速度波动。缓解手段是**把页面做轻**（纯静态 + 系统字体或 30–80KB 字体子集 + Astro 内置图片优化/懒加载，单页目标 < 300KB），让"没有国内 CDN"的影响降到最低。这是低成本与可维护性的最优折中。
- **升级路径**（未来若需要）：geo-DNS 双线（国内备案 CDN + 海外 Cloudflare，BMPI 方案），或 Cloudflare SaaS 回源 + Worker 的自定义域代理方案（[Deep Router 2026-01](https://deeprouter.org/article/cloudflare-saas-worker-custom-domain-pages-proxy-guide)）。静态产物不改一行即可迁移。

### 6.3 附属系统（评论/统计/图片）

这些系统的共同原则：**每个都是维护面，能晚则晚，能省则省。**

- **评论**：中文博客三大主流是 giscus（GitHub Discussions 存储，零后端零维护，但要求评论者有 GitHub 账号）、Waline 与 Twikoo（支持昵称+邮箱匿名评论，需自部署后端，可跑在 Vercel/Cloudflare Workers 免费层）。长期试用过多款评论系统的博主最终选择 Twikoo（[Dejavu](https://blog.dejavu.moe/posts/the-comment-system-of-static-websites)）；无服务器资源且在意国内访问的用户选 giscus（[燊的博客](https://yzs020220.github.io/posts/44102)）。Astro 集成方案均有成熟教程（含 View Transitions 兼容问题处理，[Easton 指南](https://eastondev.com/blog/zh/posts/dev/20251204-astro-comment-systems-guide)）。**建议：上线后视需求再加，首选 giscus（维护成本为零）**。
- **统计**：Cloudflare Web Analytics（免费、无 cookie、与托管同平台，零额外依赖）或 Umami（开源自托管/云免费层；Fuwari/Mizuki 生态常用）。避免 Google Analytics（国内加载问题 + 隐私体积负担）。
- **图片**：直接放仓库 `src/assets/`，用 Astro 内置 `<Image>` 组件构建期生成多格式/多尺寸（sharp）。不用图床、不用第三方 CDN，少一个故障域。

---

## 7. AI 内容自动化发布流水线

### 7.1 架构原则（从 2026 年成熟参考实现提炼）

2026 年"AI 自动写博客"已出现多个开源全流程实现（多为小型实验项目、star 数不高、成熟度有限），其架构模式值得借鉴：[aitoblog](https://github.com/alfred-intelligence/aitoblog/blob/main/README.md)（Astro + Cloudflare Pages + GitHub Actions cron + Claude 结构化输出，与本博客定位几乎一致）、[Content Autopilot](https://jonesrussell.github.io/blog/content-autopilot/)（Hugo + CI 中 headless Claude Code，全自动无人工）、[blogging-agent](https://github.com/vipulawl/blogging-agent)（多代理：选题→写作→编辑→PR，GSC/GA4 数据回流）、[blog-pipeline](https://github.com/nometria/blog-pipeline)（7 遍处理 + 去 AI 味 humanizer + 质量审计门）。共同模式：

1. **Markdown in Git 是唯一真相**：所有产物（文章、状态、账本）都是仓库文件，可审查、可回滚、可迁移。
2. **LLM API 只在管线的一个环节出现**：选题与写作可以 AI，发布与否由确定性规则决定。
3. **每个阶段都有说"不"的权利**："Zero-touch doesn't mean zero judgment; it means the judgment has to be encoded into the pipeline"——全自动的安全性来自把人的判断编码进门禁，而不是删掉门禁（[Content Autopilot](https://jonesrussell.github.io/blog/content-autopilot/)）。

### 7.2 三档方案（建议按此路线演进）

**档位 A：人工辅助（起步基线）**
人与 AI 协作产出 markdown → `git push` → Cloudflare Pages 自动构建发布。发布链路即 `git push`，零额外建设。

**档位 B：PR 门禁（1 个月内目标）——推荐稳定态**

```
选题（人工 issue 或 AI 选题代理）
  → GitHub Actions（cron 每周 2 次或 issue 触发）
  → LLM 结构化输出（Zod schema：frontmatter + 正文）
  → 规范化：AutoCorrect（盘古之白/标点）+ markdownlint
  → 质量门禁（见 7.3）
  → 开 PR（含预览部署链接）
  → 人工点合并 → Cloudflare Pages 自动发布 → RSS/sitemap 更新
```

参考：devgenius.io 的自动化实践（拉取已发文章做 gap 分析 → 生成 → 封面图 → 开 PR + 预览部署，"AI 干重活，人保持控制"），已观察到 ChatGPT 引荐流量（[Automating Markdown-Based Blogs](https://blog.devgenius.io/automating-markdown-based-blogs-with-github-actions-and-ai-28d14c695335)）。

**档位 C：全自动（质量稳定后的目标态）**
所有门禁通过后自动 merge/push，无人工环节。aitoblog 与 Content Autopilot 均以此模式生产运行。前提是 7.3 的门禁全部就位且人工抽检合格率稳定。

### 7.3 质量门禁清单（全自动的前提）

| 门禁 | 做什么 | 参考 |
| --- | --- | --- |
| **Schema 门禁** | frontmatter 过 Zod 校验，类型/必填不对即构建失败 | Astro Content Layer（构建即校验） |
| **去重门禁** | 新选题/新文与已发文章做 Jaccard 相似度检查（阈值 ~0.8），近重复直接拦截 | blogging-agent（指纹去重，无需向量库） |
| **构建门禁** | `astro build` 失败则永不提交——坏 frontmatter/坏链接止步于 CI | Content Autopilot 的 build gate |
| **防 AI 味门禁** | 确定性 lint：禁词表（"值得注意的是/综上所述/delve/tapestry"类套话）、句长方差、被动语态密度 | blog-pipeline 的 humanizer；Content Autopilot 的 slop gate |
| **事实核验门禁**（可选） | 文中引用的代码/API/事实必须回源验证，验证不了就不发 | Content Autopilot 的 verify 步骤（引用代码先 `gh api` 读源文件） |
| **账本防重发** | `posted.json`/ledger 记录已处理选题 + 冷却期（如 60 天），防止重复发文 | aitoblog 的 cooldown 设计 |
| **失败告警** | 流水线失败自动开 issue，避免 cron 静默死亡 | Content Autopilot 的 alert 步骤 |

### 7.4 工程细节与已知坑

- **GitHub Actions 定时任务会在公共仓库 60 天无活动后自动禁用**（[GitHub Docs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows)）。好消息：全自动流水线本身持续产生提交，天然满足活跃条件；档位 B 阶段若两个月没发文章，需要 push 任意提交或手动 re-enable。
- **并发保护**：`concurrency: publish` 防止两次运行竞写（aitoblog 实践）。
- **Workflow 权限**：仓库设置里开启 Read and write permissions，`GITHUB_TOKEN` 才能提交（aitoblog 部署文档）。
- **API Key**：LLM key 放 GitHub Secrets；公共仓库注意 Actions 日志不回显。
- **每篇保留 AI 生成声明**：frontmatter 标记 + 页面/页脚声明（见第 8 节）。
- **成本量级**（粗估）：每周 2 篇约 2000 字文章，含选题与修订的输入输出 token，用 Sonnet 级模型约每月 $1–5；GitHub Actions 对公共仓库免费；Cloudflare Pages 免费层内。**全链路月成本个位数人民币。**

### 7.5 中文生态旁证

中文世界同类实践多面向微信公众号（如 [TrendPublish](https://github.com/liyown/ai-trend-publish)：多源抓取 + DeepSeek/千问生成 + 定时发布公众号），平台化色彩重。面向自有域名的个人博客，GitHub Actions + 静态站的 GitOps 路线（英文社区已验证）更适合本博客的可控性与成本要求。

---

## 8. 合规与伦理注意

- 中国四部门《人工智能生成合成内容标识办法》已于 **2025-09-01 施行**，要求"服务提供者"对 AI 生成内容添加显式/隐式标识，用户通过传播服务发布 AI 生成内容时应主动声明（[网信办原文](https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm)）。个人博客通常不构成办法规制的"网络信息服务提供者"，但**主动标识是零成本的最佳实践**——而且本博客的名字《又是一个ai生成的博客》本身就是最彻底的显式声明。
- 建议落实为工程约定：frontmatter 增加 `ai_generated: true`（或 `ai_assisted` 程度分级）字段，文章页渲染统一声明；转载或人工深度改写的内容相应标注。这与 aitoblog 的做法一致（每篇 footer + 正文声明双重披露）。
- 伦理面：AI 生成内容的质量责任最终在作者，第 7.3 节的门禁（尤其事实核验）既是工程要求也是内容诚信要求。

---

## 9. 最终推荐与实施路线图

**推荐组合**：

> **Astro 6（静态输出）· 官方 blog 模板起步的自研极简主题 · 系统字体栈 + 霞鹜文楷点缀（可选，构建期子集化）· AutoCorrect 构建期规范化 + `text-autospace` CSS 增强 · Cloudflare Pages + 自定义域名（免备案）· GitHub Actions + LLM API 的 PR 门禁式发布流水线（演进至全自动）· 可选：giscus 评论 + Cloudflare Web Analytics**

**路线图**：

| 阶段 | 内容 | 验收标准 |
| --- | --- | --- |
| **Phase 0（第 1 周）** | 仓库初始化；官方模板跑通；接 Cloudflare Pages；域名解析；排印基线 CSS（行高/行宽/系统字体栈 + text-autospace） | 线上可访问，Lighthouse 移动端 95+ |
| **Phase 1（第 2–3 周）** | 极简主题自研（首页/文章页/归档/关于）；AutoCorrect 进 CI；RSS/sitemap/OG 图；`text-autospace` 与构建期规范化双落地 | 首篇文章全排印细节达标（中西文间距、标点、代码块） |
| **Phase 2（第 4 周）** | 流水线 v1：issue 手动触发 → LLM 生成 → 门禁（schema/构建/去重/禁词）→ PR | 一条命令产出可审 PR，人只做 merge |
| **Phase 3（持续）** | cron 定时化（每周 2 次）；逐步放开自动 merge；加评论/统计；监测国内访问质量 | 连续 4 周无人值守发布成功率 100%，抽检合格率达标后进入全自动 |

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| Astro 大版本升级破坏性变更（v6 移除 legacy collections、Node 22+ 等先例，[迁移实录](https://harshil.dev/writings/migrating-astro-5-to-astro-6/)） | 升级成本 | 内容（markdown）与代码彻底分离；依赖锁定 + 定期小步升级，不跨大版本积压 |
| 社区主题上游失修（Fuwari 已 9 个月无提交） | 主题功能/安全停滞 | 本方案以自研主题规避；若用 Fuwari 则 fork 自维护 |
| 免费平台政策变化（Netlify 2026 收紧为先例） | 被迫迁移 | 纯静态产物 + 自有域名 + CI 在 GitHub Actions，任意静态托管可 30 分钟内完成迁移 |
| 国内访问波动（DNS 污染范围、Cloudflare 路由变化） | 读者可达性 | 页面极致轻量化；保留 geo-DNS 双线升级路径（6.2） |
| AI 内容质量滑坡/同质化 | 博客信誉 | 7.3 门禁 + 人工抽检节奏；AI 声明透明化 |
| 定时任务静默失效（60 天规则） | 断更且无感知 | 失败开 issue 告警 + 简单 uptime 检查（RSS 最近更新时间） |
| 单一 LLM 供应商涨价/停服 | 流水线中断 | LLM 调用层抽象（OpenAI 兼容接口），可一键切换供应商 |

---

## 参考来源

**SSG 格局与 Astro 6**

- [Static Site Generators 2026 Head-to-Head — youngju.dev](https://www.youngju.dev/blog/culture/2026-05-14-static-site-generators-2026-hugo-eleventy-astro-mkdocs-docusaurus-mintlify-starlight-comparison-deep-dive.en)
- [Static site generators in 2026: the honest comparison — Gautam Khorana](https://gautamkhorana.com/blog/static-site-generators-2026-astro-eleventy-hugo-jekyll-gatsby/)
- [I Ran Six Static Site Generators on the Same 400 Posts — JVQ.net](https://jvq.net/i-ran-six-static-site-generators-on-the-same-400-posts.-build-time-wasnt-the-differentiator./)
- [Astro 6.0 发布博客](https://astro.build/blog/astro-6/) ｜ [Astro 6.0.0 Release Notes](https://github.com/withastro/astro/releases/tag/astro@6.0.0) ｜ [v6 升级指南](https://docs.astro.build/en/guides/upgrade-to/v6/) ｜ [Astro 6 开发者指南 — noqta.tn](https://noqta.tn/en/blog/astro-6-content-first-web-framework-developer-guide-2026) ｜ [迁移实录 — harshil.dev](https://harshil.dev/writings/migrating-astro-5-to-astro-6/)
- [2026年静态博客生成器横评 — 知乎](https://zhuanlan.zhihu.com/p/2030368654710321239) ｜ [静态博客系统推荐 — leavescn](https://www.leavescn.com/Articles/Content/4011) ｜ [Hexo vs Halo — halo.run](https://www.halo.run/archives/halo-hexo-static-blog-comparison)

**模板生态**

- [saicaca/fuwari](https://github.com/saicaca/fuwari) ｜ [Mizuki（Gitee 镜像 README）](https://gitee.com/matsuzakayuki/Mizuki) ｜ [Hugo 主题推荐 — YakutsukuriYuu](https://yakutsukuriyuu.github.io/posts/2026-05/hugo%E4%B8%BB%E9%A2%98%E6%8E%A8%E8%8D%90)

**中文排印**

- [中文网字计划：中文 Web Font 优化实践](https://chinese-font.netlify.app/en/post/performace_turbo) ｜ [cn-font-split 三大核心策略](https://chinese-font.netlify.app/en/post/performance_chars) ｜ [KonghaYao/cn-font-split](https://github.com/KonghaYao/cn-font-split)
- [Font subsetting: 12MB CJK font as 50KB per page — Toolbox365](https://www.toolbox365.net/tutorials/font-subset-unicode-range-and-cjk-strategy/)
- [web.dev: Best practices for fonts](https://web.dev/articles/font-best-practices)
- [MDN: text-autospace](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-autospace) ｜ [MDN: text-spacing-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-spacing-trim) ｜ [W3C i18n: Managing inline spaces in Chinese & Japanese](https://www.w3.org/International/articles/styling/inline-space) ｜ [Chromium Intent to Ship: text-autospace](https://groups.google.com/a/chromium.org/g/blink-dev/c/gwRvkPJ5pws/m/F3r-VeGoBAAJ) ｜ [Auto-spacing between Chinese and English — Alex Hsu](https://alexhsu.com/en/text-autospace)
- [lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai) ｜ [lxgw-wenkai-webfont](https://github.com/chawyehsu/lxgw-wenkai-webfont)
- [huacnlee/autocorrect](https://github.com/huacnlee/autocorrect) ｜ [pangu.js 替代分析 — 菠菜眾長](https://lruihao.cn/posts/markdownlint) ｜ [虾说全栈：中文博客格式](https://xiashuo.xyz/posts/others/blog/blog_format) ｜ [vincentbel/remark-pangu](https://github.com/vincentbel/remark-pangu)
- [设计师字体与排版指南 — 知乎](https://zhuanlan.zhihu.com/p/207951692) ｜ [中文网页排版，从行高开始 — imwsz](https://imwsz.com/posts/chinese-typesetting-on-web) ｜ [網頁排版與可讀性 — 黑暗執行緒](https://blog.darkthread.net/blog/font-size-n-line-height) ｜ [SEM.tw 中文排版指南](https://sem.tw/web-design/web-typography-chinese)

**部署**

- [Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits) ｜ [Cloudflare Pages Free Tier 2026 — temps.sh](https://temps.sh/blog/cloudflare-pages-free-tier-limits-2026)
- [Netlify Free Plan 2026: 300 credits — netli.fyi](https://netli.fyi/blog/netlify-free-plan-limits-2026)
- [Vercel Pricing 2026 — Schematic](https://schematichq.com/blog/vercel-pricing)
- [BMPI：零成本搭建现代博客之优化国内访问速度](https://www.bmpi.dev/dev/guide-to-setup-blog-site-with-zero-cost/5/) ｜ [Vercel + Cloudflare 国内加速 — PID0](https://blog.pid0.cn/posts/site-ops/vercel-cloudflare-china) ｜ [Cloudflare SaaS 回源方案 — Deep Router](https://deeprouter.org/article/cloudflare-saas-worker-custom-domain-pages-proxy-guide) ｜ [*.pages.dev 被墙讨论 — LINUX DO](https://linux.do/t/topic/201766)
- [Giscus/Waline/Twikoo for Astro — Easton](https://eastondev.com/blog/zh/posts/dev/20251204-astro-comment-systems-guide) ｜ [静态网站评论系统选型 — Dejavu](https://blog.dejavu.moe/posts/the-comment-system-of-static-websites)

**AI 发布流水线**

- [alfred-intelligence/aitoblog](https://github.com/alfred-intelligence/aitoblog/blob/main/README.md)（Astro + Cloudflare Pages + Actions cron 全自动）
- [The pipeline that writes this blog — Content Autopilot](https://jonesrussell.github.io/blog/content-autopilot/) ｜ [vipulawl/blogging-agent](https://github.com/vipulawl/blogging-agent) ｜ [nometria/blog-pipeline](https://github.com/nometria/blog-pipeline)
- [Automating Markdown-Based Blogs with GitHub Actions and AI — devgenius.io](https://blog.devgenius.io/automating-markdown-based-blogs-with-github-actions-and-ai-28d14c695335)
- [GitHub Docs: 禁用与启用 workflow（60 天规则）](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows)
- [TrendPublish（中文公众号生态旁证）](https://github.com/liyown/ai-trend-publish)

**合规**

- [《人工智能生成合成内容标识办法》— 网信办](https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm) ｜ [答记者问](https://www.cac.gov.cn/2025-03/14/c_1743654685896173.htm) ｜ [工信部新闻稿](https://www.miit.gov.cn/xwfb/mtbd/wzbd/art/2025/art_5e46c60f9a7141cdb584eb139f476ce9.html)
