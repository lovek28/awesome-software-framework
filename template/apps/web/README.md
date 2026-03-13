# Web App

Next.js frontend application (per `stack.config.json`).

## Role

- Pages and routing aligned with `spec/ux/flows.md`
- Consumes shared UI from `packages/ui`
- Calls `apps/api` for data
- Styling per `spec/ui/system.md` and stack (e.g. Tailwind)

## Implementation

Generated during the **frontend** pipeline stage. Do not implement here before the **architecture** stage is complete and `spec/architecture/frontend.md` exists.

## Structure

- `app/` — App Router routes and layouts (if using Next.js App Router)
- `pages/` — Or Pages Router (if applicable)
- `components/` — Page-specific components; shared ones live in `packages/ui`
