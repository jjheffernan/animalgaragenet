import { describe, expect, it } from 'vitest';
import { searchCatalog } from '$lib/server/catalog/search';

describe('searchCatalog', () => {
	it('returns empty results for blank query', async () => {
		const results = await searchCatalog('   ');
		expect(results).toEqual({ products: [], parts: [], builds: [], guides: [] });
	});

	it('searches merged mock catalog server-side', async () => {
		const results = await searchCatalog('civic');
		expect(results.products.length + results.parts.length + results.builds.length).toBeGreaterThan(
			0
		);
	});
});
