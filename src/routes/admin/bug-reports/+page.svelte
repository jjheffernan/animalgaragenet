<script lang="ts">
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
</script>

<svelte:head>
	<title>Bug Reports — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Bug Reports</h1>
<p class="mt-1 text-sm text-zinc-400">
	Read-only inbox for submissions from
	<a href="/support/report-bug" class="text-red-400 hover:text-red-300">/support/report-bug</a>.
	{#if data.source === 'mock'}
		Showing mock fallback — connect Supabase to load live reports.
	{/if}
</p>

{#if data.reports.length === 0}
	<p class="mt-8 text-zinc-500">No bug reports yet.</p>
{:else}
	<ul class="mt-8 space-y-4">
		{#each data.reports as report (report.id)}
			<li class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">
							{categoryLabels[report.category] ?? report.category}
						</p>
						<p class="mt-1 font-medium text-white">{report.description}</p>
					</div>
					<span
						class="rounded-sm border border-zinc-700 px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300"
					>
						{report.status}
					</span>
				</div>
				<p class="mt-3 text-sm text-zinc-400 whitespace-pre-wrap">{report.steps}</p>
				<dl class="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
					<div>
						<dt class="text-zinc-600">Reporter</dt>
						<dd class="text-zinc-400">{report.email ?? 'Anonymous'}</dd>
					</div>
					<div>
						<dt class="text-zinc-600">Submitted</dt>
						<dd class="text-zinc-400">{formatWhen(report.createdAt)}</dd>
					</div>
					{#if report.pageUrl}
						<div class="sm:col-span-2">
							<dt class="text-zinc-600">Page</dt>
							<dd class="truncate font-mono text-zinc-400" title={report.pageUrl}>{report.pageUrl}</dd>
						</div>
					{/if}
				</dl>
			</li>
		{/each}
	</ul>
{/if}
