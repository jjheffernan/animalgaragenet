# E2E manual pass — 2026-06-30

Branch: `dev`  
Runner: Playwright (`npm run test:e2e`) against `vite preview` on port **4174** (playwright.config default)  
Local env: `.env` copied from `.env.example` with **mock/offline** flags (no real secrets in this doc)

## Environment flags used

| Variable                    | Value                   | Effect                                                                  |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | _(empty)_               | Mock `ag-session` cookie auth via `hooks.server.ts`                     |
| `PUBLIC_SUPABASE_ANON_KEY`  | _(empty)_               | Same                                                                    |
| `SUPABASE_SERVICE_ROLE_KEY` | _(empty)_               | Build logs + testimonials use in-memory mock stores                     |
| `PUBLIC_SALEOR_API_URL`     | _(empty)_               | Mock catalog + localStorage cart                                        |
| `DEV_ADMIN`                 | `true`                  | Admin routes bypass role check on localhost                             |
| `LOCAL_DEV_AUTH`            | `true`                  | Quick-login buttons on `/auth/sign-in` in preview (not only `vite dev`) |
| `PUBLIC_SITE_URL`           | `http://localhost:4174` | Matches Playwright preview origin                                       |

`npm run dev` on port **5173** behaves the same for mock auth (`import.meta.env.DEV` also enables quick-login without `LOCAL_DEV_AUTH`).

---

## Unit test baseline

| Command             | Result           | Notes                                                                                        |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `npm run test:unit` | **205/206 pass** | 1 failure: `callback-url.test.ts` when `.env` sets `PUBLIC_SITE_URL` — pollutes `vi.stubEnv` |

---

## Login flow (mock / local dev)

| Step | Route / control                                           | Result        | Notes                                                                                                                              |
| ---- | --------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `/` → header **Shop**                                     | **PASS**      | smoke e2e                                                                                                                          |
| 2    | `/auth/sign-in` — **Local dev quick login** panel visible | **PASS**      | Requires `LOCAL_DEV_AUTH=true` or `vite dev`                                                                                       |
| 3    | Click **Admin** quick-login → `/account`                  | **PASS**      | Sets `ag-session`; header shows Account menu                                                                                       |
| 4    | Click **Customer** quick-login → `/account`               | **PASS**      | Same mock cookie path                                                                                                              |
| 5    | **Send Magic Link** (email only, no Supabase)             | **FAIL (UI)** | `use:enhance` handler calls `update()` and swallows 303 redirect; user stays on sign-in. Server action works when posted directly. |
| 6    | **Continue with Google** (mock OAuth)                     | **PASS**      | Redirects to `/auth/callback?provider=google&mock=1` → `/account`                                                                  |
| 7    | `/account` without session                                | **PASS**      | Redirects to `/auth/sign-in?redirect=/account`                                                                                     |
| 8    | `/admin` with `DEV_ADMIN=true`                            | **PASS**      | Admin dashboard loads without Supabase role                                                                                        |
| 9    | Sign out → header **Sign In**                             | **PASS**      | `POST /auth/sign-out`                                                                                                              |

### Bugs found (auth)

| ID     | Severity             | Route / file                              | Description                                                                                                                                                               |
| ------ | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-1 | P0                   | `src/routes/auth/sign-in/+page.svelte`    | Magic-link form `use:enhance` must not `await update()` on `result.type === 'redirect'` — blocks mock and live redirect sign-in in the browser                            |
| AUTH-2 | P0 (fixed this pass) | `src/routes/auth/sign-in/+page.server.ts` | Mixed `default` + `devSignIn` named actions caused 500: _"When using named actions, the default action cannot be used"_ — renamed to `magicLink` + `action="?/magicLink"` |
| AUTH-3 | P1                   | `src/routes/auth/sign-in/+page.svelte`    | Newsletter footer email field shares accessible name with sign-in email — confuses automation and screen readers                                                          |

---

## CRUD flows (mock repositories)

Repositories fall back to in-memory `Map` stores when `SUPABASE_SERVICE_ROLE_KEY` is unset (`build-logs/repository.ts`, `testimonials/repository.ts`).

### Build logs (`/account/builds`)

| Op          | Steps                                                                     | Result   | Notes                                                 |
| ----------- | ------------------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| **C**       | Customer quick-login → `/account/builds/new` → fill form → **Save draft** | **PASS** | Redirects to `/account/builds/{id}`                   |
| **R**       | `/account/builds` list shows draft                                        | **PASS** | Status badge **Draft**                                |
| **U**       | **Edit** → change title → **Save draft**                                  | **PASS** | "Draft saved." message                                |
| **U**       | **Submit for review**                                                     | **PASS** | Status **Pending**; appears in admin queue            |
| **Approve** | Admin → `/admin/builds` → **Approve**                                     | **PASS** | Queue clears; slug generated                          |
| **D**       | User delete                                                               | **N/A**  | Not implemented — moderation uses approve/reject only |

### Testimonials / reviews (`/loyalty#reviews`)

| Op             | Steps                                                      | Result   | Notes                                       |
| -------------- | ---------------------------------------------------------- | -------- | ------------------------------------------- |
| **C**          | Customer sign-in → `/loyalty#reviews` → submit review form | **PASS** | Success copy references moderation queue    |
| **R**          | User submissions list on loyalty page                      | **PASS** | Shows **Pending** status                    |
| **Approve**    | Admin → `/admin/testimonials` → **Approve**                | **PASS** | Optional "Feature on homepage" checkbox     |
| **R** (public) | Reload `/loyalty#reviews`                                  | **PASS** | Approved card visible in Squad Stories      |
| **D**          | —                                                          | **N/A**  | Reject action exists; no user-facing delete |

