# Awesome Software Framework

**Build full-stack apps with Claude — specs first, code second.**

Scaffold a repo where Claude follows a clear pipeline: idea → specs → architecture → backend → frontend → tests. No code before architecture. No architecture before specs. You stay in control at every stage.

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/lovek28/awesome-software-framework) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Powered by Superpowers](https://img.shields.io/badge/powered%20by-Superpowers-6c47ff)](https://github.com/obra/superpowers)

---

## Table of contents

- [Built on Superpowers](#built-on-superpowers)
- [Quick start](#quick-start)
- [What you get](#what-you-get)
- [How it works — step by step](#how-it-works--step-by-step)
- [What Claude does at each stage](#what-claude-does-at-each-stage)
- [User checkpoints](#user-checkpoints)
- [Architecture decisions](#architecture-decisions)
- [Pre-code reasoning](#pre-code-reasoning)
- [Superpowers skill approval](#superpowers-skill-approval)
- [Project shapes](#project-shapes)
- [Presets](#presets)
- [When to use this](#when-to-use-this)
- [When not to use this](#when-not-to-use-this)
- [Try these prompts](#try-these-prompts)
- [Commands](#commands)
- [Project structure](#project-structure)
- [Upgrading a project](#upgrading-a-project)
- [License](#license)

---

## Built on Superpowers

This framework is designed to work hand-in-hand with **[Superpowers](https://github.com/obra/superpowers)** — a set of skills that give Claude structured, disciplined development habits.

> **Superpowers** teaches Claude *how to think and work*.
> **Awesome Software Framework** gives Claude *what to build toward and where to put it*.

They solve different problems. Superpowers alone gives you a smarter Claude — but no project structure, no pipeline, no spec layout. This framework alone gives you a map — but without Superpowers, Claude skips straight to code and makes random decisions.

Together they give you a project where every decision has a reason and every stage has your approval before it starts.

### Why use this if you already have Superpowers?

| Need | Superpowers alone | This framework |
|------|:-----------------:|:--------------:|
| Disciplined planning before coding | ✓ | ✓ (via Superpowers) |
| Spec directory layout (`spec/product/`, `spec/domain/`, `spec/ux/`) | ✗ | ✓ |
| Tech stack config (`stack.config.json`) | ✗ | ✓ |
| Pipeline state tracking (`workflow.state.json`) | ✗ | ✓ |
| Quality gates (no backend before architecture) | ✗ | ✓ |
| Justified architecture decisions, presented for approval | ✗ | ✓ |
| User checkpoint at every stage | ✗ | ✓ |
| Pre-code reasoning (edge cases, errors, security, performance) | ✗ | ✓ |
| Monorepo scaffold (`apps/`, `packages/`, `tests/`, `infra/`) | ✗ | ✓ |
| Three project shapes (full-stack, API only, frontend only) | ✗ | ✓ |
| Presets for common app types | ✗ | ✓ |
| Pull framework updates without touching your code | ✗ | ✓ |

**Use Superpowers** if you want a smarter Claude on any existing project.
**Use this framework** if you are starting a new app and want a spec-first structure, a clear pipeline, and a monorepo layout ready from day one.
**Use both** for the best experience.

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

- *"Build a CRUD app for managing inventory"*
- *"Build a dashboard with login"*
- *"Build a REST API for a booking system"*

Claude checks Superpowers is installed, asks for your stack, confirms architecture decisions with you, and runs the pipeline stage by stage — pausing for your approval at every step.

---

## What you get

| You get | How it helps |
|---------|--------------|
| **A spec-first repo** | Product, domain, UX, and architecture are written before any app code. |
| **Stack config** | `stack.config.json` stores your choices; Claude generates code to match exactly. |
| **A clear pipeline** | Idea → product spec → domain → UX → UI → architecture → backend → frontend → tests. |
| **Justified architecture** | Claude reasons through architecture, patterns, and best practices for your specific project — then asks for your approval before writing a single file. |
| **User checkpoints** | Claude pauses at every stage transition: here's what I completed, here's what comes next, shall I proceed? |
| **Pre-code reasoning** | Before writing any function or component, Claude reasons through edge cases, error handling, security, and performance — reducing hallucinated code and silent failures. |
| **Superpowers skill approval** | Claude asks your permission before activating any Superpowers skill (brainstorming, writing-plans, executing-plans, code review). |
| **Three project shapes** | Full-stack, API only, or frontend only — set one key in `stack.config.json`, Claude skips irrelevant stages. |
| **Presets for speed** | Say "CRUD app for X" and Claude applies the matching preset. |
| **Upgrade path** | Pull template updates later without touching your specs or code. |

---

## How it works — step by step

### 1. Superpowers check

The very first thing Claude does — before reading workflow state or touching any file — is check whether Superpowers is installed. If it is not, Claude stops and asks:

```
This framework works best with Superpowers.
Install: npx github:obra/superpowers
Install first, or continue without it?
```

### 2. Stack questions

At the idea stage, if `stack.config.json` is empty, Claude asks these one at a time:

1. What are you building?
2. Do you need a frontend, backend, or both?
3. What frontend framework? (Next.js / React / Vue / none)
4. What backend framework? (Fastify / Express / none)
5. What database? (PostgreSQL / MySQL / SQLite / none)
6. ORM? (Prisma / Drizzle / none)
7. Styling? (Tailwind / CSS Modules / none)
8. Auth, deploy target, admin panel? (optional)

Answers are written to `stack.config.json` immediately. Claude does not write specs or code until stack is confirmed.

### 3. Brainstorming (with your approval)

Claude asks permission before activating the Superpowers `brainstorming` skill:

```
I'd like to activate the Superpowers `brainstorming` skill.
It will: ask structured questions one at a time to surface
constraints before writing any specs.
Shall I proceed? (yes / skip / tell me more)
```

If you approve, brainstorming runs. If you skip, Claude proceeds with built-in questions and notes the skip.

### 4. Spec pipeline

Claude runs each stage in order, never skipping ahead:

```
Idea → Product spec → Domain rules → UX flows → UI system → Architecture
→ [API contract — optional] → Backend → Frontend → Tests → [Docs — optional]
```

At every stage, Claude uses `writing-plans` (with your approval) to write a plan before touching files, and `requesting-code-review` (with your approval) after each stage completes.

### 5. Your checkpoint at every stage

After every stage, Claude pauses:

```
✓ Completed: product_spec
  → Defined problem, target users, and 4 core features.

Next: domain_rules
  → Define business rules — who can do what, validation logic,
    domain entities.

Ready to proceed? (yes / adjust first / skip)
```

You stay in control. Claude never moves to the next stage without your go-ahead.

### 6. Architecture decisions — your approval required

Before writing any architecture spec or implementation code, Claude reasons through the project and presents justified decisions:

```
Architecture decisions for [your app]:
- System: Modular Monolith (single team, no microservice overhead)
- Layers: Hexagonal (complex domain rules, testable core needed)
- Data: Repository + Prisma (clean ORM separation)
- API: REST + OpenAPI contract
- Frontend state: Zustand (moderate complexity)
- Error handling: Result types in domain, HTTP errors at API boundary

Shall I proceed with this, or would you like to change anything?
```

Claude does not write a single file until you approve.

### 7. Pre-code reasoning before every unit of code

Before writing any route, service, domain function, or UI component, Claude runs a reasoning gate:

1. **Purpose** — what does this code do?
2. **Edge cases** — what inputs or states could break it?
3. **Error conditions** — what can fail, and how will each be handled?
4. **Security** — does this touch user input, auth, file system, or DB queries?
5. **Performance** — N+1 risk? unbounded loops? missing indexes?
6. **Flow correctness** — does the happy path and failure path make sense end to end?

Only after all six are answered does Claude write the code.

---

## What Claude does at each stage

| Stage | What happens |
|-------|-------------|
| `idea` | Claude brainstorms with you, collects stack, writes `stack.config.json` |
| `product_spec` | Writes problem statement, target users, core features, functional requirements |
| `domain_rules` | Writes business rules, domain entities, validation logic |
| `ux_flow` | Maps user journeys and screen flows |
| `ui_system` | Defines component patterns, tokens, design system |
| `architecture` | Reasons through and presents system architecture for your approval, writes `spec/architecture/decisions.md` |
| `api_contract` *(optional)* | Generates `spec/api/openapi.yaml`; backend and frontend conform to it |
| `backend` | Implements routes, services, domain logic — with pre-code reasoning on each unit |
| `frontend` | Builds UI against the API contract — with pre-code reasoning on each component |
| `tests` | Derives acceptance tests from specs; sets up test runner and coverage |
| `docs` *(optional)* | Generates human-readable docs from specs |

---

## User checkpoints

Checkpoints happen automatically at every stage boundary. You can say:

- **"yes"** — proceed to next stage
- **"adjust first"** — Claude pauses and lets you make changes
- **"skip"** — Claude skips the next stage (for optional stages only)

Four checkpoints are **mandatory** and can never be skipped, even if you say "build autonomously":

| Checkpoint | Why |
|------------|-----|
| After `product_spec` | Confirm the problem and features are correct before domain work |
| After `architecture` | Approve architecture decisions before any code is written |
| After `backend` | Validate API shape before frontend is built against it |
| After `tests` | Confirm coverage before calling the project done |

---

## Architecture decisions

At the architecture stage, Claude does not randomly pick patterns. It analyses:

- Project scale (personal tool / startup / enterprise)
- Data model complexity
- Real-time requirements
- Read/write patterns
- Team size (implied)
- Deployment target

Then decides — with written justification — the best choice for:

| Dimension | Options Claude considers |
|-----------|--------------------------|
| System architecture | Monolith, Modular Monolith, Microservices, Serverless |
| Code organisation | Layered (MVC), Hexagonal, Feature-sliced |
| Data access | Active Record, Repository, CQRS |
| Frontend state | Local state, Context, Zustand, Redux |
| API style | REST, GraphQL, tRPC |
| Error strategy | Result types, exceptions, error boundaries |

All decisions are written to `spec/architecture/decisions.md` after your approval.

---

## Pre-code reasoning

Before writing any implementation unit, Claude reasons out loud:

```
Before writing POST /tasks:
1. Purpose: create a task scoped to a team workspace
2. Edge cases: deadline in the past, assignee not a team member, empty title
3. Errors: DB fail → 500, invalid assignee → 404, missing fields → 422, unauthed → 401
4. Security: Zod validation, JWT team membership check, Prisma parameterised queries
5. Performance: single write, membership check in same transaction
6. Flow: auth check → validate → check assignee membership → insert → 201
```

Then writes the code. This reduces hallucinated code, silent failures, and security holes before they happen — not after.

---

## Superpowers skill approval

Claude asks permission before activating any Superpowers skill:

```
I'd like to activate the Superpowers `writing-plans` skill.
It will: write a step-by-step implementation plan before touching any files.
Shall I proceed? (yes / skip / tell me more)
```

| Skill | When Claude requests it |
|-------|------------------------|
| `brainstorming` | Before writing any specs |
| `writing-plans` | Before starting each stage |
| `executing-plans` | When executing a written plan via subagents |
| `requesting-code-review` | After each stage completes |

If you say skip, Claude falls back to built-in behaviour and notes it.

---

## Project shapes

Set one key in `stack.config.json` to shape the entire project:

| Shape | Config | Stages skipped |
|-------|--------|----------------|
| **Full-stack** | `frontend`, `backend`, `database` all set | None |
| **API only** | `frontend: "none"` | `ux_flow`, `ui_system`, `frontend` |
| **Frontend only** | `backend: "none"`, `database: "none"` | `domain_rules`, `backend`, `api_contract`, DB setup |

Claude reads this at the start and automatically skips the irrelevant stages.

---

## Presets

Presets apply a matching configuration when the request clearly fits a known pattern. Claude still asks for your approval before using one.

| Preset | When it applies | What it sets up |
|--------|----------------|-----------------|
| `crud` | "Build an admin to manage X" | Full-stack, REST, Prisma, Tailwind |
| `auth-dashboard` | "Build a dashboard with login" | Full-stack, JWT auth, protected routes |
| `api-only` | "Build an API for Y, no UI" | Backend + DB, OpenAPI contract, no frontend |
| `frontend-only` | "Build a Next.js app using Stripe / Supabase / external API" | Frontend only, no backend or DB |

---

## When to use this

| Situation | Why it fits |
|-----------|-------------|
| Starting a new web app or API from zero | Clear path from idea to running code |
| You want specs before code | Pipeline enforces spec → architecture → implementation order |
| You use Claude (Cursor, VS Code) | Designed for AI-assisted development |
| You want to stay in control | Checkpoints at every stage, approval before every major decision |
| Solo builder or small team | One person can drive the whole pipeline |
| Learning spec-first or DDD | Repo structure and stages teach the discipline |

---

## When not to use this

| Situation | Why it is a poor fit |
|-----------|----------------------|
| Existing codebase with no specs | Pipeline assumes you start from idea — migrating is a big lift |
| You prefer free-form coding | The pipeline is intentionally rigid |
| Tiny one-off script or CLI | Overkill for a single file or 100-line script |
| Mobile-only with no web | Template is web + API centric; Expo/React Native support is minimal |
| Non-Claude AI assistant | Instructions target Claude specifically |

You can still clone the repo and use only the parts you like — just the spec layout, just the workflow config, or just the CLAUDE.md instructions.

---

## Try these prompts

Open your project in Cursor or VS Code and try:

| Goal | Prompt |
|------|--------|
| Start from scratch | *"Build a CRUD app for managing projects"* |
| Auth + dashboard | *"Build a dashboard with GitHub login"* |
| API only | *"Build a REST API for a booking system, no UI"* |
| Frontend only | *"Build a Next.js app that uses Stripe for payments"* |
| Custom stack | *"Build a blog with Next.js, Prisma, and Tailwind"* |

Claude will check Superpowers, ask stack questions, confirm architecture, and run the pipeline — pausing for your input at every stage.

---

## Commands

| Command | What it does |
|---------|-------------|
| `npx github:lovek28/awesome-software-framework <name>` | Create a new project (no clone needed) |
| `node cli.js <name>` | Create a new project from a local clone |
| `npx github:lovek28/awesome-software-framework upgrade` | Update an existing project with the latest template files |

| Option | Description |
|--------|-------------|
| `-v` / `--version` | Print the CLI version |
| `-o` / `--output-dir <path>` | Create the project in a specific directory |

---

## Project structure

```
myapp/
├── CLAUDE.md                   # All instructions for Claude — start here
├── stack.config.json           # Your tech stack choices
├── workflow.config.json        # Pipeline stages, optional stages, hooks
├── .claude/
│   ├── workflow.state.json     # Current stage, completed list, mode
│   ├── instructions.md         # Workflow rules
│   ├── agents.md               # Spec / Backend / Frontend agents
│   ├── context-scope.md        # What Claude reads per stage
│   ├── stages/                 # Per-stage instructions
│   └── skills/                 # Stack skills (Next.js, Prisma, Fastify, etc.)
├── spec/
│   ├── product/                # Product spec, problem, features, requirements
│   ├── domain/                 # Business rules, entities, validation
│   ├── ux/                     # User flows, journeys
│   ├── ui/                     # Component patterns, design tokens
│   ├── architecture/           # System architecture, decisions, data model
│   ├── security.md             # OWASP checklist, auth decisions
│   └── api/openapi.yaml        # API contract (when api_contract stage is enabled)
├── .presets/                   # crud, auth-dashboard, api-only, frontend-only
├── apps/
│   ├── web/                    # Frontend app
│   ├── api/                    # Backend API
│   └── admin/                  # Optional admin panel
├── packages/
│   ├── domain/                 # Business logic, entities
│   ├── services/               # Application services, use cases
│   ├── ui/                     # Shared UI components
│   └── shared/                 # Shared types and utilities
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                       # Generated from spec (optional docs stage)
└── infra/                      # Docker, CI, deploy configs
```

The three files that matter most:

- **`CLAUDE.md`** — all instructions for how Claude works in this project
- **`.claude/workflow.state.json`** — the current pipeline stage and what is completed
- **`stack.config.json`** — your tech stack; Claude generates code to match

---

## Upgrading a project

Pull the latest template updates without overwriting your work:

```bash
cd myapp
npx github:lovek28/awesome-software-framework upgrade
```

This updates `CLAUDE.md`, workflow config, `.claude/` instructions, Docker setup, and `.env.example`. Your specs, code, `stack.config.json`, and workflow state are never touched.

---

## License

MIT · [Repository](https://github.com/lovek28/awesome-software-framework) · Built with [Superpowers](https://github.com/obra/superpowers)
