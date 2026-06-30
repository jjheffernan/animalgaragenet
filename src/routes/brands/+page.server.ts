import { mockBrands } from '$lib/data/mock/brands';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { items, pagination } = paginateFromUrl(url, mockBrands);
	return { brands: items, pagination };
};
