#!/usr/bin/env bash
# harper prose check for posts. Advisory; not in the build.
#
# Ignored rules: UseTitleCase (headings are sentence case), SplitWords ("front
# matter"), DisjointPrefixes ("preexisting"). harper-cli reads no config file.
#
# Vocabulary goes in ~/Library/Application Support/harper-ls/dictionary.txt,
# lowercase — an uppercase-only entry breaks the lowercase form.
#
# Usage: scripts/lint-prose.sh [file ...]   (no args = all of src/content)
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

# harper exits non-zero on any lint; advisory, so pass.
harper-cli --no-color lint "${IGNORE[@]}" "${files[@]}" || true
