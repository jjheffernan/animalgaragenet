import type { Event } from '$lib/types/domain';

export const mockEvents: Event[] = [
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

export function getUpcomingEvents(): Event[] {
	const now = Date.now();
	return mockEvents
		.filter((e) => new Date(e.startDate).getTime() >= now)
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function getEventBySlug(slug: string): Event | undefined {
	return mockEvents.find((e) => e.slug === slug);
}
