# Skill: API design (stage: architecture / api_contract)

**When:** Writing `spec/architecture/backend.md` or `spec/api/openapi.yaml`. Apply during architecture or api_contract stage.

---

## Resource naming

| Rule | ✅ Good | ❌ Bad |
|------|---------|--------|
| Nouns, not verbs | `/tasks` | `/getTasks` |
| Plural resources | `/tasks` | `/task` |
| Nested for ownership | `/teams/:id/tasks` | `/tasks?teamId=x` |
| Lowercase, hyphenated | `/task-comments` | `/taskComments` |
| ID in path for single resource | `/tasks/:id` | `/tasks/find?id=x` |

---

## HTTP methods

| Method | Use for | Success code |
|--------|---------|--------------|
| `GET` | Read — list or single resource | 200 |
| `POST` | Create | 201 |
| `PUT` | Full replace | 200 |
| `PATCH` | Partial update | 200 |
| `DELETE` | Remove | 204 (no body) |

---

## URL versioning

```
/api/v1/tasks
/api/v1/users
```

Always prefix with `/api/v1/`. When breaking changes are needed, add `/api/v2/` and keep v1 running until clients migrate.

---

## Consistent error format

Every error response uses this shape — never deviate:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": [
    { "field": "title", "message": "Title is required" },
    { "field": "deadline", "message": "Deadline must be in the future" }
  ]
}
```

| HTTP status | `code` value | When |
|-------------|--------------|------|
| 400 | `BAD_REQUEST` | Malformed request, missing required fields |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 403 | `FORBIDDEN` | Authenticated but not permitted |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Duplicate resource, state conflict |
| 422 | `VALIDATION_ERROR` | Input passes parsing but fails business rules |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

---

## Pagination

Always paginate list endpoints. Use cursor-based for large datasets; offset for simple admin UIs.

```json
// Offset pagination response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 143,
    "pages": 8
  }
}

// Cursor pagination response
{
  "data": [...],
  "cursor": {
    "next": "eyJpZCI6IjEyMyJ9",
    "hasMore": true
  }
}
```

Query params: `?page=1&limit=20` or `?cursor=xxx&limit=20`.

---

## Filtering and sorting

```
GET /api/v1/tasks?status=TODO&priority=HIGH&assigneeId=uuid
GET /api/v1/tasks?sort=deadline&order=asc
GET /api/v1/tasks?search=keyword
```

Document accepted filter params in OpenAPI. Validate and whitelist — never pass raw query params to DB.

---

## OpenAPI structure

```yaml
# spec/api/openapi.yaml
openapi: 3.1.0
info:
  title: My App API
  version: 1.0.0

servers:
  - url: http://localhost:3001/api/v1
    description: Local

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Task:
      type: object
      required: [id, title, status, teamId, createdAt]
      properties:
        id:        { type: string, format: uuid }
        title:     { type: string }
        status:    { type: string, enum: [TODO, IN_PROGRESS, DONE, CANCELLED] }
        priority:  { type: string, enum: [LOW, MEDIUM, HIGH] }
        deadline:  { type: string, format: date-time, nullable: true }
        teamId:    { type: string, format: uuid }
        createdAt: { type: string, format: date-time }

    Error:
      type: object
      required: [code, message]
      properties:
        code:    { type: string }
        message: { type: string }
        details: { type: array, items: { type: object } }

security:
  - bearerAuth: []

paths:
  /tasks:
    get:
      summary: List tasks
      parameters:
        - name: status
          in: query
          schema: { type: string, enum: [TODO, IN_PROGRESS, DONE, CANCELLED] }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:       { type: array, items: { $ref: '#/components/schemas/Task' } }
                  pagination: { type: object }
        '401': { $ref: '#/components/responses/Unauthorized' }

    post:
      summary: Create task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, teamId]
              properties:
                title:    { type: string, minLength: 1, maxLength: 255 }
                teamId:   { type: string, format: uuid }
                priority: { type: string, enum: [LOW, MEDIUM, HIGH], default: MEDIUM }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Task' }
        '422': { $ref: '#/components/responses/ValidationError' }
```

---

## Auth

Always document the auth scheme in the spec:

```yaml
# JWT Bearer (most common)
Authorization: Bearer <token>

# For frontend: store token in httpOnly cookie or memory (not localStorage)
# For API-to-API: use service tokens or API keys via X-API-Key header
```

---

## Rules

- Design API from the spec/domain, not from the DB schema — resources should map to domain concepts, not tables
- Every endpoint must document at least one error response
- Never expose internal IDs that reveal DB row counts — use UUIDs
- Breaking changes require a new version — never change an existing endpoint's response shape in-place
- Frontend and backend must both reference `spec/api/openapi.yaml` as the single contract

**Constraints:** Derive all resources and fields from `spec/domain/entities.md` and `spec/architecture/data-model.md`. No implementation code in the spec.
