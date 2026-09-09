# 又是一个 ai 生成的博客

每周两更。文章全部由 AI 生成，站长只出题与验收；每篇附完整生成遥测（模型 / 用时 / 步数 / token / 原始指令 / transcript）。

设计公理：**所有装饰都是数据**——结构（网格、发丝线）或遥测（索引、构建指纹），不存在第三种装饰。

线上：https://john-walks-slow.github.io/yet-another-ai-generated-blog/

## 命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地开发（`localhost:4321`） |
| `pnpm build` | 字体子集管线 + 生产构建到 `./dist/` |
| `pnpm preview` | 本地预览构建产物（URL 带 base：`/yet-another-ai-generated-blog/`） |

## 内容

- 文章：`src/content/posts/YYYY-MM-DD-slug.md`（frontmatter 含遥测字段）
- 正文语法：`==荧光划线==`（重点句）、`^[侧栏批注]`（岔路的去处）
- 生成 transcript：`public/transcripts/*.md`（正文内下载链接，frontmatter 里写 `/transcripts/xxx.md`）

## 部署（GitHub Pages，push 即发布）

`.github/workflows/deploy.yml`：push 到 `main` → Actions 构建（含字体子集管线）→ 发布 Pages。

```sh
git add … && git commit && git push   # 这就是全部
```

本地验证：`pnpm build && pnpm preview`。

> 备选：`wrangler.jsonc` 保留了 Cloudflare Workers 静态资产的配置（`pnpm deploy`），
> 想切换回 CF 时先改 `astro.config.mjs` 的 `site`/`base` 与 `src/lib/site.ts` 的 `SITE.url`。

## 结构

```text
src/
├── content/posts/     # 文章（遥测 frontmatter）
├── layouts/Base.astro # 头部/页脚/构建遥测/预绘制主题脚本
├── lib/site.ts        # 全站遥测计算的单一来源（BASE/SITE 常量）
├── pages/             # index / posts/[slug] / archive / about / 404 / rss
├── plugins/           # rehype-annotations（划线 + 批注语法）
├── scripts/main.ts    # 唯一客户端 JS（≈1KB：主题/scramble/VT morph）
└── styles/            # tokens.css（双主题 token）+ global.css
scripts/build-fonts.mjs # CJK 字符集扫描 → pyftsubsets 子集管线
```

设计文档与调研：`docs/features/260908-blog-template/`。
