# Project

This repository was created with [Awesome-Software-Framework](https://github.com/lovek28/awesome-software-framework). It uses **Specification-First Development**: Claude follows a deterministic pipeline and does not generate implementation code before architecture exists.

The file **`.framework-version`** at the project root records which framework version this project was scaffolded with. To pull non-destructive updates (e.g. updated CLAUDE.md, workflow.config.json, .claude/instructions.md, docker-compose, .env.example) while keeping your specs, code, and workflow state unchanged, run from this project root:

```bash
npx create-awesome-software upgrade
```

Or from anywhere: `npx create-awesome-software upgrade /path/to/this/project`

## Get Started

1. Open this project in Cursor (or VS Code).
2. Tell Claude what you want to build, e.g.:
   - "Build a SaaS platform for suppliers"
   - "Build a marketplace for freelancers"
   - "Build a CRM system"
3. Claude will **ask you** for tech stack (frontend, backend, database, ORM, styling) and any other relevant questions, then write choices to `stack.config.json`.
4. Claude then runs the pipeline: idea → product spec → domain → UX → UI system → architecture → backend → frontend → tests.

## Local database setup (before running the backend)

The backend needs a database on localhost. Do this **after** Claude has implemented the backend (or when you want to run it):

1. **Start the database** (e.g. Postgres — see `stack.config.json`):
   ```bash
   docker compose up -d
   ```
2. **Copy env** and set `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
3. **Run migrations** (e.g. Prisma):
   ```bash
   npx prisma migrate dev
   ```
4. Then start the API and web app as documented in `apps/api` and `apps/web`.

See **infra/README.md** for MySQL/SQLite and more detail.

## Key Files

- **CLAUDE.md** — Instructions for Claude (workflow, pipeline, stack).
- **.claude/workflow.state.json** — Current stage and completed stages; Claude reads this first.
- **.claude/agents.md** — Stage-based agents (Spec Writer, Backend, Frontend); use for focused edits.
- **.claude/stages/** — Per-stage instruction files; read the one for the current stage when using an agent.
- **workflow.config.json** — Ordered pipeline stages.
- **stack.config.json** — Frontend, backend, database, ORM, styling; Claude follows this when generating code.
- **spec/** — Product, domain, UX, UI, and architecture specs; fill these before implementation.

## Pipeline

1. Idea  
2. Product Specification  
3. Domain Design  
4. UX Flows  
5. UI System  
6. System Architecture  
7. Backend Implementation  
8. Frontend Implementation  
9. Testing  

Do not skip stages. Do not generate backend, frontend, or tests until the architecture stage is complete.
