# Architecture & Product Decisions

Persistent memory for major choices made during build-out. Minor implementation details live in code and the [style guide](../style-guide/README.md).

---

## North Star

**Animal Garage** unifies culture merch, parts discovery, community, and on-domain media in one SvelteKit headless storefront — with more animation, personality, and gamification than typical automotive retail sites.

---

## Stack (unchanged)

| Layer      | Choice                                                | Rationale                                                                                       |
| ---------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Frontend   | SvelteKit 2 / Svelte 5 / Tailwind v4                  | Already scaffolded; best-in-class for animated UX                                               |
| Commerce   | Saleor GraphQL (env-gated catalog + cart scaffold)    | Headless, international channels, gift cards, attributes for fitment; mock fallback without env |
| Auth / CMS | Supabase (`@supabase/ssr`, PKCE OAuth)                | Auth, builds, garage XP, newsletter; mock fallback without env                                  |
| Media      | S3 + CloudFront (env placeholders)                    | CDN URLs via `PUBLIC_CDN_BASE_URL`; picsum for prototype                                        |
| Motion     | CSS transitions + `AnimatedReveal`; no Motion One yet | Avoid new deps until needed; CSS sufficient for Phase 2                                         |

---

## Information Architecture

### Top-level nav (mega-menu)

| Section                                                        | Pattern source            | Route                                                 |
| -------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| Shop (Apparel, Accessories, Auto, Home, Clearance, Gift Cards) | Culture merch brands      | `/shop`, `/shop?category=`                            |
| Parts (Wheels, Suspension, Exhaust, Engine, …)                 | Parts retailers           | `/parts`, `/parts/[category]`                         |
| Media / Watch                                                  | Media-first brands        | `/media`, `/watch`                                    |
| Builds                                                         | Community-first retailers | `/builds`, `/builds/[slug]`                           |
| Guides & Blog                                                  | Education-led retailers   | `/guides`, `/blog`                                    |
| Tools                                                          | Fitment retailers         | `/tools/tire-calculator`, `/tools/fitment-visualizer` |
| Deals (Pit Lane Deals)                                         | Promotional deal modals   | `/deals`                                              |
| Brands                                                         | Brand-lane discovery      | `/brands`, `/brands/[slug]`                           |
| Loyalty (Garage Squad)                                         | Loyalty + gamification    | `/loyalty`                                            |
| Events                                                         | Campaign-driven brands    | `/events`                                             |
| Auth                                                           | Standard e-commerce       | `/auth/sign-in`, `/account`                           |
| Admin                                                          | Internal ops              | `/admin`                                              |

### Footer programs

Loyalty, wholesale inquiry, military discount, shipping/refund/privacy policies, newsletter, social links, Discord support CTA (no interrupt modal).

---

## Feature Decisions

### Promo bar

Dual rotating messages from `mock/banners.ts`. Dismissible per session via `sessionStorage`. Free-ship threshold and drop countdown linked to active campaign.

### Mega-menu

Image-backed category grid in flyout. Collections pulled from `mock/collections.ts`. Parts categories from `mock/part-categories.ts`. Click on Shop/Parts label navigates to hub page; hover opens menu.

### Cart drawer

Client-side cart store (`cart.svelte.ts`) with localStorage persistence. Single drawer instance in Header (not duplicated in layout).

### Locale / international

Existing `LocaleSelector` in header. 20+ countries in `mock/locales.ts`. Saleor channel mapping documented, not wired.

### Sold-out & scarcity

Black badge on grid cards. Notify-me form on PDP (Supabase later).

### Gift cards

Dedicated `/gift-cards` route. Denominations $25–$200.

### YMM vehicle selector

Homepage hero: Year → Make → Model → Submodel from `mock/vehicles.ts`. Submit navigates to `/parts?ymm=...`.

### Build threads

Gallery + detail with "Shop this build" linked products from full catalog (`mock/products` + `mock/parts`).

### Pit Lane Deals

Sign-in required — unauthenticated requests to `/deals` redirect to `/auth/sign-in?redirect=/deals`. Nav link shows a lock icon when logged out and points to the same sign-in URL. Always has content for authenticated users — curated sale fallback if no active deals. Badge in nav.

### Mobile navigation

Collapsible accordion sections (Shop, Parts, Builds, Watch) mirror desktop mega-menu categories. Query-param routes use `resolvePath()`. Sign In appears in the mobile header icon row below `sm` breakpoint.

