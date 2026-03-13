# Skill: Fastify (stack: backend)

**When:** `stack.config.json` has `backend: "fastify"`. Apply during backend stage.

**What to do:**
- Validate request body and query with Fastify schemas (JSON Schema or Ajv). Return 400 with clear messages on validation failure.
- Use async/await; register routes and plugins in a clear order. Use dependency injection or a service locator for domain/services.
- Errors: use `reply.code()` and a consistent error shape (e.g. `{ code, message, details }`). Map domain errors to HTTP status.
- Health route: `GET /health` or `GET /api/health` returning 200; optionally check DB with a quick query.
- Do not block the event loop; use streams or worker threads for heavy work if needed.

**Constraints:** Follow spec/architecture/backend.md and use DATABASE_URL from env.
