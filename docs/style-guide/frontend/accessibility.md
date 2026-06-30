# Accessibility

## Expectations

Animal Garage targets WCAG 2.1 AA where practical. Phase 1 covers basics; audit before launch.

## Implemented

### Semantic HTML

- `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` used correctly
- Heading hierarchy: single H1 per page (Hero or page title)
- Lists use `<ul>`/`<li>` in footer nav

### ARIA

- Nav labels: `aria-label="Main"`, `aria-label="Mobile"`
- Mobile menu toggle: `aria-label="Toggle menu"`
- Decorative elements: `aria-hidden="true"` on hero overlays and scan line

### Screen reader utility

Custom `.sr-only` class in `layout.css` (visually hidden, available to assistive tech).

### Images

- Product thumbnails: `alt={product.thumbnail.alt}` from mock data
- Content images: descriptive alt text (e.g. "Animal Garage shop floor")

### Keyboard

- All links and buttons are native `<a>`/`<button>` elements — keyboard accessible by default
- Focus styles: rely on browser defaults + Tailwind hover states (enhance before launch)

### Lazy loading

Below-fold images use `loading="lazy"` to reduce initial load without blocking a11y tree.

## Gaps to address before production

| Gap                      | Priority | Action                                             |
| ------------------------ | -------- | -------------------------------------------------- |
| `prefers-reduced-motion` | High     | Disable AnimatedReveal transforms                  |
| Visible focus rings      | High     | Add `focus-visible:ring-*` on interactive elements |
| Skip-to-content link     | Medium   | Add hidden link in layout                          |
| Color contrast audit     | Medium   | Verify red-on-dark meets 4.5:1                     |
| Locale selector a11y     | Medium   | Ensure `<select>` or listbox pattern               |
| Error page semantics     | Low      | Add to `+error.svelte`                             |

## Checklist for new components

- [ ] Interactive elements are `<button>` or `<a>`, not `<div onclick>`
- [ ] Images have meaningful `alt` (or `alt=""` + `aria-hidden` if decorative)
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements
- [ ] Color is not the only indicator of state
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Page has one logical H1

## Testing

1. Tab through the page — all interactive elements reachable
2. VoiceOver (macOS) or NVDA (Windows) — nav landmarks announced
3. axe DevTools browser extension — zero critical issues
4. Lighthouse accessibility audit — target 90+

## Reference

Full motion a11y plan: [archive/animation-media.md](../../archive/animation-media.md#accessibility)
