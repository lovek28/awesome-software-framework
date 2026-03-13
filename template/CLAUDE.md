# Project Instructions for Claude

You are working inside a **Specification-First** repository. Follow these rules strictly.

## 1. Workflow State (Required)

**Always read `.claude/workflow.state.json`** before generating any content. It defines:
- Current stage in the pipeline
- The user's idea
- Which stages are already completed
- **mode** (optional): `quick` or `full`. In **quick** mode, merge or shorten early stages (e.g. idea + product_spec in one pass, minimal UX/UI) to reach a running app faster; in **full** mode, run every stage with full rigor.

Do not skip required stages. Do not generate implementation (backend, frontend, tests) until the architecture stage is completed and documented. To **resume from stage X**, skip stages already in `completed` and run only from X; optional checkpoints in `.claude/checkpoints/<stage>.json` can record outputs for each stage.

**Quality gates:** Before advancing past **product_spec**, ensure spec has Problem, Target Users, at least one Core Feature, and one Functional Requirement; otherwise ask the user to fill gaps. Before **backend**, ensure architecture references domain and data-model; if not, ask for alignment.

## 2. Pipeline Order

Stages are defined in `workflow.config.json`:

- **pipeline**: Ordered list of stage IDs. Execute in this order. Projects may add **custom stages** (e.g. `docs`, `deploy_config`) to the list; run them in order when present. See `.claude/instructions.md` for how to implement custom stages.
- **optional**: List of stage IDs that are optional (e.g. `tests`). For an optional stage: ask the user if they want it (e.g. "Do you want tests for this project?") or skip when not needed. Required stages are always enforced.
- **stages**: Optional map of stage ID to `{ "description": "...", "optional": true }`. Use the description as the single source for "what to do at this stage."

Default pipeline order: **idea** → **product_spec** → **domain_rules** → **ux_flow** → **ui_system** → **architecture** → **api_contract** (optional) → **backend** → **frontend** → **tests** (and any custom stages). When **api_contract** is present, generate `spec/api/openapi.yaml` from backend and data-model; backend and frontend must conform to it.

After completing a stage, update `workflow.state.json`: set `stage` to the next stage and add the completed stage to `completed`.

## 3. Specification First

- **Never generate implementation code before architecture exists.** If `workflow.state.json` shows architecture is not in `completed`, only work on spec or architecture files.
- Update specification files (product, domain, ux, ui, architecture) before generating application code.
- After significant spec changes, update `spec/index.md` to summarize the system.

## 4. Stack Configuration

**Always read `stack.config.json`** before generating code.

**Stack validation:** After writing or updating `stack.config.json`, it must contain at least **frontend**, **backend**, and **database** (and optionally `orm`, `styling`, etc.). If the user skips one, ask again or fill a sensible default for that key only (e.g. "No frontend?" → "I'll set frontend to nextjs unless you prefer something else."). Do not leave required keys missing.

If the file is empty (e.g. `{}`), ask the user for tech choices, write them to `stack.config.json` with at least frontend, backend, database, then proceed. Use the defined stack for all implementation. Do not introduce technologies outside this config unless the user explicitly requests it.

## 5. Token efficiency, context scope, and skills

- **Context scope:** Read only files needed for the current stage. See `.claude/context-scope.md` for a per-stage list of what to read and what to avoid; follow priority and incremental-read guidance when context is tight.
- For implementation stages, prefer reading the relevant spec and architecture files plus the target package/app, not the entire repo. Work in small scopes (e.g. one route or package at a time) on large apps.
- **Summaries (optional):** After a stage, you may write a short summary to `workflow.context.json` or `.claude/summaries/<stage>.md` (key decisions, files changed) so later stages can use it instead of re-reading all prior outputs.
- **Skills:** Apply reusable know-how from `.claude/skills/`. When backend is Fastify, use `fastify` and `prisma` (if orm is Prisma); when frontend is Next.js, use `nextjs`. For product_spec stage use `product-spec`; for architecture/api_contract use `api-design`. See `.claude/skills/README.md` for the full list and when they apply.

