<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from '$lib/motion/prefers-reduced-motion';

	interface Props {
		children: Snippet;
		class?: string;
		delay?: number;
		/** `mount` = on load (default); `scroll` = when entering viewport (IP-029 partial, no Motion One dep). */
		trigger?: 'mount' | 'scroll';
	}

	let { children, class: className = '', delay = 0, trigger = 'mount' }: Props = $props();
	let visible = $state(false);
	let root: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (prefersReducedMotion()) {
			visible = true;
			return;
		}

		if (trigger === 'mount') {
			const timer = setTimeout(() => {
				visible = true;
			}, delay);
			return () => clearTimeout(timer);
		}

		const node = root;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					visible = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
		);

		const revealTimer = setTimeout(() => observer.observe(node), delay);
		return () => {
			clearTimeout(revealTimer);
			observer.disconnect();
		};
	});
</script>

<div
	bind:this={root}
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

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
