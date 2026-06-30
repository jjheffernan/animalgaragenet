import { describe, expect, it } from 'vitest';
import { mapProductMetadata } from './metadata';

describe('mapProductMetadata', () => {
	it('parses metadata keys for parts fields', () => {
		const fields = mapProductMetadata(
			[
				{ key: 'productType', value: 'PART' },
				{ key: 'tags', value: 'staff-pick,clearance' },
				{ key: 'compareAtPrice', value: '349' },
				{
					key: 'brand',
					value: JSON.stringify({ id: 'brand-enkei', name: 'Enkei', slug: 'enkei' })
				},
				{
					key: 'fitment',
					value: JSON.stringify([
						{ year: 2018, make: 'Honda', model: 'Civic', submodel: 'Si' }
					])
				}
			],
			null,
			'USD'
		);

		expect(fields.productType).toBe('PART');
		expect(fields.tags).toEqual(['staff-pick', 'clearance']);
		expect(fields.compareAtPrice).toEqual({ amount: 349, currency: 'USD' });
		expect(fields.brand).toEqual({ id: 'brand-enkei', name: 'Enkei', slug: 'enkei' });
		expect(fields.fitment).toEqual([{ year: 2018, make: 'Honda', model: 'Civic', submodel: 'Si' }]);
	});

	it('falls back to attribute slugs when metadata is absent', () => {
		const fields = mapProductMetadata(
			null,
			[
				{
					attribute: { slug: 'product-type', name: 'Product Type' },
					values: [{ name: 'Part', slug: 'part', plainText: 'PART' }]
				},
				{
					attribute: { slug: 'brand', name: 'Brand' },
					values: [{ name: 'Borla', slug: 'borla' }]
				}
			],
			'USD'
		);

		expect(fields.productType).toBe('PART');
		expect(fields.brand).toEqual({ id: 'brand-borla', name: 'Borla', slug: 'borla' });
	});

	it('defaults productType to STANDARD', () => {
		expect(mapProductMetadata(null, null).productType).toBe('STANDARD');
	});
});
