# Infrastructure

Database, hosting, and deployment configuration.

## Local database (localhost)

Projects need a running database on localhost for the backend to work (unless using SQLite). Follow the steps below based on `stack.config.json` **database** value.

### PostgreSQL

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

### MySQL

When `stack.config.json` has `"database": "mysql"` (or similar), use the MySQL Compose file:

1. **Start MySQL** (from project root):
   ```bash
   docker compose -f docker-compose.mysql.yml up -d
   ```
   This starts MySQL on `localhost:3306` with database `app`, user `app`, password `app`.

2. **Set env**: Copy `.env.example` to `.env` and set:
   ```bash
   DATABASE_URL="mysql://app:app@localhost:3306/app"
   ```

3. **Run migrations** (e.g. Prisma):
   ```bash
   npx prisma migrate dev
   ```

4. **Stop**: `docker compose -f docker-compose.mysql.yml down`

### SQLite

When `stack.config.json` has `"database": "sqlite"`, **no Docker is needed**.

1. **Set env**: Copy `.env.example` to `.env` and set:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```
   (Or `file:./data/dev.db` if you prefer a subdirectory. The ORM creates the file.)

2. **Run migrations** (e.g. Prisma):
   ```bash
   npx prisma migrate dev
   ```

3. The SQLite file is created in the project directory. Do not commit `dev.db` (add to `.gitignore` if needed).

## Environment matrix

- **development**: Use the URLs above (localhost Postgres/MySQL or `file:./dev.db` for SQLite).
- **staging / production**: Set `DATABASE_URL` (and other vars) per environment. Use your host’s env or secrets; do not commit production URLs.

## Role

- Database setup and migrations (when not colocated with API)
- Deployment config (Docker, Docker Compose, or cloud)
- CI/CD or runbooks as needed

## Implementation

Add during or after **backend** and **frontend** stages. Align with `stack.config.json`. Keep secrets in `.env`; never commit `.env`.
