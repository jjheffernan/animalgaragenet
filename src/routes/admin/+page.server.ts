import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Staff overview lives at `/admin/runtime`. */
export const load: PageServerLoad = async () => {
	throw redirect(303, '/admin/runtime');
};
