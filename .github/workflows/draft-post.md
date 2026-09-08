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

engine: copilot

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

1. Read the triggering issue's title and body (it was filed using the
   `post` issue template: a rough working title, freeform notes, and an
   optional "suggested tags" field).

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
     match the post's actual content/the issue's suggested tags. You may
     propose at most one new tag if nothing existing genuinely fits — don't
     invent multiple new tags in one post.
   - `draft`: always `true`. Never generate a post with `draft: false`.
   - `description`: a best-effort one-to-two sentence summary generated
     from the issue notes, even if the notes are thin. This must never be
     left as a placeholder — generate your best guess.

   Expand the issue's rough notes into full post body content in Markdown,
   underneath the frontmatter. Preserve the author's intent and voice as
   much as possible from the notes; don't invent claims, facts, or
   experiences that aren't implied by the notes.

4. Create a new branch named `post/<slug>` (using the slug from step 3) and
   add the new file at `content/posts/<slug>.md`.

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
  `content/posts/`.
- If you cannot determine enough information to produce a coherent post
  (e.g. the issue body is empty), still open a PR with your best attempt
  rather than doing nothing — a human reviewing a rough draft is better
  than silence, and the PR review step exists precisely to catch this.

## Notes

- Run `gh aw compile` to regenerate the GitHub Actions workflow after
  editing this file.
- Full spec, acceptance criteria, and permission-surface rationale: see
  `PRD.md` (Feature 1) and issue #2 in this repository.
