# Production deployment runbook

**Public-safe** — variable names and placeholders only. No secret values or production hostnames.  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) · **Env template:** [`.env.example`](../../.env.example)

Canonical checklist for a new deployer: Netlify storefront, Supabase schema, Saleor commerce, Ghost content, OAuth, media CDN, and post-deploy verification.

**Related:** [overview.md](./overview.md) (architecture) · [migration-squash-notes.md](./migration-squash-notes.md) · [supabase-schema.md](./supabase-schema.md) · [STATUS.md](../STATUS.md) (open ops rows)

---

## Release flow

```
feature/* → dev (CI) → merge to main (CI) → org deploy mirror → Netlify production
```

| Step | Where | Action |
| ---- | ----- | ------ |
| 1 | Personal fork (`<your-github-user>/<repo-name>`) | Develop on `dev`; CI runs lint, check, unit tests, build, e2e |
| 2 | Personal repo → `main` | Merge `dev` → `main` after staging QA |
| 3 | GitHub Actions | `sync-org-main.yml` mirrors `main` to `<organization>/<deploy-repo>` (workflows excluded) |
| 4 | Netlify | Site connected to org deploy repo, branch `main`, auto-deploy on push |

**Org mirror auth:** deploy key stored as `<org-sync-secret>` in personal repo → Actions secrets (maintainers). Setup: `./scripts/setup-org-sync-auth.sh`.  
**Manual re-sync:** GitHub → Actions → **Sync main to org** → Run workflow.

Do **not** push directly to the org deploy repo.

---

## Netlify site settings

| Setting | Value |
| ------- | ----- |
| Repository | `<organization>/<deploy-repo>` |
| Production branch | `main` |
| Build command | `npm run build` |
| Publish directory | *(auto — `@sveltejs/adapter-auto` detects Netlify)* |
| Node version | `22` (match CI) |

`adapter-auto` is configured in `vite.config.ts`. For explicit Netlify control, switch to `@sveltejs/adapter-netlify` — see [style-guide/backend-ops/deployment.md](../style-guide/backend-ops/deployment.md).

### Environment variable scopes

Set server-only vars for **Builds** and **Functions** (SvelteKit server routes). `PUBLIC_*` vars are safe in the browser bundle.

**Never set on Netlify (localhost only):**

- `DEV_ADMIN`
- `LOCAL_DEV_AUTH`

Preview hosts (`*.netlify.app`) are treated as production for dev-bypass guards (`isProductionHostname()`).

---

## Environment variable checklist

Copy names from [`.env.example`](../../.env.example). Group by service when entering Netlify **Site settings → Environment variables**.

### Site

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `PUBLIC_SITE_URL` | Public | **Yes** | Canonical storefront origin, e.g. `https://<your-site-host>` |
| `PUBLIC_DEFAULT_LOCALE` | Public | Recommended | Default `en-US` |
| `PUBLIC_DEFAULT_CURRENCY` | Public | Recommended | Default `USD` |
| `SITE_LOCKED` | Server | Optional | `true` — public traffic → `/locked`; admins pass through |

### Supabase

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `PUBLIC_SUPABASE_URL` | Public | **Yes** | Project API URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | **Yes** | RLS-scoped anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **Yes** | Moderation, webhooks, cron — never `PUBLIC_*` |

Without Supabase env, production refuses mock sessions (`hooks.server.ts`). See [integrations/supabase.md](../integrations/supabase.md).

### Saleor (storefront)

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `PUBLIC_SALEOR_API_URL` | Public | **Yes** | `https://<your-saleor-host>/graphql/` |
| `SALEOR_CHANNEL` | Server | **Yes** | Channel slug (e.g. `default-channel`) |
| `SALEOR_APP_TOKEN` | Server | Optional | Bearer for privileged mutations if your instance requires it |
| `SALEOR_WEBHOOK_SECRET` | Server | Recommended | HMAC verify on `POST /api/webhooks/saleor` |

**Do not add Stripe or Adyen secrets here** — payment provider keys belong in the Saleor Payment App dashboard. See [commerce/saleor-payments.md](../commerce/saleor-payments.md).

### Ghost (guides + blog)

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `GHOST_URL` | Server | For live CMS | Ghost site URL, no trailing slash |
| `GHOST_CONTENT_API_KEY` | Server | For live CMS | Content API key from Ghost Admin → Integrations |

