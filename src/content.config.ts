import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 内容模型 —— v2 技术极简主义
 *
 * 原则：生成记录是遥测（telemetry），不是叙事。
 * 只记录机器可客观度量的量；人工时间不可估量，不入库。
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).max(3).default([]),
    /** 生成遥测 —— 必填，文章由 AI 生成这一事实的机器侧记录 */
    model: z.string(),
    /** 生成总用时（秒）—— 机器侧 wall-clock */
    duration_s: z.number().int().positive(),
    /** 生成步数（对话轮次/推理步数） */
    steps: z.number().int().positive(),
    /** token 用量：输入/输出 */
    tokens_in: z.number().int().nonnegative(),
    tokens_out: z.number().int().nonnegative(),
    /** 是否经过人工润色（唯一保留的「人」字段——布尔，不叙事） */
    polished: z.boolean().default(false),
    /** 生成过程完整记录（markdown），提供下载 */
    transcript: z.string().optional(),
    /** 原始提示词/选题备注（构建期折叠展示） */
    prompt: z.string().optional(),
    /** 头部引言（显示在 GEN 记录与正文之间） */
    epigraph: z.string().optional(),
    /** 引言出处 */
    epigraph_src: z.string().optional(),
    draft: z.boolean().default(false),
  }),
  // 允许未来扩展 tags→taxonomy，但 v2 不做分类学
});

export const collections = { posts };
