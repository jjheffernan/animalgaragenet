/**
 * Promote a Supabase user role via service role (production admin bootstrap).
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin
 *
 * Requires SUPABASE_DATABASE_URL (or PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';
import { deriveSupabaseApiUrl } from '../src/lib/server/supabase/env';
import { findUserByEmail } from '../src/lib/server/supabase/admin-users';

const ROLES = ['admin', 'editor', 'contributor', 'customer'] as const;
type Role = (typeof ROLES)[number];

function isRole(value: string): value is Role {
	return (ROLES as readonly string[]).includes(value);
}

const email = process.argv[2]?.trim();
const roleArg = process.argv[3]?.trim();

if (!email || !roleArg || !isRole(roleArg)) {
	console.error('Usage: npx tsx --env-file=.env scripts/promote-admin.ts user@email.com <role>');
	console.error(`Roles: ${ROLES.join(', ')}`);
	process.exit(1);
}

const url = deriveSupabaseApiUrl(process.env.SUPABASE_DATABASE_URL, process.env.PUBLIC_SUPABASE_URL);
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
	console.error(
		'Missing Supabase config. Set SUPABASE_DATABASE_URL (or PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.'
	);
	process.exit(1);
}

const admin = createClient(url, serviceKey, {
	auth: { persistSession: false, autoRefreshToken: false }
});

const { user: existingUser, error: lookupError } = await findUserByEmail(admin, email);
if (lookupError) {
	console.error(lookupError.message);
	process.exit(1);
}

if (!existingUser) {
	console.error(`No user found for ${email}. Have them sign up or send a magic link first.`);
	process.exit(1);
}

const { data, error } = await admin.auth.admin.updateUserById(existingUser.id, {
	app_metadata: { role: roleArg }
});

if (error) {
	console.error(error.message);
	process.exit(1);
}

console.log(`Updated ${data.user.email} → app_metadata.role = ${roleArg}`);
