# Awesome Software Framework

**Build full-stack apps with Claude — specs first, code second.**

Scaffold a repo where Claude follows a clear pipeline: idea → specs → architecture → backend → frontend → tests. No code before architecture. No architecture before specs. Every gate is enforced by hooks — not just instructions.

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/lovek28/awesome-software-framework) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Powered by Superpowers](https://img.shields.io/badge/powered%20by-Superpowers-6c47ff)](https://github.com/obra/superpowers)

---

## Table of contents

- [Built on Superpowers](#built-on-superpowers)
- [Quick start](#quick-start)
- [What you get](#what-you-get)
- [How it works — step by step](#how-it-works--step-by-step)
- [Enforcement — hooks not honour-system](#enforcement--hooks-not-honour-system)
- [What Claude does at each stage](#what-claude-does-at-each-stage)
- [User checkpoints](#user-checkpoints)
- [Architecture decisions](#architecture-decisions)
- [Pre-code reasoning](#pre-code-reasoning)
- [Superpowers skill approval](#superpowers-skill-approval)
- [Project shapes](#project-shapes)
- [Presets](#presets)
- [Supported stacks](#supported-stacks)
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
> **Awesome Software Framework** gives Claude *what to build toward, where to put it, and enforces it can't skip steps*.

| Need | Superpowers alone | This framework |
|------|:-----------------:|:--------------:|
| Disciplined planning before coding | ✓ | ✓ (via Superpowers) |
| Spec directory layout | ✗ | ✓ |
| Tech stack config | ✗ | ✓ |
| Pipeline state tracking | ✗ | ✓ |
| Hook-enforced quality gates | ✗ | ✓ |
| Justified architecture decisions | ✗ | ✓ |
| User checkpoint at every stage | ✗ | ✓ |
| Pre-code reasoning gate (written artifact) | ✗ | ✓ |
| Hardcoded secret detection | ✗ | ✓ |
| Tests required before stage completion | ✗ | ✓ |
| Monorepo scaffold | ✗ | ✓ |
| Three project shapes | ✗ | ✓ |
| Presets | ✗ | ✓ |
| Pull framework updates | ✗ | ✓ |

**Use Superpowers** if you want a smarter Claude on any existing project.
**Use this framework** if you are starting a new app and want spec-first structure, enforced pipeline, and a monorepo layout from day one.
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

Claude checks Superpowers, asks for your stack, reasons through architecture, confirms it with you, and runs the pipeline stage by stage — pausing for your approval at every step. Hooks prevent it from skipping any gate.

---

## What you get

| You get | How it helps |
|---------|--------------|
| **A spec-first repo** | Product, domain, UX, and architecture are written before any app code |
| **Stack config** | `stack.config.json` stores choices; validated by hook on every write |
| **A clear pipeline** | Idea → product spec → domain → UX → UI → architecture → backend → frontend → tests |
| **Justified architecture** | Claude reasons through architecture for your specific project and must get your approval — enforced by hook |
| **User checkpoints** | Claude pauses at every stage transition and records your response — enforced by hook |
| **Pre-code reasoning** | Before writing any code, Claude writes a reasoning gate file answering 6 questions — enforced by hook |
| **Hardcoded secret detection** | Hook scans every file write for connection strings, API keys, passwords |
| **Security spec gate** | Hook blocks implementation until `spec/security.md` exists |
| **Tests gate** | Hook blocks marking tests complete until actual test files exist |
| **Skill approval** | Claude asks permission before activating any Superpowers skill |
| **Three project shapes** | Full-stack, API only, frontend only — Claude skips irrelevant stages |
| **Presets + custom stacks** | Built-in presets; custom skill path for any technology not covered |
| **Upgrade path** | Pull template updates without touching your specs or code |

---

## How it works — step by step

### 1. Superpowers check

Before touching any file, Claude checks if Superpowers is installed. If not, it stops and asks you to install it first (or confirms you want to continue without it).

### 2. Stack questions

Claude asks these one at a time until `stack.config.json` is filled. A hook validates it has the required `frontend`, `backend`, and `database` keys before allowing it to be written.

### 3. Brainstorming (with your approval)

Claude asks permission before activating the Superpowers `brainstorming` skill. If you skip, it proceeds with built-in questions.

### 4. Spec pipeline

Claude runs each stage in order. A hook blocks any spec file from being written before the previous stage is completed.

### 5. Architecture decisions — your approval required

Claude analyses the project context, decides architecture with written justification, presents it to you, and waits for approval. It must write `.claude/gates/architecture-decisions.md` before any architecture spec file — **enforced by hook**.

### 6. User checkpoint at every stage

After every stage Claude writes a checkpoint file and pauses for your response. A hook blocks advancing `workflow.state.json` unless the checkpoint file exists. For mandatory stages it also checks your response was recorded — **enforced by hook**.

### 7. Security spec gate

Before writing any implementation code, Claude writes `spec/security.md`. A hook blocks implementation until it exists — **enforced by hook**.

### 8. Pre-code reasoning gate

Before writing any implementation code Claude writes `.claude/gates/<stage>-gate.md` answering 6 questions. A hook blocks code writes unless the gate file exists — **enforced by hook**.

### 9. Hardcoded secret detection

Every file write to `apps/` or `packages/` is scanned for hardcoded secrets. If found, the write is blocked with a specific message — **enforced by hook**.

### 10. Tests gate

Before marking the tests stage complete, a hook checks actual test files exist in the project — **enforced by hook**.

---

## Enforcement — hooks not honour-system

Every critical rule in this framework is backed by a Claude Code `PreToolUse` hook. Hooks run before every `Write` or `Edit` tool call and block the operation (exit code 2) if the gate is not satisfied.

### Full enforcement map

| Section | Rule | Hook | What gets blocked |
|---------|------|------|-------------------|
| **Section 2** | Spec files written in pipeline order | `check-spec-gate.js` | `spec/domain/` before `product_spec`, `spec/ux/` before `domain_rules`, etc. |
| **Section 3** | No code before architecture | `check-implementation-gate.js` | Any write to `apps/` or `packages/` if architecture not completed |
| **Section 3a** | Architecture decisions written and approved | `check-architecture-decisions-gate.js` | Any write to `spec/architecture/` before `.claude/gates/architecture-decisions.md` exists |
| **Section 3b** | Stage checkpoint written with user response | `check-stage-advance-gate.js` | Any `workflow.state.json` advance without checkpoint file; mandatory stages also require user response recorded |
| **Section 3c** | Pre-code reasoning gate written | `check-implementation-gate.js` | Any write to `apps/` or `packages/` before `.claude/gates/<stage>-gate.md` exists |
| **Section 4** | stack.config.json has required keys | `check-stack-config-gate.js` | Any `stack.config.json` write missing `frontend`, `backend`, or `database` |
| **Section 6** | Security spec exists before implementation | `check-security-gate.js` | Any implementation write before `spec/security.md` exists |
| **Section 6** | No hardcoded secrets | `check-security-gate.js` | Any file write containing connection strings, API keys, hardcoded passwords |
| **Section 11** | Tests exist before marking complete | `check-tests-gate.js` | Marking tests stage complete with no `.test.ts` / `.spec.ts` files |

### What is still honour-system

These cannot be enforced at the tool level — they happen in conversation or require human judgement:

| Rule | Why it can't be enforced |
|------|--------------------------|
| Superpowers skill approval | Conversation — no file write to hook on |
| Stack questions answered truthfully | User provides answers — no validation possible |
| Quality of gate file content | Hook checks existence, not whether reasoning is good |
| Architecture decision quality | Hook checks file exists, not whether decisions are sound |
| User actually reads checkpoints | Can't force the user to review |

---

## What Claude does at each stage

| Stage | What happens |
|-------|-------------|
| `idea` | Superpowers check, stack questions, `stack.config.json` written and validated |
| `product_spec` | Problem, target users, features, requirements written to `spec/product/spec.md` |
| `domain_rules` | Business rules, domain entities, validation logic |
| `ux_flow` | User journeys and screen flows |
| `ui_system` | Component patterns, design tokens |
| `architecture` | Architecture reasoned and approved → `.claude/gates/architecture-decisions.md` → `spec/architecture/` |
| `api_contract` *(optional)* | `spec/api/openapi.yaml` generated; backend and frontend conform to it |
| `backend` | Security gate → reasoning gate → implementation with skill-guided patterns |
| `frontend` | Reasoning gate → implementation with skill-guided patterns |
| `tests` | Test runner setup, spec-derived test cases, actual test files required before completion |
| `docs` *(optional)* | Human-readable docs generated from specs |

---

## User checkpoints

After every stage Claude writes a checkpoint and pauses:

```
✓ Completed: product_spec
  → Defined problem, target users, and 4 core features.

Next: domain_rules
  → Define business rules — who can do what, validation logic, domain entities.

Ready to proceed? (yes / adjust first / skip)
```

Four stages have **mandatory checkpoints** — they can never be skipped, even in autonomous mode:

| Stage | Why mandatory |
|-------|---------------|
| `product_spec` | Confirm problem and features before domain work |
| `architecture` | Approve architecture decisions before any code |
| `backend` | Validate API shape before frontend is built against it |
| `tests` | Confirm coverage before calling the project done |

The checkpoint hook also verifies your response (`yes` / `adjust` / `skip`) was recorded in the checkpoint file for all mandatory stages.

---

## Architecture decisions

Claude does not randomly pick patterns. Before writing any architecture spec it analyses:

- Project scale, data complexity, real-time requirements, read/write patterns
- Implied team size and deployment target

Then presents justified decisions for every dimension:

| Dimension | Options considered |
|-----------|--------------------|
| System architecture | Monolith, Modular Monolith, Microservices, Serverless |
| Code organisation | Layered (MVC), Hexagonal, Feature-sliced |
| Data access | Active Record, Repository, CQRS |
| Frontend state | Local state, Context, Zustand, Redux |
| API style | REST, GraphQL, tRPC |
| Error strategy | Result types, exceptions, error boundaries |

Decisions are written to `.claude/gates/architecture-decisions.md` after your approval. The hook blocks any architecture spec file until this file exists.

---

## Pre-code reasoning

Before writing any function, route, service, or component, Claude writes `.claude/gates/<stage>-gate.md` answering six questions:

1. **Purpose** — what does this code do?
2. **Edge cases** — what inputs or states could break it?
3. **Error conditions** — what can fail and how is each handled?
4. **Security** — does this touch user input, auth, file system, or DB queries?
5. **Performance** — N+1 risk? unbounded loops? missing indexes?
6. **Flow correctness** — does the happy path and failure path make sense end to end?

The hook blocks any code write to `apps/` or `packages/` until this file exists.

---

## Superpowers skill approval

Claude asks permission before activating any Superpowers skill:

```
I'd like to activate the Superpowers `writing-plans` skill.
It will: write a step-by-step implementation plan before touching any files.
Shall I proceed? (yes / skip / tell me more)
```

| Skill | When requested |
|-------|---------------|
| `brainstorming` | Before writing any specs |
| `writing-plans` | Before starting each stage |
| `executing-plans` | When executing a plan via subagents |
| `requesting-code-review` | After each stage completes |

---

## Project shapes

| Shape | Config | Stages skipped |
|-------|--------|----------------|
| **Full-stack** | All three set | None |
| **API only** | `frontend: "none"` | `ux_flow`, `ui_system`, `frontend` |
| **Frontend only** | `backend: "none"`, `database: "none"` | `domain_rules`, `backend`, `api_contract`, DB setup |

---

## Presets

| Preset | When it applies | Architecture hints |
|--------|----------------|--------------------|
| `crud` | "Build an admin to manage X" | Modular monolith, layered, REST, Prisma |
| `auth-dashboard` | "Build a dashboard with login" | JWT + refresh tokens, protected routes, role-based access |
| `api-only` | "Build an API, no UI" | OpenAPI-first, cursor pagination, rate limiting |
| `frontend-only` | "Next.js app using Stripe / Supabase" | React Query, server actions for secrets, no backend |

---

## Supported stacks

Built-in skills with real patterns and code examples:

| Layer | Built-in | Falls back gracefully to |
|-------|----------|--------------------------|
| **Backend** | Fastify, Express | api-design.md principles + pre-code reasoning |
| **Frontend** | Next.js, React (Vite), Vue 3, Nuxt 3 | spec/ux patterns + pre-code reasoning |
| **ORM** | Prisma, Drizzle | General ORM patterns |

When no skill matches, Claude tells you, applies general principles, and guides you to add a custom skill at `.claude/skills/[name].md`.

---

## When to use this

| Situation | Why it fits |
|-----------|-------------|
| Starting a new web app or API from zero | Clear enforced path from idea to running code |
| You want specs before code | Pipeline enforces spec → architecture → implementation |
| You want to stay in control | Checkpoints at every stage, approval before every major decision |
| You use Claude (Cursor, VS Code) | Designed for AI-assisted development |
| You care about security | Secret detection hook, security spec gate, OWASP checklist |
| Solo builder or small team | One person can drive the whole pipeline |

---

## When not to use this

| Situation | Why it is a poor fit |
|-----------|----------------------|
| Existing codebase | Pipeline assumes you start from idea |
| You prefer free-form coding | The pipeline and hooks are intentionally rigid |
| Tiny one-off script | Overkill for a single file |
| Mobile-only with no web | Template is web + API centric |
| Non-Claude AI assistant | Hooks and instructions target Claude specifically |

---

## Try these prompts

| Goal | Prompt |
|------|--------|
| Start from scratch | *"Build a CRUD app for managing projects"* |
| Auth + dashboard | *"Build a dashboard with GitHub login"* |
| API only | *"Build a REST API for a booking system, no UI"* |
| Frontend only | *"Build a Next.js app that uses Stripe for payments"* |
| Custom stack | *"Build a blog with Next.js, Prisma, and Tailwind"* |

---

## Commands

| Command | What it does |
|---------|-------------|
| `npx github:lovek28/awesome-software-framework <name>` | Create a new project |
| `node cli.js <name>` | Create from a local clone |
| `npx github:lovek28/awesome-software-framework upgrade` | Update template files without touching your code |

| Option | Description |
|--------|-------------|
| `-v` / `--version` | Print CLI version |
| `-o` / `--output-dir <path>` | Create project in a specific directory |

---

## Project structure

```
myapp/
├── CLAUDE.md                     # All instructions for Claude — start here
├── stack.config.json             # Your tech stack (validated by hook)
├── workflow.config.json          # Pipeline stages, optional stages, hooks
├── .claude/
│   ├── workflow.state.json       # Current stage, completed list, mode
│   ├── settings.json             # Hook configuration
│   ├── hooks/                    # Enforcement hooks (run before every Write/Edit)
│   │   ├── check-stack-config-gate.js
│   │   ├── check-spec-gate.js
│   │   ├── check-architecture-decisions-gate.js
│   │   ├── check-stage-advance-gate.js
│   │   ├── check-implementation-gate.js
│   │   ├── check-security-gate.js
│   │   └── check-tests-gate.js
│   ├── gates/                    # Written artifacts Claude produces at each gate
│   │   ├── architecture-decisions.md
│   │   ├── checkpoint-<stage>.md
│   │   └── <stage>-gate.md
│   ├── instructions.md
│   ├── agents.md
│   ├── context-scope.md
│   ├── stages/
│   └── skills/                   # Stack skills (Fastify, Next.js, Prisma, etc.)
├── spec/
│   ├── product/
│   ├── domain/
│   ├── ux/
│   ├── ui/
│   ├── architecture/
│   ├── security.md               # OWASP checklist (required before implementation)
│   └── api/openapi.yaml
├── .presets/
├── apps/
├── packages/
├── tests/
├── docs/
└── infra/
```

The three files that matter most: **`CLAUDE.md`** (all instructions), **`.claude/workflow.state.json`** (current stage), **`stack.config.json`** (your tech stack).

---

## Upgrading a project

```bash
cd myapp
npx github:lovek28/awesome-software-framework upgrade
```

Updates `CLAUDE.md`, hooks, workflow config, `.claude/` instructions, Docker setup, and `.env.example`. Your specs, code, `stack.config.json`, and workflow state are never touched.

---

## License

MIT · [Repository](https://github.com/lovek28/awesome-software-framework) · Built with [Superpowers](https://github.com/obra/superpowers)
