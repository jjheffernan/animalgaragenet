# Inspiration & polish tracker

**Status:** Active — canonical open-work tracker  
**Created:** 2026-06-30  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)  
**Replaces:** `inspiration-implementation-tracker.md`, `inspiration-polish-coordination.md`, `meta/polish-plan.md`, `inspiration-polish-prod-setup.md`  
**Backlog (built items):** [inspiration.md](../../meta/inspiration.md)  
**Audit / security:** [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md) — do not duplicate CI/security rows here

Markers: `@inspiration-scaffold` (Supabase/community/CMS) · `@saleor-migration` (commerce) — [decisions.md](../../meta/decisions.md#migration-scaffolds-inspiration-scaffold--migration). Do not remove unless wiring that step.

---

## Tracker

| ID     | Source              | Feature                                      | Scaffold path(s)                                                                 | Status        | Prod setup                                                          |
| ------ | ------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| IP-001 | polish / AUDIT      | Supabase auth on Netlify preview             | —                                                                                | **blocked**   | [§ Auth](#prod-auth)                                                |
| IP-002 | inspiration / AUDIT | Live Saleor product catalog                    | `src/lib/server/catalog/*.ts` (`@saleor-migration`)                              | **blocked**   | [§ Saleor catalog](#prod-saleor-catalog)                            |
| IP-003 | inspiration / AUDIT | Checkout + payment (Stripe via Saleor)       | `src/lib/server/saleor/checkout*.ts`, `routes/checkout/` (`@saleor-migration`)   | **partial**   | [§ Checkout](#prod-checkout)                                        |
| IP-004 | inspiration         | Notify-me restocks → Supabase                | `src/lib/server/restock/repository.ts`, `POST /api/restock/notify`               | **live**      | Apply `20250630210000_restock_alerts.sql`; Saleor stock webhook   |
| IP-005 | inspiration         | Collection shop filters (`?collection=`)     | `src/lib/server/catalog/shop-collection.ts`                                      | **done**      | Saleor `COLLECTION_PRODUCTS_QUERY` + shop ribbon; mock fallback in dev |
| IP-006 | inspiration         | Campaign hero / homepage CMS                 | `src/lib/server/featured-sections/repository.ts`, `/admin/featured`              | **done**      | Admin `saveHero` + homepage `Hero` wired; apply `20250630150000_content_metadata.sql`   |
| IP-007 | inspiration / AUDIT | YouTube channel auto-sync                    | `src/lib/server/youtube/repository.ts`, `youtube/sync.ts`, `/api/cron/youtube-sync` | **done**      | Apply `20250630160000_youtube_sync.sql`; cron header `x-youtube-sync-secret` — [§ Content](#prod-content) |
| IP-008 | inspiration         | Newsletter → Supabase                        | `src/lib/server/newsletter/repository.ts`, `POST /api/newsletter/subscribe`      | **live**      | `20250630140000_newsletter_subscribers.sql`                         |
| IP-009 | inspiration         | Garage Squad XP (off localStorage)           | `src/lib/server/user-preferences/repository.ts`, `POST /api/account/garage`      | **done**      | `20250630230000_account_garage_xp.sql`; apply migration on Supabase |
| IP-010 | inspiration         | Saved vehicle garage (persist YMM)           | `user-preferences/repository.ts`, `GET/PUT /api/account/garage`                  | **done**      | Same migration; guest localStorage fallback retained                |
| IP-011 | inspiration         | Wholesale application workflow               | `src/lib/server/wholesale/repository.ts`, `/wholesale`                            | **live**      | `20250630220000_wholesale_inquiries.sql`; form → repository wired   |
| IP-012 | inspiration / AUDIT | Account order history (Saleor mirror)        | `src/lib/server/orders/snapshots.ts`, `routes/account/orders/`                   | **partial**   | Account page + empty state wired; Saleor webhook + migration pending |
| IP-013 | inspiration         | CDN Phase 2 (S3 + CloudFront)                | `src/lib/server/media/cdn.ts`                                                    | **partial**   | **Read URLs done** — `resolveUgcPublicUrl` in media reads; presigned upload deferred |
| IP-014 | inspiration         | Watch hub — DB videos + shoppable            | `src/routes/watch/+page.server.ts`                                               | **done**      | `/watch` prefers Supabase `videos` when rows exist; mock fallback retained |
| IP-015 | inspiration / AUDIT | Ghost blog + guides (live CMS)               | `src/lib/server/ghost/posts.ts`                                                  | **blocked**   | [§ Content](#prod-content)                                          |
| IP-016 | polish              | Review photo uploads (media Phase 1)         | `src/lib/server/media/repository.ts`, `ReviewPhotoUpload.svelte`                 | **done**      | [§ Media uploads](#prod-media-uploads)                                |
| IP-017 | polish              | Account dropdown + production auth guards    | `AccountMenu.svelte`, `local-dev.ts`, `hooks.server.ts`                          | **done**      | Do not set `DEV_ADMIN` / `LOCAL_DEV_AUTH` on Netlify               |
| IP-018 | polish              | Saleor redeem + cart promo                   | `src/routes/account/redeem/`, `checkout/promo.ts`                                | **done**      | Saleor vouchers in admin                                            |
| IP-019 | polish / AUDIT      | CI Prettier / format drift                   | —                                                                                | **done**      | Commit `63eb20a` — `npm run lint` green on `dev`                    |
| IP-020 | inspiration         | Build thread submit → Supabase               | `src/lib/server/build-logs/repository.ts`, `/admin/builds`                       | **live**      | Apply `build_submissions` migration                                 |
| IP-021 | inspiration         | UGC testimonials + moderation                | `testimonials/repository.ts`, `/admin/testimonials`                              | **live**      | Supabase Storage bucket `ugc`                                       |
| IP-022 | inspiration         | Featured sections admin editor               | `/admin/featured`                                                                  | **done**      | Staff JWT (`editor`/`admin`); `saveHero` + homepage hero load verified |
| IP-023 | inspiration         | Multi-channel international pricing          | `src/lib/server/saleor/channels.ts` (`@saleor-migration`)                        | **scaffolded** | Map locales in Saleor admin                                         |
| IP-024 | inspiration         | Shipping zones + threshold promos            | —                                                                                | **not started** | Saleor shipping + promotion rules                                   |
| IP-025 | inspiration         | Supabase-backed admin user CRUD              | `src/lib/server/supabase/admin-users.ts`, `/admin/users`                         | **partial**   | Service role + `promote-admin.ts`                                   |
| IP-026 | inspiration         | Deal / campaign scheduler (Pit Lane CMS)     | `/deals` mock                                                                    | **not started** | CMS table TBD                                                       |
| IP-027 | inspiration         | Faceted parts search                         | —                                                                                | **not started** | Saleor attributes                                                   |
| IP-028 | inspiration         | `@motionone/svelte` scroll system            | —                                                                                | **not started** | animation-media.md                                                  |

**Row count:** 28

**Related scaffold (no IP):** Saleor webhooks — `api/webhooks/saleor/+server.ts` (`@saleor-migration`)

---

## Next steps (batch 2026-06-30)

Explicit follow-ups from the June 30 implementation batch (`67a150c`–`6837217`, plus `608d8e0` / `5ca1b1f`). Shipped rows are **done** in the tracker above; this table is for remaining code and ops work only.

| ID     | Source              | Task                                                                 | Owner        | Acceptance criteria                                                                 | Prod setup                                                                 |
| ------ | ------------------- | -------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| IP-003 | AUD-P1-001 / batch  | Stripe Elements + live pay flow on `/checkout`                         | saleor / code | Pay button calls `POST /checkout/payment/initialize` → `transactionInitialize` → `@stripe/stripe-js` confirm → `process` + `complete`; order in Saleor Dashboard | Install Stripe Payment App on channel; `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL`; `npm run test:readiness` → `saleor-checkout` pass — [§ Checkout](#prod-checkout) |
| IP-003 | AUD-P1-001 / batch  | Payment App channel enablement                                       | saleor / ops | `paymentGateways.length > 0` on checkout load; pay button label ≠ “configure Payment App” | Saleor Dashboard → Apps → Stripe (`saleor.app.payment.stripe`) → enable for channel |
| IP-005 | batch `6837217`     | Verify live collection filter on staging                             | saleor       | `/shop?collection={slug}` returns Saleor products when env set; mock only when Saleor off | `PUBLIC_SALEOR_API_URL` on Netlify; collections populated in Saleor admin |
| IP-006 | batch `67a150c`     | Apply homepage CMS migration                                         | supabase / ops | `featured_sections` table exists; admin save persists across deploys                 | Apply `20250630150000_content_metadata.sql` on Supabase project            |
| IP-012 | batch `67a150c`     | Order mirror webhook + migration                                     | code / supabase | `ORDER_CREATED` (and fulfillment updates) call `upsertOrderSnapshot`; HMAC verified when `SALEOR_WEBHOOK_SECRET` set; `/account/orders` shows live rows | Apply `20250630170000_order_snapshots.sql`; register Saleor webhook → `/api/webhooks/saleor` |
| IP-013 | batch `67a150c`     | CDN presigned upload (Phase 2)                                       | code / ops   | Uncomment `createPresignedUploadUrl` in `cdn.ts`; admin upload UI uses presigned PUT | `PUBLIC_CDN_BASE_URL`, `S3_BUCKET`, `AWS_*` per [§ Prod CDN](#prod-cdn)   |
| IP-022 | batch `67a150c`     | Featured sections beyond hero                                        | code         | Admin can edit UGC strip / campaign blocks (not only `saveHero`); homepage loaders read all section types | Same as IP-006 migration                                                   |
| IP-007 | batch `c0f1b80`     | YouTube cron on production                                           | ops          | `POST /api/cron/youtube-sync` runs on schedule; `/watch` shows synced `videos` rows | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET`; header `x-youtube-sync-secret`; apply `20250630160000_youtube_sync.sql` — [§ Content](#prod-content) |
| IP-015 | AUD-P1-009 / batch  | Live Ghost CMS (fallback policy shipped)                             | code / ops   | `/blog` and `/guides` load real posts when env set; production never silently mocks | `GHOST_URL`, `GHOST_CONTENT_API_KEY`; Ghost tags `guide` / `blog`            |
| —      | batch `5ca1b1f`     | Footer layout (shipped — no follow-up)                               | —            | Condensed Z1-inspired footer; mobile stack; e2e footer links pass                    | —                                                                          |

---

## Verification

```bash
npm run test:unit
npm run test:readiness
bash scripts/check-secrets.sh
```

---

## Prod setup appendix

Public-safe — no secrets. Placeholders only.

### Prod auth {#prod-auth}

| Variable                    | Required | Notes                         |
| --------------------------- | -------- | ----------------------------- |
| `PUBLIC_SUPABASE_URL`       | Yes      | Supabase → Settings → API     |
| `PUBLIC_SUPABASE_ANON_KEY`  | Yes      | Publishable anon key          |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Server only                   |
| `PUBLIC_SITE_URL`           | Yes      | Must match browsed deploy URL |

**Do not set:** `DEV_ADMIN`, `LOCAL_DEV_AUTH`

1. Supabase → Authentication → URL configuration: Site URL + redirect URLs for preview, production, and `http://localhost:5173/auth/callback`.
2. Bootstrap admin: `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin`
3. Verify: `npm run test:readiness` → `supabase-auth`, `supabase-db` pass.

**Code done (June 2026):** `isProductionHostname()`, mock `ag-session` refused on production, `supabaseReady` banner, OAuth callback from request origin.

### Prod Saleor catalog {#prod-saleor-catalog}

| Variable                | Required | Notes                     |
| ----------------------- | -------- | ------------------------- |
| `PUBLIC_SALEOR_API_URL` | Yes      | GraphQL endpoint          |
| `SALEOR_CHANNEL`        | Yes      | Default `default-channel` |

Verify: `npm run test:readiness` → `saleor-catalog` pass; `/shop` count ≠ 120; no `picsum.photos`.

**Code done:** `guardMockCatalogFallback()`; cart line qty/remove wired; listing quick-add passes Saleor `variantId` (`@saleor-migration`).

### Prod checkout {#prod-checkout}

Code wired — **partial** until Payment App is enabled on the Saleor channel (ops).

| Step                                              | Owner        | Status |
| ------------------------------------------------- | ------------ | ------ |
| Configure payment gateway in Saleor channel       | Saleor admin | **ops** |
| Uncomment `@saleor-migration` blocks in checkout  | Code         | **done** |
| Replace `/checkout` placeholder UI                | Code         | **done** |
| Stripe Elements client scaffold on `/checkout`    | Code         | **done** |
| Pay button gated on shipping + gateway init       | Code         | **done** |
| `transactionProcess` return URL `/checkout/payment/complete` | Code | **done** |
| `npm run test:readiness` → `saleor-checkout` pass | CI / local   | pending ops |

Routes: `POST /checkout/shipping`, `/checkout/payment/initialize`, `/checkout/payment/process`, `GET /checkout/payment/complete` (3DS return), `/checkout/complete`.

See [saleor-payments.md](../../commerce/saleor-payments.md).

### Prod media uploads {#prod-media-uploads}

1. Apply `supabase/migrations/20250630120000_media_assets.sql`.
2. Confirm Storage policies for `ugc/{user_id}/`.
3. Sign in on staging → `/loyalty` → review photo upload → `/admin/testimonials`.

### Prod content {#prod-content}

| Service | Env vars                                 | Task                                                                                       |
| ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Ghost   | `GHOST_URL`, `GHOST_CONTENT_API_KEY`     | Blog + guides from CMS (IP-015)                                                            |
| YouTube | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | Apply `20250630160000_youtube_sync.sql`; cron `POST /api/cron/youtube-sync` with header `x-youtube-sync-secret` matching `YOUTUBE_SYNC_SECRET` |

**Code done:** Homepage UGC from approved testimonials when Supabase configured. `guardMockGhostFallback()` for Ghost loaders (AUD-P1-009). Live YouTube Data API sync with Supabase upsert; `/watch` prefers synced `videos` rows when present (IP-007, IP-014).

### Prod CDN {#prod-cdn}

| Variable              | Notes                                     |
| --------------------- | ----------------------------------------- |
| `PUBLIC_CDN_BASE_URL` | CloudFront or Supabase public URL — **read URLs wired** via `resolveUgcPublicUrl` |
| `S3_*`, `AWS_*`       | Presigned upload + invalidation (deferred) |

**Code done (read path):** `src/lib/server/media/cdn.ts` — `resolveCdnUrl`, `resolveUgcPublicUrl`, `isCdnPublicReadConfigured`. Media repository uses CDN URLs when `PUBLIC_CDN_BASE_URL` is set. Presigned PUT + CloudFront invalidation remain commented (`@migration`).

v1 uses Supabase Storage; migrate when traffic warrants.

### CI hygiene

```bash
bash scripts/check-secrets.sh
npm run format
npm run lint
npm run test:unit
```

---

_Last updated: June 30, 2026 (batch next-steps recorded)_
