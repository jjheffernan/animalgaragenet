<script lang="ts">
	import type { BuildLog } from '$lib/types/build-log';

	interface Props {
		log?: BuildLog | null;
		errors?: Record<string, string>;
		email: string;
	}

	let { log, errors = {}, email }: Props = $props();
</script>

<input type="hidden" name="email" value={email} />

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Build Title</span>
	<input
		type="text"
		name="title"
		value={log?.title ?? ''}
		required
		placeholder="Project Fox"
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none {errors.title ? 'border-red-600' : ''}"
	/>
	{#if errors.title}<p class="mt-1 text-xs text-red-500">{errors.title}</p>{/if}
</label>

<div class="grid gap-4 sm:grid-cols-2">
	<label class="block">
		<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Year</span>
		<input
			type="number"
			name="year"
			value={log?.year ?? ''}
			required
			min="1900"
			max="2099"
			class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none {errors.year ? 'border-red-600' : ''}"
		/>
		{#if errors.year}<p class="mt-1 text-xs text-red-500">{errors.year}</p>{/if}
	</label>
	<label class="block">
		<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Make</span>
		<input
			type="text"
			name="make"
			value={log?.make ?? ''}
			required
			class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none {errors.make ? 'border-red-600' : ''}"
		/>
		{#if errors.make}<p class="mt-1 text-xs text-red-500">{errors.make}</p>{/if}
	</label>
</div>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Model</span>
	<input
		type="text"
		name="model"
		value={log?.model ?? ''}
		required
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none {errors.model ? 'border-red-600' : ''}"
	/>
	{#if errors.model}<p class="mt-1 text-xs text-red-500">{errors.model}</p>{/if}
</label>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</span>
	<textarea
		name="description"
		rows="5"
		required
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none {errors.description ? 'border-red-600' : ''}"
	>{log?.description ?? ''}</textarea>
	{#if errors.description}<p class="mt-1 text-xs text-red-500">{errors.description}</p>{/if}
</label>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Mod List</span>
	<textarea
		name="modList"
		rows="4"
		required
		placeholder="One mod per line"
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none {errors.modList ? 'border-red-600' : ''}"
	>{log?.modList ?? ''}</textarea>
	{#if errors.modList}<p class="mt-1 text-xs text-red-500">{errors.modList}</p>{/if}
</label>
