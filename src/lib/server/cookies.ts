import type { Cookies } from '@sveltejs/kit';
import { COOKIE_CONSENT } from '$lib/cookies';

type CookieOptions = NonNullable<Parameters<Cookies['set']>[2]>;

const DEFAULT_OPTIONS = {
	path: '/',
	sameSite: 'lax'
} as const satisfies Pick<CookieOptions, 'path' | 'sameSite'>;

/** Read a cookie from the SvelteKit request. */
export function getCookie(cookies: Cookies, name: string): string | undefined {
	return cookies.get(name);
}

/** Set a cookie with Animal Garage defaults (`path: /`, `sameSite: lax`). */
export function setCookie(
	cookies: Cookies,
	name: string,
	value: string,
	options: Partial<CookieOptions> = {}
): void {
	cookies.set(name, value, {
		...DEFAULT_OPTIONS,
		...options
	});
}

/** Delete a cookie (defaults to `path: /`). */
export function deleteCookie(
	cookies: Cookies,
	name: string,
	options: Pick<CookieOptions, 'path'> = { path: '/' }
): void {
	cookies.delete(name, options);
}

/** Whether the user has answered the cookie consent prompt. */
export function hasCookieConsentAnswer(cookies: Cookies): boolean {
	return cookies.get(COOKIE_CONSENT) !== undefined;
}

/** Whether optional (analytics) cookies are allowed. */
export function hasAnalyticsConsent(cookies: Cookies): boolean {
	return cookies.get(COOKIE_CONSENT) === '1';
}
