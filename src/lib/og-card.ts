import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

/**
 * Per-post social share card (1200x630), rendered at build time.
 * Mirrors the look of scripts/og-image.html, which produces the site-wide card.
 */

const WIDTH = 1200;
const HEIGHT = 630;

// satori can't read woff2, so these come from the @fontsource (woff) packages.
// Resolved from the project root, which is the cwd for both `astro build` and vitest.
const fontFile = (pkg: string, file: string) => join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file);

let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(fontFile('inter', 'inter-latin-800-normal.woff')),
    readFile(fontFile('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff')),
  ]).then(([inter, mono]) => [
    { name: 'Inter', data: inter, weight: 800 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: mono, weight: 500 as const, style: 'normal' as const },
  ]);
  return fonts;
}

type Node = { type: string; props: { style?: Record<string, unknown>; children?: Node | string | (Node | string)[] } };
const div = (style: Record<string, unknown>, children?: Node['props']['children']): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/** Long titles step down so they stay within three lines. */
export function titleFontSize(title: string): number {
  if (title.length > 70) return 56;
  if (title.length > 40) return 68;
  return 84;
}

export async function renderOgCard({ kicker, title }: { kicker: string; title: string }): Promise<Buffer> {
  const card = div(
    {
      width: WIDTH,
      height: HEIGHT,
      padding: 80,
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0b0f1a',
      fontFamily: 'Inter',
    },
    [
      div({
        position: 'absolute',
        top: 0,
        left: 0,
        width: WIDTH,
        height: 6,
        backgroundImage: 'linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%)',
      }),
      div({
        position: 'absolute',
        top: -420,
        right: -300,
        width: 900,
        height: 900,
        borderRadius: 450,
        backgroundImage:
          'radial-gradient(circle, rgba(96,165,250,0.20) 0%, rgba(34,211,238,0.07) 40%, rgba(11,15,26,0) 70%)',
      }),
      div({ flexDirection: 'column' }, [
        div(
          {
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
            color: '#22d3ee',
            letterSpacing: 3.5,
            textTransform: 'uppercase',
          },
          kicker,
        ),
        div(
          {
            marginTop: 28,
            maxWidth: 1000,
            fontSize: titleFontSize(title),
            fontWeight: 800,
            color: '#f4f4f5',
            letterSpacing: -2,
            lineHeight: 1.1,
            textWrap: 'balance',
          },
          title,
        ),
      ]),
      div({ alignItems: 'center' }, [
        div({
          width: 13,
          height: 13,
          borderRadius: 7,
          backgroundImage: 'linear-gradient(135deg, #60a5fa, #22d3ee)',
        }),
        div({ marginLeft: 18, fontFamily: 'JetBrains Mono', fontSize: 26, color: '#d4d4d8' }, 'dominicserrano.com'),
      ]),
    ],
  );

  // satori's types expect a ReactNode; a plain {type, props} tree is what it walks.
  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
}
