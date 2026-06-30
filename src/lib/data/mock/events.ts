import type { Event } from '$lib/types/domain';

export const mockEvents: Event[] = [
	{
		id: 'evt-hosted-1',
		slug: 'ag-annual-open-house-2026',
		title: 'Animal Garage Presents: Annual Open House',
		description:
			'Once a year we throw the doors wide open. Tour the shop floor, watch live fab and tuning demos, meet the crew behind your favorite builds, and score open-house-only merch drops. All makes welcome — show your ride in the lot for a chance at Garage Squad spotlights and XP bonuses. Food trucks, cold brew, and good people all day.',
		location: 'Animal Garage HQ, Los Angeles, CA',
		startDate: '2026-09-19T10:00:00Z',
		endDate: '2026-09-19T18:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-openhouse/800/500',
		host: 'Animal Garage',
		isHosted: true,
		featured: true,
		tags: ['open-house', 'meet', 'merch', 'family-friendly'],
		rsvpUrl: 'https://events.animalgarage.net/open-house-2026'
	},
	{
		id: 'evt-hosted-2',
		slug: 'ag-builds-for-boost-charity-show',
		title: 'Animal Garage Presents: Builds for Boost Charity Show',
		description:
			'Our biggest charity day of the year — 200+ cars across judged show classes, a live build auction, and vendor row with AG partners. Proceeds benefit youth automotive education programs in LA County. Early-bird spectator tickets include a limited charity tee; entrants get a dash plaque and featured gallery slot if selected for Best of Show.',
		location: 'LA State Historic Park, Los Angeles, CA',
		startDate: '2026-10-11T09:00:00Z',
		endDate: '2026-10-11T17:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-charity/800/500',
		host: 'Animal Garage',
		isHosted: true,
		featured: true,
		tags: ['charity', 'car-show', 'judged', 'vendor-row'],
		rsvpUrl: 'https://events.animalgarage.net/builds-for-boost',
		externalUrl: 'https://buildsforboost.org'
	},
	{
		id: 'evt-1',
		slug: 'ag-track-day-buttonwillow',
		title: 'AG Track Day — Buttonwillow',
		description: 'Open track day with Animal Garage crew. All skill levels welcome.',
		location: 'Buttonwillow Raceway, CA',
		startDate: '2026-07-19T08:00:00Z',
		endDate: '2026-07-19T17:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-1/800/500'
	},
	{
		id: 'evt-2',
		slug: 'redline-drop-party-la',
		title: 'Redline Drop Launch Party',
		description: 'Exclusive LA pop-up for the Redline Drop. Merch, cars, and BBQ.',
		location: 'Animal Garage HQ, Los Angeles, CA',
		startDate: '2026-07-05T18:00:00Z',
		endDate: '2026-07-05T23:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-2/800/500'
	},
	{
		id: 'evt-3',
		slug: 'cars-coffee-ag-edition',
		title: 'Cars & Coffee — AG Edition',
		description: 'Monthly meet at the shop. Coffee, donuts, and clean builds.',
		location: 'Animal Garage HQ, Los Angeles, CA',
		startDate: '2026-08-03T09:00:00Z',
		endDate: '2026-08-03T12:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-3/800/500'
	},
	{
		id: 'evt-4',
		slug: 'sema-preview-night',
		title: 'SEMA Preview Night',
		description: 'Preview our SEMA booth builds before the show floor opens.',
		location: 'Las Vegas, NV',
		startDate: '2026-11-04T19:00:00Z',
		imageUrl: 'https://picsum.photos/seed/agevent-4/800/500'
	}
];

function sortByStartDate(events: Event[]): Event[] {
	return [...events].sort(
		(a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
	);
}

export function getUpcomingEvents(): Event[] {
	const now = Date.now();
	return sortByStartDate(mockEvents.filter((e) => new Date(e.startDate).getTime() >= now));
}

export function getAllEvents(): Event[] {
	return sortByStartDate(mockEvents);
}

export function getEventBySlug(slug: string): Event | undefined {
	return mockEvents.find((e) => e.slug === slug);
}
