# Project Instructions for Claude

You are working inside a **Specification-First** repository. Follow these rules strictly.

## 1. Workflow State (Required)

**Always read `.claude/workflow.state.json`** before generating any content. It defines:
- Current stage in the pipeline
- The user's idea
- Which stages are already completed

Do not skip stages. Do not generate implementation (backend, frontend, tests) until the architecture stage is completed and documented.

## 2. Pipeline Order

Stages are defined in `workflow.config.json`:

- **pipeline**: Ordered list of stage IDs. Execute in this order. Projects may add **custom stages** (e.g. `docs`, `deploy_config`) to the list; run them in order when present. See `.claude/instructions.md` for how to implement custom stages.
- **optional**: List of stage IDs that are optional (e.g. `tests`). For an optional stage: ask the user if they want it (e.g. "Do you want tests for this project?") or skip when not needed. Required stages are always enforced.
- **stages**: Optional map of stage ID to `{ "description": "...", "optional": true }`. Use the description as the single source for "what to do at this stage."

Default pipeline order: **idea** → **product_spec** → **domain_rules** → **ux_flow** → **ui_system** → **architecture** → **backend** → **frontend** → **tests** (and any custom stages after or between these).

After completing a stage, update `workflow.state.json`: set `stage` to the next stage and add the completed stage to `completed`.

## 3. Specification First

- **Never generate implementation code before architecture exists.** If `workflow.state.json` shows architecture is not in `completed`, only work on spec or architecture files.
- Update specification files (product, domain, ux, ui, architecture) before generating application code.
- After significant spec changes, update `spec/index.md` to summarize the system.

## 4. Stack Configuration

**Always read `stack.config.json`** before generating code.

**Stack validation:** After writing or updating `stack.config.json`, it must contain at least **frontend**, **backend**, and **database** (and optionally `orm`, `styling`, etc.). If the user skips one, ask again or fill a sensible default for that key only (e.g. "No frontend?" → "I'll set frontend to nextjs unless you prefer something else."). Do not leave required keys missing.

If the file is empty (e.g. `{}`), ask the user for tech choices, write them to `stack.config.json` with at least frontend, backend, database, then proceed. Use the defined stack for all implementation. Do not introduce technologies outside this config unless the user explicitly requests it.

## 5. Token Efficiency

- Read only files needed for the current stage.
- For implementation stages, prefer reading the relevant spec and architecture files plus the target package/app, not the entire repo.

## 6. File Ownership

- **Backend**: `packages/domain`, `packages/services`, `apps/api`
- **Frontend**: `packages/ui`, `apps/web`
- **Tests**: `tests/unit`, `tests/integration`, `tests/e2e`
- **Infrastructure**: `infra/`

Keep domain logic in `packages/domain`, application services in `packages/services`, and follow the layered architecture described in `spec/architecture/`.

## 7. Chat-First Development — Ask the user for choices

The user interacts via prompts. When they say things like "Build a marketplace for freelancers" or "Build a CRM system":

1. **Read workflow state** and start from the idea stage (or the next incomplete stage).
2. **Before writing specs or code, ask the user all relevant questions** so you can fill `stack.config.json` and proceed correctly. Do **not** assume the stack; the CLI does not collect it — you must.
3. **Tech stack questions** — Ask in chat (one message or a short list is fine):
   - **Frontend**: e.g. Next.js, Remix, React (Vite), Vue, Svelte, or other. Accept any answer.
   - **Backend**: e.g. Fastify, Express, NestJS, Hono, or other. Accept any answer.
   - **Database**: e.g. PostgreSQL, MySQL, SQLite, or other. Accept any answer.
   - **ORM / data layer**: e.g. Prisma, Drizzle, TypeORM, Knex, or "none" / raw SQL. Accept any answer.
   - **Styling**: e.g. Tailwind CSS, CSS Modules, styled-components, or other. Accept any answer.
   There is no default stack in the repo — you decide with the user. Write the user's choices to `stack.config.json` (use the keys: `frontend`, `backend`, `database`, `orm`, `styling`). Add other keys if the user names additional concerns (e.g. auth, hosting).
4. **Other relevant questions** — Depending on the idea, ask about: target users, must-have features, constraints, or preferences. Use answers to fill `spec/product/spec.md` and the rest of the pipeline.
5. Then execute the pipeline in order and implement according to the spec and architecture.

Do not jump to code. Always advance through the pipeline deterministically. The user can give any technology names; you are not limited to a fixed list.

## 8. Local database (backend stage)

When implementing the **backend** stage, ensure the app runs against a **database on localhost**:

- **Use `DATABASE_URL`** from the environment for all DB connections. The project has `.env.example` at the root; do not hardcode connection strings.
- **Database choice** (from `stack.config.json`):
  - **PostgreSQL / MySQL**: Use `docker-compose.yml` (Postgres by default) or `docker-compose.mysql.yml` if database is MySQL. See `infra/README.md`. Set `DATABASE_URL` in `.env` to match (e.g. `postgresql://...` or `mysql://...`).
  - **SQLite**: No Docker needed. Set `DATABASE_URL=file:./dev.db` (or `file:./data/dev.db`) in `.env`. The ORM will create the file. Document in `apps/api/README.md` that for SQLite the user only needs to copy `.env.example` to `.env` and run migrations.
- **ORM config**: Point the ORM (Prisma, Drizzle, TypeORM, etc.) at `process.env.DATABASE_URL`. For Prisma, set `url = env("DATABASE_URL")` in `schema.prisma` and use the existing `.env.example` format.
- **Migrations**: Add and run migrations via the chosen ORM (e.g. `npx prisma migrate dev`). Place schema/migrations in the repo per `spec/architecture/data-model.md`.
- **Document run steps** in `apps/api/README.md` or the project README: for Postgres/MySQL — start DB (`docker compose up -d`), copy `.env.example` to `.env`, run migrations, then start the API; for SQLite — copy `.env.example` to `.env`, run migrations, then start the API.
