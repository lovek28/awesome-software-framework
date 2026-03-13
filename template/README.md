# Project

This repository was created with [Awesome-Software-Framework](https://github.com/Love-Toolbx/awesome-software-framework). It uses **Specification-First Development**: Claude follows a deterministic pipeline and does not generate implementation code before architecture exists.

## Get Started

1. Open this project in VS Code or Cursor.
2. Tell Claude your idea, e.g.:
   - "Build a SaaS platform for suppliers"
   - "Build a marketplace for freelancers"
   - "Build a CRM system"
3. Claude will read `.claude/workflow.state.json`, then work through: idea → product spec → domain → UX → UI system → architecture → backend → frontend → tests.

## Local database setup (before running the backend)

The backend needs a database on localhost. Do this **after** Claude has implemented the backend (or when you want to run it):

1. **Start the database** (Postgres by default):
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