## 6. Security and secrets

- **Security checklist:** When filling product spec or early in the pipeline, fill or update `spec/security.md` with an OWASP-oriented checklist (input validation, secrets, HTTPS, CSRF, auth). Use it during backend and frontend implementation so generated code aligns with the checklist.
- **Secrets:** Document required secrets in `.env.example` (e.g. `JWT_SECRET`, `AUTH_CLIENT_SECRET`). Never generate hardcoded secrets in code; always use `process.env` or the app’s config from env. Tell the user to copy `.env.example` to `.env` and set values locally; never commit `.env`.
- **Compliance (optional):** If the product spec mentions GDPR, audit logs, or data retention, add a “Compliance requirements” section or an optional `compliance` stage and generate consent flows, audit trails, or retention notes where applicable.

## 7. File Ownership

- **Backend**: `packages/domain`, `packages/services`, `apps/api`
- **Frontend**: `packages/ui`, `apps/web` (and optionally `apps/admin`, `apps/mobile` when in stack)
- **Tests**: `tests/unit`, `tests/integration`, `tests/e2e`
- **Infrastructure**: `infra/`

Keep domain logic in `packages/domain`, application services in `packages/services`, and follow the layered architecture described in `spec/architecture/`.

## 8. Chat-First Development — Ask the user for choices

The user interacts via prompts. When they say things like "Build a marketplace for freelancers" or "Build a CRM system":

1. **Read workflow state** and start from the idea stage (or the next incomplete stage).
2. **Before writing specs or code, ask the user all relevant questions** so you can fill `stack.config.json` and proceed correctly. Do **not** assume the stack; the CLI does not collect it — you must.
3. **Tech stack questions** — Ask in chat (one message or a short list is fine):
   - **Frontend**: e.g. Next.js, Remix, React (Vite), Vue, Svelte, or other. Accept any answer.
   - **Backend**: e.g. Fastify, Express, NestJS, Hono, or other. Accept any answer.
   - **Database**: e.g. PostgreSQL, MySQL, SQLite, or other. Accept any answer.
   - **ORM / data layer**: e.g. Prisma, Drizzle, TypeORM, Knex, or "none" / raw SQL. Accept any answer.
   - **Styling**: e.g. Tailwind CSS, CSS Modules, styled-components, or other. Accept any answer.
   - **Auth** (optional): e.g. `none`, `jwt`, `nextauth`, `clerk`, or other. If chosen, optionally **auth_provider** (e.g. `github`, `google`) for OAuth. Write to `stack.config.json` as `auth` and `auth_provider`. Generate middleware, env vars, and login/signup flows in backend and frontend accordingly.
   - **Deploy** (optional): e.g. `none`, `vercel`, `docker`, `fly`, `railway`, or other. Write as `deploy` in `stack.config.json`. When not `none`, add a **deploy_config** stage (or output in infra): generate deployment config (e.g. `vercel.json`, Dockerfile, `fly.toml`) and document deploy steps in `infra/README.md`.
   - **Multi-app** (optional): If the user wants an admin UI or mobile app, add `frontend_admin` (e.g. `"nextjs"`) or `mobile` (e.g. `"expo"`) to `stack.config.json`. Template has `apps/admin` and `apps/mobile`; run frontend stage for each app and share API/domain. Optionally add `spec/ux/flows-admin.md` for admin-only flows.
   There is no default stack in the repo — you decide with the user. Write the user's choices to `stack.config.json` (use the keys: `frontend`, `backend`, `database`, `orm`, `styling`, and optionally `auth`, `auth_provider`, `deploy`, `frontend_admin`, `mobile`).
4. **Presets:** If the user’s request matches a preset (e.g. "CRUD app for X", "dashboard with login", "API only"), read `template/.presets/*.json` (or project’s `project.preset.json`). Apply the preset’s suggested stack and product snippet, then ask only for the specific details (e.g. resource name and fields for CRUD).
5. **Other relevant questions** — Depending on the idea, ask about: target users, must-have features, constraints, or preferences. Use answers to fill `spec/product/spec.md` and the rest of the pipeline.
6. Then execute the pipeline in order and implement according to the spec and architecture.

