<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		side?: 'left' | 'right';
		onclose: () => void;
		ariaLabel: string;
		header: Snippet;
		children: Snippet;
		footer?: Snippet;
		/** Hide drawer + backdrop at lg+ */
		mobileOnly?: boolean;
		/** Panel width on sm+ (default max-w-md for cart) */
		wide?: boolean;
	}

	let {
		open,
		side = 'left',
		onclose,
		ariaLabel,
		header,
		children,
		footer,
		mobileOnly = false,
		wide = false
	}: Props = $props();

	const translateClosed = $derived(side === 'left' ? '-translate-x-full' : 'translate-x-full');
	const positionClass = $derived(side === 'left' ? 'left-0 border-r' : 'right-0 border-l');
	const widthClass = $derived(
		wide ? 'w-[min(20rem,88vw)]' : 'w-[min(20rem,88vw)] sm:max-w-md sm:w-full'
	);

	$effect(() => {
		if (typeof document === 'undefined' || !open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) onclose();
	}}
/>

<button
	type="button"
	class="fixed inset-0 z-[60] bg-black/70 transition-opacity duration-300 {mobileOnly
		? 'lg:hidden'
		: ''} {open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}"
	aria-label="Close panel"
	tabindex={open ? 0 : -1}
	onclick={onclose}
></button>

<aside
	class="fixed inset-y-0 z-[70] flex flex-col border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out {positionClass} {widthClass} {mobileOnly
		? 'lg:hidden'
		: ''} {open ? 'translate-x-0' : translateClosed}"
	aria-hidden={!open}
	aria-label={ariaLabel}
	inert={!open}
>
	{@render header()}
	<div class="flex min-h-0 flex-1 flex-col">
		{@render children()}
	</div>
	{#if footer}
		{@render footer()}
	{/if}
</aside>
