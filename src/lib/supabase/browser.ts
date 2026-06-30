import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '$lib/config/env';

let browserClient: SupabaseClient | undefined;

export function isSupabaseBrowserConfigured(): boolean {
	return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

/** Singleton browser Supabase client for client-side auth and realtime. */
export function createBrowserClient(): SupabaseClient | null {
	if (!isSupabaseBrowserConfigured()) return null;

	if (!browserClient) {
		browserClient = createSupabaseBrowserClient(config.supabaseUrl, config.supabaseAnonKey);
	}

	return browserClient;
}
