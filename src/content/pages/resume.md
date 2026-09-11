---
title: Resume
description: Dominic Serrano — senior full stack engineer. Experience, projects, and how to reach me.
date: 2026-09-07
---

**Senior Full Stack Engineer** · Denver, CO\
[dmsrojo@gmail.com](mailto:dmsrojo@gmail.com) · [LinkedIn](https://www.linkedin.com/in/dominic-serrano/) · [GitHub](https://github.com/dmserrano)

## Summary

Full Stack Engineer, 9+ years shipping production software end-to-end — React and TypeScript through Node.js, Elixir, and Python services to cloud deployment. Depth in design systems, component libraries, and the CI/CD and testing infrastructure behind them. Recently focused on AI-native development: production MCP servers, agent workflows, and the verification and cost controls that make them safe to run unattended.

## Experience

### FortyAU

**Senior Full Stack Engineer** — Jan 2026 – July 2026\
**Full Stack Engineer** — July 2022 – Dec 2025\
*React, Svelte.js, TypeScript, Node.js, Elixir, Python, SQL, GitHub Actions, AWS, Azure*

- Led front end development of a complex, high-visibility feature for a large enterprise client, coordinating across multiple engineering teams
- Directed integration of an internal component library into a major enterprise project, improving UI consistency and reducing duplicate development effort
- Established testing automation across multiple projects, including local unit testing, CI/CD pipeline integration, and end-to-end test coverage
- Maintained and shipped new features for an enterprise-scale preventative maintenance platform spanning front end and backend services
- Modernized a legacy React application through dependency upgrades, unit test coverage, and component-level documentation
- Integrated AI agents into feature development and test-coverage work across existing projects
- Built custom MCP servers that automated Git commit formatting to client convention and gated dependency installs against the osv.dev vulnerability database, enforced through git hooks

### Blueprint Title

**Full Stack Developer** — April 2021 – June 2022\
*Vue.js, Laravel/PHP, npm*

- Delivered fully tested features across front end and backend for internal and external title insurance management applications, maintaining high test coverage
- Partnered with internal users and product stakeholders to translate complex title insurance requirements into technical solutions
- Co-built and maintained an internal component library published to npm for cross-team reuse

### Atiba

**Full Stack Developer** — May 2018 – April 2021\
*React, Vue.js, NativeScript, Laravel/PHP, SQL, WordPress, AWS*

- Led a front end team delivering a React application for a large enterprise client
- Directed development of a hybrid mobile app for a local client
- Built full stack solutions using Laravel/PHP and modern JavaScript frameworks to meet diverse client requirements

### GameWisp

**Front End Developer** — May 2017 – May 2018\
*Vue.js, Mocha/Chai, ES2015/ES6*

- Drove team-wide adoption of Vue.js and modern JavaScript tooling and best practices, establishing front end standards that improved code consistency and developer velocity

## Projects

### [safe-migrate](https://github.com/dmserrano/safe-migrate)

*Characterization-test generator for dependency migrations · TypeScript, Docker/testcontainers, Stryker*

- Gates each AI-generated test through AST checks, execution in the target's pinned container, a flake check, and mutation testing before accepting it; logs rejections and cost per accepted test
