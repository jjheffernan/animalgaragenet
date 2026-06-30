**Status:** Partial — Phase 0 code done (ops pending); Phase 3 UGC/builds wired; Phases 1–2 ops-only

# Market readiness roadmap

**Audit date:** 2026-06-30  
**Production URL:** https://<your-preview-host>  
**Branch:** `dev`  
**Launch criterion:** Zero mock data on production paths when external services are configured.

---

## Production snapshot (2026-06-30)

| Route           | Status   | Observation                                                                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/`             | Live     | Homepage UGC from approved `testimonials` when Supabase configured; otherwise mock fallback. Videos, builds, campaigns still mock. |
| `/shop`         | Live     | **120 items** — exact count of `mockProducts`; names match mock catalog (`Garage Flag Tee`, `Redline Hoodie`, etc.)                |
| `/auth/sign-in` | Live     | OAuth + magic link UI; no dev quick-login (correct for Netlify host)                                                               |
| `/cart`         | Live     | Empty cart; “You Might Also Like” shows mock staff picks                                                                           |
| `/loyalty`      | Live     | Gated — “Sign in required”                                                                                                         |
| `/account`      | Redirect | → `/auth/sign-in?redirect=/account` (no session)                                                                                   |
| `/admin`        | Redirect | → `/auth/sign-in?redirect=/admin` (no session)                                                                                     |

**Conclusion:** Netlify deploy is serving the **full mock catalog and mock content layer**. Either `PUBLIC_SALEOR_API_URL` is unset, or Saleor queries fail and loaders silently fall back to mock (see `getShopProducts()` catch block in `src/lib/server/catalog/products.ts`).

---

## Code audit — mock vs live when env IS set

### Saleor catalog (server loaders — env-gated)

| Loader                  | File                         | Live when `PUBLIC_SALEOR_API_URL` set | Silent mock fallback on error |
| ----------------------- | ---------------------------- | ------------------------------------- | ----------------------------- |
| Shop list/detail        | `catalog/products.ts`        | ✅                                    | Guarded on prod               |
| Shop category filters   | `catalog/shop-filters.ts`    | ✅                                    | Guarded on prod               |
| Parts hub/detail        | `catalog/parts.ts`           | ✅                                    | Guarded on prod               |
| Collections             | `catalog/collections.ts`     | ✅                                    | Guarded on prod               |
| Staff picks / clearance | `+page.server.ts` (homepage) | ✅                                    | Guarded on prod               |
| Gift cards / deals      | `catalog/products.ts`        | ✅                                    | Guarded on prod               |
| Catalog search API      | `catalog/search.ts`          | ✅                                    | Guarded on prod               |

**Production guard (June 2026):** `guardMockCatalogFallback()` throws `CatalogUnavailableError` on production hostname when Saleor is unset or query fails — no silent mock catalog on Netlify. Local dev still uses mock fallback.

### Always mock (even when Saleor env set)

| Surface                      | Location                            | Notes                                                                 |
| ---------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| Homepage UGC wall            | `+page.server.ts`, `UGCWall.svelte` | Approved `testimonials` when Supabase set; else `mockUGC`             |
| Homepage videos              | `+page.server.ts`, `mock/videos.ts` | picsum thumbnails                                                     |
| Build threads (public)       | `routes/builds/*`                   | Approved `build_submissions` when Supabase set; else `mock/builds.ts` |
| Brands / parts nav           | `brands/*`, `parts-nav.ts`          | `mock/brands.ts`, `mockPartCategories`                                |
| Events                       | `routes/events/*`                   | `mock/events.ts`                                                      |
| Blog / guides                | `server/ghost/posts.ts`             | Ghost when `GHOST_*` set; else mock + picsum fallback                 |
| Deals banners                | `getActiveDeals()`                  | Mock promo banners                                                    |
| Search (parts/builds/guides) | `SearchModal.svelte`                | Always mock                                                           |
| Hero / campaigns             | `Hero.svelte`, `PromoBar.svelte`    | Mock campaigns; picsum hero                                           |
| About page                   | `about/+page.svelte`                | Hardcoded picsum                                                      |
| Admin users/media            | `admin/*`                           | Mock admin lists                                                      |
| YouTube sync                 | `youtube/sync.ts`                   | **Stub** — returns `mockVideos`                                       |
| Account orders               | `account/+page.svelte`              | `mock/orders.ts`                                                      |

### Cart & checkout

| Mode          | Trigger                       | Storage                                            |
| ------------- | ----------------------------- | -------------------------------------------------- |
| Mock cart     | `PUBLIC_SALEOR_API_URL` unset | `localStorage` key `ag-cart`                       |
| Saleor cart   | URL set                       | `ag-checkout-id` httpOnly cookie + Saleor checkout |
| Mock promo    | Saleor disabled               | `ag-mock-promo` cookie                             |
| Checkout page | —                             | Placeholder — no payment / `CHECKOUT_COMPLETE`     |

Cart remove/qty is **no-op** when Saleor enabled. Listing-card add-to-cart still falls back to mock `getCatalogProductById()` when `variantId` is missing.

### Auth fallback (`hooks.server.ts`)

```ts
// When Supabase keys unset on non-production host:
event.locals.session = parseSessionCookie(event.cookies.get(SESSION_COOKIE));
// When Supabase keys unset on production hostname:
event.locals.session = null; // no mock ag-session
```

On production with Supabase **unset**, sign-in shows `productionAuthMisconfigured` and **does not** persist mock `ag-session` cookies. Configure Netlify env vars before launch.

Magic link / OAuth `redirectTo` is built from `config.siteUrl` (`PUBLIC_SITE_URL`), **not** the request origin — mismatch with Netlify preview domain breaks callbacks.

---

## Security audit summary

| Check                                   | Status                | Notes                                                                                                  |
| --------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY` server-only | ✅ Pass               | Only in `src/lib/server/**`, `scripts/promote-admin.ts`, `scripts/test-readiness.ts`                   |
| `PUBLIC_*` vars safe                    | ✅ Pass               | Anon key, Saleor URL, site URL — intended for browser                                                  |
| `DEV_ADMIN` production guard            | ✅ Pass               | `isProductionHostname()` blocks custom domain and `*.netlify.app` (`src/lib/server/auth/local-dev.ts`) |
| `LOCAL_DEV_AUTH` production guard       | ✅ Pass               | Localhost-only via `isLocalDevAuthEnabled()`; blocked when `isProductionSiteUrl()`                     |
| Supabase redirect URLs                  | ❓ Unverified         | Must include preview and custom-domain `/auth/callback` URLs (see account-flow-fix)                    |
| RLS on tables                           | ✅ Migrations present | `profiles`, `build_submissions`, `testimonials` — all `enable row level security`                      |
| `build_submissions` insert policy       | ✅ Done               | RLS requires `auth.uid() = user_id`; server honeypot + rate limit on submit actions                    |
| `scripts/check-secrets.sh`              | ✅ Pass               | Client bundle `SERVICE_ROLE` scan; blocks `DEV_ADMIN` in tracked deploy config (commit `ce05185`)      |
| Silent mock fallback                    | ⚠️ Partial            | `guardMockCatalogFallback()` on catalog loaders + search; homepage and non-catalog surfaces still mock |

---

## Phased roadmap

### Phase 0 — Account flow fix (P0)

**Goal:** Signed-in users see Account menu on Netlify; magic link and OAuth complete; admin bootstrap works.

See **[account-flow-fix.md](./account-flow-fix.md)** for the detailed plan.

| Task                                                                                            | Owner hint                  |
| ----------------------------------------------------------------------------------------------- | --------------------------- |
| Set Netlify env: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Netlify dashboard           |
| Set `PUBLIC_SITE_URL` to the **active** deploy URL (Netlify now; `<your-site-host>` at cutover) | Netlify                     |
| Add Supabase redirect URLs for both domains                                                     | Supabase dashboard          |
| Run `promote-admin.ts` for first admin                                                          | Local CLI with prod secrets |
| Extend `isProductionHostname()` to include `*.netlify.app`                                      | Code — security             |
| Verify session in header after sign-in                                                          | Manual QA                   |

**Env vars**

| Variable                    | Required                 |
| --------------------------- | ------------------------ |
| `PUBLIC_SUPABASE_URL`       | ✅                       |
| `PUBLIC_SUPABASE_ANON_KEY`  | ✅                       |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (server)              |
| `PUBLIC_SITE_URL`           | ✅ — must match live URL |

**Acceptance criteria**

- [ ] Header shows Account dropdown (not “Sign In”) after magic link or OAuth on `<your-preview-host>`
- [ ] `/account` loads dashboard when authenticated
- [ ] `/admin` accessible after `promote-admin.ts` + re-login
- [ ] No `ag-session` cookie on production (Supabase session cookies only)
- [ ] `DEV_ADMIN` and `LOCAL_DEV_AUTH` unset in Netlify

---

### Phase 1 — Full Saleor catalog on Netlify (no mock)

**Goal:** Shop, parts, collections, deals, gift cards served from Saleor; no picsum product images.

| Task                                                                     | File / area                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------- |
| Set `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` on Netlify                 | Netlify env                                               |
| Run `npm run test:readiness` — `saleor-catalog` + `saleor-checkout` pass | CI / local                                                |
| Remove or gate silent mock fallback in production                        | `catalog/*.ts` — log error + empty state or `SITE_LOCKED` |
| Fix listing-card add-to-cart (`variantId` on `ProductCard`)              | Components + cart store                                   |
| Wire collection product edges                                            | `catalog/collections.ts`                                  |
| Replace client-side shop category heuristics with Saleor collections     | `catalog-helpers.ts`                                      |
| Run `saleor-readiness` agent against `<your-saleor-host>`                | Docs                                                      |

**Env vars**

| Variable                | Required                       |
| ----------------------- | ------------------------------ |
| `PUBLIC_SALEOR_API_URL` | ✅                             |
| `SALEOR_CHANNEL`        | ✅ (default `default-channel`) |

**Acceptance criteria (“no mock data”)**

- [ ] `/shop` item count ≠ 120 (matches Saleor product count)
- [ ] Product images from Saleor/CDN — **no `picsum.photos` in network tab** on `/shop`
- [ ] Product slugs resolve from Saleor; removing a Saleor product removes it from site
- [ ] Staff picks / clearance filter Saleor `tags` metadata
- [ ] `npm run test:readiness` → `saleor-catalog` pass

---

### Phase 2 — Checkout & payment

**Goal:** End-to-end purchase via Saleor checkout.

| Task                                       | Notes                                        |
| ------------------------------------------ | -------------------------------------------- |
| Cart line update / remove mutations        | `checkoutLinesUpdate`, `checkoutLinesDelete` |
| Shipping address + methods                 | Saleor checkout API                          |
| Payment gateway + `CHECKOUT_COMPLETE`      | Saleor payment app                           |
| Replace `/checkout` placeholder            | Real redirect to payment                     |
| Remove mock promo path when Saleor enabled | `checkout/promo.ts`                          |
| Order history from Saleor                  | Replace `mock/orders.ts` on `/account`       |

**Env vars:** Same as Phase 1 + payment provider secrets in Saleor (not SvelteKit).

**Acceptance criteria**

- [ ] Add to cart from listing cards works with Saleor `variantId`
- [ ] Checkout creates Saleor order; no `localStorage` cart when Saleor enabled
- [ ] Promo codes redeem via Saleor (not `ag-mock-promo`)
- [ ] `npm run test:readiness` → `saleor-checkout` pass

---

### Phase 3 — Ghost, Supabase UGC, CDN

**Goal:** Content and community data from real backends.

| Task                                                    | Service                              |
| ------------------------------------------------------- | ------------------------------------ |
| Wire Ghost for blog + guides                            | `GHOST_URL`, `GHOST_CONTENT_API_KEY` |
| Replace homepage UGC with approved `testimonials`       | Supabase                             |
| Replace public builds with approved `build_submissions` | Supabase                             |
| Implement YouTube sync (replace stub)                   | `YOUTUBE_API_KEY`                    |
| Phase 1 media uploads (reviews, build photos)           | S3 + `PUBLIC_CDN_BASE_URL`           |
| Remove picsum from Ghost mapper fallback in production  | `ghost/mappers.ts`                   |

**Env vars**

| Variable                                 | Purpose        |
| ---------------------------------------- | -------------- |
| `GHOST_URL`, `GHOST_CONTENT_API_KEY`     | Blog/guides    |
| `PUBLIC_CDN_BASE_URL`, `S3_*`, `AWS_*`   | Media delivery |
| `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | Video sync     |

**Acceptance criteria**

- [ ] `/guides` and `/blog` posts from Ghost; mock titles absent
- [x] Homepage UGC from `testimonials` where `status = 'approved'` (mock fallback when Supabase unset)
- [x] `/builds` from approved `build_submissions` (mock fallback when Supabase unset or empty)
- [ ] No picsum URLs on homepage, shop, or guides in production
- [ ] `npm run test:readiness` → `ghost-cms`, `supabase-db`, `cdn-s3` pass

---

### Phase 4 — Security hardening before public launch

**Goal:** Production-safe defaults before `<your-site-host>` cutover.

| Task                                                                                                                | Priority |
| ------------------------------------------------------------------------------------------------------------------- | -------- |
| Block `*.netlify.app` and custom domain in `isProductionHostname()`                                                 | P0       |
| Add production guard: refuse mock auth when `PUBLIC_SITE_URL` is HTTPS non-localhost                                | P0       |
| Replace silent Saleor/Ghost mock fallback with explicit error boundary                                              | P0       |
| Tighten `build_submissions` insert policy (rate limit / captcha / honeypot)                                         | P1       | **done** — honeypot + rate limit; migration drops anon insert |
| Extend `check-secrets.sh`: grep client bundle for `SERVICE_ROLE`, fail on `DEV_ADMIN=true` in tracked deploy config | Done     |
| Optional: `readiness-ci` GitHub Action with Netlify secrets                                                         | P2       |
| `SITE_LOCKED=true` during preview; admins pass through                                                              | Ops      |
| Rotate `<org-sync-secret>` documented                                                                               | Ops      |
| OAuth providers verified (`oauth-google/discord/azure` probes)                                                      | P1       |
| Final RLS audit on any new tables                                                                                   | P1       |

**Acceptance criteria**

- [ ] `DEV_ADMIN=true` on Netlify does **not** grant admin (even on `netlify.app`)
- [x] `scripts/check-secrets.sh` passes; extended checks added
- [x] No mock session path reachable on production hostname (`hooks.server.ts`)
- [ ] All `supabase/migrations/*` applied to production project
- [ ] Security review agent sign-off

---

## Related docs

- [account-flow-fix.md](./account-flow-fix.md) — Phase 0 detail
- [../../audits/saleor-audit.md](../../audits/saleor-audit.md) — Saleor wiring inventory
- [../../testing/external-dependencies.md](../../testing/external-dependencies.md) — Integration registry
- [../../testing/readiness-report.md](../../testing/readiness-report.md) — Live probe results
- [../../integrations/supabase.md](../../integrations/supabase.md) — Auth, RLS, Netlify env
- [media-uploads.md](./media-uploads.md) — CDN phase plan
