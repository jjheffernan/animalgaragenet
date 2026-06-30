# Authentication

Supabase Auth with `@supabase/ssr` cookie sessions. Mock fallback when env vars are unset.

## Environment variables

| Variable                    | Scope       | Purpose                                |
| --------------------------- | ----------- | -------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Public      | Project API URL                        |
| `PUBLIC_SUPABASE_ANON_KEY`  | Public      | Anon key — safe in browser with RLS    |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS; never in client bundles  |
| `PUBLIC_SITE_URL`           | Public      | Magic-link and OAuth redirect URLs     |
| `DEV_ADMIN`                 | Server only | Admin bypass on **localhost only**     |
| `LOCAL_DEV_AUTH`            | Server only | Quick-login buttons on `/auth/sign-in` |
| `SITE_LOCKED`               | Server only | Production preview lockdown            |

When `PUBLIC_SUPABASE_URL` or `PUBLIC_SUPABASE_ANON_KEY` is unset, the site uses a mock `ag-session` cookie.

## Local development

### Without Supabase

```bash
npm run dev
```

- OAuth buttons use a mock callback when Supabase is unset (local dev only).

### With Supabase

1. Create a project at [supabase.com](https://supabase.com) or run `supabase start`.
2. Set env vars in `.env`.
3. Dashboard → **Authentication** → **URL configuration**:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/auth/callback`
4. Enable Email provider (magic link / OTP).
5. Apply migrations:

   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```

### Local dev quick login

On `localhost` with `npm run dev` (or `LOCAL_DEV_AUTH=true`), `/auth/sign-in` shows quick-login buttons.

Predefined accounts in `src/lib/server/auth/local-dev-accounts.ts`:

| Email                | Role     |
| -------------------- | -------- |
| `admin@local.dev`    | admin    |
| `editor@local.dev`   | editor   |
| `customer@local.dev` | customer |

- **Without Supabase:** sets mock `ag-session` cookie with the chosen role.
- **With Supabase:** requires `SUPABASE_SERVICE_ROLE_KEY`; upserts user with `app_metadata.role` and signs in via server-side OTP.

Guard logic: `src/lib/server/auth/local-dev.ts` (`isLocalDevAuthEnabled`, `isDevAdminEnabled`).

Disabled on production hostnames (custom domain and hosting preview URLs) and anywhere except localhost.

## Production admin

Real admin access uses `auth.users.raw_app_meta_data.role` — **not** `DEV_ADMIN`.

```bash
npx tsx --env-file=.env scripts/promote-admin.ts you@email.com admin
```

Roles: `admin`, `editor`, `contributor`, `customer`.

User must sign out and back in (or wait for JWT refresh) for `app_metadata.role` to appear in session.

## Site lockdown (`SITE_LOCKED=true`)

- Public routes redirect to `/locked`.
- Exempt: `/auth/*`, `/admin/*`, `/locked`, `/_app/*`, static assets.
- Users with `admin` or `editor` role pass through.
- `DEV_ADMIN` only works on localhost — never in production.

## Account dropdown

When signed in, `Header.svelte` shows `AccountMenu.svelte` instead of a plain Account link.

Dropdown links (`src/lib/components/AccountMenu.svelte`):

| Label             | Route                 |
| ----------------- | --------------------- |
| Dashboard         | `/account`            |
| Redeem            | `/account/redeem`     |
| Loyalty & Balance | `/loyalty`            |
| Build Logs        | `/account/builds`     |
| Sign out          | `POST /auth/sign-out` |

## Code layout

| Path                                  | Role                                        |
| ------------------------------------- | ------------------------------------------- |
| `src/lib/server/supabase/client.ts`   | SSR cookie client                           |
| `src/lib/server/supabase/admin.ts`    | Service role client (server only)           |
| `src/lib/server/supabase/auth.ts`     | Session helpers, mock fallbacks             |
| `src/lib/supabase/browser.ts`         | Browser singleton                           |
| `src/hooks.server.ts`                 | Session refresh, admin guard, site lockdown |
| `src/routes/auth/callback/+server.ts` | PKCE code exchange                          |
| `scripts/promote-admin.ts`            | CLI to set `app_metadata.role`              |

## OAuth

Google, Discord, Microsoft via Supabase Auth PKCE. Without Supabase env, OAuth falls back to mock callback.

Enable providers in Supabase Dashboard → **Authentication** → **Providers**.

## Critical rules

- **Never** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify/production.
- Never use `user_metadata` for authorization — set roles with service role or `promote-admin.ts` only.
- Service role key only in `src/lib/server/**`.
