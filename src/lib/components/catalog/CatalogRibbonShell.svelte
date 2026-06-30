<script lang="ts">
	import type { Snippet } from 'svelte';
	import { catalogRibbonInnerClass, catalogRibbonShellClass } from '$lib/ui/catalog-ribbon';

	interface Props {
		ariaLabel: string;
		children: Snippet;
		class?: string;
		innerClass?: string;
	}

	let { ariaLabel, children, class: className = '', innerClass = '' }: Props = $props();
</script>

<section class="{catalogRibbonShellClass} {className}" aria-label={ariaLabel}>
	<div class="{catalogRibbonInnerClass} {innerClass}">
		{@render children()}
	</div>
</section>
