import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { _resetMockStoreForTests as resetRestock } from '$lib/server/restock/repository';
import { _resetMockStoreForTests as resetNewsletter } from '$lib/server/newsletter/repository';
import { POST as restockPost } from '../../src/routes/api/restock/notify/+server';
import { POST as newsletterPost } from '../../src/routes/api/newsletter/subscribe/+server';

function apiEvent(
	path: string,
	body: Record<string, unknown>,
	locals: App.Locals = { session: null } as App.Locals
) {
	const request = new Request(`http://localhost${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
	return {
		request,
		locals,
		getClientAddress: () => '127.0.0.1'
	};
}

describe('restock and newsletter API routes', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		resetRestock();
		resetNewsletter();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('POST /api/restock/notify accepts valid signup', async () => {
		const response = await restockPost(
			apiEvent('/api/restock/notify', {
				email: 'driver@example.com',
				productId: 'prod-1',
				productName: 'Hoodie',
				productSlug: 'hoodie'
			}) as Parameters<typeof restockPost>[0]
		);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({ ok: true, id: expect.any(String) });
	});

	it('POST /api/restock/notify rejects invalid email', async () => {
		const response = await restockPost(
			apiEvent('/api/restock/notify', { email: 'bad', productId: 'prod-1' }) as Parameters<
				typeof restockPost
			>[0]
		);
		expect(response.status).toBe(400);
	});

	it('POST /api/newsletter/subscribe accepts footer signup', async () => {
		const response = await newsletterPost(
			apiEvent('/api/newsletter/subscribe', {
				email: 'fan@example.com',
				source: 'footer'
			}) as Parameters<typeof newsletterPost>[0]
		);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
	});

	it('POST /api/newsletter/subscribe rejects invalid email', async () => {
		const response = await newsletterPost(
			apiEvent('/api/newsletter/subscribe', { email: 'not-an-email' }) as Parameters<
				typeof newsletterPost
			>[0]
		);
		expect(response.status).toBe(400);
	});
});
