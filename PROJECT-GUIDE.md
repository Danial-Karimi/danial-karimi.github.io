# راهنمای پروژه — وب‌سایت شخصی دانیال کریمی

این راهنما بر اساس **نسخه‌ی نهایی همین پروژه** نوشته شده است (فاز ۰۱ — تکمیل و یکپارچه‌سازی صفحه‌ی اصلی).
همه‌ی مسیرها نسبت به پوشه‌ی ریشه‌ی پروژه هستند.

---

## الف) معرفی پروژه

### معماری

- یک **وب‌سایت تک‌صفحه‌ای (One Page)** با خروجی کاملاً استاتیک. ناوبری با لنگر (`#about` و مانند آن) به بخش‌ها اسکرول می‌کند.
- **داده جدا از ظاهر است:** تمام متن‌ها و تنظیمات در `src/data/` هستند و کامپوننت‌ها فقط آن‌ها را نمایش می‌دهند.
- **جاوااسکریپت حداقلی و تدریجی (progressive):** بدون JS هم صفحه کامل خوانده می‌شود (منو، پرسش‌های متداول و اسلایدر به حالت ساده برمی‌گردند).
- **جداسازی بلاگ:** صفحه‌ی اصلی فقط یک «پیش‌نمایش» از بلاگ دارد. بلاگ کامل قرار است جدا و روی یک ساب‌دامین ساخته شود؛ مرز بین این دو در یک نقطه‌ی تنظیم (`src/data/site.ts → blog`) و یک نوع داده (`Article`) است.

### فناوری‌ها

Astro 5 (خروجی static) · TypeScript · Tailwind CSS v4 (از طریق `@tailwindcss/vite`) · CSS سفارشی · آیکون‌های Lucide (به‌صورت محلی در پروژه) · فونت Vazirmatn (از طریق `@fontsource-variable/vazirmatn`) · Playwright (فقط برای تست).

### ترتیب بخش‌ها و شناسه‌ها (id)

| ترتیب | بخش | id | فایل |
| --- | --- | --- | --- |
| ۱ | هیرو | `top` | `components/home/Hero.astro` |
| ۲ | درباره من | `about` | `IntroductionPreview.astro` |
| ۳ | فناوری‌ها (مارکی) | `technologies` | `TechnologiesMarquee.astro` |
| ۴ | حوزه‌های فعالیت | `activities` | `ActivitiesPreview.astro` |
| ۵ | مسیر رشد | `journey` | `JourneySection.astro` |
| ۶ | تحصیلات | `education` | `EducationPreview.astro` |
| ۷ | مهارت‌ها | `skills` | `SkillsPreview.astro` |
| ۸ | پروژه‌ها | `projects` | `ProjectsPreview.astro` |
| ۹ | بلاگ | `blog` | `BlogPreview.astro` (+ `BlogSlider`, `ArticleCard`) |
| ۱۰ | پرسش‌های متداول | `faq` | `FaqSection.astro` |
| ۱۱ | تماس و همکاری | `contact` | `ContactPreview.astro` |
| ۱۲ | فوتر | — | `components/layout/Footer.astro` |

> بخش بلاگ از ابتدا `id="blog"` داشته و حفظ شده است. شناسه‌ی `#articles` در سایت وجود نداشته و ساخته نشده است.

### ساختار پوشه‌ها

```
src/
├── components/
│   ├── layout/   Header, Footer, Navigation, BrandMark
│   ├── home/     بخش‌های صفحه‌ی اصلی (جدول بالا) + ActivityVisual, ArticleCard, BlogSlider
│   └── ui/       Button, GlassSurface, SectionHeading, SocialLinks, SkillItem, Icon, BackToTop
├── layouts/BaseLayout.astro   head، سئو، JSON-LD، لینک «پرش به محتوا»، هدر، فوتر، دکمه‌ی بازگشت به بالا
├── pages/                     index.astro · 404.astro · robots.txt.ts
├── data/                      همه‌ی محتوا و تنظیمات (بخش ج)
├── types/                     content.ts (انواع عمومی) · article.ts (قرارداد مقاله)
├── utils/                     blog.ts · format.ts · navigation.ts · seo.ts · social.ts · embedding-field.ts
├── content.config.ts          اسکیمای کالکشن بلاگ
├── content/blog/              فایل‌های Markdown مقاله‌ها
├── scripts/reveal.ts          نمایش تدریجی هنگام اسکرول
├── styles/                    tokens · typography · glass · layout · components · sections ·
│                              content-sections · interactive · animations   (همه از global.css import می‌شوند)
└── assets/icons/              lucide.ts · brands.ts  (آیکون‌های SVG محلی)
public/                        favicon.svg · images/og-default.png
tests/e2e.mjs                  آزمون‌های Playwright
.github/workflows/deploy.yml   استقرار خودکار روی GitHub Pages
```

