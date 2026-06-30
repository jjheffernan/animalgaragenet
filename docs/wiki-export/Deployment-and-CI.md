# Deployment and CI

> **Public wiki:** Org names, deploy-mirror credentials, and production hostnames are configured per environment — not documented on this public wiki.

## Branch flow

```
feature/* → dev (CI) → main (CI) → organization deploy mirror → Netlify
```

| Branch      | Purpose                                 |
| ----------- | --------------------------------------- |
| `feature/*` | Individual features — branch from `dev` |
| `dev`       | Staging / integration                   |
| `main`      | Production releases                     |

### Daily workflow

1. Branch from `dev`: `git checkout -b feature/my-feature`
2. Develop and commit on feature branch
3. Open PR → `dev` for staging review and CI
4. QA on staging after merge to `dev`
5. Release: merge `dev` → `main` for production

Rules: do not commit directly to `main` (except release merges). Run the [pre-PR checklist](Getting-Started#pre-pr-checklist) before opening a PR.

## GitHub Actions

| Workflow            | Branch / trigger            | Purpose                                                                  |
| ------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `ci.yml`            | `dev`, `main` (push/PR)     | Lint, secrets guard, check, unit + contract tests, build, Playwright e2e |
| `readiness-ci.yml`  | PR, weekly schedule, manual | Live API readiness probes (skips when secrets unset)                     |
| `sync-org-main.yml` | `main` after CI             | Mirror `main` to organization deploy repo                                |

### CI pipeline (`ci.yml`)

Runs on **Node.js 24**. Steps:

1. `npm ci`
2. `bash scripts/check-secrets.sh`
3. `npm run lint`
4. `npm run check`
5. `npm run test:unit`
6. `npm run test:contracts`
7. Optional live Saleor smoke (repository secrets; non-blocking)
8. `npm run build`
9. `npm run test:e2e` (Playwright, Chromium)

The org-sync workflow runs on **`main`**, not `dev`. Merging `dev` → `main` brings sync changes into the development repo.

## Deploy mirror

Development happens in the personal GitHub repo with Actions. A separate **organization repository** receives a snapshot of `main` for Netlify — workflows are excluded from the mirror by design.

Mirror authentication uses a **GitHub Actions secret** (deploy key or equivalent). Setup and rotation scripts live in the repo under `scripts/` — run only by maintainers with repo admin access.

Connect Netlify to the organization deploy repo, branch `main`. Set **Node 24** in Netlify build settings (or rely on `.nvmrc`).

Manual re-sync: GitHub → Actions → **Sync main to org** → Run workflow (maintainers).

## Build

```bash
npm run build
```

Output in `.svelte-kit/` (gitignored). Adapter: `@sveltejs/adapter-auto` (detects platform at deploy time).

## Domains and backends

Configure in environment variables (not listed here):

- **Storefront** — `PUBLIC_SITE_URL`
- **Saleor** — `PUBLIC_SALEOR_API_URL`
- **CDN** — `PUBLIC_CDN_BASE_URL`

Use separate hosts for frontend, commerce API, and media delivery.

## Production env vars

Set all vars from `.env.example` in the hosting provider's secret UI. See [Environment Variables](Environment-Variables).

**Full runbook (repo):** `docs/infrastructure/deployment.md` — Netlify checklist by service, Supabase `db push`, Saleor webhook, Ghost, OAuth redirects, YouTube cron, CDN invalidation, post-deploy smoke.

Do **not** set dev-only admin bypass flags on production.

## Security

- Never commit `.env`
- Private env vars only in server runtime
- Supabase RLS on all user tables
- HTTPS everywhere
- Do not document or screenshot live credentials in issues, wiki, or PRs

## Branch protection (recommended)

| Branch | Protection                                  |
| ------ | ------------------------------------------- |
| `main` | Require PR, require CI pass, no direct push |
| `dev`  | Require PR, require CI pass                 |
