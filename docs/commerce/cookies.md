# Cookies

Animal Garage uses namespaced cookies (`ag_*`). Auth and checkout cookies are essential; preference and consent cookies are client-readable.

| Name                  | Category    | Set by       | httpOnly | Purpose                                               |
| --------------------- | ----------- | ------------ | -------- | ----------------------------------------------------- |
| `ag_cookie_consent`   | Consent     | Client       | No       | `1` = optional cookies accepted, `0` = essential only |
| `ag_promo_dismissed`  | Preferences | Client       | No       | Promo bar dismissed (`1`)                             |
| `ag_promo_banner_id`  | Preferences | Client       | No       | Stable banner id for rotation                         |
| `ag-checkout-id`      | Essential   | Server       | Yes      | Saleor checkout session                               |
| `ag-session`          | Essential   | Server       | Yes      | Legacy mock auth when Supabase is unset               |
| Supabase auth cookies | Essential   | Server (SSR) | Yes      | Session tokens via `@supabase/ssr`                    |

Utilities: `src/lib/cookies.ts` (names), `src/lib/cookies/client.ts` (browser prefs), `src/lib/server/cookies.ts` (server loads/actions).
