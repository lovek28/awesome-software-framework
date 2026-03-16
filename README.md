# Awesome Software Framework

**Build full-stack apps with Claude — specs first, code second.**

Scaffold a repo where Claude follows a clear pipeline: idea → specs → architecture → backend → frontend → tests. No code before architecture. You describe what you want; Claude asks for your stack and builds it step by step.

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/lovek28/awesome-software-framework) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Powered by Superpowers](https://img.shields.io/badge/powered%20by-Superpowers-6c47ff)](https://github.com/obra/superpowers)

---

## Built on Superpowers

This framework is designed to work hand-in-hand with **[Superpowers](https://github.com/obra/superpowers)** — a set of skills that give Claude structured, disciplined development habits.

> **Superpowers** teaches Claude *how to think*. **Awesome Software Framework** gives Claude *what to build toward*.

| Layer | Tool | Responsibility |
|-------|------|----------------|
| **Agent discipline** | [Superpowers](https://github.com/obra/superpowers) | Brainstorm before coding · Write plans before executing · TDD · Code review |
| **Project structure** | This framework | Spec-first pipeline · Stack config · Architecture · Monorepo layout |

### Why use this if you already have Superpowers?

Superpowers makes Claude smarter. It does not give you a project.

After Superpowers finishes brainstorming and planning, Claude still needs to answer: *where do I put things? what stage am I on? what stack am I using?* That is what this framework provides.

| Need | Superpowers alone | This framework |
|------|:-----------------:|:--------------:|
| Disciplined planning before coding | ✓ | ✓ (via Superpowers) |
| Spec directory layout (`spec/product/`, `spec/domain/`, `spec/ux/`) | ✗ | ✓ |
| Tech stack config (`stack.config.json`) | ✗ | ✓ |
| Pipeline state tracking (`workflow.state.json`) | ✗ | ✓ |
| Quality gates (no backend before architecture) | ✗ | ✓ |
| Monorepo scaffold (`apps/`, `packages/`, `tests/`, `infra/`) | ✗ | ✓ |
| Presets for CRUD, auth-dashboard, API-only, frontend-only | ✗ | ✓ |
| Stage skipping for API-only or frontend-only projects | ✗ | ✓ |
| Pull framework updates without touching your code | ✗ | ✓ |

**Use Superpowers** if you want a smarter Claude on any existing project.

**Use this framework** if you are starting a new app and want a spec-first structure, a clear pipeline, and a monorepo layout ready from day one.

**Use both** for the best experience — Superpowers handles how Claude thinks, this framework handles where everything goes.

### How they work together

When you open a project created by this framework and tell Claude what to build:

1. **Superpowers** kicks in first — Claude uses `brainstorming` to ask questions one at a time and understand your idea before touching any file.
2. **This framework** defines where everything goes — `spec/`, `stack.config.json`, the pipeline order, quality gates.
3. **Superpowers** takes over for execution — `writing-plans` → `executing-plans` → `requesting-code-review` at each stage.
4. **This framework** enforces what's built — specs before architecture, architecture before backend, backend before frontend.

Install Superpowers once globally:

```bash
npx github:obra/superpowers
```

Then create a project:

```bash
npx github:lovek28/awesome-software-framework myapp
```

---

## From idea to app

```mermaid
sequenceDiagram
    participant You
    participant Claude
    participant Superpowers
    participant Pipeline
    participant Repo

    You->>Claude: "Build a CRUD app for inventory"
    Claude->>Superpowers: brainstorming skill
    Superpowers->>You: Asks one question at a time
    You->>Claude: Answers + approves direction
    Claude->>Superpowers: writing-plans skill
    Superpowers->>Claude: Step-by-step plan
    Claude->>Pipeline: Runs stages in order
    Pipeline->>Repo: spec/ → architecture/ → apps/, packages/
    Claude->>Superpowers: requesting-code-review
    Claude->>You: "Backend done. Frontend next."
```

---

## Table of contents

- [Built on Superpowers](#built-on-superpowers)
- [Quick start](#-quick-start)
- [What you get](#-what-you-get)
- [When to use this](#-when-to-use-this)
- [When not to use this](#-when-not-to-use-this)
- [Use cases](#-use-cases)
- [How it works](#-how-it-works)
- [Pipeline flow](#-pipeline-flow)
- [Architecture](#-architecture)
- [Try these prompts](#-try-these-prompts)
- [Commands & options](#-commands--options)
- [Features at a glance](#-features-at-a-glance)
- [Project structure](#-project-structure)
- [Upgrading a project](#-upgrading-a-project)
- [License](#license)

---

## Quick start

**Step 1 — Install Superpowers** (once, globally):

```bash
npx github:obra/superpowers
```

**Step 2 — Create a project:**

```bash
npx github:lovek28/awesome-software-framework myapp
cd myapp
```

**Step 3 — Open in Cursor or VS Code and tell Claude what to build:**

- *"Build a CRUD app for inventory"*
- *"Build a dashboard with login"*
- *"Build a marketplace for freelancers"*

Claude will ask for your tech stack (frontend, backend, database, etc.), write choices to `stack.config.json`, and run the full pipeline — specs → architecture → backend → frontend → tests. You answer and review.

---

## What you get

| You get … | How it helps |
|-----------|----------------|
| **A spec-first repo** | Product, domain, UX, and architecture are written before any app code. |
| **One place for stack** | `stack.config.json` stores your choices; Claude generates code to match. |
| **A clear pipeline** | Idea → product spec → domain → UX → UI → architecture → backend → frontend → tests (with optional API contract and docs). |
| **Superpowers integration** | Claude brainstorms, plans, executes, and reviews at every stage — no more jumping straight to code. |
| **Three project shapes** | Full-stack, API only (`frontend: none`), or frontend only (`backend: none`). Set it in `stack.config.json`; Claude skips the irrelevant stages automatically. |
| **Presets for speed** | Say "CRUD app for X", "API only", or "frontend only" and Claude applies the matching preset. |
| **Upgrade path** | Run `create-awesome-software upgrade` to pull template updates without touching your specs or code. |

---

## When to use this

| Situation | Why it fits |
|-----------|-------------|
| **Greenfield web app or API** | You're starting from zero and want a clear path from idea to running code. |
| **You want specs before code** | You care about product spec, domain model, and architecture before implementation. |
| **You use Claude (Cursor, etc.)** | The pipeline is designed for AI-assisted development with a single, deterministic workflow. |
| **You like a fixed pipeline** | You're happy with idea → spec → domain → UX → architecture → backend → frontend → tests. |
| **CRUD, dashboard, API, frontend, or small product** | Presets for full-stack, API-only, and frontend-only cover the most common shapes. |
| **Solo or small team** | One person (or a few) can drive the chat and own the repo; no heavy process. |
| **Learning SDLC or DDD** | The repo structure and stages teach spec-first, domain-driven, layered design. |
| **You want upgradeable template** | You're fine with `stack.config.json` and workflow state and want to pull framework updates later. |

---

## When not to use this

| Situation | Why it's a poor fit |
|-----------|----------------------|
| **Existing codebase with no specs** | The pipeline assumes you start from idea/spec. Migrating a large legacy app is a big refactor. |
| **You don't want a pipeline** | If you prefer free-form coding, this workflow will feel rigid. |
| **Tiny one-off script or CLI** | Overkill for a single file or a 100-line script. |
| **Non-Claude / no AI assistant** | The instructions target Claude; other tools won't follow the same flow without adaptation. |
| **Heavy existing process** | If you already have strict PM/design/architecture gates, this pipeline may duplicate them. |
| **Mobile-only with no web** | The template is web + API centric; mobile (e.g. Expo) is optional and less built-out. |

You can still clone the repo and use only the parts you like (e.g. just the spec layout or the workflow config).

---

## Use cases

### By project type

| Project type | How you might use it | Preset / mode |
|--------------|----------------------|----------------|
| **CRUD / admin tool** | "Build an admin to manage X" → pick stack → get spec + API + UI. | `crud` |
| **Dashboard with auth** | "Build a dashboard with GitHub login" → auth + protected pages. | `auth-dashboard` |
| **REST API only** | "Build an API for Y, no UI" → spec + architecture + OpenAPI + backend + tests. | `api-only` |
| **Frontend only** | "Build a Next.js app that uses Stripe/Supabase/external API" → no backend or DB managed here. | `frontend-only` |
| **Full-stack product (MVP)** | "Build a marketplace for Z" → full pipeline: spec, domain, UX, architecture, backend, frontend, tests. | Full mode |
| **Internal tool or portal** | "Build a tool for our team to do W" → same pipeline; add auth and deploy as needed. | Full or quick mode |
| **Learning project** | "Build a blog / todo / booking app" to learn the stack and spec-first flow. | Any preset or full |

### By goal

| Goal | What you do |
|------|-------------|
| **Ship an MVP fast** | Use quick mode or a preset; answer stack questions; let Claude run the pipeline. |
| **Keep a single source of truth** | Specs in `spec/`; code generated from them; change spec then ask Claude to update code. |
| **Align with stakeholders** | Share product spec and UX flows before implementation; iterate on spec, then regenerate. |
| **Standardize stack and stages** | Set stack once in `stack.config.json`; use the same pipeline across projects. |
| **Add an admin or mobile app later** | Start with web + API; add `frontend_admin` or `mobile` in stack and run frontend for the new app. |

### By role

| Role | How you use it |
|------|----------------|
| **Founder / PM** | Describe the product; review product spec and UX; leave stack and implementation to Claude (or a dev). |
| **Developer** | Run the CLI; open in Cursor; answer stack and follow-up questions; review and refine generated code. |
| **Designer** | Provide flows and UI direction; Claude fills `spec/ux/` and `spec/ui/`; you review and iterate. |
| **Solo builder** | One person does idea → spec → stack → pipeline; use presets and quick mode to move fast. |

---

## How it works

1. **You describe the product** in plain language (e.g. "Build a task manager for teams").
2. **Superpowers `brainstorming`** — Claude asks clarifying questions one at a time. No code yet.
3. **Claude asks for your stack** — frontend, backend, database, ORM, styling, auth, deploy — and saves it in `stack.config.json`.
4. **Superpowers `writing-plans`** — Claude writes a plan for each stage before touching files.
5. **Claude runs the pipeline in order** — specs (product, domain, UX, UI), then architecture, then backend, then frontend, then tests.
6. **Superpowers `requesting-code-review`** — Claude reviews each stage before advancing.
7. **Specs stay the source of truth.** Code is generated from them; change specs and ask Claude to update code.

---

## Pipeline flow

Stages run in order. Optional stages (API contract, Docs) can be enabled in `workflow.config.json`. Presets skip or merge some steps for speed.

```mermaid
flowchart LR
    subgraph discipline["🧠 Superpowers layer"]
        SP1[brainstorming]
        SP2[writing-plans]
        SP3[executing-plans]
        SP4[requesting-code-review]
    end
    subgraph spec["📋 Spec phase"]
        A[Idea] --> B[Product spec]
        B --> C[Domain]
        C --> D[UX flows]
        D --> E[UI system]
    end
    E --> F[Architecture]
    F --> G{API contract?}
    G -->|optional| H[OpenAPI]
    G --> I[Backend]
    H --> I
    I --> J[Frontend]
    J --> K[Tests]
    K --> L{Docs?}
    L -->|optional| M[Docs from spec]
    SP1 -.->|before spec| A
    SP2 -.->|before each stage| F
    SP3 -.->|during each stage| I
    SP4 -.->|after each stage| K
```

**Linear view:**

```
[brainstorm] → Idea → Product spec → Domain → UX → UI → Architecture
  → [API contract?] → Backend → Frontend → Tests → [Docs?]
  ↑ plan before each stage · review after each stage (Superpowers)
```

---

## Architecture

Generated projects follow a **spec-first, layered** layout: specs drive architecture, which drives implementation.

```mermaid
flowchart TB
    subgraph specs["Specification layer"]
        S1[Product spec]
        S2[Domain / UX / UI]
        S3[Architecture]
    end
    subgraph config["Configuration"]
        CFG[stack.config.json]
        WF[workflow.state.json]
    end
    subgraph app["Application layer"]
        WEB[apps/web]
        ADMIN[apps/admin]
        API[apps/api]
    end
    subgraph packages["Shared packages"]
        UI[packages/ui]
        SVC[packages/services]
        DOM[packages/domain]
        SHR[packages/shared]
    end
    S1 --> S2 --> S3
    S3 --> API
    S3 --> WEB
    S3 --> ADMIN
    API --> SVC --> DOM
    WEB --> UI --> SVC
    CFG -.-> API
    CFG -.-> WEB
```

**Layers (top = user-facing, bottom = foundation):**

```
┌─────────────────────────────────────────────────────────┐
│  apps/web  (optional: apps/admin, apps/mobile)          │  ← Frontend
├─────────────────────────────────────────────────────────┤
│  packages/ui                                            │  ← Shared UI
├─────────────────────────────────────────────────────────┤
│  apps/api                                               │  ← HTTP API
├─────────────────────────────────────────────────────────┤
│  packages/services  (use cases)                         │  ← Application logic
├─────────────────────────────────────────────────────────┤
│  packages/domain  (entities, rules)                     │  ← Domain model
├─────────────────────────────────────────────────────────┤
│  spec/  (product, domain, ux, ui, architecture)         │  ← Source of truth
└─────────────────────────────────────────────────────────┘
```

---

## Try these prompts

Once your project is open in Cursor/VS Code:

| Goal | Example prompt |
|------|-----------------|
| Start from scratch | *"Build a CRUD app for managing projects"* |
| Auth + dashboard | *"Build a dashboard with GitHub login"* |
| API only | *"Build a REST API for a booking system, no UI"* |
| Custom stack | *"Build a blog with Next.js, Prisma, and Tailwind"* |

Claude will brainstorm with you first (Superpowers), then run the pipeline.

---

## Commands & options

| Command | Description |
|--------|-------------|
| `npx github:lovek28/awesome-software-framework <name>` | Create a new project (no clone needed). |
| `node cli.js <name>` | Create a new project (from a clone of this repo). |
| `create-awesome-software upgrade [path]` | Update an existing project with the latest template files. Your specs, code, and workflow state are not changed. |

| Option | Description |
|--------|-------------|
| `-v` / `--version` | Print the CLI version. |
| `-o` / `--output-dir <path>` | Create the project in this directory (default: current directory). |

Tip: the CLI may show *"Update available: x.y.z"* if a newer version exists. Set `NO_UPDATE_CHECK=1` to disable the check.

---

## Features at a glance

- **Superpowers integration** — Brainstorm, plan, execute, and review at every stage. No code before thinking.
- **Workflow** — Optional/custom stages, quality gates, quick vs full mode, checkpoints and resume.
- **Auth & security** — Optional auth in stack; security checklist in `spec/security.md`; secrets only in env.
- **Deploy & CI** — Optional deploy target (Vercel, Docker, Fly, Railway); CI workflow example.
- **API contract** — Optional OpenAPI spec; backend and frontend stay in sync.
- **Tests** — Test runner and E2E setup; optional coverage; tests derived from specs.
- **Observability** — Health endpoint, structured logging, optional runbooks and ADRs.
- **Multi-app & presets** — Optional admin or mobile app; presets for CRUD, auth-dashboard, api-only, and frontend-only.
- **Extensibility** — Hooks (before/after stage), custom stages.
- **Docs from spec** — Optional docs stage; API and product/UX docs generated from spec.
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
│   ├── stages/              # Per-stage instructions (with Superpowers hooks)
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

The most important files: **CLAUDE.md** (how Claude works), **.claude/workflow.state.json** (current stage), **stack.config.json** (your choices).

---

## Upgrading a project

Pull the latest template updates without overwriting your work:

```bash
cd myapp
npx github:lovek28/awesome-software-framework upgrade
```

This updates CLAUDE.md, workflow config, `.claude` instructions/agents/context-scope/extensibility, docker-compose, and `.env.example`. Your **specs**, **code**, **stack.config.json**, and **workflow state** are left as-is.

---

## License

MIT · [Repository](https://github.com/lovek28/awesome-software-framework) · Built with [Superpowers](https://github.com/obra/superpowers)
