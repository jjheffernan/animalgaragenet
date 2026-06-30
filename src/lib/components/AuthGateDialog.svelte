<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		description: string;
		signInHref: string;
		dismissHref: string;
		dismissLabel?: string;
	}

	let {
		open,
		title,
		description,
		signInHref,
		dismissHref,
		dismissLabel = 'Back to home'
	}: Props = $props();

	let dialogEl = $state<HTMLDialogElement | undefined>();

	$effect(() => {
		const dialog = dialogEl;
		if (!dialog) return;

		void (async () => {
			await tick();
			if (open) {
				if (!dialog.open) dialog.showModal();
			} else if (dialog.open) {
				dialog.close();
			}
		})();
	});

	$effect(() => {
		if (typeof document === 'undefined' || !open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});

	function handleCancel(e: Event) {
		e.preventDefault();
		void goto(dismissHref);
	}
</script>

<dialog
	bind:this={dialogEl}
	class="auth-gate"
	aria-labelledby="auth-gate-title"
	aria-describedby="auth-gate-desc"
	oncancel={handleCancel}
>
		<div class="w-full max-w-md rounded-sm border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-sm border border-red-900/50 bg-red-950/30 text-red-500"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<h2 id="auth-gate-title" class="mt-4 font-display text-xl font-bold uppercase tracking-wider text-white">
				{title}
			</h2>
			<p id="auth-gate-desc" class="mt-2 text-sm text-zinc-400">
				{description}
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<a
					href={signInHref}
					class="inline-flex items-center justify-center rounded-sm bg-red-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
				>
					Sign in
				</a>
				<a
					href={dismissHref}
					class="inline-flex items-center justify-center rounded-sm border border-zinc-700 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
				>
					{dismissLabel}
				</a>
			</div>
		</div>
</dialog>

<style>
	.auth-gate {
		position: fixed;
		inset: 0;
		z-index: 80;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 1rem;
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		border: none;
		background: transparent;
	}

	.auth-gate:not([open]) {
		display: none;
	}

	.auth-gate::backdrop {
		background: rgb(9 9 11 / 0.8);
		backdrop-filter: blur(4px);
	}
</style>
