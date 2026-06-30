# Animations

## Current implementation (Phase 1)

No animation libraries. All motion is CSS-based.

### AnimatedReveal

**File:** `src/lib/components/AnimatedReveal.svelte`

Wraps content with a fade + translate-up on mount:

```svelte
<AnimatedReveal delay={150}>
	<SectionHeading title="..." />
</AnimatedReveal>
```

- `delay` prop (ms) staggers sibling reveals
- Uses `$effect` + `$state` for visibility toggle
- Scoped CSS: opacity 0→1, translateY 1.25rem→0, 0.6s ease

**Usage:** Homepage sections in `src/routes/+page.svelte` — wrap headings, cards, and content blocks.

### Hero scan line

**File:** `src/lib/components/Hero.svelte`

CSS keyframe animation on `.hero-scan` — subtle pulsing gradient line at hero bottom.

### Hover transitions

Product and collection cards use Tailwind transitions:

```svelte
class="transition duration-500 group-hover:scale-105" <!-- image zoom -->
class="transition hover:border-red-600/50" <!-- card border -->
class="opacity-0 transition group-hover:opacity-100" <!-- overlay -->
```

### Global smooth scroll

```css
html {
	scroll-behavior: smooth;
}
```

In `src/routes/layout.css`.

## How to add a reveal

1. Import `AnimatedReveal` in your page/component.
2. Wrap the element(s) to animate.
3. Set `delay` for stagger (e.g. `150 * index` in `{#each}` loops).

```svelte
{#each items as item, i (item.id)}
	<AnimatedReveal delay={100 * i}>
		<ItemCard {item} />
	</AnimatedReveal>
{/each}
```

## How to add a new CSS animation

1. Add a scoped class in the component's `<style>` block.
2. Define `@keyframes` in the same block.
3. Mark decorative elements with `aria-hidden="true"`.

Prefer transform/opacity only (GPU-friendly). Avoid animating width, height, or layout properties.

## Phase 2 considerations

See [animation-media.md](../../animation-media.md) for planned enhancements:

- `@motionone/svelte` for scroll-triggered reveals
- Svelte transitions for route changes
- CSS `@view-transition` for page transitions

## Reduced motion

**Gap (planned):** Wrap animations in `@media (prefers-reduced-motion: reduce)` or skip `AnimatedReveal` delays. Not yet implemented — add when enhancing motion.

Guideline: when adding new animations, always respect `prefers-reduced-motion: reduce` by disabling transforms and reducing duration to 0.

## Do not

- Add GSAP, Framer Motion, or similar without justification
- Animate on every element — reserve motion for hero, section entry, and hover feedback
- Block interaction during entrance animations
