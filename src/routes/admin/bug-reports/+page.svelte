<script lang="ts">
	import { resolve } from '$app/paths';
	import { BUG_REPORT_CATEGORIES } from '$lib/types/bug-report';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categoryLabels = Object.fromEntries(
		BUG_REPORT_CATEGORIES.map((category) => [category.value, category.label])
	) as Record<string, string>;

	function formatWhen(iso: string): string {
		const date = new Date(iso);
		return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
	}

	function statusBadgeClass(status: string): string {
		if (status === 'open') return 'bg-amber-600/20 text-amber-400';
		if (status === 'resolved') return 'bg-emerald-600/20 text-emerald-400';
		return 'border border-zinc-700 text-zinc-300';
	}
</script>

<svelte:head>
	<title>Bug Reports — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase">Bug Reports</h1>
		<p class="mt-1 text-sm text-zinc-400">
			Read-only inbox for submissions from
			<a href={resolve('/support/report-bug')} class="text-red-400 hover:text-red-300">
				/support/report-bug
			</a>.
			{#if data.source === 'mock'}
				Showing mock fallback — connect Supabase to load live reports.
			{/if}
		</p>
	</div>

	{#if data.reports.length === 0}
		<section class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
			<p class="text-zinc-500">No bug reports yet.</p>
		</section>
	{:else}
		<section class="overflow-hidden rounded-sm border border-zinc-800">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead
						class="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500"
					>
						<tr>
							<th class="px-4 py-3">Status</th>
							<th class="px-4 py-3">Category</th>
							<th class="px-4 py-3">Description</th>
							<th class="px-4 py-3">Reporter</th>
							<th class="px-4 py-3">Submitted</th>
							<th class="px-4 py-3">Page</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-800">
						{#each data.reports as report (report.id)}
							<tr class="bg-zinc-900/30">
								<td class="px-4 py-3">
									<span
										class="rounded-sm px-2 py-0.5 text-xs font-bold uppercase {statusBadgeClass(
											report.status
										)}"
									>
										{report.status}
									</span>
								</td>
								<td class="px-4 py-3 text-xs whitespace-nowrap text-zinc-400">
									{categoryLabels[report.category] ?? report.category}
								</td>
								<td class="max-w-xs px-4 py-3">
									<p class="font-medium text-white">{report.description}</p>
									<p class="mt-1 line-clamp-2 text-xs whitespace-pre-wrap text-zinc-500">
										{report.steps}
									</p>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-zinc-400">
									{report.email ?? 'Anonymous'}
								</td>
								<td class="px-4 py-3 text-xs whitespace-nowrap text-zinc-600">
									{formatWhen(report.createdAt)}
								</td>
								<td
									class="max-w-[12rem] truncate px-4 py-3 font-mono text-xs"
									title={report.pageUrl ?? ''}
								>
									{report.pageUrl ?? '—'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</div>
