# Svelte 5 Patterns

This project uses **Svelte 5 runes mode** exclusively. Legacy Svelte 3/4 patterns are not used.

## Runes mode enforcement

Configured in `vite.config.ts`:

```typescript
sveltekit({
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	}
});
```

All project `.svelte` and `.svelte.ts` files compile with runes enabled.

## Patterns in use

### `$props()` — component inputs

Replaces `export let`:

```svelte
let {children} = $props(); // layout let {product}: Props = $props(); // typed props
```

### `$state()` — reactive local state

Replaces `let x = ...` for reactive values:

```svelte
let mobileOpen = $state(false); // Header.svelte let visible = $state(false); //
AnimatedReveal.svelte
```

Class-based shared state in `.svelte.ts` files:

```typescript
// src/lib/stores/locale.svelte.ts
class LocaleState {
	code = $state<LocaleCode>('en-US');
	// ...
}
export const locale = new LocaleState();
```

### `$derived()` — computed values

Use when a value depends on other reactive state. Not heavily used yet but preferred over `$:` reactive statements.

### `$effect()` — side effects

Replaces `onMount` + cleanup for simple cases:

```svelte
$effect(() => {
	const timer = setTimeout(() => { visible = true; }, delay);
	return () => clearTimeout(timer);
});
```

### Snippets — slot replacement

```svelte
interface Props {
	children: Snippet;
}
{@render children()}
```

Used in `AnimatedReveal.svelte` and `+layout.svelte`.

## Legacy patterns NOT used

| Legacy                   | Replacement                           |
| ------------------------ | ------------------------------------- |
| `export let prop`        | `$props()`                            |
| `$:` reactive statements | `$derived()` or `$effect()`           |
| `on:click`               | `onclick` (DOM events as props)       |
| `<slot>`                 | `{@render children()}` with `Snippet` |
| `writable()` stores      | `$state` in `.svelte.ts` classes      |
| `createEventDispatcher`  | callback props                        |

## Event handlers

Svelte 5 DOM events use lowercase props:

```svelte
<button onclick={() => (mobileOpen = !mobileOpen)}>
<a onclick={() => (mobileOpen = false)}>
```

## `$app/stores` — still valid

`page` from `$app/stores` is used in `Header.svelte` for active nav highlighting. This is the SvelteKit store API, not legacy Svelte reactivity.

## Server load functions

Unchanged SvelteKit API — not runes:

```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ params }) => {
	return { products: mockProducts };
};
```

## TypeScript

- Strict mode enabled
- Use `./$types` imports for load/action types: `import type { PageServerLoad } from './$types'`
- Component props via `interface Props`
