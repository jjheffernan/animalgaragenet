# Deployment

Production deployment is TBD. Current setup uses `adapter-auto`.

## Build adapter

**File:** `vite.config.ts`

```typescript
import adapter from '@sveltejs/adapter-auto';
// adapter: adapter()
```

`adapter-auto` detects the hosting platform at deploy time. For explicit control, switch to:

| Adapter                        | Platform             |
| ------------------------------ | -------------------- |
| `@sveltejs/adapter-node`       | VPS, Docker, Railway |
| `@sveltejs/adapter-vercel`     | Vercel               |
| `@sveltejs/adapter-netlify`    | Netlify              |
| `@sveltejs/adapter-cloudflare` | Cloudflare Pages     |

## Build command

```bash
npm run build
```

Output in `.svelte-kit/` (gitignored).

## Environment variables (production)

Set all vars from `.env.example` in the hosting platform's env config:

**Required for full functionality:**

- `PUBLIC_SITE_URL=https://animalgarage.net`
- `PUBLIC_SALEOR_API_URL=https://commerce.animalgarage.net/graphql/`
- `SALEOR_CHANNEL=default-channel`
- `PUBLIC_CDN_BASE_URL=https://cdn.animalgarage.net`
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

**AWS (media pipeline):**

- `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) validates lint/check/build on PRs.

Deployment pipeline not yet configured — add platform-specific workflow when host is chosen.

## Pre-launch checklist

- [ ] Choose adapter and hosting platform
- [ ] Configure production env vars
- [ ] Connect Saleor (replace mock data)
- [ ] Configure CDN (replace picsum images)
- [ ] Wire Supabase auth/newsletter
- [ ] Add error pages and SEO meta
- [ ] Performance audit (LCP, CLS)
- [ ] Accessibility audit
- [ ] Enable branch protection on `main` and `dev`

## Static assets

- `static/` files copied to build output at root path
- CDN serves dynamic media (product photos, videos)
- Favicon imported from `$lib/assets/` (hashed at build)

## Domain setup

| Domain                      | Purpose            |
| --------------------------- | ------------------ |
| `animalgarage.net`          | SvelteKit frontend |
| `commerce.animalgarage.net` | Saleor backend     |
| `cdn.animalgarage.net`      | CloudFront media   |

## Security

- Never commit `.env`
- Private env vars only in server runtime
- Supabase RLS on all user tables
- HTTPS everywhere

See [infrastructure.md](../../infrastructure.md) for CDN/S3/Supabase architecture.
