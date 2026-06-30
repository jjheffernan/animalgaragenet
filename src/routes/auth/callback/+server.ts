import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	isOAuthProvider,
	mockOAuthEmail,
	oauthDisplayName,
	OAUTH_PROVIDER_LABELS
} from '$lib/auth/oauth';
import { createMockUser, exchangeOAuthCode, setSessionCookie } from '$lib/server/supabase/auth';
import { isSupabaseConfigured } from '$lib/server/supabase/client';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const providerParam = url.searchParams.get('provider');
	const isMock = url.searchParams.get('mock') === '1';
	const redirectTo = url.searchParams.get('redirect') ?? '/account';
	const code = url.searchParams.get('code');

	if (!isMock && locals.supabase && code) {
		const result = await exchangeOAuthCode(locals.supabase, code);
		if (!result.ok) {
			throw redirect(303, `/auth/sign-in?error=${encodeURIComponent(result.message)}`);
		}
		throw redirect(303, redirectTo);
	}

	if (!isSupabaseConfigured()) {
		const provider = isOAuthProvider(providerParam) ? providerParam : 'google';
		const email = url.searchParams.get('email') ?? mockOAuthEmail(provider);
		const user = createMockUser(email, email.split('@')[0]);

		if (provider === 'discord') {
			user.name =
				url.searchParams.get('username') ??
				oauthDisplayName({ user_name: url.searchParams.get('username') ?? undefined }) ??
				email.split('@')[0];
		} else {
			user.name = `${user.name} (${OAUTH_PROVIDER_LABELS[provider]})`;
		}

		setSessionCookie(cookies, user);
		throw redirect(303, redirectTo);
	}

	throw redirect(303, '/auth/sign-in');
};
