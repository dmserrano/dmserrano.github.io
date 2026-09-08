export function excludeDrafts<T extends { data: { draft: boolean } }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.data.draft);
}
