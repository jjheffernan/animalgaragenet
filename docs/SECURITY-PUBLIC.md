# Public documentation policy

This repository is **public**. All files under `docs/` must be safe to read without exposing infrastructure you would not put on a marketing site.

## Do not publish in `docs/`

| Category             | Examples (use placeholders instead)                                   |
| -------------------- | --------------------------------------------------------------------- |
| Production hostnames | Specific Saleor, CDN, Ghost, or Netlify preview URLs (not public brand `animalgarage.net`) |
| Internal hostnames   | `*.internal`, private cluster DNS, literal bucket names in archive docs                   |
| Cloud resources      | Bucket names, regions, cluster names, IAM key variable names in prose |
| Org topology         | Organization repo names, deploy-key secret names, key fingerprints    |
| Live probes          | URLs pasted from production audits                                    |
| Credential shapes    | JWT prefixes, example secret values                                   |

## Where full detail lives

| Audience                  | Location                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| Contributors (clone repo) | `.env.example` — variable **names** only, no real values            |
| Maintainers               | Private runbook / password manager / host dashboards (not in git)   |
| Public wiki               | `docs/wiki-export/` — already sanitized; sync from repo after edits |

## Doc categories

| Area            | Public-safe approach                                              |
| --------------- | ----------------------------------------------------------------- |
| `style-guide/`  | Patterns and code paths; env as categories not infra map          |
| `plans/active/` | Checklists with `<your-host>` placeholders                        |
| `archive/`      | Historical; may reference retired approaches (redact infra names) |
| `testing/`      | Probe IDs and skip reasons; no live URLs in reports               |

## Placeholder conventions

| Instead of               | Use                                  |
| ------------------------ | ------------------------------------ |
| Specific Saleor host     | `<your-saleor-host>`                 |
| CDN custom domain        | `<your-cdn-host>`                    |
| Netlify preview URL      | `https://<preview-host>.netlify.app` |
| Storefront custom domain | `https://<your-site-host>`           |
| S3 bucket name           | `<your-media-bucket>`                |
| Org deploy repo          | `<organization>/<deploy-repo>`       |
| Personal fork            | `<your-github-user>/<repo-name>`     |
| Org mirror Actions secret | `<org-sync-secret>`                 |
| Internal S3 endpoint     | `http://localhost:3900` or `https://<s3-endpoint-host>` |

## Pre-PR grep (docs/)

Run from repo root before merging doc changes:

```bash
rg -i 'jjheffernan|heff-industries|ORG_REPO_DEPLOY_KEY|commerce\.animalgarage|cdn\.animalgarage|content\.animalgarage|animalgarage\.netlify|garage\.internal|ag-media|sk_live|sk_test|eyJ[A-Za-z0-9_-]+\.' docs/
```

Expect **no hits** except:

- Historical audit rows in `meta/agents-skills-audit.md` (documenting past fixes)
- Changelog rows in `testing/security-hardening.md` that name redacted patterns
- This policy file's grep command block
- This repo's public GitHub / wiki URLs (`github.com/.../animalgaragenet`)
- Public brand domain `animalgarage.net` in index copy (marketing site, not infra map)

## When editing docs

1. Prefer `your Saleor host`, `your CDN base URL`, `organization deploy repo`.
2. Link to `.env.example` instead of duplicating secret variable lists.
3. Before PR, grep `docs/` for sensitive patterns (bucket names, org repo slugs, commerce/CDN subdomains, preview URLs).
4. Update `docs/wiki-export/` if the change affects wiki pages.

## Exceptions

- `admin@local.dev` and similar **local-only** fake accounts are OK.
- `PUBLIC_*` variable names are OK (they are designed for the browser).
- This repo's public GitHub clone URL is OK.