### Video hub

Grid + detail panel with extended description and shoppable products. YouTube channels managed in `/admin/youtube` with auto-sync stub.

### Auth & admin

Supabase auth at `/auth/*`. Admin RBAC at `/admin` with roles: admin, editor, contributor, customer.

**OAuth architecture (June 2026):** Generic provider union (`google` | `discord` | `azure`) in `src/lib/auth/oauth.ts`. Browser sign-in uses `@supabase/ssr` PKCE via `signInWithOAuth` in `auth-client.ts`; `/auth/callback` exchanges the authorization code with `exchangeOAuthCode`. Mock `ag-session` cookie when env vars are unset; live sessions use Supabase auth cookies. Provider secrets configured in Supabase Dashboard. See [oauth.md](../auth/oauth.md).

**Local-only dev auth (June 2026):** Quick-login accounts (`admin@local.dev`, etc.) and `DEV_ADMIN` bypass run only on localhost when `import.meta.env.DEV` or `LOCAL_DEV_AUTH=true`, and never when `PUBLIC_SITE_URL` or request host is production. Predefined accounts in `src/lib/server/auth/local-dev-accounts.ts`; guards in `local-dev.ts`. Production admin uses `scripts/promote-admin.ts` + `app_metadata.role`. See [integrations/supabase.md](../integrations/supabase.md).

**Org deploy mirror (June 2026):** Netlify deploys from `<organization>/<deploy-repo>` @ `main`, synced from the personal fork via organization deploy key (secret name in `.env.example` / maintainer runbook only). Mirror script excludes `.github/workflows` because deploy keys cannot push workflow files; CI stays on the personal repo only. Sync workflow lives on **`main`** branch. See [deployment.md](../style-guide/backend-ops/deployment.md).

---

## UX Anti-Patterns (do NOT implement)

- No sales chat popup on page load
- No empty promo/deals modals
- No split merch/parts checkout domains
- No competitor references in public docs or commits

---

## Catalog: Merch vs Parts

Products share a single `Product` type but belong to one of two catalog kinds, derived from Saleor `productType`:

| `productType`                     | `CatalogKind` | Route pattern              |
| --------------------------------- | ------------- | -------------------------- |
| `PART`                            | `PARTS`       | `/parts/[category]/[slug]` |
| `STANDARD`, `GIFT_CARD`, or unset | `MERCH`       | `/shop/[slug]`             |

Helpers in `catalog-helpers.ts` (`getCatalogKind`, `getProductPath`, `getCatalogProductById`, `filterByCatalogKind`) centralize path generation and cross-catalog lookups. Related products and cart upsells stay within the same catalog kind. UI badges (`CatalogKindBadge`) distinguish items in cart and search; product cards show a Part badge only for parts.

---

## Migration scaffolds (`@inspiration-scaffold` / `@migration`)

Commented code tagged `@inspiration-scaffold`, `@migration`, or `@saleor-migration` is **intentional** — it marks swap points for inspiration backlog and Saleor catalog/checkout work tracked in [inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md) (`#IP-###`) and [BLOCKERS.md](../BLOCKERS.md) / [STATUS.md](../STATUS.md). Agents (especially `polish-sweep`) must **not** delete these blocks during cleanup; uncomment when the linked env, migration, or payment gateway is ready. `@saleor-migration` details: [commerce/saleor.md](../commerce/saleor.md).

---

## E2E testing scope (June 2026)

Agents default to **unit tests on touched modules only**. Full Playwright runs, preview server startup, and `docs/testing/e2e-manual-pass-*.md` updates are reserved for **explicit e2e tasks** with a single dedicated worker — not polish-sweep or routine feature work. Prevents back-to-back full e2e audits across subagents. See [e2e-policy.md](../testing/e2e-policy.md).

---

## Deferred

- Checkout completion, payment, shipping (Saleor) — [IP-003](../plans/active/inspiration-polish-tracker.md#ip-003)
- Promo / voucher redeem UX — **done** ([IP-018](../plans/active/inspiration-polish-tracker.md#ip-018))
- `@motionone/svelte`
- PIM / 100k SKU parts catalog
- UGC media uploads Phase 2+ (plan in [plans/active/media-uploads.md](../plans/active/media-uploads.md))

See [inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md) for open work and [inspiration.md](./inspiration.md) for research backlog (built items only).

---

_Last updated: June 30, 2026 — inspiration-polish consolidation_