---

## ب) اجرای پروژه

### پیش‌نیازها

- Node.js نسخه‌ی ۲۰.۳ یا بالاتر (`node -v`)
- npm (همراه Node نصب می‌شود)
- Git

### نصب و اجرا

```bash
npm install
npm run dev         # سرور توسعه: http://localhost:4321
npm run check       # بررسی TypeScript و Astro  (حتماً قبل از اولین build اجرا کنید)
npm run build       # خروجی نهایی در پوشه‌ی dist
npm run preview     # مشاهده‌ی خروجی build محلی
```

اسکریپت‌های موجود در `package.json`: `dev` · `build` · `preview` · `astro` · `check` · `typecheck` · `test:e2e`.

### آزمون‌های خودکار

```bash
npm run build
npx playwright install chromium     # فقط بار اول
npm run test:e2e
```

آزمون‌ها `dist/` را روی یک سرور محلی اجرا می‌کنند و در ۸ عرض (۳۲۰، ۳۶۰، ۳۹۰، ۴۳۰، ۷۶۸، ۱۰۲۴، ۱۴۴۰، ۱۹۲۰ پیکسل) بررسی می‌کنند:
سرریز افقی، خطای کنسول، جهت RTL، هندسه‌ی هیرو (بدون هم‌پوشانی)، منوی موبایل، ناوبری و لنگرها، لینک‌ها، سئو، پرسش‌های متداول،
مارکی فناوری‌ها، دکمه‌ی بازگشت به بالا، حالت کاهش حرکت و حالت بدون JS. تصاویر در `tests/screenshots/` ذخیره می‌شوند.
اگر آدرس بلاگ را در `site.ts` تنظیم کنید، آزمون لینک‌های آن را هم مجاز می‌داند.

### استقرار (GitHub Pages)

- فایل `.github/workflows/deploy.yml` با هر push به شاخه‌ی `main` سایت را می‌سازد و منتشر می‌کند.
- در GitHub: **Settings → Pages → Source = GitHub Actions**.
- نام مخزن باید `danial-karimi.github.io` باشد تا سایت روی ریشه‌ی دامنه بیاید. برای مخزن با نام دیگر، گزینه‌ی `base` در Astro لازم است (و همه‌ی مسیرهای مطلق مثل `/favicon.svg` باید اصلاح شوند).
- دامنه‌ی نهایی را فقط در `src/data/site.ts → url` عوض کنید.
- مسیرهای ساخت برای Cloudflare Pages و Vercel هم همان است: دستور `npm run build`، پوشه‌ی خروجی `dist`.

---

## ج) مدیریت محتوا

همه‌ی مواردِ زیر فقط با ویرایش فایل‌های `src/data/` عوض می‌شوند.

