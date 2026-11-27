import type { ImageMetadata } from 'astro';

/**
 * The ONLY shape the homepage knows about an article.
 * The presentation layer (ArticleCard / BlogSlider) depends on this type alone, never on where
 * the data comes from — Astro content collection today; an API, a CMS or the future standalone
 * blog's feed tomorrow. A new source only has to return `Article[]` (see `ArticleSource`).
 */
export interface ArticleImage {
  /** An imported/optimised Astro image, or a plain URL string (e.g. from an API or CMS). */
  src: ImageMetadata | string;
  /** Empty string = purely decorative. */
  alt: string;
  /** Needed only for string URLs, to reserve space and avoid layout shift. */
  width?: number;
  height?: number;
}

export interface Article {
  /** URL-safe identifier; appended to the blog base URL. */
  slug: string;
  title: string;
  /** Short description / excerpt. */
  description: string;
  publishedAt: Date;
  category?: string;
  tags?: string[];
  /** Whole minutes. Leave undefined when it cannot be determined — nothing is shown then. */
  readingTimeMinutes?: number;
  image?: ArticleImage;
  /** Explicit destination. Overrides the URL derived from the blog config. */
  url?: string;
}

/** Anything that can supply articles to the homepage. */
export type ArticleSource = () => Promise<Article[]>;
