import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '@/data/site';
import type { Article, ArticleSource } from '@/types/article';
import { readingTimeMinutes } from './format';

/* ==========================================================================
   1. Blog URL resolution — the single integration point with the future blog
   ========================================================================== */

const trimSlash = (value: string) => value.replace(/\/+$/, '');

/** Absolute URL of the blog's home, or `null` while no blog is configured. */
export function blogHomeUrl(): string | null {
  const base = siteConfig.blog.baseUrl.trim();
  return base ? `${trimSlash(base)}/` : null;
}

/**
 * Where an article lives, or `null` when it has no destination yet:
 *  1. explicit `article.url`
 *  2. `siteConfig.blog.baseUrl` + `articlePath` (the standalone blog / subdomain)
 *  3. legacy in-repo route `/blog/<slug>/` when `features.blogPages` is on
 */
export function articleUrl(article: Pick<Article, 'slug' | 'url'>): string | null {
  if (article.url) return article.url;
  const base = siteConfig.blog.baseUrl.trim();
  if (base) {
    const path = siteConfig.blog.articlePath.replace('{slug}', encodeURIComponent(article.slug));
    return `${trimSlash(base)}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return siteConfig.features.blogPages ? `/blog/${article.slug}/` : null;
}

/* ==========================================================================
   2. Article sources (adapters). Swap `articleSource` to change where data comes from.
   ========================================================================== */

export type BlogPost = CollectionEntry<'blog'>;

/** Published, non-draft posts (publication date not in the future), newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const now = new Date();
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.pubDate <= now);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Reading time is shown only when it is real: explicit front-matter value, or computed from a non-empty body. */
function readingTimeFor(post: BlogPost): number | undefined {
  if (post.data.readingTime) return post.data.readingTime;
  const body = post.body?.trim();
  return body ? readingTimeMinutes(body) : undefined;
}

export function postToArticle(post: BlogPost): Article {
  const { title, description, pubDate, category, tags, cover, coverAlt } = post.data;
  return {
    slug: post.id,
    title,
    description,
    publishedAt: pubDate,
    category,
    tags,
    readingTimeMinutes: readingTimeFor(post),
    image: cover ? { src: cover, alt: coverAlt } : undefined,
  };
}

/**
 * Default source: the Astro content collection in src/content/blog (Markdown today).
 * Future sources just need to return `Article[]`, for example:
 *   - MDX: enable `@astrojs/mdx`, widen the glob in src/content.config.ts — nothing else changes.
 *   - API / CMS: `const apiSource: ArticleSource = async () => (await fetch(URL)).json().then(map)`.
 *   - The standalone blog's own feed (RSS/JSON) fetched at build time.
 */
export const collectionSource: ArticleSource = async () => (await getPublishedPosts()).map(postToArticle);

/** The source used by the homepage. */
export const articleSource: ArticleSource = collectionSource;

/** Newest-first articles for the homepage slider, capped by `siteConfig.blog.homepageLimit`. */
export async function getHomepageArticles(): Promise<Article[]> {
  const all = await articleSource();
  return all
    .slice()
    .sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
    .slice(0, siteConfig.blog.homepageLimit);
}

/* ==========================================================================
   3. Backwards-compatible helpers (used by earlier code such as a local /blog/[slug] page)
   ========================================================================== */

export function postHref(post: BlogPost): string | null {
  return articleUrl({ slug: post.id });
}

export function postReadingMinutes(post: BlogPost): number {
  return readingTimeFor(post) ?? 1;
}

export function pickHomepagePosts(posts: BlogPost[]): { featured: BlogPost | null; recent: BlogPost[] } {
  const featured = posts.find((post) => post.data.featured) ?? posts[0] ?? null;
  const recent = posts.filter((post) => post !== featured).slice(0, 3);
  return { featured, recent };
}
