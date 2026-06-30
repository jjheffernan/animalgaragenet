<script lang="ts">
	let email = $state('');
	let submitted = $state(false);
	let loading = $state(false);
	let error = $state('');

	interface Props {
		productId: string;
		productName: string;
		productSlug?: string;
		variantId?: string;
		class?: string;
	}

	let { productId, productName, productSlug, variantId, class: className = '' }: Props = $props();

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		if (!email.includes('@')) {
			error = 'Enter a valid email';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/restock/notify', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, productId, productName, productSlug, variantId })
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				error = body.error ?? 'Unable to save alert';
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

{#if submitted}
	<p class="text-sm text-red-500">We'll notify you when {productName} is back in stock.</p>
{:else}
	<form onsubmit={handleSubmit} class="flex gap-2 {className}">
		<input
			type="email"
			bind:value={email}
			placeholder="Email for restock alert"
			required
			class="min-w-0 flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={loading}
			class="shrink-0 rounded-sm border border-zinc-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-white disabled:opacity-50"
		>
			{loading ? '…' : 'Notify Me'}
		</button>
	</form>
	{#if error}
		<p class="mt-2 text-xs text-red-500">{error}</p>
	{/if}
{/if}
