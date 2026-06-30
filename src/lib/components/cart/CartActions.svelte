<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		empty?: boolean;
		onNavigate?: () => void;
		size?: 'page' | 'drawer';
	}

	let { empty = false, onNavigate, size = 'page' }: Props = $props();

	const sizeClass = $derived(size === 'drawer' ? 'py-2.5 text-sm' : 'py-3');
	const label = $derived('uppercase tracking-wider font-bold');

	function handleNavigate() {
		onNavigate?.();
	}
</script>

<div class="space-y-3">
	{#if empty}
		<span
			class="block w-full rounded-sm bg-zinc-800 {sizeClass} text-center {label} text-zinc-500"
			aria-disabled="true">Checkout</span
		>
	{:else}
		<a
			href={resolve('/checkout')}
			class="block w-full rounded-sm bg-red-600 {sizeClass} text-center {label} text-white transition hover:bg-red-500"
			onclick={handleNavigate}
		>
			Checkout
		</a>
	{/if}

	<a
		href={resolve('/shop')}
		class="block w-full rounded-sm border border-zinc-700 {sizeClass} text-center {label} text-zinc-300 transition hover:border-red-600 hover:text-white"
		onclick={handleNavigate}
	>
		Continue Shopping
	</a>
	<a
		href={resolve('/parts')}
		class="block w-full rounded-sm border border-zinc-700 {sizeClass} text-center {label} text-zinc-300 transition hover:border-red-600 hover:text-white"
		onclick={handleNavigate}
	>
		Browse Parts
	</a>
	<a
		href={resolve('/deals')}
		class="block w-full rounded-sm border border-zinc-700 {sizeClass} text-center {label} text-zinc-300 transition hover:border-red-600 hover:text-white"
		onclick={handleNavigate}
	>
		View Deals
	</a>
</div>
