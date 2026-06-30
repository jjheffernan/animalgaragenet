# How to Change Styling

Three layers control appearance. Know which to edit.

## Layer 1: Global tokens & base styles

**File:** `src/routes/layout.css`

Edit when changing:

- Brand colors (`--color-ag-red`, `--color-ag-black`)
- Font stacks (`--font-display`, `--font-sans`)
- Body defaults (background, text color)
- Global utilities (`.sr-only`, `.font-display`)

Example — change brand red:

```css
@theme {
	--color-ag-red: #e11d48; /* was #dc2626 */
}
```

Also update Tailwind `red-*` usage in components if you want consistency, or use `text-[var(--color-ag-red)]`.

## Layer 2: Tailwind utilities in components

**Primary styling method.** Edit class strings directly in `.svelte` files.

Example — make product cards rounder (`ProductCard.svelte`):

```svelte
<!-- before -->
class="group block overflow-hidden rounded-sm border border-zinc-800 ..."

<!-- after -->
class="group block overflow-hidden rounded-lg border border-zinc-800 ..."
```

Example — change CTA button color (`Hero.svelte`):

```svelte
class="... bg-red-600 ... hover:bg-red-500 ..."
<!-- change to -->
class="... bg-orange-600 ... hover:bg-orange-500 ..."
```

Example — adjust section spacing (`+page.svelte`):

```svelte
<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
<!-- py-20 → py-32 for more vertical space -->
```

## Layer 3: Scoped component CSS

**Files with `<style>` blocks:**

| File                    | Contains                    |
| ----------------------- | --------------------------- |
| `AnimatedReveal.svelte` | Reveal transition keyframes |
| `Hero.svelte`           | Scan line animation         |

Edit these for animation timing, keyframes, or effects Tailwind can't express.

Example — faster reveal (`AnimatedReveal.svelte`):

```css
.reveal {
	transition:
		opacity 0.4s ease var(--reveal-delay, 0ms),
		/* was 0.6s */ transform 0.4s ease var(--reveal-delay, 0ms);
}
```

## Common styling tasks

### Change page background

`src/routes/+layout.svelte`:

```svelte
<div class="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
```

### Change max content width

Search for `max-w-7xl` and replace (e.g. `max-w-6xl` for narrower, `max-w-screen-xl` for wider).

### Change nav link active color

`src/lib/components/Header.svelte` — search for `text-red-500` in the nav active state.

### Change footer styling

`src/lib/components/Footer.svelte` — all footer styles are inline Tailwind.

## Workflow

1. Identify the component or page rendering the element
2. Prefer editing Tailwind classes over adding new CSS
3. If the change is brand-wide (color, font), start in `layout.css`
4. Run `npm run dev` and verify at mobile + desktop widths
5. Run `npm run lint` — Prettier may reorder Tailwind classes

## Do not

- Add a global CSS file per page — use Tailwind in the component
- Use inline `style=""` for static values — use Tailwind classes
- Override Tailwind with `!important` — adjust the class instead
