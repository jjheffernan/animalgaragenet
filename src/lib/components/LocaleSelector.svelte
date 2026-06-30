<script lang="ts">
	import { locales, type LocaleCode } from '$lib/types/locale';
	import { locale } from '$lib/stores/locale.svelte';

	function handleChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value as LocaleCode;
		locale.setLocale(value);
	}
</script>

<div class="flex items-center gap-2 text-xs text-zinc-500">
	<label for="locale-select" class="sr-only">Region</label>
	<select
		id="locale-select"
		value={locale.code}
		onchange={handleChange}
		class="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300"
	>
		{#each locales as loc}
			<option value={loc.code}>{loc.label} ({loc.currency})</option>
		{/each}
	</select>
</div>
