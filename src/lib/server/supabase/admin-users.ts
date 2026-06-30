import type { User } from '@supabase/supabase-js';
import type { createAdminClient } from './admin';

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

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
