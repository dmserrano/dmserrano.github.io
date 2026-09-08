---
on:
  schedule:
    - cron: "0 9 * * 1"

permissions:
  copilot-requests: write

engine: copilot

network: defaults

safe-outputs:
  create-issue:
    max: 1

---

# link-check

Crawl the live production site and report dead links.

## Instructions

1. Crawl `https://dominicserrano.com` — the **live deployed site**, not a
   local build. This is deliberate: the goal is to catch what a real
   visitor would hit, including deploy/DNS/CDN problems that a fresh local
   build wouldn't reveal.

2. Starting from the homepage, follow every link reachable from the site
   (post pages, tag pages, the about page, etc.) — both:
   - **Internal links**: any link pointing at `dominicserrano.com` itself.
   - **External links**: any link pointing off-site that appears in post or
     page content.

3. For each link, check whether it resolves successfully. Treat as broken:
   any 4xx or 5xx HTTP response, a request timeout, or a DNS resolution
   failure. Do not treat redirects (3xx that ultimately resolve to a 2xx)
   as broken.

4. If you find one or more broken links: open exactly one issue via the
   `create-issue` safe output. Title it something like "Link check: N
   broken link(s) found". In the body, list every broken link found, and
   for each one include: the URL, the failure (status code or error type),
   and the page it was found on (the referring URL).

5. If every link resolves successfully: do nothing. Do not open an issue.
   A clean run should be silent — do not create a "0 broken links" issue.

## Constraints

- Never open more than one issue per run.
- Never open a pull request. This workflow only ever reports; it never
  writes to the repository.
- Never crawl or report on anything other than the live
  `https://dominicserrano.com` site.

## Notes

- Run `gh aw compile` to regenerate the GitHub Actions workflow after
  editing this file.
- Full spec, acceptance criteria, and permission-surface rationale: see
  `PRD.md` (Feature 2) and issue #3 in this repository.
