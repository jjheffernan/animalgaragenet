<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
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
	<title>Submit a Build — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Submit Your Build</h1>
		<p class="mt-4 text-zinc-400">
			Share your ride with the Garage Squad. Approved builds earn XP and may be featured on the site.
		</p>

		{#if form?.success}
			<div class="mt-8 rounded-sm border border-emerald-900/50 bg-emerald-950/30 px-4 py-4">
				<p class="text-sm font-bold uppercase tracking-wider text-emerald-400">Pending review</p>
				<p class="mt-2 text-sm text-emerald-300/90">{form.message}</p>
			</div>
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
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Build Title</span>
					<input
						type="text"
						name="title"
						value={form?.title ?? ''}
						required
						placeholder="Project Fox"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('title') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('title')}
						<p class="mt-1 text-xs text-red-500">{fieldError('title')}</p>
					{/if}
				</label>

				<div class="grid gap-4 sm:grid-cols-2">
					<label class="block">
						<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Year</span>
						<input
							type="number"
							name="year"
							value={form?.year ?? ''}
							required
							min="1900"
							max="2099"
							placeholder="2020"
							class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('year') ? 'border-red-600' : ''}"
						/>
						{#if fieldError('year')}
							<p class="mt-1 text-xs text-red-500">{fieldError('year')}</p>
						{/if}
					</label>
					<label class="block">
						<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Make</span>
						<input
							type="text"
							name="make"
							value={form?.make ?? ''}
							required
							placeholder="Honda"
							class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('make') ? 'border-red-600' : ''}"
						/>
						{#if fieldError('make')}
							<p class="mt-1 text-xs text-red-500">{fieldError('make')}</p>
						{/if}
					</label>
				</div>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Model</span>
					<input
						type="text"
						name="model"
						value={form?.model ?? ''}
						required
						placeholder="Civic"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('model') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('model')}
						<p class="mt-1 text-xs text-red-500">{fieldError('model')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</span>
					<input
						type="email"
						name="email"
						value={form?.email ?? ''}
						required
						placeholder="you@example.com"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('email') ? 'border-red-600' : ''}"
					/>
					{#if fieldError('email')}
						<p class="mt-1 text-xs text-red-500">{fieldError('email')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</span>
					<textarea
						name="description"
						rows="4"
						required
						placeholder="Tell us about your build..."
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('description') ? 'border-red-600' : ''}"
					>{form?.description ?? ''}</textarea>
					{#if fieldError('description')}
						<p class="mt-1 text-xs text-red-500">{fieldError('description')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Mod List</span>
					<textarea
						name="modList"
						rows="4"
						required
						placeholder="One mod per line"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldError('modList') ? 'border-red-600' : ''}"
					>{form?.modList ?? ''}</textarea>
					{#if fieldError('modList')}
						<p class="mt-1 text-xs text-red-500">{fieldError('modList')}</p>
					{/if}
				</label>

				<button
					type="submit"
					disabled={submitting}
					class="w-full rounded-sm bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
				>
					{submitting ? 'Submitting…' : 'Submit Build'}
				</button>
			</form>
		{/if}

		<a href={resolve('/builds')} class="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">← Back to builds</a>
	</AnimatedReveal>
</section>
