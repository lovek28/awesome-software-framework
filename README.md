# Awesome-Software-Framework v1.0.0

A framework that lets you scaffold a repository for **Specification-First Development** with Claude Code. Claude follows a deterministic software development lifecycle and never generates implementation code before architecture exists.

**Repository:** [github.com/lovek28/awesome-software-framework](https://github.com/lovek28/awesome-software-framework)

## Install

This package is not published to npm. Use it directly from GitHub.

**Option 1 — run without cloning:**

```bash
npx github:lovek28/awesome-software-framework myapp
```

**Option 2 — clone and run:**

```bash
git clone https://github.com/lovek28/awesome-software-framework.git
cd awesome-software-framework
node cli.js myapp
```

**Commands:**

- `upgrade [path]` — Pull non-destructive template updates into an existing project (CLAUDE.md, workflow.config.json, .claude/instructions.md, docker-compose files, .env.example). Run from the project root or pass the project path. Specs, code, stack.config.json, and workflow state are left unchanged.

**Options:**

- `-v` / `--version` — Print the CLI version and exit.
- `-o` / `--output-dir <path>` — Create the project in the given directory (default: current directory). Example: `node cli.js myapp -o ../projects`

When you run the CLI to create a project, it may print a one-line notice if a newer version is available (e.g. “Update available: 1.1.0”). Set `NO_UPDATE_CHECK=1` to disable this check; the CLI uses a short timeout and does not block if offline.

After scaffolding, the new project contains a `.framework-version` file with the framework version it was created with. This is used for future upgrade tooling (e.g. pulling non-destructive template updates). See the project’s README for upgrade strategy.

Then:

```bash
cd myapp
```

Open the project in **Cursor** (or VS Code) and tell Claude what you want to build (e.g. "Build a marketplace for freelancers"). **Claude will ask you** for tech stack (frontend, backend, database, ORM, styling) and any other relevant choices, then run the full pipeline. You can pick from common options or name any other technology.

> **If this package is later published to npm**, you’ll be able to run `npx create-awesome-software myapp` instead.

## How It Works

1. **You describe the product** in natural language, e.g.:
   - "Build a SaaS platform for suppliers"
   - "Build a marketplace for freelancers"
   - "Build a CRM system"

2. **Claude runs a structured SDLC pipeline** in this order:
   - Idea
   - Product Specification
   - Domain Design
   - UX Flows
   - UI System
   - System Architecture
   - Backend Implementation
   - Frontend Implementation
   - Testing

3. **Specification first**: Claude writes and updates spec files (product, domain, UX, UI, architecture) before generating any application code.

4. **Stack-aware**: Technology choices are defined in `stack.config.json`; Claude follows them when generating code.

## Core Principles

- **Specification First** — Ideas become structured specs before code.
- **Domain Driven Design** — Business logic separated from UI and infrastructure.
- **Layered Architecture** — Spec → architecture → application → infrastructure.
- **Token Efficiency** — Claude reads only what’s needed for the current stage.
- **Deterministic Workflow** — Workflow state in `.claude/workflow.state.json` drives what to do next.
- **Chat-First** — You prompt; Claude executes the workflow and generates specs and code.

## Project Structure (Generated)

```
myapp/
├── CLAUDE.md              # Instructions for Claude
├── stack.config.json      # Technology stack
├── workflow.config.json   # Pipeline stages
├── .claude/
│   ├── workflow.state.json
│   └── instructions.md
├── spec/
│   ├── index.md
│   ├── product/spec.md
│   ├── domain/ (entities, rules, glossary)
│   ├── ux/ (flows, states)
│   ├── ui/system.md
│   └── architecture/ (overview, backend, frontend, data-model)
├── apps/ (web, api)
├── packages/ (domain, services, ui, shared)
├── tests/ (unit, integration, e2e)
└── infra/
```

## License

MIT
