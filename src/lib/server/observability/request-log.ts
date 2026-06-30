export type RequestLogEntry = {
	level: 'info';
	msg: 'http_request';
	method: string;
	path: string;
	status: number;
	duration_ms: number;
	request_id: string;
	trace_id?: string;
};

/** Structured JSON line for Loki — pathname only, no query string or PII. */
export function logHttpRequest(entry: Omit<RequestLogEntry, 'level' | 'msg'>): void {
	const line: RequestLogEntry = { level: 'info', msg: 'http_request', ...entry };
	console.log(JSON.stringify(line));
}
