import { config } from '$lib/config/env';

export interface BrowserAuthClient {
	ready: boolean;
	signInWithOAuth: (provider: 'google') => Promise<{ ok: boolean; url?: string; message: string }>;
}

export function createBrowserAuthClient(): BrowserAuthClient | null {
	if (!config.supabaseUrl || !config.supabaseAnonKey) {
		return null;
	}

	return {
		ready: false,
		signInWithOAuth: async () => ({
			ok: true,
			url: '/auth/callback?provider=google&mock=1',
			message: 'Supabase OAuth stub — wire @supabase/supabase-js for production'
		})
	};
}
