# CDN & Media URLs

Media delivery via S3 + CloudFront (planned). Prototype uses picsum placeholders.

## Environment variables

| Variable                | Scope  | Example                        |
| ----------------------- | ------ | ------------------------------ |
| `PUBLIC_CDN_BASE_URL`   | Public | `https://cdn.animalgarage.net` |
| `S3_BUCKET`             | Server | `animalgarage-media`           |
| `S3_REGION`             | Server | `us-west-2`                    |
| `AWS_ACCESS_KEY_ID`     | Server | IAM key (CI/deploy only)       |
| `AWS_SECRET_ACCESS_KEY` | Server | IAM secret                     |

## URL patterns

### Production (planned)

```typescript
import { config } from '$lib/config/env';

// Product image
`${config.cdnBaseUrl}/products/${slug}/hero.jpg`
// Media video poster
`${config.cdnBaseUrl}/media/${id}/poster.jpg`
// Thumbnail
`${config.cdnBaseUrl}/thumbnails/${id}.jpg`;
```

### Prototype (current)

```typescript
`https://picsum.photos/seed/ag${id}/${width}/${height}`;
```

Deterministic seeds prevent broken images during development.

## S3 bucket layout

```
s3://animalgarage-media/
├── products/{slug}/hero.jpg
├── products/{slug}/gallery/
├── media/{id}/original.mp4
├── media/{id}/poster.jpg
├── thumbnails/
└── static/
```

## CloudFront

- Custom domain: `cdn.animalgarage.net`
- Origin Access Control (OAC) — bucket not public
- Cache behaviors by path prefix (products = long TTL, media = medium)

## Frontend helper (future)

Consider adding when CDN is live:

```typescript
// src/lib/utils/cdn.ts
import { config } from '$lib/config/env';

export function cdnUrl(path: string): string {
	if (!config.cdnBaseUrl) return path;
	return `${config.cdnBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
```

## Migration checklist

1. Upload assets to S3
2. Configure CloudFront distribution
3. Set `PUBLIC_CDN_BASE_URL` in production env
4. Replace picsum URLs in mock data or Saleor media URLs
5. Add responsive srcset helpers
6. Invalidate CloudFront on asset updates

Full plan: [infrastructure.md](../../infrastructure.md)
