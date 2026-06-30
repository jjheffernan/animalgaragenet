# Deployment and CI

## Branch flow

```
feature/* → dev (CI) → main (CI) → heff-industries/animalgaragenet → Netlify deploy
```

| Branch | Purpose |
|--------|---------|
| `feature/*` | Individual features — branch from `dev` |
| `dev` | Staging / integration |
| `main` | Production releases |

### Daily workflow

1. Branch from `dev`: `git checkout -b feature/my-feature`
2. Develop and commit on feature branch
3. Open PR → `dev` for staging review and CI
4. QA on staging after merge to `dev`
5. Release: merge `dev` → `main` for production

Rules: do not commit directly to `main` (except release merges). Run `npm run check && npm run lint && npm run build` before PR.

## GitHub Actions

| Workflow | Branch | Trigger | Purpose |
|----------|--------|---------|---------|
| `.github/workflows/ci.yml` | `dev`, `main` | Push/PR on **jjheffernan/animalgaragenet** | Lint, typecheck, unit/e2e tests, build |
| `.github/workflows/sync-org-main.yml` | `main` only | CI success on `main` push, or manual | Mirror `main` → **heff-industries/animalgaragenet** |

CI steps: `npm ci`, `npm run lint`, `npm run check`, `npm run build`.

Org-sync workflow lives on **`main`**, not `dev`. Merging `dev` → `main` brings sync changes into the personal repo.

## Org mirror (Netlify deploy)

Personal repo (`jjheffernan/animalgaragenet`) is where you develop and run GitHub Actions. Org repo is a **read-only deploy mirror** — receives app source only, not workflow files.

Auth uses org-repo deploy key (secret `ORG_REPO_DEPLOY_KEY` on personal repo). Deploy keys cannot push `.github/workflows`, so the mirror builds an orphan snapshot without the workflows folder.

```bash
./scripts/setup-org-sync-auth.sh install   # first time, or rotate key
./scripts/setup-org-sync-auth.sh verify    # list deploy keys + secret names
```

Connect Netlify to `heff-industries/animalgaragenet`, branch `main`.

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow.

## Build

```bash
npm run build
```

Output in `.svelte-kit/` (gitignored). Adapter: `@sveltejs/adapter-auto` (detects platform at deploy time).

## Domains

| Domain | Purpose |
|--------|---------|
| `animalgarage.net` | SvelteKit frontend |
| `commerce.animalgarage.net` | Saleor backend |
| `cdn.animalgarage.net` | CloudFront media |

## Production env vars

Set all vars from `.env.example` in Netlify site settings. See [Environment Variables](Environment-Variables).

Do **not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

## Security

- Never commit `.env`
- Private env vars only in server runtime
- Supabase RLS on all user tables
- HTTPS everywhere

## Branch protection (recommended)

| Branch | Protection |
|--------|------------|
| `main` | Require PR, require CI pass, no direct push |
| `dev` | Require PR, require CI pass |
