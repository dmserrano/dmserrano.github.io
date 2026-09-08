# PRD: Agentic publishing layer (Phase 3)

Status: confirmed, not yet built. Scope: the two gh-aw workflows named in the
original project brief — issue→draft-post, and weekly link-check. Styling/
theme work is explicitly out of scope for this PRD; it's a separate design
pass.

## Context

Phase 1 (Astro generator: content collections, drafts, RSS, sitemap) is done,
on branch `site-rebuild`, not yet merged. Phase 2 (GitHub Actions build +
deploy via `actions/upload-pages-artifact`/`actions/deploy-pages`) is planned
but not built. This PRD assumes Phase 2 is complete and `main` is the live,
deployable branch by the time these workflows are compiled and enabled.

Hard constraint carried from the project brief: the agentic layer may only
ever open PRs or issues. It never gets `contents: write` and never deploys.
All writes go through gh-aw's `safe-outputs`, and the agent job itself stays
read-only.

## Goals

1. Let Dominic draft a new blog post from anywhere (primarily: GitHub mobile
   app) by filing an issue with rough notes, and get back a properly-formed,
   review-ready PR — without opening an editor.
2. Catch link rot on the live site automatically, on a weekly cadence,
   without any manual crawling.

## Non-goals (v1)

- Editing existing posts or pages via issue (only new posts).
- Auto-merge of any kind.
- Re-generating/updating a PR after the triggering issue is edited (one-shot
  only — edit the PR/branch directly for changes after generation).
- Audio/voice-memo transcription (plain text issue body only).
- Any workflow beyond the two named here (tag suggestions, SEO fill-in,
  proofreading-as-PR-comment, etc. are future ideas, not v1).

---

## Feature 1: Issue → draft post

### Trigger

- Issue template `.github/ISSUE_TEMPLATE/post.yml` — fields: rough title,
  notes (freeform textarea), optional suggested tags.
- Label state machine:
  - Issue opens with no label, or with `wip` — dormant, workflow does
    nothing. `wip` is for notes still being fleshed out.
  - Adding the `post` label is the trigger event:
    `on: issues: types: [labeled]; names: [post]`.
- One-shot: the workflow runs once per `post`-labeling event. It does not
  re-run on later edits to the issue or on new comments. Changes after PR
  creation happen by editing the PR branch directly.

### Behavior

1. Read the issue title/notes/suggested tags.
2. Read existing `content/posts/*.md` frontmatter to build the current tag
   vocabulary.
3. Generate a new post file satisfying the Zod frontmatter schema
   (`src/content/schema.ts`) — always a schema-valid file, never a TODO
   placeholder:
   - `title`: from the issue's rough title.
   - `date`: date the `post` label was applied.
   - `slug`: slugified working title via the existing `entrySlug()` logic
     (`src/lib/slugify.ts`); fallback `post-<issue-number>` if the title
     doesn't slugify to anything usable.
   - `tags`: prefer reuse from the existing vocabulary found in step 2; may
     propose at most one new tag if nothing existing fits.
   - `draft`: always `true`.
   - `description`: best-effort generated from the notes, even if thin.
4. Branch name: `post/<slug>`. File: `content/posts/<slug>.md`.
5. Open a PR via `safe-outputs: create-pull-request`:
   - Body includes `Closes #<issue-number>` so merging the PR auto-closes
     the issue.
   - Also posts a comment on the issue (`safe-outputs: add-comment`) linking
     to the PR, so there's a mobile-visible confirmation independent of the
     PR itself.
6. Dominic reviews and merges manually. No auto-merge under any condition.

### Permission surface (to confirm again at compile time)

- Agent job: `permissions: { contents: read, issues: read }` — reads issue
  body and existing post frontmatter only.
- `safe-outputs`: `create-pull-request`, `add-comment`. No `contents: write`
  anywhere in the agent job; the safe-outputs runner (a separate,
  GitHub-controlled job) is what actually has permission to push the branch
  and open the PR.
- Engine: `copilot` (gh-aw default; no extra API key/secret required). If
  Copilot's request quota becomes a problem in practice, `engine: claude`
  (needs `ANTHROPIC_API_KEY` as a repo secret) is a one-line swap.

### Acceptance criteria

- [ ] Opening an issue with no label, or with `wip`, does not trigger any
      workflow run.
- [ ] Adding the `post` label triggers exactly one workflow run.
- [ ] The resulting PR contains one new file under `content/posts/`, passes
      `npm run typecheck` and `npm run build` (i.e. satisfies the Zod
      schema), and has `draft: true`.
- [ ] The PR body contains `Closes #<issue-number>`.
- [ ] A comment appears on the issue linking to the PR.
- [ ] Editing the issue after the PR is open does not trigger a second run
      or modify the existing PR.
- [ ] Merging the PR does not deploy anything by itself (deploy only occurs
      via the Phase 2 workflow on push to `main`, and the merged post stays
      out of build output as long as `draft: true`).

---

## Feature 2: Weekly link check

### Trigger

- `schedule: cron` — weekly (exact day/time not load-bearing; default to a
  low-traffic slot, e.g. Monday 09:00 UTC — adjustable later without any
  other change).

### Behavior

1. Crawl the **live** deployed site (`https://dominicserrano.com`), not an
   in-workflow build — this catches real production issues (Pages
   misconfiguration, stale CDN cache, DNS) that a content-only build check
   would miss.
2. Follow every internal link (same-domain) and external link (cited in
   post/page content) found during the crawl; record any that fail (4xx/5xx,
   timeout, DNS failure).
3. If anything is broken: open **one** issue via `safe-outputs: create-issue`
   summarizing every broken link found — URL, HTTP status/error, and the
   page it was found on.
4. If nothing is broken: do nothing. No weekly "all clear" issue — avoids
   training Dominic to ignore the issue tracker.
5. Never opens a PR. Never touches repo content.

### Permission surface

- Agent job: `permissions: { contents: read }` at most — arguably not even
  needed, since the crawl target is the public live site, not repo content.
  No `issues: write` on the agent job; `safe-outputs: create-issue` is
  handled by the separate safe-outputs runner.
- Engine: `copilot`, consistent with Feature 1.

### Acceptance criteria

- [ ] A run against a fully healthy site produces zero issues.
- [ ] A run against a site with at least one dead internal link and one dead
      external link produces exactly one issue listing both, with URL,
      status/error, and source page for each.
- [ ] The workflow has no `contents: write` or `issues: write` permission on
      the agent job itself.
- [ ] No PR is ever opened by this workflow.

---

## Open items / deferred

- **Styling/theme**: separate design pass, not part of this PRD. To be
  scoped later (likely via the `design` skill for mockups).
- **gh-aw version pinning**: confirm the exact installed `gh-aw` version and
  re-verify `engine: copilot`'s request-quota behavior against the docs
  before compiling either workflow, since this wasn't explicit in the
  reference docs as of this PRD.
- **Future workflow ideas (not v1)**: tag-suggestion pass on existing posts,
  auto-filled SEO descriptions, proofreading comments on draft PRs, editing
  existing posts/pages via issue. Revisit once the two v1 workflows have
  proven the pattern.
