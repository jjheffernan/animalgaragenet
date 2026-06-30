# CDN & Media URLs

Media delivery via object storage + CDN (planned). Prototype uses picsum placeholders.

> **Public repo:** See [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) and `.env.example` for credential variable names.

## Environment variables

| Category | Scope | Notes |
| -------- | ----- | ----- |
| `PUBLIC_CDN_BASE_URL` | Public | CDN base URL for media |
| Object storage | Server | See `.env.example` |

## URL patterns (planned)

```typescript
import { config } from '$lib/config/env';

`${config.cdnBaseUrl}/products/${slug}/hero.jpg`;
```

## Bucket layout (conceptual)

```
<bucket>/products/{slug}/hero.jpg
<bucket>/media/{id}/poster.jpg
```

Overview: [infrastructure/overview.md](../../infrastructure/overview.md) · [plans/active/media-uploads.md](../../plans/active/media-uploads.md)
