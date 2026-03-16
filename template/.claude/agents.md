# Agents and stage-specific roles

Use these when you want **focused** work on one part of the pipeline. For full pipeline flow, use the main CLAUDE.md and workflow state.

| Role | When to use | Instructions |
|------|-------------|--------------|
| **Spec Writer** | Refine product spec, domain, UX, or UI spec only | Read `.claude/stages/spec-writer.md`. Work only in `spec/`; current stage should be idea, product_spec, domain_rules, ux_flow, or ui_system. |
| **Backend Agent** | Implement or change backend only | Read `.claude/stages/backend-impl.md`. Work in `packages/domain`, `packages/services`, `apps/api`. |
| **Frontend Agent** | Implement or change frontend only | Read `.claude/stages/frontend-impl.md`. Work in `packages/ui`, `apps/web` (and admin/mobile if in stack). |

**Cursor:** You can define rules or agents that open with "Read workflow.state.json; if stage is X, read .claude/stages/<role>.md and work only in …". Invoke the matching agent when you want to limit edits to that stage’s scope.

**Reviewer (optional):** After key stages (e.g. product_spec, architecture), run a short review: "Check spec/product/spec.md for completeness and consistency; output pass or list of gaps." Use the same chat or a separate Cursor agent with that instruction.

**Multi-agent orchestration:** This project uses [Superpowers](https://github.com/obra/superpowers) for agent discipline. For parallel subagent work across pipeline stages, use the `subagent-driven-development` Superpowers skill. For handoff between stages, use shared state in `workflow.state.json` and optional `workflow.context.json`. Document any custom multi-agent patterns in `docs/agents.md`.
