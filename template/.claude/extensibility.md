# Extensibility

## Hooks

In `workflow.config.json`, add a `hooks` object:

```json
"hooks": {
  "before_backend": "npm run generate-types",
  "after_tests": "npm run audit"
}
```

Keys: `before_<stage>` or `after_<stage>` for any stage ID. Claude (or the user) runs the command from the project root when entering or leaving that stage. Use for codegen, lint, security audit, or notifications.

## Custom stages

Add stage IDs to the `pipeline` array and optionally to `stages` with a description. Example: add `"generate_docs"` after `tests` with description "Generate docs/ from spec". Claude runs custom stages in order like built-in ones.

## Plugin contract (draft)

A future plugin could: (1) add stages to the pipeline, (2) add stack options, or (3) inject files into the template. Contract: plugin declares a manifest (e.g. `plugin.json` with `stages`, `stackKeys`, `files`); the framework or project merges them. Not implemented yet; this is a placeholder for community extensions (e.g. Django backend, GraphQL API).
