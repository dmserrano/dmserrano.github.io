import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { excludeDrafts } from '../lib/drafts';
import { entrySlug } from '../lib/slugify';
import { siteConfig } from '../lib/site';

const parser = new MarkdownIt({ html: true, linkify: true });

// Feed readers and cross-posters (dev.to, Medium, Hashnode) resolve URLs
// against their own domain, so root-relative links and images must be absolute.
function absolutize(url: string, site: URL | string): string {
  return url.startsWith('/') && !url.startsWith('//') ? new URL(url, site).href : url;
}

export async function GET(context: APIContext) {
  const site = context.site ?? siteConfig.url;
  const posts = excludeDrafts(await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${entrySlug(post.id, post.data.slug)}/`,
      categories: post.data.tags,
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, code: ['class'] },
        transformTags: {
          a: (tagName, attribs) => ({
            tagName,
            attribs: attribs.href ? { ...attribs, href: absolutize(attribs.href, site) } : attribs,
          }),
          img: (tagName, attribs) => ({
            tagName,
            attribs: attribs.src ? { ...attribs, src: absolutize(attribs.src, site) } : attribs,
          }),
        },
      }),
    })),
  });
}
