---
title: Using GitHub Agentic Workflows to publish blog posts
date: 2026-09-12
slug: using-github-agentic-workflows-to-publish-blog-posts
tags: [meta, github-actions, github, agentic-workflow]
draft: false
description: This post describes how I rebuilt my website with Astro and automated blog publishing using GitHub Agentic Workflows, highlighting the ease of setup, security, and developer experience improvements over traditional CI/CD pipelines.
---

I rebuilt my website with [Astro]((astro.build/redacted) this week. It was woefully outdated in both content and styling.

But that wasn't the reason. I wanted to be able to draft a blog post from my phone and have the page generate without me.

In the past, setting up custom CI/CD pipelines was difficult: configuration was in YAML, debugging was tedious, and security was always a concern.

I had recently stumbled on GitHub Agentic Workflows (the `gh aw` CLI extension) and was impressed with how easy it seemed to create automated agent workflows with their tools.

It held up. A `gh aw` workflow is a Markdown file, with configuration in frontmatter and instructions in plain English. The agent runs read-only, can only open a PR for me to review, and the blog pipeline was working the same day.

The site rebuild was completely spec-driven. I used [mattpocock-skills:to-spec]((www.aihero.dev/redacted) to create a PRD with the project context and then used an agent to break that into tickets.

The main dev process took a few hours, with about 10 PRs. I had agents build the site from the tickets that were created from the PRD. I QA'd the changes on my local dev server while manually reviewing the small feature PRs.

I wanted to automate the process of publishing a blog to my website. I'd push the draft of the post as a WIP GitHub issue to the repo and the agent would do the rest.

## Using `gh aw`

One of the coolest parts of this tool is that the workflow files are written in Markdown. The workflow configuration is frontmatter and the agent instructions are natural language.

```draft-post.md
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

safe-outputs:
  create-pull-request:
    max: 1
---

# Instructions

Turn a labeled `post` issue into a properly-formed draft blog post PR.

This workflow only ever runs once, when the `post` label is added to an issue. 
Do not treat re-runs on the same issue (if they somehow happen) as a reason to open a second PR for the same issue — 
check first whether a PR referencing this issue already exists, and if so, do nothing.

<-- other instructions -->
```

What I wanted the agent to do: come up with tags based on the article content and other posts, then create metadata for the blog page (title, date, description). Finally, open a PR with the new article page for me to review.

Once `draft-post.md` was ready to be tested, I ran `gh aw compile`. From my 105-line `draft-post.md`, it generated a 1,904-line GitHub Actions YAML file with security hardening.

## If you want to try it

Getting started was easy. The `gh aw init` command sets the repo up for you. It adds a skill and a custom agent so your coding agent knows how to write and debug these workflows (configured for the AI engine you want to use: copilot by default).

There are [pre-existing workflows with examples](https://github.github.com/gh-aw/gallery/), everything from [documentation maintenance](https://github.github.com/gh-aw/gallery/docs-automation/) to [security reviews](https://github.github.com/gh-aw/gallery/security-review/).

I was able to prompt Claude to build the workflow file for me (you can also manually create the workflow files).

```example-prompt.md
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

<-- workflow prompt -->
```

Testing the workflow could be kicked off from the GitHub UI or the CLI. To test it I opened an issue with the `wip` label (this won't trigger the action), then ran it by adding the `post` label to the issue.

## Pain points

If you have ever worked with GitHub Actions or any CI/CD pipeline before, you are familiar with the battle of testing a new action. Usually it consists of looking up YAML syntax, pushing a change, waiting for the action to fail, then rinse and repeat.

There was some of that. However, when I ran into an issue where I wasn't providing the required agent model name, the agent created a new GitHub issue with the error and the suggested fix in the description.

So instead of digging through the action logs to find the error, I had an issue that I could hand off to Claude. That allowed me to work through two real configuration errors in about 20 minutes.

## Security

`gh aw` makes it easy to configure agent job permissions. You control what each agent can read and write to.

By design, each agent job runs with [read-only permissions](https://github.github.com/gh-aw/introduction/architecture/) by default. All threat detection steps are completed before the write step, and any write action is handed off to other jobs that handle the write execution.

For my personal site, the agent can read the codebase, issues, and existing PRs. Only admins, maintainers, or people with write access can trigger the workflow, though; for anyone else, the run stops before the agent job.

If the job passes all verification steps, the job is then passed off to the ["safe output"](https://github.github.com/gh-aw/reference/safe-outputs/) step, which handles the writing execution. There is a configurable permission system for each write: issues, comments, PRs.

With all that in place, the most an outsider can do is open an issue or a PR from a fork — neither one starts the agent. And the last guardrail is that all merges must be manually approved by me.

## Wrapping up

After a weekend on `gh aw`, I'll keep using it on my personal projects. Easy to set up, very configurable, security first out of the box. 

If you're thinking about agents in your own pipeline, start with a workflow that can only open an issue or a PR. If you've already run this somewhere with real stakes, I'd like to hear how it went.