See [content/ghost.md](../content/ghost.md) for tag convention (`guide`, `blog`).

### YouTube sync

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `YOUTUBE_API_KEY` | Server | For `/watch` sync | YouTube Data API v3 key |
| `YOUTUBE_SYNC_SECRET` | Server | For cron route | Shared secret for `x-youtube-sync-secret` header |

### CDN / S3 / CloudFront

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `PUBLIC_CDN_BASE_URL` | Public | Recommended | `https://<your-cdn-host>` |
| `S3_BUCKET` | Server | For admin uploads | Media origin bucket |
| `S3_REGION` | Server | For admin uploads | AWS region |
| `AWS_ACCESS_KEY_ID` | Server | For admin uploads | IAM user with `s3:PutObject` on bucket |
| `AWS_SECRET_ACCESS_KEY` | Server | For admin uploads | Paired with access key |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Server | For invalidation | Enables post-upload cache purge |

Without `AWS_CLOUDFRONT_DISTRIBUTION_ID`, uploads work but `POST /api/admin/media/invalidate` returns 501. Paths are allowlisted (`media/admin/{uuid}/{filename}`).

### OAuth (sign-in)

No Discord/Microsoft client secrets in Netlify — those live in **Supabase Dashboard → Authentication → Providers**.

| Variable | Scope | Required | Notes |
| -------- | ----- | -------- | ----- |
| `PUBLIC_SUPABASE_URL` | Public | **Yes** | OAuth broker |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | **Yes** | PKCE session |
| `PUBLIC_SITE_URL` | Public | **Yes** | Callback origin for `/auth/callback` |

Provider setup: [auth/oauth.md](../auth/oauth.md) · [auth/discord.md](../auth/discord.md) · [auth/microsoft.md](../auth/microsoft.md).

### Optional

| Variable | Scope | Notes |
| -------- | ----- | ----- |
| `BUG_REPORT_WEBHOOK_URL` | Server | Staff notification on new `/support/report-bug` submissions |
| `SOCIAL_*_CLIENT_ID` | Server | Account social-linking mock handle flow when unset |

---

## Supabase — apply schema

Production has **no prior migration history**. Apply the **3 squashed migrations** once:

| # | File | Contents |
| - | ---- | -------- |
| 1 | `20250701000000_core_auth_profiles.sql` | `profiles`, signup trigger, `is_staff()` |
| 2 | `20250701010000_commerce_content.sql` | builds, testimonials, newsletter, featured, preferences, YouTube, orders, restock, wholesale, bugs |
| 3 | `20250701020000_media_social.sql` | `media_assets`, `ugc` Storage bucket + policies |

```bash
supabase link --project-ref <your-ref>
supabase db push
supabase migration list    # expect 3 applied
```

**Local clone after squash pull:** `supabase db reset` (do not incremental-push over old 17-file history).  
**If remote already has old migration names:** stop — contact maintainer before pushing. Details: [migration-squash-notes.md](./migration-squash-notes.md).

### RLS note

Every `public` table has Row Level Security enabled. Authorization uses `auth.users.raw_app_meta_data.role` via `public.is_staff()` — **never** `user_metadata`.  
`UPDATE` policies require matching `SELECT` policies. Service role bypasses RLS — server-only (`src/lib/server/**`).  
Post-apply: run Supabase advisors or `npm run test:readiness` → `supabase-db`. Full patterns: [supabase-schema.md](./supabase-schema.md).

### Supabase Auth URL configuration

**Authentication → URL configuration:**

| Field | Values |
| ----- | ------ |
| Site URL | `https://<your-site-host>` |
| Redirect URLs | `https://<your-site-host>/auth/callback` |
| | `https://<preview-host>.netlify.app/auth/callback` *(if using Netlify preview)* |
| | `http://localhost:5173/auth/callback` *(local dev)* |

### Bootstrap first admin

```bash
npx tsx --env-file=.env scripts/promote-admin.ts you@email.com admin
```

User must sign up on production first (magic link or OAuth). Sign out/in after promotion so JWT reflects `app_metadata.role`.

---

## Saleor — webhook + channel

### Storefront webhook (order mirror)

Register in **Saleor Dashboard → Apps → Webhooks** (or custom app):

