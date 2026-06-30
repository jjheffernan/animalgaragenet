import { error, fail } from '@sveltejs/kit';
import { mockAdminUsers } from '$lib/data/mock/admin-users';
import { hasRole, isValidRole, type Role } from '$lib/auth/roles';
import {
	inviteAdminUser,
	listAdminUsers,
	updateAdminUserRole
} from '$lib/server/supabase/admin-users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!hasRole(locals.session?.role, 'admin')) {
		throw error(403, 'Admin role required to manage users.');
	}

	const liveUsers = await listAdminUsers();
	if (liveUsers !== null) {
		return { users: liveUsers, source: 'supabase' as const };
	}

	return { users: [...mockAdminUsers], source: 'mock' as const };
};

export const actions: Actions = {
	updateRole: async ({ request, locals }) => {
		if (!hasRole(locals.session?.role, 'admin')) {
			return fail(403, { error: 'Admin role required.' });
		}

		const data = await request.formData();
		const userId = String(data.get('userId') ?? '');
		const role = String(data.get('role') ?? '');

		if (!userId || !isValidRole(role)) {
			return fail(400, { error: 'Invalid user or role.' });
		}

		const result = await updateAdminUserRole(userId, role as Role);
		if (!result.ok) {
			return fail(500, { error: result.error ?? 'Could not update role.' });
		}

		return { success: true };
	},

	invite: async ({ request, locals }) => {
		if (!hasRole(locals.session?.role, 'admin')) {
			return fail(403, { error: 'Admin role required.' });
		}

		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const name = String(data.get('name') ?? '');
		const role = String(data.get('role') ?? '');

		if (!isValidRole(role)) {
			return fail(400, { error: 'Invalid role.' });
		}

		const result = await inviteAdminUser(email, name, role as Role);
		if (!result.ok) {
			return fail(400, { error: result.error ?? 'Could not invite user.' });
		}

		return { success: true, message: `Invitation sent to ${email.trim()}.` };
	}
};
