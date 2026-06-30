import { getActiveDeals as getMockActiveDeals } from '$lib/data/mock/deals';
import { getHeroCampaign, getUpcomingCampaign } from '$lib/data/mock/campaigns';
import { createAdminClient } from '$lib/server/supabase/admin';
import type { Campaign, Deal } from '$lib/types/domain';

const mockStore: Deal[] = [];

function rowToDeal(row: Record<string, unknown>): Deal {
	const productIds = Array.isArray(row.product_ids)
		? row.product_ids.map((id) => String(id))
		: [];

	return {
		id: String(row.id),
		title: String(row.title),
		description: String(row.description),
		discountLabel: String(row.discount_label),
		productIds,
		collectionId: row.collection_id ? String(row.collection_id) : undefined,
		startsAt: row.starts_at ? String(row.starts_at) : undefined,
		expiresAt: row.expires_at ? String(row.expires_at) : undefined,
		active: Boolean(row.active)
	};
}

/** Scheduled window filter — shared by Supabase rows and mock fallback. */
export function isDealInSchedule(deal: Deal, now = new Date()): boolean {
	if (!deal.active) return false;
	if (deal.startsAt && new Date(deal.startsAt) > now) return false;
	if (deal.expiresAt && new Date(deal.expiresAt) <= now) return false;
	return true;
}

function filterScheduled(deals: Deal[], now = new Date()): Deal[] {
	return deals.filter((deal) => isDealInSchedule(deal, now));
}

function dealToCampaign(deal: Deal): Campaign {
	return {
		id: deal.id,
		name: deal.title,
		slug: deal.id,
		description: deal.description,
		heroImage: '',
		availableFrom: deal.startsAt ?? new Date().toISOString(),
		availableUntil: deal.expiresAt,
		active: deal.active
	};
}

async function listScheduledDealsRaw(now = new Date()): Promise<Deal[]> {
	const admin = createAdminClient();
	if (!admin) {
		const source = mockStore.length > 0 ? mockStore : getMockActiveDeals();
		return source.filter((deal) => deal.active);
	}

	const { data, error } = await admin
		.from('pit_lane_deals')
		.select('*')
		.eq('active', true)
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: false });

	if (error || !data) {
		return getMockActiveDeals().filter((deal) => deal.active);
	}

	return data.map(rowToDeal);
}

/** Upcoming drop countdown on homepage when CMS campaign section is inactive. */
export async function getUpcomingDropCampaign(now = new Date()): Promise<Campaign | undefined> {
	const deals = await listScheduledDealsRaw(now);
	const upcoming = deals
		.filter((deal) => deal.startsAt && new Date(deal.startsAt) > now)
		.sort(
			(a, b) =>
				new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime()
		)[0];

	if (upcoming) return dealToCampaign(upcoming);

	return getUpcomingCampaign() ?? getHeroCampaign();
}

// @inspiration-scaffold: intentional — Pit Lane deals CMS; see docs/plans/active/inspiration-polish-tracker.md#IP-030
export async function listActiveDeals(now = new Date()): Promise<Deal[]> {
	const admin = createAdminClient();
	if (!admin) {
		const source = mockStore.length > 0 ? mockStore : getMockActiveDeals();
		return filterScheduled(source, now);
	}

	const { data, error } = await admin
		.from('pit_lane_deals')
		.select('*')
		.eq('active', true)
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: false });

	if (error || !data) {
		return filterScheduled(getMockActiveDeals(), now);
	}

	return filterScheduled(data.map(rowToDeal), now);
}

export async function countActiveDeals(now = new Date()): Promise<number> {
	return (await listActiveDeals(now)).length;
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.length = 0;
}

/** Test helper — seed in-memory deals when Supabase is unset */
export function _seedMockDealsForTests(deals: Deal[]): void {
	mockStore.length = 0;
	mockStore.push(...deals);
}
