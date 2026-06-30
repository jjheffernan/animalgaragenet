<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminAlertError,
		adminAlertSuccess,
		adminBtnOutline,
		adminBtnPrimary,
		adminCard,
		adminCardFlush,
		adminField,
		adminTableHead
	} from '$lib/components/admin/admin-ui';

	let { data, form } = $props();

	let syncingId = $state<string | null>(null);

	function formatSynced(iso?: string | null): string {
		if (!iso) return 'Never';
		return new Date(iso).toLocaleString();
	}
</script>

<svelte:head>
	<title>YouTube — Admin — Animal Garage</title>
</svelte:head>

<div class="space-y-8">
	<AdminPageHeader
		title="YouTube Channels"
		subtitle="Connect channels and sync uploads into the video catalog. Sync uses a mock fetch until the YouTube Data API key is configured."
	/>

	{#if form?.error}
		<p role="alert" class={adminAlertError}>{form.error}</p>
	{/if}
	{#if form?.synced}
		<p role="status" class={adminAlertSuccess}>
			Synced {form.upserted} videos from {form.channelId}.
		</p>
	{/if}
	{#if form?.added}
		<p role="status" class={adminAlertSuccess}>Channel added.</p>
	{/if}

	<div class={adminCardFlush}>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class={adminTableHead}>
						<th class="px-4 py-3">Channel</th>
						<th class="px-4 py-3">Handle</th>
						<th class="px-4 py-3">Videos</th>
						<th class="px-4 py-3">Last sync</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-800">
					{#each data.channels as channel (channel.id)}
						<tr class="bg-zinc-900/30">
							<td class="px-4 py-4">
								<p class="font-medium text-white">{channel.title}</p>
								<p class="mt-0.5 font-mono text-xs text-zinc-500">{channel.channelId}</p>
							</td>
							<td class="px-4 py-4 text-zinc-300">{channel.handle}</td>
							<td class="px-4 py-4 text-zinc-300">{channel.videoCount}</td>
							<td class="px-4 py-4 text-zinc-400">{formatSynced(channel.lastSyncedAt)}</td>
							<td class="px-4 py-4 text-right">
								<form
									method="POST"
									action="?/sync"
									use:enhance={() => {
										syncingId = channel.channelId;
										return async ({ update }) => {
											await update();
											syncingId = null;
										};
									}}
								>
									<input type="hidden" name="channelId" value={channel.channelId} />
									<button
										type="submit"
										class="{adminBtnOutline} px-3 py-1.5 text-xs disabled:opacity-50"
										disabled={syncingId === channel.channelId}
									>
										{syncingId === channel.channelId ? 'Syncing…' : 'Sync now'}
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<section class={adminCard}>
		<h2 class="text-xs font-bold uppercase tracking-widest text-red-500">Add channel</h2>
		<form method="POST" action="?/addChannel" class="mt-4 grid gap-4 sm:grid-cols-3" use:enhance>
			<label class="block">
				<span class="text-xs text-zinc-500">YouTube channel ID</span>
				<input
					type="text"
					name="channelId"
					required
					placeholder="UCxxxxxxxx"
					class="{adminField} mt-1"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Handle</span>
				<input
					type="text"
					name="handle"
					required
					placeholder="@animalgarage"
					class="{adminField} mt-1"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Display title</span>
				<input
					type="text"
					name="title"
					required
					placeholder="Animal Garage"
					class="{adminField} mt-1"
				/>
			</label>
			<div class="sm:col-span-3">
				<button type="submit" class="{adminBtnPrimary} text-xs">Add channel</button>
			</div>
		</form>
	</section>
</div>
