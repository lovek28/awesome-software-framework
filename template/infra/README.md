# Infrastructure

Database, hosting, and deployment configuration.

## Local database (localhost)

Projects need a running database on localhost for the backend to work. Follow the steps below based on `stack.config.json`.

### PostgreSQL (default / standard stack)

1. **Start Postgres** (from project root):
   ```bash
   docker compose up -d
   ```
   This starts Postgres on `localhost:5432` with user `postgres`, password `postgres`, database `app`.

2. **Set env**: Copy `.env.example` to `.env` and keep or adjust `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
   Default URL: `postgresql://postgres:postgres@localhost:5432/app`

3. **Run migrations** (after backend is implemented; e.g. Prisma):
   ```bash
   npx prisma migrate dev
   # or from apps/api: npm run db:migrate / similar
   ```

4. **Stop**: `docker compose down` (data persists in volume). `docker compose down -v` removes data.

### MySQL (if chosen in stack)

Use a MySQL image in `docker-compose.yml` instead of Postgres (see [MySQL Docker docs](https://hub.docker.com/_/mysql)). Set `DATABASE_URL` in `.env` to your MySQL connection string. Run your ORM migrations the same way.

### SQLite (if chosen in stack)

No Docker needed. Set `DATABASE_URL="file:./dev.db"` (or similar) in `.env`. Run migrations; the file is created locally.

## Role

- Database setup and migrations (when not colocated with API)
- Deployment config (Docker, Docker Compose, or cloud)
- CI/CD or runbooks as needed

## Implementation

Add during or after **backend** and **frontend** stages. Align with `stack.config.json`. Keep secrets in `.env`; never commit `.env`.
