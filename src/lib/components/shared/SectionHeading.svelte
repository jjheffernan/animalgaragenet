<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		align?: 'left' | 'center';
	}

	let { title, subtitle = '', align = 'left' }: Props = $props();
</script>

<div class="mb-10 {align === 'center' ? 'text-center' : ''}">
	<h2 class="font-display text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
		{title}
	</h2>
	{#if subtitle}
		<p class="mt-3 max-w-2xl text-zinc-400 {align === 'center' ? 'mx-auto' : ''}">
			{subtitle}
		</p>
	{/if}
	<div
		class="mt-4 h-1 w-16 bg-red-600 {align === 'center' ? 'mx-auto' : ''}"
		aria-hidden="true"
	></div>
</div>
