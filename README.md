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

Cloudflare Workers Builds is connected to this repo. Every push to `master` runs
`npm run build` and `npx wrangler deploy`. Pages are prerendered; only the
Keystatic admin and its API run as Worker code.

For the live admin, Keystatic needs a GitHub App. Create it once by running
`npm run dev` with production storage and following the prompt at `/keystatic`,
then add the values from `.env.example` as secrets on the Worker
(Settings → Variables and Secrets).

Live now at https://naymul-website.naymulhasantanvir10.workers.dev. Until Workers Builds is
connected to GitHub, redeploy manually with `npm run build && npx wrangler deploy`.
