<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<blockquote class="border-l-2 border-red-600 pl-4 {className}">
	<p class="font-display text-lg font-bold uppercase tracking-wide text-white">
		Built different. Wrench harder. Send it louder.
	</p>
	<p class="mt-2 text-sm text-zinc-500">
		Animal Garage is where garage culture meets the open road — merch, parts, builds, and the squad
		that keeps the scene alive.
	</p>
</blockquote>
