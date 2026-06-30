export { locale } from './stores/locale.svelte';
export { cart } from './stores/cart.svelte';
export { garage } from './stores/garage.svelte';
export { garageXp } from './stores/garage-xp.svelte';
export { recentlyViewed } from './stores/recently-viewed.svelte';
export { search } from './stores/search.svelte';
export { promo } from './stores/promo.svelte';

export type { Product, Collection } from './types/saleor';
export type { LocaleCode } from './types/locale';
export type {
	PartCategory,
	SavedVehicle,
	PopularModel,
	BuildThread,
	Guide,
	BlogPost,
	Brand,
	Video,
	UGCItem,
	Deal,
	Campaign,
	Event
} from './types/domain';

export { mockProducts, getProductBySlug, getStaffPickProducts, getClearanceProducts } from './data/mock-products';
export { mockCollections, getCollectionBySlug } from './data/mock-collections';
export { mockParts, getPartBySlug, getPartsByCategory } from './data/mock-parts';
export { mockPartCategories } from './data/mock-part-categories';
export { mockPopularModels } from './data/mock-popular-models';
export { mockBuilds, getBuildBySlug, getFeaturedBuilds } from './data/mock-builds';
export { mockGuides, getGuideBySlug } from './data/mock-guides';
export { mockBlogPosts, getBlogPostBySlug } from './data/mock-blog';
export { mockBrands, getBrandBySlug } from './data/mock-brands';
export { mockVideos } from './data/mock-videos';
export { mockUGC, mockUGC as mockUgc } from './data/mock-ugc';
export { mockDeals, getActiveDeals, getActiveDealCount } from './data/mock-deals';
export { mockCampaigns, getHeroCampaign, getActiveCampaign } from './data/mock-campaigns';
export { mockLocales } from './data/mock-locales';
export { mockEvents, getUpcomingEvents } from './data/mock-events';
