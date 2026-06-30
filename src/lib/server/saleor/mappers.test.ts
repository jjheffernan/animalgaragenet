import { describe, expect, it } from 'vitest';
import {
	mapProduct,
	mapProductListNode,
	type SaleorProductDetailNode,
	type SaleorProductListNode
} from './mappers';

const listNodeFixture: SaleorProductListNode = {
	id: 'UHJvZHVjdDox',
	name: 'AG Logo Tee',
	slug: 'ag-logo-tee',
	description: 'Classic garage tee.',
	thumbnail: { url: 'https://cdn.example.com/tee.jpg', alt: 'AG Logo Tee' },
	pricing: {
		priceRange: {
			start: { gross: { amount: 29.99, currency: 'USD' } }
		}
	},
	category: { id: 'Q2F0ZWdvcnk6MQ==', name: 'Apparel', slug: 'apparel' },
	isAvailableForPurchase: true
};

const detailNodeFixture: SaleorProductDetailNode = {
	...listNodeFixture,
	pricing: {
		priceRange: {
			start: { gross: { amount: 29.99, currency: 'USD' } },
			stop: { gross: { amount: 34.99, currency: 'USD' } }
		}
	},
	media: [
		{
			id: 'media-1',
			url: 'https://cdn.example.com/tee-front.jpg',
			alt: 'Front view',
			type: 'IMAGE'
		},
		{
			id: 'media-2',
			url: 'https://cdn.example.com/tee-video.mp4',
			alt: 'Product video',
			type: 'VIDEO'
		}
	],
	variants: [
		{
			id: 'variant-s',
			name: 'Small',
			sku: 'AG-TEE-S',
			pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } }
		},
		{
			id: 'variant-m',
			name: 'Medium',
			sku: 'AG-TEE-M',
			pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } }
		}
	]
};

describe('mapProductListNode', () => {
	it('maps core list fields and flattens gross pricing', () => {
		const product = mapProductListNode(listNodeFixture);

		expect(product.id).toBe('UHJvZHVjdDox');
		expect(product.slug).toBe('ag-logo-tee');
		expect(product.pricing.priceRange.start).toEqual({ amount: 29.99, currency: 'USD' });
		expect(product.pricing.priceRange.stop).toEqual({ amount: 29.99, currency: 'USD' });
		expect(product.category).toEqual({ id: 'Q2F0ZWdvcnk6MQ==', name: 'Apparel', slug: 'apparel' });
		expect(product.isAvailableForPurchase).toBe(true);
		expect(product.productType).toBe('STANDARD');
		expect(product.variants).toEqual([]);
	});

	it('maps default variant on list nodes when present', () => {
		const product = mapProductListNode({
			...listNodeFixture,
			variants: [
				{
					id: 'variant-list',
					name: 'Default',
					sku: 'SKU-1',
					pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } }
				}
			]
		});

		expect(product.variants).toHaveLength(1);
		expect(product.variants[0].id).toBe('variant-list');
	});

	it('uses thumbnail as media when no media array is present', () => {
		const product = mapProductListNode(listNodeFixture);

		expect(product.thumbnail?.url).toBe('https://cdn.example.com/tee.jpg');
		expect(product.media).toHaveLength(1);
		expect(product.media[0].type).toBe('IMAGE');
	});
});

describe('mapProduct', () => {
	it('maps variants, media types, and price range stop', () => {
		const product = mapProduct(detailNodeFixture);

		expect(product.variants).toHaveLength(2);
		expect(product.variants[0]).toMatchObject({
			id: 'variant-s',
			sku: 'AG-TEE-S',
			pricing: { price: { amount: 29.99, currency: 'USD' } }
		});
		expect(product.pricing.priceRange.stop).toEqual({ amount: 34.99, currency: 'USD' });
		expect(product.media).toHaveLength(2);
		expect(product.media[1].type).toBe('VIDEO');
	});

	it('defaults missing optional fields safely', () => {
		const minimal: SaleorProductDetailNode = {
			id: 'UHJvZHVjdDoy',
			name: 'Sticker Pack',
			slug: 'sticker-pack'
		};

		const product = mapProduct(minimal);

		expect(product.description).toBe('');
		expect(product.thumbnail).toBeNull();
		expect(product.media).toEqual([]);
		expect(product.variants).toEqual([]);
		expect(product.category).toBeNull();
		expect(product.isAvailableForPurchase).toBe(true);
		expect(product.pricing.priceRange.start).toEqual({ amount: 0, currency: 'USD' });
	});
});
