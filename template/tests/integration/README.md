# Integration Tests

Tests that hit the API and optionally the database.

## Role

- Test `apps/api` endpoints with real or test database
- Verify request/response contract and use case behavior end-to-end within the backend
- May use test containers or a test DB per `stack.config.json`

## Implementation

Generated during the **tests** pipeline stage. Use the same stack (e.g. Fastify inject, Prisma with test DB). Isolate tests (clean data or transactions) to avoid flakiness.

## Location

Place in this directory or under `apps/api` (e.g. `apps/api/test/`). Document how to run and configure test DB in the project README.
