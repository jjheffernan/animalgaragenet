<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import PromoBar from './PromoBar.svelte';
	import MegaMenu from './MegaMenu.svelte';
	import CartDrawer from './CartDrawer.svelte';
	import SearchModal from './SearchModal.svelte';
	import LocaleSelector from './LocaleSelector.svelte';
	import DealBadge from './DealBadge.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { search } from '$lib/stores/search.svelte';

	let mobileOpen = $state(false);
	let shopMenuOpen = $state(false);
	let partsMenuOpen = $state(false);

	function openShopMenu() {
		partsMenuOpen = false;
		shopMenuOpen = true;
	}

	function openPartsMenu() {
		shopMenuOpen = false;
		partsMenuOpen = true;
	}

	function handleMenuFocusOut(e: FocusEvent, close: () => void) {
		const container = e.currentTarget as HTMLElement;
		const next = e.relatedTarget as Node | null;
		if (!next || !container.contains(next)) close();
	}

	$effect(() => {
		cart.init();
	});

	const session = $derived($page.data.session);

	const navLinks = [
		{ href: '/builds', label: 'Builds' },
		{ href: '/watch', label: 'Watch' },
		{ href: '/guides', label: 'Guides' },
		{ href: '/loyalty', label: 'Loyalty' }
	] as const;
</script>

<div class="fixed inset-x-0 top-0 z-50">
	<PromoBar />

	<header class="relative border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<a href={resolve('/')} class="group flex items-center gap-2">
				<span
					class="flex h-9 w-9 items-center justify-center bg-red-600 text-sm font-black tracking-tighter text-white transition-transform group-hover:scale-105"
				>AG</span>
				<span class="hidden font-display text-lg font-bold uppercase tracking-widest text-white sm:block">
					Animal Garage
				</span>
			</a>

			<nav class="hidden items-center gap-6 lg:flex" aria-label="Main">
				<div
					role="group"
					tabindex="-1"
					class="relative"
					onmouseenter={openShopMenu}
					onmouseleave={() => (shopMenuOpen = false)}
					onfocusin={openShopMenu}
					onfocusout={(e) => handleMenuFocusOut(e, () => (shopMenuOpen = false))}
				>
					<a
						href={resolve('/shop')}
						class="text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
					>
						Shop
					</a>
					<MegaMenu type="shop" open={shopMenuOpen} onclose={() => (shopMenuOpen = false)} />
				</div>
				<div
					role="group"
					tabindex="-1"
					class="relative"
					onmouseenter={openPartsMenu}
					onmouseleave={() => (partsMenuOpen = false)}
					onfocusin={openPartsMenu}
					onfocusout={(e) => handleMenuFocusOut(e, () => (partsMenuOpen = false))}
				>
					<a
						href={resolve('/parts')}
						class="text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
					>
						Parts
					</a>
					<MegaMenu type="parts" open={partsMenuOpen} onclose={() => (partsMenuOpen = false)} />
				</div>
				{#each navLinks as link (link.href)}
					<a
						href={resolve(link.href)}
						class="text-sm font-medium uppercase tracking-wider transition-colors {$page.url.pathname.startsWith(link.href)
							? 'text-red-500'
							: 'text-zinc-400 hover:text-white'}"
					>
						{link.label}
					</a>
				{/each}
				<a
					href={resolve('/deals')}
					class="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider transition-colors {$page.url.pathname === '/deals'
						? 'text-red-500'
						: 'text-zinc-400 hover:text-white'}"
				>
					Pit Lane Deals
					<DealBadge />
				</a>
			</nav>

			<div class="flex items-center gap-3 sm:gap-4">
				{#if session}
					<a
						href={resolve('/account')}
						class="hidden text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white sm:block"
					>
						Account
					</a>
				{:else}
					<a
						href={resolve('/auth/sign-in')}
						class="hidden text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white sm:block"
					>
						Sign In
					</a>
				{/if}
				<button
					type="button"
					class="text-zinc-400 hover:text-white"
					aria-label="Search"
					onclick={() => search.openModal()}
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>
				<button
					type="button"
					class="relative text-zinc-400 hover:text-white"
					aria-label="Cart"
					onclick={() => cart.toggleDrawer()}
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
					{#if cart.itemCount > 0}
						<span class="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
							{cart.itemCount > 9 ? '9+' : cart.itemCount}
						</span>
					{/if}
				</button>
				<div class="hidden sm:block">
					<LocaleSelector />
				</div>
				<button
					type="button"
					class="lg:hidden text-zinc-300"
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
			<nav class="border-t border-zinc-800 bg-zinc-950 px-4 py-4 lg:hidden" aria-label="Mobile">
				<a href={resolve('/shop')} class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>Shop</a>
				<a href={resolve('/parts')} class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>Parts</a>
				{#each navLinks as link (link.href)}
					<a href={resolve(link.href)} class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>{link.label}</a>
				{/each}
				<a href={resolve('/deals')} class="flex items-center gap-2 py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>
					Pit Lane Deals <DealBadge />
				</a>
				{#if session}
					<a href={resolve('/account')} class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>Account</a>
				{:else}
					<a href={resolve('/auth/sign-in')} class="block py-3 text-sm font-medium uppercase tracking-wider text-zinc-300" onclick={() => (mobileOpen = false)}>Sign In</a>
				{/if}
				<div class="mt-2 sm:hidden">
					<LocaleSelector />
				</div>
			</nav>
		{/if}
	</header>
</div>

<CartDrawer open={cart.drawerOpen} onclose={() => cart.closeDrawer()} />
<SearchModal />
