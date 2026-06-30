import { error } from '@sveltejs/kit';
import { getGuideBySlug, mockGuides } from '$lib/data/mock-guides';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const guide = getGuideBySlug(params.slug);
	if (!guide) error(404, 'Guide not found');

	return { guide, related: mockGuides.filter((g) => g.slug !== params.slug).slice(0, 3) };
};
