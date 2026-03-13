# API App

Fastify HTTP API (per `stack.config.json`).

## Role

- REST (or other) endpoints per `spec/architecture/backend.md`
- Authentication and request validation
- Delegates to `packages/services` for use cases
- Persistence via ORM (e.g. Prisma) and database per `stack.config.json`

## Implementation

Generated during the **backend** pipeline stage. Do not implement here before the **architecture** stage is complete and `spec/architecture/backend.md` and `spec/architecture/data-model.md` exist.

## Structure

- Routes mapped to use cases in `packages/services`
- Middleware for auth, logging, error handling
- No business logic in route handlers; keep it in services and domain
