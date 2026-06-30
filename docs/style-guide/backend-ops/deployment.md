# Deployment

Production deploys via **GitHub → organization mirror → Netlify**. The personal fork (`<your-github-user>/<repo-name>`) is where you develop; the org deploy repo receives an orphan snapshot of `main` (no workflow files) and triggers Netlify builds.

**Full runbook:** [infrastructure/deployment.md](../../infrastructure/deployment.md)

**Consolidated open work:** [next-steps-tracker.md](../../plans/active/next-steps-tracker.md) · [STATUS.md](../../STATUS.md)

---

## Build adapter

**File:** `svelte.config.js` (via `vite.config.ts`)

The project uses `@sveltejs/adapter-auto`, which detects Netlify at deploy time. For explicit control:

| Adapter                        | Platform             |
| ------------------------------ | -------------------- |
| `@sveltejs/adapter-netlify`    | Netlify (recommended if auto-detection fails) |
| `@sveltejs/adapter-node`       | VPS, Docker, Railway |
| `@sveltejs/adapter-vercel`     | Vercel               |
| `@sveltejs/adapter-cloudflare` | Cloudflare Pages     |

## Build command

```bash
npm run build
```

Output in `.svelte-kit/` (gitignored). Netlify runs `npm run build` from the org mirror.

---

## Branch flow

```
feature/* → dev (CI) → merge to main (CI) → sync to <organization>/<deploy-repo> → Netlify deploy
```

| Workflow                              | Branch           | Trigger                              | Purpose                                              |
| ------------------------------------- | ---------------- | ------------------------------------ | ---------------------------------------------------- |
| `.github/workflows/ci.yml`            | `dev` and `main` | Push/PR on this repo                 | Lint, typecheck, unit/e2e tests, build               |
| `.github/workflows/sync-org-main.yml` | **`main` only**  | CI success on `main` push, or manual | Mirror `main` → organization deploy repo for Netlify |
| `.github/workflows/readiness-ci.yml`  | `dev` and `main` | PR, weekly schedule, manual          | Optional live API probes (non-blocking on PRs)     |

> **Note:** Org-sync workflow lives on **`main`**, not `dev`. Merging `dev` → `main` brings sync changes into the personal repo; only then does CI on `main` push to the org mirror.

### Org mirror (deploy key)

Auth uses an **org-repo deploy key** (GitHub Actions secret on the personal repo), not a PAT. Deploy keys cannot push `.github/workflows`, so the mirror builds an orphan snapshot **without** the workflows folder.

| Where                                             | What you see                                            |
| ------------------------------------------------- | ------------------------------------------------------- |
| Organization deploy repo → Settings → Deploy keys | Deploy key registered for mirror push                 |
| Personal repo → Settings → Secrets → Actions      | `<org-sync-secret>` — GitHub never shows secret values |

```bash
./scripts/setup-org-sync-auth.sh install   # first time, or rotate key
./scripts/setup-org-sync-auth.sh verify    # confirm deploy key + secret configured (maintainers)
./scripts/setup-org-sync-auth.sh cleanup   # remove obsolete PAT secret if set
```

Connect Netlify to `<organization>/<deploy-repo>`, branch `main`.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow (`workflow_dispatch` does not wait for CI).

---

## Pre-launch checklist (ops order)

Complete in this order before merging `dev` → `main` for a live commerce cutover. Code paths are wired; gaps are env and external consoles.

### 1. Supabase — migrations

Production has **no** prior migration history. Apply the **squashed** set (3 files):

```bash
supabase link --project-ref <your-ref>
supabase db push
supabase migration list    # expect 3 applied
```

See [migration-squash-notes.md](../../infrastructure/migration-squash-notes.md) for local `db reset` vs remote `db push` guidance.

**Includes:** profiles, build_submissions, testimonials, newsletter, order_snapshots, restock_alerts, bug_reports, social_connections, youtube tables, and Storage bucket `ugc` policies (`20250701020000_media_social.sql`).

### 2. Netlify — environment variables

Set in **Site settings → Environment variables** for all deploy contexts that serve users. Copy names from [`.env.example`](../../../.env.example).

| Group | Variables | Notes |
| ----- | --------- | ----- |
| **Auth (required)** | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL` | `PUBLIC_SITE_URL` must match the URL users browse |
| **Commerce (required for live shop)** | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` | Default channel slug `default-channel` |
| **Content (optional)** | `GHOST_URL`, `GHOST_CONTENT_API_KEY` | Blog + guides |
| **YouTube sync (optional)** | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | Cron auth — see § Scheduled jobs |
| **Order mirror (optional)** | `SALEOR_WEBHOOK_SECRET` | HMAC verify on `POST /api/webhooks/saleor` |
| **CDN upload (optional)** | `PUBLIC_CDN_BASE_URL`, `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Admin presigned PUT + invalidation |
| **Social linking (optional)** | `SOCIAL_INSTAGRAM_CLIENT_ID`, `SOCIAL_YOUTUBE_CLIENT_ID`, `SOCIAL_TIKTOK_CLIENT_KEY`, `SOCIAL_DISCORD_CLIENT_ID` | Mock handle flow when unset |
| **Support (optional)** | `BUG_REPORT_WEBHOOK_URL` | Staff alert on new bug report |
| **Lockdown (optional)** | `SITE_LOCKED=true` | Public → `/locked`; staff bypass |

**Never set on Netlify:** `DEV_ADMIN`, `LOCAL_DEV_AUTH`

**Payment secrets:** Stripe/Adyen keys belong in **Saleor Dashboard → Payment App** config, not storefront env. See [saleor-payments.md](../../commerce/saleor-payments.md).

### 3. Supabase — Auth redirect URLs

In **Authentication → URL configuration**:

| Setting | Value |
| ------- | ----- |
| Site URL | Active deploy URL (`https://<preview-host>` or `https://<your-site-host>`) |
| Redirect URLs | `https://<preview-host>/auth/callback`, `https://<your-site-host>/auth/callback`, `http://localhost:5173/auth/callback` |