| می‌خواهم تغییر بدهم | فایل | کجا |
| --- | --- | --- |
| نام (فارسی/لاتین) | `profile.ts` | `name`، `nameParts` (دو بخش نمایش در هیرو)، `nameLatin` |
| عنوان حرفه‌ای | `profile.ts` | `positioning` (فارسی)، `positioningLatin` (سه برچسب لاتین) |
| متن معرفی هیرو | `profile.ts` | `hero.lede`، `hero.figureCaption` |
| درباره من | `profile.ts` | `about.heading`، `about.paragraphs` |
| عنوان و توضیح سایت (سئو) | `site.ts` | `title`، `description` |
| تحصیلات | `education.ts` | آرایه‌ی `education` |
| مهارت‌ها | `skills.ts` | آرایه‌ی `skills` (دسته‌بندی با `category`) |
| فناوری‌های مارکی | `technologies.ts` | آرایه‌ی `technologies` |
| پروژه‌ها | `projects.ts` | آرایه‌ی `projects` (اکنون خالی) |
| شبکه‌های اجتماعی | `social-links.ts` | `url` هر مورد (خالی = پنهان) |
| ایمیل | `profile.ts` | `email` (لینک `mailto` به‌طور خودکار ساخته می‌شود) |
| پرسش‌های متداول | `faq.ts` | `faqIntro` و `faqItems` |
| مسیر رشد | `journey.ts` | `journeyIntro` و `journeyStages` |
| حوزه‌های فعالیت | `activities.ts` | آرایه‌ی `activities` |
| بخش تماس و همکاری | `profile.ts` | `contact.heading`، `text`، `topicsTitle`، `topics` |
| متن فوتر | `profile.ts` | `footerBlurb` |
| منوی بالای صفحه | `navigation.ts` | `navItems` (برچسب، لنگر، مسیر آینده) |

### نمونه: تحصیلات

```ts
// src/data/education.ts
export const education: EducationEntry[] = [
  {
    id: 'shahid-mohajer-esfahan',
    institution: 'دانشکده فنی و حرفه‌ای شهید محسن مهاجر اصفهان',
    program: 'نرم‌افزار',
    // period: '…',        // اختیاری — فقط اگر تأیید شده باشد
    // description: '…',   // اختیاری
  },
];
```

### نمونه: افزودن مهارت

```ts
{ id: 'docker', name: 'Docker', category: 'ابزارها و سیستم‌ها', icon: 'docker', description: 'کانتینرسازی' }
```
`icon` باید در `src/assets/icons/brands.ts` وجود داشته باشد (نگاه کنید به «افزودن آیکون» پایین). `level` (`beginner` / `intermediate` / `advanced`)
پشتیبانی می‌شود و فقط به‌صورت برچسب متنی نمایش داده می‌شود؛ تا وقتی دقیق نیست آن را ننویسید. هیچ نوار یا درصدی در سایت وجود ندارد.

### افزودن آیکون جدید

1. SVG تک‌رنگ را از منبع معتبر بگیرید (مثلاً Simple Icons — مجوز CC0).
2. بدنه‌ی `<path>` و `viewBox` آن را به `src/assets/icons/brands.ts` اضافه کنید (کلید = نام آیکون).
3. کلید نباید با کلیدهای `lucide.ts` یکی باشد؛ اگر شد، آیکون Lucide نمایش داده می‌شود.
آیکون‌ها با `currentColor` رنگ می‌گیرند و سفیدِ تک‌رنگ نمایش داده می‌شوند (بدون فیلتر CSS).

### نمونه: افزودن پروژه (فقط پروژه‌ی واقعی و آدرس واقعی)

```ts
// src/data/projects.ts
{ id: 'my-project', title: '…', description: '…', tags: ['Python'], repoUrl: 'https://github.com/…' }
```
با اولین پروژه، حالت «خالی» خودکار با فهرست جایگزین می‌شود. `liveUrl` و `repoUrl` اختیاری‌اند.

### نکته درباره‌ی محتوای تأییدنشده

اطلاعات تحصیلی، مهارت‌ها و پروژه‌ها فقط همان چیزی است که شما تأیید کرده‌اید. مسیر رشد صراحتاً «حوزه‌ی رشد» است، نه گاه‌شمار رسمی.
پاسخ اول پرسش‌های متداول («من مهندس کامپیوتر هستم…») دقیقاً با متن شما درج شده؛ اگر با مدرک تحصیلی‌تان هم‌خوان نیست، در `faq.ts` اصلاحش کنید.

---

## د) مدیریت پیش‌نمایش بلاگ

### ساختار داده‌ی مقاله

تنها چیزی که صفحه‌ی اصلی درباره‌ی مقاله می‌داند نوع `Article` در `src/types/article.ts` است:

