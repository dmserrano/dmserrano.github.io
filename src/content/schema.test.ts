import { describe, expect, it } from 'vitest';
import { pageSchema, postSchema } from './schema';

describe('postSchema', () => {
  it('accepts valid post frontmatter', () => {
    const result = postSchema.parse({
      title: 'Hello World',
      date: '2026-01-01',
      tags: ['meta'],
      description: 'A test post.',
    });
    expect(result.title).toBe('Hello World');
    expect(result.date).toBeInstanceOf(Date);
    expect(result.draft).toBe(false);
  });

  it('defaults draft to false and tags to an empty array', () => {
    const result = postSchema.parse({
      title: 'Hello World',
      date: '2026-01-01',
      description: 'A test post.',
    });
    expect(result.draft).toBe(false);
    expect(result.tags).toEqual([]);
  });

  it('respects an explicit draft: true', () => {
    const result = postSchema.parse({
      title: 'Draft Post',
      date: '2026-01-01',
      description: 'A test draft.',
      draft: true,
    });
    expect(result.draft).toBe(true);
  });

  it('rejects frontmatter missing a required field', () => {
    expect(() =>
      postSchema.parse({
        title: 'Missing Description',
        date: '2026-01-01',
      })
    ).toThrow();
  });
});

describe('pageSchema', () => {
  it('accepts valid page frontmatter without tags', () => {
    const result = pageSchema.parse({
      title: 'About',
      date: '2026-01-01',
      description: 'A test page.',
    });
    expect(result.draft).toBe(false);
  });
});
