# scripts

## og-image.html

Source for `public/og.png`, the site-wide social share card (1200x630).

It is not part of the build — the PNG is committed. Regenerate after editing:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=old --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=8000 \
  --screenshot=public/og.png scripts/og-image.html
```

Then re-check the preview with LinkedIn's Post Inspector, which caches aggressively.

## lint-prose.sh

Runs [harper](https://writewithharper.com) over post markdown for mechanics —
closed compounds, Oxford commas, hyphenation, long sentences. Advisory only; it
is not wired into the build.

```
brew install harper
scripts/lint-prose.sh                  # every post in src/content
scripts/lint-prose.sh path/to/post.md  # one file
```

Harper is fast and local but has no model behind it: it is strong on compounds
and commas, and blind to tense, naming, and wrong-word errors ("interesting
about" for "interested in"). Treat a clean run as necessary, not sufficient.

Project vocabulary lives in the user dictionary at
`~/Library/Application Support/harper-ls/dictionary.txt`; the ignored rules and
the reason for each are documented at the top of the script.