| فیلد | توضیح |
| --- | --- |
| `slug` | شناسه‌ی URL-safe؛ به آدرس بلاگ اضافه می‌شود |
| `title`، `description` | عنوان و خلاصه |
| `publishedAt` | تاریخ انتشار (`Date`) |
| `category`، `tags` | اختیاری |
| `readingTimeMinutes` | اختیاری؛ اگر تعیین‌پذیر نباشد چیزی نمایش داده نمی‌شود |
| `image` | اختیاری: `{ src, alt, width?, height? }` — `src` تصویر ایمپورت‌شده‌ی Astro یا یک URL متنی |
| `url` | اختیاری؛ مقصد صریح که بر آدرس ساخته‌شده از تنظیمات مقدم است |

### مسیر داده تا صفحه

```
منبع داده (articleSource در src/utils/blog.ts)
   → getHomepageArticles()        مرتب‌سازی نزولی و برش با blog.homepageLimit
   → BlogPreview.astro            حالت خالی یا اسلایدر
   → BlogSlider.astro             اسکرول-اسنپ، دکمه‌ها، نوار پیشرفت (RTL)
   → ArticleCard.astro            تصویر، دسته، تاریخ شمسی، زمان مطالعه، عنوان، توضیح، برچسب‌ها
```

منبع فعلی، کالکشن Astro در `src/content/blog/*.md` است. نمونه‌ی یک فایل:

```md
---
title: عنوان مقاله
description: خلاصه‌ی کوتاه
pubDate: 2026-12-01
category: هوش مصنوعی
tags: [یادگیری ماشین]
cover: ../../assets/images/cover.jpg   # اختیاری
coverAlt: توضیح تصویر
readingTime: 6                          # اختیاری؛ در غیر این صورت از متن محاسبه می‌شود (اگر متن خالی نباشد)
draft: false
---
متن مقاله…
```
پیش‌نویس‌ها (`draft: true`) و مقاله‌هایی با تاریخ آینده نمایش داده نمی‌شوند. اگر هیچ مقاله‌ای نباشد، حالت خالی («هنوز مطلبی در بلاگ منتشر نشده است.») دیده می‌شود. هیچ مقاله‌ی نمونه‌ای ساخته نشده است.

### آدرس بلاگ (یک جا)

```ts
// src/data/site.ts
blog: {
  baseUrl: '',            // مثلاً 'https://blog.<دامنه‌ی-شما>' — تا وقتی خالی است، کارت‌ها بدون لینک‌اند
  articlePath: '/{slug}/', // محل مقاله زیر baseUrl
  homepageLimit: 8,       // حداکثر کارت در اسلایدر
},
```
- تغییر ساب‌دامین یعنی فقط تغییر `baseUrl`. هیچ کامپوننتی آدرس بلاگ را ثابت ندارد.
- با پر شدن `baseUrl`، لینک هر کارت به `baseUrl + articlePath` می‌رود و دکمه‌ی «ورود به بلاگ» در سرتیتر بخش ظاهر می‌شود.
- پرچم قدیمی `features.blogPages` فقط برای حالتی است که صفحه‌ی `/blog/<slug>/` داخل همین مخزن ساخته شده باشد؛ تا وقتی `baseUrl` پر است نادیده گرفته می‌شود.
- توابع قدیمی `postHref`، `postReadingMinutes` و `pickHomepagePosts` در `utils/blog.ts` برای سازگاری با کدهای قبلی (مثل یک `blog/[slug].astro` محلی) نگه داشته شده‌اند.

### آمادگی برای MDX و منابع دیگر

- **MDX:** `npx astro add mdx` را اجرا کنید و الگوی `glob` در `src/content.config.ts` را به `**/[^_]*.{md,mdx}` تغییر دهید. UI و `Article` تغییری نمی‌کنند. (در این فاز انجام نشده تا وابستگی اضافه نشود.)
- **API یا CMS:** یک تابع از نوع `ArticleSource` (یعنی `() => Promise<Article[]>`) بنویسید و در `utils/blog.ts` به‌جای `collectionSource` به `articleSource` بدهید.
- **فید خود بلاگ مستقل:** می‌توان در زمان build یک فید JSON/RSS را خواند و به `Article[]` نگاشت کرد.

