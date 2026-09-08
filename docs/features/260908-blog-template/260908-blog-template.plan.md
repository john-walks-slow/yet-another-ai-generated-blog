# 《又是一个ai生成的博客》模板设计方案 v2

> - **日期**：2026-09-09
> - **状态**：v2（技术极简主义方向），实施进行中
> - **输入**：[技术极简主义与前卫动效设计调研](260908-technical-minimalism-design.research.md) · [动效技术选型调研](260908-motion-tech.research.md) · [技术选型调研](260908-tech-stack.research.md) · 设计稿 `mockups/v2/`
> - **历史**：v1「机器排版，人签名」（印刷人文方向）已被站长否决，计划存档于 `260908-blog-template-v1.plan.md`、设计稿存档于 `mockups/mockup-v1-*.html`；本文件只包含 v2 最终方案
> - **实况**：Astro 实际安装为 7.3.2（脚手架默认），Content Layer + glob loader 落地，rehype 注解插件（荧光划线 + 侧栏批注）已实现并验证

---

## 1. 设计 Brief v2

站长对 v1 的否决与对 v2 的定义（原话要点）：

- 要**技术 minimalism**，不要伪人文——「非常冷，非常冷，非常简单，但是又非常高技术力」
- **用动效和设计炫耀高技术力**；整体无衬线、尖锐、冷、黑白、技术化；要前卫的动效、转场、展示
- 反感做作：印章仪式、署名宣言、人工投入计时（「人工花了多少时间，这个没有办法估量，绝对不要写」）
- 生成记录是**次要的末尾元数据**，不是文章的重点；要显示原始提示词、完整生成过程（transcript 下载）、总用时、步数、token 消耗；「是否人工润色」保留
- 保留：荧光划线、侧栏批注的显示方法

**一句话设计目标**：一个把自己当作「机器输出物」来呈现的网站——冷到没有任何表演性的人文姿态，炫技全部通过工程能力本身表达；**所有装饰都是数据**。

**v1 教训（设计公理）**：这个站上不允许出现「表演」——不表演谦逊（人工投入计时）、不表演在场（印章/署名仪式）、不表演温度（暖色/衬线/楷体）。机器的诚实是冷。

---

## 2. 调研输入摘要

1. **动效技术**（[报告](260908-motion-tech.research.md)）：CSS-first 渐进增强——跨文档 View Transitions（`@view-transition` 一行 CSS 零 JS）、CSS scroll-driven animations（`@supports` 守卫）、`@starting-style` 入场、`linear()` 缓动 token；全站唯一 JS 是 ~1KB 的等宽拉丁 scramble 岛屿；逐字 span 拆分被读屏实测否决（用 clip-path 遮罩 reveal 替代）；CJK 可变字体动效判死刑（只动拉丁等宽层 wght）；零动画库零滚动库零路由器；三层 reduced-motion 守卫。
2. **设计标杆**（[报告](260908-technical-minimalism-design.research.md)）：技术极简主义的参照系与动效词汇（站点清单、可迁移手法、反面清单见报告）。
3. **技术底座**（[报告](260908-tech-stack.research.md)）：Astro（实际安装 7.3.2）+ Cloudflare Workers 静态资产；正文走系统字体栈；构建期 AutoCorrect + `text-autospace` 双保险；行高 1.9、行宽 36em。

---

## 3. 设计概念：「输出物」

> **这个网站是一件机器输出物，并且毫不掩饰这一点。**
> 设计公理：所有装饰都是数据——任何一个非内容的视觉元素，要么是结构（网格、发丝线），要么是数据（索引、遥测、构建信息）。不存在第三种装饰。

从概念推导的视觉语义系统（取代 v1 的「三层人文语义」）：

| 元素 | 语义 | 视觉载体 |
| --- | --- | --- |
| 正文（阅读） | 被输出的内容 | 无衬线（系统黑体栈），36em 列宽 |
| 机器层（界面/元数据） | 生成与构建它的系统 | 等宽（JetBrains Mono），全大写拉丁标签，遥测行 |
| 显示层（站名/标题） | 输出物的铭牌 | Archivo Expanded 900（拉丁）+ Noto Sans SC 900（中文子集） |
| 划线 `==…==` | 重点句标记 | 信号黄平涂，滚动到位时左→右扫入（保留自 v1） |
| 批注 `^[…]` | 侧栏注 | 桌面右缘栏 + 窄屏行内（保留自 v1） |

色彩语义（黑白 + 单一功能色）：

- **黑白即立场**：纯白 `#FFFFFF` 底、近黑 `#0A0A0A` 墨；不发暖。黑色以**整块反转**（inversion）出现——页脚、hover 行、焦点块——形成节奏，而非灰色过渡
- **信号黄 `#FFE14D`**：唯一彩色，只用于 `mark.pen`（划线）与 `::selection`（读者选中）——「标记」是它唯一的语义

