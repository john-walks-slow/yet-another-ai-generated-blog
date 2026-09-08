# 《又是一个ai生成的博客》v2 动效技术选型调研报告

> - **日期**：2026-09-08
> - **状态**：调研完成，含明确推荐
> - **范围**：Web 平台原生动效能力（View Transitions / scroll-driven / @starting-style / linear() 等）、动效库生态（GSAP / Lenis / Motion / anime.js 及 2026 新工具）、静态站动效工程模式（Astro 落地）、文字类动效与 CJK 约束、性能与无障碍基线
> - **方法**：多引擎检索（Degoog / Exa / Firecrawl）+ 官方文档一手核对（MDN、Chrome for Developers、WebKit、Astro、webstatus.dev API）+ npm registry 版本核对。浏览器支持矩阵以 webstatus.dev（基于 MDN BCD）与 caniuse 交叉验证；所有关键论断附来源链接，时效以「截至 2026-09-08」为准。
> - **输入**：[技术选型调研](260908-tech-stack.research.md)（Astro 6 + Cloudflare 底座已定） · [设计灵感调研](260908-design-inspiration.research.md)（rauno 微交互 taxonomy、antfu 签名动效范本）
> - **立场声明**：本报告取代 v1 方案 §4.4「零动效也是立场」——v2 转向「技术极简主义 + 前卫动效」，动效本身即是炫技对象；但 v1 的两条底线不动：**Lighthouse 95+ 的性能预算**与 **prefers-reduced-motion 无障碍基线**。荧光划线与侧栏批注的显示方式按站长要求保留。

---

## 1. 结论速览

| 维度 | 推荐 | 一句话理由 |
| --- | --- | --- |
| **总策略** | **CSS-first 渐进增强：0 JS 优先，JS 只为 CSS 做不到的效果留口** | 2026 年原生能力已覆盖本站 90% 动效需求；「零框架零库」本身就是最高级的技术力炫耀 |
| 路由转场 | **原生跨文档 View Transitions**（`@view-transition` 一行 CSS，零 JS） | Chrome/Edge/Safari 已支持，Firefox 未上但降级＝普通导航，是教科书级渐进增强；Astro 官方自己也把这条路线定为未来方向 |
| 共享元素 morph | `view-transition-name`（构建期静态命名，零 JS） | 列表标题 → 文章标题的形变是「页面级炫技」最佳单品，纯 CSS 实现 |
| 滚动动效 | **CSS scroll-driven animations** + `@supports` 守卫 | 合成器线程执行、滚动零卡顿；Firefox 157（2026-09-29 发布）后全引擎绿 |
| 入场动效 | **`@starting-style` + transition**，构建期词级拆分（`Intl.Segmenter`）+ CSS stagger | 零 JS 的首帧入场；Baseline 已两年；逐字分裂被禁（下行） |
| 文字 decode/scramble | **自研 ~1KB JS 岛屿**（等宽拉丁字符池） | 全站唯一必需 JS 的动效；GSAP ScrambleText 虽已免费，但为它引入 27KB 不值 |
| 逐字 span 分裂 | **禁止**（改用 clip-path 行遮罩 / 词级 stagger） | 2026-02 读屏实测翻车：多数读屏组合下逐字朗读（详见 §6.2） |
| 可变字体动效 | **只动拉丁/等宽「机器层」的 wght 轴**；CJK 用静态子集不参与 | `font-variation-settings` 动画＝每帧重光栅化（paint 级成本）；CJK 可变字体区域版仍要 4MB+，与 30–80KB 静态子集差两个数量级 |
| 缓动 | **`linear()`** 全局缓动 token | 锐利、可程序生成、可复现——「缓动也是代码」，与机器美学同构 |
| 滚动库（Lenis 等） | **不引入** | 滚动劫持与纯阅读站冲突；SDA 已在合成器线程覆盖滚动效果 |
| GSAP / Motion / anime.js | **当前都不引入**（保留为升级路径） | 无时间线编排、无 React 岛屿需求；引入即破坏「0 库」预算 |
| reduced-motion | 三层守卫范式（opt-in 包裹 / VT 伪元素覆写 / JS skip） | VT 与 SDA 都不会自动尊重该偏好，必须显式处理 |
| JS 预算 | 动效相关客户端 JS ≤ **3KB gz**（一个 scramble 岛屿） | 对比：GSAP core 27KB、Motion hybrid 18KB、Lenis 3KB |

**一句话**：让浏览器替你做动画（VT/SDA/@starting-style/linear() 都是浏览器原生合成器能力），JS 只留一个 1KB 的 scramble 彩蛋——「机器在写字」的观感，用机器（浏览器）本来的方式实现。

---

## 2. 从项目约束推导动效工程原则

v2 的画像：**技术极简主义（冷、黑白、无衬线、尖锐）、用动效炫耀高技术力、前卫转场；中文为主（CJK 排印约束仍在）；Astro 6 纯静态 + Cloudflare Workers 静态资产；Lighthouse 95+、单页轻量；prefers-reduced-motion 基线**。由此推导五条原则：

1. **渐进增强是唯一正确的架构**，不是可选项。静态站没有 SSR 兜底、没有水合框架，任何动效能力都必须回答「不支持时用户看到什么」。原生 VT/SDA 的降级行为（普通导航 / 静态内容）恰好是完美答案（[GoogleChrome 官方指引](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/cross-document-transitions.md)：「Limited browser support is not a reason to avoid adoption」）。
2. **性能预算倒逼「0 库」**。单页 < 300KB 总预算（v1 既定）里，字体子集已占 100–200KB；留给动效的空间是 CSS ≤ 10KB gz 增量 + JS ≤ 3KB gz。任何动画库（GSAP 27KB / Motion 18KB）一进来就是预算的一半以上。
3. **动效必须「有名字」**。设计灵感调研引 rauno《Invisible Details of Interaction Design》的微交互 taxonomy（Responsive Gestures / Fluid Morphing / Scroll Landmarks……）——「能说清为什么存在的动效」才配出现在这个站上（[设计灵感调研 §2.1](260908-design-inspiration.research.md)）。
4. **一个签名动效 > 满页普通动效**。antfu.me 的主题切换圆形扩散（clip-path 从点击处展开）是被广泛模仿的范本（[设计灵感调研 §2.4](260908-design-inspiration.research.md)）；v2 应该有 1–2 个「只有这个站才有」的签名级动效，其余全部克制。
5. **无障碍是地板不是天花板**。reduced-motion 全覆盖（§7.3）+ 不做任何破坏读屏的 DOM 结构（§6.2）——这两条同时满足，Lighthouse A11y 95+ 与「认真对待不认真」的姿态才成立。

---

## 3. Web 平台原生动效能力：2026-09 支持矩阵与正确用法

### 3.1 支持矩阵总表（截至 2026-09-08，[webstatus.dev](https://webstatus.dev/features/view-transitions) / [caniuse](https://caniuse.com/wf-scroll-driven-animations) 交叉验证）

| 能力 | Chrome/Edge | Safari | Firefox | Baseline 状态 | 本站定位 |
| --- | --- | --- | --- | --- | --- |
| **View Transitions（同文档）** | 111（2023-03） | 18.0（2024-09） | **144（2025-10-14）** | Newly 2025-10 | SPA 模式才用；本站不依赖 |
| **View Transitions（跨文档 `@view-transition`）** | 126（2024-06-11） | 18.2（2024-12-11） | **未支持**（开发中） | Limited | **主力：路由转场**，降级无害 |
| **CSS scroll-driven animations**（`animation-timeline` / `scroll()` / `view()`） | 115（2023-07-18） | **26.0（2025-09-15）** | flag only；**157（2026-09-29 发布）起默认开启** | 未 Baseline；Interop 2026 重点项；caniuse ~85.4%（2026-08） | **主力：滚动动效**，`@supports` 守卫 |
| **`@starting-style`** | 117（2023-09） | 17.5（2024-05） | 129（2024-08-06） | Newly 2024-08（已两年，实践当全绿） | **主力：入场动效** |
| **`transition-behavior: allow-discrete`** | 117（2023-09） | 17.4（2024-03） | 129（2024-08-06） | Newly 2024-08 | 配套 `@starting-style` 做 display/层顶进出 |
| **`linear()` 缓动** | 113（2023-05） | 17.2（2023-12） | 112（2023-05） | **Widely available（2026-06 起）** | **主力：全局缓动** |
| **`interpolate-size` / `calc-size()`**（动画到 `height: auto`） | 129（2024-09-17） | 未支持 | 未支持 | Limited（Chromium only） | 渐进增强；折叠面板等，配 grid 0fr→1fr 兜底 |
| CSS anchor positioning（顺带） | 125+（2024-05） | 26（2025-09） | 2025-12 起 shipping | Newly 2026 | 侧栏批注/脚注浮层定位的候补，非动效本体 |

