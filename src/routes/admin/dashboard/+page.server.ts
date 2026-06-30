import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Canonical overview lives at `/admin`. */
export const load: PageServerLoad = async () => {
	throw redirect(303, '/admin');
};
