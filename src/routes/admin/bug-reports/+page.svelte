<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminBadgeOff,
		adminBadgeOn,
		adminBadgeWarning,
		adminCard,
		adminCardFlush,
		adminFilterChip,
		adminFilterChipActive,
		adminTableHead
	} from '$lib/components/admin/admin-ui';
	import { BUG_REPORT_CATEGORIES } from '$lib/types/bug-report';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type StatusFilter = 'all' | 'open' | 'resolved';
	type ViewMode = 'inbox' | 'table';

	let statusFilter = $state<StatusFilter>('all');
	let viewMode = $state<ViewMode>('inbox');

	const categoryLabels = Object.fromEntries(
		BUG_REPORT_CATEGORIES.map((category) => [category.value, category.label])
	) as Record<string, string>;

	const filteredReports = $derived.by(() => {
		if (statusFilter === 'all') return data.reports;
		return data.reports.filter((report) => report.status === statusFilter);
	});

	function formatWhen(iso: string): string {
		const date = new Date(iso);
		return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
	}

	function statusBadgeClass(status: string): string {
		if (status === 'open') return adminBadgeWarning;
		if (status === 'resolved') return adminBadgeOn;
		return adminBadgeOff;
	}

	function filterClass(filter: StatusFilter): string {
		return statusFilter === filter ? adminFilterChipActive : adminFilterChip;
	}

	function viewClass(mode: ViewMode): string {
		return viewMode === mode ? adminFilterChipActive : adminFilterChip;
	}
</script>

<svelte:head>
	<title>Bug Reports — Admin</title>
</svelte:head>

<div class="space-y-6">
	<AdminPageHeader title="Bug Reports" />
	<p class="-mt-2 text-sm text-zinc-400">
		Read-only inbox for submissions from
		<a href={resolve('/support/report-bug')} class="text-red-400 hover:text-red-300">
			/support/report-bug
		</a>.
		{#if data.source === 'mock'}
			Showing mock fallback — connect Supabase for live reports.
		{/if}
	</p>

	{#if data.reports.length === 0}
		<div class={adminCard}>
			<p class="text-sm text-zinc-500">No bug reports yet.</p>
		</div>
	{:else}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex flex-wrap gap-2">
				<button type="button" class={filterClass('all')} onclick={() => (statusFilter = 'all')}>
					All ({data.reports.length})
				</button>
				<button type="button" class={filterClass('open')} onclick={() => (statusFilter = 'open')}>
					Open ({data.reports.filter((r) => r.status === 'open').length})
				</button>
				<button
					type="button"
					class={filterClass('resolved')}
					onclick={() => (statusFilter = 'resolved')}
				>
					Resolved ({data.reports.filter((r) => r.status === 'resolved').length})
				</button>
			</div>
			<div class="flex gap-2" role="tablist" aria-label="Bug report layout">
				<button type="button" class={viewClass('inbox')} onclick={() => (viewMode = 'inbox')}>
					Inbox
				</button>
				<button type="button" class={viewClass('table')} onclick={() => (viewMode = 'table')}>
					Table
				</button>
			</div>
		</div>

		{#if filteredReports.length === 0}
			<div class={adminCard}>
				<p class="text-sm text-zinc-500">No {statusFilter} bug reports.</p>
			</div>
		{:else if viewMode === 'inbox'}
			<ul class="space-y-4">
				{#each filteredReports as report (report.id)}
					<li class={adminCard}>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<span class="{statusBadgeClass(report.status)} uppercase">{report.status}</span>
								<p class="mt-2 font-medium text-white">{report.description}</p>
								<p class="mt-1 text-xs text-zinc-500">
									{categoryLabels[report.category] ?? report.category}
									· {report.email ?? 'Anonymous'}
									· {formatWhen(report.createdAt)}
								</p>
							</div>
						</div>
						<p class="mt-3 text-sm whitespace-pre-wrap text-zinc-400">{report.steps}</p>
						{#if report.pageUrl}
							<p class="mt-3 truncate font-mono text-xs text-zinc-600" title={report.pageUrl}>
								{report.pageUrl}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<div class={adminCardFlush}>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class={adminTableHead}>
								<th class="px-4 py-3 text-left">Status</th>
								<th class="px-4 py-3 text-left">Category</th>
								<th class="px-4 py-3 text-left">Description</th>
								<th class="px-4 py-3 text-left">Reporter</th>
								<th class="px-4 py-3 text-left">Submitted</th>
								<th class="px-4 py-3 text-left">Page</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-800">
							{#each filteredReports as report (report.id)}
								<tr class="bg-zinc-900/30">
									<td class="px-4 py-3">
										<span class="{statusBadgeClass(report.status)} uppercase">
											{report.status}
										</span>
									</td>
									<td class="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
										{categoryLabels[report.category] ?? report.category}
									</td>
									<td class="max-w-xs px-4 py-3">
										<p class="font-medium text-white">{report.description}</p>
										<p class="mt-1 line-clamp-2 text-xs whitespace-pre-wrap text-zinc-500">
											{report.steps}
										</p>
									</td>
									<td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
										{report.email ?? 'Anonymous'}
									</td>
									<td class="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
										{formatWhen(report.createdAt)}
									</td>
									<td
										class="max-w-[12rem] truncate px-4 py-3 font-mono text-xs text-zinc-500"
										title={report.pageUrl ?? ''}
									>
										{report.pageUrl ?? '—'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{/if}
</div>
