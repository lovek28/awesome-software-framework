# Skill: Fastify (stack: backend)

**When:** `stack.config.json` has `backend: "fastify"`. Apply during backend stage.

---

## Project structure

```
apps/api/
├── src/
│   ├── app.ts           # Fastify instance, plugin registration
│   ├── server.ts        # Entry point — listen on port
│   ├── routes/          # One file per resource (tasks.ts, users.ts)
│   ├── plugins/         # Auth, DB, CORS, sensible
│   └── errors.ts        # Domain error → HTTP status map
├── package.json
└── tsconfig.json
```

---

## App setup

```ts
// src/app.ts
import Fastify from 'fastify'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import { authPlugin } from './plugins/auth'
import { dbPlugin } from './plugins/db'
import { taskRoutes } from './routes/tasks'

export function buildApp() {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } })

  app.register(cors, { origin: process.env.CORS_ORIGIN ?? '*' })
  app.register(sensible)        // adds app.httpErrors helpers
  app.register(dbPlugin)        // attaches prisma to app.db
  app.register(authPlugin)      // adds app.authenticate decorator
  app.register(taskRoutes, { prefix: '/api/v1/tasks' })

  app.get('/health', async () => ({ status: 'ok' }))

  return app
}
```

---

## Route structure

```ts
// src/routes/tasks.ts
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { TaskService } from '../../packages/services/task.service'

const createTaskSchema = {
  body: {
    type: 'object',
    required: ['title', 'teamId'],
    properties: {
      title:       { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string' },
      teamId:      { type: 'string', format: 'uuid' },
      assigneeId:  { type: 'string', format: 'uuid' },
      deadline:    { type: 'string', format: 'date-time' },
      priority:    { type: 'string', enum: ['low', 'medium', 'high'] },
    },
  },
}

export const taskRoutes: FastifyPluginAsync = async (app) => {
  // Protected routes
  app.addHook('preHandler', app.authenticate)

  app.post('/', { schema: createTaskSchema }, async (req, reply) => {
    const task = await TaskService.create(app.db, req.user.id, req.body)
    return reply.code(201).send(task)
  })

  app.get('/', async (req, reply) => {
    const tasks = await TaskService.listForUser(app.db, req.user.id)
    return tasks
  })

  app.get('/:id', async (req, reply) => {
    const task = await TaskService.findById(app.db, req.params.id, req.user.id)
    if (!task) throw app.httpErrors.notFound('Task not found')
    return task
  })

  app.patch('/:id', async (req, reply) => {
    const task = await TaskService.update(app.db, req.params.id, req.user.id, req.body)
    return task
  })

  app.delete('/:id', async (req, reply) => {
    await TaskService.delete(app.db, req.params.id, req.user.id)
    return reply.code(204).send()
  })
}
```

---

## Error handling

Map domain errors to HTTP status codes in one place:

```ts
// src/errors.ts
import { FastifyInstance } from 'fastify'

export class NotFoundError extends Error { constructor(msg: string) { super(msg); this.name = 'NotFoundError' } }
export class ForbiddenError extends Error { constructor(msg: string) { super(msg); this.name = 'ForbiddenError' } }
export class ValidationError extends Error {
  constructor(msg: string, public fields: Record<string, string>) { super(msg); this.name = 'ValidationError' }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, req, reply) => {
    if (error.name === 'NotFoundError')    return reply.code(404).send({ code: 'NOT_FOUND',    message: error.message })
    if (error.name === 'ForbiddenError')   return reply.code(403).send({ code: 'FORBIDDEN',    message: error.message })
    if (error.name === 'ValidationError')  return reply.code(422).send({ code: 'VALIDATION',   message: error.message, fields: (error as ValidationError).fields })
    if (error.validation)                  return reply.code(400).send({ code: 'BAD_REQUEST',   message: 'Validation failed', details: error.validation })

    req.log.error(error)
    return reply.code(500).send({ code: 'INTERNAL_ERROR', message: 'Something went wrong' })
  })
}
```

---

## Auth plugin (JWT)

```ts
// src/plugins/auth.ts
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export const authPlugin = fp(async (app) => {
  app.register(jwt, { secret: process.env.JWT_SECRET! })

  app.decorate('authenticate', async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch {
      reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or missing token' })
    }
  })
})
```

---

## DB plugin (Prisma)

```ts
// src/plugins/db.ts
import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

export const dbPlugin = fp(async (app) => {
  const prisma = new PrismaClient()
  await prisma.$connect()
  app.decorate('db', prisma)
  app.addHook('onClose', async () => prisma.$disconnect())
})
```

---

## Health check

Always include. Used by load balancers, Railway, Docker, etc.

```ts
app.get('/health', async (req, reply) => {
  try {
    await app.db.$queryRaw`SELECT 1`
    return { status: 'ok', db: 'ok' }
  } catch {
    return reply.code(503).send({ status: 'error', db: 'unreachable' })
  }
})
```

---

## Rules

- Always validate with JSON Schema on the route or Zod in the service — never trust raw `req.body`
- Always use `process.env` for secrets — never hardcode
- Always map domain errors to HTTP codes in `errors.ts` — never leak stack traces to the client
- Never block the event loop — use async DB calls and streams for large responses
- Log at request level with `req.log` not `console.log`
- Follow `spec/architecture/backend.md` for route structure and service boundaries

**Constraints:** Use `DATABASE_URL` from env. All route logic delegates to `packages/services/`. Domain logic lives in `packages/domain/`.
