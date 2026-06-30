<script lang="ts">
	import { getCookieConsent, setCookieConsent } from '$lib/cookies/client';

	let { show = false }: { show?: boolean } = $props();

	let dismissed = $state(false);

	const needsConsent = $derived(typeof window !== 'undefined' && getCookieConsent() === undefined);

	const visible = $derived(show && needsConsent && !dismissed);

	function accept() {
		setCookieConsent(true);
		dismissed = true;
	}

	function decline() {
		setCookieConsent(false);
		dismissed = true;
	}
</script>

{#if visible}
	<div
		class="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-900/95 px-4 py-3 text-sm text-zinc-300 shadow-lg backdrop-blur-sm"
		role="dialog"
		aria-label="Cookie consent"
	>
		<div
			class="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>
				We use essential cookies for cart and sign-in. Optional analytics cookies help us improve
				the site.
				<a href="/policies/privacy" class="text-red-400 underline hover:text-red-300"
					>Privacy policy</a
				>
			</p>
			<div class="flex shrink-0 gap-2">
				<button
					type="button"
					class="rounded border border-zinc-600 px-3 py-1.5 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
					onclick={decline}
				>
					Essential only
				</button>
				<button
					type="button"
					class="rounded bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-500"
					onclick={accept}
				>
					Accept
				</button>
			</div>
		</div>
	</div>
{/if}
