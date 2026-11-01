# naymul-website

Portfolio and blog for [naymul.com](https://naymul.com), built with [Astro](https://astro.build)
and [Keystatic](https://keystatic.com), deployed free on Cloudflare Workers.

The design is a port of the original WordPress theme (`naymul-theme`): same palette,
layout, animations and markup, but served as static HTML from Cloudflare's edge.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` (sections in `src/components/home/`) |
| `/blogs/` | `src/pages/blogs.astro` |
| `/<post-slug>/` | `src/pages/[slug].astro`, posts in `src/content/posts/` |
| `/category/<name>/`, `/tag/<name>/` | archive pages |
| `/wp-pond/` | `src/pages/wp-pond.astro` |
| `/rss.xml`, `/sitemap-index.xml` | feed and sitemap |
| `/keystatic` | blog admin |

Post URLs match the old WordPress permalinks (`/hello-world/`), and the WP Pond
downloads are served from their original `/wp-content/uploads/...` paths, so
existing links keep working after the switch.

## Writing a post

**On the live site:** open `https://<your-site>/keystatic`, sign in with GitHub,
then go to **Blog posts → Add**. Pressing **Save** commits the post to this repo, and
Cloudflare rebuilds and publishes it in about a minute. Tick **Draft** to keep it hidden.

**Locally:** `npm run dev`, then open http://localhost:4321/keystatic. Posts are saved
straight to `src/content/posts/` as `.mdoc` files; commit and push to publish.

Editable content that isn't a post (skills, services, projects, contact details)
lives in `src/data/`.

## Development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build with Wrangler
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys every push to `master`:
`npm run build`, then `npx wrangler deploy`. Pages are prerendered; only the
Keystatic admin and its API run as Worker code.

The live admin uses the `nhtanvir-keystatic` GitHub App. Its keys are Worker secrets
(`npx wrangler secret`), and the workflow needs the repo secret `CLOUDFLARE_API_TOKEN` plus the
repo variables `CLOUDFLARE_ACCOUNT_ID` and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.

Live at https://naymul.com (also https://naymul-website.naymulhasantanvir10.workers.dev).
