export interface Money {
	amount: number;
	currency: string;
}

export interface ProductPricing {
	priceRange: {
		start: Money;
		stop: Money;
	};
}

export interface ProductMedia {
	id: string;
	url: string;
	alt: string;
	type: 'IMAGE' | 'VIDEO';
}

export interface ProductVariant {
	id: string;
	name: string;
	sku: string;
	pricing: { price: Money };
}

export interface ProductCategory {
	id: string;
	name: string;
	slug: string;
}

export interface Product {
	id: string;
	name: string;
	slug: string;
	description: string;
	thumbnail: ProductMedia | null;
	media: ProductMedia[];
	pricing: ProductPricing;
	variants: ProductVariant[];
	category: ProductCategory | null;
	isAvailableForPurchase: boolean;
}

export interface Collection {
	id: string;
	name: string;
	slug: string;
	description: string;
	backgroundImage: { url: string; alt: string } | null;
	products: Product[];
}
