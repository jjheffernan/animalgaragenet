import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createMockUser, createServerClient, setSessionCookie } from '$lib/server/supabase/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session) {
		const redirectTo = url.searchParams.get('redirect') ?? '/account';
		throw redirect(303, redirectTo);
	}

	return {
		supabaseReady: createServerClient({} as never) !== null,
		redirectTo: url.searchParams.get('redirect') ?? '/account'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Enter a valid email address.', email, name });
		}

		const client = createServerClient(cookies);
		if (client) {
			await client.signInWithOtp(email);
		}

		const user = createMockUser(email, name);
		setSessionCookie(cookies, user);

		const redirectTo = String(form.get('redirect') ?? url.searchParams.get('redirect') ?? '/account');
		throw redirect(303, redirectTo);
	}
};
