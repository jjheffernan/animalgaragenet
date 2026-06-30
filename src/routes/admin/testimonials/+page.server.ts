import { fail } from '@sveltejs/kit';
import { enrichTestimonialsWithPhotos } from '$lib/server/media/repository';
import { listPendingTestimonials, moderateTestimonial } from '$lib/server/testimonials/repository';
import { paginateFromUrl } from '$lib/pagination';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const allPending = await listPendingTestimonials();
	const { items, pagination } = paginateFromUrl(url, allPending);
	return { pending: await enrichTestimonialsWithPhotos(items), pagination };
};

export const actions: Actions = {
	approve: async ({ request }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const featured = data.get('featured') === 'on';
		if (!id) return fail(400, { error: 'Missing testimonial id' });

		const ok = await moderateTestimonial(id, 'approved', { featured });
		if (!ok) return fail(500, { error: 'Could not approve testimonial' });
		return { success: true };
	},
	reject: async ({ request }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing testimonial id' });
		const ok = await moderateTestimonial(id, 'rejected');
		if (!ok) return fail(500, { error: 'Could not reject testimonial' });
		return { success: true };
	}
};
