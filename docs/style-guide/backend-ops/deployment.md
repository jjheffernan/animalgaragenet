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

| Workflow | Trigger | Purpose |
| -------- | ------- | ------- |
| `.github/workflows/ci.yml` | Push/PR to `dev` or `main` on **jjheffernan/animalgaragenet** | Lint, typecheck, unit/e2e tests, build |
| `.github/workflows/sync-org-main.yml` | CI success on `main`, or manual | Mirror `main` → **heff-industries/animalgaragenet** for Netlify |

### Branch flow

```
feature/* → dev (CI) → merge to main (CI) → sync to heff-industries/animalgaragenet → Netlify deploy
```

Personal repo (`jjheffernan/animalgaragenet`) is where you develop. The org repo is the production mirror only.

### One-time sync setup

**Use the deploy key only.** PATs (`ORG_REPO_SYNC_TOKEN`) are not used by the sync workflow.

| Where | What you see |
| ----- | ------------ |
| `heff-industries/animalgaragenet` → Settings → Deploy keys | `personal-main-sync` (public key) |
| `jjheffernan/animalgaragenet` → Settings → Secrets → Actions | Secret **name** `ORG_REPO_DEPLOY_KEY` only — GitHub never shows secret values |

Why we were stuck:

1. **Deploy key** can push code but GitHub **blocks** updating `.github/workflows/*` via deploy keys.
2. **PAT** stored as a secret does not appear on the org repo — only on the personal repo secrets list (names only).
3. OAuth / `gh auth token` tokens fail in Actions with `Permission denied to github-actions[bot]`.

**Fix:** `scripts/sync-org-mirror.sh` builds an orphan snapshot of `main` **without** `.github/workflows` and force-pushes to org `main`. Netlify does not need Actions on the org repo.

```bash
./scripts/setup-org-sync-auth.sh install   # first time, or rotate key
./scripts/setup-org-sync-auth.sh verify    # list deploy keys + secret names
```

3. Connect Netlify to `heff-industries/animalgaragenet`, branch `main`.
4. Re-run **Sync main to org** from Actions if you need to backfill without a new commit.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow (`workflow_dispatch` does not wait for CI).

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
