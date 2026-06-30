import { describe, expect, it } from 'vitest';
import { adminGateJsonResponse, resolveAdminGate, resolveAdminGateFromLocals } from './admin-gate';

describe('resolveAdminGate (staff panel)', () => {
	it('allows dev admin bypass without session', () => {
		expect(resolveAdminGate({ hasSession: false, role: null, devAdmin: true })).toBe('allow');
	});

	it('allows editor and admin roles (app_metadata staff)', () => {
		expect(resolveAdminGate({ hasSession: true, role: 'editor', devAdmin: false })).toBe('allow');
		expect(resolveAdminGate({ hasSession: true, role: 'admin', devAdmin: false })).toBe('allow');
	});

	it('redirects unauthenticated users to sign-in', () => {
		expect(resolveAdminGate({ hasSession: false, role: null, devAdmin: false })).toBe('sign-in');
	});

	it('returns forbidden for signed-in non-staff roles', () => {
		expect(resolveAdminGate({ hasSession: true, role: 'customer', devAdmin: false })).toBe(
			'forbidden'
		);
		expect(resolveAdminGate({ hasSession: true, role: 'contributor', devAdmin: false })).toBe(
			'forbidden'
		);
	});

	it('returns forbidden when session exists but role is missing', () => {
		expect(resolveAdminGate({ hasSession: true, role: null, devAdmin: false })).toBe('forbidden');
	});

	it('prefers allow when devAdmin is set even with customer role', () => {
		expect(resolveAdminGate({ hasSession: true, role: 'customer', devAdmin: true })).toBe('allow');
	});
});

describe('resolveAdminGateFromLocals + adminGateJsonResponse', () => {
	it('returns null response when staff session allows admin API', () => {
		expect(
			adminGateJsonResponse(
				resolveAdminGateFromLocals({ session: { role: 'editor' }, devAdmin: false })
			)
		).toBeNull();
	});

	it('returns null when gate is allow', () => {
		expect(adminGateJsonResponse('allow')).toBeNull();
	});

	it('returns 403 JSON when unauthenticated', async () => {
		const response = adminGateJsonResponse(
			resolveAdminGateFromLocals({ session: null, devAdmin: false })
		);
		expect(response?.status).toBe(403);
		expect(await response?.json()).toEqual({ error: 'Sign in required.' });
	});

	it('returns 403 JSON when signed-in user is not staff', async () => {
		const response = adminGateJsonResponse(
			resolveAdminGateFromLocals({ session: { role: 'customer' }, devAdmin: false })
		);
		expect(response?.status).toBe(403);
		expect(await response?.json()).toEqual({ error: 'Forbidden.' });
	});
});
