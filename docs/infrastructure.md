# Infrastructure Plan

CDN, object storage, and Supabase architecture for Animal Garage.

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────┐
│  SvelteKit  │────▶│   Saleor     │     │ Supabase│
│  Frontend   │     │  (GraphQL)   │     │ (Auth,  │
│             │────▶│              │     │ metadata)│
└──────┬──────┘     └──────────────┘     └─────────┘
       │
       ▼
┌──────────────┐     ┌─────────┐
│  CloudFront  │────▶│   S3    │
│    (CDN)     │     │ (media) │
└──────────────┘     └─────────┘
```

## CDN — CloudFront

**Purpose:** Global edge delivery for media assets, product images, and video thumbnails.

### Planned setup

1. **S3 bucket** as origin (`animalgarage-media` or per-environment buckets)
2. **CloudFront distribution** with:
   - HTTPS only
   - Custom domain: `cdn.animalgarage.net`
   - Origin Access Control (OAC) — bucket not public
   - Cache behaviors:
     - `/products/*` — long TTL (immutable filenames with hash)
     - `/media/*` — medium TTL
     - `/thumbnails/*` — medium TTL
3. **Response headers:** `Cache-Control`, CORS for frontend domain

### Frontend usage

```typescript
import { config } from '$lib/config/env';

const imageUrl = `${config.cdnBaseUrl}/products/garage-flag-tee.jpg`;
```

Set `PUBLIC_CDN_BASE_URL=https://cdn.animalgarage.net` in production.

## S3 — Object storage

**Purpose:** Durable storage for all media assets.

### Bucket structure

```
s3://animalgarage-media/
├── products/           # Product photography
│   └── {slug}/
│       ├── hero.jpg
│       └── gallery/
├── media/              # Brand content (builds, events)
│   └── {id}/
│       ├── original.mp4
│       └── poster.jpg
├── thumbnails/         # Generated previews
└── static/             # Long-lived brand assets
```

### Upload flow (future)

1. Admin uploads via Saleor dashboard or custom CMS
2. Lambda or Supabase Edge Function processes/resizes
3. Writes to S3, invalidates CloudFront cache on update
4. Metadata stored in Supabase (`media_assets` table)

### Env vars

| Variable | Scope | Description |
| -------- | ----- | ----------- |
| `S3_BUCKET` | Server | Bucket name |
| `S3_REGION` | Server | AWS region |
| `AWS_ACCESS_KEY_ID` | Server | IAM credentials (CI/deploy only) |
| `AWS_SECRET_ACCESS_KEY` | Server | IAM secret |
| `PUBLIC_CDN_BASE_URL` | Public | CloudFront URL prefix |

## Supabase

**Purpose:** Non-commerce data — auth, content metadata, newsletter, user preferences.

### Planned tables (sketch)

```sql
-- Newsletter
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text default 'en-US',
  created_at timestamptz default now()
);

-- Featured homepage content (pre-selected, dynamically hydrated)
create table featured_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,  -- 'hero', 'collections', 'media'
  content jsonb not null,
  active boolean default true,
  updated_at timestamptz default now()
);

-- Media metadata (CDN URLs stored here)
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,  -- 'image' | 'video'
  cdn_path text not null,
  thumbnail_path text,
  category text,
  featured boolean default false,
  created_at timestamptz default now()
);

-- User preferences (requires auth)
create table user_preferences (
  user_id uuid references auth.users primary key,
  locale text default 'en-US',
  currency text default 'USD',
  favorites jsonb default '[]'
);
```

### Client setup

Server client placeholder: `src/lib/server/supabase/client.ts`

Install when ready:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Env vars

| Variable | Scope | Description |
| -------- | ----- | ----------- |
| `PUBLIC_SUPABASE_URL` | Public | Project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | Anon key (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin operations — never expose to client |

## Environment file pattern

```bash
cp .env.example .env
```

- **Public vars** (`PUBLIC_*`): safe for browser, prefixed automatically by SvelteKit
- **Private vars**: server-only, never imported in client components
- **Never commit** `.env` — only `.env.example` with placeholders

## Deployment considerations

- SvelteKit `adapter-auto` detects host; switch to `adapter-node` or platform-specific adapter for production
- CloudFront + S3 can serve `static/` assets at build time; dynamic media from CDN URL
- Supabase Row Level Security on all user-facing tables
- Saleor API URL is public (GraphQL endpoint); auth tokens handled server-side for checkout
