---
title: Rebuilding this site on Astro
date: 2026-09-08
draft: true
description: This post details the process of rebuilding my personal site from static HTML to Astro, automating deployment with GitHub Actions, and integrating AI agent workflows for content management and site maintenance.
tags: [meta, astro]
---

Just rebuilt my personal site from scratch. I migrated from a hand-written static HTML site to an Astro-based generator, leveraging content collections, drafts, RSS, and a sitemap. Deployment is now fully automated via GitHub Actions to GitHub Pages. I also set up AI agent workflows (gh-aw) to draft new posts by filing GitHub issues from my phone and to run weekly automated checks for dead links.

The architecture is split into two layers: a deterministic layer (the generator and deploy pipeline, with no AI at runtime) and an agentic layer (the gh-aw workflows, which can only open PRs or issues, never deploy anything themselves).
