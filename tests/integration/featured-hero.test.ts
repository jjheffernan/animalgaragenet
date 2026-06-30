import { isActionFailure } from '@sveltejs/kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests
} from '$lib/server/featured-sections/repository';
import { actions } from '../../src/routes/admin/featured/+page.server';
import { load as homepageLoad } from '../../src/routes/+page.server';
import type { RequestEvent } from '../../src/routes/admin/featured/$types';

function heroRequest(fields: Record<string, string>): RequestEvent {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request('http://localhost/admin/featured', {
		method: 'POST',
		body: formData
	});
	return { request } as RequestEvent;
}

describe('featured hero CMS', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('saveHero rejects missing headline', async () => {
		const result = await actions.saveHero(heroRequest({ subheadline: 'Test' }));
		expect(isActionFailure(result)).toBe(true);
	});

	it('saveHero persists hero and homepage load returns saved content', async () => {
		const result = await actions.saveHero(
			heroRequest({
				headline: 'Fresh Drop',
				subheadline: 'Limited merch run',
				image: 'https://example.com/hero.jpg',
				ctaLabel: 'Shop Now',
				ctaHref: '/shop'
			})
		);
		expect(result).toMatchObject({ saved: true });

		const homepage = await homepageLoad({} as Parameters<typeof homepageLoad>[0]);
		expect(homepage?.heroSection.content.headline).toBe('Fresh Drop');
		expect(homepage?.heroSection.content.ctaLabel).toBe('Shop Now');
	});

	it('homepage load falls back to default hero when nothing saved', async () => {
		const homepage = await homepageLoad({} as Parameters<typeof homepageLoad>[0]);
		expect(homepage?.heroSection.sectionKey).toBe('hero');
		expect(homepage?.heroSection.content.headline).toBeTruthy();
	});
});
