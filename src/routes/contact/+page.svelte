<script lang="ts">
	import { enhance } from '$app/forms';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	function fieldError(key: string): string | undefined {
		const errors = form?.errors as Record<string, string> | undefined;
		return errors?.[key];
	}
</script>

<svelte:head>
	<title>Contact — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Contact</h1>
		<p class="mt-4 text-zinc-400">
			Questions about an order, a part fitment, or just want to talk builds? We typically respond
			within 1–2 business days.
		</p>

		{#if form?.success}
			<p class="mt-8 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
				{form.message}
			</p>
		{:else}
			<form
				method="POST"
				class="mt-10 space-y-6"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
			>
				{#if fieldError('form')}
					<p class="text-sm text-red-500">{fieldError('form')}</p>
				{/if}

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</span>
					<input
						type="text"
						name="name"
						value={form?.name ?? ''}
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('name') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('name')}
						<p class="mt-1 text-xs text-red-500">{fieldError('name')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</span>
					<input
						type="email"
						name="email"
						value={form?.email ?? ''}
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('email') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('email')}
						<p class="mt-1 text-xs text-red-500">{fieldError('email')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Subject</span>
					<select
						name="subject"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('subject') ? 'border-red-600' : ''}"
					>
						<option value="" disabled selected={!form?.subject}>Select a topic</option>
						<option value="Order" selected={form?.subject === 'Order'}>Order question</option>
						<option value="Returns" selected={form?.subject === 'Returns'}>Returns &amp; refunds</option>
						<option value="Parts" selected={form?.subject === 'Parts'}>Parts &amp; fitment</option>
						<option value="Wholesale" selected={form?.subject === 'Wholesale'}>Wholesale</option>
						<option value="Other" selected={form?.subject === 'Other'}>Other</option>
					</select>
					{#if fieldError('subject')}
						<p class="mt-1 text-xs text-red-500">{fieldError('subject')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</span>
					<textarea
						name="message"
						rows="5"
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('message') ? 'border-red-600' : ''}"
					>{form?.message ?? ''}</textarea>
					{#if fieldError('message')}
						<p class="mt-1 text-xs text-red-500">{fieldError('message')}</p>
					{/if}
				</label>

				<button
					type="submit"
					disabled={submitting}
					class="w-full rounded-sm bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
				>
					{submitting ? 'Sending…' : 'Send Message'}
				</button>
			</form>
		{/if}

		<p class="mt-8 text-sm text-zinc-500">
			Prefer real-time help? Join our Discord for faster support from the squad.
		</p>
	</AnimatedReveal>
</section>
