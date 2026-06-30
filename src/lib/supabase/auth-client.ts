import { mockCallbackUrl, type OAuthProvider } from '$lib/auth/oauth';
import { config } from '$lib/config/env';
import { createBrowserClient } from '$lib/supabase/browser';

export interface OAuthSignInResult {
	ok: boolean;
	url?: string;
	message: string;
}

export interface BrowserAuthClient {
	ready: boolean;
	signInWithOAuth: (provider: OAuthProvider, redirectTo?: string) => Promise<OAuthSignInResult>;
}

function oauthCallbackUrl(redirectTo: string): string {
	const origin = typeof window !== 'undefined' ? window.location.origin : config.siteUrl;
	const callbackUrl = new URL('/auth/callback', origin);
	callbackUrl.searchParams.set('redirect', redirectTo);
	return callbackUrl.toString();
}

/** Browser OAuth sign-in with PKCE via @supabase/ssr; mock callback when env unset. */
export async function signInWithOAuth(
	provider: OAuthProvider,
	redirectTo = '/account'
): Promise<OAuthSignInResult> {
	const supabase = createBrowserClient();
	if (!supabase) {
		return {
			ok: true,
			url: mockCallbackUrl(provider, redirectTo),
			message: 'Mock OAuth — set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'
		};
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: oauthCallbackUrl(redirectTo),
			...(provider === 'azure' ? { queryParams: { prompt: 'select_account' } } : {})
		}
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	return {
		ok: true,
		url: data.url,
		message: `Redirecting to ${provider} sign-in`
	};
}

export function createBrowserAuthClient(): BrowserAuthClient | null {
	if (!config.supabaseUrl || !config.supabaseAnonKey) {
		return null;
	}

	return {
		ready: true,
		signInWithOAuth
	};
}
