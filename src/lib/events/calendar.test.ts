import { describe, expect, it } from 'vitest';
import { buildCalendarDays, isSameDay, isUpcomingDay, startOfMonth, toDateKey } from './calendar';

describe('events calendar helpers', () => {
	const june2026 = new Date(2026, 5, 15);

	it('formats stable date keys', () => {
		expect(toDateKey(new Date(2026, 5, 3))).toBe('2026-06-03');
		expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
	});

	it('builds a full grid for the month', () => {
		const days = buildCalendarDays(startOfMonth(june2026));

		expect(days.length % 7).toBe(0);
		expect(days.filter((d) => d.inMonth).length).toBe(30);
		expect(days[0].inMonth).toBe(false);
		expect(days.find((d) => d.inMonth && d.date.getDate() === 1)?.date.getDay()).toBe(1);
	});

	it('detects same day and upcoming days', () => {
		const today = new Date(2026, 5, 30);

		expect(isSameDay(today, new Date(2026, 5, 30))).toBe(true);
		expect(isSameDay(today, new Date(2026, 5, 29))).toBe(false);
		expect(isUpcomingDay(new Date(2026, 5, 30), today)).toBe(true);
		expect(isUpcomingDay(new Date(2026, 5, 29), today)).toBe(false);
	});
});
