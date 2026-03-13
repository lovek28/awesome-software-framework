# UI Package

Shared UI components and design system.

## Role

- Reusable components per `spec/ui/system.md`
- Styling per `stack.config.json` (e.g. Tailwind)
- Consumed by `apps/web`; no business logic or API calls inside components (presentational or with minimal, injectable data)

## Implementation

Generated during the **ui_system** (spec) and **frontend** (implementation) stages. Components should be product-agnostic where possible; app-specific screens stay in `apps/web`.

## Principles

- Accessible, consistent with design principles in spec
- Props-based API; avoid app-specific state in the package
- Document usage (e.g. Storybook or README) when the package grows