| Field | Value |
| ----- | ----- |
| Target URL | `https://<your-site-host>/api/webhooks/saleor` |
| Secret | Generate a value → set same string as `SALEOR_WEBHOOK_SECRET` on Netlify |
| Events | `ORDER_CREATED`, fulfillment events handled by `order-webhook.ts` |

Handler: `src/routes/api/webhooks/saleor/+server.ts` — verifies `Saleor-Signature` when secret is set.  
PSP webhooks (Stripe → Saleor Payment App) **do not** hit this route.

### Channel

`SALEOR_CHANNEL` must match a Saleor channel with products and (for checkout) payment app enabled.

---

## Ghost Content API

1. Ghost Admin → **Settings → Integrations → Add custom integration**
2. Copy Content API URL → `GHOST_URL`
3. Copy Content API key → `GHOST_CONTENT_API_KEY`
4. Create tags `guide` and `blog` (slug exact)
5. Publish posts with appropriate primary tag

Verify: `npm run test:readiness` → `ghost-cms` pass; `/guides` and `/blog` show live content (not mock).

---

## OAuth redirect URLs

Two layers — do not confuse them.

### Layer 1: IdP → Supabase (Discord / Microsoft consoles)

Add **only** the Supabase callback:

```
https://<project-ref>.supabase.co/auth/v1/callback
```

