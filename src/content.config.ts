import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Keystatic writes empty fields as '' or null, or leaves them out.
const optionalText = z.string().nullish().transform((value) => value ?? '');

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
      // The open-source tool the post is about, if any: adds SoftwareSourceCode structured data.
      software: z
        .object({
          name: optionalText,
          repository: optionalText,
          description: optionalText,
          language: optionalText,
          license: optionalText,
        })
        .nullish(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { posts };
