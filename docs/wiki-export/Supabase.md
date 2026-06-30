# Supabase

Auth, content metadata, and form storage. **Not** commerce — Saleor owns product inventory.

Uses `@supabase/ssr` for cookie sessions on the server only (anon key is not exposed to the browser).

## Environment

Netlify Supabase integration sets these automatically:

| Variable                    | Scope           | Purpose                                                       |
| --------------------------- | --------------- | ------------------------------------------------------------- |
| `SUPABASE_DATABASE_URL`     | **Server only** | Postgres connection string — REST API URL derived in app code |
| `SUPABASE_ANON_KEY`         | **Server only** | Anon key — SSR auth client only                               |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS — never in client bundles                        |
| `SUPABASE_JWT_SECRET`       | **Server only** | Optional — not used by app code today                         |

Local dev with `supabase start`: optional `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` when `DATABASE_URL` has no project ref.

Without `SUPABASE_DATABASE_URL` + `SUPABASE_ANON_KEY`, auth falls back to mock `ag-session` cookie (localhost only; blocked on production hostnames).

## Migrations

SQL migrations live in `supabase/migrations/` (5 squashed files).

```bash
supabase link --project-ref <your-ref>
supabase db reset --linked   # first deploy — wipes remote and replays all migrations
# or: supabase db push        # empty remote with no prior history
supabase migration list      # expect 5 applied
```

All tables in `public` must have **RLS enabled** with explicit policies.

## Roles and RLS

Authorization roles (`admin`, `editor`, `contributor`, `customer`) are read from `auth.users.raw_app_meta_data.role`.

- Never use `user_metadata` for authorization — users can edit it.
- Set roles with service role key or `scripts/promote-admin.ts` only.
- Anon key + RLS for user-facing operations.
- Service role bypasses RLS — use only in `src/lib/server/**`.

## Repositories (server writes)

| Table               | Repository                                    | AuthZ                                   |
| ------------------- | --------------------------------------------- | --------------------------------------- |
| `build_submissions` | `build-logs/repository.ts`, `forms/submit.ts` | `user_id` from session only             |
| `testimonials`      | `testimonials/repository.ts`                  | `user_id` from session; admin moderates |
| `profiles`          | migration                                     | RLS per migration                       |

Insert columns use snake_case (`user_id`, `mod_list`, `status`).

## Code layout

| Path                                | Role                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `src/lib/server/supabase/env.ts`    | Derives API URL from `SUPABASE_DATABASE_URL`             |
| `src/lib/server/supabase/client.ts` | `createServerClient(event)` — SSR cookie client          |
| `src/lib/server/supabase/admin.ts`  | `createAdminClient()` — service role                     |
| `src/lib/server/supabase/auth.ts`   | `getSession`, `signInWithOtp`, `signOut`, mock fallbacks |
| `src/lib/server/auth/oauth-action.ts` | Server-side OAuth redirect (no browser anon key)       |
| `src/lib/server/auth/local-dev.ts`  | Local dev auth guards                                    |
| `src/hooks.server.ts`               | Session refresh, admin guard, site lockdown              |
| `scripts/promote-admin.ts`          | CLI to set `app_metadata.role`                           |

`event.locals.supabase` available in server loads/actions when configured. `event.locals.session` is app-shaped user (`id`, `email`, `name`, `role`).

## Service role — server only

```typescript
// src/lib/server/supabase/admin.ts — OK
import { createAdminClient } from '$lib/server/supabase/admin';

// NEVER in client components
```

## Local / production auth

See [Authentication](Authentication) for quick-login, `DEV_ADMIN`, `SITE_LOCKED`, and `promote-admin.ts`.

## Do not

- Store product inventory in Supabase
- Import supabase admin client in client components
- Commit real Supabase keys
- Set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on production

## Testing

```bash
npm run test:unit        # repository.test.ts, auth tests
npm run test:readiness   # supabase-auth + supabase-db probes (skip when env unset)
```
