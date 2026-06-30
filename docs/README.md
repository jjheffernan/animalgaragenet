# Animal Garage — Documentation index

Architecture, integration plans, and developer reference for **animalgarage.net**.

## Vision

A highly animated, media-heavy automotive brand site — merchandising-forward digital marketing with parts, community, and on-domain media. The frontend is a SvelteKit headless storefront; commerce runs on Saleor at a separate domain; media ships via CDN; non-commerce data lives in Supabase.

**Open work tracker:** [STATUS.md](./STATUS.md) · **Implementer queue:** [plans/active/next-steps-tracker.md](./plans/active/next-steps-tracker.md) · **Audit remediation:** [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md) · **Public doc policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md) — no infra hostnames or secrets in `docs/`.

**Developer how-to:** [style-guide/README.md](./style-guide/README.md) — Svelte patterns, deployment, env config.

---

## Archive

Complete, superseded, or stale plans. Each file has a status banner.

| Doc                                                                        | Notes                                  |
| -------------------------------------------------------------------------- | -------------------------------------- |
| [archive/README.md](./archive/README.md)                                   | Index of archived docs                 |
| [archive/daisyui.md](./archive/daisyui.md)                                 | Stale — Tailwind zinc only             |
| [archive/phase3-plan.md](./archive/phase3-plan.md)                         | Complete — workstreams A–D             |
| [archive/animation-media.md](./archive/animation-media.md)                 | Stale — marketing strategy             |
| [archive/dashboard-adoption-plan.md](./archive/dashboard-adoption-plan.md) | Complete — in-repo `/admin`            |
| [archive/media-cdn-plan.md](./archive/media-cdn-plan.md)                   | Superseded — see media-uploads phase 1 |
| [archive/polish-plan.md](./archive/polish-plan.md)                         | Complete — see inspiration-polish-tracker |
| [archive/doc-implementation-manifest.md](./archive/doc-implementation-manifest.md) | Superseded — June 2026 batch audit (`DOC-###`) |
| [archive/batch-2026-07-01.md](./archive/batch-2026-07-01.md) | Complete — July 1 implementer batch |
| [archive/batch-2026-07-02.md](./archive/batch-2026-07-02.md) | Complete — July 2 implementer batch (BATCH-013–020) |
| [archive/batch-2026-07-03-followups.md](./archive/batch-2026-07-03-followups.md) | Complete — BATCH-021 + ops apply checklist |

---

## Audits

**Canonical open-item tracker:** [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md) (P0/P1/P2 — merges audits, STATUS, TRIAGE, DOC manifest).

| Doc                                                          | Purpose                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md)   | **Tracker** — open/blocker items with acceptance criteria |
| [audits/site-audit.md](./audits/site-audit.md)               | Security, gaps, fix log (detail)                          |
| [audits/ghost-audit.md](./audits/ghost-audit.md)             | Ghost CMS wiring inventory (detail)                       |
| [audits/saleor-audit.md](./audits/saleor-audit.md)           | Saleor integration scorecard (detail)                     |
| [audits/security-audit-2026-07.md](./audits/security-audit-2026-07.md) | CDN invalidation hardening (detail)                 |
| [audits/sitemap-route-audit.md](./audits/sitemap-route-audit.md) | Sitemap gaps, orphan routes, stub pages (detail)    |
| [meta/agents-skills-audit.md](./meta/agents-skills-audit.md) | Cursor agents/skills dead-reference audit                 |

---

## Auth

| Doc                                      | Purpose                        |
| ---------------------------------------- | ------------------------------ |
| [auth/oauth.md](./auth/oauth.md)         | Shared PKCE OAuth architecture |
| [auth/discord.md](./auth/discord.md)     | Discord provider setup         |
| [auth/microsoft.md](./auth/microsoft.md) | Microsoft / Azure AD setup     |

---

## Commerce

| Doc                                          | Purpose                              |
| -------------------------------------------- | ------------------------------------ |
| [commerce/saleor.md](./commerce/saleor.md)   | Saleor integration plan              |
| [commerce/cookies.md](./commerce/cookies.md) | Cookie consent and promo persistence |

---

## Content

| Doc                                                            | Purpose                   |
| -------------------------------------------------------------- | ------------------------- |
| [content/ghost.md](./content/ghost.md)                         | Ghost CMS setup and tags  |
| [content/build-submissions.md](./content/build-submissions.md) | Build log submission flow |

---

## Infrastructure

