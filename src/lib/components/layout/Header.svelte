<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import PromoBar from '$lib/components/layout/PromoBar.svelte';
	import MegaMenu from '$lib/components/navigation/MegaMenu.svelte';
	import CartDrawer from '$lib/components/cart/CartDrawer.svelte';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import MobileNavDrawer from '$lib/components/layout/MobileNavDrawer.svelte';
	import DealBadge from '$lib/components/commerce/DealBadge.svelte';
	import AccountMenu from '$lib/components/navigation/AccountMenu.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { search } from '$lib/stores/search.svelte';
	import { resolvePath } from '$lib/utils/paths';

	let mobileOpen = $state(false);
	let notificationsOpen = $state(false);
	let accountMenuOpen = $state(false);
	let shopMenuOpen = $state(false);
	let partsMenuOpen = $state(false);
	let communityMenuOpen = $state(false);
	let shopMenuPinned = $state(false);
	let partsMenuPinned = $state(false);
	let communityMenuPinned = $state(false);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let headerShell = $state<HTMLDivElement | null>(null);
	let accountMenuRoot = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!headerShell) return;

		const syncHeaderHeight = () => {
			document.documentElement.style.setProperty(
				'--site-header-height',
				`${headerShell!.offsetHeight}px`
			);
		};

		syncHeaderHeight();
		const observer = new ResizeObserver(syncHeaderHeight);
		observer.observe(headerShell);

		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty('--site-header-height');
		};
	});

	function closeMenus() {
		shopMenuOpen = false;
		partsMenuOpen = false;
		communityMenuOpen = false;
		shopMenuPinned = false;
		partsMenuPinned = false;
		communityMenuPinned = false;
	}

	function scheduleClose() {
		if (shopMenuPinned || partsMenuPinned || communityMenuPinned) return;
		clearTimeout(closeTimer);
		closeTimer = setTimeout(closeMenus, 120);
	}

	function cancelClose() {
		clearTimeout(closeTimer);
	}

	function openShopMenu() {
		cancelClose();
		partsMenuOpen = false;
		partsMenuPinned = false;
		communityMenuOpen = false;
		communityMenuPinned = false;
		shopMenuOpen = true;
	}

	function openPartsMenu() {
		cancelClose();
		shopMenuOpen = false;
		shopMenuPinned = false;
		communityMenuOpen = false;
		communityMenuPinned = false;
		partsMenuOpen = true;
	}

	function openCommunityMenu() {
		cancelClose();
		shopMenuOpen = false;
		shopMenuPinned = false;
		partsMenuOpen = false;
		partsMenuPinned = false;
		communityMenuOpen = true;
	}

	function toggleShopMenu() {
		if (shopMenuOpen && shopMenuPinned) {
			closeMenus();
		} else {
			shopMenuPinned = true;
			openShopMenu();
		}
	}

	function togglePartsMenu() {
		if (partsMenuOpen && partsMenuPinned) {
			closeMenus();
		} else {
			partsMenuPinned = true;
			openPartsMenu();
		}
	}

	function toggleCommunityMenu() {
		if (communityMenuOpen && communityMenuPinned) {
			closeMenus();
		} else {
			communityMenuPinned = true;
			openCommunityMenu();
		}
	}

	$effect(() => {
		cart.init();
	});

	$effect(() => {
		// Close menus on route change
		$page.url.pathname;
		$page.url.search;
		closeMenus();
		mobileOpen = false;
		notificationsOpen = false;
		accountMenuOpen = false;
		cart.closeDrawer();
	});

	const communityPaths = ['/loyalty', '/guides', '/events', '/watch', '/builds', '/media'];
	const isCommunityActive = $derived(
		communityPaths.some((p) => $page.url.pathname === p || $page.url.pathname.startsWith(`${p}/`))
	);

	const session = $derived($page.data.session);
	const notificationCount = $derived($page.data.notificationCount ?? 0);

	const headerIconBtn =
		'relative inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-zinc-400 transition hover:text-white';
	const headerBadgeClass =
		'pointer-events-none absolute end-0 top-0 flex h-4 min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold leading-none text-white';
	const activeMenu = $derived(shopMenuOpen ? 'shop' : partsMenuOpen ? 'parts' : null);
	const dealsHref = $derived(
		session ? resolve('/deals') : resolvePath('/auth/sign-in?redirect=/deals')
	);

	const shopCategories = [
		{ label: 'All Shop', href: '/shop' },
		{ label: 'Tees', href: '/shop?category=TEES' },
		{ label: 'Hoodies', href: '/shop?category=SWEATSHIRTS' },
		{ label: 'Jackets', href: '/shop?category=JACKETS' },
		{ label: 'Headwear', href: '/shop?category=HEADWEAR' },
		{ label: 'Accessories', href: '/shop?category=ACCESSORIES' },
		{ label: 'Home', href: '/shop?category=HOME' },
		{ label: 'Auto', href: '/shop?category=AUTO' },
		{ label: 'Gift Cards', href: '/gift-cards' }
	] as const;

	const communityLinks = $derived([
		{ label: 'Loyalty', href: resolve('/loyalty') },
		{ label: 'Guides', href: resolve('/guides') },
		{ label: 'Events', href: resolve('/events') },
		{ label: 'Watch', href: resolve('/watch') },
		{ label: 'Builds', href: resolve('/builds') },
		{ label: 'Media', href: resolve('/media') }
	] as const);

	function closeMobileNav() {
		mobileOpen = false;
	}

	function openMobileNav() {
		cart.closeDrawer();
		mobileOpen = true;
	}

	function openCart() {
		closeMobileNav();
		closeMenus();
		cart.openDrawer();
	}

	function toggleCart() {
		if (cart.drawerOpen) {
			cart.closeDrawer();
		} else {
			openCart();
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			closeMenus();
			closeMobileNav();
			notificationsOpen = false;
			accountMenuOpen = false;
			cart.closeDrawer();
		}
	}}
