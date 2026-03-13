# Skill: Prisma (stack: orm)

**When:** `stack.config.json` has `orm: "prisma"`. Apply during backend stage.

**What to do:**
- Point `schema.prisma` at `env("DATABASE_URL")`. Generate client with `prisma generate`; migrations with `prisma migrate`.
- Use transactions for multi-step writes: `prisma.$transaction([...])` so all-or-nothing. Avoid N+1: use `include` or `select` as needed.
- Place schema and migrations in the repo (e.g. `prisma/schema.prisma`, `prisma/migrations/`). Document run steps (migrate, seed) in README.
- Do not hardcode connection strings; use env only. For SQLite, use `file:./dev.db` or similar in .env.

**Constraints:** Align schema with spec/architecture/data-model.md and spec/domain/entities.md.
