# Supabase

Auth, content metadata, and form storage for Animal Garage. The SvelteKit app uses `@supabase/ssr` for cookie-based sessions on the server and `@supabase/supabase-js` in the browser.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Scope | Purpose |
|----------|-------|---------|
| `PUBLIC_SUPABASE_URL` | Public | Project API URL (`https://<ref>.supabase.co`) |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | Publishable/anon key — safe in browser with RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS; never expose to client bundles |

Optional (local dev):

| Variable | Purpose |
|----------|---------|
| `DEV_ADMIN` | `true` bypasses admin role check on **localhost only** — ignored on production hostnames |
| `LOCAL_DEV_AUTH` | `true` enables quick-login buttons on `/auth/sign-in` (localhost only) |
| `PUBLIC_SITE_URL` | Magic-link and OAuth redirect URLs (default `http://localhost:5173`) |

Production only:

| Variable | Purpose |
|----------|---------|
| `SITE_LOCKED` | `true` redirects non-admins to `/locked` (allows `/auth/*`, `/admin/*`, static assets) |

When `PUBLIC_SUPABASE_URL` or `PUBLIC_SUPABASE_ANON_KEY` is unset, the site uses a **mock session** (`ag-session` cookie) so local development works without a Supabase project.

**Never** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify/production.

## Local development

### Without Supabase

```bash
npm run dev
```

Sign-in/sign-up create a mock `ag-session` cookie immediately. OAuth buttons use the mock callback (`(mock dev flow)`).

### With Supabase

1. Create a project at [supabase.com](https://supabase.com) or run `supabase start` for local stack.
2. Set env vars in `.env`.
3. In Supabase Dashboard → **Authentication** → **URL configuration**:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/auth/callback`
4. Enable Email provider (magic link / OTP).
5. Apply migrations:

   ```bash
   supabase link --project-ref <your-ref>   # remote
   supabase db push                         # or: supabase migration up
   ```

6. `npm run dev` — magic link sends email; clicking the link hits `/auth/callback?code=...` and establishes a session.

### Local dev quick login

On `localhost` with `npm run dev` (or `LOCAL_DEV_AUTH=true`), `/auth/sign-in` shows quick-login buttons:

| Account | Role |
|---------|------|
| `admin@local.dev` | admin |
| `editor@local.dev` | editor |
| `customer@local.dev` | customer |

- **Without Supabase:** sets mock `ag-session` cookie with the correct role.
- **With Supabase:** requires `SUPABASE_SERVICE_ROLE_KEY`; upserts the user with `app_metadata.role` and signs in via server-side OTP verify.

Disabled when `PUBLIC_SITE_URL` points at a production host or the request host is not localhost.

## Production admin bootstrap

Real admin access uses `auth.users.raw_app_meta_data.role` — not `DEV_ADMIN`.

1. User signs up or receives a magic link on production (`https://<your-site-host>`).
2. Promote their role with the service role CLI:

   ```bash
   npx tsx --env-file=.env scripts/promote-admin.ts you@email.com admin
   ```

   Roles: `admin`, `editor`, `contributor`, `customer`.

3. User signs out and back in (or wait for JWT refresh) so `app_metadata.role` is reflected in session.

### Netlify env vars

Set in Site settings → Environment variables:

- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SITE_URL=https://<your-site-host>`
- `SITE_LOCKED=true` (optional, during preview/maintenance)

Do **not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH`.

### Site lockdown

When `SITE_LOCKED=true`:

- Public routes redirect to `/locked`.
- Exempt: `/auth/*`, `/admin/*`, `/locked`, `/_app/*`, static assets.
- Users with `admin` or `editor` role (or `DEV_ADMIN` on localhost) pass through.

## Code layout

| Path | Role |
|------|------|
| `src/lib/server/supabase/client.ts` | `createServerClient(event)` — SSR cookie client |
| `src/lib/server/supabase/admin.ts` | `createAdminClient()` — service role, server only |
| `src/lib/server/supabase/auth.ts` | `getSession`, `signInWithOtp`, `signOut`, mock fallbacks |
| `src/lib/server/auth/local-dev.ts` | `isLocalDevAuthEnabled`, `devSignInAccount` |
| `src/lib/server/auth/local-dev-accounts.ts` | Predefined local dev accounts |
| `src/lib/supabase/browser.ts` | Browser singleton client |
| `src/hooks.server.ts` | Session refresh, admin guard, site lockdown |
| `src/routes/auth/callback/+server.ts` | PKCE code exchange for magic links / OAuth |
| `scripts/promote-admin.ts` | CLI to set `app_metadata.role` |
| `supabase/migrations/` | SQL migrations (RLS on all public tables) |

`event.locals.supabase` is available in server loads and actions when configured. `event.locals.session` is the app-shaped user (`id`, `email`, `name`, `role`).

## Roles and RLS

- **Authorization roles** (`admin`, `editor`, `contributor`, `customer`) are read from `auth.users.raw_app_meta_data.role`.
- Never use `user_metadata` for authorization — users can edit it. Set roles with the **service role** key or `scripts/promote-admin.ts` only.
- All tables in `public` must have **RLS enabled** with explicit policies. See `supabase/migrations/20260629120000_initial_profiles.sql` for the profiles pattern.
- The **service role** key bypasses RLS — use only in `src/lib/server/**` (e.g. `createAdminClient()`), never in `$lib/supabase/browser.ts` or client components.

## OAuth

Google, Discord, and Microsoft (Azure) sign-in is wired via Supabase Auth PKCE. Without Supabase env vars, OAuth buttons fall back to a mock callback (`(mock dev flow)`).

| Concern | Location |
|---------|----------|
| Provider types | `src/lib/auth/oauth.ts` |
| Browser `signInWithOAuth` | `src/lib/supabase/auth-client.ts` |
| Callback `exchangeOAuthCode` | `src/routes/auth/callback/+server.ts` |
| Provider dashboard setup | [oauth.md](../auth/oauth.md), [discord.md](../auth/discord.md), [microsoft.md](../auth/microsoft.md) |

Enable each provider in Supabase Dashboard → **Authentication** → **Providers** with the IdP client ID/secret.

## Media uploads

See [plans/active/media-uploads.md](../plans/active/media-uploads.md) for the Supabase Storage v1 plan and testimonial media schema.

## Testing

```bash
npm run build
npm run test:unit
```

With env unset, existing flows use mock auth. With env set, test magic link against a real project or local Supabase.
