import type { User } from '@supabase/supabase-js';
import { isValidRole, type Role } from '$lib/auth/roles';
import { createAdminClient } from './admin';
import { mapSupabaseUser } from './auth';
import type { createAdminClient as CreateAdminClientFn } from './admin';

type AdminClient = NonNullable<ReturnType<typeof CreateAdminClientFn>>;

export interface AdminUserRow {
	id: string;
	email: string;
	name: string;
	role: Role;
	createdAt: string;
	lastActive: string;
}

function formatAdminDate(iso: string | undefined | null): string {
	if (!iso) return '—';
	return iso.slice(0, 10);
}

function mapAuthUserToRow(user: User): AdminUserRow {
	const mapped = mapSupabaseUser(user);
	return {
		id: mapped.id,
		email: mapped.email,
		name: mapped.name,
		role: mapped.role,
		createdAt: formatAdminDate(user.created_at),
		lastActive: formatAdminDate(user.last_sign_in_at ?? user.updated_at ?? user.created_at)
	};
}

/** List all auth users via service role. Returns null when Supabase admin client is unavailable. */
export async function listAdminUsers(): Promise<AdminUserRow[] | null> {
	const admin = createAdminClient();
	if (!admin) return null;

	const rows: AdminUserRow[] = [];
	let page = 1;

	while (true) {
		const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
		if (error) return null;

		for (const user of data.users) {
			rows.push(mapAuthUserToRow(user));
		}

		if (!data.nextPage) break;
		page = data.nextPage;
	}

	return rows.sort((a, b) => a.email.localeCompare(b.email));
}

/** Update app_metadata.role for a user (service role only). */
export async function updateAdminUserRole(
	userId: string,
	role: Role
): Promise<{ ok: boolean; error?: string }> {
	if (!isValidRole(role)) {
		return { ok: false, error: 'Invalid role' };
	}

	const admin = createAdminClient();
	if (!admin) {
		return { ok: false, error: 'Supabase not configured' };
	}

	const { error } = await admin.auth.admin.updateUserById(userId, {
		app_metadata: { role }
	});

	if (error) {
		return { ok: false, error: error.message };
	}

	return { ok: true };
}

/** Invite a new user by email with an initial role (service role only). */
export async function inviteAdminUser(
	email: string,
	name: string,
	role: Role
): Promise<{ ok: boolean; error?: string }> {
	const trimmedEmail = email.trim();
	const trimmedName = name.trim();
	if (!trimmedEmail.includes('@') || !trimmedName) {
		return { ok: false, error: 'Enter a valid name and email.' };
	}
	if (!isValidRole(role)) {
		return { ok: false, error: 'Invalid role' };
	}

	const admin = createAdminClient();
	if (!admin) {
		return { ok: false, error: 'Supabase not configured' };
	}

	const { error } = await admin.auth.admin.inviteUserByEmail(trimmedEmail, {
		data: { name: trimmedName },
		app_metadata: { role }
	} as { data?: object; redirectTo?: string });

	if (error) {
		return { ok: false, error: error.message };
	}

	return { ok: true };
}

/** Look up auth user by email via admin listUsers (no getUserByEmail in auth-js). */
export async function findUserByEmail(
	admin: AdminClient,
	email: string
): Promise<{ user: User | null; error: Error | null }> {
	const normalized = email.trim().toLowerCase();
	let page = 1;

	while (true) {
		const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
		if (error) return { user: null, error: new Error(error.message) };

		const user = data.users.find((u) => u.email?.toLowerCase() === normalized) ?? null;
		if (user) return { user, error: null };

		if (!data.nextPage) return { user: null, error: null };
		page = data.nextPage;
	}
}

/** Resolve Supabase auth user id from checkout/order email (service role). */
export async function resolveUserIdByEmail(email: string | null): Promise<string | null> {
	if (!email) return null;
	const admin = createAdminClient();
	if (!admin) return null;

	const { user, error } = await findUserByEmail(admin, email);
	if (error || !user) return null;
	return user.id;
}
