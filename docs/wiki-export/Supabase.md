# Supabase

Auth, content metadata, and form storage. **Not** commerce — Saleor owns product inventory.

Uses `@supabase/ssr` for cookie sessions (server) and `@supabase/supabase-js` (browser).

## Environment

| Variable                    | Scope           | Purpose                                |
| --------------------------- | --------------- | -------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Public          | Project API URL                        |
| `PUBLIC_SUPABASE_ANON_KEY`  | Public          | Anon key — RLS-protected               |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS — never in client bundles |

Without env vars, auth falls back to mock `ag-session` cookie.

## Migrations

SQL migrations live in `supabase/migrations/`.

```bash
supabase link --project-ref <your-ref>   # remote
supabase db push                         # apply migrations
# or: supabase migration up              # local stack
```

Initial profiles pattern: `supabase/migrations/20260629120000_initial_profiles.sql`.

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
| `src/lib/server/supabase/client.ts` | `createServerClient(event)` — SSR cookie client          |
| `src/lib/server/supabase/admin.ts`  | `createAdminClient()` — service role                     |
| `src/lib/server/supabase/auth.ts`   | `getSession`, `signInWithOtp`, `signOut`, mock fallbacks |
| `src/lib/server/auth/local-dev.ts`  | Local dev auth guards                                    |
| `src/lib/supabase/browser.ts`       | Browser singleton                                        |
| `src/hooks.server.ts`               | Session refresh, admin guard, site lockdown              |
| `scripts/promote-admin.ts`          | CLI to set `app_metadata.role`                           |

`event.locals.supabase` available in server loads/actions when configured. `event.locals.session` is app-shaped user (`id`, `email`, `name`, `role`).

## Service role — server only

```typescript
// src/lib/server/supabase/admin.ts — OK
import { createAdminClient } from '$lib/server/supabase/admin';

// NEVER in client components or $lib/supabase/browser.ts
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
