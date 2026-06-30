import { describe, expect, it } from 'vitest';
import { LIMITS, trimToMax } from './limits';

describe('LIMITS', () => {
	it('defines expected testimonial body max', () => {
		expect(LIMITS.testimonial.body).toBe(2000);
	});
});

describe('trimToMax', () => {
	it('trims and truncates', () => {
		expect(trimToMax('  hello world  ', 5)).toBe('hello');
	});
});
