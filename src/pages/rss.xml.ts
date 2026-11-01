import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { excerptOf, getPosts } from '@/lib/posts';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${site.name} — Blog`,
    description: 'Writing about React, Node.js, AI, WordPress, and what I learn while shipping real software.',
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: excerptOf(post, 40),
      link: `/${post.id}/`,
      categories: [post.data.category, ...post.data.tags].filter(Boolean),
    })),
  });
}