- Discord: [Discord Developer Portal](https://discord.com/developers/applications) → OAuth2 → Redirects  
- Microsoft Entra: App registration → Authentication → Web redirect URI  

Copy Client ID + secret into **Supabase → Authentication → Providers** (Discord / Azure).

### Layer 2: Supabase → storefront

Add in **Supabase → URL configuration → Redirect URLs**:

```
https://<your-site-host>/auth/callback
http://localhost:5173/auth/callback
```

Set `PUBLIC_SITE_URL` to the primary production origin. The app callback is `src/routes/auth/callback/+server.ts` (PKCE).

Checklists: [auth/discord.md](../auth/discord.md) · [auth/microsoft.md](../auth/microsoft.md).

---

## YouTube cron

Route: `POST /api/cron/youtube-sync`  
Auth: header `x-youtube-sync-secret` must match `YOUTUBE_SYNC_SECRET`.

Netlify has no built-in cron. Schedule an external caller (e.g. GitHub Actions `schedule`, `pg_cron` + Edge Function, or a cron SaaS):

```http
POST https://<your-site-host>/api/cron/youtube-sync
x-youtube-sync-secret: <same-as-YOUTUBE_SYNC_SECRET>
```

Recommended interval: every 6 hours (`0 */6 * * *`).  
Register channels in `/admin/youtube` after migrations are applied.

---

## CloudFront invalidation

Set all CDN/S3 vars (see checklist above). `AWS_CLOUDFRONT_DISTRIBUTION_ID` unlocks:

- Automatic invalidation after admin media upload (`src/lib/server/media/cdn.ts`)
- Manual staff invalidation: `POST /api/admin/media/invalidate` (allowlisted paths, max 10)

Verify at `/admin/runtime` (Integrations) — CDN row shows configured when vars present.

---

## Stripe / Saleor Payment App — ops-blocked

Storefront checkout code is **complete**; live card payment requires ops on the **Saleor host** (not Netlify):

| Step | Where | Action |
| ---- | ----- | ------ |
| 1 | Saleor Dashboard → Apps | Install Stripe Payment App (`saleor.app.payment.stripe`) |
| 2 | Channel settings | Enable app for channel matching `SALEOR_CHANNEL` |
| 3 | Payment App settings | Enter Stripe **secret** key (Saleor-hosted config — no storefront env) |
| 4 | Verify | `/checkout` → Payment Element → test card → order in Saleor Dashboard |

Cannot document live Stripe keys or Saleor app tokens in this repo. Maintainer private runbook / password manager only.

When Payment App is missing, `/checkout` shows `PAYMENT_APP_OPS_HINT`; payment proxies return `PAYMENT_GATEWAY_UNAVAILABLE`.  
Full flow: [commerce/saleor-payments.md](../commerce/saleor-payments.md).

---

## Post-deploy verification

### 1. Readiness probes (live APIs)

```bash
cp .env.example .env    # fill staging/prod values locally
npm run test:readiness
bash scripts/check-secrets.sh
```

| Probe | Validates |
| ----- | --------- |
| `supabase-auth` | Auth health |
| `supabase-db` | Service role + schema |
| `saleor-catalog` | Products on channel |
| `saleor-checkout` | Channel exists (payment app readiness) |
| `ghost-cms` | Content API |
| `youtube-sync` | YouTube API key |
| `oauth-discord` / `oauth-azure` | Provider enabled in Supabase |
| `cdn-s3` | `HEAD` on `PUBLIC_CDN_BASE_URL` |

**CI:** `.github/workflows/readiness-ci.yml` — weekly + manual + non-blocking on PRs when GitHub Actions secrets are configured (see maintainer runbook for secret names).

### 2. Playwright smoke (`e2e/smoke.spec.ts`)

CI runs full e2e on every push (`ci.yml`) against a local preview build with **mock** Supabase/Saleor (deterministic).

Post-deploy manual smoke against **live** Netlify:

```bash
npm run build
npm run preview -- --port 4174
npx playwright test e2e/smoke.spec.ts
```

Or point at production (read-only checks):

```bash
PLAYWRIGHT_BASE_URL=https://<your-site-host> npx playwright test e2e/smoke.spec.ts
```

Smoke covers: homepage nav, `/shop` products, `/parts`, search modal, add-to-cart drawer.

### 3. Production spot checks

| Check | Pass criteria |
| ----- | ------------- |
| `/shop` | Product count ≠ 120 mock; no `picsum.photos` images |
| `/auth/sign-in` | No dev quick-login buttons |
| Magic link / OAuth | Lands on `/account` with session |
| `/admin` | Staff role required; `/admin/runtime` shows integration status |
| `/checkout` | Shipping works; pay enabled after Payment App ops |
| `/account/orders` | Populated after test order + webhook mirror |

### 4. Admin runtime dashboard

`/admin/runtime` — staff view of cron triggers and integration env presence (no secret values displayed).

---

## Pre-launch checklist (copy for deployer)

### Infrastructure

- [ ] Org mirror sync succeeded after `main` merge
- [ ] Netlify build green on org repo `main`
- [ ] All required Netlify env vars set (grouped checklist above)
- [ ] `DEV_ADMIN` and `LOCAL_DEV_AUTH` **absent** on Netlify

### Supabase

- [ ] `supabase db push` — 3 squashed migrations applied
- [ ] RLS enabled on all `public` tables (advisors clean)
- [ ] Auth Site URL + redirect URLs include production + preview origins
- [ ] First admin promoted via `scripts/promote-admin.ts`

### Saleor

- [ ] `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` set
- [ ] Webhook → `/api/webhooks/saleor` with `SALEOR_WEBHOOK_SECRET`
- [ ] **Ops-blocked:** Stripe Payment App on channel (checkout pay)

### Content

- [ ] Ghost integration + tags `guide` / `blog`
- [ ] YouTube cron scheduled with `YOUTUBE_SYNC_SECRET` header

### OAuth

- [ ] Discord + Microsoft redirect URIs in IdP consoles (Supabase callback)
- [ ] `/auth/callback` in Supabase redirect URLs

### CDN

- [ ] `PUBLIC_CDN_BASE_URL` set
- [ ] S3 + `AWS_CLOUDFRONT_DISTRIBUTION_ID` for admin media invalidation

### Verify

- [ ] `npm run test:readiness` — probes pass with prod/staging secrets
- [ ] `e2e/smoke.spec.ts` against preview or production URL
- [ ] `/shop` live catalog confirmed

---

## Related docs

| Doc | Topic |
| --- | ----- |
| [integrations/supabase.md](../integrations/supabase.md) | Auth, roles, site lockdown |
| [commerce/saleor.md](../commerce/saleor.md) | Catalog + checkout architecture |
| [commerce/saleor-payments.md](../commerce/saleor-payments.md) | Payment App flow |
| [content/ghost.md](../content/ghost.md) | Ghost tags and filters |
| [testing/readiness-report.md](../testing/readiness-report.md) | Probe reference |
| [archive/batch-2026-07-03-followups.md](../archive/batch-2026-07-03-followups.md) | Ops apply row index |
| [wiki-export/Deployment-and-CI.md](../wiki-export/Deployment-and-CI.md) | Public wiki summary |
