import { describe, expect, it } from 'vitest';
import { entrySlug, slugify } from './slugify';

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips non-alphanumeric characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Hello World--  ')).toBe('hello-world');
  });
});

describe('entrySlug', () => {
  it('prefers an explicit frontmatter slug', () => {
    expect(entrySlug('some-file.md', 'Custom Slug')).toBe('custom-slug');
  });

  it('falls back to the filename when no frontmatter slug is given', () => {
    expect(entrySlug('hello-world.md')).toBe('hello-world');
  });

  it('slugifies a non-slug-like filename', () => {
    expect(entrySlug('My First Post.md')).toBe('my-first-post');
  });

  it('handles collection-relative ids with subdirectories', () => {
    expect(entrySlug('nested/dir/My Post.md')).toBe('my-post');
  });
});
