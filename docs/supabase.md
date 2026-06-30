# Supabase

Auth, content metadata, and form storage for Animal Garage. The SvelteKit app uses `@supabase/ssr` for cookie-based sessions on the server and `@supabase/supabase-js` in the browser.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Scope | Purpose |
|----------|-------|---------|
| `PUBLIC_SUPABASE_URL` | Public | Project API URL (`https://<ref>.supabase.co`) |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | Publishable/anon key — safe in browser with RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS; never expose to client bundles |

Optional:

| Variable | Purpose |
|----------|---------|
| `DEV_ADMIN` | `true` bypasses admin role check in development |
| `PUBLIC_SITE_URL` | Used for magic-link and OAuth redirect URLs (default `http://localhost:5173`) |

When `PUBLIC_SUPABASE_URL` or `PUBLIC_SUPABASE_ANON_KEY` is unset, the site uses a **mock session** (`ag-session` cookie) so local development works without a Supabase project.

## Local development

### Without Supabase

```bash
npm run dev
```

Sign-in/sign-up create a mock `ag-session` cookie immediately. OAuth buttons use the mock callback (`?mock=1`).

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

## Code layout

| Path | Role |
|------|------|
| `src/lib/server/supabase/client.ts` | `createServerClient(event)` — SSR cookie client |
| `src/lib/server/supabase/admin.ts` | `createAdminClient()` — service role, server only |
| `src/lib/server/supabase/auth.ts` | `getSession`, `signInWithOtp`, `signOut`, mock fallbacks |
| `src/lib/supabase/browser.ts` | Browser singleton client |
| `src/hooks.server.ts` | Creates per-request client, refreshes session |
| `src/routes/auth/callback/+server.ts` | PKCE code exchange for magic links |
| `supabase/migrations/` | SQL migrations (RLS on all public tables) |

`event.locals.supabase` is available in server loads and actions when configured. `event.locals.session` is the app-shaped user (`id`, `email`, `name`, `role`).

## Roles and RLS

- **Authorization roles** (`admin`, `editor`, `contributor`, `customer`) are read from `auth.users.raw_app_meta_data.role`.
- Never use `user_metadata` for authorization — users can edit it. Set roles with the **service role** key or a trusted server job only.
- All tables in `public` must have **RLS enabled** with explicit policies. See `supabase/migrations/20260629120000_initial_profiles.sql` for the profiles pattern.
- The **service role** key bypasses RLS — use only in `src/lib/server/**` (e.g. `createAdminClient()`), never in `$lib/supabase/browser.ts` or client components.

## OAuth (in progress)

Google / Discord / Microsoft buttons are stubbed. Browser OAuth starts via `src/lib/supabase/auth-client.ts`; callback exchange in `src/routes/auth/callback/+server.ts` still needs provider-specific wiring by the OAuth agent.

## Testing

```bash
npm run build
npm run test:unit
```

With env unset, existing flows use mock auth. With env set, test magic link against a real project or local Supabase.
