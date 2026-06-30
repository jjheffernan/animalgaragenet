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
	<title>Wholesale — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Wholesale Inquiry</h1>
		<p class="mt-4 text-zinc-400">
			Interested in carrying Animal Garage at your shop, event, or retail location? We work with
			select B2B partners who share our garage-culture ethos.
		</p>

		<div class="mt-10 grid gap-8 sm:grid-cols-2">
			<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
				<p class="text-xs font-bold uppercase tracking-widest text-red-500">Minimum Order</p>
				<p class="mt-2 font-display text-2xl font-bold text-white">$500</p>
				<p class="mt-2 text-sm text-zinc-500">Opening order minimum. Reorders from $250.</p>
			</div>
			<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
				<p class="text-xs font-bold uppercase tracking-widest text-red-500">Response Time</p>
				<p class="mt-2 font-display text-2xl font-bold text-white">3–5 Days</p>
				<p class="mt-2 text-sm text-zinc-500">Our wholesale team reviews every application.</p>
			</div>
		</div>

		<div class="mt-10 space-y-4 text-zinc-400 leading-relaxed">
			<h2 class="font-display text-lg font-bold uppercase text-white">What We Offer</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>Tiered wholesale pricing on merch and select parts</li>
				<li>Co-branded event kits and pop-up shop support</li>
				<li>Net-30 terms for approved accounts (after first order)</li>
				<li>Marketing assets and product photography</li>
			</ul>

			<h2 class="font-display text-lg font-bold uppercase text-white pt-4">Timeline</h2>
			<ol class="list-inside list-decimal space-y-2">
				<li>Submit the inquiry form below</li>
				<li>Wholesale team reviews within 3–5 business days</li>
				<li>If approved, we send a catalog, price sheet, and account setup link</li>
				<li>Place your opening order — ships within 5–7 business days</li>
			</ol>
		</div>

		{#if form?.success}
			<p class="mt-10 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
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
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Business Name</span>
					<input
						type="text"
						name="businessName"
						value={form?.businessName ?? ''}
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('businessName') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('businessName')}
						<p class="mt-1 text-xs text-red-500">{fieldError('businessName')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Contact Name</span>
					<input
						type="text"
						name="contactName"
						value={form?.contactName ?? ''}
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('contactName') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('contactName')}
						<p class="mt-1 text-xs text-red-500">{fieldError('contactName')}</p>
					{/if}
				</label>

				<div class="grid gap-6 sm:grid-cols-2">
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
						<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Phone (optional)</span>
						<input
							type="tel"
							name="phone"
							value={form?.phone ?? ''}
							class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
						/>
					</label>
				</div>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Website (optional)</span>
					<input
						type="url"
						name="website"
						value={form?.website ?? ''}
						placeholder="https://"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
					/>
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Tell Us About Your Business</span>
					<textarea
						name="message"
						rows="4"
						required
						placeholder="Retail shop, event organizer, distributor — what are you looking for?"
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
					{submitting ? 'Submitting…' : 'Submit Inquiry'}
				</button>
			</form>
		{/if}
	</AnimatedReveal>
</section>
