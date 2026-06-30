import {
	COOKIE_CONSENT,
	COOKIE_PROMO_BANNER_ID,
	COOKIE_PROMO_DISMISSED,
	PREF_COOKIE_MAX_AGE
} from '$lib/cookies';
import { parseCookieString, serializeCookie } from '$lib/cookies/format';

const DEFAULT_PATH = '/';

function readAllCookies(): string {
	if (typeof document === 'undefined') return '';
	return document.cookie;
}

/** Read a client-readable cookie value. */
export function getClientCookie(name: string): string | undefined {
	return parseCookieString(readAllCookies(), name);
}

/** Set a non-httpOnly preference cookie (browser only). */
export function setClientCookie(
	name: string,
	value: string,
	options: { maxAge?: number; path?: string } = {}
): void {
	if (typeof document === 'undefined') return;
	document.cookie = serializeCookie(name, value, {
		path: DEFAULT_PATH,
		maxAge: PREF_COOKIE_MAX_AGE,
		...options
	});
}

/** Remove a client-readable cookie. */
export function deleteClientCookie(name: string, path = DEFAULT_PATH): void {
	if (typeof document === 'undefined') return;
	document.cookie = serializeCookie(name, '', { path, maxAge: 0 });
}

// --- Preferences ---

export function isPromoDismissed(): boolean {
	return getClientCookie(COOKIE_PROMO_DISMISSED) === '1';
}

export function setPromoDismissed(): void {
	setClientCookie(COOKIE_PROMO_DISMISSED, '1');
}

export function getPromoBannerId(): string | undefined {
	return getClientCookie(COOKIE_PROMO_BANNER_ID);
}

export function setPromoBannerId(id: string): void {
	setClientCookie(COOKIE_PROMO_BANNER_ID, id);
}

// --- Consent ---

/** `undefined` = never answered; `true`/`false` = accepted / essential-only. */
export function getCookieConsent(): boolean | undefined {
	const raw = getClientCookie(COOKIE_CONSENT);
	if (raw === undefined) return undefined;
	return raw === '1';
}

export function setCookieConsent(accepted: boolean): void {
	setClientCookie(COOKIE_CONSENT, accepted ? '1' : '0');
}
