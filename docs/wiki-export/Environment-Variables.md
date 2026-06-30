# Environment Variables

Copy `.env.example` → `.env` for local values. Never commit `.env`.

Typed public accessor: `src/lib/config/env.ts`. Private vars use `$env/dynamic/private` in server files only.

## Setup

```bash
cp .env.example .env
# Edit .env with local values
```

## Public (browser-safe)

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_SITE_URL` | `http://localhost:5173` | Canonical site URL (magic links, OAuth redirects) |
| `PUBLIC_CDN_BASE_URL` | `''` | CloudFront media prefix |
| `PUBLIC_SALEOR_API_URL` | `''` | Saleor GraphQL endpoint |
| `PUBLIC_SUPABASE_URL` | `''` | Supabase project API URL |
| `PUBLIC_SUPABASE_ANON_KEY` | `''` | Supabase anon key (RLS-protected) |
| `PUBLIC_DEFAULT_LOCALE` | `en-US` | Default locale code |
| `PUBLIC_DEFAULT_CURRENCY` | `USD` | Default currency code |

## Private (server only)

| Variable | Default | Description |
|----------|---------|-------------|
| `SALEOR_CHANNEL` | `default-channel` | Saleor channel slug |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Admin key — bypasses RLS; **never** expose to client |
| `S3_BUCKET` | `animalgarage-media` | Media bucket name |
| `S3_REGION` | `us-west-2` | AWS region |
| `AWS_ACCESS_KEY_ID` | — | IAM credentials (CI/deploy) |
| `AWS_SECRET_ACCESS_KEY` | — | IAM secret |
| `GHOST_URL` | — | Ghost CMS base URL |
| `GHOST_CONTENT_API_KEY` | — | Ghost Content API key |
| `YOUTUBE_API_KEY` | — | YouTube Data API key |
| `YOUTUBE_SYNC_SECRET` | — | Bearer token for cron webhook |
| `SITE_LOCKED` | unset | `true` redirects non-admins to `/locked` (production preview) |
| `DEV_ADMIN` | unset | `true` bypasses admin role on **localhost only** |
| `LOCAL_DEV_AUTH` | unset | `true` shows quick-login on `/auth/sign-in` (localhost only) |

## Missing var behavior

| Scenario | Behavior |
|----------|----------|
| No `.env` file | Public config uses defaults; app runs with mock data |
| Empty `PUBLIC_SALEOR_API_URL` | `saleorFetch()` returns error object, doesn't throw |
| Empty Supabase vars | `getSupabaseConfig()` returns `null`; mock `ag-session` cookie |
| Empty CDN URL | Image URLs stay as-is (picsum in prototype) |

## Rules

- Only `PUBLIC_` prefixed vars are available in client code
- Do not put secrets in `PUBLIC_*` vars
- Do not import private env in `env.ts` (shared with client)
- **Never** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify/production

## Production (Netlify)

Required for full functionality:

- `PUBLIC_SITE_URL=https://animalgarage.net`
- `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL`
- `PUBLIC_CDN_BASE_URL`
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (media pipeline)

Optional: `SITE_LOCKED=true` during preview/maintenance.
