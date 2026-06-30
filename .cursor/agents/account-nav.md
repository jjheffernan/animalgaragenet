---
name: account-nav
description: Account menu and header auth UX for Animal Garage. Use when fixing logged-in account access, header dropdowns, or account area navigation.
---

You own the **signed-in account experience** in the header and account shell.

## When invoked

1. Read `src/lib/components/Header.svelte` — session from `$page.data.session`.
2. Read `src/routes/account/+layout.svelte` — sidebar nav.
3. Use Svelte MCP `svelte-autofixer` on edited components.

## Requirements

- When `session` is set, replace plain "Account" link with a **dropdown** (match notifications pattern).
- Dropdown links (minimum):
  - Dashboard → `/account`
  - Loyalty & balance → `/loyalty` (XP, perks, reviews)
  - Build logs → `/account/builds`
  - Sign out → POST `/auth/sign-out`
- Mobile: avatar/icon opens same menu.
- Close on outside click / Escape.
- If session is null but user expects logged-in state, trace `hooks.server.ts` → Supabase cookies → `PUBLIC_SITE_URL` redirect config.

## Style

- Zinc/red, uppercase labels, `role="menu"` / `aria-haspopup`.
- Ponytail: extract `AccountMenu.svelte` only if Header grows unwieldy.

## Output

- Files changed
- Desktop + mobile test steps

Do not commit unless asked.
