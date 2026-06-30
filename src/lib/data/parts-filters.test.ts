import { describe, expect, it } from 'vitest';
import { mockParts } from '$lib/data/mock/parts';
import { filterPartsProducts, formatPartsFilterLabel, parsePartsFilters } from './parts-filters';

describe('parsePartsFilters', () => {
	it('reads individual vehicle params', () => {
		const url = new URL('http://localhost/parts?year=2018&make=Honda&model=Civic&submodel=Si');
		expect(parsePartsFilters(url)).toEqual({
			build: undefined,
			brand: undefined,
			year: '2018',
			make: 'Honda',
			model: 'Civic',
			submodel: 'Si'
		});
	});

	it('parses legacy ymm param', () => {
		const url = new URL('http://localhost/parts?ymm=2018-honda-civic-si');
		expect(parsePartsFilters(url)).toMatchObject({
			year: '2018',
			make: 'Honda',
			model: 'Civic',
			submodel: 'Si'
		});
	});
});

describe('filterPartsProducts', () => {
	it('filters by brand slug', () => {
		const filtered = filterPartsProducts(mockParts, { brand: 'enkei' });
		expect(filtered.length).toBeGreaterThan(0);
		expect(filtered.every((p) => p.brand?.slug === 'enkei')).toBe(true);
	});

	it('filters by build type tag', () => {
		const swapped = filterPartsProducts(mockParts, { build: 'swapped' });
		expect(swapped.length).toBeGreaterThan(0);
		expect(swapped.every((p) => p.tags?.includes('build-swapped'))).toBe(true);
	});

	it('filters by vehicle fitment', () => {
		const civic = filterPartsProducts(mockParts, { make: 'Honda', model: 'Civic' });
		expect(civic.length).toBeGreaterThan(0);
		expect(
			civic.every((p) => p.fitment?.some((f) => f.make === 'Honda' && f.model === 'Civic'))
		).toBe(true);
	});
});

describe('formatPartsFilterLabel', () => {
	it('combines vehicle and brand labels', () => {
		const label = formatPartsFilterLabel({
			year: '2018',
			make: 'Honda',
			model: 'Civic',
			brand: 'enkei',
			build: 'stock'
		});
		expect(label).toContain('2018 Honda Civic');
		expect(label).toContain('Enkei');
		expect(label).toContain('Bone Stock');
	});
});