---

## هـ) شخصی‌سازی طراحی

| می‌خواهم عوض کنم | کجا |
| --- | --- |
| رنگ‌ها | `src/styles/tokens.css` — پالت خام (`--ink-*`, `--blue`, `--violet`, `--cyan`, `--lavender`, `--paper`) و نقش‌های معنایی (`--bg`, `--fg`, `--fg-muted`, `--line`, `--accent`). بخش بلاگ با `.theme-paper` همین نقش‌ها را روشن می‌کند. |
| اندازه‌ی متن‌ها | `src/styles/typography.css` — توکن‌های `--text-display` تا `--text-meta` و ارتفاع خط‌ها |
| فونت | `@fontsource-variable/vazirmatn` در `BaseLayout.astro`؛ برای فونت محلی فایل `.woff2` را در `public/fonts/` بگذارید، `@font-face` را در `typography.css` بنویسید و import را حذف کنید |
| لوگو | `components/layout/BrandMark.astro` و `public/favicon.svg` |
| تصویر شبکه‌های اجتماعی (OG) | `public/images/og-default.png` (۱۲۰۰×۶۳۰) |
| فاصله‌ها | `--section-space`، `--page-pad`، `--gutter` در `tokens.css` |
| گوشه‌ها و سایه‌ها | `--radius-*` و `--glass-*` در `tokens.css` |
| شیشه‌ای (Liquid Glass) | `src/styles/glass.css` |
| اندازه‌ی نام و شکل هیرو | `--text-display` در `typography.css` و بلوک Hero در `sections.css` |
| حرکت و انیمیشن | `src/styles/animations.css` (همه داخل `prefers-reduced-motion: no-preference`) |

### قرارداد چیدمان هیرو (برای جلوگیری از بازگشت مشکل قبلی)

- هیرو یک شبکه‌ی دوستونه است: ستون متن (نام، عنوان، توضیح، دکمه‌ها) و ستون شکل؛ هیچ عنصری روی عنصر دیگر نمی‌افتد.
- عرض شکل = کمینه‌ی (ستون، ۳۰rem، «ارتفاع در دسترس صفحه × ۴۸۰/۵۶۰») و `aspect-ratio` همیشه ۴۸۰:۵۶۰ می‌ماند؛ پس از ارتفاع صفحه بزرگ‌تر نمی‌شود.
- اندازه‌ی نام در دسکتاپ هم به عرض و هم به ارتفاع صفحه وابسته است.
- ورق پشتی شیشه‌ای فقط هم‌اندازه‌ی ورق جلویی است (نه کل `<figure>` که شرح هم دارد).

---

## و) توسعه‌ی آینده

### بلاگ مستقل روی ساب‌دامین (پیشنهاد)

```
danial-karimi.github.io  (این پروژه)  ──blog.baseUrl──▶  blog.<دامنه>  (پروژه‌ی Astro جداگانه)
   صفحه‌ی اصلی + اسلایدر                                  صفحه‌ی بلاگ، مقاله‌ها، دسته‌ها، برچسب‌ها
```

۱. یک پروژه‌ی Astro جدا (مخزن جدا) با Content Collections و MDX بسازید؛ آدرس هر مقاله `/{slug}/` باشد تا با `articlePath` هماهنگ بماند.
۲. دامنه/ساب‌دامین را به آن وصل کنید (DNS و تنظیم دامنه‌ی اختصاصی در GitHub Pages، Cloudflare Pages یا Vercel).
۳. `blog.baseUrl` را در `site.ts` پر کنید؛ کارت‌ها و دکمه‌ی «ورود به بلاگ» فعال می‌شوند.
۴. برای نمایش خودکار مقاله‌های بلاگ مستقل در صفحه‌ی اصلی، یک فید (JSON/RSS) در بلاگ منتشر کنید و یک `ArticleSource` بنویسید که در زمان build آن را بخواند. صفحه‌ی اصلی پس از هر انتشار باید دوباره build شود.

