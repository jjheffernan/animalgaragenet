import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createMockUser, createServerClient, setSessionCookie } from '$lib/server/supabase/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const provider = url.searchParams.get('provider');
	const isMock = url.searchParams.get('mock') === '1';

	const client = createServerClient(cookies);
	if (client && !isMock) {
		// TODO: exchange OAuth code for session when @supabase/supabase-js is wired
		await client.signInWithOAuth('google');
	}

	const email = url.searchParams.get('email') ?? 'user@gmail.com';
	const user = createMockUser(email, email.split('@')[0]);

	if (provider === 'google') {
		user.name = `${user.name} (Google)`;
	}

	setSessionCookie(cookies, user);

	const redirectTo = url.searchParams.get('redirect') ?? '/account';
	throw redirect(303, redirectTo);
};
