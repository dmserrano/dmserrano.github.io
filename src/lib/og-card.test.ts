import { describe, expect, it } from 'vitest';
import { renderOgCard, titleFontSize } from './og-card';

describe('titleFontSize', () => {
  it('uses the largest size for short titles', () => {
    expect(titleFontSize('Hello, World')).toBe(84);
  });

  it('steps down for longer titles', () => {
    expect(titleFontSize('Using GitHub Agentic Workflows to publish blog posts')).toBe(68);
    expect(titleFontSize('x'.repeat(71))).toBe(56);
  });
});

describe('renderOgCard', () => {
  it('renders a 1200x630 PNG', async () => {
    const png = await renderOgCard({ kicker: 'Blog', title: 'Using GitHub Agentic Workflows to publish blog posts' });
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
    // IHDR width and height are big-endian uint32s at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});
