<script lang="ts">
	import type { Snippet } from 'svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import type { ListView, PaginationMeta } from '$lib/pagination';

	interface Props {
		pagination: PaginationMeta;
		view?: ListView;
		filters?: Snippet;
		children: Snippet;
		class?: string;
	}

	let { pagination, view, filters, children, class: className = '' }: Props = $props();
</script>

<div class={className}>
	{#if filters}
		<div class="mb-6" aria-label="List filters">
			{@render filters()}
		</div>
	{/if}

	<ListControls {pagination} {view} placement="top" />

	{@render children()}

	{#if filters}
		<div
			class="mt-8 border-t border-zinc-800 pt-6"
			aria-label="List filters"
		>
			{@render filters()}
		</div>
	{/if}

	<ListControls {pagination} {view} placement="bottom" />
</div>
