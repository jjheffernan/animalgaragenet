# Mock → Saleor Swap

How server loaders work today and how to replace mock data with live Saleor GraphQL.

## Current loaders

### Shop list — `src/routes/shop/+page.server.ts`

```typescript
import { mockProducts } from '$lib/data/mock/products';

export const load: PageServerLoad = async () => {
	return { products: mockProducts };
};
```

### Product detail — `src/routes/shop/[slug]/+page.server.ts`

```typescript
import { getProductBySlug } from '$lib/data/mock/products';

export const load: PageServerLoad = async ({ params }) => {
	const product = getProductBySlug(params.slug);
	if (!product) error(404, 'Product not found');
	return { product };
};
```

### Homepage — `src/routes/+page.svelte`

Imports mock data directly in the page component (no server loader). Acceptable for static prototype; consider moving to `+page.server.ts` before Saleor swap.

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

### Step 2: Create mapper (recommended)

```typescript
// src/lib/server/saleor/mappers.ts
export function mapProduct(node: SaleorProductNode): Product {
	return {
		id: node.id,
		name: node.name,
		slug: node.slug,
		// map gross.amount → amount
		pricing: {
			priceRange: {
				start: {
					amount: node.pricing.priceRange.start.gross.amount,
					currency: node.pricing.priceRange.start.gross.currency
				},
				stop: {/* same pattern */}
			}
		}
		// ...
	};
}
```

### Step 3: Replace shop loader

```typescript
import { saleorFetch } from '$lib/server/saleor/client';
import { PRODUCTS_QUERY } from '$lib/server/saleor/queries';
import { env } from '$env/dynamic/private';
import { mapProduct } from '$lib/server/saleor/mappers';

export const load: PageServerLoad = async () => {
	const channel = env.SALEOR_CHANNEL ?? 'default-channel';
	const result = await saleorFetch(PRODUCTS_QUERY, { channel, first: 24 });

	if (result.errors?.length) {
		error(502, 'Failed to load products');
	}

	const products = result.data.products.edges.map((e) => mapProduct(e.node));
	return { products };
};
```

### Step 4: Replace product detail loader

Same pattern with `PRODUCT_BY_SLUG_QUERY` and `params.slug`.

### Step 5: Verify parity

Create Saleor products matching mock slugs (`garage-flag-tee`, etc.) for side-by-side testing.

### Step 6: Remove mock imports

Keep `src/lib/data/` for tests/fallback until fully confident. Delete when live.

## Incremental migration

Swap one loader at a time:

1. Shop list (`/shop`)
2. Product detail (`/shop/[slug]`)
3. Collections (homepage)
4. Cart/checkout (Phase 2)

## Error handling

- Missing API URL: client returns `{ errors: [...] }` — handle in loader
- 404 product: use SvelteKit `error(404, ...)`
- API down: `error(502, ...)` with user-friendly message

See [saleor.md](../../saleor.md) for full integration plan.
