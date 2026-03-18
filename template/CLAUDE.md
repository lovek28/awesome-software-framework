# Project Instructions for Claude

You are working inside a **Specification-First** repository. Follow these rules strictly.

## 0. First-Run Check (Run Before Anything Else)

**Before reading workflow state, before running any pipeline stage, do this once:**

1. Check if `~/.claude/skills/brainstorming.md` exists.
2. **If it does NOT exist**, stop and tell the user:

   > "This framework works best with **Superpowers** — it gives Claude structured brainstorming, planning, and code review habits.
   > Install it with:
   > ```
   > npx github:obra/superpowers
   > ```
   > Without it I'll use built-in brainstorming. Install Superpowers first, or continue without it?"

   Wait for their answer. If they say install first — stop. If they say continue — proceed to Section 1.

3. **If it exists**, proceed to Section 1.

---

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

**Stage skipping based on stack:** After reading `stack.config.json`, automatically skip stages for disabled layers:
- `frontend: "none"` → skip `ux_flow`, `ui_system`, `frontend`
- `backend: "none"` → skip `domain_rules`, `backend`, `api_contract`
- `database: "none"` → skip DB setup steps within the backend stage

When a preset is active (e.g. `api-only`, `frontend-only`), its `stagesInScope` list defines which stages to run — treat all others as skipped.

After completing a stage, update `workflow.state.json`: set `stage` to the next stage and add the completed stage to `completed`.

## 3. Specification First

- **Never generate implementation code before architecture exists.** If `workflow.state.json` shows architecture is not in `completed`, only work on spec or architecture files.
- Update specification files (product, domain, ux, ui, architecture) before generating application code.
- After significant spec changes, update `spec/index.md` to summarize the system.

## 3a. Architecture & Design Decision Protocol

**Before writing any architecture spec or implementation code**, Claude must reason through the following — do not pick patterns randomly or default to what was last used.

### Step 1 — Analyse the project context
Read all completed specs (`spec/product/`, `spec/domain/`, `spec/ux/`) and answer internally:
- What is the scale? (personal tool / startup / enterprise)
- How complex is the data model? (few entities / relational / graph)
- Are there real-time requirements? (live updates, websockets, polling)
- What are the read/write patterns? (read-heavy, write-heavy, balanced)
- Does the domain have clear bounded contexts that warrant separation?
- What is the implied team size and deployment target?

### Step 2 — Decide and justify each dimension

| Dimension | Options to consider | Decision trigger |
|---|---|---|
| **System architecture** | Monolith, Modular Monolith, Microservices, Serverless | Use monolith unless domain complexity and team size clearly justify more |
| **Code organisation** | Layered (MVC), Hexagonal/Ports-Adapters, Feature-sliced | Use layered for most apps; hexagonal when domain logic is complex and testability is critical |
| **Data access pattern** | Active Record, Repository, CQRS | Repository for business logic; CQRS only when read/write models differ significantly |
| **State management (frontend)** | Local state, Context, Zustand, Redux | Match complexity — do not add Redux to a simple CRUD app |
| **API style** | REST, GraphQL, tRPC | REST unless the client needs flexible query composition; tRPC for full-stack TypeScript |
| **Error strategy** | Result types, exceptions, error boundaries | Consistent within each layer — document the chosen approach |

### Step 3 — Present decisions to the user

Before writing `spec/architecture/`, present a short decision summary:

```
Architecture decisions for [project name]:
- System: Modular Monolith (reason: single team, low microservice overhead)
- Layers: Hexagonal (reason: domain has complex rules, needs testable core)
- Data: Repository pattern + Prisma (reason: clean separation from ORM)
- API: REST with OpenAPI contract (reason: standard, well-tooled)
- Frontend state: Zustand (reason: moderate complexity, no prop-drilling needed)
- Error handling: Result types in domain, thrown errors at API boundary

Shall I proceed with this architecture, or would you like to change anything?
```

Wait for approval. If the user approves, **write the gate file first** before writing any architecture spec:

Write `.claude/gates/architecture-decisions.md`:
```markdown
# Architecture decisions
## Analysis
[Your reasoning about scale, complexity, real-time needs, team size]
## Decisions
- System: Modular Monolith (reason: single team, no microservice overhead)
- Layers: Hexagonal (reason: complex domain rules, testable core needed)
- Data: Repository + Prisma (reason: clean ORM separation)
- API: REST + OpenAPI (reason: standard, well-tooled)
- State: Zustand (reason: moderate complexity)
- Errors: Result types in domain, HTTP errors at API boundary
## User approval
Approved: yes
```

**This is enforced by a hook.** `.claude/hooks/check-architecture-decisions-gate.js` blocks any write to `spec/architecture/` (except `decisions.md` itself) unless `.claude/gates/architecture-decisions.md` exists.

---

## 3b. User Checkpoint Protocol

**At every pipeline stage boundary**, Claude must pause and check in — unless the user has explicitly said "build autonomously" or "don't ask at each stage".

