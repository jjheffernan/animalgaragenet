import { error } from '@sveltejs/kit';
import { getBuildBySlug } from '$lib/data/mock/builds';
import { getProductsForBuild } from '$lib/data/catalog-helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const build = getBuildBySlug(params.slug);
	if (!build) error(404, 'Build not found');

	return {
		build,
		products: getProductsForBuild(build)
	};
};