/>

<div class="fixed inset-x-0 top-0 z-50" bind:this={headerShell}>
	<PromoBar />

	<header class="relative border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
		<div
			class="relative mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 px-4 py-3 sm:gap-x-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,1fr)] lg:gap-x-4 lg:px-8 lg:py-4"
		>
			<button
				type="button"
				class="z-10 inline-flex size-9 shrink-0 items-center justify-center text-zinc-300 transition hover:text-white lg:hidden"
				aria-label="Open menu"
				aria-expanded={mobileOpen}
				onclick={openMobileNav}
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			<a
				href={resolve('/')}
				class="group flex min-w-0 items-center justify-center gap-2 justify-self-center lg:justify-self-start"
			>
				<span
					class="flex size-9 shrink-0 items-center justify-center bg-red-600 text-sm font-black tracking-tighter text-white transition-transform group-hover:scale-105"
					>AG</span
				>
				<span
					class="hidden truncate font-display text-lg font-bold uppercase tracking-widest text-white sm:block"
				>
					Animal Garage
				</span>
			</a>

			<nav
				class="hidden min-w-0 items-center gap-4 overflow-hidden lg:flex lg:justify-self-center lg:pe-2"
				aria-label="Main"
			>
				<div
					class="relative inline-flex min-w-0 max-w-full shrink items-center gap-0.5"
					onmouseenter={openShopMenu}
					onmouseleave={scheduleClose}
				>
					<a
						href={resolve('/shop')}
						class="truncate text-sm font-medium uppercase tracking-wider transition-colors {activeMenu ===
						'shop'
							? 'text-white'
							: 'text-zinc-400 hover:text-white'}"
					>
						Shop
					</a>
					<button
						type="button"
						class="rounded-sm p-0.5 text-zinc-500 transition hover:text-white {shopMenuOpen
							? 'text-white'
							: ''}"
						aria-expanded={shopMenuOpen}
						aria-haspopup="menu"
						aria-label="Open shop menu"
						onclick={toggleShopMenu}
					>
						<svg
							class="h-3.5 w-3.5 transition {shopMenuOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>

				<div
					class="relative inline-flex min-w-0 max-w-full shrink items-center gap-0.5"
					onmouseenter={openPartsMenu}
					onmouseleave={scheduleClose}
				>
					<a
						href={resolve('/parts')}
						class="truncate text-sm font-medium uppercase tracking-wider transition-colors {activeMenu ===
						'parts'
							? 'text-white'
							: 'text-zinc-400 hover:text-white'}"
					>
						Parts
					</a>
					<button
						type="button"
						class="rounded-sm p-0.5 text-zinc-500 transition hover:text-white {partsMenuOpen
							? 'text-white'
							: ''}"
						aria-expanded={partsMenuOpen}
						aria-haspopup="menu"
						aria-label="Open parts menu"
						onclick={togglePartsMenu}
					>
						<svg
							class="h-3.5 w-3.5 transition {partsMenuOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>

				<div
					class="relative inline-flex min-w-0 max-w-full shrink items-center gap-0.5"
					onmouseenter={openCommunityMenu}
					onmouseleave={scheduleClose}
				>
					<a
						href={resolve('/builds')}
						class="truncate text-sm font-medium uppercase tracking-wider transition-colors {communityMenuOpen ||
						isCommunityActive
							? 'text-white'
							: 'text-zinc-400 hover:text-white'}"
					>
						Community
					</a>
					<button
						type="button"
						class="rounded-sm p-0.5 text-zinc-500 transition hover:text-white {communityMenuOpen
							? 'text-white'
							: ''}"
						aria-expanded={communityMenuOpen}
						aria-haspopup="menu"
						aria-label="Open community menu"
						onclick={toggleCommunityMenu}
					>
						<svg
							class="h-3.5 w-3.5 transition {communityMenuOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if communityMenuOpen}
						<div
							class="absolute left-0 top-full z-50 mt-1 min-w-[13rem] overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-2 shadow-2xl"
							role="menu"
							onmouseenter={cancelClose}
							onmouseleave={scheduleClose}
						>
							<p class="px-4 pb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
								Community
							</p>
							<ul>
								{#each communityLinks as link (link.href)}
									<li role="none">
										<a
											href={link.href}
											role="menuitem"
											class="block px-4 py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-900/80 hover:text-red-400 {$page
												.url.pathname === link.href ||
											$page.url.pathname.startsWith(`${link.href}/`)
												? 'bg-zinc-900/50 text-red-400'
												: ''}"
											onclick={closeMenus}
										>
											{link.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				<a
					href={dealsHref}
					class="inline-flex min-w-0 max-w-full shrink items-center gap-1.5 truncate text-sm font-medium uppercase tracking-wider transition-colors {$page
						.url.pathname === '/deals'
						? 'text-red-500'
						: 'text-zinc-400 hover:text-white'}"
					aria-label={session ? 'Pit Lane Deals' : 'Sign in to view Pit Lane Deals'}
				>
					Pit Lane Deals
					{#if !session}
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					{/if}
					<DealBadge />
				</a>
			</nav>

			<div
				class="isolate z-10 flex shrink-0 items-center gap-1.5 justify-self-end sm:gap-2 lg:ps-2"
			>
				{#if session}
					<div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
						<div class="relative isolate shrink-0">
							<button
								type="button"
								class="{headerIconBtn} size-9"
								aria-label="Notifications"
								aria-expanded={notificationsOpen}
								aria-haspopup="menu"
								onclick={() => {
									accountMenuOpen = false;
									notificationsOpen = !notificationsOpen;
								}}
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/>
								</svg>
								{#if notificationCount > 0}
									<span class={headerBadgeClass}>
										{notificationCount > 9 ? '9+' : notificationCount}
									</span>
								{/if}
							</button>
							{#if notificationsOpen}
								<div
									class="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-3 shadow-2xl"
									role="menu"
								>
									<p class="px-4 text-sm text-zinc-400">No notifications yet</p>
								</div>
							{/if}
						</div>
						<div class="relative isolate shrink-0" bind:this={accountMenuRoot}>
							<button
								type="button"
								class="hidden min-h-9 shrink-0 items-center px-2 text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white lg:inline-flex"
								aria-label="Account menu"
								aria-expanded={accountMenuOpen}
								aria-haspopup="menu"
								aria-controls="account-menu"
								onclick={() => {
									notificationsOpen = false;
									accountMenuOpen = !accountMenuOpen;
								}}
							>
								Account
							</button>
							<button
								type="button"
								class="{headerIconBtn} size-9 lg:hidden"
								aria-label="Account menu"
								aria-expanded={accountMenuOpen}
								aria-haspopup="menu"
								aria-controls="account-menu"
								onclick={() => {
									notificationsOpen = false;
									accountMenuOpen = !accountMenuOpen;
								}}
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</button>
							<AccountMenu
								open={accountMenuOpen}
								onclose={() => (accountMenuOpen = false)}
								container={accountMenuRoot}
							/>
						</div>
					</div>
				{:else}
					<a
						href={resolve('/auth/sign-in')}
						class="hidden min-h-9 shrink-0 items-center px-2 text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white lg:inline-flex"
					>
						Sign In
					</a>
					<a
						href={resolve('/auth/sign-in')}
						class="{headerIconBtn} size-9 lg:hidden"
						aria-label="Sign In"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</a>
				{/if}
				<button
					type="button"
					class="{headerIconBtn} size-9"
					aria-label="Search"
					onclick={() => search.openModal()}
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
				<button
					type="button"
					class="{headerIconBtn} size-9"
					aria-label="Cart"
					onclick={toggleCart}
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					{#if cart.itemCount > 0}
						<span class={headerBadgeClass}>
							{cart.itemCount > 9 ? '9+' : cart.itemCount}
						</span>
					{/if}
				</button>
				<div class="hidden shrink-0 lg:block">
					<LocaleSelector />
				</div>
			</div>
		</div>

		{#if shopMenuOpen}
			<MegaMenu
				type="shop"
				open={shopMenuOpen}
				onclose={closeMenus}
				onhover={cancelClose}
				onleave={scheduleClose}
			/>
		{:else if partsMenuOpen}
			<MegaMenu
				type="parts"
				open={partsMenuOpen}
				onclose={closeMenus}
				onhover={cancelClose}
				onleave={scheduleClose}
			/>
		{/if}
	</header>

	<MobileNavDrawer
		open={mobileOpen}
		{session}
		{dealsHref}
		{shopCategories}
		{communityLinks}
		onclose={closeMobileNav}
		onopencart={openCart}
	/>
</div>

<CartDrawer open={cart.drawerOpen} onclose={() => cart.closeDrawer()} />
<SearchModal />
