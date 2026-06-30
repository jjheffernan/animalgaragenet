<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		action?: Snippet;
		class?: string;
	}

	let { title, description, action, class: className = '' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center {className}">
	<p class="text-xs font-bold uppercase tracking-widest text-red-500">Nothing Here Yet</p>
	<h3 class="mt-2 font-display text-xl font-bold uppercase text-white">{title}</h3>
	{#if description}
		<p class="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
	{/if}
	{#if action}
		<div class="mt-6">
			{@render action()}
		</div>
	{/if}
</div>
