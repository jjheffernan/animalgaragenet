# Testing

## Commands

| Command                  | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `npm run test:unit`      | All unit + integration tests (Vitest)        |
| `npm run test:contracts` | Payload / mapper contract tests only         |
| `npm run test:readiness` | Live API smoke probes — skips when env unset |
| `npm run test`           | Unit + e2e                                   |
| `npm run test:e2e`       | Playwright e2e (42 specs)                    |
| `npm run test:ci`        | Unit + e2e with `CI=true`                    |

```bash
npm run test:unit
npm run test:contracts
cp .env.example .env   # fill values for live probes (local only)
npm run test:readiness
bash scripts/check-secrets.sh
```

## Test layout

```
e2e/                  # Playwright — smoke, cart, auth, navigation, shop, builds, …
tests/
  integration/        # SvelteKit actions + API routes (mocked externals)
  contracts/          # Payload shape + mapper contracts
src/lib/**/*.test.ts  # Unit tests with mocks
```

Readiness probes: `scripts/test-readiness.ts`

## E2E (Playwright)

CI runs the full `e2e/` suite against `npm run preview` with mock auth env (no live Supabase/Saleor required).

| Spec area              | Coverage (summary)                                |
| ---------------------- | ------------------------------------------------- |
| `smoke.spec.ts`        | Homepage, shop, parts, search, cart, static pages |
| `cart.spec.ts`         | Add to cart, drawer, quantity, cart page          |
| `account.spec.ts`      | Sign-in, mock auth, account sub-routes            |
| `auth-crud.spec.ts`    | Dev quick login, build log + testimonial CRUD     |
| `navigation.spec.ts`   | Header, mobile drawer, footer links               |
| `shop-catalog.spec.ts` | Category pills, product detail navigation         |

Local run: `npm run test:e2e` (builds preview server automatically per `playwright.config.ts`).

## Contract tests

`npm run test:contracts` runs `tests/contracts/`:

| Contract                          | Coverage                  |
| --------------------------------- | ------------------------- |
| `auth-session-shape.test.ts`      | Session shape             |
| `supabase-payloads.test.ts`       | DB payload shapes         |
| `saleor-checkout-shape.test.ts`   | Checkout shapes           |
| `ghost-mapper.test.ts`            | Ghost mapper              |
| `builds-to-thread.test.ts`        | Build → thread mapping    |
| `testimonials-to-ugc.test.ts`     | Testimonial → UGC mapping |
| `profiles-signup-trigger.test.ts` | Profile signup trigger    |

## External dependencies registry

Canonical list in repo: `docs/testing/external-dependencies.md`.

| ID                | Service              | Mock fallback         |
| ----------------- | -------------------- | --------------------- |
| `supabase-auth`   | Supabase Auth        | `ag-session` cookie   |
| `supabase-db`     | Supabase Postgres    | In-memory maps        |
| `saleor-catalog`  | Saleor GraphQL       | `src/lib/data/mock/*` |
| `saleor-checkout` | Saleor checkout      | localStorage cart     |
| `ghost-cms`       | Ghost Content API    | `mock-blog.ts`        |
| `youtube-sync`    | YouTube Data API     | mock videos           |
| `cdn-s3`          | Object storage / CDN | placeholder images    |
| `oauth-*`         | OAuth providers      | mock callback         |
| `netlify-deploy`  | Deploy mirror sync   | manual workflow       |

## Readiness probes

`npm run test:readiness` runs read-only probes. Each probe **skips** when required env vars are unset. Also runs on schedule via `readiness-ci.yml` (non-blocking on PRs).

| Dependency        | Required (summary)                                 |
| ----------------- | -------------------------------------------------- |
| `supabase-auth`   | Supabase public URL + anon key                     |
| `supabase-db`     | Supabase URL + server admin key                    |
| `saleor-catalog`  | Saleor public URL + channel                        |
| `saleor-checkout` | Saleor public URL + channel                        |
| `ghost-cms`       | Ghost URL + content API key                        |
| `youtube-sync`    | YouTube API key                                    |
| `oauth-*`         | Supabase public keys + dashboard OAuth             |
| `cdn-s3`          | CDN base URL + storage config (see `.env.example`) |
| `netlify-deploy`  | Deploy-mirror secret (maintainers)                 |

Exact variable names: `.env.example` in the repo. Do not paste probe output containing live URLs or keys into public issues.

Report template: `docs/testing/readiness-report.md`.

## Pre-PR checks

```bash
npm run lint
npm run check
npm run test:unit
npm run test:contracts
npm run build
bash scripts/check-secrets.sh
```

## Mock vs live testing

With env unset, auth/catalog/checkout flows use mock fallbacks locally. With env set, test against your staging Supabase/Saleor projects. On production `PUBLIC_SITE_URL`, catalog mock fallback is disabled — Saleor must be healthy.
