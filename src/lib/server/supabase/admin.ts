import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '#lib/server/supabase/client.ts';

/** Service-role client for server-only writes (bypasses RLS). Never import in client code. */
export function createAdminClient(): SupabaseClient | null {
	const cfg = getSupabaseConfig();
	const serviceKey = SUPABASE_SERVICE_ROLE_KEY;
	if (!cfg || !serviceKey) return null;

	return createClient(cfg.url, serviceKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
