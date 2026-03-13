# Workflow Instructions

This directory holds the workflow state machine for Specification-First Development.

## workflow.state.json

- **stage**: Current pipeline stage. Claude must work on this stage until it is complete.
- **idea**: The user's product idea (e.g. "Build a marketplace for freelancers").
- **completed**: Array of stages that have been finished. Claude adds the current stage here when done, then advances `stage` to the next in `workflow.config.json`.
- **mode** (optional): `"quick"` or `"full"`. Default `"full"`. In **quick** mode, merge or shorten stages (e.g. idea + product_spec in one pass, minimal UX/UI) to reach a running app faster. In **full** mode, run every stage with full rigor.

## workflow.config.json

- **pipeline**: Ordered list of stage IDs. Run stages in this order. Do not skip required stages.
- **optional**: Stage IDs that are optional (e.g. `tests`). For these, ask the user (e.g. "Do you want tests for this project?") or skip if not needed. Required stages remain enforced.
- **stages**: Optional map of stage ID to `{ "description": "...", "optional": true }`. Use each stage’s description as the prompt for what to do at that stage.
- **Custom stages**: A project may add extra stage IDs to `pipeline` (e.g. `docs`, `deploy_config`). When present, run them in order. For custom stages, either use a description in `stages` or a short convention (e.g. `docs` → generate or update files in `docs/` from spec). Document any project-specific custom stage behavior here or in the project README.
- **Hooks**: Optional `hooks` in `workflow.config.json` map stage lifecycle to commands, e.g. `"before_backend": "npm run generate-types"`, `"after_tests": "npm run audit"`. Keys: `before_<stage>` or `after_<stage>`. When entering or leaving a stage, run the hook command if present (from project root). Enables custom checks, codegen, or notifications without forking the framework.

## Checkpoints and resume

- At the end of each stage, optionally write a lightweight checkpoint to `.claude/checkpoints/<stage>.json` (e.g. `{ "stage": "product_spec", "outputs": ["spec/product/spec.md"], "completedAt": "ISO8601" }`). This allows **resume from stage X**: when the user says "resume from architecture", skip stages already in `completed` and only run from that stage. Read existing checkpoints to avoid redoing work.
- If the project has no `checkpoints` dir, creating it is optional; resume can still work from `workflow.state.json` and `completed` alone.

## Rules

1. Always read `workflow.state.json` before generating content.
2. Do not skip required stages. For optional stages (listed in `workflow.config.json` under `optional`), ask the user or skip.
3. Do not generate backend, frontend, or test implementation until `architecture` is in `completed`.
4. After completing a stage, update the state file: append the completed stage to `completed` and set `stage` to the next stage in the pipeline.
5. For custom stages in `pipeline`, execute them in order; if a stage has no built-in meaning, use the `stages` description or project convention.
6. **Quality gates:** Before advancing past **product_spec**, ensure `spec/product/spec.md` has Problem, Target Users, at least one Core Feature, and at least one Functional Requirement; if not, ask the user to fill gaps. Before **backend**, optionally check that `spec/architecture/backend.md` references entities from domain and data-model; if missing, ask for alignment.
