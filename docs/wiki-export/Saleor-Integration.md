# Saleor Integration

Headless commerce on **commerce.animalgarage.net**. This repo is the storefront frontend only.

```
animalgarage.net (SvelteKit)     commerce.animalgarage.net (Saleor)
  Shop, parts, cart UI    ──▶    Products, checkout, shipping, payments
```

## Environment

```env
PUBLIC_SALEOR_API_URL=https://commerce.animalgarage.net/graphql/
SALEOR_CHANNEL=default-channel
```

Channels map to market/locale (`en-US`→`us`, `en-GB`→`eu`, `ja-JP`→`jp`) in `src/lib/server/saleor/channels.ts`.

When `PUBLIC_SALEOR_API_URL` is unset, all catalog loaders fall back to `src/lib/data/mock/*`.

## Readiness (June 2026)

**Score: 7 / 10** — primary catalog loaders wired with mock fallback. Checkout completion and payment not wired.

### Wired (env set)

| Surface | Swap point |
|---------|------------|
| Shop list/detail | `getShopProducts()`, `getShopProductBySlug()` |
| Gift cards, deals, parts | `getGiftCardProducts()`, `getDealProducts()`, `getPartsProducts()` |
| Collections, staff picks, clearance | `getCollections()`, `getStaffPickProducts()`, `getClearanceProducts()` |
| Catalog search (merch) | `searchCatalog()` → `api/catalog/search` |
| Cart read / add line | `getCheckoutLines()`, `POST /cart/checkout` (`ag-checkout-id` cookie) |

### Not wired

| Gap | Status |
|-----|--------|
| Checkout completion / payment | `/checkout` is UI placeholder |
| Cart remove / qty | No-op when Saleor enabled |
| Add-to-cart from listing cards | Needs `variantId` (detail pages pass it) |
| Collection product edges | `products[]` empty on collections |
| Promo/redeem on checkout | Planned — see Redeem below |

Full inventory: [saleor-audit.md](https://github.com/jjheffernan/animalgaragenet/blob/main/docs/saleor-audit.md) in repo.

## Code layout

| Path | Role |
|------|------|
| `src/lib/server/saleor/client.ts` | GraphQL fetch, `isSaleorEnabled()` |
| `src/lib/server/saleor/queries.ts` | Product/collection queries |
| `src/lib/server/saleor/checkout-queries.ts` | Checkout mutations |
| `src/lib/server/saleor/mappers.ts` | Saleor → internal `Product` type |
| `src/lib/server/saleor/metadata.ts` | `productType`, `fitment`, `tags`, etc. |
| `src/lib/server/catalog/*.ts` | Env-gated loaders with mock fallback |
| `src/lib/stores/cart.svelte.ts` | Dual mode: Saleor POST vs localStorage |

## Catalog swap pattern

```typescript
// src/routes/shop/+page.server.ts
import { getShopProducts } from '$lib/server/catalog/products';

export const load: PageServerLoad = async () => {
	return { products: await getShopProducts() };
};
```

`getShopProducts()` calls Saleor when enabled; falls back to mock on error.

## Redeem (planned)

| Surface | Route | Saleor API |
|---------|-------|------------|
| Account redeem | `/account/redeem` | `checkoutAddPromoCode` / `checkoutRemovePromoCode` |
| Cart / checkout inline | `CartDrawer.svelte`, `/checkout` | Same mutations on active checkout cookie |
| Gift card balance | Checkout summary | `checkout { giftCards { ... } }` |

When Saleor unset, mock validation may use `src/lib/data/mock/promo-codes.ts` or a connect-Saleor message.

## Testing against Saleor

1. Set `PUBLIC_SALEOR_API_URL` in `.env`
2. Create products matching mock slugs for parity
3. Run `npm run dev` — loaders call Saleor when `isSaleorEnabled()`
4. `npm run test:readiness` — read-only catalog probe (skips when env unset)

## Security

- GraphQL endpoint is public for catalog reads
- Checkout mutations server-side only (`+page.server.ts`, `+server.ts`)
- Never expose Saleor app secret to the browser
