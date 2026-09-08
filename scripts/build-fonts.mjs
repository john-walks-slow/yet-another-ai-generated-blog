/**
 * build-fonts.mjs —— 字体子集管线（P0 最小实现）
 *
 * 1. 扫描 src/（posts/ layouts/ pages/ components/ lib/）提取全部 CJK 字符 + 文章标题
 * 2. 下载三种字体到 .cache-fonts/（幂等）
 *    - Noto Sans SC 900（chinese-simplified 子集原文件，1.4MB）
 *    - Archivo Variable（latin，显示层拉丁）
 *    - JetBrains Mono 400/500（latin，机器层）
 * 3. pyftsubset 把 Noto Sans SC 900 压到「站名+标题+UI 字符集」（目标 <80KB）
 * 4. 全部输出 src/assets/fonts/，由 Vite 打包（哈希 + immutable 缓存）
 *
 * 用法：node scripts/build-fonts.mjs   （package.json prebuild 已挂）
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(root, '.cache-fonts');
const OUT = join(root, 'src/assets/fonts');
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const CDN = 'https://cdn.jsdelivr.net/npm';

/** 递归收集文件 */
function walk(dir, exts, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, exts, acc);
    else if (exts.some((e) => name.endsWith(e))) acc.push(p);
  }
  return acc;
}

/** 1. 字符集：标题 + UI 字符串（显示字体只用于这两处；正文走系统栈） */
const uiDirs = ['src/layouts', 'src/pages', 'src/components', 'src/lib', 'src/styles'];
let charset = new Set();
for (const d of uiDirs) {
  const dir = join(root, d);
  if (!existsSync(dir)) continue;
  for (const f of walk(dir, ['.astro', '.ts', '.css'])) {
    const text = readFileSync(f, 'utf8');
    for (const ch of text) {
      const c = ch.codePointAt(0);
      const isCJK =
        (c >= 0x4e00 && c <= 0x9fff) || // 汉字
        (c >= 0x3000 && c <= 0x303f) || // CJK 标点 。「」
        (c >= 0xff00 && c <= 0xffef) || // 全角 ！？
        (c >= 0x2014 && c <= 0x201d) || // —— “ ”
        (c >= 0x2026 && c <= 0x2027) || // …
        (c >= 0x00b7 && c <= 0x00b7); // ·
      if (isCJK) charset.add(ch);
    }
  }
}
// 文章标题（frontmatter title 行）
const postsDir = join(root, 'src/content/posts');
if (existsSync(postsDir)) {
  for (const f of walk(postsDir, ['.md'])) {
    const text = readFileSync(f, 'utf8');
    const m = text.match(/^title:\s*(.+)$/m);
    if (m) for (const ch of m[1]) charset.add(ch);
  }
}
// 保底：站名 + 必用 UI 字（防扫描遗漏）
charset = new Set([...charset, ...'又是一个ai生成的博客索引归档关于版权页上一篇文章总字数模型用时步数是否润色原始指令完整记录下载分钟阅读']);
const charsetStr = [...charset].join('');
console.log(`[fonts] CJK charset: ${charset.size} 字符`);

/** 2. 下载（幂等） */
function fetch(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 0) return;
  console.log(`[fonts] GET ${url}`);
  execFileSync('curl', ['-fsSL', '--max-time', '60', '-o', dest, url], { stdio: 'inherit' });
}

const files = {
  noto900: {
    url: `${CDN}/@fontsource/noto-sans-sc@5.2.5/files/noto-sans-sc-chinese-simplified-900-normal.woff2`,
    file: 'noto-sans-sc-900-full.woff2',
  },
  archivo: {
    url: `${CDN}/@fontsource-variable/archivo@5.2.5/files/archivo-latin-standard-normal.woff2`,
    file: 'archivo-latin-variable.woff2',
  },
  jbm400: {
    url: `${CDN}/@fontsource/jetbrains-mono@5.2.5/files/jetbrains-mono-latin-400-normal.woff2`,
    file: 'jetbrains-mono-400.woff2',
  },
  jbm500: {
    url: `${CDN}/@fontsource/jetbrains-mono@5.2.5/files/jetbrains-mono-latin-500-normal.woff2`,
    file: 'jetbrains-mono-500.woff2',
  },
};
for (const k of Object.keys(files)) {
  fetch(files[k].url, join(CACHE, files[k].file));
}

/** 3. 子集化 Noto Sans SC 900 */
const subsetOut = join(OUT, 'noto-sans-sc-display.woff2');
const args = [
  join(CACHE, files.noto900.file),
  `--text=${charsetStr}`,
  '--flavor=woff2',
  `--output-file=${subsetOut}`,
  '--layout-features=*',
  '--no-hinting',
  '--desubroutinize',
];
console.log('[fonts] pyftsubset noto-sans-sc-900 …');
execFileSync('pyftsubset', args, { stdio: 'inherit' });

/** 3b. 子集化 Archivo（显示层拉丁仅用 ASCII：ai/404/EST 等） */
const asciiPrintable = [...Array(95).keys()].map((i) => String.fromCharCode(0x20 + i)).join('');
console.log('[fonts] pyftsubset archivo (ascii) …');
execFileSync(
  'pyftsubset',
  [
    join(CACHE, files.archivo.file),
    `--text=${asciiPrintable}`,
    '--flavor=woff2',
    `--output-file=${join(OUT, 'archivo-variable.woff2')}`,
    '--layout-features=*',
    '--no-hinting',
    '--desubroutinize',
  ],
  { stdio: 'inherit' },
);

/** 4. 直通复制拉丁字体 */
const copies = [
  [files.jbm400.file, 'jetbrains-mono-400.woff2'],
  [files.jbm500.file, 'jetbrains-mono-500.woff2'],
];
for (const [src, dest] of copies) {
  writeFileSync(join(OUT, dest), readFileSync(join(CACHE, src)));
}

/** 5. 报告 */
console.log('[fonts] 输出：');
for (const f of readdirSync(OUT)) {
  const kb = (statSync(join(OUT, f)).size / 1024).toFixed(1);
  console.log(`  ${f}  ${kb} KB`);
}
