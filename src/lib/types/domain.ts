export interface PartCategory {
	id: string;
	name: string;
	slug: string;
	description?: string;
	imageUrl?: string;
	children?: PartCategory[];
}

export interface VehicleMake {
	make: string;
	models: VehicleModel[];
}

export interface VehicleModel {
	model: string;
	submodels: string[];
}

export interface VehicleYearRange {
	min: number;
	max: number;
}

export interface SavedVehicle {
	id: string;
	year: number;
	make: string;
	model: string;
	submodel?: string;
	nickname?: string;
}

export interface PopularModel {
	id: string;
	name: string;
	slug: string;
	make: string;
	model: string;
	heroImage: string;
	description: string;
}

export interface BuildThread {
	id: string;
	slug: string;
	title: string;
	year: number;
	make: string;
	model: string;
	submodel?: string;
	photos: string[];
	modList: string[];
	featured: boolean;
	description: string;
	linkedProductIds: string[];
}

export interface Guide {
	id: string;
	slug: string;
	title: string;
	/** Ghost `meta_title` when set; page title / OG use this over `title`. */
	metaTitle?: string;
	excerpt: string;
	/** Ghost `meta_description` when set; meta / OG use this over `excerpt`. */
	metaDescription?: string;
	/** Plain-text / mock markdown body (fallback when Ghost is unset). */
	content: string;
	/** Sanitized Ghost HTML body when loaded from CMS. */
	html?: string;
	category: string;
	/** Ghost tag slug for `category` (mock derives from label). */
	categorySlug?: string;
	/** Additional Ghost tag slugs beyond the primary category. */
	topicSlugs?: string[];
	heroImage: string;
	readTimeMinutes: number;
}

export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	/** Ghost `meta_title` when set; page title / OG use this over `title`. */
	metaTitle?: string;
	excerpt: string;
	/** Ghost `meta_description` when set; meta / OG use this over `excerpt`. */
	metaDescription?: string;
	/** Plain-text mock body (fallback when Ghost is unset). */
	content: string;
	/** Sanitized Ghost HTML body when loaded from CMS. */
	html?: string;
	author: string;
	publishedAt: string;
	heroImage: string;
	tags: string[];
}

export interface Brand {
	id: string;
	name: string;
	slug: string;
	logoUrl: string;
	description: string;
	heroImage?: string;
}

export interface Video {
	id: string;
	youtubeId: string;
	title: string;
	description: string;
	longDescription?: string;
	publishedAt?: string;
	thumbnail: string;
	duration: string;
	linkedProductIds: string[];
}

export interface UGCItem {
	id: string;
	image: string;
	caption: string;
	handle: string;
}

export interface Deal {
	id: string;
	title: string;
	description: string;
	discountLabel: string;
	productIds: string[];
	collectionId?: string;
	startsAt?: string;
	expiresAt?: string;
	active: boolean;
}

export interface PromoBanner {
	id: string;
	message: string;
	link?: string;
	linkLabel?: string;
	endDate?: string;
}

export interface Campaign {
	id: string;
	name: string;
	slug: string;
	description: string;
	heroImage: string;
	availableFrom: string;
	availableUntil?: string;
	active: boolean;
}

export interface CountryLocale {
	code: string;
	country: string;
	currency: string;
	label: string;
	flag: string;
}

export interface Event {
	id: string;
	slug: string;
	title: string;
	description: string;
	location: string;
	startDate: string;
	endDate?: string;
	imageUrl: string;
	/** Primary host label (e.g. "Animal Garage" or "Animal Garage × Enkei"). */
	host?: string;
	/** Animal Garage–produced / hosted event. */
	isHosted?: boolean;
	featured?: boolean;
	tags?: string[];
	/** RSVP or ticket URL. */
	rsvpUrl?: string;
	/** General external link (event page, charity partner, etc.). */
	externalUrl?: string;
}

export interface CartItem {
	productId: string;
	variantId: string;
	quantity: number;
}

export interface GarageXpAction {
	id: string;
	label: string;
	xp: number;
}

export interface GarageLevel {
	level: number;
	title: string;
	xpRequired: number;
	perks: string[];
}
