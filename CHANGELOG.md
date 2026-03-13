# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (Nothing yet.)

### Changed

- (Nothing yet.)

### Fixed

- (Nothing yet.)

---

## [2.0.0] - 2026-03-13

### Added

**Workflow (Phases C–F)**  
- Optional and custom stages in `workflow.config.json` with per-stage descriptions.  
- Optional stages: tests, api_contract, docs; projects can add custom stages (e.g. deploy_config).  
- Stack validation: require at least frontend, backend, database; sensible defaults when user skips.  
- MySQL support: `docker-compose.mysql.yml`; SQLite path documented (no Docker, `file:./dev.db`).  
- Optional root `package.json` with workspaces; `.cursor/rules` for Cursor; stage checklists in spec templates.  
- **Upgrade command**: `create-awesome-software upgrade [path]` — pulls non-destructive updates (CLAUDE, workflow, .claude/instructions, agents, context-scope, extensibility, docker-compose, .env.example); leaves specs, code, stack, and workflow state unchanged.

**Auth & security (G)**  
- Optional `auth` and `auth_provider` in stack; Claude generates auth integration.  
- `spec/security.md` OWASP-oriented checklist; secrets documented in `.env.example`; optional compliance.

**Deployment & CI (H)**  
- Optional `deploy` in stack (vercel, docker, fly, railway); deploy_config stage; `infra/README.md` deployment section.  
- `.github/workflows/ci.yml.example` for build, test, optional deploy; env matrix (dev/staging/prod).

**API contract & tests (I)**  
- `spec/api/openapi.yaml` template; optional **api_contract** stage; backend/frontend conform to contract.  
- Tests stage: runner and E2E bootstrap, optional `testCoverageMin`, spec-driven test cases from product and flows.

**Quality gates & modes (J)**  
- Checkpoints and resume (e.g. `.claude/checkpoints/<stage>.json`); quality gates (product_spec completeness, architecture conformance).  
- **mode** in workflow.state.json: `quick` (merge/shorten stages) vs `full`.

**Observability (K)**  
- Health endpoint required (`GET /health` or `/api/health`); structured logging; optional `observability` in stack.  
- `spec/architecture/runbooks.md` and `spec/architecture/adr/` for runbooks and ADRs.

**Multi-app & presets (L)**  
- Optional `frontend_admin` and `mobile` in stack; `apps/admin`, `apps/mobile` READMEs.  
- Presets: `.presets/crud.json`, `auth-dashboard.json`, `api-only.json`; Claude applies from user intent.

**Extensibility (M)**  
- **Hooks** in `workflow.config.json` (`before_<stage>`, `after_<stage>`); `.claude/extensibility.md`; plugin contract draft.

**Docs from spec (N)**  
- Optional **docs** stage; `docs/README.md`; API docs from OpenAPI; product/UX docs from spec.

**Agents (O)**  
- Per-stage instructions: `.claude/stages/spec-writer.md`, `backend-impl.md`, `frontend-impl.md`.  
- `.claude/agents.md` and `.cursor/rules/agents.md` for Spec, Backend, Frontend agents; optional reviewer and multi-agent note.

**Skills (P)**  
- `.claude/skills/` with nextjs, fastify, prisma, product-spec, api-design; README and skill contract for project/community skills.

**Token control (Q)**  
- `.claude/context-scope.md`: per-stage context diet, priority, incremental reads; optional summarization and token budget notes.

### Changed

- Pipeline default order includes optional api_contract and docs; workflow.config.json has `stages` with descriptions and `hooks`.  
- CLAUDE.md expanded with stack (auth, deploy, multi-app), security, API contract, tests, quality gates, modes, health/logging, presets, skills, context scope, and docs stage.  
- Template project structure updated (agents, skills, context-scope, presets, docs, security, api, runbooks, adr).  
- Upgrade command now also copies `.claude/agents.md`, `.claude/context-scope.md`, `.claude/extensibility.md`.

---

## [1.0.0] - (initial release)

### Added

- Initial scaffold: template with spec-first pipeline (idea → product_spec → domain → ux → ui → architecture → backend → frontend → tests).
- CLI: `create-awesome-software <project-name>` with optional `--output-dir` / `-o` and `--version` / `-v`.
- Framework version written to generated projects (`.framework-version`) for future upgrades.
- Optional update check on run (disable with `NO_UPDATE_CHECK=1`).
- Template: `workflow.config.json`, `.claude/workflow.state.json`, `stack.config.json`, spec and app layout.
- Docker Compose (Postgres) and `.env.example` for local backend development.

[Unreleased]: https://github.com/lovek28/awesome-software-framework/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/lovek28/awesome-software-framework/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/lovek28/awesome-software-framework/releases/tag/v1.0.0
