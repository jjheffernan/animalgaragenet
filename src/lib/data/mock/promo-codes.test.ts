import { describe, expect, it } from 'vitest';
import { findMockPromoCode, normalizePromoCode } from './promo-codes';

describe('mock promo codes', () => {
	it('normalizes codes to uppercase', () => {
		expect(normalizePromoCode(' garage10 ')).toBe('GARAGE10');
	});

	it('finds known mock codes', () => {
		const promo = findMockPromoCode('pitlane15');
		expect(promo?.percentOff).toBe(15);
	});

	it('returns null for unknown codes', () => {
		expect(findMockPromoCode('NOTREAL')).toBeNull();
	});
});
