import { fail, redirect } from '@sveltejs/kit';
import { linkMediaToTestimonial } from '$lib/server/media/repository';
import { validateMediaAssetIds } from '$lib/server/media/validation';
import {
	createTestimonial,
	listApprovedTestimonials,
	listTestimonialsForUser
} from '$lib/server/testimonials/repository';
import { validateTestimonialFields } from '$lib/server/testimonials/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	const [approved, userTestimonials] = await Promise.all([
		listApprovedTestimonials(),
		session ? listTestimonialsForUser(session.id) : Promise.resolve([])
	]);

	return {
		authenticated: Boolean(session),
		user: session,
		approved,
		userTestimonials
	};
};

function parseFields(data: FormData) {
	return {
		displayName: String(data.get('displayName') ?? '').trim(),
		vehicleSummary: String(data.get('vehicleSummary') ?? '').trim(),
		rating: String(data.get('rating') ?? '').trim(),
		title: String(data.get('title') ?? '').trim(),
		body: String(data.get('body') ?? '').trim()
	};
}

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const user = locals.session;
		if (!user) throw redirect(303, '/auth/sign-in?redirect=/loyalty#reviews');

		const data = await request.formData();
		const fields = parseFields(data);
		const errors = validateTestimonialFields(fields);
		if (Object.keys(errors).length > 0) return fail(400, { errors, fields });

		const existing = await listTestimonialsForUser(user.id);
		const hasPending = existing.some((t) => t.status === 'pending');
		if (hasPending) {
			return fail(400, {
				errors: { body: 'You already have a review awaiting moderation.' },
				fields
			});
		}

		const loyaltyTier = String(data.get('loyaltyTier') ?? '').trim() || null;
		const mediaAssetIds = data.getAll('mediaAssetIds').map((id) => String(id).trim()).filter(Boolean);
		const mediaError = validateMediaAssetIds(mediaAssetIds);
		if (mediaError) {
			return fail(400, { errors: { body: mediaError }, fields });
		}

		const testimonial = await createTestimonial(user.id, {
			displayName: fields.displayName,
			vehicleSummary: fields.vehicleSummary || null,
			rating: Number.parseInt(fields.rating, 10),
			title: fields.title,
			body: fields.body,
			loyaltyTier
		});

		await linkMediaToTestimonial(testimonial.id, mediaAssetIds, user.id);

		return { success: true, message: 'Thanks! Your review is in the moderation queue.' };
	}
};
