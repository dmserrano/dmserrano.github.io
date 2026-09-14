# dominicserrano.com

Source for **[dominicserrano.com](https://dominicserrano.com)**, the personal site and blog of Dominic Serrano.

- 📝 **[Blog](https://dominicserrano.com/blog/)**: posts about code and whatever else
- 🛠️ **[Projects](https://dominicserrano.com/projects/)**
- 📡 **[RSS feed](https://dominicserrano.com/feed.xml)**

Latest post: [Using GitHub Agentic Workflows to publish blog posts](https://dominicserrano.com/posts/using-github-agentic-workflows-to-publish-blog-posts/). It covers how this site was built.

## How it works

The site is a static [Astro](https://astro.build) build deployed to GitHub Pages.

### Content

Posts, projects, and standalone pages are Markdown files in [Astro content collections](https://docs.astro.build/en/guides/content-collections/):

| Collection | Folder                 | Routes                            |
| :--------- | :--------------------- | :-------------------------------- |
| `posts`    | `src/content/posts/`   | `/posts/<slug>/`, `/blog/`, `/tags/<tag>/` |
| `projects` | `src/content/projects/`| `/projects/`                      |
| `pages`    | `src/content/pages/`   | `/<slug>/` (e.g. `/resume/`)      |

Frontmatter is validated by Zod schemas in [`src/content/schema.ts`](src/content/schema.ts), so a malformed post fails the build instead of shipping. A post needs `title`, `date`, and `description`. `slug`, `tags`, and `draft` are optional. Posts marked `draft: true` are left out of every listing, tag page, and the feed.

### Blog features

- **Tag pages** are generated at build time from the tags used across published posts.
- **Full-content RSS** at [`/feed.xml`](src/pages/feed.xml.ts): each item carries the sanitized HTML of the whole post, with root-relative links made absolute, so cross-posters like dev.to can import it directly.
- **Sitemap** via `@astrojs/sitemap`, plus a site-wide Open Graph card ([`scripts/og-image.html`](scripts/README.md)).

### Automation

| Workflow | Trigger | What it does |
| :------- | :------ | :----------- |
| [`pages.yml`](.github/workflows/pages.yml) | PRs and pushes to `main` | Typecheck, test, build; deploy to GitHub Pages on `main` |
| [`draft-post.md`](.github/workflows/draft-post.md) | `post` label on an issue | A [GitHub Agentic Workflow](https://github.com/github/gh-aw) turns the issue's notes into a schema-valid draft post and opens a PR |
| [`link-check.md`](.github/workflows/link-check.md) | Weekly | An agent crawls the live site and opens an issue for dead links |

The agentic workflows run read-only. Their only write access is through safe outputs (one PR or one issue), so every change still goes through review.

To start a post from anywhere, open an issue with the **post** template and add the `post` label.

## Development

Requires Node 22.12+.

| Command             | Action                                   |
| :------------------ | :--------------------------------------- |
| `npm install`       | Install dependencies                     |
| `npm run dev`       | Dev server at `localhost:4321`           |
| `npm run build`     | Production build to `./dist/`            |
| `npm run preview`   | Preview the build locally                |
| `npm run test`      | Unit tests (Vitest)                      |
| `npm run typecheck` | `astro check`                            |

Google Analytics is only injected in production builds. See [`scripts/README.md`](scripts/README.md) for the OG image and prose-lint helpers.
