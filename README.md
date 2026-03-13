# Awesome-Software-Framework v2.0.0

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

- `create-awesome-software <project-name>` — Scaffold a new project.
- `upgrade [path]` — Pull non-destructive template updates (CLAUDE, workflow, .claude/instructions, agents, context-scope, extensibility, docker-compose, .env.example). Specs, code, stack.config.json, and workflow state are left unchanged. Run from project root or pass the path.

**Options:**

- `-v` / `--version` — Print the CLI version and exit.
- `-o` / `--output-dir <path>` — Create the project in the given directory (default: current directory).

When you run the CLI to create a project, it may print a one-line notice if a newer version is available (e.g. “Update available: 1.1.0”). Set `NO_UPDATE_CHECK=1` to disable this check; the CLI uses a short timeout and does not block if offline.

After scaffolding, the new project contains a `.framework-version` file with the framework version it was created with. This is used for future upgrade tooling (e.g. pulling non-destructive template updates). See the project’s README for upgrade strategy.

Then:

```bash
cd myapp
```

Open the project in **Cursor** (or VS Code) and tell Claude what you want to build (e.g. "Build a marketplace for freelancers"). **Claude will ask you** for tech stack (frontend, backend, database, ORM, styling) and any other relevant choices, then run the full pipeline. You can pick from common options or name any other technology.

> **If this package is later published to npm**, you’ll be able to run `npx create-awesome-software myapp` instead.

## How It Works

1. **You describe the product** in natural language ("Build a CRUD app for inventory", "Build a dashboard with login", etc.).
2. **Claude runs a structured pipeline**: Idea → Product Spec → Domain → UX → UI System → Architecture → (optional API contract) → Backend → Frontend → Tests → (optional Docs). Optional and custom stages; presets (CRUD, auth-dashboard, api-only) speed up common shapes.
3. **Specification first**: Specs (product, domain, UX, UI, architecture, security) are written before code.
4. **Stack-aware**: `stack.config.json` holds frontend, backend, database, ORM, styling, and optionally auth, deploy, multi-app; Claude generates code to match.

## Features

- **Workflow flexibility** — Optional/custom stages, stage descriptions, quality gates, modes (quick vs full), checkpoints and resume.
- **Auth & security** — Optional auth in stack; `spec/security.md` checklist; secrets in env only.
- **Deployment & CI** — Optional deploy target; deploy_config stage; `.github/workflows/ci.yml.example`; env matrix.
- **API contract** — Optional OpenAPI (`spec/api/openapi.yaml`); backend/frontend conform.
- **Tests** — Test runner and E2E bootstrap; optional coverage; spec-driven test cases.
- **Observability** — Health endpoint; structured logging; optional runbooks and ADRs.
- **Multi-app & presets** — Optional admin/mobile in stack; presets (crud, auth-dashboard, api-only).
- **Extensibility** — Hooks (before/after stage), custom stages, plugin contract draft.
- **Docs from spec** — Optional docs stage; API and product/UX docs from spec.
- **Agents** — Per-stage instructions (`.claude/stages/`), Cursor agents (Spec, Backend, Frontend), `.claude/agents.md`.
- **Skills** — Stack and stage skills (`.claude/skills/`); Next.js, Fastify, Prisma, product-spec, api-design.
- **Token control** — Per-stage context scope (`.claude/context-scope.md`), optional summarization.

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
├── CLAUDE.md
├── stack.config.json
├── workflow.config.json   # pipeline, optional stages, hooks, testCoverageMin
├── .claude/
│   ├── workflow.state.json   # stage, idea, completed, mode
│   ├── instructions.md
│   ├── agents.md             # Stage agents (Spec, Backend, Frontend)
│   ├── context-scope.md      # What to read per stage
│   ├── extensibility.md      # Hooks, custom stages
│   ├── stages/               # Per-stage instructions
│   └── skills/               # Stack and stage skills
├── spec/
│   ├── index.md
│   ├── product/spec.md
│   ├── domain/ (entities, rules, glossary)
│   ├── ux/ (flows, states)
│   ├── ui/system.md
│   ├── architecture/ (overview, backend, frontend, data-model, runbooks, adr/)
│   ├── security.md
│   └── api/openapi.yaml      # When using API contract
├── .presets/                 # crud, auth-dashboard, api-only (optional)
├── apps/ (web, api; optionally admin, mobile)
├── packages/ (domain, services, ui, shared)
├── tests/ (unit, integration, e2e)
├── docs/                     # Generated from spec (optional)
└── infra/
```

## License

MIT