---

## 4. 设计系统规范（Design Tokens）

### 4.1 色彩

**待决策分叉（设计稿两种均已实现，token 级映射一键切换）**：

- **方案 A · 冷白（默认画布白）**：`--bg #FFFFFF`、信号黄 `#FFE14D`——荧光笔在白纸上的语义，长文阅读最优（Vercel/Geist 谱系）
- **方案 B · 冷黑（默认画布黑）**：`--bg #0A0A0B`（Linear 近黑非纯黑）、acid 黄绿 `#D9FF4B`——动效标杆站主流（Obys/darkroom/Linear 谱系），信号色在深底上更「电」；代价是中文正文深色渲染偏糊（调研 §10.5.6）

共同纪律（两案共享）：

```
深度 = 亮度台阶 + 发丝边框，零投影零渐变零 glow
灰阶只做信息层级，不用色相
黑色/反转块是唯一重音（页脚、hover 行）
强调色严格配给：划线、::selection、当前态、焦点环——除此之外全站无彩
强调色上的文字恒近黑（--on-accent），深浅两案都可读
```

深色渲染细则（若选 B）：正文黑体需更粗字重或 +50 可变字重补偿（系统栈下近似处理）；发丝线用 `rgba(255,255,255,0.08)` 级。

### 4.2 字体

```
/* 显示层：拉丁 */
--font-display: "Archivo Variable", system-ui, sans-serif;   /* font-stretch: 125% · wght 900 */

/* 显示层：中文（构建期子集，仅站名+标题字符集） */
--font-display-cjk: "Noto Sans SC Black Subset", "PingFang SC", "Microsoft YaHei", sans-serif;

/* 机器层 */
--font-mono: "JetBrains Mono", ui-monospace, "Noto Sans SC", "PingFang SC", monospace;

/* 正文：系统黑体栈（零加载成本） */
--font-body: -apple-system, "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Noto Sans SC",
             "Source Han Sans SC", "Microsoft YaHei", system-ui, sans-serif;
```

- **Archivo（可变，wdth 62–125% + wght 100–900）**：显示层拉丁——Expanded Black 用于站名与标题的拉丁部分，是「尖锐」的主要来源；子集自托管
- **JetBrains Mono**：机器层；自托管拉丁子集（含 scramble 字符池——字符池纳入子集校验清单）
- **Noto Sans SC 900**：仅对「站名 + 全部文章标题」的字符集做构建期子集（预计 <300 字符，30–60KB），保证中文标题的黑度与拉丁显示字重匹配；正文不加载任何 CJK webfont
- 站名「ai」恒小写（沿自 v1 的决定）；英文机器层标签全大写

### 4.3 字号与版式

| 元素 | 规格 |
| --- | --- |
| 站名大字（首页） | 显示层 900/expanded，clamp(2.5rem, 8vw, 5.5rem)，行高 1.15，字距 -0.02em |
| 文章标题 | 显示层 900，clamp(1.6rem, 4.5vw, 2.6rem)，行高 1.3 |
| 正文 | 系统 sans 400，17px / 1.95，列宽 36em，justify + `text-justify: inter-character` |
| 机器层 | 等宽 0.72–0.8rem，拉丁全大写，字距 0.08em |
| 索引表 | 等宽数字列（tabular-nums）+ sans 标题列 |
| 间距 | 4px 网格；区块间距 64/96px |

### 4.4 网格与「技术图纸」词汇

- 页面骨架 = 显性网格：结构线（1px `--line-strong`）分隔区块；区块左上角等宽小标签 `§01 INDEX` 式编号
- 索引编号贯穿全站：文章以三位数编号（P/001…P/011，按日期升序），归档/上下篇/生成记录引用同一编号
- 角标刻度（registration marks）：桌面端页面四角 1px 十字标记（蓝本/印刷套准词汇，`aria-hidden`）

---

## 5. 动效系统（v2 的核心炫技层）

总策略（[动效报告](260908-motion-tech.research.md) §1）：**CSS-first 渐进增强，零动画库、零滚动库、零路由器；JS ≤3KB gz（实际 ~1KB scramble 岛屿）**。「零库本身就是最高级的技术力炫耀」——性能预算表即设计语言。

