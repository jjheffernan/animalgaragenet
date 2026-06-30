import type { Campaign } from '$lib/types/domain';

export const mockCampaigns: Campaign[] = [
	{
		id: 'camp-1',
		name: 'Redline Drop 2026',
		slug: 'redline-drop-2026',
		description: 'Limited edition Redline collection — when it drops, move fast.',
		heroImage: 'https://picsum.photos/seed/agcamp-redline/1920/1080',
		availableFrom: '2026-07-01T12:00:00Z',
		availableUntil: '2026-07-15T23:59:59Z',
		active: true
	},
	{
		id: 'camp-2',
		name: 'Gymkhana Collection',
		slug: 'gymkhana-collection',
		description: 'Censor bars and tire smoke — Gymkhana energy in every piece.',
		heroImage: 'https://picsum.photos/seed/agcamp-gymkhana/1920/1080',
		availableFrom: '2026-08-01T12:00:00Z',
		active: true
	},
	{
		id: 'camp-3',
		name: 'Track Day Kit Drop',
		slug: 'track-day-kit',
		description: 'Everything you need for your next HPDE — bundled and ready.',
		heroImage: 'https://picsum.photos/seed/agcamp-track/1920/1080',
		availableFrom: '2026-06-01T12:00:00Z',
		availableUntil: '2026-06-30T23:59:59Z',
		active: false
	}
];

export function getActiveCampaign(): Campaign | undefined {
	const now = Date.now();
	return mockCampaigns.find((c) => {
		if (!c.active) return false;
		const from = new Date(c.availableFrom).getTime();
		const until = c.availableUntil ? new Date(c.availableUntil).getTime() : Infinity;
		return now >= from && now <= until;
	});
}

export function getUpcomingCampaign(): Campaign | undefined {
	const now = Date.now();
	return mockCampaigns.find((c) => c.active && new Date(c.availableFrom).getTime() > now);
}

export function getHeroCampaign(): Campaign | undefined {
	return getActiveCampaign() ?? getUpcomingCampaign();
}
