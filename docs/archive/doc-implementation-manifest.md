**Status:** Superseded  
**Archived:** 2026-06-30  
**See instead:** [plans/AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md) · [STATUS.md](../STATUS.md)

# Doc implementation manifest

**Batch audit date:** 2026-06-30  
**Branch:** `dev`  
**Method:** A→Z read of `docs/` vs `src/`, `tests/`, `.env.example`  
**Superseded by:** [AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md) — canonical P0/P1/P2 tracker; do not add new `DOC-###` rows here.

Verdicts: `implement` | `ops-only` | `update-doc` | `archive` | `delete` | `already-done`

---

| ID          | Source doc                              | Finding                                                                     | Verdict      | Owner subagent         | Status  |
| ----------- | --------------------------------------- | --------------------------------------------------------------------------- | ------------ | ---------------------- | ------- |
| DOC-001     | `docs/README.md`                        | Index complete; missing link to `SECURITY-PUBLIC.md` / public-safe policy   | update-doc   | docs-updater           | done    |
| DOC-002     | `docs/PUBLIC-SAFE.md`                   | Near-duplicate of `SECURITY-PUBLIC.md`                                      | delete       | docs-updater           | done    |
| DOC-003     | `docs/SECURITY-PUBLIC.md`               | Canonical public-safe policy                                                | update-doc   | docs-updater           | done    |
| DOC-004     | `docs/STATUS.md`                        | Accurate — 184 unit tests after batch; ops/open tables match code           | already-done | —                      | done    |
| DOC-005     | `docs/archive/*`                        | All files have status banners; superseded paths point to `media-uploads.md` | archive      | —                      | done    |
| DOC-006     | `docs/audits/site-audit.md`             | Tests/security claims match repo                                            | already-done | —                      | done    |
| DOC-007     | `docs/audits/saleor-audit.md`           | Redeem/promo done; checkout gaps accurate                                   | already-done | —                      | done    |
| DOC-008     | `docs/audits/ghost-audit.md`            | Ghost env-gated loaders exist                                               | ops-only     | —                      | pending |
| DOC-009     | `docs/auth/oauth.md`                    | Code map matches implementation                                             | already-done | —                      | done    |
| DOC-010     | `docs/auth/discord.md`, `microsoft.md`  | Provider setup; enablement is Supabase dashboard                            | ops-only     | —                      | pending |
| DOC-011     | `docs/commerce/saleor.md`               | Architecture diagram hostnames — sanitized or already placeholder           | update-doc   | docs-updater           | done    |
| DOC-012     | `docs/commerce/cookies.md`              | Matches `src/lib/cookies.ts`                                                | already-done | —                      | done    |
| DOC-013     | `docs/content/ghost.md`                 | Env-gated; ops to provision Ghost site                                      | ops-only     | —                      | pending |
| DOC-014     | `docs/content/build-submissions.md`     | CRUD done; public `/builds` from approved rows                              | implement    | generalPurpose         | done    |
| DOC-015     | `docs/infrastructure/overview.md`       | Bucket/CDN hostnames in prose                                               | update-doc   | docs-updater           | done    |
| DOC-016     | `docs/integrations/supabase.md`         | Matches `@supabase/ssr`, migrations                                         | already-done | —                      | done    |
| DOC-017     | `docs/meta/decisions.md`                | Org mirror section sanitized                                                | update-doc   | docs-updater           | done    |
| DOC-018     | `docs/meta/inspiration.md`              | Phase 3 P0 bugs marked done                                                 | already-done | —                      | done    |
| DOC-019     | `docs/meta/polish-plan.md`              | P0 Netlify ops; guards done in code                                         | ops-only     | —                      | pending |
| DOC-020     | `docs/plans/TRIAGE.md`                  | Refreshed stats + done rows (auth, UGC, shop filters)                       | update-doc   | docs-updater           | done    |
| DOC-021     | `docs/plans/active/account-flow-fix.md` | `productionAuthMisconfigured` banner on sign-in                             | implement    | security-hardening     | done    |
| DOC-022     | `docs/plans/active/account-flow-fix.md` | Refuse mock `ag-session` on production hostname                             | implement    | security-hardening     | done    |
| DOC-023     | `docs/plans/active/account-flow-fix.md` | Netlify env + redirect URL checklist                                        | ops-only     | —                      | pending |
| DOC-024     | `docs/plans/active/market-readiness.md` | Phase 1–2 Saleor/checkout gaps                                              | ops-only     | —                      | pending |
| DOC-025     | `docs/plans/active/media-uploads.md`    | Phase 1 API + migration in repo; apply on Supabase project                  | implement    | media-uploads          | done    |
| DOC-026     | `docs/plans/TRIAGE.md` §next            | Homepage UGC from approved testimonials                                     | implement    | generalPurpose         | done    |
| DOC-027     | `docs/testing/readiness-report.md`      | Live probe URLs sanitized                                                   | update-doc   | docs-updater           | done    |
| DOC-028     | `docs/testing/external-dependencies.md` | Registry accurate                                                           | already-done | —                      | done    |
| DOC-029     | `docs/testing/security-hardening.md`    | Updated for production auth guards                                          | already-done | —                      | done    |
| DOC-030     | `docs/style-guide/quick-start.md`       | File paths accurate                                                         | already-done | —                      | done    |
| DOC-031–032 | `deployment.md`, `env-config.md`        | Match CONTRIBUTING and `.env.example`                                       | already-done | —                      | done    |
| DOC-033     | `mock-to-saleor.md`                     | Example URLs placeholder-clean                                              | update-doc   | docs-updater           | done    |
| DOC-034     | `saleor-client.md`                      | Hostname placeholder-clean                                                  | update-doc   | docs-updater           | done    |
| DOC-035     | `docs/wiki-export/README.md`            | Public-safe; wiki-export grep clean                                         | already-done | —                      | done    |
| DOC-036     | `polish-plan.md`                        | CI Prettier ~221 files                                                      | implement    | polish-sweep           | blocked |
| DOC-037     | `saleor.md` / TRIAGE                    | Checkout shipping/complete (qty/remove **done**)                            | implement    | saleor-redeem          | blocked |
| DOC-038     | TRIAGE                                  | YouTube `sync.ts` stub                                                      | implement    | external-api-readiness | blocked |
| DOC-039     | TRIAGE                                  | `/builds` from `build_submissions`                                          | implement    | —                      | done    |
| DOC-040     | TRIAGE                                  | Extend `check-secrets.sh` for bundles                                       | implement    | security-hardening     | blocked |

---

## Spawned this batch

| ID                                                                | Subagent ID                            | Workstream         | Result                                       |
| ----------------------------------------------------------------- | -------------------------------------- | ------------------ | -------------------------------------------- |
| DOC-021, DOC-022                                                  | `541544a9-b022-4114-a2bc-7f3f21231dbc` | security-hardening | hooks guard + sign-in banner; 184 tests pass |
| DOC-026                                                           | `cfe6daea-e4fb-4a8d-b8ac-9b3df0c9c2b2` | generalPurpose     | `to-ugc.ts` mapper + homepage loader         |
| DOC-001–003, DOC-011, DOC-015, DOC-017, DOC-027, DOC-033, DOC-034 | `ff59c8cc-4e89-4f67-b82d-0a694085d9c5` | docs-updater       | README index + public-safe scrub             |

## Blocked for parent (at archive time)

| ID               | Reason                                            |
| ---------------- | ------------------------------------------------- |
| DOC-023, DOC-024 | Netlify / Supabase / Saleor dashboard             |
| DOC-036          | Repo-wide Prettier (~221 files)                   |
| DOC-037          | Full checkout payment flow                        |
| DOC-038          | YouTube Data API integration                      |
| DOC-040          | check-secrets.sh bundle scan                      |