数据来源：同文档 VT 与 @starting-style、transition-behavior、interpolate-size 取自 [webstatus.dev API](https://webstatus.dev/features/view-transitions)（基于 MDN BCD，2026-09-08 查询）；跨文档 VT 取自 [webstatus: cross-document-view-transitions](https://webstatus.dev/features/cross-document-view-transitions) 与 [Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)；SDA 取自 [webstatus: scroll-driven-animations](https://webstatus.dev/features/scroll-driven-animations)、[caniuse](https://caniuse.com/wf-scroll-driven-animations)、[WebKit 官方博客](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)；Firefox 157 发布日取自 [MDN Firefox 157 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157)（Nightly，2026-09-29 转 release）；linear() 取自 [MDN linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear) 与 [lunchboxhands: CSS Easing Functions Explained](https://lunchboxhands.com/blog/css-easing-functions-explained)（「reached Baseline Widely Available in June 2026」）；anchor positioning 取自 [OddBird（规范作者）2025-10](https://www.oddbird.net/2025/10/13/anchor-position-area-update) 与 [TestMu 2026-05](https://www.testmuai.com/learning-hub/css-anchor-positioning-browser-support)。

**采用率旁证**（Chrome 遥测，2026-09 查询，[webstatus](https://webstatus.dev/features/cross-document-view-transitions)）：跨文档 VT 已出现在约 **0.12%** 的 Chrome 日页面加载中（同文档 VT 仅 0.011%，`interpolate-size` 0.11%）——跨文档 VT 是当前增长最快的原生动效能力，值得押注。

### 3.2 View Transitions API：跨文档才是静态站的正解

**工作原理**：浏览器截取旧页快照 → 导航 → 新页渲染后截取新快照 → 在 `::view-transition-old/new/group` 伪元素树上做动画（本质是浏览器替你做 FLIP）。MPA 模式下不需要任何 `startViewTransition` 调用，触发器就是普通的同源导航（[Chrome for Developers: Cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)）。

**启用方式（一行 CSS，放进共享布局）**：

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}
```

**硬性限制（全部来自 [Chrome 官方文档](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) 与 [WICG explainer](https://github.com/WICG/view-transitions/blob/main/cross-doc-explainer.md)，2026-08 更新版）**：

- 仅 **same-origin** 导航，且不能含跨源重定向；
- **两端页面都必须 opt-in**（都有 `@view-transition` 规则）——这反而是特性：404 页、RSS 跳转页可以单方面不参与；
- 只覆盖用户从页面内容发起的 `push`/`replace`/`traverse`（链接点击、前进后退）；**地址栏、书签、刷新、`location.href` 程序跳转、POST 表单都不触发**（[CSS-Tricks 2026-05](https://css-tricks.com/cross-document-view-transitions-part-1/)：「你不会想要一次正在创建支付的 POST 请求还带着花哨的 cross-fade」）；
- Chrome 126 起仅主框架导航（iframe 内不触发）；
- **约 4 秒超时**：导航+渲染超过即 `TimeoutError` 跳过转场（静态站 + Cloudflare 边缘 TTFB 极低，几乎不会触发）；
- 旧的 `<meta name="view-transition" content="same-origin">` 写法**已废弃**，别从旧教程复制（[CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-1/)）。

**已知坑与正确姿势**：

1. **转场目标是「未渲染完成的新页」时会闪无样式页**——新页关键资源（CSS、首屏 DOM）没就绪，morph 会动画到错误位置或回退字体。官方对策：保持 render-blocking 资源精简，必要时用 `<script blocking="render">` / `<link blocking="render">` 显式阻塞（[GoogleChrome modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/consistent-cross-document-transitions.md)，标注 MANDATORY）。
2. **`view-transition-name` 同页必须唯一**，重复命名会导致转场被跳过（[W3C CSS View Transitions L1](https://www.w3.org/TR/2024/CRD-css-view-transitions-1-20240328/)：skip 条件之一）；没有任何命名元素时退化为纯 crossfade，不报错（[Chrome: Misconceptions about view transitions](https://developer.chrome.com/blog/view-transitions-misconceptions)，2024-07）。
3. **命名元素越多，快照内存与开销越大**——每个命名元素都要分配 GPU 快照纹理。命名克制：本站只需要站名、文章标题、等宽元数据条三五个。
4. **伪元素不吃页面样式**，必须用 `::view-transition-old/new(name)` 单独定制（[MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)）。
5. 进阶控制：`pageswap`（旧页卸载前）/ `pagereveal`（新页首次渲染机会，含 BFCache 恢复）事件可按来源/去向动态命名、跳过或换风格（[WICG explainer](https://github.com/WICG/view-transitions/blob/main/cross-doc-explainer.md)）；`@view-transition { types: previous }` 配合 `:active-view-transition-type()` 可做前进/后退方向差。本站 P0 不需要，P2 再说。

**性能特性**：VT 动画跑在合成器上（transform/opacity 子树），对主线程零占用；代价只在截图阶段（一次性）。Firefox 未支持时＝普通导航，**没有任何功能损失**——这就是把它定为主力的原因。

### 3.3 CSS scroll-driven animations：滚动效果的「正确答案」

**能力面**：`animation-timeline: scroll()`（滚动进度）与 `view()`（元素进出视口）两类时间线 + 具名 `scroll-timeline`/`view-timeline` + `animation-range`（entry/exit/contain/cover 细分区间）+ `timeline-scope`（跨层级引用具名时间线）。典型用法：阅读进度条、粘性头、滚动 reveal、视差（[MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)、[WebKit 官方指南 2025-06](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)）。

**性能特性（这是它碾压 JS 滚动库的原因）**：动画声明在前、由合成器驱动，滚动时**不碰主线程**——Chrome 文档把这点列为头号收益，Safari 26.4 也已把 SDA 移到合成器线程（[whoooop 2026-08-31](https://whoooop.co.uk/blog/css-scroll-driven-animations)、[Code With Seb 2026-08-28](https://www.codewithseb.com/blog/scroll-driven-animations-progressive-enhancement-guide)）。对比 JS 方案：每个滚动回调都要跑 listener → 改 DOM → style/layout 重算，全在主线程。

**Firefox 现状（本节最重要的时效信息）**：稳定版仍需 flag（`layout.css.scroll-driven-animations.enabled`，仅 Nightly 默认开）；**Firefox 157 将于 2026-09-29 发布并默认开启**（[MDN Firefox 157 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157)；[Code With Seb 2026-08](https://www.codewithseb.com/blog/scroll-driven-animations-progressive-enhancement-guide) 引 caniuse「Firefox 157 cutover」）。SDA 是 **Interop 2026 点名重点项**，是各引擎承诺收敛的最强信号（[whoooop 2026-08-31](https://whoooop.co.uk/blog/css-scroll-driven-animations)）。**即：本报告落笔三周后，SDA 全引擎绿。**

**已知坑**：

1. **`overflow: hidden` 会创建滚动容器**——`scroll(nearest)`/`view()` 会解析到这个「永远不滚」的祖先，动画永不推进；还顺带弄坏 `position: sticky`。**解法：用 `overflow: clip`**（视觉等价、不创建滚动容器）（[Carmen Ansio 2026-04](https://www.carmenansio.com/articles/variable-font-scroll/)，实操级好文）。
2. **`animation` 简写会重置 `animation-timeline`**（reset-only 子成员）——必须把 `animation-timeline` 声明在 `animation` 之后（[MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)）。
3. **`@supports` 守卫的 Firefox 陷阱**：开了 flag 的 Firefox 里 `@supports (animation-timeline: scroll())` 返回 true，普通 Firefox 返回 false——守卫本身工作正常，但测试时要用未动 flag 的 stock Firefox 验证降级路径（[css-scroll-driven.com 2026-07](https://www.css-scroll-driven.com/core-animation-fundamentals-browser-mechanics/browser-support-progressive-enhancement/)）。
4. **入场 reveal 的正确写法**：基准状态＝内容可见；动画只写在 `@supports (animation-timeline: view())` 里。不支持的环境（当前 Firefox）直接看到静态内容，而不是「内容被藏起来等一个不会来的动画」（[whoooop](https://whoooop.co.uk/blog/css-scroll-driven-animations)：「enhance with it, do not depend on it」——承重结构如导航可见性不要押在 SDA 上）。

**本站用法定位**：装饰性滚动效果（进度条、归档列表 reveal、粘性元素）用它；任何「不可用就丢功能」的场景不用它。

### 3.4 `@starting-style` + `allow-discrete`：入场/离场动画的 CSS 化

这对组合（Baseline 2024-08-06，[web.dev: Now in Baseline — animating entry effects](https://web.dev/blog/baseline-entry-animations)）解决了 CSS 动画的两个历史死角：

- **`@starting-style`**：定义元素**首次渲染**时的起始样式——首次进入 DOM、从 `display: none` 显现、进入 top-layer（dialog/popover）都能有 transition 而不是瞬现。也适用于页面首次加载，等于「零 JS 的 load 入场动画」。
- **`transition-behavior: allow-discrete`**：让 `display`、`visibility` 这类离散属性参与 transition（在 50% 处翻转而非 0%），配合 `@starting-style` 实现「消失动画」——以前必须 JS 延迟移除 DOM，现在纯 CSS。

**已知坑**（[web.dev](https://web.dev/blog/baseline-entry-animations)）：

1. `transition-behavior` 写在 `transition` 简写**之前**会被忽略——要么用简写内联（`transition: translate .7s ease-out, display .7s allow-discrete`），要么把长放写在简写后；
2. 出场动画依赖 `display` 可过渡 + top-layer 的 `overlay` 属性，当时尚未全部 Baseline——dialog/popover 的完整进出组合需逐项验证；
3. **与跨文档 VT 的叠加问题**（本站特有，未在文献中充分讨论，列为 QA 项）：VT 导航时新页元素同样会触发 `@starting-style` 入场——两层动画可能互相打架。对策：入场 stagger 只用于首屏 hero 或干脆用 VT 的 root 动画统一承担「页面进入」语义，`@starting-style` 只做元素级（划线、元数据条）微入场，并在 QA 中专门过一遍组合观感。

### 3.5 `linear()`：把缓动变成代码

`linear()` 用一串「点 + 进度」定义分段线性缓动，可以在纯 CSS 里表达弹簧、bounce、锐利的「机械」曲线（[Chrome for Developers: css-linear-easing-function](https://developer.chrome.com/docs/css-ui/css-linear-easing-function)、[modern-css.com: Custom CSS Easing with linear()](https://modern-css.com/custom-easing-without-cubic-bezier-guessing)）。Baseline Widely available（2026-06，[lunchboxhands](https://lunchboxhands.com/blog/css-easing-functions-explained)），无兼容顾虑。

**对本站的价值是美学同构**：技术极简主义的缓动应该像它出自编译器——短促、可预测、无弹性滥用。建议把 2–3 条 `linear()` 曲线做成 design token（如 `--ease-sharp`、`--ease-out-quad` 近似），全站复用；需要弹簧感时用生成器产出曲线再贴进 token，而不是引 GSAP。

### 3.6 `interpolate-size`：`height: auto` 动画（Chromium-only，观望）

让 `height: auto`/`max-content` 等关键字可插值（Chrome 129 起，Safari/Firefox 未上，[webstatus](https://webstatus.dev/features/interpolate-size)）。本站若有折叠面板/脚注展开，用 `grid-template-rows: 0fr → 1fr` 的通用技巧兜底，`interpolate-size` 作为增强叠上即可。

---

## 4. 动效库生态与选型（截至 2026-09）

### 4.1 总表

| 库 | 当前版本（发布时间） | 许可 | 体积（gz） | 维护状态 | 对本站的价值 |
| --- | --- | --- | --- | --- | --- |
| **GSAP** | 3.15.0（2026-04，npm） | GreenSock「standard no-charge」**非 OSI** | core ~27KB；+ScrollTrigger ~12KB | 活跃；原 GreenSock 团队在 Webflow 全职维护 | 复杂时间线/SVG/scrub 才值得；当前无此需求 |
| **Motion**（ex-Framer Motion） | 13.x（13.0 于 2026-08-05，npm latest 13.2.0） | MIT（核心） | `animate` mini 2.3KB / hybrid 18KB；React `motion` 34KB（LazyMotion 可压到 4.6KB 初始） | 极活跃（npm 周下载 ~1830 万，2026-09-06 当周）；Matt Perry 独立运营 | React 岛屿场景；本站无 React |
| **Lenis** | 1.3.26（2026-08，npm） | MIT | ~3KB | 活跃（darkroom.engineering） | 滚动劫持，与阅读站冲突，不引入 |
| **anime.js** | 4.5.0（2026-06，npm） | MIT | v4 模块化 ESM，按需 tree-shake | 活跃（Julian Garnier） | 轻量备胎；无差异化能力，不引入 |
| tailwindcss-motion（Rombo） | 1.1.1 | MIT | ~5KB（CSS） | 一般 | 依赖 Tailwind，本站不用 Tailwind |
| Velocity.js / React Transition Group / Popmotion | — | — | — | **停止维护/被吸收** | 排除 |

来源：npm registry（2026-09-08 查询 gsap/lenis/animejs/motion 元数据）；体积取 [adamarant: Immersive web stack in 2026（2026-05-28）](https://adamarant.com/en/blog/immersive-web-stack-in-2026-lenis-gsap-and-what-to-skip)（Lenis ~3KB / GSAP core ~27KB / ScrollTrigger ~12KB / Motion ~30KB React）与 [PkgPulse 对比](https://www.pkgpulse.com/compare/framer-motion-vs-gsap)（gsap 26.7KB gz）；Motion 体积取 [官方文档](https://motion.dev/docs/react-reduce-bundle-size) 与 [animate 文档](https://motion.dev/docs/animate)；死亡名单取 [daily.dev 2026 更新注记](https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024/) 与 [LogRocket 2026 对比](https://blog.logrocket.com/best-react-animation-libraries/)。

### 4.2 GSAP：免费了，但「免费」不是引入的理由

- **2024 年末被 Webflow 收购**；**2025-04-30 起全部免费**——core + 所有原 Club 付费插件（SplitText、ScrambleText、MorphSVG、DrawSVG、ScrollSmoother、Flip…）一并开放（[Webflow 官方公告](https://webflow.com/blog/gsap-becomes-free)、[Webflow Help Center](https://help.webflow.com/hc/en-us/articles/40538857574419-Use-GSAP-in-Webflow)、[GSAP 3.13 发布说明](https://gsap.com/blog/3-13/)）。此后仍在迭代（3.14、3.15，[发布归档](https://gsap.com/blog/archive/)），原团队全职维护（[adamarant 2026-05](https://adamarant.com/en/blog/immersive-web-stack-in-2026-lenis-gsap-and-what-to-skip)）。官方口径运行在 1200 万+ 站点上（[GSAP README](https://github.com/greensock/GSAP)）。
- **许可细节**：npm license 字段为 GreenSock 自家的「standard no-charge」许可（[npm](https://www.npmjs.com/package/gsap)），**不是 MIT/OSI 开源**——免费商用但条款自定，依赖面评估时要点名这一点（Motion 官方也拿这个做对比，见 [迁移指南](https://motion.dev/docs/migrate-from-gsap-to-motion)）。
- **对本站结论**：GSAP 的不可替代区是**复杂时间线编排、SVG 形变、scrub 类滚动叙事**——即「广告公司作品集」需求。本站要的锐利小动效用 CSS 全部覆盖；27KB core + 12KB ScrollTrigger 的预算占比（约 13% 单页预算）买不来对应收益。**保留为升级路径**：若未来要做滚动叙事长文（AI 主题天然适合），届时 GSAP + ScrollSmoother 是正确选择。

### 4.3 Motion（motion.dev）：独立后的 2026 格局

- Framer Motion 于 2024-11 独立为 **Motion**（Matt Perry），`framer-motion` 成为 `motion/react` 的别名；2025 年推出 Motion for Vue；2026-08 发布 **13.0**（[独立宣言](https://motion.dev/magazine/framer-motion-is-now-independent-introducing-motion)、[changelog](https://motion.dev/changelog)、npm 周下载 ~1830 万〔2026-09-06 当周，npm downloads API〕）。
- 2026 年的两件大事：**`animateView()` 于 2026-06 进入核心免费**——View Transition API 的工程化包装（自动生成/回收 `view-transition-name`、`.new()/.old()` 分层配置、`.layout()` 自定义尺寸位移动画、`.class()` 打 `view-transition-class` 标签、分组自动裁切）（[changelog 12.41.0](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)、[motion.dev 首页公告「A View Transition API for the rest of us」2026-06-30](https://motion.dev/)）；**Motion UI 于 2026-07 发布**——React 成品动效组件库（[motion.dev](https://motion.dev/)）。
- 商业模型：核心 MIT + **Motion+**（£299 一次性，410+ 示例/高级 API/AI Kit，[motion.dev/plus](https://motion.dev/plus)）。
- **对本站结论**：Motion 是「React 岛屿上的动效」最优解（mini `animate` 仅 2.3KB），但本站 v2 计划里没有 React 岛屿。**若未来某篇文章需要内嵌交互 demo（Josh Comeau 式），Motion mini 是那时的第一选择**——2.3KB 的按需岛，不破坏全局预算。

### 4.4 Lenis：好库，但与「阅读站」相性不合

Lenis（darkroom.engineering，MIT，~3KB gz，v1.3.26 / 2026-08 仍活跃，[GitHub](https://github.com/darkroomengineering/lenis)、[lenis.dev](https://lenis.dev)）是 2026 年 WebGL/视差站的事实标准平滑滚动（与 GSAP ScrollTrigger 是经典组合，[adamarant](https://adamarant.com/en/blog/immersive-web-stack-in-2026-lenis-gsap-and-what-to-skip)）。值得记录的两个事实：它**默认尊重 `prefers-reduced-motion`**（reduce 时 lerp 强制为 1、程序滚动直跳，[README](https://github.com/darkroomengineering/lenis)）；体量极小。

**不引入的理由**：平滑滚动的本质是接管用户的滚轮输入——对以「读字」为核心体验的中文博客，它与原生滚动的肌肉记忆、与 SDA 的原生滚动进度、与无障碍（前庭障碍用户即便没开 reduce 也可能被平滑滚动困扰）三方冲突。SDA 已经在合成器线程把「滚动驱动的动效」做完了，Lenis 提供的「质感增益」不值 3KB + 一个行为变量。锚点跳转的平滑用原生 `scroll-behavior: smooth`（同样包在 no-preference 里）即可。

### 4.5 anime.js v4

4.5.0（2026-06）—— v4 是 ESM 模块化重写，可 tree-shake，新增 text/splitText 相关模块（[npm](https://www.npmjs.com/package/animejs)、[animejs.com](https://animejs.com)）。MIT、活跃。它填补的「轻量 + 时间线」生态位对本站仍然不构成需求（轻量侧有原生 CSS，复杂侧有 GSAP），**不引入，知悉即可**。

### 4.6 「不用库」本身是论点

2026 年的动效选型常识已经收敛为「能 CSS 就 CSS」：PkgPulse 的年度指南设有专门的 **When Not to Use a Library** 一节——「For hover states, toggles, and simple transitions between two CSS states, CSS transitions and CSS animations are the right tool… adding Framer Motion for this is a measurable performance regression」（[PkgPulse 2026](https://www.pkgpulse.com/guides/best-react-animation-libraries-2026)）；行业清单同步在做减法——Velocity.js 数年无实质提交、Popmotion 已被吸收（[daily.dev「What changed」注记](https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024/)），React Transition Group 被作者标注不再维护（[LogRocket 2026](https://blog.logrocket.com/best-react-animation-libraries/)）。对本站，「零库」还叠加一层语义：**一个以「机器排版」自居的站，动效应该由平台原语构成**——这既是工程判断也是姿态。

---

## 5. 静态站 / SSG 架构下的动效工程模式（Astro 6 落地）

### 5.1 两条路线，选原生那条

Astro 官方当前文档把路由动效分成两条路（[View transitions 指南](https://docs.astro.build/en/guides/view-transitions/)）：

| | 路线 A：**原生跨文档 VT（推荐）** | 路线 B：`<ClientRouter />`（SPA 模式） |
| --- | --- | --- |
| JS 成本 | **0**（纯 CSS opt-in） | 注入客户端路由器（拦截 a 点击/表单、fetch 新页、swap DOM） |
| 转场能力 | 跨文档 VT（Chrome/Edge/Safari；Firefox 降级为普通导航） | 同文档 VT + 非 VT 浏览器的 `animate` 模拟回退 |
| 独有能力 | — | `transition:persist`（跨页保活元素/岛屿状态）、共享 window 状态、表单 POST 也有转场、`fallback` 三档控制 |
| 脚本语义 | **每次导航都是真实页面加载**，脚本天然重跑 | 模块脚本只执行一次，须挂 `astro:page-load` 等生命周期事件重初始化 |
| 无障碍 | 需手写 reduced-motion 守卫 | **自动**：检测到 reduce 时禁用全部转场动画直接换 DOM；内置路由播报器（aria-live assertive，title→h1→pathname） |
| 官方态度 | 「浏览器原生、不增加任何 JS」（[Astro 官方博客](https://astro.build/blog/future-of-astro-zero-js-view-transitions/)），文档明言 ClientRouter「将越来越不必要」 | 保留，为 persist 等增强功能服务 |

**判定**：本站没有音频播放器、没有跨页共享状态、没有 POST 表单——`transition:persist` 的全部用例都不存在（原生跨文档 VT 至今不支持 persist，[Astro 博客](https://astro.build/blog/future-of-astro-zero-js-view-transitions/)）。**选路线 A**：一行 `@view-transition` 进共享布局，Firefox 用户（暂时）得到普通导航，功能零损失。这同时保住了「每次导航都是真实加载」的脚本语义——不需要任何生命周期胶水，**v1 的零 JS 架构在路由层原封不动**。

ClientRouter 留作升级路径：未来若真需要 persist（如全站音乐播放器——不太可能）或 Firefox 长期不上跨文档 VT 且转场成为刚需，再切换，切换成本是删一行 CSS 加一个组件。

### 5.2 落地清单（路线 A）

```
src/
├── styles/global.css        # @view-transition + reduced-motion 守卫 + ::view-transition-* 定制
├── layouts/Base.astro       # 共享 <head>（VT 两端 opt-in 的保证）
├── components/
│   ├── PostList.astro       # 列表项：style={`view-transition-name: post-${slug}`}（构建期唯一命名）
│   └── PostHeader.astro     # 文章页 h1：同名 post-{slug} → 点击即 morph
└── scripts/scramble.ts      # 唯一的动效岛屿（~1KB，见 §6.4）
```

要点：

1. **`@view-transition` 必须两端都有** → 放进全局 CSS（所有页面共享），404 等不想要的页面单独覆盖 `navigation: none`；
2. **共享元素命名在构建期完成**：Astro 模板里给列表标题和文章标题输出同一个 `view-transition-name: post-{slug}`——静态 HTML 天然满足「同页唯一」（slug 唯一），**零 JS 的列表→文章 morph**。这是「高技术力观感/零客户端成本」比值最高的一件事；
3. **root 动画定制**：默认 crossfade 约 0.25s；本站应改为短促的、带方向感的自定义（如 `linear(0, 0.6 40%, 1)` 的 160ms 直切感），用 `::view-transition-old(root)/new(root)` 覆写；
4. **防闪无样式页**：保持单 CSS 文件 + render-blocking（默认行为）即可；Cloudflare 边缘静态资产 TTFB 低，4s 超时形同虚设（[GoogleChrome 指引](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/consistent-cross-document-transitions.md)）；
5. **Astro 作用域样式与 VT 无冲突**（伪元素树是运行时构造，`::view-transition-*` 写在全局样式里即可）；Astro 的 `transition:*` 指令体系属于 ClientRouter，路线 A 不用；
6. **与 SDA 共存**：跨文档 VT 与滚动驱动动画互不干扰（一个管导航、一个管滚动），但都各自需要 reduced-motion 守卫（§7.3）。

### 5.3 岛屿与脚本生命周期（路线 A 下几乎不存在）

不用 ClientRouter 时没有 `astro:page-load` / `astro:after-swap` 这些事件——因为不需要：每次导航是真实加载，`<script>` 天然重跑（这正是 [Astro 文档](https://docs.astro.build/en/guides/view-transitions/)描述 ClientRouter 时警告的那些「脚本不再重跑」的坑，全部不适用于路线 A）。scramble 岛屿就是一个普通的模块脚本，挂载即跑，无生命周期管理成本。

### 5.4 渐进增强分层（每层都完整可用）

| 层 | 技术 | 不支持时 |
| --- | --- | --- |
| **L0** | 纯 HTML/CSS，内容全部可见可读 | — （地板） |
| **L1** | `transition` + `linear()`（hover/焦点/划线生长） | 瞬时切换 |
| **L2a** | 跨文档 VT（路由转场/morph） | 普通导航 |
| **L2b** | SDA（进度条/滚动 reveal）+ `@starting-style`（入场） | 静态呈现（Firefox SDA 至 2026-09-29） |
| **L3** | scramble 岛屿（~1KB JS） | 直接渲染最终文本 |

验收口径：**关掉 L2/L3 的每一层，站点的功能与内容完整性都不变**——这是对「Lighthouse 95+ 且无障碍」最硬的保证。

---

## 6. 文字类动效与 CJK 约束

### 6.1 效果盘点与可行性结论

| 效果 | 技术路径 | CJK 可行性 | 结论 |
| --- | --- | --- | --- |
| 逐字入场（stagger） | span 拆分 + CSS delay | 技术可行、**读屏不可接受**（§6.2） | ❌ 改用下行替代 |
| **行/块遮罩 reveal**（terminal wipe） | `clip-path` / `overflow` 遮罩在**未拆分**的文本上 | ✅ 完美（不动 DOM） | ✅ **主力入场动效**——顺带最有「机器在输出」的气质 |
| 词级 stagger | 构建期 `Intl.Segmenter` 分词 + span | ✅（需分词，见 6.3） | ✅ 可用，须做读屏自测 |
| decode/scramble | JS（自研 ~1KB 或 GSAP ScrambleText） | 拉丁池 ✅ / 汉字池 ⚠️ | ✅ **只上等宽拉丁机器层**（§6.4） |
| 打字机 + 光标 | JS 或 `steps()` + 等宽 | ✅（等宽层） | ✅ 可选彩蛋 |
| 可变字体 wght 动效 | `font-variation-settings` / `font-weight` 过渡 | 拉丁 ✅ / CJK ❌（体积） | ✅ **只上机器层**（§6.5） |
| 荧光划线生长（保留项） | `background-size`/`background-position` 过渡或 `linear-gradient` 遮罩 | ✅ | ✅ v1 既定语法的动效化，纯 CSS |

### 6.2 无障碍雷区：2026 年最重要的一条调研结论

**逐字 span 分裂（包括 GSAP SplitText 的默认 aria 方案）在读屏下不可靠，2026-02 被系统实测否决**：

- Adrian Roselli（无障碍领域权威）2026-02-05 实测 GSAP SplitText 官方 demo：**8 组读屏/浏览器配对里只有 2 组**（NVDA+Firefox、TalkBack+Chrome）正确播报为完整词句，JAWS/Chrome、Narrator/Edge、VoiceOver macOS/Safari、Orca/Firefox、TalkBack/Firefox、VO iPadOS/Safari 全部逐字朗读或不播报（[Roselli 原文](http://adrianroselli.com/2026/02/you-know-what-just-dont-split-words-into-letters.html)，2026-04-01 更新；对应 [GSAP issue #642](https://github.com/greensock/GSAP/issues/642)）。
- 技术根因：SplitText 把 `aria-label` 打在容器上、子元素 `aria-hidden`——但 `aria-label` 在 generic role（如 `div`）上按 ARIA 规范是禁止的；且 `aria-label` 不随用户语言自动翻译。GSAP（Cassie Evans）已回应并在改进文档（[issue 跟评](https://github.com/greensock/GSAP/issues/642)）。
- 行业跟进：Unicorn Club 2026-02-21 的建议是「**没有读屏测试通过的证据，就禁止逐字 DOM 分裂进主分支**」；正确替代＝**clip-path/遮罩 reveal（不碰 DOM）、词/句级 stagger、或容器级动画**（[Unicorn Club](https://unicornclub.dev/articles/2026-02-21-text-animations-breaking-screen-readers/)；[theAdhocracy 2026-03](https://theadhocracy.co.uk/wrote/just-dont-split-words-into-letters)）。
- **关键认知**：`prefers-reduced-motion` 解决的是「动不动」，读屏问题解决的是「DOM 还能不能读」——**两件事正交**，做了 reduced-motion 不等于文字动画无障碍（[Unicorn Club](https://unicornclub.dev/articles/2026-02-21-text-animations-breaking-screen-readers/)）。

**对本站的直接规定**：① 一切「逐字入场」需求改用**未拆分文本上的 clip-path/遮罩动画**（横向 wipe 或逐行上推，配 `overflow: clip`）——观感上更「终端输出」，且 DOM 完好；② 若个别场景要词级 stagger，构建期拆分 + 上线前用 NVDA+Chrome 与 VO+Safari 两组实测；③ 正文（含侧栏注、荧光划线句）**永远不做任何拆分动画**。

### 6.3 CJK 特有约束（逐字/词级动画的真坑）

1. **无空格 → words/lines 语义失效**。GSAP SplitText 对无空格文本（日文实测，中文同理）把整段当「一个词」，**行检测直接失效**；chars 模式可用（其字符切分是 emoji-safe 的 code point 级）（[GSAP 论坛实测帖 2024-11](https://gsap.com/community/forums/topic/42903-splittext-with-nested-elements-and-japanese-chars/)；SplitText 为中文专门提供 `prepareText` 钩子，[官方文档](https://gsap.com/docs/v3/Plugins/SplitText/)）。本站若做词级拆分，**用 Node 内置的 `Intl.Segmenter('zh', { granularity: 'word' })` 在构建期分词**（[MDN Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)）——零依赖的中文分词标准答案。
2. **`inline-block` 原子化会破坏 CJK 行禁则**。逐字 span 后，浏览器不再应用「行首禁则」（句号/逗号不得出现在行首的规则可能在原子内联间失效），多行中文标题可能出现行首标点。对策：动效只上**单行标题**；多行文本用遮罩整行（不拆）。
3. **两端对齐正文与原子内联不相容**。`text-justify: inter-character` 的字间调整不作用于 inline-block 盒子——**justify 正文永不做拆分动画**（v1 排印基线：正文 justify + inter-ideograph）。
4. **`text-autospace` 的跨 span 行为需实测**。v1 已定「构建期 AutoCorrect 保底 + CSS 增强」双保险（[技术选型调研 §5.4](260908-tech-stack.research.md)）；动画标题里的 span 边界处自动间距实现可能不一致，QA 项。
5. **scramble 字符池 ⊆ 字体子集**，否则乱码字符直接 tofu（子集外的字静默回退系统字体，观感割裂——[技术选型调研 §5.3](260908-tech-stack.research.md) 的老问题在动效里复活）。
6. **DOM 膨胀**：一个 20 字标题 20 个 span 没问题；一篇 3000 字文章就是 3000+ 节点——文字动画止步于标题/元数据层。

### 6.4 decode/scramble：全站唯一 JS 动效，只上等宽拉丁层

- **实现**：自研 ~40 行（rAF 循环 + 字符池逐位解锁），零依赖 ~1KB gz。GSAP ScrambleTextPlugin 已随 3.13 免费（[GSAP 3.13 发布说明](https://gsap.com/blog/3-13/)），但为这一个效果引入 27KB core 不成立。**scramble 的字符池限制在 `A-Z0-9#%&@$` 一类等宽拉丁符号**——理由有三：与「机器层＝等宽」的 v2 语义完全一致；避开 CJK 字符池的 tofu 风险与视觉噪音（满屏乱跳的汉字可读性干扰远大于拉丁符号）；等宽字体下字符宽度恒定，布局零抖动。
- **典型用法**：文章页等宽元数据条（`2026-09-05 · 8 MIN · #哲学`）在页面进入时 300ms 内逐位解码；reduced-motion 下直接呈现终态。
- **CJK 标题的对应观感**用「遮罩 wipe + 逐行上推」实现（§6.2），不与 scramble 混用。

### 6.5 可变字体动效：机器层的专属玩具

**性能本质**：`font-variation-settings`（及 `font-weight`）动画**不是合成器动画**——每个中间值都是不同的字形轮廓，浏览器必须逐帧重插值 + 重光栅化（paint 级，若轴影响步进宽度还触发 layout）。标题尺寸的文本块每帧 repaint 约 8–14ms，60fps 预算 16.6ms 之下余量很小；中端手机上肉眼可见掉帧（[WFO: Animating Font Weight with Variable Fonts](https://web-font-optimization.com/typography-fundamentals-system-architecture/variable-font-axis-tuning/animating-font-weight-with-variable-fonts/)、[Stack Overflow 实测](https://stackoverflow.com/questions/74111171/reduce-css-layout-and-repaint-for-variable-font-animation)）。

**正确的克制姿势**（同上来源 + [FontLab 2026-02](https://blog.fontlab.com/2026/02/03/animating-font-variation-settings/) + [animationpatterns.art 2026-05](https://animationpatterns.art/animations/variable-font-weight-morph/)）：

- 只动**小段文本**（按钮标签、等宽元数据、站名 logo），不动整段；
- **预留轨道**：用 `min-width`/固定 inline track 预留最宽帧，杜绝 wght 变化引发的邻域回流（CLS）；
- hover 一次性动画 OK；**循环/滚动连续驱动慎用**（累计成本）；确需连续时用 `steps(40)` 把每帧重光栅化降为 40 档（[SO](https://stackoverflow.com/questions/74111171/reduce-css-layout-and-repaint-for-variable-font-animation)），离屏时用 IntersectionObserver 暂停（[FontLab](https://blog.fontlab.com/2026/02/03/animating-font-variation-settings/)）；
- `font-variation-settings` 做 transition 需先 `@property` 注册数值型自定义属性，否则字符串不可插值、动画静默失败（Chrome 85+/Firefox 128+/Safari 16.4+，[WFO](https://web-font-optimization.com/typography-fundamentals-system-architecture/variable-font-axis-tuning/animating-font-weight-with-variable-fonts/)）；
- **门控 `document.fonts.ready`**：字体没加载完别动画（回退字体没有轴）；
- 轴宽不变重时优先 `GRAD`（grade）轴——改变视觉密度但不改变步进宽度，天生无回流（[MDN Variable fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts)）。

**CJK 的判决**：中文字重可变化不划算——思源黑体可变版把 7 个字重合并后**区域子集仍要 4.1MB WOFF2**（日文子集实测；[Adobe 官方博客 2021](https://blog.adobe.com/en/publish/2021/04/08/source-han-sans-goes-variable)），而本站静态单字重子集只要 30–80KB（[Toolbox365](https://www.toolbox365.net/tutorials/font-subset-unicode-range-and-cjk-strategy/)）——差两个数量级，且 CJK 正文本来就走系统字体栈（[技术选型调研 §5.2](260908-tech-stack.research.md)）。**结论：wght 动效只发生在拉丁/等宽机器层**（JetBrains Mono VF 之类拉丁等宽可变字体，子集后体积与静态字重同量级；西文系统字体也多为可变字体，`font-weight` 数值过渡多数平台直接生效）。滚动驱动的 VF 动效（sticky + `view-timeline` + `animation-range: contain`，配 `overflow: clip` 防滚动容器陷阱）作为 P2 彩蛋，模式参考 [Carmen Ansio 2026-04](https://www.carmenansio.com/articles/variable-font-scroll/)。

---

## 7. 性能与无障碍基线

### 7.1 合成层纪律

- **白名单**：`transform`（translate/scale/rotate）、`opacity`——合成器执行，主线程零成本；`filter`/`backdrop-filter` 谨慎（合成器可跑但代价高）；**`font-variation-settings`/`font-weight`/`background`/`width/height` 全是 paint 或 layout 级**，只允许小面积短时使用（§6.5）；
- VT 与 SDA 的动画部分原生跑在合成器（§3.2/§3.3），这是「炫技还不掉帧」的底气；
- `will-change` 克制使用：它强制 layer 提升，滥用＝内存膨胀；短动画不需要它（[MDN will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)）；
- 布局抖动（layout thrashing）在本方案里基本不存在——没有每帧读 DOM 的 JS 动画是「0 库」路线的隐藏红利。

### 7.2 CLS 与「入场动画不藏内容」原则

- 一切 reveal 的基准态＝**内容可见**，动画只在 `@supports`/`no-preference` 守卫内叠加（§3.3 坑 4、§5.4 分层）——既是渐进增强也是 CLS 保险；
- 字体 swap 与入场动画错峰：`document.fonts.ready` 后再加动画类（§6.5）；CJK 系统字体正文天然零 swap 风险（[Penchan 2026-05](https://penchan.co/en/ai/coding/cjk-font-performance/)）；
- VT 的 morph 目标（标题等）避免布局依赖注入：morph 前后同名字符串长度不同属正常，浏览器做的是快照形变，不产生 CLS。

### 7.3 prefers-reduced-motion 的正确处理范式（三层守卫）

**平台不会替你做**：跨文档 VT 与 SDA 都**不会**因用户开了 reduce 而自动停（Chrome 官方明确要求开发者自己处理，[Chrome: Misconceptions about view transitions](https://developer.chrome.com/blog/view-transitions-misconceptions)）。三层守卫全上：

```css
/* 第一层：opt-in 反向包裹——一切「非必需动效」的开关 */
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
  .reveal { /* SDA 入场、scramble 触发类、wght 动效…… */ }
}

/* 第二层：VT 伪元素兜底覆写（万一某处 VT 在 reduce 下仍触发） */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;  /* 0.01ms 而非 0：保住 animationend 事件管线 */
    animation-delay: 0ms !important;
  }
}

/* 第三层（SDA 专属）：animation 简写不清 animation-timeline，需显式归位 */
@media (prefers-reduced-motion: reduce) {
  @supports (animation-timeline: scroll()) {
    .scroll-fx { animation: none; animation-timeline: auto; }
  }
}
```

（范式来源：[GoogleChrome modern-web-guidance（标注 MANDATORY）](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/consistent-cross-document-transitions.md)、[CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-1/)、[css-scroll-driven.com 的 reduced-motion 专题 2026-06](https://www.css-scroll-driven.com/accessibility-inclusive-motion-standards/implementing-prefers-reduced-motion/how-to-respect-prefers-reduced-motion-in-css/)——后者还给出 JS 侧规范：同文档 VT 应 `matchMedia` 后直接不调 `startViewTransition`，省掉 GPU 快照分配。）

**库的行为备忘**（本站不用，但记录基线）：Lenis 默认尊重（[README](https://github.com/darkroomengineering/lenis)）；Astro ClientRouter 自动禁用全部转场（[官方文档](https://docs.astro.build/en/guides/view-transitions/)）；GSAP 用 `gsap.matchMedia()`（[a11y 资源页](https://gsap.com/resources/a11y/)）；Motion 有 `reducedMotion` 配置。**本站路线 A + 零库 = 只需维护上面 15 行 CSS。**

**再强调一次正交性**（§6.2）：reduced-motion 管「动不动」，DOM 结构管「读屏能不能读」——本站的不拆分原则让后者天然达标。

### 7.4 性能预算与 Lighthouse 95+ 论证

| 项 | 预算 | 实际占用（本方案） |
| --- | --- | --- |
| 动效 JS（gz） | ≤ 3KB | scramble 岛屿 ~1KB |
| 动效 CSS 增量（gz） | ≤ 10KB | VT/SDA/入场/划线 ~3–5KB |
| 动画库 | 0 | 0 |
| Lighthouse P/A11y | ≥ 95 | 无长任务（合成器动画）、无 CLS 源（基准可见 + 预留轨道）、DOM 无膨胀（不拆分） |

对比参照：任何主流库方案（GSAP 27KB / Motion 18KB / Lenis 3KB 起）都会吃掉 1/3 以上单页预算。本方案的性能故事不需要论证，**预算表本身就是设计语言**。

### 7.5 测试清单

- DevTools → Rendering → Emulate `prefers-reduced-motion`：reduce 下全站零运动、内容完整；
- Performance 面板 4–6× CPU throttling 下跑 wght hover 与滚动：无 Long Task（VF 动画的标配审计，[WFO](https://web-font-optimization.com/typography-fundamentals-system-architecture/variable-font-axis-tuning/animating-font-weight-with-variable-fonts/)）；
- stock Firefox（不动 flag）验证 SDA 降级路径（§3.3 坑 3，[css-scroll-driven.com](https://www.css-scroll-driven.com/core-animation-fundamentals-browser-mechanics/browser-support-progressive-enhancement/)）；
- Firefox 验证跨文档 VT 缺席＝普通导航无报错；
- Playwright `page.emulateMedia({ reducedMotion: 'reduce' })` 进 CI 冒烟（[css-scroll-driven.com](https://www.css-scroll-driven.com/accessibility-inclusive-motion-standards/implementing-prefers-reduced-motion/)）；
- NVDA+Chrome、VO+Safari 两组读屏抽测标题与元数据（§6.2 的行业门槛）；
- VT + `@starting-style` 叠加观感专项（§3.4 坑 3）。

---

## 8. 最终推荐与实施路线

**推荐动效技术栈**：

> **原生跨文档 View Transitions（`@view-transition`，零 JS 路由转场 + 构建期命名 morph）· CSS scroll-driven animations（`@supports` 守卫，Firefox 157 后全绿）· `@starting-style` + `transition`（入场）· `linear()` 缓动 token（全局锐利曲线）· 文字动效 = 未拆分文本的 clip-path 遮罩 reveal + 等宽拉丁层 scramble 岛屿（~1KB，全站唯一 JS）· 机器层拉丁 VF 的 wght 微动效（CJK 静态子集不参与）· 三层 reduced-motion 守卫 · 零动画库、零滚动库、零路由器**

**签名动效候选**（按「一个签名动效 > 满页普通动效」原则，最终由设计方案定夺）：

1. **列表 → 文章的标题 morph**（构建期 `view-transition-name`，纯 CSS）——页面级炫技单品；
2. **等宽元数据条 decode**（scramble 岛屿）——「机器在写字」的具象化；
3. **荧光划线生长**（纯 CSS `background-size` 过渡，v1 保留语法的动效化）。

**路线图**：

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| **P0**（随 v2 模板） | `@view-transition` + reduced-motion 守卫；root 转场定制（`linear()` 短曲线）；标题 morph 命名；hover/焦点/划线的 transition 体系 | Chrome/Safari 有转场、Firefox 普通导航；reduce 下零运动；Lighthouse ≥ 95 |
| **P1** | SDA：阅读进度条 + 归档列表 reveal；`@starting-style` 首屏入场；遮罩式标题 reveal | `@supports` 守卫生效；stock Firefox 降级正常；滚动 Performance 面板无主线程活动 |
| **P2** | scramble 岛屿（~1KB）；机器层 VF wght 动效（hover/滚动驱动）；`interpolate-size` 渐进增强；VT `types` 方向感 | JS 总量 ≤ 3KB gz；4–6× CPU 下无 Long Task；读屏双组合抽测通过 |

**明确不引入清单**：Lenis（滚动劫持）、GSAP 及全部插件（无编排需求；升级路径保留）、Motion（无 React 岛屿；未来内嵌 demo 时用 mini 2.3KB）、anime.js、tailwindcss-motion（无 Tailwind）、任何 Swup/Barba 类路由器（原生 VT 已覆盖）。

---

## 9. 风险与缓解

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 跨文档 VT 在 Firefox 迟迟不落地（WPT 分数仍个位数，2026-09） | Firefox 用户（国内占比可观）无转场 | 降级＝普通导航，零功能损失；若某天转场成为刚需，Astro ClientRouter 是现成升级路径（含自动 reduced-motion 与路由播报） |
| SDA 在 Firefox 9 月底才全绿 | 短期内 ~10–15% 流量无滚动效果 | 全部效果在 `@supports` 守卫内、基准态可见；2026-09-29 自然收敛，无需任何动作 |
| 逐字动画的读屏舆论风险（2026-02 起 GSAP/SplitText 被公开实测打脸） | 若误用逐字分裂，A11y 分与口碑双输 | 方案层面已禁止（§6.2）；词级场景强制双读屏组合实测后上线 |
| VT 快照内存（命名元素过多） | 低端设备转场卡顿 | 命名白名单：站名/标题/元数据条 ≤ 5 个 |
| VT 转场到「未完成渲染的新页」 | 闪无样式页 | 单 CSS 文件 + render-blocking；Cloudflare 边缘低 TTFB |
| `@starting-style` 与 VT 叠加双动画 | 观感打架（未充分文献化） | QA 专项（§7.5）；必要时入场动画只留给元素级微动效 |
| 未来若引入 GSAP：单一公司监管 + 非 OSI 许可 | 供应链/条款风险 | 引入前重估 Motion（MIT）与原生能力覆盖度；本站当前零库，风险为零 |
| scramble 字符池越界 | tofu/观感割裂 | 字符池硬编码为等宽拉丁子集，且纳入字体子集字符清单校验（[技术选型调研 §5.3](260908-tech-stack.research.md) 的 CI 门禁复用） |

---

## 参考来源

**浏览器支持矩阵（一手）**

- [webstatus.dev: View transitions（同文档）](https://webstatus.dev/features/view-transitions) ｜ [cross-document-view-transitions](https://webstatus.dev/features/cross-document-view-transitions) ｜ [scroll-driven-animations](https://webstatus.dev/features/scroll-driven-animations) ｜ [starting-style](https://webstatus.dev/features/starting-style) ｜ [transition-behavior](https://webstatus.dev/features/transition-behavior) ｜ [interpolate-size](https://webstatus.dev/features/interpolate-size) ｜ [anchor-positioning](https://webstatus.dev/features/anchor-positioning)（API 查询于 2026-09-08）
- [caniuse: scroll-driven animations](https://caniuse.com/wf-scroll-driven-animations) ｜ [caniuse: transition-behavior](https://caniuse.com/mdn-css_properties_transition-behavior)
- [MDN: animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) ｜ [MDN: @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition) ｜ [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) ｜ [MDN: linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear) ｜ [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) ｜ [MDN: Variable fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts) ｜ [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) ｜ [MDN Firefox 157 Release Notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157)
- [MDN BCD via GoogleChrome guidance 的支持结论](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/cross-document-transitions.md)（Chrome 111 / Safari 18 / Firefox 144；Chrome 126 / Safari 18.2）

**View Transitions**

- [Chrome for Developers: Cross-document view transitions for MPAs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)（限制与事件，现行版）
- [Chrome for Developers: Misconceptions about view transitions](https://developer.chrome.com/blog/view-transitions-misconceptions)（2024-07，reduced-motion 与 skip 行为）
- [WICG cross-doc explainer](https://github.com/WICG/view-transitions/blob/main/cross-doc-explainer.md)（2026-08 更新；pageswap/pagereveal、条件 opt-out）
- [GoogleChrome modern-web-guidance: consistent-cross-document-transitions](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/consistent-cross-document-transitions.md)（render-blocking 与 MANDATORY reduced-motion 模板）
- [CSS-Tricks: Cross-Document View Transitions Part 1](https://css-tricks.com/cross-document-view-transitions-part-1/)（2026-05-18，gotchas 实战）
- [W3C CSS View Transitions L1](https://www.w3.org/TR/2024/CRD-css-view-transitions-1-20240328/)（skip 语义）

**Scroll-driven animations**

- [whoooop: CSS Scroll-Driven Animations — Ship Them Safely](https://whoooop.co.uk/blog/css-scroll-driven-animations)（2026-08-31，支持现状与发布策略）
- [Code With Seb: Scroll-Driven Animations — Why 85% Support Is Already Enough](https://www.codewithseb.com/blog/scroll-driven-animations-progressive-enhancement-guide)（2026-08-28，Firefox 157 cutover）
- [WebKit: A guide to Scroll-Driven Animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)（2025-06）
- [Carmen Ansio: Animating Variable Fonts with CSS Scroll-Driven Animations](https://www.carmenansio.com/articles/variable-font-scroll/)（2026-04，overflow: clip 坑）
- [css-scroll-driven.com: Browser Support & Progressive Enhancement](https://www.css-scroll-driven.com/core-animation-fundamentals-browser-mechanics/browser-support-progressive-enhancement/)（2026-07；支持表存在个别错误，仅采信其守卫/测试模式）

**入场动画与缓动**

- [web.dev: Now in Baseline — animating entry effects](https://web.dev/blog/baseline-entry-animations)（2024-08-08，@starting-style + allow-discrete）
- [Chrome for Developers: CSS linear() easing](https://developer.chrome.com/docs/css-ui/css-linear-easing-function) ｜ [modern-css.com: Custom CSS Easing with linear()](https://modern-css.com/custom-easing-without-cubic-bezier-guessing) ｜ [lunchboxhands: CSS Easing Functions Explained](https://lunchboxhands.com/blog/css-easing-functions-explained)（支持与 Widely available 时点）

**动效库**

- [Webflow: GSAP becomes 100% free](https://webflow.com/blog/gsap-becomes-free) ｜ [Webflow Help Center](https://help.webflow.com/hc/en-us/articles/40538857574419-Use-GSAP-in-Webflow)（2025-04-30 全免费） ｜ [GSAP 3.13 发布说明](https://gsap.com/blog/3-13/) ｜ [GSAP 3.14](https://gsap.com/blog/3-14/) ｜ [GSAP Pricing](https://gsap.com/pricing) ｜ npm gsap@3.15.0（2026-09-08 查询）
- [Motion 官网与 changelog](https://motion.dev/) ｜ [motion CHANGELOG（GitHub）](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)（13.0 2026-08-05；animateView 入核心 12.41.0 2026-06） ｜ [Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) ｜ [animate() 文档](https://motion.dev/docs/animate) ｜ [Motion+](https://motion.dev/plus) ｜ [独立宣言 2024-11](https://motion.dev/magazine/framer-motion-is-now-independent-introducing-motion)
- [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) ｜ [lenis.dev](https://lenis.dev)（npm 1.3.26，2026-09-08 查询）
- [animejs.com](https://animejs.com) ｜ npm animejs@4.5.0（2026-09-08 查询）
- [adamarant: Immersive web stack in 2026 — Lenis, GSAP, and what to skip](https://adamarant.com/en/blog/immersive-web-stack-in-2026-lenis-gsap-and-what-to-skip)（2026-05-28，体积表）
- [LogRocket: React animation libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) ｜ [PkgPulse: framer-motion vs gsap](https://www.pkgpulse.com/compare/framer-motion-vs-gsap) ｜ [PkgPulse: Best React Animation Libraries 2026](https://www.pkgpulse.com/guides/best-react-animation-libraries-2026) ｜ [daily.dev 动画库清单（2026 注记）](https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024/) ｜ [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion)

**Astro**

- [Astro: View transitions 指南（现行文档）](https://docs.astro.build/en/guides/view-transitions/)（ClientRouter/原生双路线、生命周期、自动 reduced-motion、路由播报）
- [Astro: The future of Astro — zero-JS view transitions](https://astro.build/blog/future-of-astro-zero-js-view-transitions/)（官方立场与一行 CSS 用法）
- [Astro: astro:transitions 模块参考](https://docs.astro.build/en/reference/modules/astro-transitions)

**文字动效与无障碍**

- [Adrian Roselli: You Know What? Just Don't Split Words into Letters](http://adrianroselli.com/2026/02/you-know-what-just-dont-split-words-into-letters.html)（2026-02-05，2026-04-01 更新——本报告 §6.2 的核心依据）
- [GSAP issue #642: Screen Readers do not expose SplitText](https://github.com/greensock/GSAP/issues/642)（2026-02-05）
- [Unicorn Club: Your Text Animations Are Breaking Screen Readers](https://unicornclub.dev/articles/2026-02-21-text-animations-breaking-screen-readers/)（2026-02-21）
- [theAdhocracy: Animating Letters Isn't Easy](https://theadhocracy.co.uk/wrote/just-dont-split-words-into-letters)（2026-03-13）
- [GSAP SplitText 文档](https://gsap.com/docs/v3/Plugins/SplitText/)（aria 选项、prepareText 中文钩子） ｜ [GSAP: Accessible Animation](https://gsap.com/resources/a11y/) ｜ [GSAP 论坛：SplitText 与日文字符](https://gsap.com/community/forums/topic/42903-splittext-with-nested-elements-and-japanese-chars/)（2024-11）

**可变字体与 CJK 字体**

- [WFO: Animating Font Weight with Variable Fonts](https://web-font-optimization.com/typography-fundamentals-system-architecture/variable-font-axis-tuning/animating-font-weight-with-variable-fonts/)（性能量化与 @property 模式）
- [WFO: Subsetting Variable Fonts by Axis and Glyph](https://web-font-optimization.com/font-loading-delivery-strategies/variable-font-loading-techniques/subsetting-variable-fonts-by-axis/)（instancer 轴限域）
- [FontLab: Animating font-variation-settings at scale](https://blog.fontlab.com/2026/02/03/animating-font-variation-settings/)（2026-02，IntersectionObserver 暂停模式）
- [animationpatterns.art: Variable Font Weight Morph](https://animationpatterns.art/animations/variable-font-weight-morph/)（2026-05，预留轨道与逐字 stagger 模式）
- [Stack Overflow: Reduce layout and repaint for variable font animation](https://stackoverflow.com/questions/74111171/reduce-css-layout-and-repaint-for-variable-font-animation)（steps() 技巧）
- [Adobe: Source Han Sans goes variable](https://blog.adobe.com/en/publish/2021/04/08/source-han-sans-goes-variable)（CJK VF 体积实测）
- [Toolbox365: CJK 字体子集化](https://www.toolbox365.net/tutorials/font-subset-unicode-range-and-cjk-strategy/)（2026-05，静态子集 30–80KB） ｜ [Penchan: CJK Font Performance 2026](https://penchan.co/en/ai/coding/cjk-font-performance/)（2026-05，系统字体 + 小拉丁自定义字体范式）

**性能与 reduced-motion 范式**

- [css-scroll-driven.com: Respecting prefers-reduced-motion in CSS](https://www.css-scroll-driven.com/accessibility-inclusive-motion-standards/implementing-prefers-reduced-motion/how-to-respect-prefers-reduced-motion-in-css/)（2026-06，三层覆写范式）
- [css-scroll-driven.com: Detecting View Transition Support](https://www.css-scroll-driven.com/scroll-driven-view-transition-implementation-patterns/view-transition-browser-support-matrix/detecting-view-transition-support-supports-javascript/)（2026-07，JS skip 模式）
- [MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

**关联文档**

- [技术选型调研](260908-tech-stack.research.md)（Astro 6 / 字体子集管线 / Cloudflare 底座 / AutoCorrect）
- [设计灵感调研](260908-design-inspiration.research.md)（rauno 微交互 taxonomy / antfu 签名动效 / WiP 版式语言）
