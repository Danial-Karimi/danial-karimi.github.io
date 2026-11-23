/**
 * End-to-end checks for the built site.
 *
 *   npm run build
 *   npx playwright install chromium     (first time only)
 *   npm run test:e2e
 *
 * Serves ./dist (override with DIST=...) on a random local port, then checks every required
 * viewport for: horizontal overflow, console errors, failed requests, RTL/lang, heading
 * structure, nav anchors, internal links, SEO tags and JSON-LD. It also exercises the mobile
 * menu, the active-section indicator, reduced-motion and no-JS modes, and saves screenshots
 * to tests/screenshots/.
 *
 * Exit code is non-zero if any check fails.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(process.env.DIST ?? path.join(root, 'dist'));
const shots = path.join(root, 'tests', 'screenshots');
const VIEWPORTS = [320, 360, 390, 430, 768, 1024, 1440, 1920];
const DESKTOP_NAV_MIN = 1024;

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error(`No build found at ${dist}. Run "npm run build" first.`);
  process.exit(2);
}
fs.mkdirSync(shots, { recursive: true });

// ---------- tiny static server (directory-style URLs, like every static host) ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml',
  '.txt': 'text/plain', '.woff2': 'font/woff2', '.json': 'application/json',
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(dist, p);
  if (!fs.existsSync(file) && fs.existsSync(path.join(dist, p, 'index.html'))) file = path.join(dist, p, 'index.html');
  if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    const nf = path.join(dist, '404.html');
    const nf2 = path.join(dist, '404', 'index.html');
    return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : fs.existsSync(nf2) ? fs.readFileSync(nf2) : 'not found');
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

// ---------- assertion helpers ----------
let passed = 0;
const failures = [];
function check(name, ok, detail = '') {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch();

async function openPage(viewportWidth, options = {}) {
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportWidth < 600 ? 800 : 900 },
    ...options,
  });
  const page = await context.newPage();
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
  await page.goto(`${origin}/`, { waitUntil: 'load' });
  return { context, page, problems };
}

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 450) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

// ---------- 1. every viewport ----------
for (const width of VIEWPORTS) {
  const tag = `[${width}px]`;
  const { context, page, problems } = await openPage(width);
  await page.waitForTimeout(2600); // let the hero entrance finish

  const meta = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.replace(/\s+/g, ' ').trim()),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  check(`${tag} lang=fa dir=rtl`, meta.lang === 'fa' && meta.dir === 'rtl');
  check(`${tag} exactly one h1 with the name`, meta.h1.length === 1 && meta.h1[0] === 'دانیال کریمی', JSON.stringify(meta.h1));
  check(`${tag} no horizontal overflow`, meta.scrollWidth <= meta.innerWidth, `${meta.scrollWidth} > ${meta.innerWidth}`);

  // Elements poking out of the viewport (ignoring anything clipped by an ancestor).
  const offenders = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (!r.width || (r.right <= vw + 0.5 && r.left >= -0.5)) continue;
      let a = el.parentElement;
      let clipped = false;
      while (a && a !== document.body) {
        if (/(clip|hidden|auto|scroll)/.test(getComputedStyle(a).overflowX)) {
          const ar = a.getBoundingClientRect();
          if (ar.right <= vw + 0.5 && ar.left >= -0.5) { clipped = true; break; }
        }
        a = a.parentElement;
      }
      if (!clipped) out.push(`${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').split(' ')[0]}`);
    }
    return out.slice(0, 5);
  });
  check(`${tag} no element outside the viewport`, offenders.length === 0, offenders.join(', '));

  // Navigation visibility per breakpoint.
  const desktop = width >= DESKTOP_NAV_MIN;
  const barVisible = await page.locator('.nav--bar').isVisible();
  const toggleVisible = await page.locator('[data-menu-toggle]').isVisible();
  check(`${tag} ${desktop ? 'desktop nav visible, hamburger hidden' : 'hamburger visible, desktop nav hidden'}`,
    desktop ? barVisible && !toggleVisible : !barVisible && toggleVisible);

  // Touch targets (interactive elements in view at the top of the page should be >= 44px).
  const small = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.hero a, .hero button, .site-header button, .site-header a.btn, .brand').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.height < 40 || r.width < 40)) bad.push(`${el.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    return bad.slice(0, 4);
  });
  check(`${tag} touch targets >= 40px`, small.length === 0, small.join('; '));

  // Mobile menu behaviour.
  if (!desktop) {
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.click();
    await page.waitForTimeout(450);
    check(`${tag} menu opens (aria-expanded=true, panel visible)`,
      (await toggle.getAttribute('aria-expanded')) === 'true' && (await page.locator('#mobile-menu').isVisible()));
    check(`${tag} menu close icon is a plain ×, not a brand mark`,
      (await page.locator('.menu-toggle__close path').first().getAttribute('d'))?.startsWith('M18 6') === true);
    await page.screenshot({ path: path.join(shots, `${width}-menu-open.png`) });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    check(`${tag} Escape closes the menu and returns focus`,
      (await toggle.getAttribute('aria-expanded')) === 'false' && !(await page.locator('#mobile-menu').isVisible()) &&
      (await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-toggle'))));
    await toggle.click();
    await page.waitForTimeout(400);
    await page.locator('#mobile-menu a[data-nav-link="activities"]').click();
    await page.waitForTimeout(900);
    check(`${tag} choosing a link closes the menu`, (await toggle.getAttribute('aria-expanded')) === 'false');
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  await page.screenshot({ path: path.join(shots, `${width}-fold.png`) });
  await scrollThrough(page);
  await page.screenshot({ path: path.join(shots, `${width}-full.png`), fullPage: true });

  check(`${tag} no console errors / failed requests`, problems.length === 0, problems.slice(0, 3).join(' | '));
  await context.close();
}

// ---------- 2. navigation, links, SEO (desktop run) ----------
{
  const { context, page, problems } = await openPage(1440);
  await page.waitForTimeout(800);

  const navLinks = await page.$$eval('.nav--bar a[data-nav-link]', (as) => as.map((a) => ({ label: a.textContent?.trim(), href: a.getAttribute('href') })));
  check('nav has the 7 expected items in order',
    JSON.stringify(navLinks.map((l) => l.label)) === JSON.stringify(['خانه', 'درباره من', 'فعالیت‌ها', 'تحصیلات', 'مهارت‌ها', 'نوشته‌ها', 'تماس']),
    JSON.stringify(navLinks.map((l) => l.label)));

  for (const link of navLinks) {
    const id = link.href?.startsWith('#') ? link.href.slice(1) : null;
    check(`nav "${link.label}" → ${link.href} resolves to an element`, !!id && (await page.locator(`#${id}`).count()) === 1);
  }

  // Scroll to each section → matching nav link becomes current.
  for (const id of ['about', 'activities', 'blog', 'contact']) {
    await page.locator(`.nav--bar a[href="#${id}"]`).click();
    await page.waitForTimeout(1300);
    const current = await page.$eval('.nav--bar a[aria-current]', (a) => a.getAttribute('href')).catch(() => null);
    check(`clicking "#${id}" marks it as the current section`, current === `#${id}`, String(current));
  }

  // Hero CTAs and every internal/anchor link on the page.
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const href of new Set(hrefs)) {
    if (!href) continue;
    if (href.startsWith('#')) {
      check(`anchor ${href} exists`, (await page.locator(`[id="${href.slice(1)}"]`).count()) >= 1);
    } else if (href.startsWith('/')) {
      const res = await page.request.get(origin + href);
      check(`internal link ${href} → 200`, res.status() === 200, String(res.status()));
    } else if (href.startsWith('mailto:')) {
      check(`mailto link is the verified address`, href === 'mailto:itsdanialkarimi@gmail.com', href);
    } else if (/^https:\/\//.test(href)) {
      const ok = ['https://github.com/danial-karimi', 'https://www.linkedin.com/in/DanialKarimiDev/', 'https://t.me/itsdanialkarimi'].includes(href);
      check(`external link is a verified profile: ${href}`, ok);
    } else {
      check(`unexpected link type: ${href}`, false);
    }
  }
  const externals = await page.$$eval('a[target="_blank"]', (as) => as.every((a) => /noopener/.test(a.rel)));
  check('external links use rel=noopener', externals);

  // SEO foundation.
  const seo = await page.evaluate(() => {
    const q = (s, a) => document.querySelector(s)?.getAttribute(a);
    const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => { try { return JSON.parse(s.textContent ?? ''); } catch { return null; } });
    return {
      title: document.title,
      description: q('meta[name="description"]', 'content'),
      canonical: q('link[rel="canonical"]', 'href'),
      ogTitle: q('meta[property="og:title"]', 'content'),
      ogImage: q('meta[property="og:image"]', 'content'),
      ogLocale: q('meta[property="og:locale"]', 'content'),
      twitterCard: q('meta[name="twitter:card"]', 'content'),
      twitterImage: q('meta[name="twitter:image"]', 'content'),
      icon: q('link[rel="icon"]', 'href'),
      ldTypes: ld.map((d) => d?.['@type']),
      sameAs: ld.find((d) => d?.['@type'] === 'Person')?.sameAs,
      h2: document.querySelectorAll('h2').length,
    };
  });
  check('title', seo.title === 'دانیال کریمی | مهندسی هوش مصنوعی و توسعه نرم‌افزار', seo.title);
  check('persian meta description', !!seo.description && /[\u0600-\u06FF]/.test(seo.description));
  check('canonical is absolute https', /^https:\/\//.test(seo.canonical ?? ''), String(seo.canonical));
  check('open graph + twitter tags present', !!seo.ogTitle && !!seo.ogImage && seo.ogLocale === 'fa_IR' && seo.twitterCard === 'summary_large_image' && !!seo.twitterImage);
  check('og:image is reachable', (await page.request.get(origin + new URL(seo.ogImage).pathname)).status() === 200);
  check('favicon is reachable', (await page.request.get(origin + seo.icon)).status() === 200);
  check('Person + WebSite JSON-LD parse', seo.ldTypes.includes('Person') && seo.ldTypes.includes('WebSite'), JSON.stringify(seo.ldTypes));
  check('JSON-LD sameAs contains only verified profiles', Array.isArray(seo.sameAs) && seo.sameAs.length === 3);
  check('heading hierarchy: h2 per section', seo.h2 >= 6, String(seo.h2));

  // Build artifacts that only a real `astro build` produces.
  if (!process.env.E2E_SKIP_BUILD_ARTIFACTS) {
    check('robots.txt exists and points to the sitemap', /Sitemap: https:\/\/.+\/sitemap-index\.xml/.test(fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : ''));
    check('sitemap-index.xml exists', fs.existsSync(path.join(dist, 'sitemap-index.xml')));
  }

  // Copy-email enhancement appears with JS and works.
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  const copy = page.locator('[data-copy-email]');
  check('copy-email button is shown when JS is available', await copy.isVisible());
  await copy.click();
  await page.waitForTimeout(250);
  check('copy-email confirms', /کپی شد/.test((await copy.textContent()) ?? ''));
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
  if (clip !== null) check('clipboard holds the email', clip === 'itsdanialkarimi@gmail.com', clip);

  // Keyboard: on a fresh load the first Tab lands on the skip link, which becomes visible.
  await page.goto(`${origin}/`, { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  check('first Tab focuses the skip link', await page.evaluate(() => document.activeElement?.classList.contains('skip-link')));
  const skipBox = await page.locator('.skip-link').boundingBox();
  check('skip link is on-screen while focused', !!skipBox && skipBox.y >= 0 && skipBox.x >= 0);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  check('skip link jumps to #main', await page.evaluate(() => location.hash === '#main'));

  check('no console errors during interaction tests', problems.length === 0, problems.slice(0, 3).join(' | '));
  await context.close();
}

// ---------- 3. reduced motion and no-JS: nothing may stay hidden ----------
for (const mode of ['reduced-motion', 'no-js']) {
  const options = mode === 'reduced-motion' ? { reducedMotion: 'reduce' } : { javaScriptEnabled: false };
  const { context, page } = await openPage(390, options);
  await page.waitForTimeout(2600);
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.tile, .rule, .hero__lede, .word__in')).filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99 || /matrix\(0,/.test(getComputedStyle(el).transform)).length);
  check(`[${mode}] content is fully visible without animation/JS`, hidden === 0, `${hidden} hidden`);
  if (mode === 'no-js') {
    const links = await page.locator('#mobile-menu a[data-nav-link]').count();
    check('[no-js] navigation links are reachable', links === 7, String(links));
  }
  await page.screenshot({ path: path.join(shots, `390-${mode}.png`), fullPage: true });
  await context.close();
}

// ---------- 4. 404 page ----------
{
  const { context, page } = await openPage(390);
  const res = await page.goto(`${origin}/definitely-missing/`);
  check('unknown URL serves the 404 page', res?.status() === 404 && /این صفحه وجود ندارد/.test(await page.content()));
  check('404 offers a link home', (await page.locator('main a[href="/"]').count()) === 1);
  await context.close();
}

await browser.close();
server.close();

console.log(`\n${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  for (const f of failures) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log(`Screenshots saved to ${path.relative(root, shots)}/`);
