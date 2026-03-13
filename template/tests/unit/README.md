# Unit Tests

Unit tests for domain, services, and pure logic.

## Role

- Test `packages/domain` and `packages/services` in isolation
- Mock external dependencies (persistence, APIs)
- Fast, no database or HTTP

## Implementation

Generated during the **tests** pipeline stage. Focus on business rules and use cases. Use the same stack as the rest of the project (e.g. Jest, Vitest).

## Location

Tests can live next to source (e.g. `*.test.ts`) or in this directory mirroring `packages/domain` and `packages/services`. Keep tests close to what they test for discoverability.
