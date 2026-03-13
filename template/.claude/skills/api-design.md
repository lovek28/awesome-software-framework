# Skill: API design (stage: architecture / api_contract)

**When:** Writing spec/architecture/backend.md or spec/api/openapi.yaml. Apply during architecture or api_contract stage.

**What to do:**
- REST: use nouns for resources, HTTP methods for actions. Version with path (e.g. `/api/v1/`) or header. Document success and error responses (4xx, 5xx).
- OpenAPI: define paths, request/response schemas, and (if needed) security schemes. Derive from domain entities and data-model. Keep backend and frontend in sync with this contract.
- Errors: consistent format (e.g. code, message, details). Use appropriate status codes (400 validation, 401/403 auth, 404 not found, 500 server).
- Avoid breaking changes to existing endpoints; add new versions or fields when evolving.

**Constraints:** Align with spec/domain and spec/ux flows. No implementation code in the spec.
