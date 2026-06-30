# Discord OAuth (Supabase Auth)

Sign in with Discord via Supabase Auth. The app uses `provider: 'discord'` in `signInWithOAuth` and maps the Discord username to the profile display name on first login.

## Discord Developer Portal

1. Open [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**.
2. **OAuth2** → **Redirects** — add your Supabase callback URL:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```
   Find the exact URL in Supabase Dashboard → **Authentication** → **Providers** → **Discord** (shown as “Callback URL”).
3. Copy **Client ID** and **Client Secret** from OAuth2.

### Local / preview sites

Supabase always redirects through the project callback above. For local dev, use the same Supabase project URL; set `PUBLIC_SITE_URL` (e.g. `http://localhost:5173`) so the app redirects back to `/auth/callback` after Supabase finishes the exchange.

## Supabase Dashboard

1. **Authentication** → **Providers** → **Discord** → Enable.
2. Paste **Client ID** and **Client Secret** from Discord.
3. **Authentication** → **URL Configuration**:
   - **Site URL**: `https://<your-site-host>` (or `http://localhost:5173` for local)
   - **Redirect URLs**: add `http://localhost:5173/auth/callback` and production `https://<your-site-host>/auth/callback`

## Scopes

Supabase requests Discord OAuth with `identify` and `email` by default. That is enough for:

- Discord user id (stable account link)
- Username (`user_name` in `user_metadata`)
- Email (when the user grants it)

No extra scopes are required for basic sign-in.

## App behavior

| Piece | Location |
|-------|----------|
| Provider type | `src/lib/auth/oauth-providers.ts` (`discord`) |
| Sign-in button | `src/routes/auth/sign-in/+page.svelte` |
| Sign-up button | `src/routes/auth/sign-up/+page.svelte` |
| Browser OAuth | `src/lib/supabase/auth-client.ts` → `signInWithOAuth({ provider: 'discord' })` |
| Callback | `src/routes/auth/callback/+server.ts` |
| Display name | `discordDisplayName()` in `oauth-providers.ts`; used in `mapSupabaseUser()` |

### Display name on first login

After Discord OAuth, Supabase stores profile fields in `user.user_metadata`. The app prefers:

1. `user_name` (Discord username)
2. `preferred_username`
3. `full_name` / `name`
4. Email local-part fallback

`mapSupabaseUser()` in `src/lib/server/supabase/auth.ts` applies this automatically for live sessions. No separate database hook is required unless you want to sync into a custom `profiles` table.

## Environment variables

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_SITE_URL=http://localhost:5173
```

## Testing

### Mock flow (no Supabase keys)

1. `npm run dev`
2. Open `/auth/sign-in`
3. Click **Continue with Discord**
4. You land on `/auth/callback?provider=discord&mock=1&redirect=...` and get a mock session.

Optional: set a custom mock username:

```
/auth/callback?provider=discord&mock=1&username=GearHead&redirect=/account
```

Account page should show display name `GearHead` (not `user (Discord)`).

### Live flow

1. Configure Discord + Supabase as above.
2. Set env vars and restart dev server.
3. Click **Continue with Discord** → Discord consent → redirect to `/auth/callback?code=...`.
4. Callback exchanges the code via `exchangeCodeForSession`; session cookies are set by `@supabase/ssr`.
5. Confirm `/account` shows your Discord username.

## Checklist

- [ ] Discord application created
- [ ] Redirect URI `https://<ref>.supabase.co/auth/v1/callback` added in Discord
- [ ] Discord provider enabled in Supabase with Client ID + Secret
- [ ] Site URL and `/auth/callback` redirect URLs in Supabase
- [ ] `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_SITE_URL` set
- [ ] Mock sign-in works without keys
- [ ] Live sign-in returns Discord username on `/account`
