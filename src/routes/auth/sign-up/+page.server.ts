import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { config } from '$lib/config/env';
import {
	createMockUser,
	setSessionCookie,
	signUpWithOtp
} from '$lib/server/supabase/auth';
import { createServerClient, isSupabaseConfigured } from '$lib/server/supabase/client';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/account');
	}

	return {
		supabaseReady: isSupabaseConfigured(),
		redirectTo: '/account'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Enter a valid email address.', email, name });
		}

		if (!name) {
			return fail(400, { error: 'Enter your name.', email, name });
		}

		const supabase = createServerClient({ cookies });
		if (supabase) {
			const callbackUrl = new URL('/auth/callback', config.siteUrl);
			callbackUrl.searchParams.set('redirect', '/account');

			const result = await signUpWithOtp(supabase, email, name, {
				emailRedirectTo: callbackUrl.toString()
			});

			if (!result.ok) {
				return fail(400, { error: result.message, email, name });
			}

			return { success: true, message: result.message, email, name };
		}

		const user = createMockUser(email, name);
		setSessionCookie(cookies, user);
		throw redirect(303, '/account');
	}
};
