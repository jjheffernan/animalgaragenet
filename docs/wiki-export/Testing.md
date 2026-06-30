# Testing

## Commands

| Command | Purpose |
|---------|---------|
| `npm run test:unit` | All unit + integration tests (Vitest) |
| `npm run test:contracts` | Payload / mapper contract tests only |
| `npm run test:readiness` | Live API smoke probes — skips when env unset |
| `npm run test` | Unit + e2e |
| `npm run test:e2e` | Playwright e2e |
| `npm run test:ci` | Unit + e2e with `CI=true` |

```bash
npm run test:unit
npm run test:contracts
cp .env.example .env   # fill values for live probes
npm run test:readiness
```

## Test layout

```
tests/
  integration/          # SvelteKit actions + API routes (mocked externals)
  contracts/            # Payload shape + mapper contracts
  readiness/            # Opt-in live probes (scripts/test-readiness.ts)
src/lib/server/**/**.test.ts   # Unit tests with mocks
```

## Contract tests

`npm run test:contracts` runs `tests/contracts/`:

| Contract | Coverage |
|----------|----------|
| `auth-session-shape.test.ts` | Session shape (4 tests) |
| `supabase-payloads.test.ts` | DB payload shapes (8 tests) |
| `saleor-checkout-shape.test.ts` | Checkout shapes (6 tests) |
| `ghost-mapper.test.ts` | Ghost mapper (2 tests) |

## External dependencies registry

Canonical list in repo: `docs/testing/external-dependencies.md`.

| ID | Service | Mock fallback | Unit tests | Integration |
|----|---------|---------------|------------|-------------|
| `supabase-auth` | Supabase Auth | `ag-session` cookie | `local-dev.test.ts`, `roles.test.ts` | `auth-actions.test.ts` |
| `supabase-db` | Supabase Postgres | In-memory maps | `repository.test.ts` | `crud-business-logic.test.ts` |
| `saleor-catalog` | Saleor GraphQL | `src/lib/data/mock/*` | `mappers.test.ts`, `metadata.test.ts` | `shop-load.test.ts` |
| `saleor-checkout` | Saleor checkout | localStorage cart | `checkout.test.ts` | `cart-checkout.test.ts` |
| `ghost-cms` | Ghost Content API | `mock-blog.ts` | `posts.test.ts`, `mappers.test.ts` | — |
| `youtube-sync` | YouTube Data API | mock videos | partial | admin sync (planned) |
| `cdn-s3` | S3 / CloudFront | picsum / static | — | — |
| `oauth-*` | Google/Discord/Microsoft | mock callback | `oauth.test.ts` | callback flow |
| `netlify-deploy` | Org mirror sync | — | — | manual workflow |

## Readiness probes

`npm run test:readiness` runs read-only probes in `scripts/test-readiness.ts`. Each probe **skips** when required env vars are unset.

| Dependency | Required env |
|------------|--------------|
| `supabase-auth` | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` |
| `supabase-db` | `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `saleor-catalog` | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` |
| `saleor-checkout` | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` |
| `ghost-cms` | `GHOST_URL`, `GHOST_CONTENT_API_KEY` |
| `youtube-sync` | `YOUTUBE_API_KEY` |
| `oauth-*` | Supabase public keys + dashboard OAuth |
| `cdn-s3` | `PUBLIC_CDN_BASE_URL`, `S3_*`, AWS keys |
| `netlify-deploy` | `ORG_REPO_DEPLOY_KEY` (manual) |

Report output: `docs/testing/readiness-report.md`.

## Pre-PR checks

```bash
npm run lint
npm run check
npm run build
npm run test:unit
```

## Mock vs live testing

With env unset, auth/catalog/checkout flows use mock fallbacks. With env set, test against real Supabase/Saleor projects or local stacks.
