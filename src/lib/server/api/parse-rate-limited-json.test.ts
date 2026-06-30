import { afterEach, describe, expect, it } from 'vitest';
import { _resetRateLimitsForTests } from '$lib/server/rate-limit';
import { parseRateLimitedJsonPost } from './parse-rate-limited-json';

afterEach(() => {
	_resetRateLimitsForTests();
});

describe('parseRateLimitedJsonPost', () => {
	it('returns parsed body when under rate limit', async () => {
		const request = new Request('http://localhost/api/test', {
			method: 'POST',
			body: JSON.stringify({ email: 'a@b.co' })
		});
		const result = await parseRateLimitedJsonPost(request, () => '1.2.3.4', {
			key: 'test',
			limit: 5
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.body.email).toBe('a@b.co');
		}
	});

	it('returns 429 when rate limit exceeded', async () => {
		const getClientAddress = () => '9.9.9.9';
		for (let i = 0; i < 5; i++) {
			await parseRateLimitedJsonPost(
				new Request('http://localhost/api/test', {
					method: 'POST',
					body: JSON.stringify({})
				}),
				getClientAddress,
				{ key: 'blocked', limit: 5 }
			);
		}
		const blocked = await parseRateLimitedJsonPost(
			new Request('http://localhost/api/test', {
				method: 'POST',
				body: JSON.stringify({})
			}),
			getClientAddress,
			{ key: 'blocked', limit: 5 }
		);
		expect(blocked.ok).toBe(false);
		if (!blocked.ok) {
			expect(blocked.response.status).toBe(429);
		}
	});

	it('returns 400 for invalid JSON', async () => {
		const request = new Request('http://localhost/api/test', {
			method: 'POST',
			body: 'not-json'
		});
		const result = await parseRateLimitedJsonPost(request, () => '1.2.3.4', {
			key: 'bad-json',
			limit: 5
		});
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.response.status).toBe(400);
		}
	});
});
