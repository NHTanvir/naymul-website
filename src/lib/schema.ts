import { site, socials } from '@/data/site';
import { excerptOf, faqOf, toPlainText, wordsIn, type Post } from '@/lib/posts';

const abs = (path: string, base: string) => new URL(path, base).href;

/** The author/publisher node. Declared once and referenced by `@id` elsewhere. */
export function personSchema(base: string) {
  return {
    '@type': 'Person',
    '@id': `${base}#person`,
    name: site.name,
    url: base,
    jobTitle: 'Software Engineer',
    description: site.description,
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: site.location },
    sameAs: socials.map((s) => s.href).filter((href) => href.startsWith('http')),
  };
}

export function websiteSchema(base: string) {
  return {
    '@type': 'WebSite',
    '@id': `${base}#website`,
    url: base,
    name: site.name,
    description: site.description,
    inLanguage: 'en-US',
    publisher: { '@id': `${base}#person` },
  };
}

export function breadcrumbSchema(base: string, trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${trail[trail.length - 1]?.url ?? base}#breadcrumb`,
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage built from the post's own question headings.
 *
 * This is the part answer engines quote: a question they were asked, matched to
 * an answer that is already plain prose on the page.
 */
export function faqSchema(post: Post, permalink: string) {
  const faqs = faqOf(post);
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${permalink}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** The tool a post is about, when its front matter gives at least a name and a repository. */
function softwareOf(post: Post) {
  const software = post.data.software;
  return software?.name && software.repository ? software : null;
}

/**
 * SoftwareSourceCode for the open-source tool a post is about. The BlogPosting
 * points at it with `about`, so the article and the repository are one entity.
 */
export function softwareSchema(post: Post, permalink: string, base: string) {
  const software = softwareOf(post);
  if (!software) return null;
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${permalink}#software`,
    name: software.name,
    ...(software.description ? { description: software.description } : {}),
    url: software.repository,
    codeRepository: software.repository,
    ...(software.language ? { programmingLanguage: software.language } : {}),
    ...(software.license ? { license: `https://spdx.org/licenses/${software.license}.html` } : {}),
    author: { '@id': `${base}#person` },
  };
}

export function blogPostingSchema(post: Post, permalink: string, base: string, imageUrl?: string) {
  const { title, publishedDate, category, tags } = post.data;
  return {
    '@type': 'BlogPosting',
    '@id': `${permalink}#article`,
    isPartOf: { '@id': `${abs('/blogs/', base)}#blog` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': permalink },
    url: permalink,
    headline: title.slice(0, 110),
    name: title,
    description: excerptOf(post, 40),
    articleBody: toPlainText(post.body ?? '').slice(0, 5000),
    wordCount: wordsIn(post),
    datePublished: publishedDate.toISOString(),
    dateModified: publishedDate.toISOString(),
    inLanguage: 'en-US',
    articleSection: category,
    keywords: tags.join(', '),
    author: { '@id': `${base}#person` },
    publisher: { '@id': `${base}#person` },
    ...(softwareOf(post) ? { about: { '@id': `${permalink}#software` } } : {}),
    ...(imageUrl
      ? { image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 } }
      : {}),
  };
}

export function blogSchema(posts: Post[], base: string, blogUrl: string) {
  return {
    '@type': 'Blog',
    '@id': `${blogUrl}#blog`,
    url: blogUrl,
    name: `${site.name} — Blog`,
    description:
      'Writing about React, Node.js, AI, WordPress, and what I learn while shipping real software.',
    inLanguage: 'en-US',
    publisher: { '@id': `${base}#person` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${abs(`/${post.id}/`, base)}#article`,
      url: abs(`/${post.id}/`, base),
      headline: post.data.title.slice(0, 110),
      description: excerptOf(post, 40),
      datePublished: post.data.publishedDate.toISOString(),
      author: { '@id': `${base}#person` },
    })),
  };
}
