# Services Package

Application use cases and orchestration.

## Role

- Use cases (e.g. CreateResource, ListResources) that orchestrate domain and persistence
- Depends on `packages/domain` and persistence (repository interfaces or ORM)
- No HTTP, no UI; called by `apps/api`

## Implementation

Generated during the **backend** pipeline stage. Services translate API requests into domain operations and persistence. Keep controllers thin; put logic here or in domain.

## Principles

- One use case per operation or small group of related operations
- Transaction boundaries and error handling defined here
- Depend on abstractions (e.g. repositories) for persistence to keep domain testable
