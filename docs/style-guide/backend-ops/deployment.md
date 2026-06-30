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

| Workflow | Branch | Trigger | Purpose |
| -------- | ------ | ------- | ------- |
| `.github/workflows/ci.yml` | `dev` and `main` | Push/PR on **jjheffernan/animalgaragenet** | Lint, typecheck, unit/e2e tests, build |
| `.github/workflows/sync-org-main.yml` | **`main` only** | CI success on `main` push, or manual | Mirror `main` → **heff-industries/animalgaragenet** for Netlify |

> **Note:** The org-sync workflow and `scripts/sync-org-mirror.sh` live on **`main`**, not `dev`. Merging `dev` → `main` brings sync changes into the personal repo; only then does CI on `main` push to the org mirror.

### Branch flow

```
feature/* → dev (CI) → merge to main (CI) → sync to heff-industries/animalgaragenet → Netlify deploy
```

Personal repo (`jjheffernan/animalgaragenet`) is where you develop and run GitHub Actions. The org repo is a **read-only deploy mirror** — it receives app source only, not workflow files.

### Org mirror (deploy key)

Auth uses an **org-repo deploy key** (secret `ORG_REPO_DEPLOY_KEY` on the personal repo), not a PAT. Deploy keys cannot push `.github/workflows`, so the mirror builds an orphan snapshot **without** the workflows folder. Netlify does not need Actions on the org repo.

One-time setup:

```bash
./scripts/setup-org-sync-auth.sh install   # creates key on heff-industries/animalgaragenet, stores secret
./scripts/setup-org-sync-auth.sh verify    # list keys + secret names (values never shown)
```

Then connect Netlify to `heff-industries/animalgaragenet`, branch `main`.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow (on `jjheffernan/animalgaragenet`).

Obsolete: `ORG_REPO_SYNC_TOKEN` (PAT) — remove with `./scripts/setup-org-sync-auth.sh cleanup` if still present.

## Pre-launch checklist

- [ ] Choose adapter and hosting platform
- [ ] Configure production env vars
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
