import { error } from '@sveltejs/kit';
import { setGhostDetailCacheHeaders } from '$lib/server/ghost/cache-headers';
import { getGuide, listGuides } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setGhostDetailCacheHeaders(setHeaders);
	const guide = await getGuide(params.slug);
	if (!guide) error(404, 'Guide not found');

	const allGuides = await listGuides();
	const related = allGuides.filter((g) => g.slug !== params.slug).slice(0, 3);

	return { guide, related };
};
