<script lang="ts">
	import { resolve } from '$app/paths';
	import { BUILD_LOG_STATUS_LABELS } from '$lib/types/build-log';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Build Logs — Animal Garage</title>
</svelte:head>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase text-white">Build Logs</h1>
		<p class="mt-1 text-sm text-zinc-400">Draft, edit, and submit builds for Garage Squad review.</p>
	</div>
	<a
		href={resolve('/account/builds/new')}
		class="rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
	>
		New build log
	</a>
</div>

{#if data.logs.length === 0}
	<p class="mt-8 text-zinc-500">No build logs yet. Start a draft and submit when you are ready.</p>
{:else}
	<ul class="mt-8 space-y-3">
		{#each data.logs as log (log.id)}
			<li class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h2 class="font-medium text-white">{log.title}</h2>
						<p class="mt-1 text-sm text-zinc-500">{log.year} {log.make} {log.model}</p>
					</div>
					<span
						class="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider {log.status === 'approved'
							? 'bg-emerald-950 text-emerald-400'
							: log.status === 'pending'
								? 'bg-amber-950 text-amber-400'
								: log.status === 'rejected'
									? 'bg-red-950 text-red-400'
									: 'bg-zinc-800 text-zinc-400'}"
					>
						{BUILD_LOG_STATUS_LABELS[log.status]}
					</span>
				</div>
				<div class="mt-3 flex flex-wrap gap-3 text-sm">
					<a href={resolve(`/account/builds/${log.id}`)} class="text-red-500 hover:text-red-400">Edit</a>
					{#if log.status === 'approved' && log.slug}
						<a href={resolve(`/builds/${log.slug}`)} class="text-zinc-400 hover:text-white">View published</a>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
	<ListControls pagination={data.pagination} />
{/if}
