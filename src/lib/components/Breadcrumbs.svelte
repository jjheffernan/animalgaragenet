<script lang="ts">
	import { resolvePath } from '$lib/utils/paths';

	interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		crumbs: Crumb[];
		class?: string;
	}

	let { crumbs, class: className = '' }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="text-xs text-zinc-500 {className}">
	<ol class="flex flex-wrap items-center gap-1">
		{#each crumbs as crumb, i (crumb.label)}
			{#if i > 0}
				<li aria-hidden="true" class="text-zinc-700">/</li>
			{/if}
			<li>
				{#if crumb.href && i < crumbs.length - 1}
					<a href={resolvePath(crumb.href)} class="hover:text-red-500">{crumb.label}</a>
				{:else}
					<span class="text-zinc-400">{crumb.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
