import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	findUserByEmail,
	inviteAdminUser,
	listAdminUsers,
	updateAdminUserRole
} from './admin-users';

const sampleUser = {
	id: 'user-1',
	email: 'admin@animalgarage.net',
	created_at: '2025-01-15T10:00:00.000Z',
	last_sign_in_at: '2026-06-28T12:00:00.000Z',
	updated_at: '2026-06-28T12:00:00.000Z',
	app_metadata: { role: 'admin' },
	user_metadata: { name: 'Site Admin' }
};

function mockAdminAuth(overrides?: {
	listUsers?: ReturnType<typeof vi.fn>;
	updateUserById?: ReturnType<typeof vi.fn>;
	inviteUserByEmail?: ReturnType<typeof vi.fn>;
}) {
	const listUsers =
		overrides?.listUsers ??
		vi.fn().mockResolvedValue({
			data: { users: [sampleUser], nextPage: null },
			error: null
		});
	const updateUserById = overrides?.updateUserById ?? vi.fn().mockResolvedValue({ error: null });
	const inviteUserByEmail =
		overrides?.inviteUserByEmail ?? vi.fn().mockResolvedValue({ error: null });

	vi.mocked(createAdminClient).mockReturnValue({
		auth: { admin: { listUsers, updateUserById, inviteUserByEmail } }
	} as never);

	return { listUsers, updateUserById, inviteUserByEmail };
}

describe('listAdminUsers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns null when admin client is unavailable', async () => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		await expect(listAdminUsers()).resolves.toBeNull();
	});

	it('maps auth users to admin rows', async () => {
		mockAdminAuth();

		const users = await listAdminUsers();
		expect(users).toHaveLength(1);
		expect(users![0]).toMatchObject({
			id: 'user-1',
			email: 'admin@animalgarage.net',
			name: 'Site Admin',
			role: 'admin',
			createdAt: '2025-01-15',
			lastActive: '2026-06-28'
		});
	});

	it('paginates through all listUsers pages', async () => {
		const listUsers = vi
			.fn()
			.mockResolvedValueOnce({
				data: { users: [sampleUser], nextPage: 2 },
				error: null
			})
			.mockResolvedValueOnce({
				data: {
					users: [
						{
							...sampleUser,
							id: 'user-2',
							email: 'editor@animalgarage.net',
							app_metadata: { role: 'editor' },
							user_metadata: { name: 'Editor' }
						}
					],
					nextPage: null
				},
				error: null
			});
		mockAdminAuth({ listUsers });

		const users = await listAdminUsers();
		expect(listUsers).toHaveBeenCalledTimes(2);
		expect(users).toHaveLength(2);
	});
});

describe('updateAdminUserRole', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns error when Supabase is not configured', async () => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		const result = await updateAdminUserRole('user-1', 'editor');
		expect(result.ok).toBe(false);
	});

	it('updates app_metadata.role via service role', async () => {
		const { updateUserById } = mockAdminAuth();
		const result = await updateAdminUserRole('user-1', 'editor');
		expect(result.ok).toBe(true);
		expect(updateUserById).toHaveBeenCalledWith('user-1', {
			app_metadata: { role: 'editor' }
		});
	});
});

describe('inviteAdminUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('validates email and name', async () => {
		mockAdminAuth();
		const result = await inviteAdminUser('bad', '', 'customer');
		expect(result.ok).toBe(false);
	});

	it('invites user with role in app_metadata', async () => {
		const { inviteUserByEmail } = mockAdminAuth();
		const result = await inviteAdminUser('new@example.com', 'New User', 'contributor');
		expect(result.ok).toBe(true);
		expect(inviteUserByEmail).toHaveBeenCalledWith('new@example.com', {
			data: { name: 'New User' },
			app_metadata: { role: 'contributor' }
		});
	});
});

describe('findUserByEmail', () => {
	it('finds a user across paginated results', async () => {
		const listUsers = vi
			.fn()
			.mockResolvedValueOnce({
				data: { users: [], nextPage: 2 },
				error: null
			})
			.mockResolvedValueOnce({
				data: { users: [sampleUser], nextPage: null },
				error: null
			});
		const admin = mockAdminAuth({ listUsers });

		const { user, error } = await findUserByEmail(
			createAdminClient() as never,
			'admin@animalgarage.net'
		);
		expect(error).toBeNull();
		expect(user?.id).toBe('user-1');
		expect(admin.listUsers).toHaveBeenCalledTimes(2);
	});
});
