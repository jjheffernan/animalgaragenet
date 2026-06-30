import type { Fitment, Money, Product, ProductBrand, ProductType } from '$lib/types/saleor';

/** Saleor `metadata { key value }` entry. */
export interface SaleorMetadataEntry {
	key: string;
	value: string;
}

export interface SaleorAttributeValue {
	name: string;
	slug?: string | null;
	plainText?: string | null;
}

export interface SaleorAttribute {
	attribute: { slug: string; name: string };
	values: SaleorAttributeValue[];
}

export type ProductMetadataFields = Pick<
	Product,
	'productType' | 'tags' | 'compareAtPrice' | 'brand' | 'fitment'
>;

const PRODUCT_TYPES = new Set<ProductType>(['STANDARD', 'GIFT_CARD', 'PART']);

function metadataMap(entries: SaleorMetadataEntry[] | null | undefined): Map<string, string> {
	return new Map((entries ?? []).map(({ key, value }) => [key, value]));
}

function parseJson<T>(raw: string | undefined): T | undefined {
	if (!raw) return undefined;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return undefined;
	}
}

function parseProductType(raw: string | undefined): ProductType | undefined {
	if (!raw) return undefined;
	const upper = raw.toUpperCase() as ProductType;
	return PRODUCT_TYPES.has(upper) ? upper : undefined;
}

function parseTags(raw: string | undefined): string[] | undefined {
	if (!raw) return undefined;
	const json = parseJson<string[]>(raw);
	if (Array.isArray(json)) return json.map(String);
	return raw
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
}

function parseMoney(raw: string | undefined, fallbackCurrency: string): Money | undefined {
	if (!raw) return undefined;
	const json = parseJson<Money>(raw);
	if (json && typeof json.amount === 'number') {
		return { amount: json.amount, currency: json.currency ?? fallbackCurrency };
	}
	const amount = Number(raw);
	if (!Number.isFinite(amount)) return undefined;
	return { amount, currency: fallbackCurrency };
}

function parseBrand(
	meta: Map<string, string>,
	attributes: SaleorAttribute[] | null | undefined
): ProductBrand | undefined {
	const brandJson = parseJson<ProductBrand>(meta.get('brand'));
	if (brandJson?.name && brandJson.slug) {
		return {
			id: brandJson.id ?? `brand-${brandJson.slug}`,
			name: brandJson.name,
			slug: brandJson.slug
		};
	}

	const slug = meta.get('brand_slug');
	const name = meta.get('brand_name');
	if (slug && name) {
		return { id: `brand-${slug}`, name, slug };
	}

	const brandAttr = attributes?.find((a) => a.attribute.slug === 'brand');
	const value = brandAttr?.values[0];
	if (value?.name) {
		const valueSlug = value.slug ?? value.name.toLowerCase().replace(/\s+/g, '-');
		return { id: `brand-${valueSlug}`, name: value.name, slug: valueSlug };
	}

	return undefined;
}

function parseFitment(
	meta: Map<string, string>,
	attributes: SaleorAttribute[] | null | undefined
): Fitment[] | undefined {
	const fromMeta = parseJson<Fitment[]>(meta.get('fitment'));
	if (Array.isArray(fromMeta) && fromMeta.length > 0) {
		return fromMeta.filter(
			(f) => typeof f.year === 'number' && typeof f.make === 'string' && typeof f.model === 'string'
		);
	}

	const fitmentAttr = attributes?.find((a) => a.attribute.slug === 'fitment');
	const plainText = fitmentAttr?.values[0]?.plainText ?? undefined;
	const fromAttr = parseJson<Fitment[]>(plainText);
	if (Array.isArray(fromAttr) && fromAttr.length > 0) {
		return fromAttr.filter(
			(f) => typeof f.year === 'number' && typeof f.make === 'string' && typeof f.model === 'string'
		);
	}

	return undefined;
}

function attributePlainText(
	attributes: SaleorAttribute[] | null | undefined,
	slug: string
): string | undefined {
	return attributes?.find((a) => a.attribute.slug === slug)?.values[0]?.plainText ?? undefined;
}

function attributeValueSlugs(
	attributes: SaleorAttribute[] | null | undefined,
	slug: string
): string[] {
	const attr = attributes?.find((a) => a.attribute.slug === slug);
	return (attr?.values ?? [])
		.map((v) => v.slug ?? v.name.toLowerCase().replace(/\s+/g, '-'))
		.filter(Boolean);
}

/**
 * Parse Saleor product metadata and attributes into internal `Product` domain fields.
 *
 * Expected metadata keys in Saleor dashboard:
 * - `productType` — `PART` | `STANDARD` | `GIFT_CARD`
 * - `tags` — comma-separated or JSON string array
 * - `compareAtPrice` — amount number or JSON `{ amount, currency }`
 * - `fitment` — JSON array of `{ year, make, model, submodel? }`
 * - `brand` — JSON `{ name, slug, id? }` or pair `brand_slug` + `brand_name`
 */
export function mapProductMetadata(
	metadata: SaleorMetadataEntry[] | null | undefined,
	attributes: SaleorAttribute[] | null | undefined,
	fallbackCurrency = 'USD'
): ProductMetadataFields {
	const meta = metadataMap(metadata);

	const productType =
		parseProductType(meta.get('productType')) ??
		parseProductType(attributePlainText(attributes, 'product-type')) ??
		parseProductType(attributePlainText(attributes, 'product_type')) ??
		'STANDARD';

	const tags =
		parseTags(meta.get('tags')) ??
		(attributeValueSlugs(attributes, 'tags').length > 0
			? attributeValueSlugs(attributes, 'tags')
			: undefined);

	const compareAtPrice =
		parseMoney(meta.get('compareAtPrice'), fallbackCurrency) ??
		parseMoney(attributePlainText(attributes, 'compare-at-price'), fallbackCurrency);

	const brand = parseBrand(meta, attributes);
	const fitment = parseFitment(meta, attributes);

	return {
		productType,
		...(tags?.length ? { tags } : {}),
		...(compareAtPrice ? { compareAtPrice } : {}),
		...(brand ? { brand } : {}),
		...(fitment?.length ? { fitment } : {})
	};
}
