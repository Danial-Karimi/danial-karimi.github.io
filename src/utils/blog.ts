import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '@/data/site';
import { readingTimeMinutes } from './format';

export type BlogPost = CollectionEntry<'blog'>;

/** Published, non-draft posts (publication date not in the future), newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const now = new Date();
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.pubDate <= now);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Link target for a post, or `null` while the blog pages do not exist yet
 * (see `siteConfig.features.blogPages`). Cards render as plain content when null.
 */
export function postHref(post: BlogPost): string | null {
  return siteConfig.features.blogPages ? `/blog/${post.id}/` : null;
}

export function postReadingMinutes(post: BlogPost): number {
  return post.data.readingTime ?? readingTimeMinutes(post.body ?? '');
}

/** One featured post (explicit `featured: true`, else the newest) plus up to three recent ones. */
export function pickHomepagePosts(posts: BlogPost[]): { featured: BlogPost | null; recent: BlogPost[] } {
  const featured = posts.find((post) => post.data.featured) ?? posts[0] ?? null;
  const recent = posts.filter((post) => post !== featured).slice(0, 3);
  return { featured, recent };
}
