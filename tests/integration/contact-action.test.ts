import { isActionFailure } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions } from '../../src/routes/contact/+page.server';
import type { RequestEvent } from '../../src/routes/contact/$types';

function contactRequest(fields: Record<string, string>): RequestEvent {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request('http://localhost/contact', { method: 'POST', body: formData });
	return { request } as RequestEvent;
}

describe('contact form action', () => {
	it('rejects missing required fields', async () => {
		const result = await actions.default(contactRequest({}));

		expect(isActionFailure(result)).toBe(true);
		if (isActionFailure(result)) {
			const data = result.data as unknown as { errors?: Record<string, string> };
			expect(result.status).toBe(400);
			expect(data.errors).toMatchObject({
				name: expect.any(String),
				email: expect.any(String),
				subject: expect.any(String),
				message: expect.any(String)
			});
		}
	});

	it('rejects invalid email and short messages', async () => {
		const result = await actions.default(
			contactRequest({
				name: 'Test User',
				email: 'not-an-email',
				subject: 'Help',
				message: 'short'
			})
		);

		expect(isActionFailure(result)).toBe(true);
		if (isActionFailure(result)) {
			const data = result.data as unknown as { errors?: Record<string, string> };
			expect(data.errors?.email).toBeTruthy();
			expect(data.errors?.message).toBeTruthy();
		}
	});

	it('accepts valid submissions', async () => {
		const result = await actions.default(
			contactRequest({
				name: 'Test User',
				email: 'test@example.com',
				subject: 'Order question',
				message: 'Where is my order? It has been a week.'
			})
		);

		expect(result).toMatchObject({
			success: true,
			message: expect.stringContaining('received')
		});
	});
});
