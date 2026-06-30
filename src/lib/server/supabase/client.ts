import { config } from '$lib/config/env';

export interface SupabaseClientConfig {
	url: string;
	anonKey: string;
}

export function getSupabaseConfig(): SupabaseClientConfig | null {
	if (!config.supabaseUrl || !config.supabaseAnonKey) {
		return null;
	}

	return {
		url: config.supabaseUrl,
		anonKey: config.supabaseAnonKey
	};
}

// Placeholder — wire @supabase/supabase-js when auth/content features land
export async function createSupabaseClient() {
	const cfg = getSupabaseConfig();
	if (!cfg) return null;

	return {
		url: cfg.url,
		ready: false,
		message: 'Supabase client not yet initialized — add @supabase/supabase-js'
	};
}
