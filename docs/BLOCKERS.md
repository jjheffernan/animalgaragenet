# Ops blockers — single source of truth

**Policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md) — no hostnames or secret values here.

All items below require **dashboard, env, or production access**. They cannot be closed in-repo. How-to steps live in [infrastructure/deployment.md](./infrastructure/deployment.md).

**Code that is ready but waiting on ops** is not listed here — see [STATUS.md](./STATUS.md) § Partial.

---

## Launch sequence (recommended order)

| Step | ID                      | Action                                                       | Console                                                                                      |
| ---- | ----------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1    | NS-OPS-001              | Apply squashed Supabase migrations (5 files)                 | `supabase db reset --linked` or `db push` · [migration-squash-notes.md](./infrastructure/migration-squash-notes.md) |
| 2    | AUD-P0-001–003          | Supabase env + `PUBLIC_SITE_URL` + redirect allowlist        | Netlify + Supabase Auth                                                                      |
| 3    | AUD-P0-005              | Bootstrap first admin                                        | `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin`                      |
| 4    | AUD-P0-004              | Saleor API URL + channel on Netlify                          | Netlify env                                                                                  |
| 5    | NS-OPS-003              | Register Saleor webhooks + `SALEOR_WEBHOOK_SECRET`           | Saleor Dashboard                                                                             |
| 6    | AUD-P1-001-ops          | Stripe Payment App on Saleor channel                         | Saleor Dashboard (not Netlify)                                                               |
| 7    | AUD-P1-008 / IP-015     | Ghost site + `guide` / `blog` tags + env                     | Ghost admin + Netlify                                                                        |
| 8    | NS-OPS-004              | YouTube sync cron + `YOUTUBE_SYNC_SECRET`                    | External scheduler                                                                           |
| 9    | NS-OPS-005              | GitHub Actions secrets for readiness CI                      | Repo Settings                                                                                |
| 10   | NS-OPS-007              | CDN / S3 / CloudFront env                                    | AWS + Netlify                                                                                |
| 11   | AUD-P2-018 / NS-OPS-009 | Discord, Microsoft, social OAuth                             | Supabase + IdP consoles                                                                      |
| 12   | NS-OPS-002              | Verify Storage bucket `ugc`                                  | Supabase (after migrations)                                                                  |
| 13   | NS-OPS-010              | Merge `dev` → `main`                                         | Git / Netlify production deploy                                                              |
| 14   | NS-OPS-011              | Post-deploy QA: `/shop` ≠ 120 mock products; readiness green | Browser + `npm run test:readiness`                                                           |

---

## Blocker table

| ID             | Item                                                        | Owner          |
| -------------- | ----------------------------------------------------------- | -------------- |
| AUD-P0-001     | `SUPABASE_DATABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` on Netlify | auth / ops     |
| AUD-P0-002     | `PUBLIC_SITE_URL` matches browsed deploy origin             | auth / ops     |
| AUD-P0-003     | Supabase redirect URL allowlist (`/auth/callback`)          | auth / ops     |
| AUD-P0-004     | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL`                  | saleor / ops   |
| AUD-P0-005     | First admin via `promote-admin.ts`                          | auth / ops     |
| AUD-P1-001-ops | Stripe Payment App + live pay verify                        | saleor / ops   |
| AUD-P1-008     | Ghost CMS live (`GHOST_*` env)                              | content / ops  |
| AUD-P2-018     | Discord + Microsoft OAuth in Supabase                       | auth / ops     |
| IP-001         | Supabase auth on Netlify preview                            | auth / ops     |
| IP-002         | Live Saleor catalog on Netlify                              | saleor / ops   |
| IP-003-ops     | Checkout live pay (code done; Payment App gate)             | saleor / ops   |
| IP-015         | Ghost blog + guides live                                    | content / ops  |
| NS-OPS-001     | Apply migrations on production Supabase                     | supabase / ops |
| NS-OPS-002     | Storage bucket `ugc` + policies                             | supabase / ops |
| NS-OPS-003     | Saleor webhook → `/api/webhooks/saleor`                     | saleor / ops   |
| NS-OPS-004     | YouTube cron `POST /api/cron/youtube-sync`                  | content / ops  |
| NS-OPS-005     | CI secrets for `readiness-ci.yml`                           | CI / ops       |
| NS-OPS-006     | Org mirror sync after `main` merge                          | maintainer     |
| NS-OPS-007     | CDN invalidation + S3 env                                   | media / ops    |
| NS-OPS-008     | Optional `BUG_REPORT_WEBHOOK_URL`                           | ops            |
| NS-OPS-009     | `SOCIAL_*_CLIENT_ID` for account connections                | auth / ops     |
| NS-OPS-010     | `dev` → `main` production deploy                            | release        |
| NS-OPS-011     | Post-env catalog + readiness QA                             | saleor / ops   |

**Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

---

## Maintainer-only (not in public runbooks)

Record real values in your private ops notes only:

- Organization deploy-repo slug and GitHub deploy-key secret name
- Production Supabase project ref
- Saleor / Ghost / CDN hostnames and bucket names
- Webhook and cron secret values

See maintainer table in [archive/next-steps-tracker.md](./archive/next-steps-tracker.md) § Maintainer-only (historical).
