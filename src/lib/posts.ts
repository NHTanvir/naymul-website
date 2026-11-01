import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts show up in `astro dev` so you can preview them. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}

/** Estimated reading time at 220 words per minute, matching the WordPress theme. */
export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').replace(/\{%[^%]*%\}/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Plain-text excerpt: the post's own excerpt, or the first ~22 words of the body. */
export function excerptOf(post: Post, words = 22): string {
  if (post.data.excerpt) return post.data.excerpt;
  const text = (post.body ?? '')
    .replace(/\{%[^%]*%\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return text.slice(0, words).join(' ') + (text.length > words ? '…' : '');
}
