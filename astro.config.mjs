// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';
import { unified } from '@astrojs/markdown-remark';
import { rehypeAnnotations } from './src/plugins/rehype-annotations';
import sitemap from '@astrojs/sitemap';

// 构建指纹（git 不存在时用内容无关的占位）
function buildHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}

const hash = buildHash();
const time = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

// 两个正文语法：==荧光划线== 与 ^[侧栏批注]
const unifiedProcessor = unified({ rehypePlugins: [rehypeAnnotations] });

// https://astro.build/config
export default defineConfig({
  site: 'https://yet-another-ai-generated.blog',
  integrations: [sitemap()],
  markdown: {
    processor: unifiedProcessor,
  },
  vite: {
    define: {
      __BUILD_HASH__: JSON.stringify(hash),
      __BUILD_TIME__: JSON.stringify(time),
    },
    build: {
      // lightningcss 会把 animation-timeline 折进 animation 简写，
      // 而 Chrome 不解析简写里的 scroll()/view() → 进度条动画被丢弃。
      // esbuild 不折叠，保持长写法。
      cssMinify: 'esbuild',
    },
    preview: {
      // 放行临时预览隧道（cloudflared quick tunnel）的 Host
      allowedHosts: ['.trycloudflare.com'],
    },
  },
});
