import { describe, expect, it } from 'vitest';
import { COOKIE_CONSENT, COOKIE_PROMO_DISMISSED } from '$lib/cookies';
import { parseCookieString, serializeCookie } from '$lib/cookies/format';

describe('serializeCookie', () => {
	it('encodes value and applies defaults', () => {
		const raw = serializeCookie(COOKIE_PROMO_DISMISSED, '1', { maxAge: 86400 });
		expect(raw).toBe('ag_promo_dismissed=1; path=/; max-age=86400; samesite=lax');
	});

	it('encodes special characters in values', () => {
		const raw = serializeCookie('ag_test', 'a b=c');
		expect(raw).toBe('ag_test=a%20b%3Dc; path=/; samesite=lax');
	});
});

describe('parseCookieString', () => {
	it('reads a value from a cookie header', () => {
		const header = 'ag_promo_dismissed=1; ag_cookie_consent=0; other=xyz';
		expect(parseCookieString(header, COOKIE_PROMO_DISMISSED)).toBe('1');
		expect(parseCookieString(header, COOKIE_CONSENT)).toBe('0');
	});

	it('returns undefined when cookie is missing', () => {
		expect(parseCookieString('foo=bar', COOKIE_PROMO_DISMISSED)).toBeUndefined();
	});

	it('decodes encoded values', () => {
		expect(parseCookieString('ag_test=a%20b%3Dc', 'ag_test')).toBe('a b=c');
	});
});

describe('round-trip', () => {
	it('serialize then parse returns the original value', () => {
		const value = 'banner-summer-sale';
		const serialized = serializeCookie('ag_promo_banner_id', value, { maxAge: 30 });
		const pair = serialized.split(';')[0];
		expect(parseCookieString(pair, 'ag_promo_banner_id')).toBe(value);
	});
});
