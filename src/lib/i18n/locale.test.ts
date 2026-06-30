import { describe, expect, it } from 'vitest';
import { getLocaleConfig, isSupportedLocale } from './locale';

describe('locale helpers', () => {
	it('narrows supported locale codes', () => {
		expect(isSupportedLocale('en-US')).toBe(true);
		expect(isSupportedLocale('en-GB')).toBe(true);
		expect(isSupportedLocale('xx-XX')).toBe(false);
		expect(isSupportedLocale('')).toBe(false);
	});

	it('returns config for known code and falls back to default', () => {
		const us = getLocaleConfig('en-US');
		expect(us.code).toBe('en-US');
		expect(us.currency).toBeTruthy();

		const fallback = getLocaleConfig('invalid' as 'en-US');
		expect(fallback.code).toBe('en-US');
	});
});