### Checkpoint format (required at each stage transition)

```
✓ Completed: [stage name]
  → [1-2 sentence summary of what was produced]

Next: [next stage name]
  → [1-2 sentence preview of what will happen]

Ready to proceed? (yes / adjust first / skip this stage)
```

### Mandatory checkpoints (never skip these)

| After stage | Why it matters |
|---|---|
| `product_spec` | User must confirm the problem and features are correct before domain work starts |
| `architecture` | User must approve architecture decisions (see Section 3a) before any code is written |
| `backend` | User should validate API shape before frontend is built against it |
| `tests` | User should confirm test coverage is acceptable before calling the project done |

### Checkpoint artifact (enforced by hook)

Before updating `workflow.state.json` to mark a stage as completed, write `.claude/gates/checkpoint-<stage>.md`:

```markdown
# Checkpoint: product_spec
## Completed
Defined problem (teams losing track of tasks), target users (small teams 2-20),
and 4 core features including task CRUD, assignees, deadlines, team workspaces.
## Next stage
domain_rules — define business rules, domain entities, and validation logic.
## User response
yes
```

**This is enforced by a hook.** `.claude/hooks/check-stage-advance-gate.js` blocks any update to `workflow.state.json` that advances the pipeline unless the checkpoint file for that stage exists. For the 4 mandatory stages (`product_spec`, `architecture`, `backend`, `tests`), it also checks the file contains a `## User response` section.

### Autonomous mode

If the user says "build it all" / "proceed autonomously" / "don't ask at each step", skip stage-transition checkpoints but still pause at the **mandatory checkpoints** above and still run the pre-code reasoning gate (Section 3c).

---

## 3c. Pre-Code Reasoning Gate

**Before writing any implementation code** (route handlers, services, domain logic, UI components, hooks), you must write a reasoning gate file first. This is enforced by a hook — the hook will block any write to `apps/` or `packages/` unless the gate file exists.

### Step 1 — Write the gate file first

At the start of each implementation stage, write `.claude/gates/<stage>-gate.md` before touching any code file. The hook checks this file exists.

Example for the `backend` stage — write `.claude/gates/backend-gate.md`:

```markdown
# Backend stage — pre-code reasoning gate

## Batch: Task routes (POST /tasks, GET /tasks, GET /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id)

### 1. Purpose
Implement CRUD task management scoped to team workspaces with JWT auth.

### 2. Edge cases
- Assignee not a member of the team
- Deadline set in the past
- Title empty or over 255 chars
- Team does not exist

### 3. Error conditions
- DB insert fails → 500 with structured error, no stack trace to client
- Invalid assignee ID → 404
- Missing required fields → 422 with field-level errors
- Unauthenticated request → 401 before any DB query
- Assignee not in team → 403 before DB write

### 4. Security
- Zod schema validation on all inputs
- JWT team membership verified before any DB write
- Prisma parameterised queries only — no raw SQL
- No sensitive data in error responses

### 5. Performance
- Single DB write per request — no N+1 risk on create
- List query uses include for assignee — no N+1
- Team membership check in same transaction as insert

### 6. Flow correctness
Happy path: auth check → validate input → check assignee in team → insert → 201
Failure: assignee not in team → 403 returned before any DB write
Failure: invalid input → 422 returned before any DB query
```

### Step 2 — Write the code

Only after the gate file is written, write implementation files. The gate file covers the whole stage — you do not need a separate file per function.

### Step 3 — Flag uncertainty

If any of the six points cannot be answered confidently, stop and ask the user before writing code. Do not guess.

### Why this is enforced by a hook

`.claude/hooks/check-implementation-gate.js` runs before every Write/Edit to `apps/` or `packages/`. It checks:
1. `architecture` is in `workflow.state.json` completed list
2. `.claude/gates/<current-stage>-gate.md` exists

If either check fails, the hook exits with code 2 and blocks the write. Claude sees the error message and cannot proceed until the gate is satisfied.

---

## 4. Stack Configuration

**Always read `stack.config.json`** before generating code.

**Stack validation:** After writing or updating `stack.config.json`, it must contain at least **frontend**, **backend**, and **database**. Each can be set to `"none"` to skip that layer entirely:

| Key | `"none"` means |
|-----|----------------|
| `frontend: "none"` | Skip `ux_flow`, `ui_system`, `frontend` stages. No `packages/ui` or `apps/web`. |
| `backend: "none"` | Skip `backend`, `api_contract` stages. No `packages/domain`, `packages/services`, `apps/api`. |
| `database: "none"` | Skip DB setup, migrations, docker-compose. Use only when `backend` is also `"none"` or backend connects to an external API. |

**Valid project shapes:**

| Shape | frontend | backend | database |
|-------|----------|---------|----------|
| Full-stack | nextjs / react / vue / etc. | fastify / express / etc. | postgres / mysql / sqlite |
| API only | `"none"` | fastify / express / etc. | postgres / mysql / sqlite |
| Frontend only | nextjs / react / etc. | `"none"` | `"none"` |

