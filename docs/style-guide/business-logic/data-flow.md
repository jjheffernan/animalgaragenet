# Data Flow

## Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│                     SvelteKit Frontend                       │
│  src/routes/**/+page.server.ts  (loaders)                   │
│  src/routes/**/+page.svelte     (render)                    │
│  src/lib/components/            (UI)                        │
└──────────┬──────────────────────┬───────────────────────────┘
           │                      │
           ▼ (Phase 1)            ▼ (Phase 2+)
┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐
│ src/lib/data/    │    │ src/lib/server/  │    │ src/lib/     │
│ mock/*.ts        │    │ saleor/client.ts │    │ server/      │
│ (local arrays)   │    │ (GraphQL fetch)  │    │ supabase/    │
└──────────────────┘    └────────┬─────────┘    └──────┬───────┘
                                 │                      │
                                 ▼                      ▼
                        commerce.animalgarage.net   Supabase
                        (Saleor GraphQL)            (auth, CMS)
```

## Phase 1 — Mock data (current)

1. **Server loaders** in `+page.server.ts` import from `src/lib/data/mock/*.ts`
2. Loaders return plain objects: `{ products }`, `{ product }`
3. **Page components** receive data and pass to child components
4. **Client components** read locale from `$lib/stores/locale.svelte.ts` for formatting

Example flow — shop page:

```
shop/+page.server.ts  →  mockProducts
       ↓
shop/+page.svelte     →  ProductGrid { products }
       ↓
ProductGrid.svelte    →  ProductCard { product }
       ↓
ProductCard.svelte    →  locale.formatPrice(...)
```

## Phase 2 — Saleor migration

Swap loaders one at a time:

```typescript
// Before
import { mockProducts } from '$lib/data/mock/products';
return { products: mockProducts };

// After
import { saleorFetch } from '$lib/server/saleor/client';
import { PRODUCTS_QUERY } from '$lib/server/saleor/queries';
const result = await saleorFetch(PRODUCTS_QUERY, { channel, first: 24 });
return { products: mapProducts(result.data) };
```

See [mock-to-saleor.md](./mock-to-saleor.md) for detailed steps.

## Phase 3 — CDN media

Product/media URLs move from `picsum.photos` to `${config.cdnBaseUrl}/...`. Types unchanged — only URL values update.

## Phase 4 — Supabase content

Homepage featured sections, newsletter, user preferences hydrate from Supabase while commerce stays on Saleor.

## Key principle

**Saleor owns commerce data.** Supabase owns non-commerce metadata. The frontend never stores inventory or pricing — it displays what APIs return.

## Files by concern

| Concern           | Location                           |
| ----------------- | ---------------------------------- |
| Mock catalog      | `src/lib/data/mock/products.ts`    |
| Mock collections  | `src/lib/data/mock/collections.ts` |
| Mock media        | `src/lib/data/mock/media.ts`       |
| Type definitions  | `src/lib/types/saleor.ts`          |
| GraphQL client    | `src/lib/server/saleor/client.ts`  |
| GraphQL queries   | `src/lib/server/saleor/queries.ts` |
| Locale formatting | `src/lib/stores/locale.svelte.ts`  |
| Env config        | `src/lib/config/env.ts`            |
