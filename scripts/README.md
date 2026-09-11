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
