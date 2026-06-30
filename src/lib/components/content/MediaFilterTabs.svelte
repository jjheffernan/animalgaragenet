<script lang="ts">
	import { page } from '$app/state';
	import { buildPaginationUrl } from '$lib/pagination';
	import { catalogRibbonNavClass, categoryPillClass } from '$lib/ui/catalog-ribbon';
	import { resolvePath } from '$lib/utils/paths';

	const tabs = [
		{ label: 'All', value: 'all' },
		{ label: 'Videos', value: 'videos' },
		{ label: 'Photos', value: 'photos' },
		{ label: 'UGC', value: 'ugc' }
	] as const;

	interface Props {
		activeTab: string;
		class?: string;
	}

	let { activeTab, class: className = '' }: Props = $props();

	function tabHref(tab: string) {
		return resolvePath(buildPaginationUrl(page.url.pathname, page.url.searchParams, { tab }));
	}
</script>

<nav class="{catalogRibbonNavClass} {className}" aria-label="Media filters">
	{#each tabs as tab (tab.value)}
		<a href={tabHref(tab.value)} class={categoryPillClass(activeTab === tab.value)}>
			{tab.label}
		</a>
	{/each}
</nav>
