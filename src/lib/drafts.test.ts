import { describe, expect, it } from 'vitest';
import { excludeDrafts } from './drafts';

describe('excludeDrafts', () => {
  it('removes entries flagged as draft', () => {
    const entries = [
      { id: 'a', data: { draft: false } },
      { id: 'b', data: { draft: true } },
      { id: 'c', data: { draft: false } },
    ];
    expect(excludeDrafts(entries).map((e) => e.id)).toEqual(['a', 'c']);
  });

  it('returns all entries when none are drafts', () => {
    const entries = [
      { id: 'a', data: { draft: false } },
      { id: 'b', data: { draft: false } },
    ];
    expect(excludeDrafts(entries)).toHaveLength(2);
  });

  it('returns an empty array when everything is a draft', () => {
    const entries = [
      { id: 'a', data: { draft: true } },
      { id: 'b', data: { draft: true } },
    ];
    expect(excludeDrafts(entries)).toEqual([]);
  });
});
