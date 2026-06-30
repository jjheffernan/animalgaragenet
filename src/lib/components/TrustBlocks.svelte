<script lang="ts">
	const blocks = [
		{ title: 'Lowest Price Guarantee', desc: 'Found it cheaper? We will match it on parts.' },
		{ title: 'Lifetime Support', desc: 'Our crew helps you dial fitment and installs.' },
		{ title: 'Free Mount & Balance', desc: 'On all wheel + tire packages over $800.' },
		{ title: 'Fast Ship', desc: 'Merch ships within 2 business days.' }
	] as const;

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 {className}">
	{#each blocks as block (block.title)}
		<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
			<p class="text-xs font-bold uppercase tracking-wider text-red-500">{block.title}</p>
			<p class="mt-1 text-sm text-zinc-500">{block.desc}</p>
		</div>
	{/each}
</div>
