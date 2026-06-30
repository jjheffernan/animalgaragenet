<script lang="ts">
	import type { Snippet } from 'svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import type { ListView, PaginationMeta } from '$lib/pagination';
	import { listControlsStickyShellClass, listControlsStickyTopClass } from '$lib/ui/catalog-ribbon';

	interface Props {
		pagination: PaginationMeta;
		view?: ListView;
		filters?: Snippet;
		children: Snippet;
		class?: string;
		/** Pin top view/per-page toolbar below site header (+ catalog or parts ribbon). */
		stickyTop?: 'catalog' | 'parts';
	}

	let { pagination, view, filters, children, class: className = '', stickyTop }: Props = $props();
</script>

<div class={className}>
	{#if filters}
		<div class="mb-6" aria-label="List filters">
			{@render filters()}
		</div>
	{/if}

	{#if stickyTop}
		<div class="{listControlsStickyShellClass} {listControlsStickyTopClass(stickyTop)}">
			<ListControls {pagination} {view} placement="top" class="mb-0" />
		</div>
	{:else}
		<ListControls {pagination} {view} placement="top" />
	{/if}

	{@render children()}

	{#if filters}
		<div class="mt-8 border-t border-zinc-800 pt-6" aria-label="List filters">
			{@render filters()}
		</div>
	{/if}

	<ListControls {pagination} {view} placement="bottom" />
</div>
