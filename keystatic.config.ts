import { config, collection, fields } from '@keystatic/core';

export default config({
  // Locally, posts are saved straight to the files in this repo.
  // On the live site, Keystatic commits them to GitHub, which triggers a redeploy.
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'NHTanvir/naymul-website' }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Naymul' },
  },
  collections: {
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishedDate'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
