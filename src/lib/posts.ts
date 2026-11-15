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

export { slugify } from './slug';

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

/** Markdoc/Markdown reduced to readable plain text, for meta tags and JSON-LD. */
export function toPlainText(markup: string): string {
  return markup
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\{%[^%]*%\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)[*_]([^*_]+)[*_]/g, '$1$2')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Words in the body, ignoring code blocks — for `wordCount` in structured data. */
export function wordsIn(post: Post): number {
  return toPlainText(post.body ?? '').split(/\s+/).filter(Boolean).length;
}

export interface Faq {
  question: string;
  answer: string;
}

/**
 * Question/answer pairs lifted out of a post's FAQ section.
 *
 * Looks for an `## Questions people ask` (or `## FAQ`) heading and treats every
 * `###` under it as a question. Used to emit FAQPage structured data, which is
 * what answer engines read when they quote a page.
 */
export function faqOf(post: Post): Faq[] {
  const body = post.body ?? '';
  const section = body.match(
    /^##\s+(?:questions[^\n]*|faq|frequently asked[^\n]*)\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/im,
  );
  if (!section) return [];

  const out: Faq[] = [];
  const re = /^###\s+(.+?)\s*\n([\s\S]*?)(?=^###\s|$(?![\s\S]))/gim;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section[1])) !== null) {
    const question = toPlainText(m[1]);
    const answer = toPlainText(m[2]);
    if (question && answer) out.push({ question, answer });
  }
  return out;
}
