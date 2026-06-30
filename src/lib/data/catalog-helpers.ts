import type { Brand, BuildThread, Video } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { getActiveDeals } from './mock/deals';
import { getAllCatalogProducts } from './mock/parts';
import { getGiftCardProducts, mockProducts } from './mock/products';

function catalogById(): Map<string, Product> {
	return new Map(getAllCatalogProducts().map((p) => [p.id, p]));
}

export type CatalogKind = 'MERCH' | 'PARTS';

export const CATALOG_KIND_LABELS: Record<CatalogKind, string> = {
	MERCH: 'Merch',
	PARTS: 'Part'
};

export function getCatalogKind(product: Product): CatalogKind {
	return product.productType === 'PART' ? 'PARTS' : 'MERCH';
}

export function isPartProduct(product: Product): boolean {
	return product.productType === 'PART';
}

export function isMerchProduct(product: Product): boolean {
	return product.productType !== 'PART';
}

export function getProductPath(product: Product): string {
	if (product.productType === 'PART') {
		const categorySlug = product.category?.slug ?? 'parts';
		return `/parts/${categorySlug}/${product.slug}`;
	}
	return `/shop/${product.slug}`;
}

export function getCatalogProductById(id: string): Product | undefined {
	return catalogById().get(id);
}

/** First purchasable variant for quick-add from listing cards (Saleor + mock). */
export function getDefaultVariantId(product: Product): string | undefined {
	return product.variants[0]?.id;
}

export function filterByCatalogKind(products: Product[], kind: CatalogKind): Product[] {
	return products.filter((p) => getCatalogKind(p) === kind);
}

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

/** Mock shop filter hierarchy — parent group labels for ribbon grouping. */
export const SHOP_CATEGORY_GROUPS: Record<Exclude<ShopCategory, 'ALL'>, string> = {
	TEES: 'Apparel',
	SWEATSHIRTS: 'Apparel',
	JACKETS: 'Apparel',
	HEADWEAR: 'Apparel',
	ACCESSORIES: 'Lifestyle',
	HOME: 'Lifestyle',
	AUTO: 'Lifestyle',
	'GIFT CARDS': 'Gift Cards'
};

/** Resolve mock taxonomy group for a category label (e.g. `TEES` → `Apparel`). */
export function getShopCategoryGroup(label: string): string | undefined {
	if (label === 'ALL') return undefined;
	const normalized = label.toUpperCase() as Exclude<ShopCategory, 'ALL'>;
	return SHOP_CATEGORY_GROUPS[normalized];
}

export function filterProductsByShopCategory(
	products: Product[],
	category: ShopCategory,
	giftCardProducts?: Product[]
): Product[] {
	const giftCards = giftCardProducts ?? products.filter((p) => p.productType === 'GIFT_CARD');
	const all = products;
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

export function filterShopProducts(category: ShopCategory): Product[] {
	return filterProductsByShopCategory(mockProducts, category, getGiftCardProducts());
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
	const kind = getCatalogKind(product);
	const catalog = getAllCatalogProducts();
	return catalog.filter((p) => p.id !== product.id && getCatalogKind(p) === kind).slice(0, count);
}

export function getProductsForBuild(build: BuildThread): Product[] {
	const byId = catalogById();
	return build.linkedProductIds
		.map((id) => byId.get(id))
		.filter((p): p is Product => p !== undefined);
}

export function getProductsForBrand(brand: Brand): Product[] {
	const catalog = getAllCatalogProducts();
	return catalog.filter((p) => p.brand?.slug === brand.slug);
}

export function getProductsForVideo(video: Video): Product[] {
	const byId = catalogById();
	return video.linkedProductIds
		.map((id) => byId.get(id))
		.filter((p): p is Product => p !== undefined);
}

export function getDealProducts(): Product[] {
	const deals = getActiveDeals();
	if (deals.length === 0)
		return mockProducts.filter((p) => p.tags?.includes('clearance')).slice(0, 8);
	const ids = new Set(deals.flatMap((d) => d.productIds));
	return [...ids]
		.map((id) => getCatalogProductById(id))
		.filter((p): p is Product => p !== undefined);
}
