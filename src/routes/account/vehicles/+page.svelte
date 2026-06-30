<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { garage } from '$lib/stores/garage.svelte';

	onMount(() => garage.init());

	function removeVehicle(id: string) {
		garage.removeVehicle(id);
	}
</script>

<svelte:head>
	<title>Vehicles — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Saved Vehicles</h1>
<p class="mt-1 text-zinc-400">Your garage — used for fitment and build context across the site.</p>

<p class="mt-4 rounded-sm border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
	Vehicles are stored on this device for now. Server sync ships with the account garage migration.
</p>

{#if garage.vehicles.length === 0}
	<div class="mt-8">
		<EmptyState
			title="No vehicles saved"
			description="Add your ride from the homepage vehicle selector or shop-by-model picker."
		/>
		<a href={resolve('/')} class="mt-4 inline-block text-sm text-red-500 hover:text-red-400">
			Go to homepage →
		</a>
	</div>
{:else}
	<ul class="mt-8 space-y-3">
		{#each garage.vehicles as vehicle (vehicle.id)}
			<li class="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-3">
				<div>
					<p class="text-white">{garage.formatVehicle(vehicle)}</p>
					{#if vehicle.nickname}
						<p class="text-xs text-zinc-500">{vehicle.nickname}</p>
					{/if}
				</div>
				<button
					type="button"
					class="text-xs text-zinc-600 hover:text-red-500"
					onclick={() => removeVehicle(vehicle.id)}
				>
					Remove
				</button>
			</li>
		{/each}
	</ul>
{/if}
