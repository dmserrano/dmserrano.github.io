import { z } from 'zod';

export const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  slug: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  description: z.string(),
});

export const pageSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  description: z.string(),
});
