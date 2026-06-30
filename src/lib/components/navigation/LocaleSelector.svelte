<script lang="ts">
	import { locales, type LocaleCode } from '$lib/types/locale';
	import { getCurrencySymbol } from '$lib/i18n/currency';
	import { locale } from '$lib/stores/locale.svelte';

	interface Props {
		size?: 'sm' | 'lg';
		class?: string;
	}

	let { size = 'sm', class: className = '' }: Props = $props();

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	const current = $derived(locales.find((l) => l.code === locale.code) ?? locales[0]);
	const symbol = $derived(getCurrencySymbol(current.currency, current.code));

	function select(code: LocaleCode) {
		locale.setLocale(code);
		open = false;
	}

	function toggle() {
		open = !open;
	}

	$effect(() => {
		if (!open) return;
		const close = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) open = false;
		};
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
	});
</script>

<div class="relative {className}" bind:this={root}>
	<button
		type="button"
		class={size === 'lg'
			? 'flex min-h-12 w-full items-center justify-start gap-3 rounded-sm px-3 text-lg text-zinc-300 transition hover:text-white'
			: 'flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 text-base text-zinc-400 transition hover:text-white'}
		aria-label="Region: {current.label}"
		aria-expanded={open}
		aria-haspopup="listbox"
		onclick={toggle}
	>
		<span aria-hidden="true" class="{size === 'lg' ? 'text-2xl' : 'text-lg'} leading-none"
			>{current.flag}</span
		>
		<span class="{size === 'lg' ? 'text-xl' : 'text-base'} font-semibold">{symbol}</span>
		{#if size === 'lg'}
			<span class="text-base font-medium text-zinc-400">{current.label}</span>
		{/if}
	</button>

	{#if open}
		<ul
			class={size === 'lg'
				? 'absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-sm border border-zinc-800 bg-zinc-900 py-1 shadow-xl'
				: 'absolute right-0 top-full z-50 mt-1 max-h-64 w-52 overflow-y-auto rounded-sm border border-zinc-800 bg-zinc-900 py-1 shadow-xl'}
			role="listbox"
			aria-label="Select region"
		>
			{#each locales as loc (loc.code)}
				<li role="option" aria-selected={loc.code === locale.code}>
					<button
						type="button"
						class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-zinc-800 hover:text-white {loc.code ===
						locale.code
							? 'bg-zinc-800 text-white'
							: 'text-zinc-300'}"
						onclick={() => select(loc.code)}
					>
						<span aria-hidden="true">{loc.flag}</span>
						<span class="min-w-0 flex-1 truncate">{loc.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
