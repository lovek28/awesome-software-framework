# Workflow Instructions

This directory holds the workflow state machine for Specification-First Development.

## workflow.state.json

- **stage**: Current pipeline stage. Claude must work on this stage until it is complete.
- **idea**: The user's product idea (e.g. "Build a marketplace for freelancers").
- **completed**: Array of stages that have been finished. Claude adds the current stage here when done, then advances `stage` to the next in `workflow.config.json`.

## Pipeline Stages

See `workflow.config.json` for the ordered list. Stages are:

- idea → product_spec → domain_rules → ux_flow → ui_system → architecture → backend → frontend → tests

## Rules

1. Always read `workflow.state.json` before generating content.
2. Do not skip stages.
3. Do not generate backend, frontend, or test implementation until `architecture` is in `completed`.
4. After completing a stage, update the state file: append the completed stage to `completed` and set `stage` to the next stage in the pipeline.
