# Skill: Next.js (stack: frontend)

**When:** `stack.config.json` has `frontend: "nextjs"` (or similar). Apply during frontend stage.

**What to do:**
- Use App Router (`app/`) or Pages Router consistently; prefer App Router for new apps.
- Server components by default; add `"use client"` only where needed (state, browser APIs).
- API calls: use env `NEXT_PUBLIC_*` for client-exposed vars; server-side use `process.env` without prefix.
- Styling: align with `styling` in stack (e.g. Tailwind, CSS Modules). Use layout and loading/error boundaries.
- Do not expose secrets to the client; keep auth and server logic on the server.

**Constraints:** Follow spec/architecture/frontend.md and spec/ux flows.
