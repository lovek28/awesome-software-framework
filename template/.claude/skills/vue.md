# Skill: Vue 3 / Nuxt 3 (stack: frontend)

**When:** `stack.config.json` has `frontend: "vue"` or `frontend: "nuxt"`. Apply during frontend stage.

---

## Nuxt 3 (recommended — use when SSR or file-based routing is needed)

### Project structure

```
apps/web/
├── nuxt.config.ts
├── app.vue              # Root layout
├── pages/
│   ├── index.vue        # Home
│   ├── login.vue
│   └── dashboard/
│       ├── index.vue
│       └── tasks/
│           ├── index.vue
│           └── [id].vue
├── components/
│   ├── ui/              # Button, Input, Card
│   └── features/        # TaskCard, TaskForm
├── composables/
│   ├── useApi.ts        # Typed fetch wrapper
│   └── useAuth.ts       # Auth state + guards
├── stores/
│   └── auth.ts          # Pinia store
└── types/
    └── index.ts
```

### Page with server-side data fetch

```vue
<!-- pages/dashboard/tasks/index.vue -->
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: tasks, error, pending } = await useFetch<Task[]>('/api/v1/tasks', {
  headers: useRequestHeaders(['cookie']),
})
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <TaskCard v-else v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>
```

### Auth middleware

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.token) return navigateTo('/login')
})
```

---

## Vue 3 SPA (Vite — no Nuxt, client-side only)

### Project structure

```
apps/web/
├── vite.config.ts
├── src/
│   ├── main.ts          # createApp, plugins
│   ├── App.vue          # Router outlet
│   ├── router/index.ts  # Vue Router setup
│   ├── views/           # One file per route
│   ├── components/
│   │   ├── ui/
│   │   └── features/
│   ├── stores/          # Pinia stores
│   ├── composables/     # useApi, useAuth
│   └── types/
```

### Router with auth guard

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/Login.vue') },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
        { path: 'tasks',     component: () => import('@/views/tasks/TaskList.vue') },
        { path: 'tasks/:id', component: () => import('@/views/tasks/TaskDetail.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/login'
})

export default router
```

---

## Composable API client

```ts
// composables/useApi.ts
export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message)
  }
}

export function useApi() {
  const auth = useAuthStore()

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const base = import.meta.env.VITE_API_URL
    const res = await fetch(`${base}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
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

  return {
    get:    <T>(path: string) => request<T>(path),
    post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
    patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
    delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
  }
}
```

---

## Pinia store

```ts
// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null as string | null, user: null as User | null }),
  actions: {
    login(token: string, user: User) { this.token = token; this.user = user },
    logout()                         { this.token = null;  this.user = null  },
  },
  persist: true,   // with pinia-plugin-persistedstate
})
```

---

## Component pattern (Composition API)

```vue
<!-- components/features/TaskForm.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ loading?: boolean }>()
const emit  = defineEmits<{ submit: [data: CreateTaskInput] }>()

const title    = ref('')
const priority = ref<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')

function handleSubmit() {
  if (!title.value.trim()) return
  emit('submit', { title: title.value, priority: priority.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="title" placeholder="Task title" required />
    <select v-model="priority">
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>
    <button type="submit" :disabled="props.loading">
      {{ props.loading ? 'Creating...' : 'Create task' }}
    </button>
  </form>
</template>
```

---

## Rules

- Always use Composition API (`<script setup>`) — never Options API for new code
- Always use Pinia for shared state — never Vuex, never raw `provide/inject` for global state
- Always type props and emits with TypeScript generics in `defineProps` and `defineEmits`
- Always use `import.meta.env.VITE_*` for env vars — never `process.env` in Vite
- Keep composables in `composables/` — one concern per composable
- Follow `spec/ux/flows.md` for routing; `spec/ui/system.md` for component patterns

**Constraints:** Follow `spec/ux/flows.md` for all routes and user journeys. Follow `spec/ui/system.md` for component patterns and design tokens.
