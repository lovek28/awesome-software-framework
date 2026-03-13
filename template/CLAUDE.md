# Project Instructions for Claude

You are working inside a **Specification-First** repository. Follow these rules strictly.

## 1. Workflow State (Required)

**Always read `.claude/workflow.state.json`** before generating any content. It defines:
- Current stage in the pipeline
- The user's idea
- Which stages are already completed

Do not skip stages. Do not generate implementation (backend, frontend, tests) until the architecture stage is completed and documented.

## 2. Pipeline Order

Stages must be executed in this order (defined in `workflow.config.json`):

1. **idea** — Capture and clarify the user's idea.
2. **product_spec** — Write `spec/product/spec.md` (problem, users, features, requirements, constraints).
3. **domain_rules** — Write `spec/domain/entities.md`, `spec/domain/rules.md`, `spec/domain/glossary.md`.
4. **ux_flow** — Write `spec/ux/flows.md` and `spec/ux/states.md`.
5. **ui_system** — Write `spec/ui/system.md` (components, design principles).
6. **architecture** — Write `spec/architecture/overview.md`, `backend.md`, `frontend.md`, `data-model.md`.
7. **backend** — Implement in `packages/domain`, `packages/services`, `apps/api`.
8. **frontend** — Implement in `packages/ui`, `apps/web`.
9. **tests** — Implement in `tests/unit`, `tests/integration`, `tests/e2e`.

After completing a stage, update `workflow.state.json`: set `stage` to the next stage and add the completed stage to `completed`.

## 3. Specification First

- **Never generate implementation code before architecture exists.** If `workflow.state.json` shows architecture is not in `completed`, only work on spec or architecture files.
- Update specification files (product, domain, ux, ui, architecture) before generating application code.
- After significant spec changes, update `spec/index.md` to summarize the system.

## 4. Stack Configuration

**Always read `stack.config.json`** before generating code. If it is empty (e.g. `{}`), ask the user for tech choices, write them to `stack.config.json`, then proceed. Use the defined stack (frontend, backend, database, orm, styling, etc.) for all implementation. Do not introduce technologies outside this config unless the user explicitly requests it.

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

- **Use `DATABASE_URL`** from the environment for all DB connections. The project has `.env.example` and `docker-compose.yml` (Postgres) at the root; do not hardcode connection strings.
- **ORM config**: Point the ORM (Prisma, Drizzle, TypeORM, etc.) at `process.env.DATABASE_URL`. For Prisma, set `url = env("DATABASE_URL")` in `schema.prisma` and use the existing `.env.example` format.
- **Migrations**: Add and run migrations via the chosen ORM (e.g. `npx prisma migrate dev`). Place schema/migrations in the repo per `spec/architecture/data-model.md`.
- **Document run steps** in `apps/api/README.md` or the project README: start DB (`docker compose up -d`), copy `.env.example` to `.env`, run migrations, then start the API. This ensures the database builds properly on localhost.
