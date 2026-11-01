// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://naymul.com',
  trailingSlash: 'ignore',
  // Pages are prerendered to static HTML; only the Keystatic admin and its API run on the Worker.
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
