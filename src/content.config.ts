import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    lang: z.enum(['ru', 'en']),
    title: z.string(),
    description: z.string().max(200),
    category: z.enum(['foundations', 'design', 'engineering', 'workflow']),
    level: z.enum(['beginner', 'intermediate']),
    minutes: z.number().int().positive(),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string()).min(1),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).min(1),
  }),
});

export const collections = { lessons };
