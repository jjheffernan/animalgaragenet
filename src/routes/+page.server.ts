import { getFeaturedPublicBuilds } from '#lib/server/builds/public.ts';
import { mockUGC } from '#lib/data/mock/ugc.ts';
import { mockBrands } from '#lib/data/mock/brands.ts';
import { mockPopularModels } from '#lib/data/mock/popular-models.ts';
import { getUpcomingDropCampaign } from '#lib/server/deals/repository.ts';
import {
	getClearanceProducts,
	getCollections,
	getStaffPickProducts
} from '#lib/server/catalog/collections.ts';
import { listGuides } from '#lib/server/ghost/posts.ts';
import { createAdminClient } from '#lib/server/supabase/admin.ts';
import { enrichTestimonialsWithPhotos } from '#lib/server/media/repository.ts';
import {
	getDefaultHeroSection,
	getHomepageFeaturedSections
} from '#lib/server/featured-sections/repository.ts';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '#lib/server/testimonials/repository.ts';
import { testimonialsToUgcItems } from '#lib/server/testimonials/to-ugc.ts';
import { loadHomepageVideos } from '#lib/server/youtube/public.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [
		collections,
		staffPicks,
		clearance,
		guides,
		approvedTestimonials,
		featuredSections,
		videos,
		activeCampaign
	] = await Promise.all([
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
