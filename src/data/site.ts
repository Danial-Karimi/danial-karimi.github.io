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
    blogPages: false,
  },
  /** Calendar used for the footer's copyright year. */
  copyrightCalendar: 'persian' as 'persian' | 'gregory',
} as const;

export type SiteConfig = typeof siteConfig;