| # | 动效 | 实现 | 触发 |
| --- | --- | --- | --- |
| 1 | **路由转场：硬边 wipe** | `@view-transition { navigation: auto }` + `::view-transition-new(root)` clip-path inset 从左到右揭开，`linear()` 锐利曲线 ~240ms | 页面导航（Chrome/Safari；Firefox 降级普通导航） |
| 2 | **标题 morph** | 列表行标题与文章标题同名 `view-transition-name`（构建期静态命名，零 JS） | 列表 → 文章 |
| 3 | **元数据 decode** | ~1KB scramble 岛屿（`src/scripts/decode.ts`），等宽拉丁层，`document.fonts.ready` 后启动 | 首屏遥测行/英文副标进入视口 |
| 4 | **阅读进度** | 2px 黑条，CSS scroll-driven（`animation-timeline: scroll()`），`@supports` 守卫 | 文章页滚动 |
| 5 | **划线扫入** | `mark.pen` background-size 0→100% 过渡（生产：SDA `view()` 进入区间；降级：IntersectionObserver 加类） | 划线句进入视口 |
| 6 | **入场 reveal** | `@starting-style` + clip-path inset wipe，行级 stagger 40ms | 列表行/区块首帧 |
| 7 | **hover 反转** | 索引表行 hover：背景 `--ink`、文字 `--bg` 硬交换（120ms linear）；链接 hover 同语义 | 指针交互 |
| 8 | **焦点态** | `:focus-visible` 1px `--ink` outline + 2px offset | 键盘导航 |

无障碍：三层 reduced-motion 守卫（opt-in 反向包裹 / VT 伪元素覆写 / SDA timeline 归位——报告 §7.3 的 15 行 CSS 全文照抄）；不逐字拆分 DOM；`::selection` 信号黄。

性能预算：动效 JS ≤3KB gz（scramble ~1KB）· 动效 CSS 增量 ≤10KB gz · 动画库 0 · Lighthouse P/A11y ≥95。

---

## 6. 信息架构与页面规格

### 6.1 首页 `/`

```
┌──────────────────────────────────────────────────────────┐
│ [◧] 又是一个ai生成的博客          INDEX · ABOUT · COLOPHON · RSS │ ← 等宽导航，底部结构线
├──────────────────────────────────────────────────────────┤
│ 00 // OUTPUT                                             │ ← 等宽区块标签
│                                                          │
│ 又是一个                                                  │ ← 显示层 900 expanded
│ ai 生成的博客。                                            │
│                                                          │
│ [ YET ANOTHER AI-GENERATED BLOG — EST.2025 ]             │ ← 等宽，decode 扫入
│                                                          │
│ TOTAL 011 · 41,230 字 · 2.4M TOK · CLAUDE-OPUS-4.6        │ ← 遥测行（等宽）
├──────────────────────────────────────────────────────────┤
│ §01 // INDEX                                    2026 ▾    │
│ ┌──────┬────────┬──────────────────┬────────┬──────┐     │
│ │ P/008 │ 09-05  │ 论作为方法的提示词      │ #哲学   │ 1.9k │     │ ← 索引表
│ │ P/007 │ 09-01  │ 上下文窗口的形而上学    │ #ai    │ 1.7k │     │   行 hover
│ │  …    │        │                  │        │      │     │   → 整行黑反转
│ └──────┴────────┴──────────────────┴────────┴──────┘     │
├──────────────────────────────────────────────────────────┤
│ ███ 反转黑块：RSS · 归档 · 关于 · 版权页                      │
│ ███ build 8f3a2c1 · 2026-09-09 00:30 UTC · 0 cookies      │ ← 页脚整块黑底白字
└──────────────────────────────────────────────────────────┘
```

### 6.2 文章页 `/posts/[slug]`

```
│ P/008 · 2026-09-05 · #哲学 · 4 MIN              [GEN ▸]  │ ← 等宽元数据行；GEN 锚点直达生成记录
│ ────────────────────────────────────────────────────     │
│ 论作为方法的提示词                                          │ ← 显示层 900（morph 目标）
│                                                          │
│ 正文（36em，系统 sans，justify）                            │
│ ==划线句：信号黄扫入==  ^[批注进右侧栏]                       │
│                                                          │
│ ────────────────────────────────────────────────────     │
│ ▸ GEN · claude-opus-4.6 · 252s · 3 steps · 5,750 tok      │ ← 生成记录：折叠为
│   · unpolished · prompt ▸ · transcript ↓                  │   一行遥测（<details>）
│ ────────────────────────────────────────────────────     │
│ ← P/007 上下文窗口的形而上学        P/009 谁在替我说话 →     │ ← 上下篇（索引编号）
```

生成记录展开态（`<details>`）：

```
GENERATION RECORD
model        claude-opus-4.6
duration     252 s
steps        3
tokens       in 1,840 / out 3,910
polished     no
prompt       「提示词不是咒语，是委托协议。写一篇短文区分……」（完整原文折叠展示）
transcript   on-prompts-as-method.md ↓ 1.2 KB
```

