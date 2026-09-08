export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function entrySlug(id: string, frontmatterSlug?: string): string {
  if (frontmatterSlug) return slugify(frontmatterSlug);
  const filename = id.split('/').pop() ?? id;
  return slugify(filename.replace(/\.mdx?$/, ''));
}
