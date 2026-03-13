# Admin App (optional)

When `stack.config.json` has `frontend_admin` (e.g. `"frontend_admin": "nextjs"`), this app is the admin UI. It shares `apps/api` and `packages/domain` / `packages/services` with the main web app. Use separate routes and auth (e.g. admin-only role). Pipeline runs frontend stage for each app; implement admin after or alongside `apps/web` per architecture.

## Role

- Admin-only flows (e.g. from `spec/ux/flows-admin.md` or admin section in flows).
- Same API and domain; different routes and access control.
