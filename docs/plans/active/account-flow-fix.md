# Account flow fix — Netlify + Supabase

**Status:** Partial — code hardening done; Netlify/Supabase ops remain

**Priority:** P0 (blocks loyalty, account menu, admin, UGC submissions)  
**Production symptom:** Header shows “Sign In” on https://<your-preview-host> even after users attempt magic link / OAuth. `/account` and `/loyalty` gate correctly but session never persists.

**Audit date:** 2026-06-30

---

## Root cause hypotheses (ranked)

1. **Supabase env vars not set on Netlify** — `hooks.server.ts` falls back to `ag-session` mock cookie path only when keys are missing; sign-in page still renders OAuth buttons but server actions may use mock or fail silently.
2. **`PUBLIC_SITE_URL` mismatch** — When `PUBLIC_SITE_URL` does not match the browsed host and the request origin is not in the allowlist, magic link and OAuth callbacks may land on the wrong host. **Mitigation (code):** `callback-url.ts` prefers `event.url.origin` when allowed; `PUBLIC_SITE_URL` remains the fallback and allowlist anchor.
3. **Supabase redirect URL allowlist** — Callback `https://<your-preview-host>/auth/callback` not added in Supabase dashboard → `exchangeOAuthCode` / magic link verify fails.
4. **No admin bootstrap** — Even with working auth, `/admin` requires `app_metadata.role` of `admin` or `editor` via `promote-admin.ts`.

---

## Architecture (current)

```
Request → hooks.server.ts
            ├─ isSupabaseConfigured() ?
            │     ├─ yes → createServerClient(event) → getSession() via JWT
            │     └─ no  → parseSessionCookie('ag-session')  ← mock fallback
            └─ event.locals.session → +layout.server.ts → Header.svelte

Sign-in POST → sign-in/+page.server.ts
            ├─ supabase → signInWithOtp(emailRedirectTo: buildAuthCallbackUrl(event.url.origin))
            └─ no supabase → createMockUser + setSessionCookie(ag-session)

OAuth → /auth/callback?code=...
            ├─ exchangeOAuthCode(supabase, code)
            └─ redirect to ?redirect= param
```

**Key files**

| File                                      | Role                                                     |
| ----------------------------------------- | -------------------------------------------------------- |
| `src/hooks.server.ts`                     | Session hydration every request                          |
| `src/lib/config/env.ts`                   | `PUBLIC_SITE_URL` default `http://localhost:5173`        |
| `src/routes/auth/sign-in/+page.server.ts` | Magic link / OAuth redirect via `buildAuthCallbackUrl()` |
| `src/lib/server/auth/callback-url.ts`    | Request-origin allowlist + callback URL builder          |
| `src/routes/auth/callback/+server.ts`     | PKCE code exchange                                       |
| `src/lib/components/Header.svelte`        | `session = $page.data.session` → Account menu vs Sign In |
| `src/routes/account/+layout.server.ts`    | Redirect if `!locals.session`                            |

---

## Fix plan

### 1. Netlify environment variables

Set in **Site settings → Environment variables** (all deploy contexts that serve users):

| Variable                    | Value (staging)               | Notes                                                  |
| --------------------------- | ----------------------------- | ------------------------------------------------------ |
| `PUBLIC_SUPABASE_URL`       | `https://<ref>.supabase.co`   | From Supabase → Settings → API                         |
| `PUBLIC_SUPABASE_ANON_KEY`  | `<from-dashboard>`            | Publishable key — safe in client                       |
| `SUPABASE_SERVICE_ROLE_KEY` | `<from-dashboard>`            | **Server only** — scopes: all                          |
| `PUBLIC_SITE_URL`           | `https://<your-preview-host>` | **Must match browser URL** until custom domain cutover |

**Do not set:** `DEV_ADMIN`, `LOCAL_DEV_AUTH`

**At custom domain cutover:** Change `PUBLIC_SITE_URL` to `https://<your-site-host>` and redeploy.

### 2. Supabase redirect URLs

In **Supabase Dashboard → Authentication → URL configuration**:

| Setting       | Value                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| Site URL      | `https://<your-preview-host>` (update to `https://<your-site-host>` at cutover) |
| Redirect URLs | Add **both**:                                                                   |
|               | `https://<your-preview-host>/auth/callback`                                     |
|               | `https://<your-site-host>/auth/callback`                                        |
|               | `http://localhost:5173/auth/callback` (local dev)                               |

Enable **Email** provider (magic link / OTP).

For OAuth (Google, Discord, Azure): enable each provider in Supabase → Authentication → Providers. IdP redirect URIs must point to Supabase's callback URL (documented in `docs/auth/oauth.md`).

