<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { getYears, getMakes, getModels, getSubmodels } from '$lib/data/mock/vehicles';
	import { garage } from '$lib/stores/garage.svelte';

	let year = $state<number | ''>('');
	let make = $state('');
	let model = $state('');
	let submodel = $state('');

	const years = getYears();
	const makes = $derived(year ? getMakes() : []);
	const models = $derived(make ? getModels(make) : []);
	const submodels = $derived(model ? getSubmodels(make, model) : []);

	function handleYearChange(e: Event) {
		const val = (e.target as HTMLSelectElement).value;
		year = val ? Number(val) : '';
		make = '';
		model = '';
		submodel = '';
	}

	function handleMakeChange(e: Event) {
		make = (e.target as HTMLSelectElement).value;
		model = '';
		submodel = '';
	}

	function handleModelChange(e: Event) {
		model = (e.target as HTMLSelectElement).value;
		submodel = '';
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!year || !make || !model) return;
		garage.addVehicle({ year: Number(year), make, model, submodel: submodel || undefined });
		const params = new URLSearchParams();
		params.set('year', String(year));
		params.set('make', make);
		params.set('model', model);
		if (submodel) params.set('submodel', submodel);
		goto(resolve(`/parts?${params.toString()}`));
	}

	interface Props {
		class?: string;
		compact?: boolean;
	}

	let { class: className = '', compact = false }: Props = $props();
</script>

<form onsubmit={handleSubmit} class="space-y-3 {className}">
	{#if !compact}
		<p class="text-xs font-bold uppercase tracking-widest text-red-500">Shop by Vehicle</p>
	{/if}
	<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
		<select
			value={year}
			onchange={handleYearChange}
			class="rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-red-600 focus:outline-none"
			required
		>
			<option value="">Year</option>
			{#each years as y (y)}
				<option value={y}>{y}</option>
			{/each}
		</select>
		<select
			value={make}
			onchange={handleMakeChange}
			disabled={!year}
			class="rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-red-600 focus:outline-none disabled:opacity-50"
			required
		>
			<option value="">Make</option>
			{#each makes as m (m)}
				<option value={m}>{m}</option>
			{/each}
		</select>
		<select
			value={model}
			onchange={handleModelChange}
			disabled={!make}
			class="rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-red-600 focus:outline-none disabled:opacity-50"
			required
		>
			<option value="">Model</option>
			{#each models as m (m)}
				<option value={m}>{m}</option>
			{/each}
		</select>
		<select
			bind:value={submodel}
			disabled={!model || submodels.length === 0}
			class="rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-red-600 focus:outline-none disabled:opacity-50"
		>
			<option value="">Submodel (optional)</option>
			{#each submodels as s (s)}
				<option value={s}>{s}</option>
			{/each}
		</select>
	</div>
	<button
		type="submit"
		disabled={!year || !make || !model}
		class="w-full rounded-sm bg-red-600 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
	>
		Find Parts
	</button>
</form>
