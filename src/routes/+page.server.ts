import { getFeaturedPublicBuilds } from '$lib/server/builds/public';
import { mockUGC } from '$lib/data/mock/ugc';
import { mockBrands } from '$lib/data/mock/brands';
import { mockPopularModels } from '$lib/data/mock/popular-models';
import { getUpcomingDropCampaign } from '$lib/server/deals/repository';
import {
	getClearanceProducts,
	getCollections,
	getStaffPickProducts
} from '$lib/server/catalog/collections';
import { listGuides } from '$lib/server/ghost/posts';
import { createAdminClient } from '$lib/server/supabase/admin';
import { enrichTestimonialsWithPhotos } from '$lib/server/media/repository';
import { getDefaultHeroSection, getHomepageFeaturedSections } from '$lib/server/featured-sections/repository';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '$lib/server/testimonials/repository';
import { testimonialsToUgcItems } from '$lib/server/testimonials/to-ugc';
import { loadHomepageVideos } from '$lib/server/youtube/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [collections, staffPicks, clearance, guides, approvedTestimonials, featuredSections, videos, activeCampaign] =
		await Promise.all([
			getCollections(),
			getStaffPickProducts(),
			getClearanceProducts(),
			listGuides(),
			listApprovedTestimonials(12),
			getHomepageFeaturedSections(),
			loadHomepageVideos(3),
			getUpcomingDropCampaign()
		]);

	const [featuredTestimonials, enrichedApproved] = await Promise.all([
		enrichTestimonialsWithPhotos(await listFeaturedTestimonials(3)),
		enrichTestimonialsWithPhotos(approvedTestimonials)
	]);

	const ugcFromTestimonials = testimonialsToUgcItems(enrichedApproved);
	const supabaseConfigured = createAdminClient() !== null;
	const ugc = supabaseConfigured && ugcFromTestimonials.length > 0 ? ugcFromTestimonials : mockUGC;

	return {
		collections,
		staffPicks,
		clearance,
		videos,
		ugc,
		builds: (await getFeaturedPublicBuilds(3)).slice(0, 3),
		guides: guides.slice(0, 3),
		brands: mockBrands.slice(0, 8),
		popularModels: mockPopularModels,
		activeCampaign: activeCampaign ?? null,
		featuredTestimonials,
		heroSection: featuredSections.hero ?? getDefaultHeroSection(),
		ugcSection: featuredSections.ugc,
		campaignSection: featuredSections.campaign
	};
};
