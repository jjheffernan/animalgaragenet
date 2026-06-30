import { mockPartCategories } from '$lib/data/mock-part-categories';
import { mockParts } from '$lib/data/mock-parts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const year = url.searchParams.get('year');
	const make = url.searchParams.get('make');
	const model = url.searchParams.get('model');
	const submodel = url.searchParams.get('submodel');
	const modelSlug = url.searchParams.get('model');

	const ymmLabel = [year, make, model, submodel].filter(Boolean).join(' ') || null;

	return {
		categories: mockPartCategories,
		products: mockParts.slice(0, 12),
		ymm: { year, make, model, submodel },
		ymmLabel,
		modelSlug
	};
};
