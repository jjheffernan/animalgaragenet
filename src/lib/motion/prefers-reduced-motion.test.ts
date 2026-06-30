import { afterEach, describe, expect, it, vi } from 'vitest';
import { prefersReducedMotion } from './prefers-reduced-motion';

describe('prefersReducedMotion', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns false when matchMedia is unavailable', () => {
		expect(prefersReducedMotion()).toBe(false);
	});

	it('returns true when the user prefers reduced motion', () => {
		vi.stubGlobal('window', {
			matchMedia: (query: string) => ({
				matches: query === '(prefers-reduced-motion: reduce)',
				media: query,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			})
		});

		expect(prefersReducedMotion()).toBe(true);
	});

	it('returns false when motion is not reduced', () => {
		vi.stubGlobal('window', {
			matchMedia: () => ({
				matches: false,
				media: '',
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			})
		});

		expect(prefersReducedMotion()).toBe(false);
	});
});
