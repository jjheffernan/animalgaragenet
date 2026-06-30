# Inspiration polish — production setup

**Status:** Ops checklist for items blocked on Netlify / Supabase / Saleor credentials  
**Related:** [polish-plan.md](../../meta/polish-plan.md), [market-readiness.md](./market-readiness.md)

Public-safe — no secrets. Use placeholders when documenting hosts.

---

## Phase 0 — Account & auth (P0)

### Netlify environment variables

| Variable                    | Required | Notes                                                      |
| --------------------------- | -------- | ---------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Yes      | Supabase → Settings → API                                  |
| `PUBLIC_SUPABASE_ANON_KEY`  | Yes      | Publishable anon key                                       |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Server only — never in client bundle                       |
| `PUBLIC_SITE_URL`           | Yes      | Must match the URL users browse (preview or custom domain) |

**Do not set:** `DEV_ADMIN`, `LOCAL_DEV_AUTH`

### Supabase dashboard

1. Authentication → URL configuration
   - Site URL: `https://<your-preview-host>`
   - Redirect URLs:
     - `https://<your-preview-host>/auth/callback`
     - `https://<your-site-host>/auth/callback`
     - `http://localhost:5173/auth/callback`
2. Enable Email provider (magic link).
3. Enable OAuth providers as needed (Google, Discord, Azure) — see `docs/auth/oauth.md`.

### Admin bootstrap

```bash
npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin
```

User must sign out and back in after promotion.

### Verify

```bash
cp .env.example .env   # fill with Netlify values
npm run test:readiness   # supabase-auth, supabase-db should pass
```

**Code done (June 2026):** `isProductionHostname()`, mock `ag-session` refused on production, `supabaseReady` banner on sign-in, OAuth/magic-link callback uses request origin when safe.

---

## Phase 1 — Live Saleor catalog (P0)

### Netlify environment variables

| Variable                | Required | Notes                                                        |
| ----------------------- | -------- | ------------------------------------------------------------ |
| `PUBLIC_SALEOR_API_URL` | Yes      | GraphQL endpoint, e.g. `https://<your-saleor-host>/graphql/` |
| `SALEOR_CHANNEL`        | Yes      | Default `default-channel`                                    |

### Verify

```bash
npm run test:readiness   # saleor-catalog must pass
```

Manual: `/shop` product count ≠ 120; no `picsum.photos` in network tab.

**Code done:** `guardMockCatalogFallback()` on catalog loaders; Saleor cart line qty/remove wired.

---

## Phase 1b — Media uploads (P1)

### Supabase

1. Apply migration `supabase/migrations/20250630120000_media_assets.sql` (bucket `ugc`, `media_assets`, `testimonial_media`).
2. Confirm Storage policies allow authenticated upload to `ugc/{user_id}/`.

### Verify

1. Sign in on staging.
2. `/loyalty` → Share Your Review → attach JPEG/PNG/WebP (≤ 5 MB).
3. Submit — admin `/admin/testimonials` should show pending review with linked media.

**Code done:** `POST /api/media/upload-slot`, `POST /api/media/confirm`, `DELETE /api/media/[id]`, `ReviewPhotoUpload.svelte`.

---

## Phase 2 — Checkout & payment (P1)

Blocked on Saleor payment app configuration (Stripe/PayPal in Saleor admin, not SvelteKit env).

| Step                                              | Owner                                      |
| ------------------------------------------------- | ------------------------------------------ |
| Configure payment gateway in Saleor channel       | Saleor admin                               |
| Wire `checkoutComplete` mutation                  | Code — see commented stub in `checkout.ts` |
| Replace `/checkout` placeholder                   | Code after gateway live                    |
| `npm run test:readiness` → `saleor-checkout` pass | CI / local                                 |

---

## Phase 3 — Content hydration (P1)

| Service      | Env vars                                 | Task                                                |
| ------------ | ---------------------------------------- | --------------------------------------------------- |
| Ghost        | `GHOST_URL`, `GHOST_CONTENT_API_KEY`     | Blog + guides from CMS                              |
| YouTube      | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | Replace `youtube/sync.ts` stub                      |
| CDN (future) | `PUBLIC_CDN_BASE_URL`, `S3_*`, `AWS_*`   | Migrate from Supabase Storage when traffic warrants |

**Code done:** Homepage UGC hydrates from approved `testimonials` when Supabase configured.

---

## Phase 4 — OAuth verification (P2)

Enable each provider in Supabase, then:

```bash
npm run test:readiness   # oauth-google, oauth-discord, oauth-azure
```

---

## CI / hygiene

```bash
bash scripts/check-secrets.sh
npm run lint
npm run test:unit
```

Prettier: run `npm run format` locally before push if CI reports formatting drift.

---

_Last updated: June 30, 2026_
