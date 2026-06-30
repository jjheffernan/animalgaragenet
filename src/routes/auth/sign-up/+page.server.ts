import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createMockUser, createServerClient, setSessionCookie } from '$lib/server/supabase/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/account');
	}

	return {
		supabaseReady: createServerClient({} as never) !== null
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

		const client = createServerClient(cookies);
		if (client) {
			await client.signUp(email, name);
		}

		const user = createMockUser(email, name);
		setSessionCookie(cookies, user);

		throw redirect(303, '/account');
	}
};
