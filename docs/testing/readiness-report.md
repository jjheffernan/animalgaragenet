# External API readiness report

Generated: 2026-06-30  
Command: `npm run test:readiness`  
Probe script: [`scripts/test-readiness.ts`](../../scripts/test-readiness.ts)

## Production Netlify observations (2026-06-30)

Live fetch of https://animalgarage.netlify.app (market-readiness agent). Full roadmap: [`docs/plans/market-readiness.md`](../plans/market-readiness.md).

| Route | HTTP | Finding |
|-------|------|---------|
| `/` | 200 | Homepage live; campaigns, UGC (`@projectredline` handles), videos, builds, guides — **mock data** (picsum images) |
| `/shop` | 200 | **120 items** — exact `mockProducts.length`; names match mock catalog (`Garage Flag Tee`, `Redline Hoodie`, …) |
| `/auth/sign-in` | 200 | Magic link + Google/Discord/Microsoft UI; no dev quick-login (expected on Netlify) |
| `/cart` | 200 | Empty cart; recommendations are mock staff picks |
| `/loyalty` | 200 | “Sign in required” gate |
| `/account` | 302 | → `/auth/sign-in?redirect=/account` (no session cookie) |
| `/admin` | 302 | → `/auth/sign-in?redirect=/admin` (no session cookie) |

**Inference:** Deploy is serving mock commerce when Saleor is unset. On production `PUBLIC_SITE_URL`, catalog loaders **throw** instead of silent mock fallback (`catalog/fallback.ts`).

**Launch blockers visible on production:** mock catalog (120 picsum products), mock homepage content, no verified auth session, checkout not live.

## Summary

| Metric | Count |
|--------|------:|
| Passed | 0 |
| Failed | 0 |
| Skipped | 11 |

**Run result:** All probes skipped — no `.env` with live credentials in this workspace. Probes are read-only; re-run with secrets to get pass/fail signal.

```bash
cp .env.example .env   # fill in values
npm run test:readiness
```

## Probe results

| Dependency | Status | Notes | Required env |
|------------|--------|-------|--------------|
| `supabase-auth` | skip | Missing `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` |
| `supabase-db` | skip | Missing `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `saleor-catalog` | skip | Missing `PUBLIC_SALEOR_API_URL` | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` (default `default-channel`) |
| `saleor-checkout` | skip | Missing `PUBLIC_SALEOR_API_URL` | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` |
| `ghost-cms` | skip | Missing `GHOST_URL`, `GHOST_CONTENT_API_KEY` | `GHOST_URL`, `GHOST_CONTENT_API_KEY` |
| `youtube-sync` | skip | Missing `YOUTUBE_API_KEY` | `YOUTUBE_API_KEY` (+ `YOUTUBE_SYNC_SECRET` for cron route) |
| `oauth-google` | skip | Missing Supabase public keys | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` + dashboard OAuth |
| `oauth-discord` | skip | Missing Supabase public keys | same |
| `oauth-azure` | skip | Missing Supabase public keys | same |
| `cdn-s3` | skip | Env unset; upload path not wired in app | `PUBLIC_CDN_BASE_URL`, `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |
| `netlify-deploy` | skip | Manual workflow — not auto-probed | `ORG_REPO_DEPLOY_KEY` (GitHub Actions secret) |

## Known gaps (code review, not live failures)

| Area | Finding |
|------|---------|
| Production catalog | Netlify serves 120 mock products when Saleor unset — **mock fallback now blocked** on production `PUBLIC_SITE_URL` via `guardMockCatalogFallback()` |
| Auth on Netlify | No session in probe; `PUBLIC_SITE_URL` / Supabase redirect URL mismatch likely (see account-flow-fix plan) |
| `DEV_ADMIN` guard | ~~`animalgarage.netlify.app` not blocked~~ **Fixed** — `isProductionHostname()` includes `*.netlify.app` |
| YouTube | `fetchChannelVideos()` in `src/lib/server/youtube/sync.ts` is a **stub** returning mock data; API key probe can pass while app sync is non-functional |
| CDN / S3 | No server upload routes; env vars documented but integration planned in `docs/plans/media-uploads.md` |
| Saleor checkout | Promo/redeem wired; live checkout needs catalog + channel validation before production cutover |
| OAuth | Discord/Microsoft marked P2 in polish plan; probes only verify Supabase Auth provider flags |
| `check-secrets.sh` | Blocks tracked env files and hardcoded secrets; does not scan client bundles or Netlify env |
| Integration tests | `tests/contracts/` (20 tests) + `tests/integration/crud-business-logic.test.ts` (9 tests); probes in `scripts/test-readiness.ts` |

## Probe reference

| ID | Read-only probe |
|----|-----------------|
| `supabase-auth` | `GET /auth/v1/health` |
| `supabase-db` | `select id from testimonials limit 0` via service role |
| `saleor-catalog` | GraphQL `products(channel, first: 1)` |
| `saleor-checkout` | GraphQL `channel(slug)` — no checkout mutations |
| `ghost-cms` | `GET /ghost/api/content/posts/?limit=1` |
| `youtube-sync` | YouTube Data API `channels.list` (public channel ID) |
| `oauth-*` | `GET /auth/v1/settings` → `external.{provider}` |
| `cdn-s3` | `HEAD` on `PUBLIC_CDN_BASE_URL` |
| `netlify-deploy` | Env presence only |

---

## Implementation todos (for follow-up agents)

- [ ] `readiness-env`: Copy `.env.example` → `.env` with staging/prod secrets so `npm run test:readiness` produces live pass/fail signal in CI or pre-deploy
- [ ] `youtube-live-sync`: Replace `fetchChannelVideos` stub with YouTube Data API v3 and Supabase `videos` upsert
- [ ] `media-uploads-phase1`: Wire S3 presigned upload + `PUBLIC_CDN_BASE_URL` delivery per `docs/plans/media-uploads.md`
- [ ] `saleor-readiness`: Run probes against live Saleor with real channel slug; confirm products, channel, and promo codes before enabling live checkout
- [x] `supabase-contract-tests`: `testimonials` + `build_submissions` in `tests/contracts/supabase-payloads.test.ts` — **`profiles` still open**
- [x] `ghost-contract-test`: Mapper contracts in `tests/contracts/ghost-mapper.test.ts` — raw API fetch test still open
- [ ] `oauth-discord-azure`: Enable Discord + Microsoft providers in Supabase dashboard; verify probes pass
- [ ] `readiness-ci`: Optional GitHub Actions job with secrets (`RUN_READINESS=1`) calling `npm run test:readiness` on schedule or pre-deploy
- [ ] `netlify-deploy-verify`: Confirm `sync-org-main.yml` runs after merge to org mirror; document `ORG_REPO_DEPLOY_KEY` rotation

See [STATUS.md](../STATUS.md) for the consolidated open-work tracker.
