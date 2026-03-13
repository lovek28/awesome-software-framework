# Security Checklist

> **Claude:** Fill during product_spec or a dedicated pass. Use this during backend/frontend implementation. OWASP-oriented.

## Authentication & Authorization

- [ ] Auth method (e.g. JWT, session, OAuth) and where it is validated (middleware, per-route).
- [ ] No auth bypass for protected routes; role/permission checks where needed.
- [ ] Secrets (e.g. `JWT_SECRET`, `AUTH_CLIENT_SECRET`) in env only; never committed.

## Input & Output

- [ ] Input validation on all user-controlled data (body, query, params, headers where relevant).
- [ ] Output encoding / parameterized queries to prevent injection (SQL, XSS, command).
- [ ] File upload: type/size limits, safe storage path, no execution of uploaded content.

## Transport & Configuration

- [ ] HTTPS in production; no sensitive data over plain HTTP.
- [ ] CORS and security headers (e.g. CSP, X-Frame-Options) configured for frontend.
- [ ] No hardcoded secrets, API keys, or credentials in code or specs.

## Session & CSRF

- [ ] Session handling secure (httpOnly, secure cookies where applicable).
- [ ] CSRF protection for state-changing requests (tokens or same-site).

## Compliance (optional)

- [ ] GDPR / privacy: consent, data retention, right to deletion (if applicable).
- [ ] Audit logging for sensitive actions (if required).

---

*Reference: [OWASP Top 10](https://owasp.org/www-project-top-ten/). Update this checklist as the product evolves.*
