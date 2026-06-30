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

- `PUBLIC_SITE_URL` — storefront origin (`https://<your-site-host>`)
- `PUBLIC_SALEOR_API_URL` — `https://<your-saleor-host>/graphql/`
- `SALEOR_CHANNEL=default-channel`
- `PUBLIC_CDN_BASE_URL` — `https://<your-cdn-host>`
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

**Media pipeline (future):** see `.env.example` for storage-related server vars.

## CI/CD

| Workflow                              | Branch           | Trigger                              | Purpose                                              |
| ------------------------------------- | ---------------- | ------------------------------------ | ---------------------------------------------------- |
| `.github/workflows/ci.yml`            | `dev` and `main` | Push/PR on this repo                 | Lint, typecheck, unit/e2e tests, build               |
| `.github/workflows/sync-org-main.yml` | **`main` only**  | CI success on `main` push, or manual | Mirror `main` → organization deploy repo for Netlify |

> **Note:** The org-sync workflow and `scripts/sync-org-mirror.sh` live on **`main`**, not `dev`. Merging `dev` → `main` brings sync changes into the personal repo; only then does CI on `main` push to the org mirror.

### Branch flow

```
feature/* → dev (CI) → merge to main (CI) → sync to <organization>/<deploy-repo> → Netlify deploy
```

Personal repo is where you develop and run GitHub Actions. The org repo is a **read-only deploy mirror** — it receives app source only, not workflow files.

### Org mirror (deploy key)

Auth uses an **org-repo deploy key** (GitHub Actions secret on the personal repo), not a PAT. Deploy keys cannot push `.github/workflows`, so the mirror builds an orphan snapshot **without** the workflows folder. Netlify does not need Actions on the org repo.

| Where                                             | What you see                                            |
| ------------------------------------------------- | ------------------------------------------------------- |
| Organization deploy repo → Settings → Deploy keys | Deploy key title (public key fingerprint)               |
| Personal repo → Settings → Secrets → Actions      | Secret **name** only — GitHub never shows secret values |

```bash
./scripts/setup-org-sync-auth.sh install   # first time, or rotate key
./scripts/setup-org-sync-auth.sh verify    # list deploy keys + secret names
./scripts/setup-org-sync-auth.sh cleanup   # remove obsolete PAT secret if set
```

Then connect Netlify to `<organization>/<deploy-repo>`, branch `main`.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow (`workflow_dispatch` does not wait for CI).

## Pre-launch checklist

See [STATUS.md](../../STATUS.md) for the live tracker. Summary:

- [ ] Configure production env vars (Netlify + Supabase + Saleor)
- [ ] Checkout completion and payment (Saleor)
- [ ] Configure CDN (replace picsum images)
- [ ] Wire Supabase newsletter and remaining Phase 4 tables
- [ ] Add error pages and SEO meta
- [ ] Performance audit (LCP, CLS)
- [ ] Accessibility audit
- [ ] Enable branch protection on `main` and `dev`

## Static assets

- `static/` files copied to build output at root path
- CDN serves dynamic media (product photos, videos)
- Favicon imported from `$lib/assets/` (hashed at build)

## Domain setup

Configure separate hosts via env vars (not hardcoded in docs):

| Role           | Env var                 |
| -------------- | ----------------------- |
| Storefront     | `PUBLIC_SITE_URL`       |
| Saleor GraphQL | `PUBLIC_SALEOR_API_URL` |
| Media CDN      | `PUBLIC_CDN_BASE_URL`   |

## Security

- Never commit `.env`
- Private env vars only in server runtime
- Supabase RLS on all user tables
- HTTPS everywhere

See [infrastructure/overview.md](../../infrastructure/overview.md) for CDN/S3/Supabase architecture.
