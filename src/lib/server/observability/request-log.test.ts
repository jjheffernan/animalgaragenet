import { afterEach, describe, expect, it, vi } from 'vitest';
import { logHttpRequest } from './request-log';

describe('logHttpRequest', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('emits JSON with required fields and no PII keys', () => {
		const log = vi.spyOn(console, 'log').mockImplementation(() => {});

		logHttpRequest({
			method: 'GET',
			path: '/shop',
			status: 200,
			duration_ms: 42,
			request_id: 'req-abc'
		});

		expect(log).toHaveBeenCalledOnce();
		const parsed = JSON.parse(String(log.mock.calls[0]?.[0])) as Record<string, unknown>;

		expect(parsed).toEqual({
			level: 'info',
			msg: 'http_request',
			method: 'GET',
			path: '/shop',
			status: 200,
			duration_ms: 42,
			request_id: 'req-abc'
		});
		expect(parsed).not.toHaveProperty('user');
		expect(parsed).not.toHaveProperty('email');
		expect(parsed).not.toHaveProperty('cookie');
	});

	it('includes trace_id when provided', () => {
		const log = vi.spyOn(console, 'log').mockImplementation(() => {});

		logHttpRequest({
			method: 'GET',
			path: '/shop',
			status: 200,
			duration_ms: 1,
			request_id: 'req-abc',
			trace_id: 'a'.repeat(32)
		});

		const parsed = JSON.parse(String(log.mock.calls[0]?.[0])) as Record<string, unknown>;
		expect(parsed.trace_id).toBe('a'.repeat(32));
	});
});
