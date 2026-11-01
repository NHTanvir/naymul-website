import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string().optional().default(''),
      publishedDate: z.coerce.date(),
      category: z.string().optional().default('Uncategorized'),
      tags: z.array(z.string()).optional().default([]),
      cover: image().optional().nullable(),
      coverAlt: z.string().optional().default(''),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { posts };
