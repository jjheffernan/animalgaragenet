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
	excerpt: string;
	content: string;
	category: string;
	heroImage: string;
	readTimeMinutes: number;
}

export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
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
