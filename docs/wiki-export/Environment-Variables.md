# Environment Variables

Copy `.env.example` → `.env` for local values. Never commit `.env`.

Typed public accessor: `src/lib/config/env.ts`. Private vars use `$env/dynamic/private` in server files only.

> **Security:** Variable **names** for server-only secrets (database admin keys, object-storage credentials, sync tokens) live in `.env.example` inside the cloned repo — not repeated here to avoid publishing an attack checklist on the public wiki.

## Setup

```bash
cp .env.example .env
# Edit .env with local values — see .env.example for the full list
```

## Public (browser-safe)

| Variable                   | Default                 | Description                                       |
| -------------------------- | ----------------------- | ------------------------------------------------- |
| `PUBLIC_SITE_URL`          | `http://localhost:5173` | Canonical site URL (magic links, OAuth redirects) |
| `PUBLIC_CDN_BASE_URL`      | `''`                    | CDN base URL for media                            |
| `PUBLIC_SALEOR_API_URL`    | `''`                    | Saleor GraphQL endpoint                           |
| `PUBLIC_DEFAULT_LOCALE`    | `en-US`                 | Default locale code                               |
| `PUBLIC_DEFAULT_CURRENCY`  | `USD`                   | Default currency code                             |

## Private (server only)

| Category         | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| Commerce channel | Saleor channel slug (server-only)                                        |
| Supabase         | `SUPABASE_DATABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Netlify integration); optional `PUBLIC_SUPABASE_URL` for local `supabase start` |
| Object storage   | Bucket/region and upload credentials for the media pipeline (when wired) |
| CMS / APIs       | Ghost, YouTube, and webhook sync secrets                                 |
| Dev-only flags   | `DEV_ADMIN`, `LOCAL_DEV_AUTH` — **localhost only**                       |
| Preview lockdown | `SITE_LOCKED` — restricts public routes during preview                   |

See `.env.example` in the repo for exact variable names and placeholders.

## Missing var behavior

| Scenario                      | Behavior                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| No `.env` file                | Public config uses defaults; app runs with mock data           |
| Empty `PUBLIC_SALEOR_API_URL` | `saleorFetch()` returns error object, doesn't throw            |
| Empty Supabase vars           | `getSupabaseConfig()` returns `null`; mock `ag-session` cookie |
| Empty CDN URL                 | Image URLs stay as-is (placeholder images in prototype)        |

## Rules

- Only `PUBLIC_` prefixed vars are available in client code
- Do not put secrets in `PUBLIC_*` vars
- Do not import private env in `env.ts` (shared with client)
- **Never** set dev-only admin bypass flags on production hosting
- Rotate any credential that was ever committed or pasted into chat

## Production hosting

Set values from `.env.example` in your host's environment UI (e.g. Netlify). Required groups:

- Site URL + Saleor public URL + channel
- Supabase public URL + anon key + service role (server)
- CDN base URL when media pipeline is live
- Object-storage credentials when uploads are wired

Optional: site lockdown flag during preview/maintenance.
