import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROFILE_SIGNUP_COLUMNS, buildProfileSignupPayload } from '$lib/server/profiles/signup';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

function assertSnakeCasePayload(payload: Record<string, unknown>): void {
	for (const key of Object.keys(payload)) {
		expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
		expect(key).not.toMatch(/[A-Z]/);
	}
}

describe('profiles signup trigger contract', () => {
	it('migration trigger inserts id and display_name only', () => {
		const sql = readFileSync(
			join(process.cwd(), 'supabase/migrations/20250701000000_core_auth_profiles.sql'),
			'utf8'
		);
		expect(sql).toMatch(/insert into public\.profiles \(id, display_name\)/i);
		expect(sql).toMatch(/coalesce\(new\.raw_user_meta_data\s*->>\s*'name'/i);
		expect(sql).toMatch(/split_part\(new\.email,\s*'@',\s*1\)/i);
	});

	it('buildProfileSignupPayload matches trigger column shape', () => {
		const payload = buildProfileSignupPayload(VALID_UUID, 'driver@example.com', {
			name: 'Jordan H'
		});
		assertSnakeCasePayload(payload);
		for (const col of PROFILE_SIGNUP_COLUMNS) {
			expect(payload).toHaveProperty(col);
		}
		expect(payload.id).toBe(VALID_UUID);
		expect(payload.display_name).toBe('Jordan H');
	});

	it('falls back to email local-part when name metadata is absent', () => {
		const payload = buildProfileSignupPayload(VALID_UUID, 'driver@example.com', null);
		expect(payload.display_name).toBe('driver');
	});
});
