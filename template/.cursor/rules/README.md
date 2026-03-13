# Cursor rules for this project

**Read CLAUDE.md and workflow state first.**

Before editing code or specs:

1. Open **CLAUDE.md** — it defines the pipeline, stack, and file ownership.
2. Read **.claude/workflow.state.json** — it shows the current stage and completed stages. Do not skip stages or generate implementation before architecture is done.
3. Read **workflow.config.json** for the ordered pipeline (including optional and custom stages).
4. Read **stack.config.json** before generating code so you use the chosen frontend, backend, database, and styling.

This keeps Cursor behavior aligned with the Specification-First workflow described for Claude.
