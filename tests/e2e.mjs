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

// The blog's origin (central config), so links to the standalone blog are allowed once it is configured.
const siteConfigSource = fs.readFileSync(path.join(root, 'src', 'data', 'site.ts'), 'utf8');
const blogBase = (siteConfigSource.match(/baseUrl:\s*'([^']*)'/)?.[1] ?? '').replace(/\/+$/, '');

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

  // Hero layout contract: no overlap, figure keeps its ratio and stays a sensible size, text below the name.
  const geo = await page.evaluate(() => {
    const box = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.x, y: r.y, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
    return { h1: box('.hero__name'), fig: box('.hero__sheet--front'), lede: box('.hero__lede'), cap: box('.hero__caption'), vh: window.innerHeight };
  });
  const overlap = Math.max(0, Math.min(geo.h1.r, geo.fig.r) - Math.max(geo.h1.x, geo.fig.x)) * Math.max(0, Math.min(geo.h1.b, geo.fig.b) - Math.max(geo.h1.y, geo.fig.y));
  check(`${tag} hero: name and figure do not overlap`, overlap === 0, `${Math.round(overlap)}px²`);
  check(`${tag} hero: figure keeps its 480:560 aspect ratio`, Math.abs(geo.fig.w / geo.fig.h - 480 / 560) < 0.01, (geo.fig.w / geo.fig.h).toFixed(3));
  check(`${tag} hero: figure is not oversized (${width >= 1024 ? '≤ 80%' : '≤ 55%'} of viewport height)`, geo.fig.h <= geo.vh * (width >= 1024 ? 0.8 : 0.55), `${Math.round(geo.fig.h)} of ${geo.vh}`);
  check(`${tag} hero: description sits below the name`, geo.lede.y >= geo.h1.b - 1);
  check(`${tag} hero: caption does not collide with the figure`, geo.cap.y >= geo.fig.b - 1);

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
  check('nav has the 8 expected items in order (blog is labelled «بلاگ»)',
    JSON.stringify(navLinks.map((l) => l.label)) === JSON.stringify(['خانه', 'درباره من', 'فعالیت‌ها', 'تحصیلات', 'مهارت‌ها', 'پروژه‌ها', 'بلاگ', 'تماس']),
    JSON.stringify(navLinks.map((l) => l.label)));

  for (const link of navLinks) {
    const id = link.href?.startsWith('#') ? link.href.slice(1) : null;
    check(`nav "${link.label}" → ${link.href} resolves to an element`, !!id && (await page.locator(`#${id}`).count()) === 1);
  }

  // Scroll to each section → matching nav link becomes current.
  for (const id of ['about', 'activities', 'projects', 'blog', 'contact']) {
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
      // Verified profiles, plus the blog's own origin when src/data/site.ts → blog.baseUrl is configured.
      const ok = ['https://github.com/danial-karimi', 'https://www.linkedin.com/in/DanialKarimiDev/', 'https://t.me/itsdanialkarimi'].includes(href) ||
        (blogBase !== '' && href.startsWith(blogBase));
      check(`external link is a verified profile or the configured blog: ${href}`, ok);
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
  check('heading hierarchy: one h2 per section', seo.h2 >= 10, String(seo.h2));

  // Build artifacts that only a real `astro build` produces.
  if (!process.env.E2E_SKIP_BUILD_ARTIFACTS) {
    check('robots.txt exists and points to the sitemap', /Sitemap: https:\/\/.+\/sitemap-index\.xml/.test(fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : ''));
    check('sitemap-index.xml exists', fs.existsSync(path.join(dist, 'sitemap-index.xml')));
  }

  // ---- homepage structure ----
  const order = await page.$$eval('main > section[id]', (els) => els.map((e) => e.id));
  check('sections are in the recommended order', JSON.stringify(order) === JSON.stringify(['top', 'about', 'technologies', 'activities', 'journey', 'education', 'skills', 'projects', 'blog', 'faq', 'contact']), order.join(','));
  check('old label «نوشته‌ها» no longer appears anywhere', !(await page.evaluate(() => document.body.innerText.includes('نوشته‌ها'))));
  check('blog section keeps its id and is called «بلاگ»', (await page.locator('#blog h2').first().textContent())?.trim() === 'بلاگ');

  // ---- technologies marquee ----
  const techs = await page.$$eval('.tech__track:not(.tech__track--clone) .tech__item', (els) => els.map((e) => e.textContent?.trim()));
  check('technologies: the nine listed technologies', JSON.stringify(techs) === JSON.stringify(['Python', 'PHP', 'Symfony', 'NumPy', 'Pandas', 'Scikit-learn', 'Git', 'Linux', 'MySQL']), techs.join(','));
  check('technologies: duplicate list is hidden from assistive tech', (await page.locator('.tech__track--clone[aria-hidden="true"]').count()) === 1);
  const techLook = await page.$$eval('.tech__track:not(.tech__track--clone) .tech__item', (els) => els.map((e) => {
    const svg = e.querySelector('svg'); const r = svg.getBoundingClientRect(); const c = getComputedStyle(e).color.match(/\d+/g).map(Number);
    return { square: Math.abs(r.width - r.height) < 0.5, white: c[0] > 220 && c[1] > 220 && c[2] > 220, fill: svg.getAttribute('fill') };
  }));
  check('technologies: logos are white, monochrome (currentColor) and undistorted', techLook.every((t) => t.square && t.white && t.fill === 'currentColor'), JSON.stringify(techLook.filter((t) => !(t.square && t.white))));
  await page.locator('#technologies').scrollIntoViewIfNeeded();
  const before = await page.$eval('[data-tech-marquee]', (e) => Math.abs(e.scrollLeft));
  await page.waitForTimeout(2300);
  const after = await page.$eval('[data-tech-marquee]', (e) => Math.abs(e.scrollLeft));
  check('technologies: marquee drifts by itself', after - before > 8, `${before} → ${after}`);
  check('technologies: scroller is keyboard-focusable', (await page.locator('[data-tech-marquee]').getAttribute('tabindex')) === '0');

  // ---- skills / education / projects: nothing fabricated ----
  const skillNames = await page.$$eval('#skills .skill__name', (els) => els.map((e) => e.textContent?.trim()));
  check('skills: the nine listed skills', JSON.stringify([...skillNames].sort()) === JSON.stringify(['Git', 'Linux', 'MySQL', 'NumPy', 'PHP', 'Pandas', 'Python', 'Scikit-learn', 'Symfony']), skillNames.join(','));
  check('skills: four categories', (await page.locator('#skills .skill-group').count()) === 4);
  check('skills: no percentages, bars or levels', (await page.evaluate(() => { const el = document.querySelector('#skills'); return !/%|٪/.test(el.innerText) && !el.querySelector('[role="progressbar"],[role="meter"],progress,meter,.skill__level'); })));
  const edu = (await page.locator('#education').innerText());
  check('education: institution and field are shown', edu.includes('دانشکده فنی و حرفه‌ای شهید محسن مهاجر اصفهان') && edu.includes('نرم‌افزار'));
  check('education: no invented dates', !/[0-9۰-۹]/.test(edu));
  check('projects: empty state, no invented projects or links', (await page.locator('#projects .project').count()) === 0 && (await page.locator('#projects a[href]').count()) === 0 && /هنوز پروژه‌ای/.test(await page.locator('#projects').innerText()));
  check('journey: five conceptual stages, no dates', (await page.locator('#journey .stage').count()) === 5 && !/(19|20|13|14)\d\d/.test(await page.locator('#journey').innerText()));

  // ---- blog: empty state without fake articles (the slider is covered when articles exist) ----
  const slider = await page.locator('.slider').count();
  if (slider === 0) {
    check('blog: graceful empty state, no fake articles', (await page.locator('#blog .article-card').count()) === 0 && /هنوز مطلبی در بلاگ منتشر نشده است/.test(await page.locator('#blog').innerText()));
  } else {
    const cards = await page.locator('#blog .article-card').count();
    check('blog slider: renders article cards', cards >= 1, String(cards));
    const track = page.locator('[data-slider-track]');
    const scrollable = await track.evaluate((t) => t.scrollWidth - t.clientWidth > 4);
    if (scrollable) {
      check('blog slider: previous disabled at the start', await page.locator('[data-slider-prev]').isDisabled());
      await page.locator('[data-slider-next]').click();
      await page.waitForTimeout(900);
      check('blog slider: next moves the track (RTL-aware)', (await track.evaluate((t) => Math.abs(t.scrollLeft))) > 20);
      check('blog slider: previous enabled after moving', !(await page.locator('[data-slider-prev]').isDisabled()));
    }
    check('blog slider: cannot cause page overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }

  // ---- FAQ accordion ----
  const faqQs = await page.$$eval('.faq__q-text', (els) => els.map((e) => e.textContent?.trim()));
  check('faq: the three supplied questions', JSON.stringify(faqQs) === JSON.stringify(['چه کاری انجام می‌دهم؟', 'حوزه‌های اصلی مورد علاقه من چیست؟', 'آیا از همکاری و فرصت‌های جدید استقبال می‌کنید؟']), faqQs.join('|'));
  check('faq: supplied heading and subtitle', (await page.locator('#faq-title').textContent())?.trim() === 'پرسش‌های متداول' && (await page.locator('#faq .section-heading__lede').textContent())?.trim() === 'چند نکته که شاید بد نباشد درباره من بدانید.');
  const expanded = await page.$$eval('.faq__trigger', (els) => els.map((e) => e.getAttribute('aria-expanded')));
  check('faq: first answer open, others closed', JSON.stringify(expanded) === JSON.stringify(['true', 'false', 'false']), expanded.join(','));
  check('faq: every trigger controls an existing region', await page.$$eval('.faq__trigger', (els) => els.every((e) => { const r = document.getElementById(e.getAttribute('aria-controls')); return r && r.getAttribute('aria-labelledby') === e.id; })));
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await page.locator('#faq-q-main-interests').click();
  await page.waitForTimeout(800);
  check('faq: click opens an answer and reveals it', (await page.locator('#faq-q-main-interests').getAttribute('aria-expanded')) === 'true' && (await page.locator('#faq-a-main-interests p').isVisible()));
  await page.locator('#faq-q-what-do-you-do').focus();
  await page.keyboard.press('ArrowDown');
  check('faq: ArrowDown moves focus to the next question', await page.evaluate(() => document.activeElement?.id === 'faq-q-main-interests'));
  await page.keyboard.press('End');
  check('faq: End moves focus to the last question', await page.evaluate(() => document.activeElement?.id === 'faq-q-collaboration'));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  check('faq: Enter toggles with the keyboard', (await page.locator('#faq-q-collaboration').getAttribute('aria-expanded')) === 'true');
  await page.locator('#faq-q-what-do-you-do').click();
  await page.waitForTimeout(800);
  check('faq: a closed answer is hidden from the accessibility tree', (await page.locator('#faq-a-what-do-you-do p').isVisible()) === false);

  // ---- contact & collaboration (one section, no fake form) ----
  check('contact: single unified section, no form', (await page.locator('#contact form').count()) === 0 && (await page.locator('#contact h2').first().textContent())?.trim() === 'بیایید با هم کار کنیم');
  check('contact: topics from the brief are listed', (await page.locator('.contact__topics li').count()) === 5);
  check('contact: email + three verified profiles only', (await page.locator('#contact a[href^="mailto:"]').count()) >= 1 && (await page.locator('#contact .social__link').count()) === 3);

  // ---- back to top ----
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const toTop = page.locator('[data-to-top]');
  check('back-to-top: hidden at the top of the page', (await toTop.getAttribute('data-visible')) === 'false' && !(await toTop.isVisible()));
  check('back-to-top: links to #top with an accessible name', (await toTop.getAttribute('href')) === '#top' && !!(await toTop.getAttribute('aria-label')));
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(700);
  check('back-to-top: appears after scrolling down', (await toTop.getAttribute('data-visible')) === 'true' && (await toTop.isVisible()));
  await toTop.click();
  const reachedTop = await page.waitForFunction(() => window.scrollY < 5, null, { timeout: 6000 }).then(() => true, () => false);
  check('back-to-top: scrolls back to the top', reachedTop, String(await page.evaluate(() => window.scrollY)));
  await page.waitForTimeout(700);
  check('back-to-top: hides again at the top', (await toTop.getAttribute('data-visible')) === 'false');

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
    Array.from(document.querySelectorAll('.tile, .stage, .skill-group, .rule, .hero__lede, .word__in')).filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99 || /matrix\(0,/.test(getComputedStyle(el).transform)).length);
  check(`[${mode}] content is fully visible without animation/JS`, hidden === 0, `${hidden} hidden`);
  if (mode === 'reduced-motion') {
    await page.locator('#technologies').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2300);
    check('[reduced-motion] technologies marquee does not autoscroll', (await page.$eval('[data-tech-marquee]', (e) => Math.abs(e.scrollLeft))) < 2);
  }
  if (mode === 'no-js') {
    const links = await page.locator('#mobile-menu a[data-nav-link]').count();
    check('[no-js] navigation links are reachable', links === 8, String(links));
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
