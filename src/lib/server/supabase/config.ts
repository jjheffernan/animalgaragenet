import { SUPABASE_ANON_KEY, SUPABASE_DATABASE_URL } from '$app/env/private';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';
import { resolveSupabaseEnv, type SupabaseEnv } from '#lib/server/supabase/env.ts';

export type { SupabaseEnv };

/** Server-only Supabase REST config (API URL + anon key). */
export function getSupabaseEnv(): SupabaseEnv | null {
	return resolveSupabaseEnv({
		SUPABASE_DATABASE_URL,
		SUPABASE_ANON_KEY,
		PUBLIC_SUPABASE_URL
	});
}

export function isSupabaseConfigured(): boolean {
	return getSupabaseEnv() !== null;
}