### Admin users

| Op   | Result        | Notes                                                           |
| ---- | ------------- | --------------------------------------------------------------- |
| CRUD | **Not wired** | `/admin/users` uses `mock/admin-users.ts` — read-only prototype |

### Media upload (review photos)

| Op                     | Result              | Notes                                                                        |
| ---------------------- | ------------------- | ---------------------------------------------------------------------------- |
| Upload on loyalty form | **Not tested live** | Requires Supabase migration `20250630120000_media_assets.sql` + `ugc` bucket |

---

## Commerce smoke

| Step                                                     | Result   | Notes                                       |
| -------------------------------------------------------- | -------- | ------------------------------------------- |
| `/shop` category ribbon + product links                  | **PASS** | Mock catalog                                |
| `/parts` + **Parts shopping** nav                        | **PASS** | Updated from legacy "Part categories" label |
| Search modal                                             | **PASS** |                                             |
| Add to cart → cart drawer (`aria-label="Shopping cart"`) | **PASS** | Drawer is `<aside>`, not `role="dialog"`    |

---

## Production blockers

| ID   | Priority | Area     | Blocker                                                                                                                                | Fix type                |
| ---- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| PB-1 | **P0**   | Build    | `ReviewPhotoUpload.svelte` imported `$lib/server/media/constants` — **production build failed** until shared `$lib/media/constants.ts` | **Code (fixed)**        |
| PB-2 | **P0**   | Auth     | Magic-link UI redirect broken (`AUTH-1`)                                                                                               | **Code**                |
| PB-3 | **P0**   | Auth     | Netlify needs `PUBLIC_SUPABASE_*` + redirect URLs + matching `PUBLIC_SITE_URL` per `docs/plans/active/account-flow-fix.md`             | **Ops**                 |
| PB-4 | **P0**   | Commerce | `PUBLIC_SALEOR_API_URL` unset → mock catalog; prod guard throws if Saleor down                                                         | **Ops** + verify Saleor |
| PB-5 | **P1**   | DB       | Apply `build_submissions` + `testimonials` + `media_assets` migrations on Supabase                                                     | **Ops**                 |
| PB-6 | **P1**   | Media    | Review photo upload needs `ugc` bucket + service role                                                                                  | **Ops**                 |
| PB-7 | **P1**   | Checkout | `/cart/checkout` placeholder — no payment provider                                                                                     | **Code + ops**          |
| PB-8 | **P2**   | Content  | Ghost, YouTube, account orders still mock when env unset                                                                               | **Ops**                 |
| PB-9 | **P2**   | CI       | Some legacy e2e specs expect `role="dialog"` for cart/mobile nav — update selectors to match `SideDrawer` (`aside` + `aria-label`)     | **Code**                |

**Blocker count:** 4× P0 (1 fixed in code this pass), 3× P1, 2× P2

---

## Recommended fixes

### Code (this branch)

1. **Done:** Split `MAX_FILES_PER_TESTIMONIAL` into `$lib/media/constants.ts` — unblocks `npm run build`.
2. **Done:** Rename sign-in `default` action → `magicLink` to coexist with `devSignIn`.
3. **Done:** Add `e2e/auth-crud.spec.ts` + `e2e/helpers.ts` for auth + build log + testimonial moderation paths.
4. **Todo:** Fix magic-link `use:enhance` to follow redirects (skip `update()` when `result.type === 'redirect'`, or remove custom enhance).
5. **Todo:** Align remaining e2e cart/navigation specs with `getByLabel('Shopping cart')` pattern in `e2e/helpers.ts`.

### Ops (Netlify / Supabase)

1. Set Supabase public + service role keys; add preview/prod callback URLs.
2. Set `PUBLIC_SITE_URL` to the browsed host (preview vs production).
3. `supabase db push` for build submissions, testimonials, media assets.
4. Enable Saleor `PUBLIC_SALEOR_API_URL` when commerce should go live.
5. Run `scripts/promote-admin.ts` (or dashboard) for real admin roles — do not rely on `DEV_ADMIN` in production.

---

## Playwright summary (this pass)

| Suite                              | Tests | Pass    | Fail | Notes                                                                                                                        |
| ---------------------------------- | ----- | ------- | ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| `e2e/smoke.spec.ts`                | 5     | 5       | 0    | After selector fixes                                                                                                         |
| `e2e/auth-crud.spec.ts`            | 7     | 7*      | 0    | *When preview server starts cleanly; auth + CRUD serial paths verified in isolated runs                                      |
| Full `npm run test:e2e` (29 tests) | 29    | partial | —    | Port reuse / stale preview caused intermittent webServer timeouts; legacy cart/navigation specs need drawer selector updates |

**Overall mock-mode pass:** **Conditional PASS** — core browse, mock auth (quick-login + OAuth), build log CRUD, and testimonial moderation work offline; magic-link UI and production build were blockers found and partially fixed.

---

## Manual path (if Playwright unavailable)

1. `cp .env.example .env` — clear Supabase/Saleor placeholders; set `DEV_ADMIN=true`, `LOCAL_DEV_AUTH=true`.
2. `npm run dev` → http://localhost:5173
3. Home → Shop → add mock product to cart.
4. `/auth/sign-in` → **Admin** quick-login (not magic-link button until AUTH-1 fixed).
5. `/account/builds/new` → create draft → submit → `/admin/builds` → approve.
6. `/loyalty#reviews` → submit review → `/admin/testimonials` → approve.
