import { describe, expect, it } from 'vitest';
import { load } from '../../src/routes/parts/+page.server';
import type { PageServerLoadEvent } from '../../src/routes/parts/$types';

function partsEvent(query = ''): PageServerLoadEvent {
	return {
		url: new URL(`http://localhost/parts${query ? `?${query}` : ''}`)
	} as PageServerLoadEvent;
}

describe('parts/+page.server load', () => {
	it('returns paginated products with list view from the URL', async () => {
		const data = await load(partsEvent('view=list&perPage=20'));

		if (!data) throw new Error('parts load returned void');
		expect(data.view).toBe('list');
		expect(data.pagination.perPage).toBe(20);
		expect(data.products.length).toBeLessThanOrEqual(20);
	});
});
