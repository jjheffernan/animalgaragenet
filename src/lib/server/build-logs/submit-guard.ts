import { checkRateLimit } from '$lib/server/rate-limit';

/** Honeypot field — bots fill hidden inputs; humans leave empty. */
export const BUILD_SUBMIT_HONEYPOT = '_hp';

export function isBuildSubmitHoneypotTripped(formData: FormData): boolean {
	return Boolean(String(formData.get(BUILD_SUBMIT_HONEYPOT) ?? '').trim());
}

/** Rate limit build submissions per client (IP or user id). */
export function checkBuildSubmitRateLimit(clientKey: string): boolean {
	return checkRateLimit(`build-submit:${clientKey}`, 10, 3_600_000).ok;
}