Do not jump to code. Always advance through the pipeline deterministically. The user can give any technology names; you are not limited to a fixed list.

## 9. Local database (backend stage)

When implementing the **backend** stage, ensure the app runs against a **database on localhost**:

- **Use `DATABASE_URL`** from the environment for all DB connections. The project has `.env.example` at the root; do not hardcode connection strings.
- **Database choice** (from `stack.config.json`):
  - **PostgreSQL / MySQL**: Use `docker-compose.yml` (Postgres by default) or `docker-compose.mysql.yml` if database is MySQL. See `infra/README.md`. Set `DATABASE_URL` in `.env` to match (e.g. `postgresql://...` or `mysql://...`).
  - **SQLite**: No Docker needed. Set `DATABASE_URL=file:./dev.db` (or `file:./data/dev.db`) in `.env`. The ORM will create the file. Document in `apps/api/README.md` that for SQLite the user only needs to copy `.env.example` to `.env` and run migrations.
- **ORM config**: Point the ORM (Prisma, Drizzle, TypeORM, etc.) at `process.env.DATABASE_URL`. For Prisma, set `url = env("DATABASE_URL")` in `schema.prisma` and use the existing `.env.example` format.
- **Migrations**: Add and run migrations via the chosen ORM (e.g. `npx prisma migrate dev`). Place schema/migrations in the repo per `spec/architecture/data-model.md`.
- **Document run steps** in `apps/api/README.md` or the project README: for Postgres/MySQL — start DB (`docker compose up -d`), copy `.env.example` to `.env`, run migrations, then start the API; for SQLite — copy `.env.example` to `.env`, run migrations, then start the API.
- **Health check:** Always add a minimal health route in the backend (e.g. `GET /health` or `GET /api/health`) that returns 200 and optionally checks DB connectivity. Deploy and load balancers rely on this; document it in backend architecture.
- **Logging:** Use structured logging (e.g. request id, level, message) and consistent error reporting. If `stack.config.json` has `observability` (e.g. `sentry`, `datadog`, or `none`), add error tracking or APM when chosen.

## 10. API contract (optional stage)

When the pipeline includes **api_contract** (or when you want contract-first flow): after architecture, generate or update `spec/api/openapi.yaml` from `spec/architecture/backend.md` and `spec/architecture/data-model.md` (and domain entities). Backend implementation must conform to this contract; frontend should consume the API per the contract (typed fetch or generated client). Reduces drift between API and clients. Optionally document a mock server (e.g. from OpenAPI) for frontend development before backend is complete.

## 11. Tests stage

When implementing the **tests** stage:

- **Test runner:** Set up a test runner per `stack.config.json` (e.g. Jest or Vitest for unit/integration). Add config in project root or under `tests/` (e.g. `vitest.config.ts`). For E2E, add Playwright (or similar) and config (e.g. `playwright.config.ts`). Template has `tests/unit`, `tests/integration`, `tests/e2e`; fill with real config and tests.
- **Coverage:** If `workflow.config.json` has `testCoverageMin` (e.g. 80), document it and add a CI or script step to enforce coverage where feasible.
- **Spec-driven tests:** From `spec/product/spec.md` and `spec/ux/flows.md`, derive acceptance criteria and add test cases (e.g. "User can sign up" → one E2E and one integration test). Name tests so they are traceable to spec (e.g. `signup.e2e.ts`, `auth.integration.test.ts`).

## 12. Documentation from spec (optional docs stage)

When the pipeline includes a **docs** stage (or on request): generate human-readable docs from specs so they remain the single source of truth. From `spec/product/spec.md` and `spec/ux/flows.md`, produce or update `docs/product-overview.md` and `docs/user-flows.md`. From `spec/api/openapi.yaml`, document how to view API docs (e.g. Redoc, Swagger UI) in the project README or `docs/README.md`. When spec changes, update the relevant docs and code in the same pass.
