# Security audit — July 2026

**Branch:** `dev`  
**Scope:** Admin CDN invalidation API, secret scanning, auth boundaries  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) — no hostnames, keys, or account identifiers in this doc.

Canonical remediation tracker: [plans/AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md) (`AUD-SEC-001`).

---

## Summary

| Severity | Finding | Status |
| -------- | ------- | ------ |
| **Medium** | CDN invalidation accepted arbitrary CloudFront paths (including `/*`) | **Remediated** |
| **Low** | Admin routes rely on session role gate only (no per-route CSRF token) | **Accepted** — SameSite cookies + staff-only surface |
| **Info** | CloudFront invalidation env gated; endpoint returns 503 when unset | **By design** |

---

## Medium — Arbitrary CDN invalidation paths

### Finding

`POST /api/admin/media/invalidate` accepted any string in `paths` or `objectKey` and forwarded them to CloudFront `CreateInvalidation`. A compromised staff session (or dev-admin bypass in local dev) could request a distribution-wide purge via `/*` or probe paths outside admin uploads.

**Affected code (pre-fix):**

- `src/routes/api/admin/media/invalidate/+server.ts`
- `src/lib/server/media/cdn.ts` (`invalidateCdnPaths`)

### Impact

- Unnecessary CloudFront invalidation cost and cache churn
- Potential denial-of-service on CDN edge cache for the media distribution
- No direct object-store write; invalidation is read-path cache busting only

### Remediation

1. **Allowlist** — Only keys matching upload-slot format `media/admin/{uuid}/{filename}` (equivalent CDN path prefix `/media/admin/`).
2. **Reject** — Empty values, `*`, and `..` segments.
3. **Cap** — At most 10 paths per request (`MAX_CDN_INVALIDATION_PATHS`).
4. **Prefer `objectKey`** — Primary client (`/admin/media` upload UI) sends `objectKey` from presigned upload slot; optional `paths` array for batch use.
5. **Defense in depth** — `invalidateCdnPaths` re-validates before calling AWS SDK.

**Tests:** `tests/integration/cdn-invalidate.test.ts`, `src/lib/server/media/cdn.test.ts`

---

## Low — CSRF on admin JSON APIs

Admin invalidate/upload routes use cookie session auth without a separate CSRF header. Mitigations in place: staff role gate, JSON `Content-Type`, browser SameSite defaults on session cookies. No change required for this audit cycle; revisit if admin forms expand to cross-site embed contexts.

---

## Verification

```bash
npm run test:unit
bash scripts/check-secrets.sh
```

Manual (when CDN env configured): upload via `/admin/media`, confirm invalidation succeeds for the returned `objectKey` only.

---

## References

- [cdn-media.md](../style-guide/backend-ops/cdn-media.md) — upload + invalidation flow
- [media-uploads.md](../plans/active/media-uploads.md) — Phase 1 Supabase vs Phase 2 S3/CDN
- BATCH-020 / IP-013 — CloudFront invalidation feature
