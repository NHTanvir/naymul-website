// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { readdirSync, readFileSync } from 'node:fs';

/**
 * Last-modified date for every published post URL, read from the posts' front
 * matter (updatedDate when set, otherwise publishedDate). The sitemap uses it as
 * <lastmod>, which tells search engines which pages changed and are worth recrawling.
 */
function postLastModified() {
  const dir = new URL('./src/content/posts/', import.meta.url);
  const dates = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.mdoc')) continue;
    const front = readFileSync(new URL(file, dir), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(front)) continue;
    const date = (field) => front.match(new RegExp(`^${field}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
    const lastmod = [date('updatedDate'), date('publishedDate')].filter(Boolean).sort().pop();
    if (lastmod) dates.set(`/${file.replace(/\.mdoc$/, '')}/`, lastmod);
  }
  return dates;
}
const lastModified = postLastModified();

// `astro dev` runs on Node without the Cloudflare adapter: Keystatic's local storage
// (saving posts straight to src/content) needs Node's filesystem, which the Workers
// runtime doesn't have. Builds always use the adapter.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://naymul.com',
  trailingSlash: 'ignore',
  // Pages are prerendered to static HTML; only the Keystatic admin and its API run on the Worker.
  output: 'static',
  adapter: isDev ? undefined : cloudflare({ imageService: 'compile' }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
      serialize(item) {
        const lastmod = lastModified.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
