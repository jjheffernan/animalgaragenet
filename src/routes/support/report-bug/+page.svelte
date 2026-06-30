<script lang="ts">
	import { page } from '$app/state';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let category = $state('');
	let description = $state('');
	let steps = $state('');
	let pageUrl = $state('');
	let submitting = $state(false);
	let success = $state(false);
	let error = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string>>({});

	const isLoggedIn = $derived(Boolean(data.sessionEmail));

	$effect(() => {
		if (data.sessionEmail) {
			email = data.sessionEmail;
		}
	});

	$effect(() => {
		if (data.prefillUrl) {
			pageUrl = data.prefillUrl;
			return;
		}

		if (typeof document !== 'undefined' && document.referrer) {
			try {
				const ref = new URL(document.referrer);
				if (ref.origin === page.url.origin) {
					pageUrl = `${ref.pathname}${ref.search}${ref.hash}`;
				}
			} catch {
				// ignore invalid referrer
			}
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		error = null;
		fieldErrors = {};

		const payload: Record<string, string> = {
			category,
			description,
			steps,
			pageUrl
		};
		if (!isLoggedIn || email !== data.sessionEmail) {
			payload.email = email;
		}

		try {
			const response = await fetch('/api/support/bug-report', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const body = (await response.json()) as { ok?: boolean; error?: string; id?: string };

			if (!response.ok) {
				error = body.error ?? 'Unable to submit bug report. Please try again.';
				return;
			}

			success = true;
		} catch {
			error = 'Network error — please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Report a Bug — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Report a Bug</h1>
		<p class="mt-4 text-zinc-400">
			Something broken on the site? Tell us what happened and we will triage it. Include steps so we
			can reproduce the issue.
		</p>

		{#if success}
			<p
				class="mt-10 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400"
			>
				Thanks — your report was received. We will follow up at
				{isLoggedIn ? data.sessionEmail : email || 'your email'} if we need more detail.
			</p>
			<p class="mt-6 text-sm text-zinc-500">
				Need help right away? <a href="/contact" class="text-red-500 hover:underline">Contact us</a>
				or join our Discord for faster support.
			</p>
		{:else}
			<form class="mt-10 space-y-6" onsubmit={handleSubmit}>
				{#if error}
					<p class="text-sm text-red-500">{error}</p>
				{/if}

				{#if isLoggedIn}
					<p class="text-sm text-zinc-500">
						Signed in as <span class="text-zinc-400">{data.sessionEmail}</span>. We will use your
						account email unless you enter a different one below.
					</p>
				{/if}

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">
						Email{#if !isLoggedIn}<span class="text-red-500"> *</span>{/if}
					</span>
					<input
						type="email"
						name="email"
						bind:value={email}
						required={!isLoggedIn}
						placeholder={isLoggedIn ? 'Optional — defaults to account email' : ''}
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldErrors.email
							? 'border-red-600'
							: ''}"
					/>
					{#if fieldErrors.email}
						<p class="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">
						Category <span class="text-red-500">*</span>
					</span>
					<select
						name="category"
						bind:value={category}
						required
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldErrors.category
							? 'border-red-600'
							: ''}"
					>
						<option value="" disabled>Select a category</option>
						{#each data.categories as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					{#if fieldErrors.category}
						<p class="mt-1 text-xs text-red-500">{fieldErrors.category}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"> Page URL </span>
					<input
						type="text"
						name="pageUrl"
						bind:value={pageUrl}
						placeholder="Where you saw the bug (auto-filled when possible)"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
					/>
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">
						What went wrong? <span class="text-red-500">*</span>
					</span>
					<textarea
						name="description"
						rows="4"
						bind:value={description}
						required
						placeholder="Describe the bug — what did you expect vs what happened?"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldErrors.description
							? 'border-red-600'
							: ''}"></textarea>
					{#if fieldErrors.description}
						<p class="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
					{/if}
				</label>

				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">
						Steps to reproduce <span class="text-red-500">*</span>
					</span>
					<textarea
						name="steps"
						rows="4"
						bind:value={steps}
						required
						placeholder="1. Go to… 2. Click… 3. See error"
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none {fieldErrors.steps
							? 'border-red-600'
							: ''}"></textarea>
					{#if fieldErrors.steps}
						<p class="mt-1 text-xs text-red-500">{fieldErrors.steps}</p>
					{/if}
				</label>

				<button
					type="submit"
					disabled={submitting}
					class="w-full rounded-sm bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
				>
					{submitting ? 'Submitting…' : 'Submit Bug Report'}
				</button>
			</form>
		{/if}
	</AnimatedReveal>
</section>
