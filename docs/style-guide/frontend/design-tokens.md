# Design Tokens

Design tokens live in Tailwind v4's `@theme` block and are consumed as utility classes throughout the app.

## Source file

**Primary:** `src/routes/layout.css`

```css
@theme {
	--font-display: 'Arial Black', 'Helvetica Neue', Helvetica, sans-serif;
	--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	--color-ag-red: #dc2626;
	--color-ag-black: #09090b;
}
```

Global body styles set the dark base:

```css
body {
	font-family: var(--font-sans);
	background-color: var(--color-ag-black);
	color: #fafafa;
}
```

## Colors

| Token / class                   | Value            | Usage                                       |
| ------------------------------- | ---------------- | ------------------------------------------- |
| `--color-ag-red` / `ag-red`     | `#dc2626`        | Brand accent (Tailwind `red-600` also used) |
| `--color-ag-black` / `ag-black` | `#09090b`        | Page background base                        |
| `zinc-950`                      | Tailwind default | Layout backgrounds (`bg-zinc-950`)          |
| `zinc-900`                      | Tailwind default | Cards, elevated surfaces                    |
| `zinc-800`                      | Tailwind default | Borders (`border-zinc-800`)                 |
| `zinc-400`–`zinc-600`           | Tailwind default | Muted text                                  |
| `red-500` / `red-600`           | Tailwind default | Links, CTAs, active nav                     |

**Convention:** Use Tailwind zinc scale for surfaces and text; use red for interactive accents. Custom `--color-ag-*` tokens are available when you need exact brand values outside Tailwind's palette.

## Typography

| Class / token                                  | Font              | Usage                                |
| ---------------------------------------------- | ----------------- | ------------------------------------ |
| `.font-display`                                | Arial Black stack | Headlines, logo text, section titles |
| `--font-sans` (body default)                   | System UI stack   | Body copy, nav, prices               |
| `uppercase tracking-widest`                    | —                 | Nav links, labels, CTAs              |
| `text-xs font-bold uppercase tracking-[0.3em]` | —                 | Eyebrow labels (Hero)                |

**Heading scale examples:**

- Hero H1: `text-5xl sm:text-7xl font-black uppercase`
- Section titles: via `SectionHeading` component
- Product names: `font-medium text-white`

## Spacing & layout

Common patterns (not custom tokens — standard Tailwind):

| Pattern         | Classes                                  | Where                           |
| --------------- | ---------------------------------------- | ------------------------------- |
| Page container  | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` | All page sections               |
| Section padding | `py-20`                                  | Homepage sections               |
| Card padding    | `p-4`                                    | ProductCard                     |
| Header offset   | `pt-[var(--site-header-height)]` on `<main>` | `+layout.svelte` (fixed header; set in `Header.svelte`) |
| Grid gaps       | `gap-6`, `gap-8`, `gap-12`               | Product/collection grids        |

## Adding a new token

1. Add the CSS custom property in `@theme` in `layout.css`.
2. Use it via Tailwind arbitrary value (`bg-[var(--color-ag-red)]`) or add a utility class.
3. Prefer existing Tailwind utilities before adding custom tokens.

## Reference aesthetic

See [animation-media.md](../../animation-media.md) for the full visual direction: near-black backgrounds, industrial uppercase type, red accents, raw garage energy.
