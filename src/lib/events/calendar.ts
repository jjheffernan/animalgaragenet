export function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toDateKey(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function isUpcomingDay(date: Date, today = new Date()): boolean {
	return startOfDay(date).getTime() >= startOfDay(today).getTime();
}

export function buildCalendarDays(month: Date) {
	const year = month.getFullYear();
	const monthIndex = month.getMonth();
	const firstDay = new Date(year, monthIndex, 1);
	const lastDay = new Date(year, monthIndex + 1, 0);
	const leading = firstDay.getDay();
	const totalCells = Math.ceil((leading + lastDay.getDate()) / 7) * 7;

	const days: { date: Date; inMonth: boolean }[] = [];
	for (let i = 0; i < totalCells; i++) {
		const dayNum = i - leading + 1;
		days.push({
			date: new Date(year, monthIndex, dayNum),
			inMonth: dayNum >= 1 && dayNum <= lastDay.getDate()
		});
	}
	return days;
}
