import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests,
	_seedMockDealsForTests,
	countActiveDeals,
	isDealInSchedule,
	listActiveDeals
} from './repository';
import type { Deal } from '$lib/types/domain';

const baseDeal: Deal = {
	id: 'deal-1',
	title: 'Test Deal',
	description: 'Desc',
	discountLabel: '10% OFF',
	productIds: ['p1'],
	active: true
};

describe('deals repository (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('isDealInSchedule respects startsAt and expiresAt', () => {
		const now = new Date('2026-07-01T12:00:00Z');

		expect(
			isDealInSchedule(
				{ ...baseDeal, startsAt: '2026-07-02T00:00:00Z', expiresAt: '2026-07-31T00:00:00Z' },
				now
			)
		).toBe(false);

		expect(
			isDealInSchedule(
				{ ...baseDeal, startsAt: '2026-06-01T00:00:00Z', expiresAt: '2026-06-30T00:00:00Z' },
				now
			)
		).toBe(false);

		expect(
			isDealInSchedule(
				{ ...baseDeal, startsAt: '2026-06-01T00:00:00Z', expiresAt: '2026-07-31T00:00:00Z' },
				now
			)
		).toBe(true);
	});

	it('listActiveDeals filters seeded mock deals by schedule', async () => {
		_seedMockDealsForTests([
			{ ...baseDeal, id: 'future', startsAt: '2099-01-01T00:00:00Z' },
			{ ...baseDeal, id: 'live', startsAt: '2020-01-01T00:00:00Z' }
		]);

		const deals = await listActiveDeals(new Date('2026-07-01T12:00:00Z'));
		expect(deals.map((deal) => deal.id)).toEqual(['live']);
		expect(await countActiveDeals(new Date('2026-07-01T12:00:00Z'))).toBe(1);
	});

	it('falls back to static mock deals when store is empty', async () => {
		const deals = await listActiveDeals();
		expect(deals.length).toBeGreaterThan(0);
	});
});
