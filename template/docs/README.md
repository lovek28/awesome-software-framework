# Generated documentation

- **API docs**: When `spec/api/openapi.yaml` exists, serve or generate API documentation (e.g. Redoc, Swagger UI). Example: `npx redoc-cli bundle spec/api/openapi.yaml -o docs/api.html` or use a script. Document in project README how to view API docs locally or in CI.
- **Product overview**: From `spec/product/spec.md`, generate or copy a minimal `docs/product-overview.md` for stakeholders.
- **User flows**: From `spec/ux/flows.md`, generate or copy `docs/user-flows.md` for UX reference.

When spec changes, update these docs in the same pass so the system stays a single source of truth.
