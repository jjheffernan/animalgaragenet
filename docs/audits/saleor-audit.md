# Saleor Integration Audit — June 2026

Readiness assessment for wiring animalgaragenet to the Saleor backend at `<your-saleor-host>`.

## Readiness score: **7 / 10**

Code verification pass (June 29, 2026). **All primary catalog loaders** (shop, parts, gift cards, deals, collections/homepage) use env-gated Saleor swap points with mock fallback. **Locale → channel mapping**, **catalog search API**, and **cart checkout scaffold** (read-only display + add-line) are wired. **Staff picks and clearance** homepage slices now filter Saleor products by `tags` metadata when env is set.

Remaining gaps block production checkout: **line remove/qty mutations**, **`CHECKOUT_COMPLETE` / payment**, **collection product edges**, **shop category heuristics**, and **add-to-cart from listing cards** (no variantId — still needs mock catalog lookup). Non-catalog surfaces (blog, builds, events, deal banners) remain mock-only by design.

---

## Wired vs mock-only inventory

| Surface                    | Swap point / route                                            | Saleor when env set | Mock fallback | Notes                                                                      |
| -------------------------- | ------------------------------------------------------------- | ------------------- | ------------- | -------------------------------------------------------------------------- |
| Shop list                  | `getShopProducts()` → `shop/+page.server.ts`                  | ✅                  | ✅            | Category filter is client-side heuristic, not Saleor collections           |
| Shop detail                | `getShopProductBySlug()` → `shop/[slug]/+page.server.ts`      | ✅                  | ✅            | Related products, linked builds still mock                                 |
| Gift cards                 | `getGiftCardProducts()` → `gift-cards/+page.server.ts`        | ✅                  | ✅            | Filters by metadata `productType`, category slug, slug prefix              |
| Deals products             | `getDealProducts()` → `deals/+page.server.ts`                 | ✅                  | ✅            | Deal promo banners (`getActiveDeals()`) still mock                         |
| Parts hub                  | `getPartsProducts()` → `parts/+page.server.ts`                | ✅                  | ✅            | Nav taxonomy (`mockPartCategories`) stays mock                             |
| Parts category             | `getPartsByCategory()` → `parts/[category]/+page.server.ts`   | ✅                  | ✅            | Filters Saleor list by `category.slug`                                     |
| Part detail                | `getPartBySlug()` → `parts/[category]/[slug]/+page.server.ts` | ✅                  | ✅            | Related products still mock                                                |
| Collections list           | `getCollections()` → `+page.server.ts`, `+layout.server.ts`   | ✅                  | ✅            | `products[]` on each collection empty (metadata only)                      |
| Staff picks                | `getStaffPickProducts()` → `+page.server.ts`                  | ✅                  | ✅            | Filters Saleor by `tags` includes `staff-pick`                             |
| Clearance                  | `getClearanceProducts()` → `+page.server.ts`                  | ✅                  | ✅            | Filters Saleor by `tags` includes `clearance`                              |
| Catalog search (merch)     | `searchCatalog()` → `api/catalog/search`                      | ✅                  | ✅            | Client-side filter on fetched list (first 100)                             |
| Search parts/builds/guides | `searchCatalog()`                                             | ❌                  | ✅            | Content not in Saleor — always mock                                        |
| Cart display               | `getCheckoutLines()` → `cart/+page.server.ts`                 | ✅                  | localStorage  | Read-only when checkout cookie present                                     |
| Cart add line              | `POST /cart/checkout`                                         | ✅                  | localStorage  | Detail pages pass Saleor `variantId`; listing cards still need mock lookup |
| Cart remove/qty            | `cart.svelte.ts`                                              | ❌                  | ✅            | No-op when Saleor enabled                                                  |
| Checkout page              | `/checkout`                                                   | ❌                  | placeholder   | No payment / `CHECKOUT_COMPLETE`                                           |
| Homepage other             | videos, UGC, builds, brands, campaigns                        | ❌                  | ✅            | Not in Saleor scope                                                        |

---

## Already wired (implementation)

