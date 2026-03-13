# Context scope per stage

Read only what’s needed for the current stage to keep context small and cost predictable. Prefer this over reading the entire repo.

| Stage | Read (priority) | Avoid |
|-------|------------------|-------|
| **idea** | workflow.state.json, workflow.config.json | Full spec and code |
| **product_spec** | workflow.state.json, stack.config.json, spec/product/spec.md | Backend/frontend code |
| **domain_rules** | workflow.state.json, spec/product/spec.md, spec/domain/*.md | Architecture and code |
| **ux_flow** | workflow.state.json, spec/product/spec.md, spec/ux/*.md | Code |
| **ui_system** | workflow.state.json, spec/product/spec.md, spec/ux/*.md, spec/ui/system.md | Code |
| **architecture** | workflow.state.json, stack.config.json, spec/product/spec.md, spec/domain/*.md, spec/ux/*.md, spec/ui/system.md, spec/architecture/*.md | apps/, packages/ (except READMEs) |
| **api_contract** | As architecture, plus spec/architecture/backend.md, data-model.md, spec/domain/entities.md | Implementation |
| **backend** | workflow.state.json, stack.config.json, spec/architecture/backend.md, data-model.md, spec/domain/*.md, spec/security.md, packages/domain, packages/services, apps/api | Frontend, tests (except if touching API contract) |
| **frontend** | workflow.state.json, stack.config.json, spec/architecture/frontend.md, spec/ux/*.md, spec/ui/system.md, spec/api/openapi.yaml (if any), packages/ui, apps/web | Backend impl, tests |
| **tests** | workflow.state.json, stack.config.json, spec/product/spec.md, spec/ux/flows.md, relevant packages/apps under test | Unrelated code |
| **docs** | spec/product/spec.md, spec/ux/flows.md, spec/api/openapi.yaml, docs/README.md | Full codebase |

**Priority when context is limited:** (1) workflow state and current stage instructions, (2) stack.config and spec for current stage, (3) code for current stage, (4) summaries of previous stages (if present). Drop full file contents of completed stages first.

**Incremental reads:** For backend/frontend on large apps, work in small scopes (e.g. one package or one route at a time) and read only the files needed for that scope.

**Optional:** After each stage, write a short summary to `workflow.context.json` (e.g. `{ "product_spec": "Summary of decisions and files changed" }`) or `.claude/summaries/<stage>.md` so later stages can read the summary instead of re-reading all outputs. Optional `tokenBudget` in project config (e.g. max tokens per stage) is guidance only; enforcement is environment-dependent.
