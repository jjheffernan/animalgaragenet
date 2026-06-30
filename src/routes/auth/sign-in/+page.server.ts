import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { config } from '$lib/config/env';
import {
	createMockUser,
	setSessionCookie,
	signInWithOtp
} from '$lib/server/supabase/auth';
import { createServerClient, isSupabaseConfigured } from '$lib/server/supabase/client';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session) {
		const redirectTo = url.searchParams.get('redirect') ?? '/account';
		throw redirect(303, redirectTo);
	}

	return {
		supabaseReady: isSupabaseConfigured(),
		redirectTo: url.searchParams.get('redirect') ?? '/account'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const redirectTo = String(form.get('redirect') ?? url.searchParams.get('redirect') ?? '/account');

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Enter a valid email address.', email, name });
		}

		const supabase = createServerClient({ cookies });
		if (supabase) {
			const callbackUrl = new URL('/auth/callback', config.siteUrl);
			callbackUrl.searchParams.set('redirect', redirectTo);

			const result = await signInWithOtp(supabase, email, {
				emailRedirectTo: callbackUrl.toString(),
				name: name || undefined
			});

			if (!result.ok) {
				return fail(400, { error: result.message, email, name });
			}

			return { success: true, message: result.message, email, name };
		}

		const user = createMockUser(email, name);
		setSessionCookie(cookies, user);
		throw redirect(303, redirectTo);
	}
};
