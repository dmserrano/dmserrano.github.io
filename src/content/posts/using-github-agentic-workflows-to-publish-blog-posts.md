---
title: Using GitHub Agentic Workflows to publish blog posts
date: 2026-09-11
tags: [meta, agents]
draft: true
description: "I rebuilt my site on Astro and used GitHub Agentic Workflows to turn a labeled GitHub issue into a draft post PR. What the setup looked like, where it broke, and how the permission model holds up."
---

I rebuilt my website with [Astro](https://astro.build/) this week. It was woefully outdated, content wise and styling wise. 

But that wasn't the reason. I wanted to draft a post from my phone and have everything else happen without me.

In the past setting up custom CI/CD pipelines was difficult - configuration was in YAML, debugging was tedious, and security was always a concern.

I had recently stumbled on GitHub agentic workflows (gh aw cli extension) and was impressed with how easy it seemed to create automated agent workflows with their tools.

The site rebuild itself was built through spec driven development. I used mattpocock-skills:to-spec to create a PRD with the project context and then used an agent to break that into tickets.

The main dev process took a few hours, with about 10 PRs. I had agents build the site from the tickets that were created from the PRD. I was QAing the changes on my local dev server along with manually reviewing the small feature PRs.

The main idea was to create an automated blog posting feature. I could push the draft of the post as a WIP GitHub issue to the repo.

## Using gh aw

One of the coolest parts about this tool is that the workflow files
are written in markdown. The workflow configuration is frontmatter and
the agent instructions are natural language.

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

This workflow only ever runs once, when the `post` label is added to an
issue. Do not treat re-runs on the same issue (if they somehow happen) as a
reason to open a second PR for the same issue — check first whether a PR
referencing this issue already exists, and if so, do nothing.

<-- other instructions -->
```

What I wanted the agent to do: come up with tags based on the article
content and other posts, create metadata for the blog page (title, date,
description), and finally create a PR for me to review with the new article
page.

Once the workflow.md was ready to be tested, I ran `gh aw compile`. From my 105 line draft-post.md, it generated a 1,904 line GH Action YAML file with security hardening.

## If you want to try it

Getting started was easy. The `gh aw init` command sets the repo up for you - it
adds a skill and a custom agent so your coding agent knows how to write and
debug these workflows (configured for the AI engine you want to use: copilot by
default).

There are [pre-existing workflows with examples](https://github.github.com/gh-aw/gallery/) - everything from [documentation maintenance](https://github.github.com/gh-aw/gallery/docs-automation/) to [security reviews](https://github.github.com/gh-aw/gallery/security-review/).

I was able to prompt Claude to build the workflow file for me (you can
also manually create the workflow files).

```example-prompt.md
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

<-- workflow prompt -->
```

Testing the workflow could be kicked off through GH or via the CLI. To
test the workflow I pushed an issue up with the 'wip' label (this won't
trigger the action) and ran it by adding the 'post' label to the issue.

## Painpoints

If you have ever worked with GH actions or any CI/CD pipeline before you are familiar with the battle of testing a new action. Usually it consists of looking up YAML syntax, pushing a change, waiting for the action to fail, rinse and repeat.

There was definitely some of that. However, when I ran into an issue where I wasn't providing the required model name, the agent created a new issue with the error and the fix in the description.

So instead of digging through the action logs to find the error, I had an issue that Claude could tackle. That allowed me to quickly work through two real configuration errors in about 20 mins.

## Security

`gh aw` makes it easy to configure agent job permissions. You control what each agent can read and write to.

By design, each agent job runs with [read only permissions](https://github.github.com/gh-aw/introduction/architecture/) by default. All threat detection steps are completed before the write step, and any write action is handed off to other jobs that handle the write execution.

For my personal site, the agent can only read the code base as well as issues and existing PRs. Only admins, maintainers, or people with write access can trigger the workflow - for anyone else, the run stops before the agent job.

If the job passes all verification steps, the job is then passed off to the ["safe output"](https://github.github.com/gh-aw/reference/safe-outputs/) jobs, which handle the writing execution. There is a configurable permission system for each write: issues, comments, PRs.

By having all of the above in place, the most an outsider can do is open an issue or a PR from a fork - neither one starts the agent. And the last guardrail is that all merges must be manually approved by me.

## Wrapping up

After my experience with gh aw, I'll keep using it on my personal projects and I'd recommend it to anyone weighing agents in CI. It's easy to setup, very configurable and security first out of the box.

If you're thinking about agents in your own pipeline, start with a workflow that can only open an issue or a PR. If you're weighing it for your team, reach out. I'd like to hear what's holding you up.