Enable **Email** provider. For Google / Discord / Microsoft: enable each provider; IdP redirect URIs point to Supabase (see [auth/oauth.md](../../auth/oauth.md), [auth/discord.md](../../auth/discord.md), [auth/microsoft.md](../../auth/microsoft.md)).

### 4. Bootstrap first admin

After auth env + redirects work:

```bash
npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin
```

User must sign out and back in so JWT picks up `app_metadata.role`.

Full flow: [account-flow-fix.md](../../plans/active/account-flow-fix.md).

### 5. Saleor — catalog + checkout

1. Set `PUBLIC_SALEOR_API_URL` and `SALEOR_CHANNEL` on Netlify; redeploy.
2. Install **Stripe Payment App** (`saleor.app.payment.stripe`) on the channel matching `SALEOR_CHANNEL`.
3. Configure Stripe secret keys in the Payment App (Saleor-hosted), not Netlify.
4. Verify: `npm run test:readiness` → `saleor-catalog` and `saleor-checkout` pass; `/shop` product count ≠ 120 mock items.

### 6. Saleor — storefront webhooks

Register in Saleor Dashboard → Webhooks:

| Event | Target | Secret |
| ----- | ------ | ------ |
| `ORDER_CREATED`, fulfillment updates | `https://<your-site-host>/api/webhooks/saleor` | Set matching `SALEOR_WEBHOOK_SECRET` on Netlify |

Handler: `src/routes/api/webhooks/saleor/+server.ts` — upserts `order_snapshots` for `/account/orders`.

**Restock alerts (future):** `IP-004` signup API is live; Saleor stock webhook → notify handler is **not wired** yet ([next-steps-tracker.md](../../plans/active/next-steps-tracker.md#IP-004-code)).

### 7. Ghost CMS (optional)

1. Provision Ghost site; create Content API integration.
2. Set `GHOST_URL`, `GHOST_CONTENT_API_KEY` on Netlify.
3. Tag posts with `guide` or `blog` per [content/ghost.md](../../content/ghost.md).

### 8. Scheduled jobs (YouTube sync)

Route: `POST /api/cron/youtube-sync`  
Auth: request header `x-youtube-sync-secret` must match `YOUTUBE_SYNC_SECRET`.

Netlify does not ship a repo `netlify.toml` cron entry. Options:

| Platform | Setup |
| -------- | ----- |
| **Netlify** | Scheduled Functions or external cron (e.g. cron-job.org) hitting the deploy URL with the secret header |
| **GitHub Actions** | Weekly workflow calling the URL (store URL + secret in Actions secrets) |
| **Supabase pg_cron** | Edge Function invoking sync with service role |

Recommended schedule: every 6 hours. Register channels in `/admin/youtube` after first manual sync.

### 9. CI secrets policy

| Secret location | Purpose | Policy |
| --------------- | ------- | ------ |
| Personal repo → Actions secrets | `<org-sync-secret>` (deploy key) | Maintainers only; rotate via `setup-org-sync-auth.sh` |
| Personal repo → Actions secrets | `PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL`, `GHOST_*`, `YOUTUBE_API_KEY`, CDN vars | Optional — powers `readiness-ci.yml`; probes **skip** when unset |
| Netlify env | All runtime server + `PUBLIC_*` vars | Never commit values; audit with `bash scripts/check-secrets.sh` |

`readiness-ci.yml` is **non-blocking on pull requests** (`continue-on-error`). Weekly schedule + `workflow_dispatch` for maintainer signal.

**Do not** add service-role or webhook secrets to client bundles. `check-secrets.sh` scans built output for `SERVICE_ROLE` and blocks `DEV_ADMIN` in tracked deploy config.

### 10. Post-deploy verification

```bash
cp .env.example .env   # fill with Netlify values locally
npm run test:readiness
bash scripts/check-secrets.sh
npm run test:unit
```

Manual QA matrix: [account-flow-fix.md](../../plans/active/account-flow-fix.md) § Verification.

Staff integrations dashboard: `/admin/runtime` (cron registry, env booleans only).

---

## Domain setup

Configure separate hosts via env vars (not hardcoded in docs):

| Role           | Env var                 |
| -------------- | ----------------------- |
| Storefront     | `PUBLIC_SITE_URL`       |
| Saleor GraphQL | `PUBLIC_SALEOR_API_URL` |
| Media CDN      | `PUBLIC_CDN_BASE_URL`   |
| Ghost CMS      | `GHOST_URL`             |

At custom domain cutover: update `PUBLIC_SITE_URL`, Supabase Site URL + redirect URLs, and Saleor webhook target URL; redeploy.

---

## Static assets

- `static/` files copied to build output at root path
- CDN serves dynamic UGC when `PUBLIC_CDN_BASE_URL` set; else Supabase Storage signed URLs
- Favicon imported from `$lib/assets/` (hashed at build)

---

## Security

- Never commit `.env`
- Private env vars only in server runtime (`$env/dynamic/private`, `hooks.server.ts`, `+page.server.ts`)
- Supabase RLS on all user tables
- HTTPS everywhere
- `SITE_LOCKED` for maintenance preview without taking Netlify offline

See [infrastructure/overview.md](../../infrastructure/overview.md) for CDN/S3/Supabase architecture and [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) for documentation rules.
