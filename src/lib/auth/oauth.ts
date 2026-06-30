/** Supabase Auth OAuth providers supported by this app (extensible). */
export type OAuthProvider = 'google' | 'discord' | 'azure';

export const OAUTH_PROVIDER_LABELS: Record<OAuthProvider, string> = {
	google: 'Google',
	discord: 'Discord',
	azure: 'Microsoft'
};

export const OAUTH_BUTTON_LABELS: Record<OAuthProvider, string> = {
	google: 'Continue with Google',
	discord: 'Continue with Discord',
	azure: 'Continue with Microsoft'
};

export function isOAuthProvider(value: string | null): value is OAuthProvider {
	return value === 'google' || value === 'discord' || value === 'azure';
}

export function mockCallbackQuery(provider: OAuthProvider, redirect?: string): string {
	const params = new URLSearchParams({ provider, mock: '1' });
	if (redirect) params.set('redirect', redirect);
	return params.toString();
}

export function mockCallbackUrl(provider: OAuthProvider, redirect?: string): string {
	return `/auth/callback?${mockCallbackQuery(provider, redirect)}`;
}

export function mockOAuthEmail(provider: OAuthProvider): string {
	if (provider === 'azure') return 'user@outlook.com';
	if (provider === 'discord') return 'user@discord.mock';
	return 'user@gmail.com';
}

/** Provider profile fields from Supabase Auth user_metadata after OAuth sign-in. */
export function oauthDisplayName(
	metadata: Record<string, unknown> | null | undefined
): string | null {
	if (!metadata) return null;
	const userName = metadata.user_name ?? metadata.preferred_username;
	if (typeof userName === 'string' && userName.trim()) return userName.trim();
	const fullName = metadata.full_name ?? metadata.name;
	if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
	return null;
}
