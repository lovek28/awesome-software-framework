# Data Model

> Persistence model and storage. Align with `stack.config.json` (e.g. Postgres, Prisma).

## Overview

- **Database**: e.g. PostgreSQL.
- **ORM**: e.g. Prisma. Schema is the source of truth; migrations for changes.

## Entities and Tables

Map domain entities from `spec/domain/entities.md` to tables. For each:

- Table name
- Columns (name, type, constraints)
- Primary key
- Foreign keys and relationships
- Indexes for common queries

Example structure (replace with actual model):

| Table | Purpose | Key relations |
|-------|---------|----------------|
| users | User accounts | — |
| resources | Main domain entity | user_id → users |

## Naming and Conventions

- Tables: plural, snake_case.
- Columns: snake_case.
- Foreign keys: `{referenced_table_singular}_id`.
- Timestamps: `created_at`, `updated_at` (if used).

## Migrations

- Migrations are versioned and reversible when possible.
- No application code that depends on ad-hoc schema changes; all changes go through migrations.

## Consistency with Domain

- Data model supports domain rules in `spec/domain/rules.md`.
- Invariants that cannot be expressed in the schema alone are enforced in `packages/domain` or `packages/services`.
