import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts } from '../lib/drafts';
import { entrySlug } from '../lib/slugify';
import { siteConfig } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = excludeDrafts(await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${entrySlug(post.id, post.data.slug)}/`,
    })),
  });
}