If the file is empty (e.g. `{}`), ask the user what they're building during `brainstorming`, then write choices to `stack.config.json`. Do not introduce technologies outside this config unless the user explicitly requests it.

## 5. Token efficiency, context scope, and skills

- **Context scope:** Read only files needed for the current stage. See `.claude/context-scope.md` for a per-stage list of what to read and what to avoid; follow priority and incremental-read guidance when context is tight.
- For implementation stages, prefer reading the relevant spec and architecture files plus the target package/app, not the entire repo. Work in small scopes (e.g. one route or package at a time) on large apps.
- **Summaries (optional):** After a stage, you may write a short summary to `workflow.context.json` or `.claude/summaries/<stage>.md` (key decisions, files changed) so later stages can use it instead of re-reading all prior outputs.
- **Skills:** Apply reusable know-how from `.claude/skills/`. Read `stack.config.json` and load the matching skill for each technology chosen:

  | Technology | Skill file |
  |------------|------------|
  | `backend: "fastify"` | `fastify.md` |
  | `backend: "express"` | `express.md` |
  | `frontend: "nextjs"` | `nextjs.md` |
  | `frontend: "react"` | `react.md` |
  | `frontend: "vue"` or `"nuxt"` | `vue.md` |
  | `orm: "prisma"` | `prisma.md` |
  | `orm: "drizzle"` | `drizzle.md` |
  | Stage: `product_spec` | `product-spec.md` |
  | Stage: `architecture` or `api_contract` | `api-design.md` |

  **No matching skill?** If the user chose a technology not listed above (e.g. NestJS, Hono, SvelteKit, TypeORM), do the following:
  1. Tell the user: "No built-in skill exists for `[technology]`. I'll apply the general principles from `api-design.md` and the pre-code reasoning gate. You can add a custom skill at `.claude/skills/[name].md` to override this — see `.claude/skills/README.md` for the format."
  2. Apply `api-design.md` (for backend) or general frontend patterns from the spec.
  3. Apply Section 3c (pre-code reasoning gate) as normal — the six questions still apply regardless of stack.
  4. State clearly in each response which technology conventions you are following so the user can correct you.

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

## 8. Agent Workflow (Superpowers)

This project is designed to work with **[Superpowers](https://github.com/obra/superpowers)** — a set of skills that give Claude structured, disciplined development habits.

**Superpowers installation check (run once at project start):**

At the very start of a new project (when `workflow.state.json` has `stage: "idea"` and `completed: []`), check if Superpowers is installed by looking for `~/.claude/skills/brainstorming.md`.

- **If found:** Use the Superpowers skills as described below.
- **If NOT found:** Tell the user:

  > "This framework works best with **Superpowers** — it gives Claude structured brainstorming, planning, and code review habits.
  > Install it with:
  > ```
  > npx github:obra/superpowers
  > ```
  > Without it, I'll proceed using built-in brainstorming. Would you like to install it first, or continue without it?"

  Wait for their answer before proceeding.

**Superpowers skills to use (when installed):**

**Always ask for approval before activating any Superpowers skill.** Use this format:

```
I'd like to activate the Superpowers `[skill-name]` skill now.
It will: [one sentence — what it does and why it's useful here].
Shall I proceed? (yes / skip / tell me more)
```

Only activate the skill after the user confirms. If they say skip, proceed with built-in behaviour and note that the skill was skipped.

| When | Skill to request approval for |
|------|-------------------------------|
| User describes what to build | `brainstorming` — structured questions one at a time, surfaces constraints, gets approval before specs |
| Ready to plan a stage | `writing-plans` — writes a step-by-step implementation plan before touching any files |
| Executing a plan | `executing-plans` — follows the plan via subagents, one step at a time |
| Stage complete | `requesting-code-review` — reviews all changes before advancing to the next stage |

**Stack collection (always required — with or without Superpowers):**

At the `idea` stage, if `stack.config.json` is empty (`{}`), you **must** ask the user these questions one at a time before doing anything else:

1. "What are you building?" (brief description)
2. "Do you need a frontend, backend, or both?" (shapes the project — full-stack / API only / frontend only)
3. "What frontend framework?" (Next.js / React / Vue / none)
4. "What backend runtime/framework?" (Fastify / Express / none)
5. "What database?" (PostgreSQL / MySQL / SQLite / none)
6. "ORM preference?" (Prisma / Drizzle / TypeORM / none)
7. "Styling?" (Tailwind / CSS Modules / none)
8. Optional: auth, deploy target, admin panel, mobile app

Once answered, write all choices to `stack.config.json` immediately.

**Presets:** If the request clearly matches "CRUD app", "dashboard with login", or "API only", apply the matching preset from `.presets/` — ask only for the missing specifics. Still confirm stack with the user before writing specs.

Do not write specs or code until stack is confirmed and the user has approved the direction. Always advance through the pipeline deterministically.

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
