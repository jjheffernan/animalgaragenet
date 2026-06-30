<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/shop', label: 'Shop' },
		{ href: '/media', label: 'Media' },
		{ href: '/about', label: 'About' }
	];

	let mobileOpen = $state(false);
</script>

<header class="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
		<a href="/" class="group flex items-center gap-2">
			<span
				class="flex h-9 w-9 items-center justify-center bg-red-600 text-sm font-black tracking-tighter text-white transition-transform group-hover:scale-105"
				>AG</span
			>
			<span class="hidden font-display text-lg font-bold uppercase tracking-widest text-white sm:block">
				Animal Garage
			</span>
		</a>

		<nav class="hidden items-center gap-8 md:flex" aria-label="Main">
			{#each links as link}
				<a
					href={link.href}
					class="text-sm font-medium uppercase tracking-wider transition-colors {$page.url.pathname ===
					link.href
						? 'text-red-500'
						: 'text-zinc-400 hover:text-white'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-4">
			<a
				href="/shop"
				class="hidden rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-500 sm:inline-block"
			>
				Shop Now
			</a>
			<button
				type="button"
				class="md:hidden text-zinc-300"
				aria-label="Toggle menu"
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					/>
				</svg>
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<nav class="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden" aria-label="Mobile">
			{#each links as link}
				<a
					href={link.href}
					class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300 hover:text-white"
					onclick={() => (mobileOpen = false)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
