/**
 * main.ts —— 全站唯一客户端脚本
 * 1. theme：双主题切换（localStorage 记忆；首帧防闪烁的内联 snippet 在 Base.astro）
 * 2. decode：等宽拉丁 scramble（机器层专属；fonts.ready 后启动）
 * 3. vt-title：点击文章链接时给标题挂 view-transition-name（列表→文章 morph）
 *
 * 预算：~1.2KB gz。零动画库零滚动库。
 */

/* ——— theme ——— */
const toggle = document.querySelector<HTMLButtonElement>('.theme-toggle');
function applyTheme(t: string) {
  if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  if (toggle) toggle.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
}
applyTheme(localStorage.getItem('theme') ?? 'light');
toggle?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

/* ——— decode（scramble，仅拉丁层） ——— */
/* 最终文字已 SSR 在 DOM 里（零 CLS：不注入、不删空元素）；scramble 只做逐字符原地替换 */
const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\_<>[]{}$#*+=-';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function textNodes(el: HTMLElement): Text[] {
  const out: Text[] = [];
  const walk = (n: Node): void => {
    for (const c of n.childNodes) {
      if (c.nodeType === Node.TEXT_NODE && c.textContent) out.push(c as Text);
      else if (c.nodeType === Node.ELEMENT_NODE && (c as Element).tagName !== 'BR') walk(c);
    }
  };
  walk(el);
  return out;
}

function scramble(el: HTMLElement, duration = 1100): void {
  const nodes = textNodes(el).map((n) => ({ node: n, final: n.data }));
  const len = nodes.reduce((s, x) => s + x.final.length, 0);
  if (!len) return;
  const start = performance.now();
  const frame = (now: number): void => {
    const t = Math.min(1, (now - start) / duration);
    const lockedTotal = Math.floor(len * Math.max(0, (t - 0.3) / 0.7));
    let idx = 0;
    for (const { node, final } of nodes) {
      let out = '';
      for (let i = 0; i < final.length; i++, idx++) {
        const ch = final[i]!;
        out +=
          idx < lockedTotal || !/[A-Za-z0-9]/.test(ch)
            ? ch
            : POOL[(Math.random() * POOL.length) | 0];
      }
      node.data = out;
    }
    if (t < 1) requestAnimationFrame(frame);
    else for (const { node, final } of nodes) node.data = final;
  };
  requestAnimationFrame(frame);
}

const decs = document.querySelectorAll<HTMLElement>('[data-decode]');
if (!REDUCED && decs.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          scramble(e.target as HTMLElement);
        }
      }
    },
    { threshold: 0.6 },
  );
  (document.fonts?.ready ?? Promise.resolve()).then(() => decs.forEach((t) => io.observe(t)));
}

/* ——— vt-title：列表→文章标题 morph（跨文档 VT 的零路由器方案） ——— */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented) return;
  const a = (e.target as HTMLElement).closest?.('a[data-vt-title]') as HTMLAnchorElement | null;
  if (!a) return;
  const target = (a.querySelector('[data-vt-title-inner]') ?? a) as HTMLElement;
  target.style.viewTransitionName = 'post-title';
});
