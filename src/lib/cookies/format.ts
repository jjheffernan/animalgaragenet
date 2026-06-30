/** Serialize a single Set-Cookie / document.cookie fragment (no encoding of name). */
export function serializeCookie(
	name: string,
	value: string,
	options: { maxAge?: number; path?: string } = {}
): string {
	const parts = [`${name}=${encodeURIComponent(value)}`];
	const path = options.path ?? '/';
	parts.push(`path=${path}`);
	if (options.maxAge !== undefined) {
		parts.push(`max-age=${options.maxAge}`);
	}
	parts.push('samesite=lax');
	return parts.join('; ');
}

/** Parse a cookie value from a `document.cookie` string or raw Cookie header. */
export function parseCookieString(cookieHeader: string, name: string): string | undefined {
	if (!cookieHeader) return undefined;
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
	if (!match) return undefined;
	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
}
