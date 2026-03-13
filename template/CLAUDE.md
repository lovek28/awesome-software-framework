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

**Always read `stack.config.json`** before generating code. Use the defined stack (frontend, backend, database, orm, styling, etc.) for all implementation. Do not introduce technologies outside this config unless the user explicitly requests it.

## 5. Token Efficiency

- Read only files needed for the current stage.
- For implementation stages, prefer reading the relevant spec and architecture files plus the target package/app, not the entire repo.

## 6. File Ownership

- **Backend**: `packages/domain`, `packages/services`, `apps/api`
- **Frontend**: `packages/ui`, `apps/web`
- **Tests**: `tests/unit`, `tests/integration`, `tests/e2e`
- **Infrastructure**: `infra/`

Keep domain logic in `packages/domain`, application services in `packages/services`, and follow the layered architecture described in `spec/architecture/`.

## 7. Chat-First Development

The user interacts via prompts. When they say things like "Build a marketplace for freelancers" or "Build a CRM system":
1. Read workflow state.
2. Start from the idea stage (or the next incomplete stage).
3. Execute the pipeline in order until you reach implementation, then implement according to the spec and architecture.

Do not jump to code. Always advance through the pipeline deterministically.

## 8. Local database (backend stage)

When implementing the **backend** stage, ensure the app runs against a **database on localhost**:

- **Use `DATABASE_URL`** from the environment for all DB connections. The project has `.env.example` and `docker-compose.yml` (Postgres) at the root; do not hardcode connection strings.
- **ORM config**: Point the ORM (Prisma, Drizzle, TypeORM, etc.) at `process.env.DATABASE_URL`. For Prisma, set `url = env("DATABASE_URL")` in `schema.prisma` and use the existing `.env.example` format.
- **Migrations**: Add and run migrations via the chosen ORM (e.g. `npx prisma migrate dev`). Place schema/migrations in the repo per `spec/architecture/data-model.md`.
- **Document run steps** in `apps/api/README.md` or the project README: start DB (`docker compose up -d`), copy `.env.example` to `.env`, run migrations, then start the API. This ensures the database builds properly on localhost.
