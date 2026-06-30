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

Channels map to market/locale in `src/lib/server/saleor/channels.ts` (`resolveChannelForLocale`).

When `PUBLIC_SALEOR_API_URL` is unset, catalog loaders use mock data locally. On production `PUBLIC_SITE_URL`, mock fallback is **disabled** — Saleor must be configured and healthy.

## Readiness

Primary catalog loaders, cart mutations, and checkout UI are wired with env gating. **Live payment** requires the Stripe Payment App enabled on your Saleor channel (ops).

### Wired (env set)

| Surface                             | Swap point                                                             |
| ----------------------------------- | ---------------------------------------------------------------------- |
| Shop list/detail                    | `getShopProducts()`, `getShopProductBySlug()`                          |
| Gift cards, deals, parts            | `getGiftCardProducts()`, `getDealProducts()`, `getPartsProducts()`     |
| Collections, staff picks, clearance | `getCollections()`, `getStaffPickProducts()`, `getClearanceProducts()` |
| Shop category filter                | `shop-filters.ts`, `/api/catalog/shop-filters`                         |
| Catalog search (merch)              | `searchCatalog()` → `api/catalog/search`                               |
| Cart read / add / update / remove   | `getCheckoutLines()`, `POST/PATCH/DELETE /cart/checkout`               |
| Checkout page                       | `/checkout` — shipping, Stripe Elements scaffold                       |
| Promo / redeem                      | `/account/redeem`, cart promo API                                      |
| Webhooks                            | `POST /api/webhooks/saleor` (signature-verified when secret set)       |

### Remaining gaps

| Gap                           | Status                                                |
| ----------------------------- | ----------------------------------------------------- |
| Live card payment             | Ops — Stripe Payment App on channel                   |
| Collection `products[]` edges | Metadata-only until collection product query expanded |
| Catalog search at scale       | Client-side filter on first 100 products              |

Detailed audit: `docs/audits/saleor-audit.md` in the repo.

## Code layout

| Path                                        | Role                                   |
| ------------------------------------------- | -------------------------------------- |
| `src/lib/server/saleor/client.ts`           | GraphQL fetch, `isSaleorEnabled()`     |
| `src/lib/server/saleor/queries.ts`          | Product/collection queries             |
| `src/lib/server/saleor/checkout-queries.ts` | Checkout mutations                     |
| `src/lib/server/saleor/mappers.ts`          | Saleor → internal `Product` type       |
| `src/lib/server/catalog/*.ts`               | Env-gated loaders                      |
| `src/lib/stores/cart.svelte.ts`             | Dual mode: Saleor POST vs localStorage |

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
- Never expose Saleor app tokens or Stripe secret keys to the browser
- Payment provider secrets belong in Saleor Dashboard Payment App config
