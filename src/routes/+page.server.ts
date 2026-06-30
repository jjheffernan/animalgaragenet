import { mockCollections } from '$lib/data/mock-collections';
import { getActiveCampaign } from '$lib/data/mock-campaigns';
import { getClearanceProducts, getStaffPickProducts } from '$lib/data/mock-products';
import { mockPopularModels } from '$lib/data/mock-popular-models';
import { mockUGC } from '$lib/data/mock-ugc';
import { mockVideos } from '$lib/data/mock-videos';
import { getFeaturedBuilds } from '$lib/data/mock-builds';
import { mockGuides } from '$lib/data/mock-guides';
import { mockBrands } from '$lib/data/mock-brands';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		collections: mockCollections,
		staffPicks: getStaffPickProducts(),
		clearance: getClearanceProducts(),
		videos: mockVideos.slice(0, 3),
		ugc: mockUGC,
		builds: getFeaturedBuilds().slice(0, 3),
		guides: mockGuides.slice(0, 3),
		brands: mockBrands,
		popularModels: mockPopularModels,
		activeCampaign: getActiveCampaign()
	};
};
