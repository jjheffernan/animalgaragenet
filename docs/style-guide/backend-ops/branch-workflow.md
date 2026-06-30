# Branch Workflow

```
main          ← production releases
  ↑
dev           ← staging / integration
  ↑
feature/*     ← individual features
```

## Daily workflow

1. **Start feature:** branch from `dev`

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/my-feature
   ```

2. **Develop & commit** on feature branch

3. **Open PR → `dev`** for staging review and CI

4. **QA on staging** after merge to `dev`

5. **Release:** merge `dev` → `main` for production

## Rules

- Do not commit directly to `main` (except release merges from `dev`)
- Target `dev` for all feature PRs unless releasing
- Do not push secrets
- Run `npm run check && npm run lint && npm run build` before PR

## CI

GitHub Actions runs on push/PR to `dev` and `main`:

- `npm ci`
- `npm run lint`
- `npm run check`
- `npm run build`

See `.github/workflows/ci.yml`.

## Branch protection (recommended)

Configure on GitHub:

| Branch | Protection                                  |
| ------ | ------------------------------------------- |
| `main` | Require PR, require CI pass, no direct push |
| `dev`  | Require PR, require CI pass                 |

Details in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

## Agent skills for PR workflow

- `agents/babysit/` — keep PR merge-ready (CI, comments)
- `agents/split-to-prs/` — split large changes into reviewable PRs
