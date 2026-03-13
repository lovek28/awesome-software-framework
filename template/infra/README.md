# Infrastructure

Database, hosting, and deployment configuration.

## Role

- Database setup and migrations (if not colocated with API)
- Deployment config (e.g. Docker, Docker Compose, or cloud templates)
- CI/CD or runbooks as needed

## Implementation

Add during or after **backend** and **frontend** stages when deployment is in scope. Align with `stack.config.json` (e.g. Postgres). Keep secrets out of repo; use env or secret manager.

## Contents

- Database: schema bootstrap or migration runner config if separate from app
- Containers or runtime: Dockerfile, docker-compose, or similar
- Env: example `.env.example`; document required variables in project README
