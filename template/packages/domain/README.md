# Domain Package

Pure domain model and business rules.

## Role

- Entities, value objects, and domain logic from `spec/domain/entities.md` and `spec/domain/rules.md`
- No framework dependencies, no I/O (no HTTP, no database)
- May depend on `packages/shared` for types only

## Implementation

Generated during the **backend** pipeline stage after architecture is defined. Domain code must not depend on Fastify, Prisma, or any infrastructure.

## Principles

- Rich domain where it adds clarity; anemic models only if justified
- Invariants and rules from `spec/domain/rules.md` enforced here
- Terminology from `spec/domain/glossary.md`
