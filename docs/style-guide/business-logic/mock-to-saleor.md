# Mock → Saleor Swap

How catalog loaders use env-gated Saleor with mock fallback. Full inventory: [saleor-audit.md](../../saleor-audit.md).

## Current pattern (wired)

Routes call helpers in `src/lib/server/catalog/` — not mock imports directly:

```typescript
// src/routes/shop/+page.server.ts
import { getShopProducts } from '$lib/server/catalog/products';

export const load: PageServerLoad = async () => {
	const products = await getShopProducts();
	return { products };
};
```

`getShopProducts()`, `getShopProductBySlug()`, `getPartsProducts()`, `getCollections()`, etc. call Saleor when `isSaleorEnabled()` and fall back to `src/lib/data/mock/*` on error or missing env.

### Still mock-only

- Homepage videos, UGC, builds, brands, campaigns
- Deal promo banners, blog, guides (Ghost when enabled)
- Related products on PDP, parts YMM filter against Saleor metadata

### Homepage — `src/routes/+page.server.ts`

Product slices (staff picks, clearance) use catalog helpers; other sections remain mock.

## Saleor client

**File:** `src/lib/server/saleor/client.ts`

```typescript
const result = await saleorFetch<T>(query, variables);
// Returns { data?, errors? }
// Returns graceful error if PUBLIC_SALEOR_API_URL is unset
```

Channel read from private env `SALEOR_CHANNEL` (default: `default-channel`).

## Available queries

**File:** `src/lib/server/saleor/queries.ts`

- `PRODUCTS_QUERY` — paginated product list
- `PRODUCT_BY_SLUG_QUERY` — single product with variants/media
- `COLLECTIONS_QUERY` — collection list

## Swap procedure

### Step 1: Configure Saleor

```bash
# .env
PUBLIC_SALEOR_API_URL=https://commerce.animalgarage.net/graphql/
SALEOR_CHANNEL=default-channel
```

### Step 2: Mappers (done)

`src/lib/server/saleor/mappers.ts` — `mapProduct`, `mapProductListNode`, `mapCollection`.

### Step 3: Extend swap points

Add new catalog surfaces in `src/lib/server/catalog/*.ts` following the `isSaleorEnabled()` + mock fallback pattern. Do not import mock data directly in route loaders.

### Step 4: Verify parity

Create Saleor products matching mock slugs (`garage-flag-tee`, etc.) for side-by-side testing.

### Step 5: Remaining commerce gaps

See [saleor-audit.md](../../saleor-audit.md): checkout complete, cart line mutations, collection product edges, redeem/promo codes.

Keep `src/lib/data/` for tests/fallback until fully confident. Delete when live.

## Incremental migration

Catalog list/detail routes are done. Next surfaces:

1. Collection product edges on homepage
2. Cart line remove/qty + checkout complete
3. Promo / voucher redeem (`saleor-redeem` agent)

## Error handling

- Missing API URL: client returns `{ errors: [...] }` — handle in loader
- 404 product: use SvelteKit `error(404, ...)`
- API down: `error(502, ...)` with user-friendly message

See [saleor.md](../../saleor.md) for full integration plan.
