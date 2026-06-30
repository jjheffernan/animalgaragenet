import { describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { COOKIE_CONSENT } from '$lib/cookies';
import {
	deleteCookie,
	getCookie,
	hasAnalyticsConsent,
	hasCookieConsentAnswer,
	setCookie
} from '$lib/server/cookies';

function mockCookies() {
	const store = new Map<string, string>();
	return {
		get: (name: string) => store.get(name),
		set: (name: string, value: string) => {
			store.set(name, value);
		},
		delete: (name: string) => {
			store.delete(name);
		}
	} as unknown as Cookies;
}

describe('server cookie helpers', () => {
	it('sets, gets, and deletes cookies', () => {
		const cookies = mockCookies();

		expect(getCookie(cookies, COOKIE_CONSENT)).toBeUndefined();

		setCookie(cookies, COOKIE_CONSENT, '1', { httpOnly: true, maxAge: 3600 });
		expect(getCookie(cookies, COOKIE_CONSENT)).toBe('1');

		deleteCookie(cookies, COOKIE_CONSENT);
		expect(getCookie(cookies, COOKIE_CONSENT)).toBeUndefined();
	});

	it('detects consent answers and analytics preference', () => {
		const cookies = mockCookies();

		expect(hasCookieConsentAnswer(cookies)).toBe(false);
		expect(hasAnalyticsConsent(cookies)).toBe(false);

		setCookie(cookies, COOKIE_CONSENT, '0');
		expect(hasCookieConsentAnswer(cookies)).toBe(true);
		expect(hasAnalyticsConsent(cookies)).toBe(false);

		setCookie(cookies, COOKIE_CONSENT, '1');
		expect(hasAnalyticsConsent(cookies)).toBe(true);
	});
});
