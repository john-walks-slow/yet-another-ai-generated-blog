import rss from '@astrojs/rss';
import { allPosts, fmtDuration, fmtNum, SITE } from '../lib/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await allPosts();
  return rss({
    title: SITE.name,
    description: SITE.desc,
    site: context.site ?? SITE.url,
    items: posts.map((post) => {
      const d = post.data;
      const gen = `GEN · ${d.model} · ${fmtDuration(d.duration_s)} · ${d.steps} steps · ${fmtNum(
        d.tokens_in + d.tokens_out,
      )} tok · ${d.polished ? 'polished' : 'unpolished'}`;
      return {
        title: post.data.title,
        description: `${d.summary}\n\n${gen}`,
        pubDate: d.date,
        link: `/posts/${post.id}/`,
      };
    }),
    customData: '<language>zh-cn</language>',
  });
}
