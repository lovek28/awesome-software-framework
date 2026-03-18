# Skill: Prisma (stack: orm)

**When:** `stack.config.json` has `orm: "prisma"`. Apply during backend stage.

---

## Setup

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"   // or "mysql" | "sqlite"
  url      = env("DATABASE_URL")
}
```

Never hardcode `DATABASE_URL`. Use `env("DATABASE_URL")` always.

---

## Schema patterns

### Basic entity with audit fields

```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  status      Status    @default(TODO)
  deadline    DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  assigneeId  String?
  assignee    User?     @relation("AssignedTasks", fields: [assigneeId], references: [id])
  teamId      String
  team        Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@index([teamId])
  @@index([assigneeId])
}

enum Priority { LOW MEDIUM HIGH }
enum Status   { TODO IN_PROGRESS DONE CANCELLED }
```

### Many-to-many

```prisma
model User {
  id     String       @id @default(cuid())
  teams  TeamMember[]
}

model Team {
  id      String       @id @default(cuid())
  members TeamMember[]
}

model TeamMember {
  userId    String
  teamId    String
  role      TeamRole @default(MEMBER)
  user      User     @relation(fields: [userId], references: [id])
  team      Team     @relation(fields: [teamId], references: [id])

  @@id([userId, teamId])
}

enum TeamRole { OWNER ADMIN MEMBER }
```

---

## Query patterns

### Avoid N+1 — always use `include` or `select`

```ts
// ❌ N+1 — runs one query per task to get assignee
const tasks = await prisma.task.findMany()
for (const task of tasks) {
  const assignee = await prisma.user.findUnique({ where: { id: task.assigneeId } })
}

// ✅ Single query with include
const tasks = await prisma.task.findMany({
  where: { teamId },
  include: { assignee: { select: { id: true, name: true, email: true } } },
  orderBy: { createdAt: 'desc' },
})
```

### Pagination

```ts
async function listTasks(teamId: string, page = 1, limit = 20) {
  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where: { teamId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where: { teamId } }),
  ])
  return { tasks, total, page, pages: Math.ceil(total / limit) }
}
```

### Upsert

```ts
await prisma.teamMember.upsert({
  where:  { userId_teamId: { userId, teamId } },
  create: { userId, teamId, role: 'MEMBER' },
  update: { role: 'ADMIN' },
})
```

---

## Transactions

Use transactions for any operation that writes to more than one table:

```ts
// ✅ All-or-nothing: create task + log activity
const [task, _] = await prisma.$transaction([
  prisma.task.create({ data: { title, teamId, assigneeId } }),
  prisma.activityLog.create({ data: { type: 'TASK_CREATED', userId, teamId } }),
])

// ✅ Interactive transaction (when you need logic between queries)
const task = await prisma.$transaction(async (tx) => {
  const member = await tx.teamMember.findUnique({ where: { userId_teamId: { userId, teamId } } })
  if (!member) throw new ForbiddenError('Not a team member')

  return tx.task.create({ data: { title, teamId, assigneeId } })
})
```

---

## Migrations workflow

```bash
# Dev: create and apply a migration
npx prisma migrate dev --name add_task_priority

# Production: apply pending migrations
npx prisma migrate deploy

# Generate client after schema change
npx prisma generate

# Seed the database
npx prisma db seed
```

Document in `apps/api/README.md`:
```
1. Copy .env.example to .env and set DATABASE_URL
2. npx prisma migrate dev
3. npx prisma db seed   (optional)
4. npm run dev
```

---

## Seeding

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where:  { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' },
  })
  console.log('Seeded:', user.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

Add to `package.json`:
```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

---

## Rules

- Always align schema with `spec/architecture/data-model.md` — schema is the source of truth for DB structure
- Always add `@@index` on foreign keys and frequently-filtered fields
- Always use `select` or `include` — never return full objects when only a subset is needed
- Always use transactions for multi-table writes
- Never use raw SQL unless absolutely necessary — use `prisma.$queryRaw` with parameterised inputs only
- Place schema at `prisma/schema.prisma` and migrations at `prisma/migrations/`

**Constraints:** Schema must match `spec/architecture/data-model.md` and `spec/domain/entities.md`.
