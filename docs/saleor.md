# Saleor Integration Plan

Headless commerce architecture for Animal Garage.

## Architecture

```
animalgarage.net (SvelteKit)          commerce.animalgarage.net (Saleor)
┌─────────────────────────┐           ┌─────────────────────────┐
│  Shop pages             │  GraphQL  │  Products               │
│  Product detail         │ ────────▶ │  Cart / Checkout        │
│  Cart (future)          │           │  Shipping zones         │
│  Checkout (future)      │           │  Payments (Stripe)      │
└─────────────────────────┘           └─────────────────────────┘
```

Saleor runs on a **separate domain**. This repo is the storefront frontend only.

## Current state

- GraphQL client: `src/lib/server/saleor/client.ts`
- Query definitions: `src/lib/server/saleor/queries.ts`
- Type definitions mirroring Saleor shape: `src/lib/types/saleor.ts`
- Mock data: `src/lib/data/mock-products.ts`
- Shop routes load mock data; server loaders have comments for API swap

## Environment

```env
PUBLIC_SALEOR_API_URL=https://commerce.animalgarage.net/graphql/
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

- Saleor Checkout API for cart mutations
- Store checkout ID in cookie or local storage
- Redirect to Saleor-hosted checkout OR embed Payment App
- Webhook handlers for order confirmation (separate API route)

### 5. International shipping

Saleor shipping zones define available countries and rates.

Frontend readiness (already scaffolded):

| Feature | Location |
| ------- | -------- |
| Locale codes | `src/lib/types/locale.ts` |
| Currency formatting | `src/lib/i18n/currency.ts` |
| Locale store | `src/lib/stores/locale.svelte.ts` |
| Region selector | `src/lib/components/LocaleSelector.svelte` |
| Shipping region display | Product & shop pages |

**Next steps:**

1. Map locale → Saleor channel
2. Pass shipping address country to checkout
3. Display shipping rates from `checkout.availableShippingMethods`
4. Currency from channel pricing, not hardcoded USD in mock data

## GraphQL queries

Defined in `src/lib/server/saleor/queries.ts`:

- `PRODUCTS_QUERY` — paginated product list
- `PRODUCT_BY_SLUG_QUERY` — single product with variants/media
- `COLLECTIONS_QUERY` — collection list for homepage

Add as needed:

- `CHECKOUT_CREATE_MUTATION`
- `CHECKOUT_LINES_ADD_MUTATION`
- `CHECKOUT_COMPLETE_MUTATION`

## Type mapping

Saleor uses `Money` with `gross`/`net` wrappers. Internal types flatten to:

```typescript
pricing: {
  priceRange: {
    start: { amount: number; currency: string }
  }
}
```

Create a mapper in `src/lib/server/saleor/mappers.ts` when integrating.

## Testing against Saleor

1. Spin up Saleor (Docker or Saleor Cloud)
2. Set `PUBLIC_SALEOR_API_URL` in `.env`
3. Create products matching mock slugs for parity testing
4. Swap one loader at a time (shop list first, then detail)

## Security

- GraphQL endpoint is public for catalog reads
- Checkout mutations may require app tokens — use server-side loaders/actions only
- Never expose Saleor app secret to the browser