### 3. Cookie domain / SSR session refresh

The app uses `@supabase/ssr` cookie adapter in `createServerClient()`:

```ts
cookies: {
  getAll: () => event.cookies.getAll(),
  setAll: (cookiesToSet) => {
    cookiesToSet.forEach(({ name, value, options }) => {
      event.cookies.set(name, value, { ...options, path: '/' });
    });
  }
}
```

**No custom cookie domain is set** — cookies bind to the host that served the response. This is correct for `<your-preview-host>` as long as:

- Magic link lands on the **same host** as the browsing session (`PUBLIC_SITE_URL` match).
- `hooks.server.ts` calls `await supabase.auth.getSession()` before `getSession()` on every request (already does).

**Verify:** After sign-in, DevTools → Application → Cookies should show `sb-<ref>-auth-token` (or chunked variants) on `<your-preview-host>`.

### 4. Admin bootstrap (`promote-admin`)

1. User signs up on production via magic link or OAuth (must complete Phase 0 env + redirect fix first).
2. From a machine with prod secrets:

   ```bash
   npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin
   ```

3. User signs out and back in so JWT picks up `app_metadata.role`.
4. `/admin` should load; with `SITE_LOCKED=true`, admin/editor roles bypass lockdown.

Roles: `admin`, `editor`, `contributor`, `customer`.

### 5. Code hardening

| Change                                                                                               | Status   | Notes                                                               |
| ---------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| Add preview hosts to `isProductionHostname()`                                                        | **Done** | `src/lib/server/auth/local-dev.ts`                                  |
| Refuse mock `ag-session` when request host is non-localhost HTTPS                                    | **Done** | `src/hooks.server.ts` returns `null` session on production hostname |
| Surface `productionAuthMisconfigured` on sign-in when keys missing                                   | **Done** | `sign-in/+page.svelte` banner                                       |
| Build OAuth/magic-link redirect from `event.url.origin` with `PUBLIC_SITE_URL` as allowlist fallback | **Done** | `callback-url.ts`; sign-in/sign-up actions                          |

---

## Verification steps

### A. Env probe (local with Netlify secrets)

```bash
cp .env.example .env   # fill with Netlify values
npm run test:readiness   # expect supabase-auth + supabase-db pass
```

### B. Magic link flow

1. Open https://<your-preview-host>/auth/sign-in in a clean browser profile.
2. Enter email → submit → check inbox.
3. Click link → should land on `https://<your-preview-host>/auth/callback?code=...` (not `<your-site-host>` unless that is `PUBLIC_SITE_URL`).
4. Redirect to `/account`.
5. Header shows **Account** dropdown with user links (not “Sign In”).
6. `/loyalty` loads member content (or tier UI) instead of sign-in gate.

### C. OAuth flow (Google minimum)

1. Click “Continue with Google” on sign-in.
2. Complete IdP consent → return to `/auth/callback` on same host.
3. Session persists on refresh.

### D. Sign out

1. Account menu → Sign out.
2. Header returns to “Sign In”.
3. `/account` redirects to sign-in.

### E. Admin

1. Run `promote-admin.ts` for test user.
2. Re-login → visit `/admin` → dashboard loads (not sign-in redirect).

### F. Negative checks

- [ ] No `ag-session` cookie on production after real sign-in
- [ ] `DEV_ADMIN` unset in Netlify env
- [ ] Quick-login buttons absent on Netlify (only localhost)

---

## Troubleshooting matrix

| Symptom                          | Likely cause                                  | Fix                                       |
| -------------------------------- | --------------------------------------------- | ----------------------------------------- |
| Magic link goes to wrong domain  | `PUBLIC_SITE_URL` wrong                       | Set to active deploy URL; redeploy        |
| Callback shows error query param | Redirect URL not in Supabase allowlist        | Add `/auth/callback` for deploy host      |
| Session works once then lost     | Cookie `Secure` / host mismatch               | Ensure HTTPS on same host throughout flow |
| Account menu never appears       | Supabase keys unset → mock path broken on SSR | Set all three Supabase env vars           |
| Admin 403 / redirect             | Role not in `app_metadata`                    | `promote-admin.ts` + re-login             |
| OAuth “provider not enabled”     | Supabase provider off                         | Enable in dashboard                       |

---

## Acceptance criteria

- [ ] Authenticated session visible in header on `<your-preview-host>`
- [ ] `PUBLIC_SITE_URL` matches browsed origin (documented in Netlify + Supabase)
- [ ] Both Netlify and custom-domain callback URLs in Supabase allowlist
- [ ] At least one `admin` user bootstrapped via `promote-admin.ts`
- [x] No production reliance on `ag-session` mock cookie (code refuses mock session on production hostname)
