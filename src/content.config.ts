import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageSchema, postSchema } from './content/schema';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postSchema,
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
};
