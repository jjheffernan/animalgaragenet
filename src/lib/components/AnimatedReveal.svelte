<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		delay?: number;
	}

	let { children, class: className = '', delay = 0 }: Props = $props();
	let visible = $state(false);

	$effect(() => {
		const timer = setTimeout(() => {
			visible = true;
		}, delay);
		return () => clearTimeout(timer);
	});
</script>

<div
	class="reveal {className}"
	class:reveal-visible={visible}
	style="--reveal-delay: {delay}ms"
>
	{@render children()}
</div>

<style>
	.reveal {
		opacity: 0;
		transform: translateY(1.25rem);
		transition:
			opacity 0.6s ease var(--reveal-delay, 0ms),
			transform 0.6s ease var(--reveal-delay, 0ms);
	}

	.reveal-visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