### کارهایی که عمداً به فاز بعد موکول شده‌اند

- خود پلتفرم بلاگ (فهرست، صفحه‌ی مقاله، دسته‌ها، برچسب‌ها، RSS)
- صفحه‌های جداگانه‌ی درباره من، فعالیت‌ها، تحصیلات، مهارت‌ها، پروژه‌ها، تماس
- بهینه‌سازی سئو، بهینه‌سازی کامل واکنش‌گرایی و کنترل کیفیت نهایی (شامل Lighthouse)
- فرم تماس (نیازمند سرویس بیرونی؛ عمداً نساخته شد)

### پیشنهاد فاز بعد

اول `npm run check`، `npm run build` و `npm run test:e2e` را روی ماشین خودتان اجرا کنید و خروجی را بررسی کنید؛ سپس راه‌اندازی پروژه‌ی بلاگ مستقل و اتصال آن از طریق `blog.baseUrl`.

---

## ز) گزارش تغییرات

### ویژگی‌های جدید

- بخش‌های جدید: فناوری‌ها (مارکی با لوگوهای تک‌رنگ سفید)، مسیر رشد (پلکان صعودی)، پروژه‌ها (حالت خالی)، پرسش‌های متداول (آکاردئون)، تماس و همکاری (ادغام‌شده)
- دکمه‌ی شناور بازگشت به بالا (با حلقه‌ی پیشرفت اسکرول)
- اسلایدر پیش‌نمایش بلاگ (اسکرول-اسنپ، لمس، RTL) + قرارداد `Article` + نقطه‌ی تنظیم آدرس بلاگ
- مهارت‌های ۹ گانه در ۴ دسته، تحصیلات با نام دقیق دانشکده و رشته
- برچسب «نوشته‌ها» در همه‌ی بخش‌ها به «بلاگ» تغییر کرد؛ «پروژه‌ها» به منو اضافه شد

### مشکلات رفع‌شده

- **هیرو:** شکل بیش از حد بزرگ بود (تا ~۷۸٪ ارتفاع صفحه)، روی نام می‌افتاد (هم‌پوشانی عمدیِ ~۶٬۵۰۰ تا ~۱۱٬۰۰۰ px²) و متن توضیح پایین‌تر از صفحه می‌رفت. اکنون شبکه‌ی یکپارچه، بدون هم‌پوشانی و با اندازه‌ی محدود به ارتفاع صفحه است.
- ورق پشتی شیشه‌ای هیرو تا زیر شرح تصویر کشیده می‌شد.
- در عرض ۳۲۰ پیکسل (فاز قبل) دکمه‌ی هدر سرریز افقی می‌ساخت؛ و آیکون بستن منو به‌دلیل هم‌نام‌بودن کلید با لوگوی X نمایش اشتباه داشت (هر دو پیش‌تر رفع شده بودند).

### فایل‌های جدید

- `IMPLEMENTATION-STATUS.md`
- `PROJECT-GUIDE.md`
- `src/components/home/ArticleCard.astro`
- `src/components/home/BlogSlider.astro`
- `src/components/home/FaqSection.astro`
- `src/components/home/JourneySection.astro`
- `src/components/home/ProjectsPreview.astro`
- `src/components/home/TechnologiesMarquee.astro`
- `src/components/ui/BackToTop.astro`
- `src/data/faq.ts`
- `src/data/journey.ts`
- `src/data/projects.ts`
- `src/data/technologies.ts`
- `src/styles/content-sections.css`
- `src/styles/interactive.css`
- `src/types/article.ts`

### فایل‌های تغییریافته

- `README.md`
- `src/assets/icons/brands.ts`
- `src/assets/icons/lucide.ts`
- `src/components/home/ActivitiesPreview.astro`
- `src/components/home/BlogPreview.astro`
- `src/components/home/ContactPreview.astro`
- `src/components/home/EducationPreview.astro`
- `src/components/home/Hero.astro`
- `src/components/home/IntroductionPreview.astro`
- `src/components/home/SkillsPreview.astro`
- `src/components/layout/Header.astro`
- `src/data/education.ts`
- `src/data/navigation.ts`
- `src/data/profile.ts`
- `src/data/site.ts`
- `src/data/skills.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/styles/components.css`
- `src/styles/global.css`
- `src/styles/layout.css`
- `src/styles/sections.css`
- `src/styles/tokens.css`
- `src/styles/typography.css`
- `src/types/content.ts`
- `src/utils/blog.ts`
- `tests/e2e.mjs`

