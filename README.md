# دانیال کریمی — Personal brand website

Persian (RTL) one-page personal website for **Danial Karimi** — AI engineering · backend development · software engineering.
Built with **Astro** (static output), **TypeScript**, **Tailwind CSS v4** and hand-written CSS.

**Current phase: 01 — Homepage (completed & integrated).** The full Persian project guide is in
[`PROJECT-GUIDE.md`](./PROJECT-GUIDE.md); the honest implementation status is in
[`IMPLEMENTATION-STATUS.md`](./IMPLEMENTATION-STATUS.md).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # astro check (run this before the first build)
npm run build      # static output in dist/
```

| Command             | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                                      |
| `npm run build`     | Static production build → `dist/` (`astro build`)               |
| `npm run preview`   | Serve `dist/` locally                                           |
| `npm run check`     | `astro check` — TypeScript + Astro diagnostics                  |
| `npm run typecheck` | `tsc --noEmit` for plain `.ts` files                            |
| `npm run test:e2e`  | Playwright checks against `dist/` (build first, see below)      |

Requires Node ≥ 20.3.

## Homepage sections (anchor ids)

`#top` Hero · `#about` · `#technologies` · `#activities` · `#journey` · `#education` · `#skills` · `#projects` · `#blog` · `#faq` · `#contact` · footer.
Navigation scrolls to these anchors (One Page architecture). The blog label is **«بلاگ»**; its id stays `#blog`.

## Where to edit things

All content lives in `src/data/` — components never contain it. See `PROJECT-GUIDE.md` (Persian) for exact fields.

| File                | Controls                                                                               |
| ------------------- | -------------------------------------------------------------------------------------- |
| `site.ts`           | Production domain, SEO title/description, **blog integration (`blog.baseUrl`)**, flags |
| `profile.ts`        | Name, email, positioning, hero, About, contact & collaboration copy, footer            |
| `navigation.ts`     | Nav items + `liveRoutes`                                                               |
| `activities.ts`     | Activity tiles                                                                         |
| `technologies.ts`   | Technologies marquee (monochrome white marks)                                          |
| `journey.ts`        | Development journey (conceptual stages, no dates)                                      |
| `education.ts`      | Education entries                                                                      |
| `skills.ts`         | Skills, grouped by category (no levels/percentages)                                    |
| `projects.ts`       | Projects — **empty on purpose**                                                        |
| `faq.ts`            | FAQ (owner-supplied wording)                                                           |
| `social-links.ts`   | Social links (empty URL = hidden everywhere)                                           |
| `src/content/blog/` | Markdown articles (optional; none published yet)                                       |

## Blog integration boundary

The homepage only knows the `Article` type (`src/types/article.ts`). Data flows
`articleSource` → `getHomepageArticles()` → `BlogPreview` → `BlogSlider` → `ArticleCard` (all in `src/utils/blog.ts` and `src/components/home/`).
The blog URL lives **only** in `src/data/site.ts → blog.baseUrl` (empty until the standalone blog exists — cards then render without links).
MDX, an API or a CMS can be plugged in by returning `Article[]` from a new `ArticleSource`; no UI change is needed.

## Tests

```bash
npm run build
npx playwright install chromium     # first time only
npm run test:e2e
```

Checks 320 · 360 · 390 · 430 · 768 · 1024 · 1440 · 1920 px: overflow, console errors, RTL, hero geometry (no overlap, aspect ratio, size cap),
mobile menu, anchors/links (only verified profiles + the configured blog), SEO tags, FAQ accordion, marquee, back-to-top,
reduced-motion and no-JS modes, 404 page, `robots.txt` and the sitemap. Screenshots go to `tests/screenshots/` (git-ignored).

## Deployment

Static output, no backend. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`
(Settings → Pages → Source: **GitHub Actions**). The repository must be named `danial-karimi.github.io` to be served from the domain root.
Cloudflare Pages / Vercel: build `npm run build`, output `dist`.

## Design system

Midnight navy → graphite → off-white with restrained electric blue / violet / cyan / lavender (`src/styles/tokens.css`);
Liquid Glass surfaces used sparingly (`glass.css`); Vazirmatn variable font; 12-column Swiss grid. Motion is limited and sits inside
`prefers-reduced-motion: no-preference`. Hero layout contract: one grid, no overlapping elements, figure capped by viewport height at a fixed 480:560 ratio.

## Licences

Icons: Lucide (ISC), Simple Icons (CC0), Bootstrap Icons (MIT). Font: Vazirmatn (OFL 1.1).

## Phase log

| Phase | Status | Contents |
| ----- | ------ | -------- |
| 01 — Homepage | done (build not yet run by the assistant — see status file) | Design system, all homepage sections, hero fix, blog slider + integration boundary, FAQ, back-to-top, technologies, journey, e2e tests |
| 02 — About … 08 — Final | planned | Standalone blog on a subdomain, separate pages, SEO/QA phases |
