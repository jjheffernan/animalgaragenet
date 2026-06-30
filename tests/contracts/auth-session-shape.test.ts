import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { isValidRole } from '$lib/auth/roles';
import { mapSupabaseUser } from '$lib/server/supabase/auth';

function supabaseUserFixture(overrides: Partial<User> = {}): User {
	return {
		id: '550e8400-e29b-41d4-a716-446655440000',
		email: 'driver@example.com',
		app_metadata: {},
		user_metadata: {},
		aud: 'authenticated',
		created_at: '2026-06-30T12:00:00.000Z',
		...overrides
	} as User;
}

describe('supabase-auth session mapping contracts', () => {
	it('mapSupabaseUser reads role from app_metadata, not user_metadata', () => {
		const session = mapSupabaseUser(
			supabaseUserFixture({
				app_metadata: { role: 'editor' },
				user_metadata: { role: 'admin', name: 'Jordan' }
			})
		);

		expect(session.role).toBe('editor');
	});

	it('defaults to customer when app_metadata role is missing or invalid', () => {
		expect(mapSupabaseUser(supabaseUserFixture()).role).toBe('customer');
		expect(mapSupabaseUser(supabaseUserFixture({ app_metadata: { role: 'superuser' } })).role).toBe(
			'customer'
		);
	});

	it('still uses user_metadata for display name only', () => {
		const session = mapSupabaseUser(
			supabaseUserFixture({
				app_metadata: { role: 'contributor' },
				user_metadata: { name: 'Pit Crew Jordan' }
			})
		);

		expect(session.name).toBe('Pit Crew Jordan');
		expect(session.role).toBe('contributor');
	});

	it('isValidRole accepts known roles and rejects garbage', () => {
		for (const role of ['admin', 'editor', 'contributor', 'customer'] as const) {
			expect(isValidRole(role)).toBe(true);
		}

		for (const bad of ['', 'superuser', 'ADMIN', 'customer ', 'null', 'undefined', 'root']) {
			expect(isValidRole(bad)).toBe(false);
		}
	});
});
