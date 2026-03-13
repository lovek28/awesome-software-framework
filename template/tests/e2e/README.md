# End-to-End Tests

Full stack tests through the browser or HTTP client.

## Role

- Test critical user flows from `spec/ux/flows.md`
- Run against running web app and API (or staged environment)
- Use a browser automation tool (e.g. Playwright) or HTTP client for API-only flows

## Implementation

Generated during the **tests** pipeline stage. Keep the set focused on happy paths and critical paths; avoid duplicating unit and integration coverage. Document how to run (e.g. start services, then run e2e suite).

## Location

Place in this directory. Configure playwright or similar in the project root or here. Clear docs for running and CI integration.
