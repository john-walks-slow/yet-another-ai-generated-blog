/**
 * decode.ts —— 等宽拉丁「机器层」的 scramble 岛屿
 *
 * 依据 260908-motion-tech.research.md §6.3/§8：
 * - 只作用于标记 data-decode 的等宽拉丁文本（字符池硬编码为等宽子集）
 * - 字体就绪后才启动（回退字体没有轴/度量）
 * - prefers-reduced-motion: 直接显示，零运动
 * - ~1KB gz，全站唯一客户端 JS
 */

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\_<>[]{}$#*+=-';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scramble(el: HTMLElement, duration = 640): void {
  const final = el.dataset.decode ?? el.textContent ?? '';
  if (!final) return;
  const start = performance.now();
  const len = final.length;

  function frame(now: number): void {
    const t = Math.min(1, (now - start) / duration);
    // ease-out：前 1/3 全乱码，然后从左到右逐位锁定
    const locked = Math.floor(len * Math.max(0, (t - 0.3) / 0.7));
    let out = '';
    for (let i = 0; i < len; i++) {
      const ch = final[i];
      if (i < locked || !/[A-Za-z0-9]/.test(ch)) out += ch;
      else out += POOL[(Math.random() * POOL.length) | 0];
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = final;
  }
  requestAnimationFrame(frame);
}

function init(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-decode]');
  if (REDUCED || targets.length === 0) return;

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

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => targets.forEach((t) => io.observe(t)));
  } else {
    targets.forEach((t) => io.observe(t));
  }
}

init();
