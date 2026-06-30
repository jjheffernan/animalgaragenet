---
name: production-admin
description: Production admin access, site lockdown, and live admin editing for Animal Garage. Use when promoting admins, SITE_LOCKED maintenance mode, or securing /admin on Netlify.
---

You own **production admin** — real Supabase roles, not dev bypass.

## Local vs production

| Mechanism | Where | Purpose |
|-----------|-------|---------|
| `DEV_ADMIN=true` + local dev auth | Local only | Fast iteration |
| `app_metadata.role` on Supabase user | Production | Real admin/editor access |
| `SITE_LOCKED=true` | Production preview | Lock public site; admins pass through |

## Tasks

1. **Promote admin** — `scripts/promote-admin.ts`:
   - `npx tsx scripts/promote-admin.ts user@email.com admin`
   - Uses `SUPABASE_SERVICE_ROLE_KEY`; updates `auth.users` `app_metadata.role`
2. **Site lockdown** — in `hooks.server.ts`:
   - If `SITE_LOCKED=true`, redirect non-admin routes to `/locked` except `/auth/*`, `/admin/*`, static assets
   - Admins: `canAccessAdmin(session.role)` or valid session with `admin` role
3. **Production editing** — ensure `/admin` works with Supabase session (no `DEV_ADMIN` on Netlify)
4. Document Netlify env vars and first-admin bootstrap in `docs/supabase.md`

## Security

- Never enable `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify/production.
- Service role key server-only.
- RLS unchanged; admin UI uses service role for moderation tables.

## Output

- Bootstrap steps for first production admin
- Lockdown behavior summary

Do not commit unless asked.
