# External dependencies — test & readiness registry

Canonical list of outbound integrations for Animal Garage. Keep in sync with `tests/integration/` and `.cursor/agents/external-api-readiness.md`.

| ID | Service | Client / entry | Env vars | Mock fallback | Unit tests | Integration tests | Contracts | Live readiness |
|----|---------|----------------|----------|---------------|------------|-------------------|-----------|----------------|
| `supabase-auth` | Supabase Auth | `src/lib/server/supabase/auth.ts`, `hooks.server.ts` | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` | `ag-session` cookie | `local-dev.test.ts`, `roles.test.ts` | `auth-actions.test.ts` | `auth-session-shape.test.ts` (4) | skip — `/auth/v1/health` |
| `supabase-db` | Supabase Postgres | `createAdminClient()` repositories | `SUPABASE_SERVICE_ROLE_KEY` | In-memory maps | `repository.test.ts` (builds, testimonials) | `crud-business-logic.test.ts` (9) | `supabase-payloads.test.ts` (8) | skip — testimonials `select limit 0` |
| `saleor-catalog` | Saleor GraphQL | `saleor/client.ts`, `catalog/*` | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` | `src/lib/data/mock/*` | `mappers.test.ts`, `metadata.test.ts`, `channels.test.ts` | `shop-load.test.ts` | — | skip — products query |
| `saleor-checkout` | Saleor checkout | `saleor/checkout.ts`, `/cart/checkout` | same | localStorage cart | `checkout.test.ts` | `cart-checkout.test.ts`, `cart-promo.test.ts` | `saleor-checkout-shape.test.ts` (6) | skip — channel query (no mutations) |
| `ghost-cms` | Ghost Content API | `server/ghost/*` | `GHOST_URL`, `GHOST_CONTENT_API_KEY` | `mock-blog.ts` | `posts.test.ts`, `mappers.test.ts` | — | `ghost-mapper.test.ts` (2) | skip — posts list |
| `youtube-sync` | YouTube Data API | `server/youtube/sync.ts` | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` | mock videos | partial | **admin sync route** (planned) | — | skip — channels.list (app sync stub) |
| `cdn-s3` | S3 / CloudFront | planned | `S3_*`, `PUBLIC_CDN_BASE_URL` | picsum / static | — | — | — | skip — not wired |
| `oauth-google` | Google OAuth | Supabase OAuth | Supabase dashboard | mock callback | `oauth.test.ts` | callback flow | — | skip — Auth settings probe |
| `oauth-discord` | Discord OAuth | Supabase OAuth | Supabase dashboard | mock callback | `oauth.test.ts` | — | — | skip — Auth settings probe |
| `oauth-azure` | Microsoft OAuth | Supabase OAuth | Supabase dashboard | mock callback | `oauth.test.ts` | — | — | skip — Auth settings probe |
| `netlify-deploy` | GitHub → org mirror | `sync-org-main.yml` | `ORG_REPO_DEPLOY_KEY` | — | — | — | — | skip — manual workflow |

## Supabase tables (server writes)

| Table | Repository | Required columns on insert | AuthZ |
|-------|------------|---------------------------|-------|
| `build_submissions` | `build-logs/repository.ts`, `forms/submit.ts` | snake_case: `user_id`, `mod_list`, `status` | `user_id` from session only |
| `testimonials` | `testimonials/repository.ts` | snake_case per migration | `user_id` from session; admin moderates |
| `profiles` | migration only | `id`, `role` in app_metadata | RLS per migration |

## Test layout

```
tests/
  integration/          # SvelteKit actions + API routes (mocked externals)
  contracts/            # Payload shape + mapper contracts (npm run test:contracts)
  readiness/            # Opt-in vitest live probes (planned; see scripts/test-readiness.ts)
src/lib/server/**/**.test.ts   # Unit tests with mocks
```

## Commands

```bash
npm run test:unit              # All unit + integration (vitest)
npm run test:contracts         # Payload / mapper contracts only
npm run test:readiness         # Live API smoke — skips when env unset (see readiness-report.md)
```

Last updated: 2026-06-30 (readiness probes added)
