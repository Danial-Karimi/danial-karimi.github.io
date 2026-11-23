import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog collection. Drop Markdown files into src/content/blog/ — files starting with "_"
 * are ignored. The homepage preview, and later the full blog, read from here.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /** Minutes. Computed from the body when omitted. */
      readingTime: z.number().int().positive().optional(),
    }),
});

export const collections = { blog };