无印章、无声明句、无人工时间——遥测之外什么都没有。

### 6.3 其余页面

- **归档 `/archive`**：全量索引表（等宽账本），年分组，`TOTAL 011 · 41,230 字 · 2.4M TOK` 统计行
- **关于 `/about`**：运行规则四条（出题/验收/遥测公开/每周两更），冷陈述，无宣言腔
- **版权页 `/colophon`**：**站点规格表**（spec sheet）——字体、技术栈、动效能力清单（`view transitions: yes · scroll-driven: yes · client js: 1.1kb · cookies: 0`）、内容许可（CC BY 4.0，auto_human 待确认）
- **404**：`404 // NOT FOUND — 这一篇还没有被生成` + `hint: 或许它正在排队等一次推理 → /`
- **RSS `/rss.xml`**：全文输出，item 内嵌生成记录块

### 6.4 全局

- 页脚（反转黑块）：站名 · 遥测（篇数/字数/token 总量）· `build {hash} · {time} UTC · 0 cookies`
- 深色模式：**不做**（黑白反转块已是节奏；主题切换不在本站语义里）
- favicon：黑色方块套白色小方块的几何标记（registration mark 变体）

---

## 7. 内容模型（已实现）

`src/content.config.ts`：`title/date/summary/tags/model/duration_s/steps/tokens_in/tokens_out/polished/transcript/prompt/draft`——Zod 强校验，缺字段构建失败。样例 11 篇已入库（2025×3 + 2026×8）。

正文语法（`src/plugins/rehype-annotations.ts`，已验证输出）：
- `==text==` → `<mark class="pen">`
- `^[text]` → `<sup class="sn-ref">` + `<aside class="sidenote">`（桌面右缘栏/窄屏行内）

---

## 8. 技术方案（实况）

```
yet-another-ai-generated-blog/           Astro 7.3.2 · static
├── astro.config.mjs                     site + markdown(rehype-annotations)
├── src/
│   ├── content.config.ts                Zod schema（遥测字段）✓
│   ├── content/posts/*.md               11 篇 ✓
│   ├── plugins/rehype-annotations.ts    划线+批注 ✓（构建验证通过）
│   ├── scripts/decode.ts                scramble 岛屿 ✓（待接入）
│   ├── styles/tokens.css + global.css   §4 tokens + 排印基线 + 动效系统
│   ├── layouts/Base.astro               <head>/masthead/footer（含构建信息注入）
│   ├── layouts/Post.astro               文章版式（侧栏注 grid + 生成记录）
│   └── pages/                           index / posts/[slug] / archive / about / colophon / 404 / rss.xml
└── public/transcripts/*.md              生成过程记录（可下载）
```

依赖实况：`@astrojs/markdown-remark`（Astro 7 的 Sätteri 默认处理器下，经典 rehype 插件路线需显式安装——已装）；`@astrojs/rss` + `@astrojs/sitemap` 已装。

字体管线：P0 用 pyftsubset 单文件子集（Archivo 显示子集 + JetBrains Mono + Noto Sans SC 900 标题字符集）；CI 校验子集字符集 ⊇ 全站字符集（scramble 字符池计入）。

---

## 9. 实施计划

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| **P0**（进行中） | 设计稿 v2（单文件双视图 + 同文档 VT 演示）；Astro 实装六页 + tokens + 排印 + 索引表 + 生成记录 + RSS/sitemap；字体子集最小管线 | 全页面可构建；与设计稿 token 对齐；Lighthouse ≥95 |
| **P1** | 动效系统全量（VT wipe + morph + SDA + decode + 划线扫入 + reveal）；AutoCorrect 构建期集成；`<details>` 生成记录 | 三层 reduced-motion 守卫生效；Firefox 降级路径正常；动效 QA 清单全过 |
| **P2** | OG 图模板化；归档页 SDA reveal；字体分片升级 | 字体总传输 <200KB |

## 10. 验收标准

- [ ] 反 slop：无紫蓝渐变/玻璃卡片/阴影堆叠/emoji 列表/默认圆角；灰阶不用于「高级感」只用于信息层级
- [ ] 冷度检查：全站无任何「表演性人文」元素（无印章/署名仪式/人工计时/暖色/衬线抒情）
- [ ] 遥测一致性：文末生成记录、页脚计数、归档统计、RSS 内嵌块四处数据同源
- [ ] CJK：行长 30–45 字、行高 ≥1.9、盘古之白、无 tofu、子集覆盖全站字符
- [ ] 动效：三层 reduced-motion 守卫；JS ≤3KB gz；无逐字 span 拆分；`@supports`/降级路径实测
- [ ] 工程：Lighthouse 移动端 P/A11y/SEO ≥95；构建零警告；schema 缺字段必须构建失败
