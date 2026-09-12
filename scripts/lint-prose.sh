#!/usr/bin/env bash
# Grammar/mechanics check for post prose, using harper (brew install harper).
#
# harper-cli takes no config file, so the house rules live here:
#   UseTitleCase       - headings on this site are sentence case by design
#   SplitWords         - wants "front matter"; Astro's own docs write "frontmatter"
#   DisjointPrefixes   - wants "preexisting" over "pre-existing"
#
# Project vocabulary (gh, aw, cli, md, frontmatter, Astro, ...) lives in the user
# dictionary at "~/Library/Application Support/harper-ls/dictionary.txt". Add a
# term there rather than widening the ignore list. Lowercase an entry unless the
# term is only ever uppercase: an uppercase-only entry makes the lowercase form
# a spelling error.
#
# Usage: scripts/lint-prose.sh src/content/posts/some-post.md [more.md ...]
#        scripts/lint-prose.sh            # every post in the collection
set -euo pipefail

if ! command -v harper-cli >/dev/null 2>&1; then
  echo "harper-cli not found. Install it with: brew install harper" >&2
  exit 127
fi

IGNORE=(
  --ignore UseTitleCase
  --ignore SplitWords
  --ignore DisjointPrefixes
)

if [ "$#" -gt 0 ]; then
  files=("$@")
else
  files=()
  while IFS= read -r f; do files+=("$f"); done < <(find src/content -name '*.md' -o -name '*.mdx' | sort)
fi

if [ "${#files[@]}" -eq 0 ]; then
  echo "No markdown files to lint." >&2
  exit 0
fi

# harper exits non-zero when it finds anything; it is advisory, so report and pass.
harper-cli --no-color lint "${IGNORE[@]}" "${files[@]}" || true
