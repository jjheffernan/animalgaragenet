import { env } from '$env/dynamic/public';
import { isProductionHostname } from '$lib/server/auth/local-dev';

function normalizeOrigin(origin: string): string {
	return new URL(origin).origin;
}

function getConfiguredSiteOrigin(): string {
	const siteUrl =
		env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL ?? 'http://localhost:5173';
	return normalizeOrigin(siteUrl);
}

function isNetlifyHostname(hostname: string): boolean {
	return hostname === 'netlify.app' || hostname.endsWith('.netlify.app');
}

/** Trusted origins for auth redirect callbacks (request origin preferred when allowed). */
export function isAllowedAuthOrigin(origin: string): boolean {
	try {
		const normalized = normalizeOrigin(origin);
		const siteOrigin = getConfiguredSiteOrigin();
		if (normalized === siteOrigin) return true;

		const host = new URL(normalized).hostname;
		if (host === 'localhost' || host === '127.0.0.1') return true;
		if (isProductionHostname(host)) return true;
		if (isNetlifyHostname(host) && isNetlifyHostname(new URL(siteOrigin).hostname)) return true;

		return false;
	} catch {
		return false;
	}
}

/** Resolve callback origin from the incoming request, falling back to PUBLIC_SITE_URL. */
export function resolveAuthCallbackOrigin(requestOrigin: string): string {
	if (isAllowedAuthOrigin(requestOrigin)) {
		return normalizeOrigin(requestOrigin);
	}

	try {
		return getConfiguredSiteOrigin();
	} catch {
		return 'http://localhost:5173';
	}
}

export function buildAuthCallbackUrl(requestOrigin: string, redirectPath = '/account'): string {
	const callbackUrl = new URL('/auth/callback', resolveAuthCallbackOrigin(requestOrigin));
	callbackUrl.searchParams.set('redirect', redirectPath);
	return callbackUrl.toString();
}
