import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllEvents, getEventBySlug, getUpcomingEvents, mockEvents } from './events';

describe('events helpers', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-06-29T12:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns upcoming events sorted by start date', () => {
		const upcoming = getUpcomingEvents();

		expect(upcoming.length).toBeGreaterThan(0);
		expect(upcoming.map((e) => e.slug)).toEqual(
			[...upcoming].sort(
				(a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
			).map((e) => e.slug)
		);
	});

	it('excludes events that already started', () => {
		const pastSlug = 'past-meet';
		mockEvents.push({
			id: 'evt-past',
			slug: pastSlug,
			title: 'Past Meet',
			description: 'Already happened.',
			location: 'Los Angeles, CA',
			startDate: '2026-01-01T09:00:00Z',
			imageUrl: 'https://example.com/past.jpg'
		});

		expect(getUpcomingEvents().some((e) => e.slug === pastSlug)).toBe(false);
		expect(getAllEvents().some((e) => e.slug === pastSlug)).toBe(true);

		mockEvents.pop();
	});

	it('looks up events by slug', () => {
		const event = getEventBySlug('ag-track-day-buttonwillow');

		expect(event).toMatchObject({
			title: 'AG Track Day — Buttonwillow',
			location: 'Buttonwillow Raceway, CA'
		});
		expect(getEventBySlug('missing-event')).toBeUndefined();
	});
});
