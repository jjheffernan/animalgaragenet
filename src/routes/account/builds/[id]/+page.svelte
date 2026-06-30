<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import BuildLogForm from '$lib/components/BuildLogForm.svelte';
	import { BUILD_LOG_STATUS_LABELS } from '$lib/types/build-log';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let saving = $state(false);
</script>

<svelte:head>
	<title>Edit Build Log — Animal Garage</title>
</svelte:head>

<div class="flex flex-wrap items-center justify-between gap-3">
	<h1 class="font-display text-2xl font-bold uppercase text-white">Edit Build Log</h1>
	<span class="text-xs font-bold uppercase tracking-wider text-zinc-500">{BUILD_LOG_STATUS_LABELS[data.log.status]}</span>
</div>

{#if data.log.status === 'pending'}
	<p class="mt-2 text-sm text-amber-400/90">This build is awaiting admin approval.</p>
{:else if data.log.status === 'approved'}
	<p class="mt-2 text-sm text-zinc-400">Published edits require admin approval before going live.</p>
{/if}

{#if form?.success}
	<div class="mt-4 rounded-sm border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">{form.message}</div>
{/if}

<form
	method="POST"
	class="mt-8 space-y-6"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			saving = false;
			await update();
		};
	}}
>
	<BuildLogForm log={data.log} email={data.user.email} errors={form?.errors} />

	<div class="flex flex-wrap gap-3">
		<button
			type="submit"
			formaction="?/saveDraft"
			disabled={saving || data.log.status === 'pending' || data.log.status === 'approved'}
			class="rounded-sm border border-zinc-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white disabled:opacity-50"
		>
			Save draft
		</button>
		<button type="submit" formaction="?/submit" disabled={saving} class="rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50">
			{data.log.status === 'approved' ? 'Submit edits for review' : 'Submit for review'}
		</button>
		<a href={resolve('/account/builds')} class="text-sm text-zinc-400 transition hover:text-white">Cancel</a>
	</div>
</form>
