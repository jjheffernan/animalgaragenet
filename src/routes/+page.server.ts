import {
	getFeaturedPublicBuilds,
	listPublicBuilds,
	getPublicBuildBySlug
} from '$lib/server/builds/public';
import { mockUGC } from '$lib/data/mock/ugc';
import { mockVideos } from '$lib/data/mock/videos';
import { mockBrands } from '$lib/data/mock/brands';
import { mockPopularModels } from '$lib/data/mock/popular-models';
import { getActiveCampaign } from '$lib/data/mock/campaigns';
import {
	getClearanceProducts,
	getCollections,
	getStaffPickProducts
} from '$lib/server/catalog/collections';
import { listGuides } from '$lib/server/ghost/posts';
import { createAdminClient } from '$lib/server/supabase/admin';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '$lib/server/testimonials/repository';
import { testimonialsToUgcItems } from '$lib/server/testimonials/to-ugc';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [collections, staffPicks, clearance, guides, featuredTestimonials, approvedTestimonials] =
		await Promise.all([
			getCollections(),
			getStaffPickProducts(),
			getClearanceProducts(),
			listGuides(),
			listFeaturedTestimonials(3),
			listApprovedTestimonials(12)
		]);

	const ugcFromTestimonials = testimonialsToUgcItems(approvedTestimonials);
	const supabaseConfigured = createAdminClient() !== null;
	const ugc = supabaseConfigured && ugcFromTestimonials.length > 0 ? ugcFromTestimonials : mockUGC;

	return {
		collections,
		staffPicks,
		clearance,
		videos: mockVideos.slice(0, 3),
		ugc,
		builds: (await getFeaturedPublicBuilds(3)).slice(0, 3),
		guides: guides.slice(0, 3),
		brands: mockBrands.slice(0, 8),
		popularModels: mockPopularModels,
		activeCampaign: getActiveCampaign(),
		featuredTestimonials
	};
};
