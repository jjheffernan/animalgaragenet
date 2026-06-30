import { describe, expect, it } from 'vitest';
import { resolveAdminGate } from './admin-gate';

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
});
