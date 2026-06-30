import type { Brand, BuildThread, Video } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { getActiveDeals } from './mock-deals';
import { getAllCatalogProducts } from './mock-parts';
import { getGiftCardProducts, getProductById, mockProducts } from './mock-products';

export const SHOP_CATEGORIES = [
	'ALL',
	'TEES',
	'SWEATSHIRTS',
	'JACKETS',
	'HEADWEAR',
	'ACCESSORIES',
	'HOME',
	'AUTO',
	'GIFT CARDS'
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export function filterShopProducts(category: ShopCategory): Product[] {
	const giftCards = getGiftCardProducts();
	const all = [...mockProducts, ...giftCards];
	if (category === 'ALL') return all;
	if (category === 'GIFT CARDS') return giftCards;
	if (category === 'HEADWEAR') return all.filter((p) => p.category?.slug === 'headwear');
	if (category === 'ACCESSORIES')
		return all.filter((p) => ['accessories', 'stickers'].includes(p.category?.slug ?? ''));
	if (category === 'HOME')
		return all.filter((p) => ['posters', 'home', 'accessories'].includes(p.category?.slug ?? ''));
	if (category === 'TEES')
		return all.filter(
			(p) => p.name.toLowerCase().includes('tee') || p.category?.slug === 'apparel'
		);
	if (category === 'SWEATSHIRTS')
		return all.filter(
			(p) =>
				p.name.toLowerCase().includes('hoodie') ||
				p.name.toLowerCase().includes('sweat') ||
				p.name.toLowerCase().includes('crew')
		);
	if (category === 'JACKETS') return all.filter((p) => p.name.toLowerCase().includes('jacket'));
	if (category === 'AUTO')
		return all.filter(
			(p) =>
				p.category?.slug === 'auto' ||
				p.tags?.includes('auto') ||
				p.name.toLowerCase().includes('air freshener') ||
				p.name.toLowerCase().includes('license')
		);
	return all;
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
	const catalog = getAllCatalogProducts();
	return catalog.filter((p) => p.id !== product.id).slice(0, count);
}

export function getProductsForBuild(build: BuildThread): Product[] {
	return build.linkedProductIds
		.map((id) => getProductById(id))
		.filter((p): p is Product => p !== undefined);
}

export function getProductsForBrand(brand: Brand): Product[] {
	const catalog = getAllCatalogProducts();
	return catalog.filter((p) => p.brand?.slug === brand.slug).slice(0, 8);
}

export function getProductsForVideo(video: Video): Product[] {
	return video.linkedProductIds
		.map((id) => getProductById(id))
		.filter((p): p is Product => p !== undefined);
}

export function getDealProducts(): Product[] {
	const deals = getActiveDeals();
	if (deals.length === 0) return mockProducts.filter((p) => p.tags?.includes('clearance')).slice(0, 8);
	const ids = new Set(deals.flatMap((d) => d.productIds));
	return [...ids]
		.map((id) => getProductById(id))
		.filter((p): p is Product => p !== undefined);
}
