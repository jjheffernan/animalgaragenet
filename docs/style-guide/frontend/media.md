# Media Handling

## Prototype (current)

### Placeholder images — picsum.photos

Mock data uses deterministic seeded URLs:

```typescript
// src/lib/data/mock/products.ts
const img = (id: number, w = 800, h = 800) => `https://picsum.photos/seed/ag${id}/${w}/${h}`;
```

Seeds like `ag101`, `aghero` ensure stable images across reloads.

**Used in:**

| File                  | Pattern                            |
| --------------------- | ---------------------------------- |
| `mock/products.ts`    | `seed/ag{id}` for product images   |
| `mock/collections.ts` | Seeded collection backgrounds      |
| `mock/media.ts`       | Seeded media thumbnails            |
| `Hero.svelte`         | `seed/aghero/1920/1080` background |
| `+page.svelte`        | `seed/agbrand/800/600` brand image |

### Static assets

| Location          | Contents                                                   |
| ----------------- | ---------------------------------------------------------- |
| `static/`         | Public files served at `/` (e.g. `logo.svg`, `robots.txt`) |
| `src/lib/assets/` | Imported assets (e.g. `favicon.svg` in layout)             |

Imported assets get hashed filenames at build time. Static files keep their paths.

## Production (planned — Phase 3)

### CDN URL pattern

```typescript
import { config } from '$lib/config/env';

const url = `${config.cdnBaseUrl}/products/${slug}/hero.jpg`;
```

Set `PUBLIC_CDN_BASE_URL=https://cdn.animalgarage.net` in production.

### S3 bucket structure

```
s3://animalgarage-media/
├── products/{slug}/hero.jpg
├── products/{slug}/gallery/
├── media/{id}/original.mp4
├── media/{id}/poster.jpg
└── thumbnails/
```

See [infrastructure.md](../../infrastructure.md) for full CDN/S3 plan.

### Responsive srcset (future)

```html
<img
	src="{cdn}/products/{slug}/800.webp"
	srcset="
		{cdn}/products/{slug}/400.webp   400w,
		{cdn}/products/{slug}/800.webp   800w,
		{cdn}/products/{slug}/1200.webp 1200w
	"
	sizes="(max-width: 768px) 100vw, 50vw"
	alt="..."
	loading="lazy"
/>
```

## Image best practices

| Context           | Attribute            | Example                   |
| ----------------- | -------------------- | ------------------------- |
| Above fold (hero) | eager / priority     | Hero background           |
| Below fold        | `loading="lazy"`     | ProductCard, MediaGallery |
| Decorative bg     | `aria-hidden="true"` | Hero overlay divs         |
| Content images    | meaningful `alt`     | Product thumbnails        |

## Video (future)

Media items support `type: 'IMAGE' | 'VIDEO'` in types. Prototype shows thumbnails only. Phase 3 adds poster + play overlay + CDN streaming.

## Migrating from placeholder to CDN

1. Upload assets to S3 under the bucket structure above.
2. Update mock data URLs (or Saleor product media URLs) to `${config.cdnBaseUrl}/...`.
3. Keep the same `ProductMedia` shape — only `url` values change.
4. Invalidate CloudFront cache on updates.

## Do not

- Hotlink random URLs without seeds (breaks on refresh)
- Store large binaries in the git repo — use CDN/S3
- Import product photos from `$lib/assets/` — they belong on CDN
