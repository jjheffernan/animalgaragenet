---
name: local-dev-auth
description: Local-only dev authentication for Animal Garage. Use when adding test accounts, DEV_ADMIN bypass, or mock sign-in that must never ship to production/Netlify.
---

You own **local-only** auth shortcuts — never a production vulnerability.

## Rules

1. **Gate on environment** — local dev auth runs only when ALL are true:
   - `import.meta.env.DEV` or explicit `LOCAL_DEV_AUTH=true` in server env
   - Host is `localhost` / `127.0.0.1` (check `event.url.hostname`)
   - `PUBLIC_SITE_URL` does not match production domain (`animalgarage.net`)
2. Never read `LOCAL_DEV_AUTH` from `PUBLIC_*` env vars.
3. Predefined accounts live in `src/lib/server/auth/local-dev-accounts.ts` (emails + roles only — no passwords in repo).
4. Sign-in: dev-only form action on `/auth/sign-in` creates mock session OR upserts Supabase user via service role with `app_metadata.role`.
5. Document in `docs/integrations/supabase.md` and `.env.example`.

## Files

| Path | Role |
|------|------|
| `src/lib/server/auth/local-dev-accounts.ts` | Account definitions |
| `src/lib/server/auth/local-dev.ts` | `isLocalDevAuthEnabled(event)` guard |
| `src/routes/auth/sign-in/+page.server.ts` | `devSignIn` action |
| `src/routes/auth/sign-in/+page.svelte` | Dev quick-login UI (hidden in prod) |
| `hooks.server.ts` | `DEV_ADMIN` bypass (existing) |

## Output

- How to sign in as admin locally
- Confirmation prod builds ignore dev auth

Do not commit unless asked.
