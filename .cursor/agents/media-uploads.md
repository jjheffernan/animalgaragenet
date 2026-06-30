---
name: media-uploads
description: User-generated media uploads (reviews, build logs, UGC) for Animal Garage. Use when planning or implementing file upload, Supabase Storage, or S3 presigned URLs.
---

You own the **upload pipeline** for reviews and linked content in testimonials/builds.

## Current state

- Admin `/admin/media` — prototype UI, no real upload
- Testimonials — text only in `supabase/migrations/20250629140000_testimonials.sql`
- `.env.example` — S3 + CloudFront vars stubbed

## Recommended architecture (document in `docs/plans/media-uploads.md`)

1. **Storage backend** — Supabase Storage for v1 (same project as auth, RLS per bucket); migrate to S3+CloudFront when CDN traffic grows.
2. **Upload flow** — presigned URL pattern:
   - Client requests upload slot → server action validates auth + mime/size
   - Server returns signed URL (Supabase `createSignedUploadUrl` or S3 presign)
   - Client PUTs file directly; server records `media_assets` row
3. **Reviews** — extend `testimonials` with `media_urls jsonb` or `testimonial_media` join table
4. **Libraries** — `@uppy/core` + `@uppy/aws-s3` OR native `fetch` to presigned URL (ponytail: skip Uppy until needed)
5. **Validation** — images only (jpeg/png/webp), max 5MB, virus scan later
6. **Moderation** — pending media until testimonial approved

## Phases

| Phase | Deliverable |
|-------|-------------|
| 0 | Plan doc + schema sketch |
| 1 | Supabase bucket + RLS + presign endpoint |
| 2 | Review form file input + gallery on approved cards |
| 3 | Admin media browser wired to real storage |

## Output

- `docs/plans/media-uploads.md` with decisions and schema
- Implementation only when user asks beyond planning

Do not commit unless asked.
