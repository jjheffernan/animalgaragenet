export const TRACEPARENT_HEADER = 'traceparent';

const TRACEPARENT_PATTERN = /^00-[a-f0-9]{32}-[a-f0-9]{16}-[a-f0-9]{2}$/;

/** Validate W3C traceparent; passthrough only — no span creation in-app yet. */
export function resolveTraceparent(incoming: string | null): string | null {
	if (!incoming) return null;
	return TRACEPARENT_PATTERN.test(incoming) ? incoming : null;
}

/** Headers to echo on the response for downstream trace correlation. */
export function passthroughTraceHeaders(request: Request): Record<string, string> {
	const headers: Record<string, string> = {};
	const traceparent = resolveTraceparent(request.headers.get(TRACEPARENT_HEADER));
	if (traceparent) headers[TRACEPARENT_HEADER] = traceparent;

	const tracestate = request.headers.get('tracestate');
	if (tracestate) headers.tracestate = tracestate;

	return headers;
}
