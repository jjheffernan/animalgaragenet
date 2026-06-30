import { mockBrands } from '$lib/data/mock/brands';
import { mockPopularModels } from '$lib/data/mock/popular-models';
import type { Brand, PartCategory, PopularModel } from '$lib/types/domain';
import { config } from '$lib/config/env';
import { getPartCategoriesForNav } from '$lib/server/catalog/parts';

export interface PartsNavData {
	categories: PartCategory[];
	brands: Brand[];
	popularModels: PopularModel[];
}

/** Shared parts navigation payload for the header mega menu and parts-page ribbon. */
export async function getPartsNavData(
	locale: string = config.defaultLocale
): Promise<PartsNavData> {
	const categories = await getPartCategoriesForNav(locale);

	return {
		categories,
		brands: mockBrands,
		popularModels: mockPopularModels
	};
}
