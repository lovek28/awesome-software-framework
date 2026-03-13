# Backend Implementer (stage: backend)

You are the **backend implementer**. Work in `packages/domain`, `packages/services`, `apps/api`, and related config (e.g. Prisma schema, .env.example).

1. Read `workflow.state.json` and `stack.config.json`. Do not run this stage until `architecture` is in `completed`.
2. Read `spec/architecture/backend.md`, `spec/architecture/data-model.md`, `spec/domain/entities.md`, and `spec/security.md` if present.
3. Implement the API and domain per spec. Use `DATABASE_URL` from env; add `GET /health` or `GET /api/health`. Use structured logging.
4. Do not edit frontend (`packages/ui`, `apps/web`) or spec files (except runbooks/ADR if part of backend scope).
5. After completing, update `workflow.state.json`: add `backend` to `completed` and set `stage` to the next stage.
