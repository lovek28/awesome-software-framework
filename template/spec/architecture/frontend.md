# Frontend Architecture

> Web app structure. Follow `stack.config.json` (e.g. Next.js, Tailwind).

## App Structure

- **Framework**: Next.js (or per stack.config). Use App Router if applicable.
- **Routing**: Pages and routes that map to `spec/ux/flows.md`.
- **Data fetching**: How data is loaded (server components, client fetch to API, React Query, etc.).

## Packages

- **apps/web**: Next.js application; pages, layout, routing. Imports from `packages/ui` and optionally `packages/shared`.
- **packages/ui**: Shared components per `spec/ui/system.md`. Styling per stack (e.g. Tailwind).

## State

- **Server state**: Data from API; prefer server components or a data layer (e.g. React Query) rather than global client state for server data.
- **Client state**: UI state (modals, filters, form draft). Local state or minimal context as needed.
- **URL state**: Use URL (query, params) for shareable views and back/forward (e.g. list filters, selected id).

## Auth and API

- How the frontend gets and sends auth (cookie, token in header, etc.).
- Base URL for API (env var). How errors and loading are handled in the UI per `spec/ux/states.md`.

## Styling

- Per `stack.config.json` (e.g. Tailwind). Theming and design tokens as in `spec/ui/system.md`.
