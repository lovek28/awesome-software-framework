# Skill: React (stack: frontend — Vite + React, no framework)

**When:** `stack.config.json` has `frontend: "react"` (Vite SPA, no Next.js). Apply during frontend stage.

---

## Project structure

```
apps/web/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx         # Entry — render App, providers
│   ├── App.tsx          # Router setup
│   ├── pages/           # One file per route
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── tasks/
│   │       ├── TaskList.tsx
│   │       └── TaskDetail.tsx
│   ├── components/
│   │   ├── ui/          # Primitives: Button, Input, Card
│   │   └── features/    # TaskCard, TaskForm
│   ├── lib/
│   │   ├── api.ts       # Typed fetch wrapper
│   │   └── auth.ts      # Token storage and helpers
│   ├── store/           # Zustand stores (if needed)
│   └── types/           # Shared types matching API contract
```

---

## Router setup (React Router v6)

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Typed API client

```ts
// src/lib/api.ts
const BASE = import.meta.env.VITE_API_URL   // Vite uses import.meta.env, not process.env

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new ApiError(res.status, err.message ?? 'Request failed', err)
  }
  return res.json()
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
}
```

---

## Data fetching — React Query

Use React Query for all server state. Do not use `useEffect` + `useState` for data fetching.

```tsx
// pages/tasks/TaskList.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function TaskList() {
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get<Task[]>('/api/v1/tasks'),
  })

  const create = useMutation({
    mutationFn: (body: CreateTaskInput) => api.post('/api/v1/tasks', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  if (isLoading) return <TaskListSkeleton />
  if (error)     return <ErrorMessage error={error} />

  return (
    <>
      {data?.map(task => <TaskCard key={task.id} task={task} />)}
      <TaskForm onSubmit={create.mutateAsync} loading={create.isPending} />
    </>
  )
}
```

---

## Auth store (Zustand)

```ts
// src/store/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  login:  (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login:  (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth' }
  )
)
```

---

## Environment variables

```bash
# .env (Vite — never use process.env)
VITE_API_URL=http://localhost:3001
```

- All env vars must start with `VITE_` to be available in the browser bundle
- Never put secret keys in `VITE_*` — they are exposed to the browser

---

## Rules

- Never use `useEffect` + `useState` for data fetching — use React Query
- Never put API secrets in `VITE_*` env vars — they go in the browser bundle
- Always type API responses using types from `src/types/` that mirror the OpenAPI contract
- Keep `components/ui/` as pure, stateless primitives; `components/features/` for business logic
- Always handle loading and error states — never assume data is available
- Follow `spec/ux/flows.md` for routing and user journeys; `spec/ui/system.md` for components

**Constraints:** Follow `spec/ux/flows.md` for all routes and user journeys. Follow `spec/ui/system.md` for component patterns.
