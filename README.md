# Awesome-Software-Framework

A framework that lets you scaffold a repository for **Specification-First Development** with Claude Code. Claude follows a deterministic software development lifecycle and never generates implementation code before architecture exists.

## Install

This package is not published to npm. Use it directly from GitHub.

**Option 1 — run without cloning** (replace `Love-Toolbx` and repo name with this repo):

```bash
npx github:Love-Toolbx/awesome-software-framework myapp
```

**Option 2 — clone and run:**

```bash
git clone https://github.com/Love-Toolbx/awesome-software-framework.git
cd awesome-software-framework
node cli.js myapp
```

You’ll be asked whether to use the **standard stack** or pick your own:

- **Standard stack** (default): Next.js, Fastify, Postgres, Prisma, Tailwind CSS  
- **Custom**: choose frontend, backend, database, ORM, and styling from the listed options

To skip prompts and use the standard stack, add `--yes` or `-y`:

```bash
npx github:Love-Toolbx/awesome-software-framework myapp --yes
# or when using clone:
node cli.js myapp -y
```

Then:

```bash
cd myapp
```

Open the project in VS Code (or Cursor) and start building with Claude. Your choices are saved in `stack.config.json`; Claude uses that file when generating code.

> **If this package is later published to npm**, you’ll be able to run `npx create-awesome-software myapp` instead.

### Stack options (when not using standard)

| Category | Options |
|---------|---------|
| Frontend | Next.js, Remix, React (Vite) |
| Backend | Fastify, Express, NestJS |
| Database | PostgreSQL, MySQL, SQLite |
| ORM | Prisma, Drizzle, TypeORM |
| Styling | Tailwind CSS, CSS Modules, styled-components |

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
