<script lang="ts">
	import { enhance } from '$app/forms';

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

<div class="space-y-10">
	<div>
		<h2 class="font-display text-2xl font-bold uppercase tracking-wider text-white">
			YouTube Channels
		</h2>
		<p class="mt-2 text-sm text-zinc-400">
			Connect channels and sync uploads into the video catalog. Sync uses a mock fetch until the
			YouTube Data API key is configured.
		</p>
	</div>

	{#if form?.error}
		<p class="rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
			{form.error}
		</p>
	{/if}
	{#if form?.synced}
		<p
			class="rounded-sm border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400"
		>
			Synced {form.upserted} videos from {form.channelId}.
		</p>
	{/if}
	{#if form?.added}
		<p
			class="rounded-sm border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400"
		>
			Channel added.
		</p>
	{/if}

	<section class="overflow-hidden rounded-sm border border-zinc-800">
		<table class="w-full text-left text-sm">
			<thead
				class="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500"
			>
				<tr>
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
									class="rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-white disabled:opacity-50"
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
	</section>

	<section class="rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
		<h3 class="text-xs font-bold uppercase tracking-widest text-red-500">Add channel</h3>
		<form method="POST" action="?/addChannel" class="mt-4 grid gap-4 sm:grid-cols-3" use:enhance>
			<label class="block">
				<span class="text-xs text-zinc-500">YouTube channel ID</span>
				<input
					type="text"
					name="channelId"
					required
					placeholder="UCxxxxxxxx"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Handle</span>
				<input
					type="text"
					name="handle"
					required
					placeholder="@animalgarage"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Display title</span>
				<input
					type="text"
					name="title"
					required
					placeholder="Animal Garage"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
				/>
			</label>
			<div class="sm:col-span-3">
				<button
					type="submit"
					class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
				>
					Add channel
				</button>
			</div>
		</form>
	</section>
</div>
