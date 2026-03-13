# Backend Architecture

> API and server-side design. Follow `stack.config.json` (e.g. Fastify, Postgres, Prisma).

## API Style

- **Protocol**: REST over HTTP (or document if using GraphQL).
- **Base path**: e.g. `/api/v1` for versioning.
- **Auth**: How requests are authenticated (e.g. JWT, session, API key). Where it is validated (middleware, per-route).

## Endpoints

Design endpoints after `spec/domain/entities.md` and `spec/ux/flows.md`. Document:

- Method and path
- Purpose
- Request (body, query, headers)
- Response (success, validation error, auth error)
- Which service/use case is invoked

Example structure (fill with actual resources):

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/v1/resources | List resources |
| POST | /api/v1/resources | Create resource |
| GET | /api/v1/resources/:id | Get one |
| PATCH | /api/v1/resources/:id | Update |
| DELETE | /api/v1/resources/:id | Delete |

## Packages

- **apps/api**: Fastify app; routes, middleware, error handling. Calls into `packages/services`.
- **packages/services**: Use cases (e.g. CreateResource, ListResources). Use `packages/domain` and persistence (ORM).
- **packages/domain**: Domain logic only; no HTTP, no I/O.

## Persistence

- Database: per `stack.config.json` (e.g. Postgres).
- ORM: per `stack.config.json` (e.g. Prisma). Schema and migrations live in the API or a shared package as decided.
- Repositories or data access: abstract persistence behind interfaces used by services; domain stays pure.

## Errors and Validation

- Validation: request body and query (e.g. Zod, Fastify schema).
- Errors: consistent format (e.g. code, message, details). Map domain/service errors to HTTP status codes.
