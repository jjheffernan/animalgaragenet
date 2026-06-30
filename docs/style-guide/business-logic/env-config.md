# Environment Config

## Files

| File                    | Purpose                            |
| ----------------------- | ---------------------------------- |
| `.env.example`          | Template with all vars (committed) |
| `.env`                  | Local values (gitignored)          |
| `src/lib/config/env.ts` | Typed public config accessor       |

## Setup

```bash
cp .env.example .env
# Edit .env with local values
```

## Public config (`env.ts`)

**File:** `src/lib/config/env.ts`

```typescript
import { env } from '$env/dynamic/public';

export const config = {
	siteUrl: env.PUBLIC_SITE_URL ?? 'http://localhost:5173',
	cdnBaseUrl: env.PUBLIC_CDN_BASE_URL ?? '',
	saleorApiUrl: env.PUBLIC_SALEOR_API_URL ?? '',
	supabaseUrl: env.PUBLIC_SUPABASE_URL ?? '',
	supabaseAnonKey: env.PUBLIC_SUPABASE_ANON_KEY ?? '',
	defaultLocale: env.PUBLIC_DEFAULT_LOCALE ?? 'en-US',
	defaultCurrency: env.PUBLIC_DEFAULT_CURRENCY ?? 'USD'
} as const;
```

All values fall back to safe defaults or empty strings — missing vars won't crash the dev server.

## All environment variables

### Public (browser-safe)

| Variable                   | Default                 | Description                       |
| -------------------------- | ----------------------- | --------------------------------- |
| `PUBLIC_SITE_URL`          | `http://localhost:5173` | Canonical site URL                |
| `PUBLIC_CDN_BASE_URL`      | `''`                    | CloudFront prefix                 |
| `PUBLIC_SALEOR_API_URL`    | `''`                    | Saleor GraphQL endpoint           |
| `PUBLIC_SUPABASE_URL`      | `''`                    | Supabase project URL              |
| `PUBLIC_SUPABASE_ANON_KEY` | `''`                    | Supabase anon key (RLS-protected) |
| `PUBLIC_DEFAULT_LOCALE`    | `en-US`                 | Default locale code               |
| `PUBLIC_DEFAULT_CURRENCY`  | `USD`                   | Default currency code             |

### Private (server only)

| Variable                    | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `SALEOR_CHANNEL`            | Saleor channel slug (default: `default-channel`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key — never expose to client               |
| Object storage / CDN        | See `.env.example`                               |

## Missing var behavior

| Scenario                      | Behavior                                             |
| ----------------------------- | ---------------------------------------------------- |
| No `.env` file                | Public config uses defaults; app runs with mock data |
| Empty `PUBLIC_SALEOR_API_URL` | `saleorFetch()` returns error object, doesn't throw  |
| Empty Supabase vars           | `getSupabaseConfig()` returns `null`                 |
| Empty CDN URL                 | Image URLs stay as-is (picsum in prototype)          |

## SvelteKit env rules

- Only `PUBLIC_` prefixed vars are available in client code
- Private vars accessed via `$env/dynamic/private` in server files only
- Static env (`$env/static/public`) available if vars are set at build time

## Do not

- Commit `.env` — it's gitignored
- Put secrets in `PUBLIC_*` vars
- Import private env in `env.ts` (shared with client via locale store)
