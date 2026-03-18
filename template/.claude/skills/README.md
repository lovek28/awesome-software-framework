# Skills

Reusable "how-to" knowledge per stack and stage. Claude loads the matching skill file based on `stack.config.json` and the current pipeline stage.

---

## Built-in skills

| Skill file | Applies when | What it covers |
|------------|-------------|----------------|
| `fastify.md` | `backend: "fastify"` | App structure, typed routes, error handler, JWT auth, DB plugin, health check |
| `express.md` | `backend: "express"` | App structure, router pattern, Zod validation middleware, error handler, JWT auth |
| `nextjs.md` | `frontend: "nextjs"` | App Router, server vs client components, typed API client, auth guard, env vars, server actions |
| `react.md` | `frontend: "react"` | Vite SPA, React Router, typed API client, React Query, Zustand auth store |
| `vue.md` | `frontend: "vue"` or `"nuxt"` | Nuxt 3 + Vue 3 SPA, Composition API, Pinia, Vue Router, typed composable API client |
| `prisma.md` | `orm: "prisma"` | Schema patterns, N+1 prevention, transactions, migrations, seeding |
| `drizzle.md` | `orm: "drizzle"` | Schema definition, typed queries, transactions, drizzle-kit migrations |
| `product-spec.md` | Stage: `product_spec` | Five required sections, quality gate checklist, stage guide |
| `api-design.md` | Stage: `architecture` or `api_contract` | REST conventions, error format, pagination, OpenAPI structure |

---

## When no skill matches

If the user chose a technology not listed above (e.g. NestJS, Hono, SvelteKit, Remix, TypeORM, Sequelize):

1. Tell the user no built-in skill exists for that technology
2. Apply `api-design.md` principles (for backend) or general frontend patterns from the spec
3. Apply Section 3c (pre-code reasoning gate) as normal — the six questions apply regardless of stack
4. State which conventions you are following so the user can correct you

The user can add a custom skill (see below) to give Claude specific guidance for their technology.

---

## Adding a custom skill

Drop a `.md` file in this directory. Claude will use it when the trigger condition matches.

### Skill file format

```markdown
# Skill: [Technology name]

**When:** [trigger condition — e.g. stack.config.json has backend: "nestjs"]

---

## [Section]

[Content — patterns, code examples, rules]

---

## Rules

- [Rule 1]
- [Rule 2]

**Constraints:** [What this skill must align with]
```

### Example: custom NestJS skill

Create `.claude/skills/nestjs.md`:

```markdown
# Skill: NestJS (stack: backend)

**When:** stack.config.json has backend: "nestjs". Apply during backend stage.

## Module structure

- One module per domain resource (TasksModule, UsersModule)
- Controllers handle HTTP only — delegate everything to services
- Services contain business logic — inject repositories, not Prisma directly

## Rules

- Always use class-validator decorators on DTOs
- Always use Guards for auth — never check tokens in controllers
- Follow spec/architecture/backend.md for module boundaries
```

### Community skill ideas

| Technology | Skill name to create |
|------------|----------------------|
| NestJS | `nestjs.md` |
| Hono | `hono.md` |
| SvelteKit | `sveltekit.md` |
| Remix | `remix.md` |
| TypeORM | `typeorm.md` |
| Django (Python) | `django.md` |
| Rails (Ruby) | `rails.md` |
| Go + Chi | `go-chi.md` |
