<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string | Snippet;
		actions?: Snippet;
	}

	let { title, subtitle, actions }: Props = $props();
</script>

<div class="flex flex-wrap items-start justify-between gap-4">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase">{title}</h1>
		{#if subtitle}
			<div class="mt-1 text-sm text-zinc-400">
				{#if typeof subtitle === 'string'}
					{subtitle}
				{:else}
					{@render subtitle()}
				{/if}
			</div>
		{/if}
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
