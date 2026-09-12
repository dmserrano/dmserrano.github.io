---
on:
  issues:
    types: [labeled]
    names: [post]

permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write

engine:
  id: copilot
  model: gpt-4.1

network: defaults

safe-outputs:
  create-pull-request:
    max: 1
  add-comment:
    max: 1

---

# draft-post

Turn a labeled `post` issue into a properly-formed draft blog post PR.

This workflow only ever runs once, when the `post` label is added to an
issue. Do not treat re-runs on the same issue (if they somehow happen) as a
reason to open a second PR for the same issue — check first whether a PR
referencing this issue already exists, and if so, do nothing.

## Instructions

1. The triggering issue's title and body are below. Do not fetch them.

   <issue>
   ${{ steps.sanitized.outputs.text }}
   </issue>

   It was filed using the `post` issue template: a rough working title,
   freeform notes, and an optional "suggested tags" field.

2. Read the frontmatter of every file under `src/content/posts/*.md` in
   this repository to build the current tag vocabulary — the full set of
   tags already in use across existing posts.

3. Generate a new Markdown post that satisfies the Zod schema defined in
   `src/content/schema.ts` (`postSchema`). Every field is required except
   `slug` and `tags` have defaults — but always populate `description`,
   never leave a placeholder like "TODO":

   - `title`: derived from the issue's rough working title, cleaned up.
   - `date`: the date the `post` label was applied to the issue (i.e. the
     date this workflow is running), in `YYYY-MM-DD` format.
   - `slug`: slugify the working title the same way
     `src/lib/slugify.ts`'s `slugify()` does — lowercase, non-alphanumeric
     runs collapsed to a single hyphen, leading/trailing hyphens trimmed.
     If the title doesn't slugify to anything usable (empty string), fall
     back to `post-<issue-number>`.
   - `tags`: prefer tags already present in the vocabulary from step 2 that
     match the post's actual content/the issue's suggested tags. The
     vocabulary is still bootstrapping: while it holds fewer than eight
     tags, propose as many new ones as the post genuinely needs, up to
     three per post. Past that, propose at most one new tag per post and
     only when nothing existing fits. Prefer the issue's suggested tags
     over inventing your own, and keep tags lowercase and hyphenated.
   - `draft`: always `true`. Never generate a post with `draft: false`.
   - `description`: a best-effort one-to-two sentence summary generated
     from the issue notes, even if the notes are thin. This must never be
     left as a placeholder — generate your best guess.

   If the issue's Notes field already holds finished prose — connected
   paragraphs the author has written and edited, rather than fragments —
   copy it underneath the frontmatter **verbatim**. Keep their wording,
   sentence order, headings, links, and code blocks exactly as written.
   Rewriting finished prose is the one thing this workflow must never do.

   Only when the notes are genuinely rough (bullets, fragments, a couple of
   sentences) should you expand them into full post body content in
   Markdown, preserving the author's intent and voice; don't invent claims,
   facts, or experiences that aren't implied by the notes.

4. Create a new branch named `post/<slug>` (using the slug from step 3) and
   add the new file at `src/content/posts/<slug>.md`.

5. Open a pull request via the `create-pull-request` safe output:
   - Title: the post's title.
   - Body: briefly summarize what was generated, and include the line
     `Closes #<issue-number>` (using the actual issue number) so merging
     the PR automatically closes the originating issue.

6. Post a comment on the originating issue via the `add-comment` safe
   output, linking to the pull request you just opened, so there is a
   confirmation visible from the issue itself (e.g. on a mobile device).

## Constraints

- Never set `draft: false` under any circumstance — a human always decides
  when a post goes live, by editing the frontmatter themselves after
  review.
- Never modify, close, or comment on any issue other than the one that
  triggered this run.
- Never touch any file outside of the single new file you create under
  `src/content/posts/`.
- If you cannot determine enough information to produce a coherent post
  (e.g. the issue body is empty), still open a PR with your best attempt
  rather than doing nothing — a human reviewing a rough draft is better
  than silence, and the PR review step exists precisely to catch this.
- For any GitHub read, use the `github` MCP tools. Never `gh api`, `gh issue`,
  or `gh pr` — the `gh` CLI is unauthenticated here and will fail.
- Safe outputs are tool calls, not files — writing the payload to disk does
  nothing. Every run must end in at least one of `create_pull_request`,
  `add_comment`, `missing_data`, or `noop`.
- If a read you need fails, call `missing_data` (or `noop`) explaining what
  was unavailable. Do not substitute placeholder content for real issue text.
- Do not `git push`. The `create_pull_request` tool pushes the branch; the
  token here cannot, so the attempt only wastes a turn.

## Notes

- Run `gh aw compile` to regenerate the GitHub Actions workflow after
  editing this file.
- Full spec, acceptance criteria, and permission-surface rationale: see
  `PRD.md` (Feature 1) and issue #2 in this repository.
