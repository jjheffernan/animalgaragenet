import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/auth/sign-in?redirect=/account');
	}

	return {
		user: locals.session
	};
};
