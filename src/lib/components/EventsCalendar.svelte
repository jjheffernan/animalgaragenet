<script lang="ts">
	import type { Event } from '$lib/types/domain';

	interface Props {
		events: Event[];
	}

	let { events }: Props = $props();

	const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
	const MAX_VISIBLE = 2;

	let viewDate = $state(startOfMonth(new Date()));

	const eventsByDate = $derived.by(() => {
		const map = new Map<string, Event[]>();
		for (const event of events) {
			const key = toDateKey(new Date(event.startDate));
			const list = map.get(key) ?? [];
			list.push(event);
			map.set(key, list);
		}
		return map;
	});

	const monthLabel = $derived(
		viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
	);

	const calendarDays = $derived(buildCalendarDays(viewDate));

	function startOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function toDateKey(date: Date): string {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function startOfDay(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function isSameDay(a: Date, b: Date): boolean {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	function isUpcomingDay(date: Date): boolean {
		return startOfDay(date).getTime() >= startOfDay(new Date()).getTime();
	}

	function buildCalendarDays(month: Date) {
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

	function prevMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
	}

	function goToToday() {
		viewDate = startOfMonth(new Date());
	}
</script>

<div class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
	<div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4 sm:px-6">
		<h3 class="font-display text-xl font-bold uppercase tracking-wider text-white">
			{monthLabel}
		</h3>
		<div class="flex items-center gap-2">
			<button type="button" class="rounded-sm px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-zinc-400 transition hover:text-white" onclick={goToToday}>
				Today
			</button>
			<button
				type="button"
				class="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
				aria-label="Previous month"
				onclick={prevMonth}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<button
				type="button"
				class="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
				aria-label="Next month"
				onclick={nextMonth}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>

	<div class="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/80" role="row">
		{#each WEEKDAYS as weekday (weekday)}
			<div
				class="px-1 py-2 text-center text-xs font-bold uppercase tracking-widest text-zinc-500"
				role="columnheader"
			>
				<span class="hidden sm:inline">{weekday}</span>
				<span class="sm:hidden">{weekday.charAt(0)}</span>
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-7" role="grid" aria-label="Events calendar for {monthLabel}">
		{#each calendarDays as { date, inMonth } (toDateKey(date))}
			{@const key = toDateKey(date)}
			{@const dayEvents = eventsByDate.get(key) ?? []}
			{@const today = isSameDay(date, new Date())}
			{@const upcoming = isUpcomingDay(date)}
			<div
				class="min-h-24 border-b border-r border-zinc-800 p-1.5 sm:min-h-28 sm:p-2
					{inMonth ? '' : 'bg-zinc-950/50'}
					{today ? 'ring-1 ring-inset ring-red-600/60' : ''}"
				role="gridcell"
				aria-label="{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}{dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}` : ''}"
			>
				<div class="mb-1 flex items-center justify-between gap-1">
					<span
						class="inline-flex size-6 items-center justify-center text-xs font-bold sm:text-sm
							{!inMonth ? 'text-zinc-700' : today ? 'rounded-sm bg-red-600 text-white' : past ? 'text-zinc-600' : 'text-zinc-300'}"
					>
						{date.getDate()}
					</span>
					{#if dayEvents.length > MAX_VISIBLE}
						<span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
							+{dayEvents.length - MAX_VISIBLE}
						</span>
					{/if}
				</div>

				<ul class="space-y-0.5">
					{#each dayEvents.slice(0, MAX_VISIBLE) as event (event.id)}
						<li>
							<div
								class="truncate rounded-sm px-1 py-0.5 text-[10px] leading-tight sm:text-xs
									{upcoming && inMonth
									? 'border border-red-600/30 bg-red-600/15 font-medium text-red-400'
									: 'border border-zinc-700/50 bg-zinc-800/60 text-zinc-500'}"
								title="{event.title} — {event.location}"
							>
								{event.title}
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="flex flex-wrap items-center gap-4 border-t border-zinc-800 px-4 py-3 text-xs text-zinc-500 sm:px-6">
		<span class="flex items-center gap-2">
			<span class="inline-block size-3 rounded-sm border border-red-600/30 bg-red-600/15"></span>
			Upcoming
		</span>
		<span class="flex items-center gap-2">
			<span class="inline-block size-3 rounded-sm border border-zinc-700/50 bg-zinc-800/60"></span>
			Past
		</span>
		<span class="flex items-center gap-2">
			<span class="inline-block size-3 rounded-sm ring-1 ring-red-600/60"></span>
			Today
		</span>
	</div>
</div>
