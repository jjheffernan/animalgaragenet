<script lang="ts">
	import type { Snippet } from 'svelte';
	import { catalogRibbonInnerClass, catalogRibbonShellClass } from '$lib/ui/catalog-ribbon';

	interface Props {
		ariaLabel: string;
		children: Snippet;
		class?: string;
		innerClass?: string;
		/** Publish shell height as `--catalog-ribbon-height` for sticky list controls. */
		syncHeightVar?: boolean;
	}

	let {
		ariaLabel,
		children,
		class: className = '',
		innerClass = '',
		syncHeightVar = false
	}: Props = $props();

	let ribbonShell = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!syncHeightVar || !ribbonShell) return;

		const syncRibbonHeight = () => {
			document.documentElement.style.setProperty(
				'--catalog-ribbon-height',
				`${ribbonShell!.offsetHeight}px`
			);
		};

		syncRibbonHeight();
		const observer = new ResizeObserver(syncRibbonHeight);
		observer.observe(ribbonShell);

		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty('--catalog-ribbon-height');
		};
	});
</script>

<section
	bind:this={ribbonShell}
	class="{catalogRibbonShellClass} {className}"
	aria-label={ariaLabel}
>
	<div class="{catalogRibbonInnerClass} {innerClass}">
		{@render children()}
	</div>
</section>
