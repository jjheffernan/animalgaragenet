import { MediaQuery } from 'svelte/reactivity';

/** Live `prefers-reduced-motion` preference (client). Defaults to false on SSR. */
export const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);

/** True when the user prefers reduced motion. Reactive when read in runes contexts. */
export function prefersReducedMotion(): boolean {
	return reducedMotion.current;
}
