import { config, collection, fields } from '@keystatic/core';

const imageDir = {
  directory: 'src/assets/images/posts',
  publicPath: '../../assets/images/posts/',
};

export default config({
  // Locally, posts are saved straight to the files in this repo.
  // On the live site, Keystatic commits them to GitHub, which triggers a redeploy.
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'NHTanvir/naymul-website' }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Naymul' },
    navigation: {
      Content: ['posts'],
    },
  },
  collections: {
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishedDate', 'draft'],
      previewUrl: '/blog/{slug}/',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { label: 'URL slug', description: 'The post lives at /blog/<slug>/' },
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          description: 'One or two sentences shown on the blog list and in search results.',
          multiline: true,
        }),
        publishedDate: fields.date({
          label: 'Published date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        category: fields.text({ label: 'Category', defaultValue: 'Uncategorized' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        cover: fields.image({ label: 'Cover image', ...imageDir }),
        coverAlt: fields.text({ label: 'Cover image description (alt text)' }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are hidden from the live site.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Content',
          options: { image: imageDir },
        }),
      },
    }),
  },
});
