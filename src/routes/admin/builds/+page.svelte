<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import { adminBtnOutline, adminBtnPrimary, adminQueueCard } from '$lib/components/admin/admin-ui';
	import PaginatedListCanvas from '$lib/components/catalog/PaginatedListCanvas.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Build Log Moderation — Admin</title>
</svelte:head>

<AdminPageHeader
	title="Build Log Moderation"
	subtitle="Approve drafts and edits before they publish to /builds."
/>

{#if data.pending.length === 0}
	<p class="mt-8 text-zinc-500">No build logs awaiting review.</p>
{:else}
	<PaginatedListCanvas pagination={data.pagination} class="mt-8">
		<ul class="space-y-4">
			{#each data.pending as log (log.id)}
				<li class={adminQueueCard}>
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
							<button type="submit" class={adminBtnPrimary}>Approve</button>
						</form>
						<form method="POST" action="?/reject" use:enhance>
							<input type="hidden" name="id" value={log.id} />
							<button type="submit" class={adminBtnOutline}>Reject</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</PaginatedListCanvas>
{/if}
