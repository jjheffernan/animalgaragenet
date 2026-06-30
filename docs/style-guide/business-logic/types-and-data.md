# Types & Data

## Product types

**File:** `src/lib/types/saleor.ts`

Types mirror Saleor's GraphQL shape (flattened for frontend use):

```typescript
Product {
  id, name, slug, description
  thumbnail: ProductMedia | null
  media: ProductMedia[]
  pricing: { priceRange: { start: Money, stop: Money } }
  variants: ProductVariant[]
  category: ProductCategory | null
  isAvailableForPurchase: boolean
}
```

Supporting types: `Money`, `ProductMedia`, `ProductVariant`, `ProductCategory`, `Collection`.

When Saleor integration lands, add mappers in `src/lib/server/saleor/mappers.ts` to transform `gross.amount` → flat `amount`.

## Mock data files

| File                  | Exports                                                       | Used by              |
| --------------------- | ------------------------------------------------------------- | -------------------- |
| `mock-products.ts`    | `mockProducts`, `getProductBySlug()`, `getFeaturedProducts()` | Shop pages, homepage |
| `mock-collections.ts` | `mockCollections`                                             | Homepage             |
| `mock-media.ts`       | `mockMedia`                                                   | Homepage, `/media`   |

### Adding a product

See [quick-start.md](../quick-start.md#add-a-product-to-mock-data).

### Adding a collection

**File:** `src/lib/data/mock-collections.ts`

Collections reference products by embedding full `Product` objects from `mock-products.ts`.

### Adding media

**File:** `src/lib/data/mock-media.ts`

Each item: id, title, type (`IMAGE`|`VIDEO`), url, thumbnailUrl, category.

## Locale types

**File:** `src/lib/types/locale.ts`

```typescript
type LocaleCode = 'en-US' | 'en-GB' | 'de-DE' | 'ja-JP';

interface LocaleConfig {
	code;
	label;
	currency;
	shippingRegions;
}
```

`locales` array defines supported markets. Extend here when adding regions.

## Data access patterns

| Pattern                 | Example                                                  |
| ----------------------- | -------------------------------------------------------- |
| Direct import in loader | `import { mockProducts } from '$lib/data/mock-products'` |
| Lookup helper           | `getProductBySlug(params.slug)`                          |
| Slice helper            | `getFeaturedProducts(4)`                                 |
| 404 on missing          | `error(404, 'Product not found')` in server load         |

## Saleor type mapping (future)

Saleor returns nested money:

```graphql
pricing { priceRange { start { gross { amount currency } } } }
```

Internal type flattens to:

```typescript
{ amount: number, currency: string }
```

Create mapper functions when wiring live data — do not change component interfaces.
