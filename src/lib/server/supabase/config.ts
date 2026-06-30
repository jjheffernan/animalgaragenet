import { env } from '$env/dynamic/private';
import { resolveSupabaseEnv, type SupabaseEnv } from '$lib/server/supabase/env';

export type { SupabaseEnv };

/** Server-only Supabase REST config (API URL + anon key). */
export function getSupabaseEnv(): SupabaseEnv | null {
	return resolveSupabaseEnv(env);
}

export function isSupabaseConfigured(): boolean {
	return getSupabaseEnv() !== null;
}
