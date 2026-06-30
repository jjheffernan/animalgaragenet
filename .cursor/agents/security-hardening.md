---
name: security-hardening
description: Audit and harden naive security patterns in Animal Garage — authZ, input validation, cookies, service role usage, XSS. Read Supabase skill security checklist.
---

## Scope

- `src/hooks.server.ts`, auth routes, repositories using `createAdminClient()`
- Never use `user_metadata` for roles; validate `userId` from session matches writes
- String length limits on all DB inserts; sanitize HTML via `sanitizeRichHtml`
- Cookies: httpOnly for sensitive; `LOCAL_DEV_AUTH` / `DEV_ADMIN` production guards
- Rate-limit or document deferred abuse vectors (promo apply, OTP)
- `scripts/check-secrets.sh` alignment

## Read first

- `.cursor/skills/supabase/SKILL.md` security checklist
- `docs/testing/external-dependencies.md`

## Output

- List vulnerabilities fixed
- `docs/testing/security-hardening.md` changelog
- Tests for new validation helpers

Do not commit unless asked.
