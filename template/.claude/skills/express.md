# Skill: Express (stack: backend)

**When:** `stack.config.json` has `backend: "express"`. Apply during backend stage.

---

## Project structure

```
apps/api/
├── src/
│   ├── app.ts           # Express app factory, middleware registration
│   ├── server.ts        # Entry point — listen on port
│   ├── routes/          # One router per resource (tasks.router.ts)
│   ├── middleware/       # auth.ts, validate.ts, errorHandler.ts
│   ├── errors.ts        # Domain error classes
│   └── types/           # Express augmentation (req.user, etc.)
├── package.json
└── tsconfig.json
```

---

## App setup

```ts
// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { taskRouter } from './routes/tasks.router'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

export function buildApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }))
  app.use(express.json())

  app.get('/health', async (req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/v1/tasks', taskRouter)

  app.use(notFound)
  app.use(errorHandler)   // must be last

  return app
}
```

---

## Route structure

```ts
// src/routes/tasks.router.ts
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createTaskSchema } from '../schemas/task.schema'
import { TaskService } from '../../../packages/services/task.service'

export const taskRouter = Router()

taskRouter.use(authenticate)

taskRouter.get('/', async (req, res, next) => {
  try {
    const tasks = await TaskService.listForUser(req.db, req.user.id)
    res.json(tasks)
  } catch (err) { next(err) }
})

taskRouter.post('/', validate(createTaskSchema), async (req, res, next) => {
  try {
    const task = await TaskService.create(req.db, req.user.id, req.body)
    res.status(201).json(task)
  } catch (err) { next(err) }
})

taskRouter.get('/:id', async (req, res, next) => {
  try {
    const task = await TaskService.findById(req.db, req.params.id, req.user.id)
    if (!task) return res.status(404).json({ code: 'NOT_FOUND', message: 'Task not found' })
    res.json(task)
  } catch (err) { next(err) }
})

taskRouter.patch('/:id', async (req, res, next) => {
  try {
    const task = await TaskService.update(req.db, req.params.id, req.user.id, req.body)
    res.json(task)
  } catch (err) { next(err) }
})

taskRouter.delete('/:id', async (req, res, next) => {
  try {
    await TaskService.delete(req.db, req.params.id, req.user.id)
    res.status(204).send()
  } catch (err) { next(err) }
})
```

---

## Error handler middleware

Always the last middleware registered:

```ts
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { NotFoundError, ForbiddenError, ValidationError } from '../errors'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError)
    return res.status(422).json({ code: 'VALIDATION_ERROR', message: err.message, fields: err.fields })
  if (err instanceof NotFoundError)
    return res.status(404).json({ code: 'NOT_FOUND', message: err.message })
  if (err instanceof ForbiddenError)
    return res.status(403).json({ code: 'FORBIDDEN', message: err.message })

  req.log?.error(err) ?? console.error(err)
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Something went wrong' })
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` })
}
```

---

## Validation middleware (Zod)

```ts
// src/middleware/validate.ts
import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../errors'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const fields: Record<string, string> = {}
      result.error.errors.forEach(e => { fields[e.path.join('.')] = e.message })
      return next(new ValidationError('Validation failed', fields))
    }
    req.body = result.data
    next()
  }
}
```

---

## Auth middleware (JWT)

```ts
// src/middleware/auth.ts
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    next()
  } catch {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }
}
```

---

## Rules

- Always register `errorHandler` last — after all routes
- Always wrap async route handlers with `try/catch` and pass to `next(err)`
- Always validate with Zod via `validate()` middleware — never trust raw `req.body`
- Always use `helmet()` and `cors()` — never skip security middleware
- Never return stack traces to the client — log server-side only
- Follow `spec/architecture/backend.md` for route and service boundaries

**Constraints:** Use `DATABASE_URL` from env. Route logic delegates to `packages/services/`. Domain logic in `packages/domain/`.
