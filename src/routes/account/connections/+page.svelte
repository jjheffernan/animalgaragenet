<script lang="ts">
	import { onMount } from 'svelte';
	import type { SocialPlatformId } from '$lib/data/social-platforms';
	import {
		loadConnectionsFromApi,
		updateConnectionOnApi,
		type ConnectionsApiState
	} from '$lib/stores/social-connections-api';
	import type { SocialConnectionsMap } from '$lib/types/social-connections';

	let loading = $state(true);
	let error = $state<string | null>(null);
	let mockMode = $state(true);
	let platforms = $state<ConnectionsApiState['platforms']>([]);
	let connections = $state<SocialConnectionsMap>({});
	let pendingPlatform = $state<SocialPlatformId | null>(null);
	let handleInput = $state('');
	let saving = $state(false);

	onMount(() => {
		void refresh();
	});

	async function refresh() {
		loading = true;
		error = null;
		const data = await loadConnectionsFromApi();
		if (data === 'guest' || data === null) {
			error = 'Unable to load connections.';
			loading = false;
			return;
		}
		connections = data.connections;
		platforms = data.platforms;
		mockMode = data.mockMode;
		loading = false;
	}

	function startConnect(platform: ConnectionsApiState['platforms'][number]) {
		if (platform.oauthAuthorizeUrl) {
			window.location.href = platform.oauthAuthorizeUrl;
			return;
		}
		pendingPlatform = platform.id;
		handleInput = '';
		error = null;
	}

	function cancelConnect() {
		pendingPlatform = null;
		handleInput = '';
	}

	async function submitConnect() {
		if (!pendingPlatform) return;
		saving = true;
		error = null;
		const result = await updateConnectionOnApi(pendingPlatform, {
			action: 'connect',
			handle: handleInput
		});
		saving = false;
		if (!result.ok) {
			error = result.error;
			return;
		}
		connections = result.connections;
		pendingPlatform = null;
		handleInput = '';
	}

	async function disconnect(platformId: SocialPlatformId) {
		saving = true;
		error = null;
		const result = await updateConnectionOnApi(platformId, { action: 'disconnect' });
		saving = false;
		if (!result.ok) {
			error = result.error;
			return;
		}
		connections = result.connections;
	}
</script>

<svelte:head>
	<title>Connections — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Social Connections</h1>
<p class="mt-1 text-zinc-400">
	Link your profiles to show off your builds and unlock community perks.
</p>

{#if mockMode}
	<p class="mt-4 rounded-sm border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
		Mock mode — OAuth provider keys are not configured. Enter your public handle to link a platform
		until live OAuth is wired.
	</p>
{/if}

{#if error}
	<p class="mt-4 text-sm text-red-400" role="alert">{error}</p>
{/if}

{#if loading}
	<p class="mt-8 text-sm text-zinc-500">Loading connections…</p>
{:else}
	<ul class="mt-8 space-y-3">
		{#each platforms as platform (platform.id)}
			{@const linked = connections[platform.id]}
			<li class="rounded-sm border border-zinc-800 bg-zinc-900/50 px-4 py-4">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex items-center gap-3">
						<span
							class="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-500"
							aria-hidden="true"
						>
							{#if platform.id === 'instagram'}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
									/>
								</svg>
							{:else if platform.id === 'youtube'}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
									/>
								</svg>
							{:else if platform.id === 'tiktok'}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12.525.02c1.31-.02 2.61-.01 3.919-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.15-3.02.74-.63.66-.98 1.58-.86 2.5.11 1.1.82 2.07 1.86 2.49 1.22.5 2.72.24 3.68-.55.56-.44.95-1.07 1.1-1.77.03-.18.05-.37.05-.56V.02z"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
									/>
								</svg>
							{/if}
						</span>
						<div>
							<p class="font-medium text-white">{platform.label}</p>
							{#if linked}
								<p class="text-sm text-zinc-400">
									@{linked.handle}
									{#if linked.mock}
										<span class="text-xs text-zinc-600">(mock)</span>
									{/if}
								</p>
							{:else}
								<p class="text-sm text-zinc-600">Not connected</p>
							{/if}
						</div>
					</div>

					{#if linked}
						<button
							type="button"
							class="rounded-sm border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-600/50 hover:text-red-400 disabled:opacity-50"
							disabled={saving}
							onclick={() => disconnect(platform.id)}
						>
							Disconnect
						</button>
					{:else}
						<button
							type="button"
							class="rounded-sm bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
							disabled={saving}
							onclick={() => startConnect(platform)}
						>
							Connect
						</button>
					{/if}
				</div>

				{#if pendingPlatform === platform.id}
					<form
						class="mt-4 flex flex-wrap items-end gap-3 border-t border-zinc-800 pt-4"
						onsubmit={(e) => {
							e.preventDefault();
							void submitConnect();
						}}
					>
						<label class="min-w-[12rem] flex-1 text-sm">
							<span class="text-zinc-500">Public handle</span>
							<input
								type="text"
								bind:value={handleInput}
								placeholder="@username"
								class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-600"
								required
							/>
						</label>
						<div class="flex gap-2">
							<button
								type="button"
								class="rounded-sm border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:text-white"
								onclick={cancelConnect}
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded-sm bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
								disabled={saving}
							>
								Save
							</button>
						</div>
					</form>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
