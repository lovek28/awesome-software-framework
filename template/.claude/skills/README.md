# Skills

Reusable “how-to” knowledge per stack and stage. Claude (and Cursor) should apply these when the context matches.

## Built-in skills (framework)

| Skill | Applies to | Description |
|-------|------------|-------------|
| **nextjs** | Stack: frontend=nextjs | App Router, server components, env, styling. |
| **fastify** | Stack: backend=fastify | Schemas, validation, errors, health route. |
| **prisma** | Stack: orm=prisma | Schema, migrations, transactions, no N+1. |
| **product-spec** | Stage: product_spec | Problem, users, features, requirements; quality gate. |
| **api-design** | Stage: architecture / api_contract | REST, OpenAPI, errors, versioning. |

## When to use

- **Stack skills:** Read `stack.config.json` and apply the matching skills during backend/frontend stages (e.g. when backend is Fastify, apply `fastify` and `prisma` if orm is Prisma).
- **Stage skills:** When the current stage is product_spec, architecture, or api_contract, apply the corresponding stage skills. Reference from CLAUDE or from `.claude/stages/*.md`.

## Project and community skills

Add custom skills in this directory (e.g. `company-api-style.md`, `our-testing-standards.md`). They are merged with built-in skills. Skill contract: start with **When** (triggers) and **What to do** (and optionally **Constraints**). So the community can add e.g. "Django backend" or "GraphQL API" without changing core CLAUDE.md.
