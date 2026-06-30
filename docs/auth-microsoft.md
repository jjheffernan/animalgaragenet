# Microsoft OAuth (Azure / Entra ID via Supabase Auth)

Sign in with Microsoft work or personal accounts via Supabase Auth. The app uses `provider: 'azure'` in `signInWithOAuth` — Supabase maps this to Microsoft Entra ID (Azure AD) OIDC.

## Microsoft Entra app registration

1. Open [Microsoft Entra admin center](https://entra.microsoft.com/) → **Identity** → **Applications** → **App registrations** → **New registration**.
2. **Name**: e.g. `Animal Garage` (any label).
3. **Supported account types** — choose one:
   - **Accounts in any organizational directory and personal Microsoft accounts** — recommended for consumer + work sign-in (maps to Supabase “common” / multitenant).
   - **Accounts in this organizational directory only** — single-tenant; only users in your Entra tenant.
   - **Personal Microsoft accounts only** — consumer Outlook/Xbox/Live accounts.
4. **Redirect URI** — platform **Web**, URL:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```
   Replace `<project-ref>` with your Supabase project ref. The exact callback URL is shown in Supabase Dashboard → **Authentication** → **Providers** → **Azure**.
5. Register the app and note:
   - **Application (client) ID**
   - **Directory (tenant) ID** (for single-tenant setups)

### Client secret

1. App registration → **Certificates & secrets** → **New client secret**.
2. Copy the **Value** immediately (shown once).

### Redirect URI checklist (Entra)

Add only the Supabase Auth callback in Entra — not your SvelteKit `/auth/callback` URL:

| URI | Purpose |
|-----|---------|
| `https://<project-ref>.supabase.co/auth/v1/callback` | Required — Supabase OAuth broker |

Your app’s `/auth/callback` is configured in **Supabase** redirect URLs (see below), not in Entra.

## Tenant configuration

Supabase Azure provider accepts a **Azure Tenant URL** (optional). Behavior:

| Tenant URL | Entra setting | Who can sign in |
|------------|---------------|-----------------|
| *(empty)* or `https://login.microsoftonline.com/common` | Multitenant + personal | Work/school + personal Microsoft accounts |
| `https://login.microsoftonline.com/organizations` | Multitenant, org only | Any Azure AD work/school account |
| `https://login.microsoftonline.com/consumers` | Personal only | Outlook, Hotmail, Xbox, etc. |
| `https://login.microsoftonline.com/<tenant-id>` | Single tenant | Only users in your directory |

Match this to the **Supported account types** you chose at registration. Mismatch causes `AADSTS50020` or “account does not exist in tenant” errors.

The browser client passes `prompt: 'select_account'` for Azure so users can pick among signed-in Microsoft accounts.

## Supabase Dashboard

1. **Authentication** → **Providers** → **Azure** → Enable.
2. Paste **Application (client) ID** and **Secret** from Entra.
3. **Azure Tenant URL** — set per table above (leave default/common for most apps).
4. **Authentication** → **URL Configuration**:
   - **Site URL**: `https://animalgarage.net` (or `http://localhost:5173` for local)
   - **Redirect URLs**: add both:
     - `http://localhost:5173/auth/callback`
     - `https://animalgarage.net/auth/callback`

## Scopes

Supabase requests standard OIDC scopes (`openid`, `profile`, `email`) for Azure. That provides:

- Stable subject id (Supabase user id)
- Display name (`name` / `full_name` in `user_metadata`)
- Email (when present on the Microsoft account)

No custom Microsoft Graph scopes are required for basic sign-in.

## App behavior

| Piece | Location |
|-------|----------|
| Provider type | `src/lib/auth/oauth.ts` (`azure`) |
| Sign-in button | `src/routes/auth/sign-in/+page.svelte` |
| Sign-up button | `src/routes/auth/sign-up/+page.svelte` |
| Browser OAuth | `src/lib/supabase/auth-client.ts` → `signInWithOAuth('azure')` |
| Server OAuth | `src/lib/server/supabase/auth.ts` → `signInWithOAuth` / `exchangeOAuthCode` |
| Callback | `src/routes/auth/callback/+server.ts` |
| Display name | `oauthDisplayName()` + `mapSupabaseUser()` |

### Mock session label

Without Supabase keys, mock callback sets display name suffix `(Microsoft)`:

```
/auth/callback?provider=azure&mock=1&redirect=/account
```

Default mock email: `user@outlook.com`.

## Environment variables

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_SITE_URL=http://localhost:5173
```

Azure client ID and secret are stored in Supabase only — not in app env vars.

## Testing

### Mock flow (no Supabase keys)

1. `npm run dev`
2. Open `/auth/sign-in` or `/auth/sign-up`
3. Click **Continue with Microsoft**
4. Redirect to `/auth/callback?provider=azure&mock=1&redirect=...`
5. `/account` shows name like `user (Microsoft)`

Direct URL test:

```
http://localhost:5173/auth/callback?provider=azure&mock=1&redirect=/account
```

Optional custom email:

```
/auth/callback?provider=azure&mock=1&email=you@company.com&redirect=/account
```

### Live flow

1. Complete Entra app registration and Supabase Azure provider setup above.
2. Set env vars and restart dev server.
3. Click **Continue with Microsoft** → Microsoft sign-in → consent if prompted.
4. Redirect to `/auth/callback?code=...` → PKCE exchange via `exchangeCodeForSession`.
5. Confirm `/account` shows your Microsoft profile name and email.

## Checklist

- [ ] Entra app registration created
- [ ] Redirect URI `https://<ref>.supabase.co/auth/v1/callback` added in Entra
- [ ] Client secret created and copied
- [ ] Supported account types match intended audience (common vs single-tenant)
- [ ] Azure provider enabled in Supabase (Client ID, Secret, Tenant URL)
- [ ] Site URL and `/auth/callback` redirect URLs in Supabase
- [ ] `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_SITE_URL` set
- [ ] Mock sign-in works without keys (`user (Microsoft)` on account)
- [ ] Live sign-in completes and `/account` shows Microsoft profile

## Troubleshooting

| Error | Likely cause |
|-------|----------------|
| `AADSTS50011` redirect URI mismatch | Entra redirect URI must be Supabase callback, not app URL |
| `AADSTS50020` user not in tenant | Single-tenant app but user from another org; use `common` or correct tenant URL |
| Redirect to sign-in with error | Supabase redirect URLs missing `/auth/callback` for your origin |
| Blank name on account | Microsoft account has no display name; falls back to email local-part |

See also: [auth-oauth.md](./auth-oauth.md) for shared PKCE callback architecture.
