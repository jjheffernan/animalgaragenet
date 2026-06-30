> **Status: Archived** — daisyUI removed; build verified. See [CODER-FLOW.md](../../CODER-FLOW.md).

# Zinc-only styling & dependency audit

**Date:** 2026-06-30  
**Branch:** `dev`  
**Ticket:** AUD-P2-021 (daisyUI skill tree removal)

## Summary

Animal Garage uses **Tailwind CSS v4** with a zinc/red design system only. No component UI libraries (daisyUI, Flowbite, Bootstrap, etc.) are installed.

## daisyUI

| Check | Result |
| ----- | ------ |
| `package.json` / `package-lock.json` | **Absent** — no `daisyui` entry |
| `src/` grep (`daisyui`, `data-theme`, `btn-primary`, `card-body`, `base-100`, `admin-shell`) | **0 hits** |
| `layout.css` | Plain `@import 'tailwindcss'` + `@theme` tokens (`--color-ag-red`, `--color-ag-black`) |
| `vite.config.ts` | `@tailwindcss/vite` only — no daisyUI plugin |
| `.agents/skills/daisyui/` | **Removed** (AUD-P2-021) |
| `agents/daisyui`, `.cursor/skills/daisyui` symlinks | **Removed** |
| `skills-lock.json` | Cleared daisyUI entry |
| Archive reference | `docs/archive/daisyui.md` (stale banner) |

## UI library overlap

| Library | Status |
| ------- | ------ |
| daisyUI | Not installed |
| flowbite / flowbite-svelte | Not installed (Flowbite cited as layout inspiration only) |
| Bootstrap / Headless UI / Radix / shadcn | Not installed |
| Chart libs (chart.js, recharts, d3) | Not installed |
| Date libs (date-fns, dayjs, moment, luxon) | Not installed |

## Dependency audit (`depcheck`)

No removable production or dev dependencies found. False positives:

- `tailwindcss` — used via `@tailwindcss/vite` and `layout.css`
- `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` — Prettier config plugins

**Duplicate deps removed:** none (no overlapping UI stacks present).

## Zinc/red consistency

- **Storefront:** `body` background `#09090b` (zinc-950), red accent via `--color-ag-red` / `bg-red-600`
- **Admin:** `bg-zinc-950` shell (`src/routes/admin/+layout.svelte`), shared tokens in `src/lib/components/admin/admin-ui.ts`
- **Build fix:** added missing `adminBtnSecondary` export used by `/admin/media`

## Build

`npm run build` — **pass** (after `adminBtnSecondary` fix).
