> **Status: Archived** — June 2026 audit; daisyUI tree removed (AUD-P2-021). See [archive/audits/zinc-only-deps-audit.md](./audits/zinc-only-deps-audit.md).

# Agents & skills audit — 2026-06-30

Audit of `.cursor/agents/`, `agents/`, `.cursor/skills/`, `skills-lock.json`, and the agent index in `docs/README.md` on branch `dev`.

## Inventory

### Agent specs (`.cursor/agents/*.md`) — 13 real files

| Path                                        | Type |
| ------------------------------------------- | ---- |
| `.cursor/agents/account-nav.md`             | real |
| `.cursor/agents/docs-updater.md`            | real |
| `.cursor/agents/external-api-readiness.md`  | real |
| `.cursor/agents/git-commit-orchestrator.md` | real |
| `.cursor/agents/local-dev-auth.md`          | real |
| `.cursor/agents/market-readiness.md`        | real |
| `.cursor/agents/media-uploads.md`           | real |
| `.cursor/agents/polish-sweep.md`            | real |
| `.cursor/agents/production-admin.md`        | real |
| `.cursor/agents/saleor-readiness.md`        | real |
| `.cursor/agents/saleor-redeem.md`           | real |
| `.cursor/agents/security-hardening.md`      | real |
| `.cursor/agents/ui-consistency.md`          | real |

### Agent context (`agents/`)

| Path                                                                                                                                                            | Type                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `agents/AGENTS.md`                                                                                                                                              | real                                                    |
| `agents/svelte-file-editor.md`                                                                                                                                  | symlink → Cursor Svelte plugin cache                    |
| `agents/ponytail/SKILL.md`                                                                                                                                      | real (project)                                          |
| `agents/caveman/SKILL.md`                                                                                                                                       | real (project)                                          |
| `agents/daisyui/**`                                                                                                                                             | symlink → `.agents/skills/daisyui/` (vendored upstream) |
| `agents/svelte-code-writer`                                                                                                                                     | symlink → Cursor Svelte plugin cache                    |
| `agents/svelte-core-bestpractices`                                                                                                                              | symlink → Cursor Svelte plugin cache                    |
| `agents/supabase`                                                                                                                                               | symlink → Cursor Supabase plugin cache                  |
| `agents/supabase-postgres-best-practices`                                                                                                                       | symlink → Cursor Supabase plugin cache                  |
| `agents/automate`, `babysit`, `canvas`, `create-*`, `loop`, `migrate-to-skills`, `onboard`, `review*`, `sdk`, `shell`, `split-to-prs`, `statusline`, `update-*` | symlinks → `~/.cursor/skills-cursor/*`                  |

### Skills (`.cursor/skills/`)

All 26 entries are symlinks → `agents/*` (which may further symlink to plugin cache or home dir).

### Vendored skills (`.agents/skills/`)

| Path                        | Type                                          |
| --------------------------- | --------------------------------------------- |
| `.agents/skills/daisyui/**` | real (87 files — upstream daisyUI skill tree) |

### Lock file

| Path               | Notes                                          |
| ------------------ | ---------------------------------------------- |
| `skills-lock.json` | Tracks daisyUI install from `saadeghi/daisyui` |

---

## Findings

