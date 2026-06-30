# Security hardening changelog

Audit and hardening pass (2026-06-30). Complements `docs/testing/external-dependencies.md`.

## Input validation

- Added `src/lib/server/validation/limits.ts` — canonical max lengths for testimonials, build logs, contact, wholesale, and promo codes.
- `trimToMax()` applied in repositories before insert/update (defense in depth if action validation is bypassed).
- Validation modules (`testimonials/validation.ts`, `build-logs/validation.ts`) and contact/wholesale actions reference shared limits.

## Repository authorization

| Path                     | userId source                          | Status                                                   |
| ------------------------ | -------------------------------------- | -------------------------------------------------------- |
| `account/builds/*`       | `locals.session.id`                    | OK — never from form body                                |
| `loyalty` (testimonials) | `locals.session.id`                    | OK                                                       |
| `forms/submit.ts`        | `options.userId` only (server callers) | Documented; no route passes client-supplied userId today |

Build log updates use `.eq('user_id', userId)` on all Supabase writes.

## Cookies

| Cookie          | Change           | Risk                                                                                                                  |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ag-mock-promo` | `httpOnly: true` | Was readable by JS; client never read it (hydrated via server load + API response). Tightened without cart UX change. |

Mock promo state is non-sensitive (discount label/percent for dev catalog); httpOnly prevents trivial XSS cookie tampering.

## Promo abuse

- In-memory rate limit: 10 attempts/min per IP via `checkRateLimit()` in `src/lib/server/rate-limit.ts`.
- Applied in `redeemCode()` when `clientKey` (from `getClientAddress()`) is provided — `/cart/checkout/promo` POST and `/account/redeem` apply action.
- Promo code input capped at 64 chars.

## Sanitization

- Testimonials and build logs: plain text in UI (Svelte escaping); server enforces trim + max length.
- CMS/Ghost HTML: unchanged — `sanitizeRichHtml()` in `RichContent.svelte` for blog/guides only.

## Local dev guards

- `isLocalDevAuthEnabled`: localhost only + `isProductionSiteUrl()` false.
- `isDevAdminEnabled`: requires `DEV_ADMIN=true`, blocks production hostnames via `isProductionHostname()`, and blocks when `SITE_URL` points at production.

## Production auth guards (DOC-021 / DOC-022)

- **`hooks.server.ts`**: When Supabase is not configured, `parseSessionCookie('ag-session')` is skipped on production hostnames (`isProductionHostname`); `event.locals.session` stays `null` instead of accepting mock sessions.
- **`/auth/sign-in`**: Server load exposes `productionAuthMisconfigured` when keys are missing on a production host; the page renders an amber ops warning and disables magic-link/OAuth controls. The sign-in action returns 503 on production hosts without Supabase (no mock `ag-session` cookie).

## Tests

- `src/lib/server/validation/limits.test.ts`
- `src/lib/server/rate-limit.test.ts`
- Existing `local-dev.test.ts` covers production hostname guards
- `tests/integration/auth-actions.test.ts` — rejects mock sign-in on production hostname without Supabase

## Deferred

| Item                                                         | Reason                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Distributed rate limiting (Redis/Netlify edge)               | In-memory limit is per-instance; sufficient for mock promo abuse |
| OTP / magic-link rate limits                                 | Auth provider responsibility; not in this pass                   |
| `contact_submissions` / `wholesale_inquiries` DB persistence | Still stubbed in `submitFormStub`                                |
| RLS contract integration tests                               | Planned in external-dependencies registry                        |
| `scripts/check-secrets.sh` alignment                         | Documented in [readiness-report.md](./readiness-report.md); run `bash scripts/check-secrets.sh` before push |

Last updated: 2026-07-03

## Documentation scrub (2026-07-03)

Public-safe pass after next-steps / deployment runbook land:

| Fix | Files |
| --- | ----- |
| Redacted personal fork slug, org-sync secret name, deploy-key fingerprint prose | `infrastructure/deployment.md`, `style-guide/backend-ops/deployment.md`, `STATUS.md`, `next-steps-tracker.md` |
| Redacted `garage.internal`, `ag-media-dev` bucket literal | `archive/media-cdn-plan.md` |
| Expanded `SECURITY-PUBLIC.md` pre-PR grep + placeholders | `SECURITY-PUBLIC.md` |
| Linked `next-steps-tracker.md` from index docs | `README.md`, `plans/README.md`, `AUDIT-REMEDIATION.md` |
| Maintainer-only infra table | `plans/active/next-steps-tracker.md` |
