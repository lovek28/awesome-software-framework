# Awesome Software Framework

**Build apps with Claude—specs first, code second.**  
Scaffold a repo where Claude follows a clear pipeline: idea → specs → architecture → backend → frontend → tests. No code before architecture. You describe what you want; Claude asks for your stack and builds it step by step.

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/lovek28/awesome-software-framework) · [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of contents

- [Quick start](#-quick-start)
- [What you get](#-what-you-get)
- [How it works](#-how-it-works)
- [Try these prompts](#-try-these-prompts)
- [Commands & options](#-commands--options)
- [Features at a glance](#-features-at-a-glance)
- [Project structure](#-project-structure)
- [Upgrading a project](#-upgrading-a-project)
- [License](#license)

---

## Quick start

**1. Create a new project** (no clone needed):

```bash
npx github:lovek28/awesome-software-framework myapp
```

**2. Go into the project and open it in your editor:**

```bash
cd myapp
```

Then open `myapp` in **Cursor** or **VS Code**.

**3. Tell Claude what to build.**

In the chat, say something like:

- *"Build a CRUD app for inventory"*
- *"Build a dashboard with login"*
- *"Build a marketplace for freelancers"*

Claude will ask you for tech choices (frontend, backend, database, etc.), write them to `stack.config.json`, and run the full pipeline: specs → architecture → backend → frontend → tests. You just answer and review.

---

## What you get

| You get … | How it helps |
|-----------|----------------|
| **A spec-first repo** | Product, domain, UX, and architecture are written before any app code. |
| **One place for stack** | `stack.config.json` stores your choices; Claude generates code to match. |
| **A clear pipeline** | Idea → product spec → domain → UX → UI → architecture → backend → frontend → tests (with optional API contract and docs). |
| **Presets for speed** | Say "CRUD app for X" or "dashboard with auth" and Claude can use a preset to move faster. |
| **Upgrade path** | Run `create-awesome-software upgrade` later to pull template updates without touching your specs or code. |

---

## How it works

1. **You describe the product** in plain language (e.g. "Build a task manager for teams").
2. **Claude asks for your stack** — frontend, backend, database, ORM, styling, auth, deploy target — and saves it in `stack.config.json`.
3. **Claude runs the pipeline in order:** writes specs (product, domain, UX, UI), then architecture, then implements backend and frontend, then tests. Optional stages (API contract, docs) and presets (CRUD, auth-dashboard, api-only) are available.
4. **Specs stay the source of truth.** Code is generated from them; you can change specs and ask Claude to update code.

Pipeline flow:

```
Idea → Product spec → Domain → UX → UI system → Architecture
  → [optional: API contract] → Backend → Frontend → Tests → [optional: Docs]
```

---

## Try these prompts

Once your project is open in Cursor/VS Code, you can say:

| Goal | Example prompt |
|------|-----------------|
| Start from scratch | *"Build a CRUD app for managing projects"* |
| Auth + dashboard | *"Build a dashboard with GitHub login"* |
| API only | *"Build a REST API for a booking system, no UI"* |
| Custom stack | *"Build a blog with Next.js, Prisma, and Tailwind"* |

Claude will ask follow-up questions if needed and then run the pipeline.

---

## Commands & options

| Command | Description |
|--------|-------------|
| `npx github:lovek28/awesome-software-framework <name>` | Create a new project (no clone). |
| `node cli.js <name>` | Create a new project (from a clone of this repo). |
| `create-awesome-software upgrade [path]` | Update an existing project with the latest template files (CLAUDE, workflow, agents, docker, .env.example). Your specs, code, and workflow state are not changed. Default path: current directory. |

| Option | Description |
|--------|-------------|
| `-v` / `--version` | Print the CLI version. |
| `-o` / `--output-dir <path>` | Create the project in this directory (default: current directory). |

Tip: the CLI may show *"Update available: x.y.z"* if a newer version exists. Set `NO_UPDATE_CHECK=1` to disable the check.

---

## Features at a glance

- **Workflow** — Optional/custom stages, quality gates, quick vs full mode, checkpoints and resume.
- **Auth & security** — Optional auth in stack; security checklist in `spec/security.md`; secrets only in env.
- **Deploy & CI** — Optional deploy target (Vercel, Docker, Fly, Railway); CI workflow example; env matrix.
- **API contract** — Optional OpenAPI spec; backend and frontend stay in sync.
- **Tests** — Test runner and E2E setup; optional coverage; tests derived from specs.
- **Observability** — Health endpoint, structured logging, optional runbooks and ADRs.
- **Multi-app & presets** — Optional admin or mobile app; presets for CRUD, auth-dashboard, api-only.
- **Extensibility** — Hooks (before/after stage), custom stages.
- **Docs from spec** — Optional docs stage; API and product/UX docs generated from spec.
- **Agents & skills** — Per-stage instructions and Cursor agents (Spec, Backend, Frontend); stack and stage skills for consistent patterns.
- **Token control** — Per-stage context scope and optional summarization to keep usage predictable.

---

## Project structure

After you run the CLI, your project looks like this:

```
myapp/
├── CLAUDE.md                 # Main instructions for Claude
├── stack.config.json         # Your tech stack
├── workflow.config.json      # Pipeline stages, optional ones, hooks
├── .claude/
│   ├── workflow.state.json  # Current stage, idea, completed list, mode
│   ├── instructions.md      # Workflow rules
│   ├── agents.md            # Spec / Backend / Frontend agents
│   ├── context-scope.md     # What to read per stage
│   ├── stages/              # Per-stage instructions
│   └── skills/              # Stack & stage skills (e.g. Next.js, Prisma)
├── spec/
│   ├── product/, domain/, ux/, ui/, architecture/
│   ├── security.md
│   └── api/openapi.yaml     # When using API contract
├── .presets/                # CRUD, auth-dashboard, api-only
├── apps/                    # web, api; optionally admin, mobile
├── packages/                # domain, services, ui, shared
├── tests/                   # unit, integration, e2e
├── docs/                    # Generated from spec (optional)
└── infra/                   # DB, deploy, CI
```

The most important files to know: **CLAUDE.md** (how Claude works), **.claude/workflow.state.json** (current stage), and **stack.config.json** (your choices).

---

## Upgrading a project

If you created the project with an older version of the framework, you can pull the latest template updates without overwriting your work:

```bash
cd myapp
npx github:lovek28/awesome-software-framework upgrade
```

This updates CLAUDE.md, workflow config, .claude instructions/agents/context-scope/extensibility, docker-compose, and .env.example. Your **specs**, **code**, **stack.config.json**, and **workflow state** are left as-is. Your project’s README also explains this.

---

## License

MIT · [Repository](https://github.com/lovek28/awesome-software-framework)
