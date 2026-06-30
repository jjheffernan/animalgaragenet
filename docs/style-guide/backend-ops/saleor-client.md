# Saleor GraphQL Client

Headless commerce backend on a separate domain (`<your-saleor-host>`).

## Structure

```
src/lib/server/saleor/
├── client.ts    # saleorFetch() wrapper
└── queries.ts   # GraphQL query strings
```

Types: `src/lib/types/saleor.ts`

## Client API

**File:** `src/lib/server/saleor/client.ts`

```typescript
export async function saleorFetch<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<GraphQLResponse<T>>;
```

Behavior:

- POSTs to `config.saleorApiUrl` (`PUBLIC_SALEOR_API_URL`)
- Returns `{ data?, errors? }` — never throws on missing config
- If URL unset: `{ errors: [{ message: 'PUBLIC_SALEOR_API_URL not configured' }] }`
- Channel passed as GraphQL variable (from `SALEOR_CHANNEL` private env)

## Queries

**File:** `src/lib/server/saleor/queries.ts`

| Query                   | Variables          | Purpose         |
| ----------------------- | ------------------ | --------------- |
| `PRODUCTS_QUERY`        | `channel`, `first` | Product list    |
| `PRODUCT_BY_SLUG_QUERY` | `slug`, `channel`  | Product detail  |
| `COLLECTIONS_QUERY`     | `channel`, `first` | Collection list |

Future mutations (cart/checkout) will be added here.

## Usage in loaders

```typescript
import { saleorFetch } from '$lib/server/saleor/client';
import { PRODUCTS_QUERY } from '$lib/server/saleor/queries';
import { env } from '$env/dynamic/private';

const result = await saleorFetch(PRODUCTS_QUERY, {
	channel: env.SALEOR_CHANNEL ?? 'default-channel',
	first: 24
});
```

## Environment

```env
PUBLIC_SALEOR_API_URL=https://<your-saleor-host>/graphql/
SALEOR_CHANNEL=default-channel
```

## Security

- Catalog reads: public GraphQL endpoint, no auth needed
- Checkout mutations: server-side only, may require app token
- Never expose Saleor app secret to browser

## Full integration plan

See [commerce/saleor.md](../../commerce/saleor.md) and [mock-to-saleor.md](../business-logic/mock-to-saleor.md).
