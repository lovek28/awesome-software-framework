# Skill: Next.js (stack: frontend)

**When:** `stack.config.json` has `frontend: "nextjs"`. Apply during frontend stage.

---

## Project structure

```
apps/web/
├── app/
│   ├── layout.tsx           # Root layout, fonts, providers
│   ├── page.tsx             # Home page (server component)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/               # Protected layout group
│   │   ├── layout.tsx       # Auth guard
│   │   ├── dashboard/page.tsx
│   │   └── tasks/
│   │       ├── page.tsx     # Task list
│   │       └── [id]/page.tsx
│   └── api/                 # API routes (only if no separate backend)
├── components/
│   ├── ui/                  # Primitives (button, input, card)
│   └── features/            # Feature components (TaskCard, TaskForm)
├── lib/
│   ├── api.ts               # Typed fetch wrapper
│   └── auth.ts              # Auth helpers
└── types/
    └── index.ts             # Shared types matching API contract
```

---

## Server vs client components

Default to **server components**. Add `"use client"` only when needed.

| Use server component | Use client component (`"use client"`) |
|----------------------|---------------------------------------|
| Data fetching        | useState / useEffect                  |
| Static content       | onClick, onChange handlers            |
| Auth checks          | Browser APIs (localStorage, etc.)     |
| SEO-critical pages   | Real-time updates                     |

```tsx
// ✅ Server component — fetch data directly
// app/(app)/tasks/page.tsx
import { api } from '@/lib/api'
import { TaskList } from '@/components/features/TaskList'

export default async function TasksPage() {
  const tasks = await api.get('/tasks')   // server-side, no CORS issue
  return <TaskList tasks={tasks} />
}
```

```tsx
// ✅ Client component — only for interactivity
// components/features/TaskForm.tsx
'use client'
import { useState } from 'react'

export function TaskForm({ onSubmit }: { onSubmit: (data: CreateTaskInput) => Promise<void> }) {
  const [title, setTitle] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title }) }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}
```

---

## Typed API client

```ts
// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new ApiError(res.status, err.message ?? 'Request failed', err)
  }
  return res.json()
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message)
  }
}

export const api = {
  get:    <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post:   <T>(path: string, body: unknown)      => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown)      => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)                     => request<T>(path, { method: 'DELETE' }),
}
```

---

## Auth guard layout

```tsx
// app/(app)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect('/login')
  return <>{children}</>
}
```

---

## Environment variables

```bash
# .env.local (never committed)
NEXT_PUBLIC_API_URL=http://localhost:3001   # exposed to browser
API_SECRET=...                              # server only — no NEXT_PUBLIC_ prefix
```

- `NEXT_PUBLIC_*` — safe to expose to browser
- Everything else — server only, never in client components

---

## Error and loading boundaries

```tsx
// app/(app)/tasks/loading.tsx — auto-shown during async server component fetch
export default function Loading() {
  return <div className="animate-pulse">Loading tasks...</div>
}

// app/(app)/tasks/error.tsx — auto-shown on thrown errors
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## Server actions (mutations)

Use server actions for form submissions instead of separate API routes when the backend is in the same repo:

```ts
// app/(app)/tasks/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { api } from '@/lib/api'

export async function createTask(formData: FormData) {
  await api.post('/tasks', { title: formData.get('title') })
  revalidatePath('/tasks')
}
```

---

## Rules

- Never put secrets in `NEXT_PUBLIC_*` env vars
- Never fetch data in client components when a server component can do it
- Always add `loading.tsx` and `error.tsx` for async pages
- Always type API responses — use types from `types/index.ts` that mirror the OpenAPI contract
- Keep `components/ui/` framework-agnostic primitives; keep `components/features/` page-specific
- Follow `spec/architecture/frontend.md` and `spec/ux/flows.md` for page structure and routing

**Constraints:** Follow `spec/ux/flows.md` for all routes and user journeys. Follow `spec/ui/system.md` for component patterns and design tokens.
