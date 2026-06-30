import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, PUT } from '../../src/routes/api/account/connections/+server';
import type { RequestEvent } from '../../src/routes/api/account/connections/$types';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

vi.mock('$lib/auth/social-oauth', () => ({
	isSocialOAuthConfigured: vi.fn(() => false),
	socialOAuthAuthorizeUrl: vi.fn(() => null)
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { _resetMockStoreForTests } from '$lib/server/social-connections/repository';

const session = { id: 'user-connections-test', email: 'u@test.com', name: 'Test', role: 'user' };

function connectionsEvent(
	method: 'GET' | 'PUT',
	body?: unknown
): RequestEvent {
	const init: RequestInit = { method };
	if (body !== undefined) {
		init.headers = { 'Content-Type': 'application/json' };
		init.body = JSON.stringify(body);
	}
	const request = new Request('http://localhost/api/account/connections', init);
	return {
		request,
		locals: { session }
	} as unknown as RequestEvent;
}

describe('/api/account/connections', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	it('GET returns 401 without session', async () => {
		const response = await GET({
			locals: { session: null }
		} as unknown as RequestEvent);
		expect(response.status).toBe(401);
	});

	it('GET returns platforms and empty connections', async () => {
		const response = await GET(connectionsEvent('GET'));
		const payload = await response.json();
		expect(response.status).toBe(200);
		expect(payload.mockMode).toBe(true);
		expect(payload.platforms).toHaveLength(4);
		expect(payload.connections).toEqual({});
	});

	it('PUT returns 400 for invalid platform', async () => {
		const response = await PUT(
			connectionsEvent('PUT', { platform: 'twitter', action: 'connect', handle: 'ag' })
		);
		expect(response.status).toBe(400);
	});

	it('PUT connects and persists in mock mode', async () => {
		const putRes = await PUT(
			connectionsEvent('PUT', {
				platform: 'instagram',
				action: 'connect',
				handle: '@animalgarage'
			})
		);
		expect(putRes.status).toBe(200);
		const putPayload = await putRes.json();
		expect(putPayload.connections.instagram.handle).toBe('animalgarage');
		expect(putPayload.connections.instagram.mock).toBe(true);

		const getRes = await GET(connectionsEvent('GET'));
		const getPayload = await getRes.json();
		expect(getPayload.connections.instagram.handle).toBe('animalgarage');
	});

	it('PUT disconnect removes platform', async () => {
		await PUT(
			connectionsEvent('PUT', {
				platform: 'discord',
				action: 'connect',
				handle: 'animalgarage'
			})
		);
		const disconnect = await PUT(
			connectionsEvent('PUT', { platform: 'discord', action: 'disconnect' })
		);
		expect(disconnect.status).toBe(200);
		const payload = await disconnect.json();
		expect(payload.connections.discord).toBeUndefined();
	});
});
