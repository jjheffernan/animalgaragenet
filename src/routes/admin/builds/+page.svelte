<script lang="ts">
	import { enhance } from '$app/forms';
	import ListControls from '$lib/components/ListControls.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Build Log Moderation — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Build Log Moderation</h1>
<p class="mt-1 text-sm text-zinc-400">Approve drafts and edits before they publish to /builds.</p>

{#if data.pending.length === 0}
	<p class="mt-8 text-zinc-500">No build logs awaiting review.</p>
{:else}
	<ul class="mt-8 space-y-4">
		{#each data.pending as log (log.id)}
			<li class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5">
				<h2 class="font-medium text-white">{log.title}</h2>
				<p class="mt-1 text-sm text-zinc-500">{log.year} {log.make} {log.model} · {log.email}</p>
				<p class="mt-3 line-clamp-3 text-sm text-zinc-400">{log.description}</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<form method="POST" action="?/approve" use:enhance>
						<input type="hidden" name="id" value={log.id} />
						<input type="hidden" name="title" value={log.title} />
						<input type="hidden" name="year" value={log.year} />
						<input type="hidden" name="make" value={log.make} />
						<input type="hidden" name="model" value={log.model} />
						<button type="submit" class="rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500">Approve</button>
					</form>
					<form method="POST" action="?/reject" use:enhance>
						<input type="hidden" name="id" value={log.id} />
						<button type="submit" class="rounded-sm border border-zinc-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white">Reject</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
	<ListControls pagination={data.pagination} />
{/if}
