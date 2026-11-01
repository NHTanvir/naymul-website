# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Portfolio and blog for naymul.com, an Astro 7 site that replaces the old WordPress theme
(`naymul-theme`). Pages are prerendered to static HTML and served from Cloudflare Workers
(static assets). The only server code is the Keystatic admin (`/keystatic`, `/api/keystatic`),
which the `@keystatic/astro` integration injects as on-demand routes.

## Commands

```sh
npm run dev      # dev server on :4321 (Astro 7 runs it as a daemon: `npx astro dev stop|status|logs`)
npm run build    # writes dist/client (static) and dist/server (Worker + generated wrangler.json)
npx wrangler deploy --dry-run   # sanity-check the Worker bundle after a build
```

There is no test suite. Verify changes with `npm run build` and by checking pages in the browser.
Restart the dev server after editing `astro.config.mjs`, `markdoc.config.mjs` or `keystatic.config.ts`.

## Architecture

- `src/layouts/BaseLayout.astro` loads fonts (self-hosted Inter, Font Awesome 6.5.1 from npm),
  global CSS, `Seo`, `Header`, `Footer`. Pass `section="home" | "blog" | "page"` so the header
  highlights the right nav item.
- Homepage: `src/pages/index.astro` composes `src/components/home/*`. Copy lives in the components;
  list data (skills, services, projects, contact/social details) lives in `src/data/*.ts`.
- Homepage CSS in `src/styles/home/*.css` was ported from the theme's `home-v2.css` and keeps its
  `mp-` class names; header/footer/blog use `nt-`. Keep these prefixes. Design tokens are in
  `src/styles/tokens.css` (`--mp-*`).
- Homepage interactions are TypeScript modules in `src/scripts/home/` (reveal, scroll-spy, effects,
  contact form). Reveal styles only apply once `body.mp-js` is set, so the page works without JS.
- Blog: posts are Markdoc files in `src/content/posts/*.mdoc`, schema in `src/content.config.ts`,
  helpers in `src/lib/posts.ts`. Drafts are visible in dev, hidden in production builds.
  `markdoc.config.mjs` removes Markdoc's wrapping `<article>` so `.nt-single__content > p` rules
  (drop cap) apply — don't remove it.
- `/wp-pond/` is a standalone landing page with its own scoped styles.

## Keep in sync

- **Post fields** are defined twice: `keystatic.config.ts` (admin UI) and `src/content.config.ts`
  (Astro validation). Change both together.
- **URLs mirror the old WordPress site**: posts at `/<slug>/` (not `/blog/<slug>/`), list at `/blogs/`,
  archives at `/category/<slug>/` and `/tag/<slug>/`. Don't move them; old links depend on them.
- **`public/wp-content/uploads/`** holds the WP Pond release files at their original WordPress paths.
  Keep the paths when adding new versions, and update the links/sizes in `src/pages/wp-pond.astro`.
  Cloudflare limits each static file to 25 MiB.

## Keystatic storage

`keystatic.config.ts` uses `local` storage in dev (writes files directly) and `github` storage in
production (commits to `NHTanvir/naymul-website`, which triggers a redeploy). The live admin needs the
GitHub App secrets listed in `.env.example`, set on the Cloudflare Worker. Never commit `.env`.

## Contact form

The site is static, so `src/scripts/home/contact.ts` opens a pre-filled `mailto:` instead of
posting to a server.
