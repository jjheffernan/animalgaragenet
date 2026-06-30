# Saleor Integration

Headless commerce on a **separate Saleor host**. This repo is the storefront frontend only.

```
Storefront (SvelteKit)     Saleor backend
  Shop, parts, cart UI  ──▶  Products, checkout, shipping, payments
```

## Environment

```env
PUBLIC_SALEOR_API_URL=https://<your-saleor-host>/graphql/
SALEOR_CHANNEL=<your-channel-slug>
```

Channels map to market/locale in `src/lib/server/saleor/channels.ts`.

When `PUBLIC_SALEOR_API_URL` is unset, catalog loaders use mock data locally. On production `PUBLIC_SITE_URL`, mock fallback is **disabled** — Saleor must be configured and healthy.

## Readiness

Primary catalog loaders are wired with env gating. Checkout completion and payment are not fully wired.

### Wired (env set)

| Surface | Swap point |
|---------|------------|
| Shop list/detail | `getShopProducts()`, `getShopProductBySlug()` |
| Gift cards, deals, parts | `getGiftCardProducts()`, `getDealProducts()`, `getPartsProducts()` |
| Collections, staff picks, clearance | `getCollections()`, `getStaffPickProducts()`, `getClearanceProducts()` |
| Catalog search (merch) | `searchCatalog()` → `api/catalog/search` |
| Cart read / add line | `getCheckoutLines()`, `POST /cart/checkout` |
| Promo / redeem | `/account/redeem`, cart promo API |

### Not wired

| Gap | Status |
|-----|--------|
| Checkout completion / payment | `/checkout` is UI placeholder |
| Cart remove / qty | Limited when Saleor enabled |
| Add-to-cart from listing cards | Needs `variantId` on cards |
| Collection product edges | `products[]` empty on collections |

Detailed audit: `docs/audits/saleor-audit.md` in the repo.

## Code layout

| Path | Role |
|------|------|
| `src/lib/server/saleor/client.ts` | GraphQL fetch, `isSaleorEnabled()` |
| `src/lib/server/saleor/queries.ts` | Product/collection queries |
| `src/lib/server/saleor/checkout-queries.ts` | Checkout mutations |
| `src/lib/server/saleor/mappers.ts` | Saleor → internal `Product` type |
| `src/lib/server/catalog/*.ts` | Env-gated loaders |
| `src/lib/stores/cart.svelte.ts` | Dual mode: Saleor POST vs localStorage |

## Catalog swap pattern

```typescript
// src/routes/shop/+page.server.ts
import { getShopProducts } from '$lib/server/catalog/products';

export const load: PageServerLoad = async () => {
	return { products: await getShopProducts() };
};
```

## Testing against Saleor

1. Set `PUBLIC_SALEOR_API_URL` in `.env`
2. Create products matching mock slugs for parity
3. Run `npm run dev` — loaders call Saleor when `isSaleorEnabled()`
4. `npm run test:readiness` — read-only catalog probe (skips when env unset)

## Security

- GraphQL catalog reads may be public on the Saleor endpoint — confirm with your Saleor deployment
- Checkout mutations server-side only (`+page.server.ts`, `+server.ts`)
- Never expose Saleor app tokens or secrets to the browser
