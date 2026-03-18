# Skill: Drizzle ORM (stack: orm)

**When:** `stack.config.json` has `orm: "drizzle"`. Apply during backend stage.

---

## Setup

```ts
// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
export type DB = typeof db
```

Never hardcode `DATABASE_URL`. Always use `process.env.DATABASE_URL`.

---

## Schema definition

```ts
// src/db/schema/tasks.ts
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { teams } from './teams'

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH'])
export const statusEnum   = pgEnum('status',   ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'])

export const tasks = pgTable('tasks', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       text('title').notNull(),
  description: text('description'),
  priority:    priorityEnum('priority').default('MEDIUM').notNull(),
  status:      statusEnum('status').default('TODO').notNull(),
  deadline:    timestamp('deadline', { withTimezone: true }),
  assigneeId:  uuid('assignee_id').references(() => users.id),
  teamId:      uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Task        = typeof tasks.$inferSelect
export type NewTask     = typeof tasks.$inferInsert
```

---

## Query patterns

### Select with join (avoid N+1)

```ts
import { eq, and, desc } from 'drizzle-orm'

// ✅ Single query with join
async function listTasksWithAssignee(teamId: string) {
  return db
    .select({
      id:       tasks.id,
      title:    tasks.title,
      status:   tasks.status,
      priority: tasks.priority,
      assignee: { id: users.id, name: users.name },
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.teamId, teamId))
    .orderBy(desc(tasks.createdAt))
}
```

### Insert

```ts
async function createTask(data: NewTask): Promise<Task> {
  const [task] = await db.insert(tasks).values(data).returning()
  return task
}
```

### Update

```ts
async function updateTask(id: string, userId: string, data: Partial<NewTask>): Promise<Task> {
  const [updated] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.assigneeId, userId)))
    .returning()
  if (!updated) throw new NotFoundError('Task not found')
  return updated
}
```

### Pagination

```ts
async function listTasks(teamId: string, page = 1, limit = 20) {
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(tasks)
      .where(eq(tasks.teamId, teamId))
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)::int` }).from(tasks)
      .where(eq(tasks.teamId, teamId)),
  ])
  return { tasks: rows, total: count, page, pages: Math.ceil(count / limit) }
}
```

---

## Transactions

```ts
import { db } from '../db'

// Simple transaction
await db.transaction(async (tx) => {
  const [task] = await tx.insert(tasks).values(taskData).returning()
  await tx.insert(activityLogs).values({ type: 'TASK_CREATED', taskId: task.id, userId })
})

// Transaction with early exit
await db.transaction(async (tx) => {
  const [member] = await tx.select()
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId)))

  if (!member) throw new ForbiddenError('Not a team member')

  return tx.insert(tasks).values({ ...taskData, teamId }).returning()
})
```

---

## Migrations (drizzle-kit)

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema:    './src/db/schema/*',
  out:       './drizzle/migrations',
  dialect:   'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# View current DB state
npx drizzle-kit studio
```

Document in `apps/api/README.md`:
```
1. Copy .env.example to .env and set DATABASE_URL
2. npx drizzle-kit migrate
3. npm run dev
```

---

## Rules

- Always export `type Task = typeof tasks.$inferSelect` — use inferred types, not hand-written ones
- Always use `returning()` after insert/update to get the created/updated row
- Always use `and()` with ownership check (`assigneeId = userId`) on updates and deletes
- Always use `Promise.all` for parallel queries — never sequential awaits for independent queries
- Never use raw SQL unless absolutely necessary — use `sql` tagged template with parameters only
- Place all schema files under `src/db/schema/`, re-export from `src/db/schema/index.ts`

**Constraints:** Schema must match `spec/architecture/data-model.md` and `spec/domain/entities.md`.