| File                                           | Issue                                                                                                      | Action taken                                                        | Manual follow-up                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- |
| `docs/README.md`                               | Agent index missing `market-readiness`, `saleor-readiness`, `external-api-readiness`, `security-hardening` | Added 4 rows                                                        | —                                                              |
| `agents/AGENTS.md`                             | Same 4 agents missing from table                                                                           | Added 4 rows                                                        | —                                                              |
| `agents/AGENTS.md`                             | daisyUI described as optional install; conflicts with removed dependency                                   | Clarified reference-only; removed `npx skills add saadeghi/daisyui` | Consider removing daisyUI tree when lock no longer needed      |
| `.cursor/agents/market-readiness.md`           | Hardcoded `animalgarage.netlify.app` URL                                                                   | Replaced with `<preview-host>` placeholder per `SECURITY-PUBLIC.md` | —                                                              |
| `.cursor/agents/saleor-readiness.md`           | Hardcoded `commerce.animalgarage.net`                                                                      | Replaced with `<your-saleor-host>` / `PUBLIC_SALEOR_API_URL`        | —                                                              |
| `.cursor/agents/saleor-redeem.md`              | `CartDrawer` at flat `components/` path                                                                    | Fixed to `src/lib/components/cart/CartDrawer.svelte`                | —                                                              |
| `.cursor/agents/saleor-redeem.md`              | daisyUI `input` + `btn` style guidance                                                                     | Replaced with zinc/red Tailwind only                                | —                                                              |
| `.cursor/agents/ui-consistency.md`             | Bare component names; wrong subfolder                                                                      | Full paths under `catalog/` and `navigation/`                       | —                                                              |
| `.cursor/agents/ui-consistency.md`             | `MobileNavDrawer` without path                                                                             | Fixed to `layout/MobileNavDrawer.svelte`                            | —                                                              |
| `.cursor/agents/account-nav.md`                | `Header.svelte` at flat `components/` path                                                                 | Fixed to `layout/Header.svelte`                                     | —                                                              |
| `.cursor/agents/account-nav.md`                | Bare `AccountMenu.svelte`                                                                                  | Fixed to `navigation/AccountMenu.svelte`                            | —                                                              |
| `.cursor/agents/polish-sweep.md`               | Bare `AccountMenu.svelte` in straggler table                                                               | Fixed path                                                          | Remove stale "221 files failing lint" when re-running sweep    |
| `docs/style-guide/frontend/catalog-ribbons.md` | Flat `CategoryPill` / `CatalogRibbonShell` paths                                                           | Fixed to `catalog/` subfolder                                       | —                                                              |
| `.agents/skills/daisyui/SKILL.md`              | "Mandatory UI library" + auto-trigger; daisyUI not in app                                                  | Deprecation banner + updated frontmatter description                | Keep tree for upstream reference or delete after team sign-off |
| `skills-lock.json`                             | `skillPath` pointed at non-existent `skills/daisyui/`                                                      | Fixed to `.agents/skills/daisyui/SKILL.md`                          | Re-run `npx skills` refresh if upgrading daisyUI skill         |
| `agents/daisyui` → `.agents/skills/daisyui`    | Orphan trigger risk for removed UI stack                                                                   | Deprecation in root `SKILL.md` only                                 | Do not delete tree without audit note                          |
| `agents/*` → `~/.cursor/skills-cursor/*`       | 17 symlinks are machine-local; break on fresh clone                                                        | None (by design)                                                    | Document in onboarding or vendor Cursor skills into repo       |
| `agents/supabase`, `svelte-*` → plugin cache   | Same portability issue                                                                                     | None                                                                | Rely on Cursor plugins (`plugins.*.enabled`)                   |
| `.cursor/agents/*` (doc paths)                 | Grep for flat `docs/saleor.md`, `docs/supabase.md`, `PUBLIC-SAFE.md`                                       | **No hits** — paths already migrated                                | —                                                              |
| `polish-sweep.md`                              | Session-specific Prettier failure count                                                                    | Updated — Prettier resolved (`63eb20a`)                             | —                                                              |

---

## Summary

| Metric                 | Count  |
| ---------------------- | ------ |
| Issues found           | **19** |
| Fixes applied          | **15** |
| Manual follow-up items | **4**  |

### Manual follow-up (not auto-fixed)

1. **Machine-local skill symlinks** — `agents/automate`, `babysit`, etc. point at `~/.cursor/skills-cursor/`. New contributors need Cursor defaults or re-link.
2. **daisyUI skill tree** — Retained under `.agents/skills/daisyui/` with deprecation banner; safe to remove after confirming no agent should reference it.
3. **polish-sweep stale metrics** — "221 files failing lint" is session-specific; update when sweep runs again.
4. **Plugin-cache symlinks** — Supabase/Svelte skills depend on enabled Cursor plugins; verify `.cursor/settings.json` on new machines.

---

## Verification commands

```bash
# Dead doc paths in agents
rg 'docs/saleor\.md|docs/supabase\.md|PUBLIC-SAFE\.md' .cursor/agents agents/AGENTS.md

# Infra hostnames in agents
rg 'animalgarage\.netlify|commerce\.animalgarage' .cursor/agents

# daisyUI in package
rg daisyui package.json src/
```
