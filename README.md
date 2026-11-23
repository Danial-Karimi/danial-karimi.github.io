# دانیال کریمی — Personal brand website

Persian (RTL) personal website for **Danial Karimi** — AI engineering · backend development · software engineering.
Built with **Astro** (static output), **TypeScript**, **Tailwind CSS v4** and hand-written CSS.

**Current phase: 01 — Homepage.** Header, hero, introduction, activities, education, skills, blog preview,
contact and footer are done. About / Activities / Education / Skills / Blog / Contact pages come in later phases;
the architecture already has the hooks for them (see [Adding the next phases](#adding-the-next-phases)).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run dev`        | Dev server with hot reload                                          |
| `npm run build`      | Static production build → `dist/` (`astro build`)                   |
| `npm run preview`    | Serve `dist/` locally                                               |
| `npm run check`      | `astro check` — TypeScript + Astro diagnostics                      |
| `npm run typecheck`  | `tsc --noEmit` for plain `.ts` files                                |
| `npm run test:e2e`   | Playwright checks against `dist/` (build first, see below)          |

Requires Node ≥ 20.3.

### End-to-end tests

```bash
npm run build
npx playwright install chromium     # first time only
npm run test:e2e
```

Serves `dist/` on a local port and checks, at **320, 360, 390, 430, 768, 1024, 1440 and 1920 px**: no horizontal
overflow, no console errors or failed requests, RTL/`lang`, one `h1`, nav and anchor targets, internal and external
links (only verified profile URLs), mobile menu (open / Escape / link closes), active-section indicator, SEO tags and
JSON-LD, `robots.txt` and the sitemap, copy-email button, skip link, reduced-motion and no-JS modes, and the 404 page.
Screenshots land in `tests/screenshots/` (git-ignored).

---

## Where to edit things

All personal content lives in `src/data/` — components never contain it.

| File                       | What it controls                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `site.ts`                  | **Production domain**, title, description, OG image, feature flags, copyright calendar         |
| `profile.ts`               | Name, email, positioning, hero text, About paragraphs, contact text, footer blurb              |
| `social-links.ts`          | Social links. **Empty `url` = hidden everywhere.** Kaggle and X are empty (not verified yet)    |
| `navigation.ts`            | Nav items (`page` for the future route, `anchor` for today's homepage section) + `liveRoutes`  |
| `activities.ts`            | The five activity tiles (title, text, icon, accent, size, mini-visual)                         |
| `education.ts`             | **Empty on purpose** — add entries and the section + future page render them                   |
| `skills.ts`                | **Empty on purpose** — grouped by `category`; `level` is optional and shown as text, never bars |
| `src/content/blog/*.md`    | Blog posts (see below)                                                                         |

### Production domain

`src/data/site.ts → siteConfig.url` is currently `https://danial-karimi.github.io` (the existing site's address).
Change it once and canonical URLs, sitemap, `robots.txt`, Open Graph and JSON-LD all follow.
The site is expected to live at the **domain root**. For a GitHub *project* page (`user.github.io/repo`) you would
also need Astro's `base` option.

### Adding a blog post

Create `src/content/blog/my-first-post.md`:

```md
---
title: عنوان نوشته
description: خلاصه‌ی کوتاه برای کارت و SEO
pubDate: 2026-12-01
category: هوش مصنوعی
featured: true            # optional — otherwise the newest post is featured
cover: ../../assets/images/my-cover.jpg   # optional, optimised by Astro
coverAlt: توضیح تصویر
readingTime: 6            # optional — computed from the body when omitted
draft: false
---

متن نوشته…
```

The homepage shows one featured post plus up to three recent ones. Drafts and posts dated in the future are skipped.
With no posts, a clean empty state is shown. Cards stay non-clickable until the blog pages exist
(`siteConfig.features.blogPages = false`), so no link ever points to a missing page.

---

## Architecture

```
src/
├── components/
│   ├── layout/   Header, Footer, Navigation, BrandMark
│   ├── home/     Hero, IntroductionPreview, ActivitiesPreview (+ActivityVisual), EducationPreview,
│   │             SkillsPreview, BlogPreview (+PostCard), ContactPreview
│   └── ui/       Button, GlassSurface, SectionHeading, SocialLinks, SkillItem, Icon
├── layouts/BaseLayout.astro     <head>, SEO, JSON-LD, skip link, Header + <main> + Footer
├── pages/                       index, 404, robots.txt.ts
├── data/                        all content & configuration (see table above)
├── content.config.ts            blog collection schema
├── types/content.ts             shared interfaces
├── utils/                       format (Persian digits/dates), seo, navigation, social, blog, embedding-field
├── scripts/reveal.ts            scroll-reveal (the only shared client script)
├── styles/                      tokens · typography · glass · layout · components · sections · animations
└── assets/icons/                vendored Lucide + brand icons
```

* **JavaScript is minimal and progressive.** Header (menu, scrolled state, active link), scroll reveal, copy-email
  and the footer year are the only scripts — small hand-written modules, no framework, no animation library.
  Without JS the page is fully readable and the nav is shown inline.
* **Styles are global CSS files**, not scoped component styles, so classes passed between components (`class="…"`)
  behave predictably. Tailwind supplies the reset, the token → utility bridge (`@theme`) and utilities such as `sr-only`.
* **Icons** are vendored (`src/assets/icons/`): real [Lucide](https://lucide.dev) paths (ISC) and official brand marks
  (GitHub, Telegram, Kaggle, X from Simple Icons, CC0; LinkedIn from Bootstrap Icons, MIT). Add one by copying its SVG
  children into the map. Keep brand and Lucide keys distinct (e.g. `x-twitter` vs. Lucide's `x`): on a collision `Icon` draws the Lucide one.

### Adding the next phases

1. Create the page (e.g. `src/pages/about.astro`) using `BaseLayout`.
2. Add its route to `liveRoutes` in `src/data/navigation.ts` (`'/about/'`).
   Every nav link, hero CTA and footer link for it switches from `#about` to `/about/` automatically.
3. Reuse the same data (`profile.about`, `activities`, `education`, `skills`) — the homepage sections are previews of them.
4. For the blog, add `src/pages/blog/[...slug].astro`, then set `features.blogPages = true` in `site.ts`.
   `BaseLayout` already accepts `ogType="article"` and extra `jsonLd` blocks for `BlogPosting`.

---

## Design system

* **Colour** (`styles/tokens.css`): midnight `#050913` → graphite → off-white `#eef0f6`; accents electric blue,
  violet, cyan and lavender, each with a job (blue = interaction & AI, violet = learning, cyan = systems,
  lavender = light/emphasis). Components use semantic roles (`--fg`, `--fg-muted`, `--line`, `--accent`);
  the blog's off-white "paper sheet" is just `.theme-paper` re-mapping those roles.
* **Liquid glass** (`styles/glass.css`): translucent fill + backdrop blur + a 1 px refracted rim + a reflection layer
  that sits *below* content. Used only on the header, hero sheet, lead activity tile and contact panel.
  Fallbacks for no `backdrop-filter` and for `prefers-reduced-transparency`.
* **Typography** (`styles/typography.css`): Vazirmatn variable (self-hosted through `@fontsource-variable/vazirmatn`),
  scale tokens from display (up to 12 rem) to metadata, Persian line-heights (body 1.95), never letter-spaced.
  Latin identifiers (email, handles, figure labels) use a system mono stack and stay LTR (`dir="ltr"`).
* **Grid**: 12 columns, start edge = right. The hero draws the real column guides; every section opens with a
  hairline carrying column ticks.
* **Motion** (`styles/animations.css`): one orchestrated hero entrance, drawn section rules, staggered activity tiles.
  Everything is inside `prefers-reduced-motion: no-preference`; hidden-until-revealed states exist only when JS runs.
* **The hero figure** is generated at build time (`utils/embedding-field.ts`, seeded): an "embedding space" with three
  clusters and one nearest-neighbour lens. Same seed → same SVG; no runtime cost.

### Fonts

`@fontsource-variable/vazirmatn` bundles Vazirmatn (SIL OFL 1.1) with the build — no external requests. To use your own
files instead, drop `.woff2` files in `public/fonts/`, declare `@font-face` in `styles/typography.css` and remove the
import from `BaseLayout.astro`.

---

## SEO

Unique Persian title and description, canonical URL, Open Graph + Twitter tags (`/images/og-default.png`, 1200×630),
`lang="fa" dir="rtl"`, Person + WebSite JSON-LD (`sameAs` = verified profiles only), `robots.txt` (generated from the
domain config) and `@astrojs/sitemap` (`/sitemap-index.xml`). The OG image uses Latin text only — regenerate it with
the Persian name once you have a design tool you like.

## Deployment

Static output — no backend. Build command `npm run build`, output directory `dist`.

* **Cloudflare Pages / Vercel**: connect the repo, use the settings above.
* **GitHub Pages**: publish `dist/` (e.g. with the official `withastro/action`). A user site (`danial-karimi.github.io`)
  needs no extra configuration.

## Facts used from the existing website

Email, GitHub, LinkedIn and Telegram URLs, the "interest in AI since adolescence" story and the goal of contributing
to projects with a positive impact. **Not used:** the old design, its placeholder testimonials, claims of mastery,
birth year and city (not confirmable as current), and the "school student" line (likely outdated).
Education and skills stay empty until confirmed.

## Licences

Code: yours. Icons: Lucide (ISC), Simple Icons (CC0), Bootstrap Icons (MIT). Font: Vazirmatn (OFL 1.1).

---

## Phase log

| Phase | Status | Contents |
| ----- | ------ | -------- |
| 01 — Homepage | ✅ | Design system, layout, all homepage sections, SEO foundation, content layer, e2e tests |
| 02 — About | ⏳ | |
| 03 — Activities | ⏳ | |
| 04 — Education | ⏳ | |
| 05 — Skills | ⏳ | |
| 06 — Blog | ⏳ | |
| 07 — Contact | ⏳ | |
| 08 — Final | ⏳ | |