| Doc                                                        | Purpose                        |
| ---------------------------------------------------------- | ------------------------------ |
| [infrastructure/deployment.md](./infrastructure/deployment.md) | **Production runbook** — Netlify env, Supabase push, webhooks, smoke |
| [infrastructure/overview.md](./infrastructure/overview.md) | CDN, S3, Supabase architecture |
| [infrastructure/migration-squash-notes.md](./infrastructure/migration-squash-notes.md) | Supabase migration squash (17 → 3) |
| [infrastructure/supabase-schema.md](./infrastructure/supabase-schema.md) | Table inventory |

---

## Integrations

| Doc                                                    | Purpose                         |
| ------------------------------------------------------ | ------------------------------- |
| [integrations/supabase.md](./integrations/supabase.md) | Auth, RLS, local dev, site lock |

---

## Meta

| Doc                                                          | Purpose                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md)                   | Public documentation policy — placeholders, no infra leaks       |
| [meta/decisions.md](./meta/decisions.md)                     | Persistent product/tech choices                                  |
| [meta/inspiration.md](./meta/inspiration.md)                 | Feature backlog — integrated vs remaining                        |
| [meta/README.md](./meta/README.md)                           | Meta docs index                                                  |
| [archive/polish-plan.md](./archive/polish-plan.md)           | Archived session polish (code complete)                          |
| [meta/agents-skills-audit.md](./meta/agents-skills-audit.md) | Cursor agents/skills audit (detail — tracker: AUDIT-REMEDIATION) |

---

## Plans

| Doc                                                                            | Purpose                                 |
| ------------------------------------------------------------------------------ | --------------------------------------- |
| [plans/README.md](./plans/README.md)                                           | Plan lifecycle                          |
| [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md)                     | Consolidated audit remediation tracker  |
| [plans/TRIAGE.md](./plans/TRIAGE.md)                                           | Plan vs codebase verification           |
| [plans/active/next-steps-tracker.md](./plans/active/next-steps-tracker.md) | Consolidated unblocked vs ops-blocked queue |
| [plans/active/inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) | Open work — inspiration + polish + AUDIT IDs + prod setup |
| [plans/active/ponytail-audit-tracker.md](./plans/active/ponytail-audit-tracker.md) | Server-side dedupe / guard tightening (no UI markup) |
| [plans/active/account-flow-fix.md](./plans/active/account-flow-fix.md)         | Netlify + Supabase account ops          |
| [plans/active/market-readiness.md](./plans/active/market-readiness.md)         | Phased launch roadmap                   |
| [plans/active/media-uploads.md](./plans/active/media-uploads.md)               | UGC upload pipeline — Phase 1 wired; apply migration on Supabase |

---

## Style guide

Comprehensive dev reference — [style-guide/README.md](./style-guide/README.md)

Subfolders: `frontend/`, `business-logic/`, `backend-ops/` (not restructured here).

---

## Testing

| Doc                                                                    | Purpose              |
| ---------------------------------------------------------------------- | -------------------- |
| [testing/e2e-policy.md](./testing/e2e-policy.md)                     | E2E scope — unit default; Playwright on explicit e2e only |
| [testing/external-dependencies.md](./testing/external-dependencies.md) | Integration registry |
| [testing/readiness-report.md](./testing/readiness-report.md)           | Live probe results   |
| [testing/security-hardening.md](./testing/security-hardening.md)       | Security changelog   |

---

## Wiki export

Public GitHub wiki source — [wiki-export/README.md](./wiki-export/README.md)

---

## Cursor agent specs

Specialized agents live in `.cursor/agents/` (invoke by name in Cursor):

| Agent                     | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `local-dev-auth`          | Local-only test accounts; never production           |
| `account-nav`             | Header account dropdown and signed-in UX             |
| `production-admin`        | Promote admins, `SITE_LOCKED`, live `/admin`         |
| `media-uploads`           | Review/build file upload pipeline plan               |
| `saleor-redeem`           | Redeem section + Saleor voucher/promo codes          |
| `saleor-readiness`        | Audit mock vs live Saleor gaps before launch         |
| `polish-sweep`            | Find unfinished session work; execute polish plan    |
| `docs-updater`            | Refresh `docs/` (not root README)                    |
| `ui-consistency`          | Nav ribbons, pills, shared component patterns        |
| `git-commit-orchestrator` | Split large diffs into ordered commits               |
| `market-readiness`        | Live deploy audit; mock vs live gaps; launch roadmap |
| `saleor-readiness`        | Pre-launch Saleor integration scorecard              |
| `external-api-readiness`  | Probe Supabase, Saleor, Ghost, OAuth, YouTube        |
| `security-hardening`      | AuthZ, validation, cookies, service-role audit       |

---

## Branch workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md): feature branches from `dev` → merge to `dev` for staging → `dev` → `main` for production.

## Environment variables

Copy `.env.example` to `.env`. See [infrastructure/overview.md](./infrastructure/overview.md) for details.
