# Inspiration & polish tracker

**Status:** Active — canonical open-work tracker  
**Replaces:** `inspiration-implementation-tracker.md`, `inspiration-polish-coordination.md`, `meta/polish-plan.md`, `inspiration-polish-prod-setup.md`  
**Backlog (built items):** [inspiration.md](../../meta/inspiration.md)  
**Audit / security:** [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md) — do not duplicate CI/security rows here

Markers: `@inspiration-scaffold` (Supabase/community/CMS) · `@saleor-migration` (commerce) — [decisions.md](../../meta/decisions.md#agent-scaffold-markers). Do not remove unless wiring that step.

---

## Tracker

| ID     | Source              | Feature                                      | Scaffold path(s)                                                                 | Status        | Prod setup                                                          |
| ------ | ------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| IP-001 | polish / AUDIT      | Supabase auth on Netlify preview             | —                                                                                | **blocked**   | [§ Auth](#prod-auth)                                                |
| IP-002 | inspiration / AUDIT | Live Saleor product catalog                    | `src/lib/server/catalog/*.ts` (`@saleor-migration`)                              | **blocked**   | [§ Saleor catalog](#prod-saleor-catalog)                            |
| IP-003 | inspiration / AUDIT | Checkout + payment (Stripe via Saleor)       | `src/lib/server/saleor/checkout*.ts`, `routes/checkout/` (`@saleor-migration`)   | **blocked**   | [§ Checkout](#prod-checkout)                                        |
| IP-004 | inspiration         | Notify-me restocks → Supabase                | `src/lib/server/restock/repository.ts`, `POST /api/restock/notify`               | **scaffolded** | Apply `20250630210000_restock_alerts.sql`; Saleor stock webhook   |
| IP-005 | inspiration         | Collection shop filters (`?collection=`)     | `src/lib/server/catalog/shop-collection.ts`                                      | **scaffolded** | Uncomment `COLLECTION_PRODUCTS_QUERY` when Saleor live            |
| IP-006 | inspiration         | Campaign hero / homepage CMS                 | `src/lib/server/featured-sections/repository.ts`, `/admin/featured`              | **scaffolded** | `20250630150000_content_metadata.sql`; seed `hero` row              |
| IP-007 | inspiration / AUDIT | YouTube channel auto-sync                    | `src/lib/server/youtube/repository.ts`, `youtube/sync.ts`, `/api/cron/youtube-sync` | **scaffolded** | [§ Content](#prod-content)                                          |
| IP-008 | inspiration         | Newsletter → Supabase                        | `src/lib/server/newsletter/repository.ts`, `POST /api/newsletter/subscribe`      | **scaffolded** | `20250630140000_newsletter_subscribers.sql`                         |
| IP-009 | inspiration         | Garage Squad XP (off localStorage)           | `src/lib/server/user-preferences/repository.ts`, `POST /api/account/garage`      | **scaffolded** | `20250630230000_account_garage_xp.sql`; wire `garage-xp.svelte.ts` |
| IP-010 | inspiration         | Saved vehicle garage (persist YMM)           | `user-preferences/repository.ts`, `GET/PUT /api/account/garage`                  | **scaffolded** | Same migration; wire `garage.svelte.ts`                             |
| IP-011 | inspiration         | Wholesale application workflow               | `src/lib/server/wholesale/repository.ts`, `/wholesale`                            | **scaffolded** | `20250630220000_wholesale_inquiries.sql`                            |
| IP-012 | inspiration / AUDIT | Account order history (Saleor mirror)        | `src/lib/server/orders/snapshots.ts`, `routes/account/orders/`                   | **scaffolded** | `20250630170000_order_snapshots.sql` + Saleor webhook               |
| IP-013 | inspiration         | CDN Phase 2 (S3 + CloudFront)                | `src/lib/server/media/cdn.ts`                                                    | **deferred**  | [§ CDN](#prod-cdn)                                                  |
| IP-014 | inspiration         | Watch hub — DB videos + shoppable            | `src/routes/watch/+page.server.ts`                                               | **scaffolded** | Depends IP-007                                                    |
| IP-015 | inspiration / AUDIT | Ghost blog + guides (live CMS)               | `src/lib/server/ghost/posts.ts`                                                  | **blocked**   | [§ Content](#prod-content)                                          |
| IP-016 | polish              | Review photo uploads (media Phase 1)         | `src/lib/server/media/repository.ts`, `ReviewPhotoUpload.svelte`                 | **done**      | [§ Media uploads](#prod-media-uploads)                                |
| IP-017 | polish              | Account dropdown + production auth guards    | `AccountMenu.svelte`, `local-dev.ts`, `hooks.server.ts`                          | **done**      | Do not set `DEV_ADMIN` / `LOCAL_DEV_AUTH` on Netlify               |
| IP-018 | polish              | Saleor redeem + cart promo                   | `src/routes/account/redeem/`, `checkout/promo.ts`                                | **done**      | Saleor vouchers in admin                                            |
| IP-019 | polish / AUDIT      | CI Prettier / format drift                   | —                                                                                | **open**      | `npm run format` before push                                        |
| IP-020 | inspiration         | Build thread submit → Supabase               | `src/lib/server/build-logs/repository.ts`, `/admin/builds`                       | **live**      | Apply `build_submissions` migration                                 |
| IP-021 | inspiration         | UGC testimonials + moderation                | `testimonials/repository.ts`, `/admin/testimonials`                              | **live**      | Supabase Storage bucket `ugc`                                       |
| IP-022 | inspiration         | Featured sections admin editor               | `/admin/featured`                                                                  | **scaffolded** | Staff JWT (`editor`/`admin`)                                        |
| IP-023 | inspiration         | Multi-channel international pricing          | `src/lib/server/saleor/channels.ts` (`@saleor-migration`)                        | **scaffolded** | Map locales in Saleor admin                                         |
| IP-024 | inspiration         | Shipping zones + threshold promos            | —                                                                                | **not started** | Saleor shipping + promotion rules                                   |
| IP-025 | inspiration         | Supabase-backed admin user CRUD              | `src/lib/server/supabase/admin-users.ts`, `/admin/users`                         | **partial**   | Service role + `promote-admin.ts`                                   |
| IP-026 | inspiration         | Deal / campaign scheduler (Pit Lane CMS)     | `/deals` mock                                                                    | **not started** | CMS table TBD                                                       |
| IP-027 | inspiration         | Faceted parts search                         | —                                                                                | **not started** | Saleor attributes                                                   |
| IP-028 | inspiration         | `@motionone/svelte` scroll system            | —                                                                                | **not started** | animation-media.md                                                  |

**Row count:** 28

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

**Code done:** `guardMockCatalogFallback()`; cart line qty/remove wired (`@saleor-migration`).

### Prod checkout {#prod-checkout}

Blocked on Saleor payment app (Stripe/PayPal in Saleor admin).

| Step                                              | Owner        |
| ------------------------------------------------- | ------------ |
| Configure payment gateway in Saleor channel       | Saleor admin |
| Uncomment `@saleor-migration` blocks in checkout  | Code         |
| Replace `/checkout` placeholder UI                | Code         |
| `npm run test:readiness` → `saleor-checkout` pass | CI / local   |

See [saleor-payments.md](../../commerce/saleor-payments.md).

### Prod media uploads {#prod-media-uploads}

1. Apply `supabase/migrations/20250630120000_media_assets.sql`.
2. Confirm Storage policies for `ugc/{user_id}/`.
3. Sign in on staging → `/loyalty` → review photo upload → `/admin/testimonials`.

### Prod content {#prod-content}

| Service | Env vars                                 | Task                                   |
| ------- | ---------------------------------------- | -------------------------------------- |
| Ghost   | `GHOST_URL`, `GHOST_CONTENT_API_KEY`     | Blog + guides from CMS (IP-015)        |
| YouTube | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | Live sync in `youtube/sync.ts` (IP-007) |

**Code done:** Homepage UGC from approved testimonials when Supabase configured.

### Prod CDN {#prod-cdn}

| Variable              | Notes                                     |
| --------------------- | ----------------------------------------- |
| `PUBLIC_CDN_BASE_URL` | CloudFront or Supabase public URL         |
| `S3_*`, `AWS_*`       | Presigned upload + invalidation (IP-013)  |

v1 uses Supabase Storage; migrate when traffic warrants.

### CI hygiene

```bash
bash scripts/check-secrets.sh
npm run lint
npm run test:unit
```

---

_Last updated: June 30, 2026_
