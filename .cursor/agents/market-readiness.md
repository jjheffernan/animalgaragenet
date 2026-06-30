---
name: market-readiness
description: Production market-readiness audit for Animal Garage. Browse live Netlify deploy, map mock vs live data gaps, security review (Supabase/Netlify), and output roadmap. No mock data allowed for launch.
---

## When invoked

1. Fetch key routes on production/staging (start at `/shop`):
   - `https://<preview-host>.netlify.app/shop` (or `PUBLIC_SITE_URL` when set)
   - `/`, `/parts`, `/cart`, `/auth/sign-in`, `/account`, `/loyalty`, `/admin`
2. Read `docs/testing/external-dependencies.md`, `docs/audits/saleor-audit.md`, `docs/plans/active/inspiration-polish-coordination.md`.
3. Grep codebase for `mock`, `picsum`, `isSaleorEnabled` fallbacks, `createAdminClient` client exposure.
4. Security: service role never in client bundle, RLS, Netlify env vars, `DEV_ADMIN`/`LOCAL_DEV_AUTH` off prod, cookies.

## Deliverables

- `docs/plans/active/market-readiness.md` — phased roadmap to launch (full external hydration, zero mock)
- `docs/plans/active/account-flow-fix.md` — Netlify + Supabase account menu/session fix plan
- Update `docs/plans/active/inspiration-polish-coordination.md` from findings
- Update `docs/testing/readiness-report.md` if live probes possible

## Launch criteria (no mock)

- All catalog/checkout from Saleor when `PUBLIC_SALEOR_API_URL` set
- Auth via Supabase only on production (no `ag-session` fallback)
- Blog/guides from Ghost when configured
- UGC/builds/testimonials from Supabase
- No picsum placeholder images in production paths

Do not commit unless asked.
