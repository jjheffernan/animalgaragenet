import { isActionFailure } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions } from '../../src/routes/account/builds/new/+page.server';
import type { RequestEvent } from '../../src/routes/account/builds/new/$types';

function buildRequest(
	fields: Record<string, string>,
	intent: 'saveDraft' | 'submit' = 'submit'
): RequestEvent {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request(`http://localhost/account/builds/new?/${intent}`, {
		method: 'POST',
		body: formData
	});
	return {
		request,
		locals: {
			session: {
				id: 'mock-user-1',
				email: 'builder@example.com',
				name: 'Builder',
				role: 'customer'
			},
			devAdmin: false
		}
	} as RequestEvent;
}

const validPayload = {
	title: 'Track Civic',
	year: '2018',
	make: 'Honda',
	model: 'Civic',
	description: 'Full track build with coilovers, wheels, and aero upgrades.',
	modList: 'BC coilovers, Enkei RPF1, APR lip'
};

describe('account/builds/new actions', () => {
	it('rejects incomplete submit', async () => {
		const result = await actions.submit(buildRequest({ title: 'x' }, 'submit'));
		expect(isActionFailure(result)).toBe(true);
	});

	it('accepts valid submit for review', async () => {
		const result = await actions.submit(buildRequest(validPayload, 'submit'));
		expect(result).toMatchObject({
			success: true,
			message: expect.stringMatching(/review/i)
		});
	});
});
