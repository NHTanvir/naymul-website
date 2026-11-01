# CONTEXT.md — project status and handoff

Read this first. It records what was built, why, what is left, and how to pick up.
Last updated: 2026-11-01 (site deployed).

## Goal

Replace the WordPress site at **naymul.com** (theme repo: `~/Desktop/naymul-theme`) with a fast,
free-to-host Astro site that:

1. looks the same as the current site (homepage, blog list, single post),
2. has an admin backend for publishing blog posts (Keystatic),
3. includes the WP Pond page with its 3 downloads,
4. deploys free on Cloudflare.

Repo: https://github.com/NHTanvir/naymul-website (public). Local folder: `~/Desktop/naymul-website`.

## Current infrastructure (before the switch)

- naymul.com is **WordPress on Hostinger** (`server: hcdn`, PHP 8.3). DNS is at Hostinger
  (`nova/cosmos.dns-parking.com`), **not** Cloudflare.
- Old posts: only "Hello world!" (`/hello-world/`). Old pages: Home, Blogs, WP Pond, Roadmap, Docs,
  Submit a Ticket, My Tickets. Only Home, Blogs, the post and WP Pond were migrated — the others
  were plugin pages (support tickets, roadmap) and were left out on purpose.

## What is done

| Area | State |
| --- | --- |
| Homepage | Ported 1:1 from `templates/template-home.php` + `home-v2.css` + `home-v2.js` (hero, about, skills, services, projects, contact, all animations). |
| Header/footer | Rebuilt from `header.php`/`footer.php` styles; new accessible mobile drawer. |
| Blog list `/blogs/` | Ported from `home.php` + `inc/blog/post-card.php` + `blog.css`. |
| Single post `/<slug>/` | Ported from `single.php` + `blog.js`: category pill, byline, share rail, drop cap, TOC, reading progress, tags, author card, prev/next. Verified side by side against naymul.com/hello-world/. |
| Archives | `/category/<slug>/`, `/tag/<slug>/`. |
| Keystatic admin | `/keystatic`. Fields: title/slug, excerpt, date, category, tags, cover image + alt, draft, Markdoc content with images. Local storage in dev, GitHub storage in production. |
| WP Pond `/wp-pond/` | **Redesigned** (user asked for a modern, eye-catching version — it is intentionally *not* a copy of the WP page). Same copy. OS detection highlights the matching download. 3 cards equal height. |
| WP Pond files | Copied to `public/wp-content/uploads/2026/09/*.zip` and `2026/10/*.deb` — same paths as WordPress, SHA-256 verified identical to the live files. |
| SEO | Meta/OG tags, sitemap, RSS (`/rss.xml`), robots.txt, favicon, 404. |
| Contact form | Opens a pre-filled `mailto:` (no server on a static site). |
| Docs | `README.md` (usage), `CLAUDE.md` (architecture for Claude Code), this file. |
| Git | ~42 commits on `main`, all pushed. User asked for 30–40 commits; CLAUDE.md and this file were added on request afterwards. |

## What is NOT done yet (in order)

1. **Auto-deploy on push.** The site is LIVE (see "Deployment" below) but deployed manually with
   `npx wrangler deploy`. Connecting the repo in the dashboard (Workers & Pages → naymul-website →
   Settings → Builds) failed with "Cloudflare Pages was unable to be installed on your GitHub account"
   even though the GitHub App (installation 177507453, access to naymul-website only) is installed.
   Likely fix: uninstall the app on GitHub and reconnect from this Cloudflare account. Until then,
   redeploy with `npm run build && npx wrangler deploy`.
2. **Keystatic GitHub App (for the live admin).** Run the dev server with production storage, open
   `/keystatic`, follow "Create GitHub App", install it on the repo. That writes `.env` with the 4
   values in `.env.example`; add them as Worker secrets (the user should paste the secrets, or run
   `npx wrangler secret bulk .env` themselves). Until then, write posts locally via
   `npm run dev` → http://localhost:4321/keystatic and push.
3. **Point naymul.com at the new site (optional, user's call).** The domain is on Hostinger DNS.
   Either move nameservers to Cloudflare and add the domain as a Worker custom domain, or keep
   Hostinger DNS and CNAME. Not done because it takes the live WordPress site offline — confirm first.
4. Nice-to-have: a real contact form backend (e.g. a Worker route + email service), cover images for
   posts, an OG share image at `/og-default.jpg` (referenced by `Seo.astro` but not created yet).

## Deployment

- Live: **https://naymul-website.naymulhasantanvir10.workers.dev** (Worker `naymul-website`).
- Cloudflare account: naymulhasantanvir10@gmail.com (ID `e1774228c2abf7b63e62d464b564082f`).
  Wrangler is logged in on this machine via OAuth.
- KV namespace `naymul-website-session` was auto-created for the `SESSION` binding.
- Verified after deploy: all pages 200, unknown URLs 404, WP Pond downloads SHA-256 identical to naymul.com.

## Decisions worth knowing

- **Astro 7 + `@astrojs/cloudflare` 14** (Workers with static assets, not legacy Pages).
- **Fonts/icons self-hosted** (Inter variable, Font Awesome pinned to 6.5.1 to match the theme's icons).
- **Post URLs stay WordPress-style** (`/hello-world/`) so old links and SEO carry over.
- **Markdoc** (`.mdoc`) is the post format because Keystatic edits it natively.
- Post author is shown as "Naymul Hasan" with the hero photo (WordPress showed the email-like display name and a default avatar).

## How to resume

```sh
cd ~/Desktop/naymul-website
git pull
npm install
npm run dev          # http://localhost:4321 , admin at /keystatic
```

Then continue with "What is NOT done yet" above, and update this file when something changes.
