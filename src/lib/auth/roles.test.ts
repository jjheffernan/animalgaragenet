import { describe, expect, it } from 'vitest';
import { canAccessAdmin, hasRole, isValidRole } from './roles';

describe('role helpers', () => {
	it('validates known roles', () => {
		expect(isValidRole('admin')).toBe(true);
		expect(isValidRole('customer')).toBe(true);
		expect(isValidRole('superuser')).toBe(false);
	});

	it('matches exact roles', () => {
		expect(hasRole('editor', 'editor')).toBe(true);
		expect(hasRole('customer', 'admin')).toBe(false);
	});

	it('grants higher roles when minimum level is met', () => {
		expect(hasRole('admin', 'contributor')).toBe(true);
		expect(hasRole('editor', ['contributor', 'editor'])).toBe(true);
		expect(hasRole('contributor', 'editor')).toBe(false);
	});

	it('rejects null or undefined roles', () => {
		expect(hasRole(null, 'customer')).toBe(false);
		expect(hasRole(undefined, 'admin')).toBe(false);
	});

	it('gates admin panel access to editor and above', () => {
		expect(canAccessAdmin('admin')).toBe(true);
		expect(canAccessAdmin('editor')).toBe(true);
		expect(canAccessAdmin('contributor')).toBe(false);
		expect(canAccessAdmin('customer')).toBe(false);
	});
});