| Area                 | Location                                                                                 | Status                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| GraphQL fetch client | `src/lib/server/saleor/client.ts`                                                        | Graceful no-op when `PUBLIC_SALEOR_API_URL` unset; `isSaleorEnabled()` gate                     |
| Channel helper       | `getSaleorChannel()`, `getChannelForLocale()`                                            | `SALEOR_CHANNEL` + per-locale map (`en-US`→`us`, `en-GB`→`eu`, `ja-JP`→`jp`)                    |
| Catalog queries      | `src/lib/server/saleor/queries.ts`                                                       | `PRODUCTS_QUERY`, `PRODUCT_BY_SLUG_QUERY`, `COLLECTIONS_QUERY` — includes metadata + attributes |
| Product mappers      | `src/lib/server/saleor/mappers.ts`                                                       | `mapProduct`, `mapProductListNode`, `mapCollection` (+ unit tests)                              |
| Metadata parser      | `src/lib/server/saleor/metadata.ts`                                                      | `productType`, `fitment`, `brand`, `tags`, `compareAtPrice` (+ unit tests)                      |
| Catalog swap points  | `src/lib/server/catalog/products.ts`, `parts.ts`, `collections.ts`, `search.ts`          | Env-gated with mock fallback on error                                                           |
| Checkout scaffold    | `checkout-queries.ts`, `checkout.ts`, `cart/+page.server.ts`, `cart/checkout/+server.ts` | Create checkout, add line, read lines; httpOnly `ag-checkout-id` cookie                         |
| Cart store           | `src/lib/stores/cart.svelte.ts`                                                          | Dual mode: Saleor POST vs localStorage `ag-cart`                                                |
| Env config           | `src/lib/config/env.ts`, `.env.example`                                                  | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` documented                                            |

---

## Top remaining gaps

1. **Checkout completion & payment** — No `CHECKOUT_COMPLETE`, shipping address, shipping methods, or payment redirect. `/checkout` is a UI placeholder.
2. **Cart line mutations** — Remove and quantity update are no-ops when Saleor is enabled; need `checkoutLinesUpdate` / `checkoutLinesDelete` mutations + API routes.
3. **Add-to-cart from listing cards** — `ProductCard` calls `cart.addItem(product.id)` without `variantId`. Saleor path still falls back to mock `getCatalogProductById()` when variantId is missing (fixed for detail pages that pass variantId).
4. **Collection product edges** — `getCollections()` returns metadata-only; `products[]` empty until collection product query is added.
5. **Shop category filter** — `filterProductsByShopCategory()` uses name/slug heuristics (`tee`, `hoodie`, etc.); should use Saleor collections or category tree.

### Additional gaps (lower priority)

- Deal promo banners (`getActiveDeals()`) — CMS/marketing, not Saleor
- Search parts/builds/guides — always mock
- Product detail related products, linked builds — mock helpers
- Parts YMM filter — URL params not applied against Saleor `fitment` metadata
- No integration tests against live `<your-saleor-host>` (env-gated only)
- Search v1 fetches first 100 products then client-filters — needs Saleor search API for scale

---

## Loader swap checklist

### Shop (merch)

| Loader         | File                                     | Status                                             |
| -------------- | ---------------------------------------- | -------------------------------------------------- |
| Shop list      | `src/routes/shop/+page.server.ts`        | ✅ `getShopProducts()` — category filter heuristic |
| Product detail | `src/routes/shop/[slug]/+page.server.ts` | ✅ `getShopProductBySlug()` — related/build mock   |
| Gift cards     | `src/routes/gift-cards/+page.server.ts`  | ✅ `getGiftCardProducts()`                         |
| Deals          | `src/routes/deals/+page.server.ts`       | ✅ `getDealProducts()` — banners mock              |

### Parts (automotive)

| Loader        | File                                                 | Status                                               |
| ------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Parts hub     | `src/routes/parts/+page.server.ts`                   | ✅ `getPartsProducts()` — nav mock, YMM not filtered |
| Category list | `src/routes/parts/[category]/+page.server.ts`        | ✅ `getPartsByCategory()`                            |
| Part detail   | `src/routes/parts/[category]/[slug]/+page.server.ts` | ✅ `getPartBySlug()`                                 |

Metadata keys (`productType`, `fitment`, `brand`, `tags`, `compareAtPrice`) parsed in `metadata.ts` and included in product GraphQL queries.

### Homepage & collections

| Loader    | File                           | Status                                                |
| --------- | ------------------------------ | ----------------------------------------------------- |
| Homepage  | `src/routes/+page.server.ts`   | ✅ collections + staff/clearance via catalog service  |
| Mega menu | `src/routes/+layout.server.ts` | ✅ `shopCollections` (top 4, excludes clearance slug) |

### Cart & checkout (Phase 2)

| Consumer          | File                                  | Status                                      |
| ----------------- | ------------------------------------- | ------------------------------------------- |
| Cart store        | `src/lib/stores/cart.svelte.ts`       | ✅ add-line via POST; remove/qty mock-only  |
| Checkout cookie   | `src/lib/server/saleor/checkout.ts`   | ✅ `ag-checkout-id` helpers                 |
| Cart load         | `src/routes/cart/+page.server.ts`     | ✅ `getCheckoutLines()` when cookie present |
| Add to cart       | `src/routes/cart/checkout/+server.ts` | ✅ POST `{ variantId, quantity }`           |
| Checkout complete | —                                     | ❌ Not implemented                          |

**Cart scaffold behavior:**

- When `PUBLIC_SALEOR_API_URL` is unset: cart uses **localStorage** (`ag-cart`) and mock catalog pricing.
- When set: **checkout ID** in httpOnly cookie; browser never sees Saleor tokens.
- **Add to cart** → `POST /cart/checkout` → `createCheckout` / `addCheckoutLine`.
- **Cart page** → server load calls `getCheckoutLines()` for read-only display and subtotal.
- **Detail pages** (shop/parts slug routes) pass Saleor `variantId` — add-line works without mock catalog lookup.
- **Listing cards** (`ProductCard`) pass item `product.id` — still require mock catalog for variant resolution.

---

## Blockers

### 1. Domain metadata — wired for products

`mapProductMetadata()` parses `productType`, `fitment`, `brand`, `tags`, `compareAtPrice` from Saleor metadata/attributes. `availableQuantity` and YMM nav filtering remain mock/heuristic.

### 2. Cart checkout — partial scaffold

Read-only cart display and add-line are wired when `PUBLIC_SALEOR_API_URL` is set. Still missing line remove, quantity update, `CHECKOUT_COMPLETE`, payment redirect, and upsells from live catalog.

### 3. Channel / locale mapping

```typescript
const LOCALE_CHANNEL: Record<string, string> = {
	'en-US': 'us',
	'en-GB': 'eu',
	'ja-JP': 'jp'
};
// unmapped → getSaleorChannel() (SALEOR_CHANNEL env, default default-channel)
```

### 4. Shop category filter is client-side heuristic

`filterProductsByShopCategory()` in `catalog-helpers.ts` filters by name/slug heuristics. Saleor swap should use **collections or category tree**.

---

## Recommended next 3 PRs

### PR 1 — Cart mutations + listing add-to-cart

- Add `CHECKOUT_LINES_UPDATE` / `CHECKOUT_LINES_DELETE` GraphQL + API routes
- Wire `cart.svelte.ts` remove/qty when Saleor enabled
- Pass default `variantId` from `ProductCard` / listing components

**Outcome:** Full cart CRUD against live Saleor checkout.

### PR 2 — Checkout complete + payment

- `CHECKOUT_COMPLETE` mutation + shipping address/method steps
- Replace `/checkout` placeholder with Saleor payment redirect

**Outcome:** End-to-end purchase flow.

### PR 3 — Collection products + category filter

- Collection product edges query for homepage collection cards
- Replace shop category heuristics with Saleor collection/category filters
- Optional: Saleor search API for catalog search at scale

**Outcome:** Marketing surfaces fully on live catalog taxonomy.

---

## Files touched in this audit

| File                                    | Action                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `docs/audits/saleor-audit.md`           | Updated — June 29, 2026 verification pass                               |
| `src/lib/server/catalog/collections.ts` | Wired `getStaffPickProducts` / `getClearanceProducts` Saleor tag filter |
| `src/lib/stores/cart.svelte.ts`         | Fix add-to-cart when Saleor `variantId` provided (skip mock lookup)     |

## Mock-only by design (dev without Saleor env)

| Surface                            | Why mock stays                                     |
| ---------------------------------- | -------------------------------------------------- |
| All catalog loaders                | `PUBLIC_SALEOR_API_URL` unset → mock fallback      |
| Part category nav                  | Curated taxonomy not 1:1 with Saleor category tree |
| Search parts/builds/guides         | Content not in Saleor catalog                      |
| Deal promo banners                 | `getActiveDeals()` — CMS/marketing data            |
| Cart (no Saleor)                   | localStorage `ag-cart`                             |
| Checkout page                      | Payment UI placeholder                             |
| Forms (contact, wholesale, builds) | `submitFormStub`                                   |

## Verification (June 29, 2026)

| Check                                                   | Result                                                           |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| Saleor unit tests (mappers, channels, metadata, search) | ✅ 11/11 pass                                                    |
| Full `npm run test:unit`                                | ✅ 39/39 pass                                                    |
| Code review: catalog swap points                        | ✅ All primary loaders use `$lib/server/catalog/*`               |
| Code review: env gate                                   | ✅ `isSaleorEnabled()` checks `PUBLIC_SALEOR_API_URL`            |
| Live API smoke                                          | ⚠️ Not run — requires `PUBLIC_SALEOR_API_URL` + staging products |
| `npm run test:e2e`                                      | ⚠️ Playwright browsers not installed (`npx playwright install`)  |

See also: [commerce/saleor.md](../commerce/saleor.md), [mock-to-saleor.md](../style-guide/business-logic/mock-to-saleor.md).
