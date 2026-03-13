# Shared Package

Cross-cutting types, constants, and utilities.

## Role

- Shared TypeScript (or JS) types between api, web, domain, services
- Constants (e.g. error codes, config keys)
- Pure utilities (no I/O, no framework)
- Can be used by `packages/domain`, `packages/services`, `apps/api`, `apps/web`, `packages/ui`

## Implementation

Add as needed during **backend** and **frontend** stages. Keep this package minimal and stable; avoid business logic.
