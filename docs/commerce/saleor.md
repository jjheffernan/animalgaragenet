# Saleor Integration Plan

Headless commerce architecture for Animal Garage.

## Architecture

```
<your-site-host> (SvelteKit)          <your-saleor-host> (Saleor)
┌─────────────────────────┐           ┌─────────────────────────┐
│  Shop pages             │  GraphQL  │  Products               │
│  Product detail         │ ────────▶ │  Cart / Checkout        │
│  Cart (future)          │           │  Shipping zones         │
│  Checkout (future)      │           │  Payments (Stripe)      │
└─────────────────────────┘           └─────────────────────────┘
```

Saleor runs on a **separate domain**. This repo is the storefront frontend only.

## Current state (June 2026)

**Catalog:** Primary shop, parts, gift cards, deals, collections, and homepage product slices use env-gated Saleor loaders with mock fallback when `PUBLIC_SALEOR_API_URL` is unset. See [saleor-audit.md](../audits/saleor-audit.md) for the full wired vs mock inventory.

**Cart:** Create checkout, add line, and read lines work when Saleor is enabled (`ag-checkout-id` cookie). Remove/qty mutations and checkout completion are not wired.

**Checkout:** `/checkout` is a UI placeholder — no payment, shipping, or `CHECKOUT_COMPLETE`.

| Area | Location |
|------|----------|
| GraphQL client | `src/lib/server/saleor/client.ts` |
| Queries + mappers | `src/lib/server/saleor/queries.ts`, `mappers.ts` |
| Catalog swap points | `src/lib/server/catalog/*.ts` |
| Checkout scaffold | `src/lib/server/saleor/checkout.ts`, `cart/checkout/+server.ts` |
| Mock fallback | `src/lib/data/mock/products.ts` |

## Environment

```env
PUBLIC_SALEOR_API_URL=https://<your-saleor-host>/graphql/
SALEOR_CHANNEL=default-channel
```

Channels in Saleor map to market/locale (e.g. `us`, `eu`, `jp`). Wire channel selection to the locale store.

## Integration steps

### 1. Product catalog

Replace mock loaders with:

```typescript
import { saleorFetch } from '$lib/server/saleor/client';
import { PRODUCTS_QUERY } from '$lib/server/saleor/queries';
import { config } from '$lib/config/env';

const result = await saleorFetch(PRODUCTS_QUERY, {
	channel: config.saleorChannel,
	first: 24
});
```

Map Saleor response fields (`pricing.priceRange.start.gross`) to internal `Product` type.

### 2. Product detail

Use `PRODUCT_BY_SLUG_QUERY` in `shop/[slug]/+page.server.ts`.

### 3. Collections

Use `COLLECTIONS_QUERY` for homepage and `/shop?collection=` filtering.

### 4. Cart & checkout

**Done (partial):** create checkout, add line, read lines — `src/lib/server/saleor/checkout.ts`, `cart/checkout/+server.ts`, `ag-checkout-id` cookie.

**Remaining:**

- Line remove / quantity (`checkoutLinesUpdate`, `checkoutLinesDelete`)
- Shipping address and `availableShippingMethods`
- Payment + `CHECKOUT_COMPLETE`
- `/checkout` page (currently placeholder)

### 5. Vouchers, promo codes & gift cards

**Done (partial):** Account redeem (`/account/redeem`), cart promo API (`/cart/checkout/promo`), `checkoutAddPromoCode` / `checkoutRemovePromoCode` in `checkout.ts`. Mock codes when Saleor unset (`GARAGE10`, `PITLANE15`).

| Surface | Route / component | Status |
|---------|-------------------|--------|
| Account redeem | `/account/redeem` | Done |
| Cart / checkout inline | `PromoCodeForm`, cart promo API | Done |
| Gift card balance | Checkout summary | Not wired |

### 6. International shipping

Saleor shipping zones define available countries and rates.

Frontend readiness (already scaffolded):

| Feature                 | Location                                   |
| ----------------------- | ------------------------------------------ |
| Locale codes            | `src/lib/types/locale.ts`                  |
| Currency formatting     | `src/lib/i18n/currency.ts`                 |
| Locale store            | `src/lib/stores/locale.svelte.ts`          |
| Region selector         | `src/lib/components/LocaleSelector.svelte` |
| Shipping region display | Product & shop pages                       |

**Next steps:**

1. ~~Map locale → Saleor channel~~ — done in `src/lib/server/saleor/channels.ts`
2. Pass shipping address country to checkout
3. Display shipping rates from `checkout.availableShippingMethods`
4. Currency from channel pricing when env set (mock still hardcodes USD)

## GraphQL queries

Defined in `src/lib/server/saleor/queries.ts` and `checkout-queries.ts`:

- `PRODUCTS_QUERY` — paginated product list
- `PRODUCT_BY_SLUG_QUERY` — single product with variants/media
- `COLLECTIONS_QUERY` — collection list for homepage
- Checkout create / add line — in `checkout-queries.ts` (wired)

Still needed:

- `CHECKOUT_LINES_UPDATE` / `CHECKOUT_LINES_DELETE`
- `CHECKOUT_COMPLETE`
- ~~`checkoutAddPromoCode` / `checkoutRemovePromoCode`~~ — done in `checkout-queries.ts`

## Type mapping

Saleor uses `Money` with `gross`/`net` wrappers. Internal types flatten to:

```typescript
pricing: {
	priceRange: {
		start: {
			amount: number;
			currency: string;
		}
	}
}
```

Mappers live in `src/lib/server/saleor/mappers.ts` (`mapProduct`, `mapProductListNode`, `mapCollection`).

## Testing against Saleor

1. Spin up Saleor (Docker or Saleor Cloud)
2. Set `PUBLIC_SALEOR_API_URL` in `.env`
3. Create products matching mock slugs for parity testing
4. Enable env and test loaders — catalog swap points already call Saleor when `isSaleorEnabled()`

## Security

- GraphQL endpoint is public for catalog reads
- Checkout mutations may require app tokens — use server-side loaders/actions only
- Never expose Saleor app secret to the browser
