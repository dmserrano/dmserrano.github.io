import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts } from '../../lib/drafts';
import { renderOgCard } from '../../lib/og-card';
import { entrySlug } from '../../lib/slugify';

export const getStaticPaths = (async () => {
  const posts = excludeDrafts(await getCollection('posts'));
  return posts.map((post) => ({
    params: { slug: entrySlug(post.id, post.data.slug) },
    props: { title: post.data.title },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard({ kicker: 'Dominic Serrano · Blog', title: props.title });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
