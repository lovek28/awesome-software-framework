# UI System

> Reusable UI components and design principles. Align with `stack.config.json` (e.g. Tailwind, component library).

## Design Principles

- **Consistency**: Use the same patterns for similar actions and content.
- **Hierarchy**: Clear visual hierarchy for headings, body, and actions.
- **Feedback**: Loading, success, and error states per `spec/ux/states.md`.
- **Accessibility**: Semantic HTML, focus management, and sufficient contrast.

## Component Categories

### Layout

- Page shell (header, main, footer)
- Containers and grid
- Sidebar / navigation

### Navigation

- Top nav / app bar
- Side nav
- Breadcrumbs
- Tabs

### Forms

- Input (text, number, email, etc.)
- Select, checkbox, radio
- Date/time picker
- Validation and error display
- Submit / secondary actions

### Data Display

- Tables (sortable, filterable)
- Cards
- Lists
- Badges and tags

### Feedback

- Buttons (primary, secondary, danger)
- Alerts and toasts
- Modals and dialogs
- Loading and skeleton

## Styling

Follow the stack in `stack.config.json` (e.g. Tailwind). Define:

- Colors (primary, secondary, semantic)
- Typography scale
- Spacing scale
- Breakpoints for responsive layout

## Implementation Location

UI components live in `packages/ui`. Apps in `apps/web` consume them. Keep product-agnostic primitives in the package; app-specific screens in the app.
