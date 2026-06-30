<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import BuildLogForm from '$lib/components/forms/BuildLogForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let saving = $state(false);
</script>

<svelte:head>
	<title>New Build Log — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">New Build Log</h1>
<p class="mt-1 text-sm text-zinc-400">
	Save a draft anytime. Submit when ready for admin approval.
</p>

{#if form?.success}
	<div class="mt-6 rounded-sm border border-emerald-900/50 bg-emerald-950/30 px-4 py-4">
		<p class="text-sm text-emerald-300">{form.message}</p>
		<a
			href={resolve('/account/builds')}
			class="mt-3 inline-block text-sm text-red-500 hover:text-red-400">← My build logs</a
		>
	</div>
{:else}
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
		<BuildLogForm email={data.user.email} errors={form?.errors} />

		<div class="flex flex-wrap gap-3">
			<button
				type="submit"
				formaction="?/saveDraft"
				disabled={saving}
				class="rounded-sm border border-zinc-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white disabled:opacity-50"
			>
				Save draft
			</button>
			<button
				type="submit"
				formaction="?/submit"
				disabled={saving}
				class="rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
			>
				Submit for review
			</button>
		</div>
	</form>
{/if}