### فایل‌های حذف‌شده

- `src/components/home/PostCard.astro`

### قابلیت‌های حفظ‌شده

معماری تک‌صفحه‌ای و لنگرها، هدر چسبان و نشانگر بخش فعال، منوی موبایل، هویت بصری (شیشه‌ای، پالت، تایپوگرافی)، شکل SVG هیرو (بدون تغییر)، حوزه‌های فعالیت، سئو (JSON-LD، OG، sitemap، robots)، تمام لینک‌های تأییدشده، حالت‌های بدون JS و کاهش حرکت.

### ادغام Git — وضعیت صادقانه

من به مخزن Git شما دسترسی نداشتم؛ پس **تغییرات محلی/commitنشده‌ی شما را ندیده و ادغام نکرده‌ام**. به‌جایش:

- یک commit پایه از «فاز ۰۱ دقیقاً همان‌طور که تحویل شد» (که با سایت منتشرشده یکی است) و تغییرات این فاز روی آن ساخته شد.
- فایل `phase-01-homepage-final.patch` تفاوت این دو را دارد (بدون `.github/workflows/deploy.yml` چون خودتان آن را ساخته‌اید).

برای ادغام امن در مخزن واقعی (هیچ‌چیز بازنویسی نمی‌شود):

```bash
git status                       # اول مطمئن شوید همه‌چیز commit یا stash شده است
git switch -c phase-01-final     # روی یک شاخه‌ی جدید کار کنید
git apply --3way --index phase-01-homepage-final.patch
git status                       # فایل‌های دارای تعارض با UU مشخص می‌شوند؛ دستی حل کنید
npm install && npm run check && npm run build
git commit -m "Phase 01: homepage completion"
```
اگر تغییراتی دارید که با این فاز تداخل دارد، خروجی `git status` و `git diff --stat` را بفرستید تا با هم ادغام شود.

### آزمون‌های انجام‌شده (نتیجه‌ی واقعی)

همه با یک رندرکننده‌ی جایگزین (نه `astro build` واقعی) و فونت پیش‌فرض سیستم در Chromium واقعی انجام شد:

- سرریز افقی: در هر ۸ عرض نیازمندی صفر.
- `tests/e2e.mjs` روی خروجی پیش‌فرض (حالت خالی بلاگ): ۱۹۹ بررسی، ۰ خطا.
- همان آزمون روی نسخه‌ی آزمایشی با مقاله‌های ساختگی (اسلایدر + آدرس بلاگ): ۲۱۰ بررسی، ۰ خطا.
- کنترل منفی: روی نسخه‌ی قدیمی، بررسی‌های هیرو شکست خوردند (هم‌پوشانی در ۱۰۲۴/۱۴۴۰/۱۹۲۰ و بزرگ‌بودن شکل در ۴۳۰/۷۶۸) و روی نسخه‌ی جدید همه ۱۱۶ بررسی هر-عرض گذشتند.
- بررسی TypeScript روی همه‌ی ماژول‌های `.ts` (با ماژول‌های مجازی Astro به‌صورت stub): فقط یک خطای ناشی از خودِ stub.

### انجام‌نشده یا تأییدنشده

- `npm install`، `npm run check`، `npm run build` و Lighthouse در محیط من اجرا نشد (بدون شبکه). خطاهای احتمالی اولین اجرا بیشتر در نوع‌های `ImageMetadata`/`<Image>` یا تایپ تگ‌های پویا هستند.
- ظاهر با فونت واقعی Vazirmatn دیده نشد؛ عرض متن‌ها کمی متفاوت خواهد بود.
- تست روی دستگاه لمسیِ واقعی انجام نشد (فقط شبیه‌سازی).
- آدرس بلاگ (`blog.baseUrl`) عمداً خالی است.
