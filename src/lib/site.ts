/**
 * site.ts —— 全站数据派生（编号/遥测/统计）
 * 遥测一致性原则：文末生成记录、页脚计数、归档统计、RSS 全部经由本模块同源。
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 全部已发布文章（date 降序 = 首页顺序） */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 发布序号：按日期升序 P/001…（与展示顺序相反——编号是「第几件输出物」） */
export function postNo(post: Post, postsAsc: Post[]): string {
  const i = postsAsc.findIndex((p) => p.id === post.id);
  return `P/${String(i + 1).padStart(3, '0')}`;
}

/** 字数（正文 markdown 的 CJK 字符，含中文标点——「字」的通行口径） */
export function cjkCount(post: Post): number {
  const m = (post.body ?? '').match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u2014\u2018\u2019\u201c\u201d\u2026]/g);
  return m ? m.length : 0;
}

/** 阅读时长（分钟，CJK 450 字/分） */
export function readMinutes(post: Post): number {
  return Math.max(1, Math.round(cjkCount(post) / 450));
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtTokens(n: number): string {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export interface SiteStats {
  count: number;
  chars: number;
  tokens: number;
}

export async function siteStats(): Promise<SiteStats> {
  const posts = await allPosts();
  return {
    count: posts.length,
    chars: posts.reduce((s, p) => s + cjkCount(p), 0),
    tokens: posts.reduce((s, p) => s + p.data.tokens_in + p.data.tokens_out, 0),
  };
}

/** 文章页头与生成记录的展示数据 */
export interface PostView {
  no: string;
  chars: number;
  minutes: number;
  tokens: number;
}

export function postView(post: Post, postsAsc: Post[]): PostView {
  return {
    no: postNo(post, postsAsc),
    chars: cjkCount(post),
    minutes: readMinutes(post),
    tokens: post.data.tokens_in + post.data.tokens_out,
  };
}

/** 日期展示（等宽层） */
export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fmtDuration(s: number): string {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s`;
}

export { fmtNum };

/** 路径前缀（与 astro.config 的 base 一致；规范化为带尾斜杠：'/' 或 '/repo/'） */
export const BASE: string = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

export const SITE = {
  name: '又是一个ai生成的博客',
  nameEn: 'YET ANOTHER AI-GENERATED BLOG',
  desc: '每周两更。文章全部由 AI 生成，站长只出题与验收；每篇附完整生成遥测。',
  url: 'https://john-walks-slow.github.io/yet-another-ai-generated-blog',
} as const;
