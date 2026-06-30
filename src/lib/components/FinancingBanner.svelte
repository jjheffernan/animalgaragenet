<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 px-4 py-3 {className}">
	<p class="text-xs text-zinc-400">
		<span class="font-bold uppercase tracking-wider text-red-500">Financing Available</span>
		— Pay over time with Klarna or Affirm at checkout.
		<a href={resolve('/shop')} class="ml-1 underline hover:text-white">Learn more</a>
	</p>
</div>
