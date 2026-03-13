# Architecture Overview

> **Claude:** Before marking architecture done, ensure overview, backend.md, frontend.md, and data-model.md are filled and consistent with domain and stack.
>
> High-level structure of the system. Fill after domain, UX, and UI specs are stable.

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  apps/web (Frontend)                                    │
├─────────────────────────────────────────────────────────┤
│  packages/ui (Shared UI components)                     │
├─────────────────────────────────────────────────────────┤
│  apps/api (HTTP API)                                    │
├─────────────────────────────────────────────────────────┤
│  packages/services (Application / use cases)            │
├─────────────────────────────────────────────────────────┤
│  packages/domain (Domain model & rules)                 │
├─────────────────────────────────────────────────────────┤
│  packages/shared (Types, utils, cross-cutting)            │
├─────────────────────────────────────────────────────────┤
│  infra (DB, hosting, CI/CD)                             │
└─────────────────────────────────────────────────────────┘
```

## Responsibilities

- **apps/web**: Next.js app; pages, routing, server/client components. Consumes `packages/ui` and calls `apps/api`.
- **apps/api**: Fastify HTTP API; auth, validation, delegation to `packages/services`.
- **packages/services**: Application use cases; orchestrate domain and persistence. No HTTP or UI.
- **packages/domain**: Entities, value objects, domain rules. No framework or I/O.
- **packages/ui**: Reusable UI components. No business logic.
- **packages/shared**: Shared types, constants, utilities.
- **infra**: Database, deployment, and operational config.

## Data Flow

- User → Web → API → Services → Domain (+ persistence via ORM/DB).
- Responses flow back: Domain → Services → API → Web → User.

## Stack

See `stack.config.json`. Architecture must align with the chosen frontend, backend, database, ORM, and styling stack.
