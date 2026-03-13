# Mobile App (optional)

When `stack.config.json` has `mobile` (e.g. `"mobile": "expo"`), this app is the mobile client. It consumes the same `apps/api` and shared packages. Pipeline runs a frontend/mobile stage per architecture; implement per stack choice (e.g. Expo, React Native).

## Role

- Mobile-specific UX; same API contract as web.
- Shared domain and services; app-specific UI and navigation.
