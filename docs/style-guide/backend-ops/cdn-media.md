# CDN & Media URLs

Public media delivery via CDN base URL. v1 uses Supabase Storage; Phase 2 adds S3 + CloudFront presigned uploads.

> **Public repo:** See [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) and `.env.example` for credential variable names.

## Environment variables

| Category              | Scope  | Notes                  |
| --------------------- | ------ | ---------------------- |
| `PUBLIC_CDN_BASE_URL` | Public | CDN base URL for media reads |
| `S3_BUCKET`, `AWS_*`  | Server | Presigned upload (wired when env set) |

## Read URLs (wired)

`src/lib/server/media/cdn.ts`:

```typescript
import { resolveUgcPublicUrl } from '$lib/server/media/cdn';

// When PUBLIC_CDN_BASE_URL is set:
resolveUgcPublicUrl('user-1/photo.jpg');
// → https://cdn.example.com/ugc/user-1/photo.jpg
```

`src/lib/server/media/repository.ts` calls `resolveUgcPublicUrl` when `isCdnPublicReadConfigured()` is true.

## Presigned upload (wired)

`createPresignedUploadUrl` in `cdn.ts` issues S3 presigned PUT URLs when `PUBLIC_CDN_BASE_URL`, `S3_BUCKET`, and `AWS_*` are set. Admin upload flow: `POST /api/admin/media/upload-slot` → client `PUT` to presigned URL → optional `POST /api/admin/media/invalidate` when `AWS_CLOUDFRONT_DISTRIBUTION_ID` is set.

`invalidateCdnPaths` creates a CloudFront invalidation batch for the uploaded object keys.

## Bucket layout (conceptual)

```
ugc/{user_id}/{asset}.jpg
products/{slug}/hero.jpg
```

Overview: [infrastructure/overview.md](../../infrastructure/overview.md) · [plans/active/media-uploads.md](../../plans/active/media-uploads.md)
