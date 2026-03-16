# Presets

Presets reduce friction for common product shapes. Claude can detect the user’s intent (e.g. "Build a CRUD app for inventory") and apply a preset to pre-fill suggested stack and product snippet.

| Preset | Description | Skips |
|--------|-------------|-------|
| **crud** | Single-resource CRUD (REST + simple UI). | — |
| **auth-dashboard** | Auth (e.g. NextAuth + GitHub) and protected dashboard. | — |
| **api-only** | REST API only, no web UI. Sets `frontend: "none"`. | `ux_flow`, `ui_system`, `frontend` |
| **frontend-only** | Frontend app consuming an external API. Sets `backend: "none"`, `database: "none"`. | `domain_rules`, `backend`, `api_contract` |

Each preset defines a `stagesInScope` list — Claude runs only those stages and skips the rest. Projects can override with a local `project.preset.json` or choose no preset. See CLAUDE.md for how Claude applies presets.
