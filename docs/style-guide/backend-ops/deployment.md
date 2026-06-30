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

GitHub **cannot mint fine-grained PATs via API** — use a deploy key (recommended for CI) or create a PAT in the browser.

**Deploy key (via `scripts/setup-org-sync-auth.sh`):**

- Write deploy key on `heff-industries/animalgaragenet` (`personal-main-sync`)
- Secret `ORG_REPO_DEPLOY_KEY` on `jjheffernan/animalgaragenet`
- Re-run: `./scripts/setup-org-sync-auth.sh deploy-key`

**Fine-grained PAT (manual alternative):**

```bash
./scripts/setup-org-sync-auth.sh pat-url   # prints pre-filled GitHub URL
gh secret set ORG_REPO_SYNC_TOKEN --repo jjheffernan/animalgaragenet
```

Switch the sync workflow to HTTPS if you prefer PAT over deploy key.

3. Connect Netlify to `heff-industries/animalgaragenet`, branch `main`.
4. Re-run **Sync main to org** from Actions if you need to backfill without a new commit.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow.

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
