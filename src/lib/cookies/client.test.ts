import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	COOKIE_CONSENT,
	COOKIE_PROMO_BANNER_ID,
	COOKIE_PROMO_DISMISSED
} from '$lib/cookies';
import {
	deleteClientCookie,
	getClientCookie,
	getCookieConsent,
	getPromoBannerId,
	isPromoDismissed,
	setClientCookie,
	setCookieConsent,
	setPromoBannerId,
	setPromoDismissed
} from './client';

function createCookieJar() {
	const jar = new Map<string, string>();
	return {
		get cookie() {
			return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
		},
		set cookie(raw: string) {
			const [pair] = raw.split(';');
			const eq = pair.indexOf('=');
			const name = pair.slice(0, eq).trim();
			const value = pair.slice(eq + 1).trim();
			if (raw.includes('max-age=0') || value === '') {
				jar.delete(name);
				return;
			}
			jar.set(name, value);
		}
	};
}

describe('client cookie helpers', () => {
	beforeEach(() => {
		Object.defineProperty(globalThis, 'document', {
			value: createCookieJar(),
			configurable: true
		});
	});

	afterEach(() => {
		Reflect.deleteProperty(globalThis, 'document');
	});

	it('reads and writes preference cookies', () => {
		expect(getClientCookie('ag_test')).toBeUndefined();

		setClientCookie('ag_test', 'hello');
		expect(getClientCookie('ag_test')).toBe('hello');
	});

	it('deletes cookies by expiring them', () => {
		setClientCookie('ag_test', 'value');
		deleteClientCookie('ag_test');
		expect(getClientCookie('ag_test')).toBeUndefined();
	});

	it('tracks promo dismiss and banner id', () => {
		expect(isPromoDismissed()).toBe(false);
		expect(getPromoBannerId()).toBeUndefined();

		setPromoDismissed();
		setPromoBannerId('summer-sale');

		expect(isPromoDismissed()).toBe(true);
		expect(getPromoBannerId()).toBe('summer-sale');
		expect(document.cookie).toContain(COOKIE_PROMO_DISMISSED);
		expect(document.cookie).toContain(COOKIE_PROMO_BANNER_ID);
	});

	it('reads and writes cookie consent tri-state', () => {
		expect(getCookieConsent()).toBeUndefined();

		setCookieConsent(false);
		expect(getCookieConsent()).toBe(false);
		expect(document.cookie).toContain(`${COOKIE_CONSENT}=0`);

		setCookieConsent(true);
		expect(getCookieConsent()).toBe(true);
		expect(document.cookie).toContain(`${COOKIE_CONSENT}=1`);
	});

	it('no-ops when document is unavailable', () => {
		Reflect.deleteProperty(globalThis, 'document');

		expect(getClientCookie('ag_test')).toBeUndefined();
		expect(() => setClientCookie('ag_test', 'x')).not.toThrow();
		expect(() => deleteClientCookie('ag_test')).not.toThrow();
	});
});
