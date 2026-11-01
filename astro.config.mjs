// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

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
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
