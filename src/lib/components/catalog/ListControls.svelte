<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		buildPaginationUrl,
		DEFAULT_LIST_VIEW,
		LIST_VIEW_OPTIONS,
		PER_PAGE_OPTIONS,
		paginationRange,
		type ListView,
		type PaginationMeta
	} from '$lib/pagination';
	import { resolvePath } from '$lib/utils/paths';

	interface Props {
		pagination: PaginationMeta;
		view?: ListView;
		placement?: 'top' | 'bottom';
		class?: string;
	}

	let { pagination, view, placement = 'bottom', class: className = '' }: Props = $props();

	const viewLabels: Record<ListView, string> = {
		list: 'List',
		'grid-lg': 'Large',
		'grid-sm': 'Small'
	};

	const activeView = $derived(view ?? DEFAULT_LIST_VIEW);
	const showView = $derived(view !== undefined);
	const range = $derived(paginationRange(pagination));
	const pathname = $derived(page.url.pathname);
	const searchParams = $derived(page.url.searchParams);
	const showPager = $derived(pagination.totalPages > 1);
	const showControls = $derived(pagination.total > 0);

	function hrefFor(updates: { page?: number; perPage?: number; view?: ListView }) {
		return resolvePath(buildPaginationUrl(pathname, searchParams, updates));
	}

	function navigate(updates: { page?: number; perPage?: number; view?: ListView }) {
		goto(hrefFor(updates), { keepFocus: true, noScroll: true });
	}
</script>

{#snippet viewToggle()}
	{#if showView}
		<div class="flex items-center gap-1" role="group" aria-label="View layout">
			<span class="mr-1 text-sm font-bold uppercase tracking-wider text-zinc-500">View</span>
			{#each LIST_VIEW_OPTIONS as option (option)}
				{#if activeView === option}
					<span
						class="rounded-sm border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
						aria-current="true"
					>
						{viewLabels[option]}
					</span>
				{:else}
					<button
						type="button"
						class="rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
						onclick={() => navigate({ view: option })}
					>
						{viewLabels[option]}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

{#if showControls}
	{#if placement === 'top' && showView}
		<div
			class="mb-6 flex justify-end {className}"
			aria-label="List view options"
		>
			{@render viewToggle()}
		</div>
	{:else if placement === 'bottom'}
		<nav
			class="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between {className}"
			aria-label="List pagination"
		>
			<p class="text-sm text-zinc-500">
				Showing <span class="text-zinc-300">{range.start}–{range.end}</span> of
				<span class="text-zinc-300">{pagination.total}</span>
			</p>

			<div class="flex flex-wrap items-center gap-4">
				{@render viewToggle()}

				<label class="flex items-center gap-2 text-sm text-zinc-500">
					<span class="font-bold uppercase tracking-wider">Per page</span>
					<select
						class="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200 focus:border-red-600 focus:outline-none"
						value={pagination.perPage}
						onchange={(e) => {
							const perPage = Number((e.currentTarget as HTMLSelectElement).value);
							navigate({ perPage });
						}}
					>
						{#each PER_PAGE_OPTIONS as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>

				{#if showPager}
					<div class="flex items-center gap-1">
						{#if pagination.page > 1}
							<button
								type="button"
								class="rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
								onclick={() => navigate({ page: pagination.page - 1 })}
							>
								Prev
							</button>
						{:else}
							<span
								class="rounded-sm border border-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600"
								aria-disabled="true"
							>
								Prev
							</span>
						{/if}

						<span class="px-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
							Page {pagination.page} of {pagination.totalPages}
						</span>

						{#if pagination.page < pagination.totalPages}
							<button
								type="button"
								class="rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
								onclick={() => navigate({ page: pagination.page + 1 })}
							>
								Next
							</button>
						{:else}
							<span
								class="rounded-sm border border-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600"
								aria-disabled="true"
							>
								Next
							</span>
						{/if}
					</div>
				{/if}
			</div>
		</nav>
	{/if}
{/if}
