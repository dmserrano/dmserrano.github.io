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

[harper](https://writewithharper.com) over post markdown — compounds, commas,
hyphenation, long sentences. Advisory; not in the build.

```
brew install harper
scripts/lint-prose.sh                  # all of src/content
scripts/lint-prose.sh path/to/post.md  # one file
```

No model behind it: blind to tense, naming, and wrong words ("interesting about"
for "interested in"). Clean run is necessary, not sufficient.

Vocabulary lives in `~/Library/Application Support/harper-ls/dictionary.txt`.
Ignored rules are listed at the top of the script.
