<script lang="ts">
	import { locale } from '$lib/stores/locale.svelte';

	let email = $state('');
	let submitted = $state(false);
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		if (!email || !email.includes('@')) {
			error = 'Enter a valid email';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					email,
					locale: locale.code,
					source: 'footer'
				})
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				error = body.error ?? 'Unable to subscribe';
				return;
			}
			submitted = true;
		} catch {
			error = 'Network error — try again';
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-3">
	<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Newsletter</p>
	<p class="text-sm text-zinc-500">Drops, deals, and garage culture — no spam.</p>
	{#if submitted}
		<p class="text-sm text-red-500">You're in. Welcome to the squad.</p>
	{:else}
		<div class="flex gap-2">
			<input
				type="email"
				bind:value={email}
				placeholder="you@email.com"
				required
				class="min-w-0 flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none"
			/>
			<button
				type="submit"
				disabled={loading}
				class="shrink-0 rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
			>
				{loading ? '…' : 'Join'}
			</button>
		</div>
		{#if error}
			<p class="text-xs text-red-500">{error}</p>
		{/if}
	{/if}
</form>
