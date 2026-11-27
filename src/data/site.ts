/**
 * Site-wide configuration. Change the production domain here and every canonical URL,
 * sitemap entry, Open Graph tag, robots.txt and JSON-LD block follows.
 */
export const siteConfig = {
  /** Production origin, no trailing slash. */
  url: 'https://danial-karimi.github.io',
  lang: 'fa',
  dir: 'rtl',
  locale: 'fa_IR',
  name: 'دانیال کریمی',
  nameLatin: 'Danial Karimi',
  title: 'دانیال کریمی | مهندسی هوش مصنوعی و توسعه نرم‌افزار',
  description:
    'وب‌سایت شخصی دانیال کریمی؛ علاقه‌مند به مهندسی هوش مصنوعی، یادگیری ماشین، توسعه بک‌اند و ساخت سیستم‌های نرم‌افزاری. آشنایی با حوزه‌های فعالیت و راه‌های ارتباطی.',
  themeColor: '#050913',
  ogImage: '/images/og-default.png',
  ogImageAlt: 'Danial Karimi — AI Engineering, Backend Development, Software Engineering',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  /**
   * Feature flags. Flip a flag in the phase that ships the matching pages so cards
   * start linking to them. Until then they render as plain, non-clickable content.
   */
  features: {
    /** Legacy switch for an in-repo /blog/<slug>/ page. Ignored while `blog.baseUrl` is set. */
    blogPages: false,
  },
  /**
   * Integration boundary with the future standalone blog (e.g. on a subdomain).
   * This is the ONLY place the blog URL lives; components never hard-code it.
   *  - baseUrl: origin (and optional path) of the blog, no trailing slash. Leave '' until the blog exists:
   *    article cards then render without links and the "open the blog" link is hidden.
   *  - articlePath: where an article lives under baseUrl. "{slug}" is replaced with the article slug.
   *    Example: baseUrl 'https://blog.example.com' + '/{slug}/' → https://blog.example.com/my-post/
   */
  blog: {
    baseUrl: '' as string,
    articlePath: '/{slug}/' as string,
    /** Maximum number of articles shown in the homepage slider. */
    homepageLimit: 8,
  },
  /** Calendar used for the footer's copyright year. */
  copyrightCalendar: 'persian' as 'persian' | 'gregory',
} as const;

export type SiteConfig = typeof siteConfig;
