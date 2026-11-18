import { error } from '@sveltejs/kit';
import { getProductsForBuild } from '#lib/data/catalog-helpers.ts';
import { getPublicBuildBySlug } from '#lib/server/builds/public.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const build = await getPublicBuildBySlug(params.slug);
	if (!build) error(404, 'Build not found');

	return {
		build,
		products: getProductsForBuild(build)
	};
};
