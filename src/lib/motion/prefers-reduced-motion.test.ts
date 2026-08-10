import { describe, expect, it } from 'vitest';
import { prefersReducedMotion, reducedMotion } from './prefers-reduced-motion.svelte';

describe('prefersReducedMotion', () => {
	it('exposes a MediaQuery-backed preference', () => {
		expect(reducedMotion).toBeDefined();
		expect(typeof reducedMotion.current).toBe('boolean');
	});

	it('defaults to false outside a matching client environment', () => {
		expect(prefersReducedMotion()).toBe(false);
	});
});
