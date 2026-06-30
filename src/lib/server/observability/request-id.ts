export const REQUEST_ID_HEADER = 'x-request-id';

const REQUEST_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

/** Accept a client-supplied id or generate one. No PII. */
export function resolveRequestId(incoming: string | null): string {
	if (incoming && REQUEST_ID_PATTERN.test(incoming)) {
		return incoming;
	}
	return crypto.randomUUID();
}
