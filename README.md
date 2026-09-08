# 又是一个 ai 生成的博客

每周两更。文章全部由 AI 生成，站长只出题与验收；每篇附完整生成遥测（模型 / 用时 / 步数 / token / 原始指令 / transcript）。

设计公理：**所有装饰都是数据**——结构（网格、发丝线）或遥测（索引、构建指纹），不存在第三种装饰。

## 命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地开发（`localhost:4321`） |
| `pnpm build` | 字体子集管线 + 生产构建到 `./dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm deploy` | 构建 + 发布到 Cloudflare Workers 静态资产 |

## 内容

- 文章：`src/content/posts/*.md`（frontmatter 含遥测字段）
- 正文语法：`==荧光划线==`（重点句）、`^[侧栏批注]`（岔路的去处）
- 生成 transcript：`public/transcripts/*.md`（正文内下载链接）

## 部署（Cloudflare Workers 静态资产）

配置在 `wrangler.jsonc`（纯静态资产、`not_found_handling: 404-page`）。

```sh
# 首次：登录（浏览器 OAuth）或设置 CLOUDFLARE_API_TOKEN
npx wrangler login

# 之后每次：
pnpm deploy
```

上线后把 `astro.config.mjs` 里的 `site` 换成真实域名。

## 结构

```text
src/
├── content/posts/     # 文章（遥测 frontmatter）
├── layouts/Base.astro # 头部/页脚/构建遥测/预绘制主题脚本
├── lib/site.ts        # 全站遥测计算的单一来源
├── pages/             # index / posts/[slug] / archive / about / colophon / 404 / rss
├── plugins/           # rehype-annotations（划线 + 批注语法）
├── scripts/main.ts    # 唯一客户端 JS（≈1KB：主题/scramble/VT morph）
└── styles/            # tokens.css（双主题 token）+ global.css
scripts/build-fonts.mjs # CJK 字符集扫描 → pyftsubsets 子集管线
```

设计文档与调研：`docs/features/260908-blog-template/`。
