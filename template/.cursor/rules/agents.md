# Stage agents (focused edits)

When the user asks for **spec-only**, **backend-only**, or **frontend-only** work:

- **Spec Agent**: Read `.claude/workflow.state.json`. If stage is idea, product_spec, domain_rules, ux_flow, or ui_system, then read `.claude/stages/spec-writer.md` and edit only files under `spec/` and update workflow state.
- **Backend Agent**: Read `.claude/stages/backend-impl.md`. Edit only `packages/domain`, `packages/services`, `apps/api`, and backend config. Do not edit spec or frontend.
- **Frontend Agent**: Read `.claude/stages/frontend-impl.md`. Edit only `packages/ui`, `apps/web`, and optionally `apps/admin`, `apps/mobile`. Do not edit spec or backend.

Full list and orchestration: see `.claude/agents.md`.
