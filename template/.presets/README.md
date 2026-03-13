# Presets

Presets reduce friction for common product shapes. Claude can detect the user’s intent (e.g. "Build a CRUD app for inventory") and apply a preset to pre-fill suggested stack and product snippet.

- **crud**: Single-resource CRUD (REST + simple UI).
- **auth-dashboard**: Auth (e.g. NextAuth + GitHub) and protected dashboard.
- **api-only**: REST API only, no web UI.

Projects can override with a local `project.preset.json` or choose no preset. See CLAUDE.md for how Claude applies presets.
