import {
	getClearanceProducts,
	getCollections,
	getStaffPickProducts
} from '$lib/server/catalog/collections';
import { getActiveCampaign } from '$lib/data/mock/campaigns';
import { mockPopularModels } from '$lib/data/mock/popular-models';
import { mockUGC } from '$lib/data/mock/ugc';
import { mockVideos } from '$lib/data/mock/videos';
import { getFeaturedBuilds } from '$lib/data/mock/builds';
import { listGuides } from '$lib/server/ghost/posts';
import { mockBrands } from '$lib/data/mock/brands';
import { listFeaturedTestimonials } from '$lib/server/testimonials/repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [collections, staffPicks, clearance, guides, featuredTestimonials] = await Promise.all([
		getCollections(),
		getStaffPickProducts(),
		getClearanceProducts(),
		listGuides(),
		listFeaturedTestimonials(3)
	]);

	return {
		collections,
		staffPicks,
		clearance,
		videos: mockVideos.slice(0, 3),
		ugc: mockUGC,
		builds: getFeaturedBuilds().slice(0, 3),
		guides: guides.slice(0, 3),
		brands: mockBrands.slice(0, 8),
		popularModels: mockPopularModels,
		activeCampaign: getActiveCampaign(),
		featuredTestimonials
	};
};
