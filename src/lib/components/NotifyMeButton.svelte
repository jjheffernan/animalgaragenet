<script lang="ts">
	let email = $state('');
	let submitted = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email.includes('@')) return;
		submitted = true;
	}

	interface Props {
		productName: string;
		class?: string;
	}

	let { productName, class: className = '' }: Props = $props();
</script>

{#if submitted}
	<p class="text-sm text-red-500">We'll notify you when {productName} is back in stock.</p>
{:else}
	<form onsubmit={handleSubmit} class="flex gap-2 {className}">
		<input
			type="email"
			bind:value={email}
			placeholder="Email for restock alert"
			class="min-w-0 flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
		/>
		<button
			type="submit"
			class="shrink-0 rounded-sm border border-zinc-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-white"
		>
			Notify Me
		</button>
	</form>
{/if}
