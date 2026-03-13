# Runbooks

> **Claude:** Generate a minimal runbook from infra and architecture. Keep it updated when deploy or DB steps change.

## Deploy

- How to deploy (e.g. `vercel deploy`, `fly deploy`, `docker build` + push).
- Required env and secrets per environment.
- Rollback: how to revert to a previous release.

## Database

- How to run migrations (e.g. `npx prisma migrate deploy`).
- How to connect and inspect (e.g. `psql`, Prisma Studio).
- Backup/restore if applicable.

## Incidents

- How to check health (e.g. `GET /health`).
- Where to find logs (e.g. host, Sentry).
- Escalation or contacts if defined.
