import { isActionFailure, isRedirect } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions as signInActions } from '../../src/routes/auth/sign-in/+page.server';
import { actions as signUpActions } from '../../src/routes/auth/sign-up/+page.server';
import type { RequestEvent as SignInEvent } from '../../src/routes/auth/sign-in/$types';
import type { RequestEvent as SignUpEvent } from '../../src/routes/auth/sign-up/$types';

function signInRequest(fields: Record<string, string>, hostname = 'localhost'): SignInEvent {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request(`http://${hostname}/auth/sign-in`, { method: 'POST', body: formData });
	const cookies = {
		get: () => undefined,
		set: () => {},
		delete: () => {},
		getAll: () => [],
		serialize: () => ''
	};
	return { request, cookies, url: new URL(request.url) } as unknown as SignInEvent;
}

function signUpRequest(fields: Record<string, string>): SignUpEvent {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request('http://localhost/auth/sign-up', { method: 'POST', body: formData });
	const cookies = {
		get: () => undefined,
		set: () => {},
		delete: () => {},
		getAll: () => [],
		serialize: () => ''
	};
	return { request, cookies, url: new URL(request.url) } as unknown as SignUpEvent;
}

describe('auth sign-in action', () => {
	it('rejects invalid email addresses', async () => {
		const result = await signInActions.default(
			signInRequest({ email: 'not-an-email', name: 'Test' })
		);

		expect(isActionFailure(result)).toBe(true);
		if (isActionFailure(result)) {
			expect(result.status).toBe(400);
			expect(result.data).toMatchObject({ error: expect.stringMatching(/valid email/i) });
		}
	});

	it('redirects mock users when Supabase is not configured', async () => {
		await expect(
			signInActions.default(
				signInRequest({
					email: 'driver@example.com',
					name: 'Driver',
					redirect: '/account/builds'
				})
			)
		).rejects.toSatisfy((error: unknown) => isRedirect(error));
	});

	it('rejects sign-in on production hostname when Supabase is not configured', async () => {
		const result = await signInActions.default(
			signInRequest(
				{
					email: 'driver@example.com',
					name: 'Driver'
				},
				'animalgarage.netlify.app'
			)
		);

		expect(isActionFailure(result)).toBe(true);
		if (isActionFailure(result)) {
			expect(result.status).toBe(503);
			expect(result.data).toMatchObject({
				error: expect.stringMatching(/not configured/i)
			});
		}
	});
});

describe('auth sign-up action', () => {
	it('requires a name', async () => {
		const result = await signUpActions.default(
			signUpRequest({ email: 'driver@example.com', name: '' })
		);

		expect(isActionFailure(result)).toBe(true);
		if (isActionFailure(result)) {
			expect(result.data).toMatchObject({ error: expect.stringMatching(/name/i) });
		}
	});

	it('redirects mock users to account after sign-up', async () => {
		await expect(
			signUpActions.default(
				signUpRequest({ email: 'new@example.com', name: 'New Driver' })
			)
		).rejects.toSatisfy((error: unknown) => isRedirect(error));
	});
});
