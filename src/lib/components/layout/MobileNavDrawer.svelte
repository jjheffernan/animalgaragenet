<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import SideDrawer from '$lib/components/layout/SideDrawer.svelte';
	import DealBadge from '$lib/components/commerce/DealBadge.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import PartsNavSections from '$lib/components/navigation/PartsNavSections.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { search } from '$lib/stores/search.svelte';
	import { buildPartsFilterUrl } from '$lib/data/parts-filters';
	import { categoryPillClass } from '$lib/ui/catalog-ribbon';
	import { resolvePath } from '$lib/utils/paths';

	type PartsTab = 'categories' | 'vehicle' | 'brands' | 'build';

	const partsTabs: { id: PartsTab; label: string }[] = [
		{ id: 'categories', label: 'Shop by Category' },
		{ id: 'vehicle', label: 'Shop by Vehicle' },
		{ id: 'brands', label: 'Shop by Brand' },
		{ id: 'build', label: 'Shop by Build' }
	];

	interface Props {
		open: boolean;
		session: { email?: string | null } | null;
		dealsHref: string;
		shopCategories: readonly { label: string; href: string }[];
		communityLinks: readonly { label: string; href: string }[];
		onclose: () => void;
		onopencart: () => void;
	}

	let { open, session, dealsHref, shopCategories, communityLinks, onclose, onopencart }: Props =
		$props();

	let shopOpen = $state(false);
	let partsOpen = $state(false);
	let communityOpen = $state(false);
	let activePartsTab = $state<PartsTab>('categories');

	const partsNav = $derived($page.data.partsNav);

	function partsFilterHref(updates: Parameters<typeof buildPartsFilterUrl>[2]) {
		return resolvePath(buildPartsFilterUrl('/parts', new URLSearchParams(), updates));
	}

	function toggle(section: 'shop' | 'parts' | 'community') {
		if (section === 'shop') shopOpen = !shopOpen;
		if (section === 'parts') partsOpen = !partsOpen;
		if (section === 'community') communityOpen = !communityOpen;
	}

	function closeAnd(fn?: () => void) {
		onclose();
		fn?.();
	}

	$effect(() => {
		if (!open) {
			shopOpen = false;
			partsOpen = false;
			communityOpen = false;
			activePartsTab = 'categories';
		}
	});

	$effect(() => {
		if (!partsOpen) {
			activePartsTab = 'categories';
		}
	});
</script>

{#snippet drawerHeader()}
	<div class="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-4">
		<a href={resolve('/')} class="group flex items-center gap-2" onclick={onclose}>
			<span
				class="flex h-9 w-9 items-center justify-center bg-red-600 text-sm font-black tracking-tighter text-white"
			>AG</span>
			<span class="font-display text-sm font-bold uppercase tracking-widest text-white">Animal Garage</span>
		</a>
		<button
			type="button"
			class="p-2 text-zinc-400 transition hover:text-white"
			aria-label="Close menu"
			onclick={onclose}
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/snippet}

{#snippet drawerBody()}
	<nav class="flex-1 overflow-y-auto px-5 py-2" aria-label="Mobile">
		<ul class="divide-y divide-zinc-800">
			<li>
				<button
					type="button"
					class="flex w-full items-center justify-between py-4 text-left font-display text-lg font-bold uppercase tracking-wide text-white"
					aria-expanded={shopOpen}
					onclick={() => toggle('shop')}
				>
					Shop
					<span class="text-2xl font-light leading-none text-zinc-500">{shopOpen ? '−' : '+'}</span>
				</button>
				{#if shopOpen}
					<ul class="space-y-1 pb-4 pl-1">
						{#each shopCategories as cat (cat.href)}
							<li>
								<a
									href={resolvePath(cat.href)}
									class="block py-2 text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-red-400"
									onclick={onclose}
								>
									{cat.label}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>

			<li>
				<button
					type="button"
					class="flex w-full items-center justify-between py-4 text-left font-display text-lg font-bold uppercase tracking-wide text-white"
					aria-expanded={partsOpen}
					onclick={() => toggle('parts')}
				>
					Parts
					<span class="text-2xl font-light leading-none text-zinc-500">{partsOpen ? '−' : '+'}</span>
				</button>
				{#if partsOpen && partsNav}
					<div class="pb-4 pl-1">
						<div
							class="-mx-1 mb-3 flex gap-1.5 overflow-x-auto border-b border-zinc-800 pb-3 scrollbar-thin"
							role="tablist"
							aria-label="Parts shopping modes"
						>
							{#each partsTabs as tab (tab.id)}
								<button
									type="button"
									role="tab"
									aria-selected={activePartsTab === tab.id}
									class="shrink-0 {categoryPillClass(activePartsTab === tab.id)}"
									onclick={() => (activePartsTab = tab.id)}
								>
									{tab.label}
								</button>
							{/each}
						</div>
						<div role="tabpanel">
							<PartsNavSections
								layout="mobile"
								section={activePartsTab}
								categories={partsNav.categories}
								brands={partsNav.brands}
								popularModels={partsNav.popularModels}
								filterHref={partsFilterHref}
								onNavigate={onclose}
							/>
						</div>
					</div>
				{/if}
			</li>

			<li>
				<button
					type="button"
					class="flex w-full items-center justify-between py-4 text-left font-display text-lg font-bold uppercase tracking-wide text-white"
					aria-expanded={communityOpen}
					onclick={() => toggle('community')}
				>
					Community
					<span class="text-2xl font-light leading-none text-zinc-500">{communityOpen ? '−' : '+'}</span>
				</button>
				{#if communityOpen}
					<ul class="space-y-1 pb-4 pl-1">
						{#each communityLinks as link (link.href)}
							<li>
								<a
									href={link.href}
									class="block py-2 text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-red-400 {$page.url.pathname === link.href ||
									$page.url.pathname.startsWith(`${link.href}/`)
										? 'text-red-400'
										: ''}"
									onclick={onclose}
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>

			<li>
				<a
					href={dealsHref}
					class="flex items-center gap-2 py-4 font-display text-lg font-bold uppercase tracking-wide text-white transition hover:text-red-400"
					onclick={onclose}
				>
					Pit Lane Deals
					{#if !session}
						<svg class="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
			</li>
		</ul>
	</nav>
{/snippet}

{#snippet drawerFooter()}
	<div class="shrink-0 border-t border-zinc-800 px-5 py-4">
		<ul class="space-y-3">
			<li>
				<button
					type="button"
					class="text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
					onclick={() => closeAnd(() => search.openModal())}
				>
					Search
				</button>
			</li>
			<li>
				<button
					type="button"
					class="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
					onclick={() => closeAnd(onopencart)}
				>
					Cart
					{#if cart.itemCount > 0}
						<span class="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
							{cart.itemCount > 9 ? '9+' : cart.itemCount}
						</span>
					{/if}
				</button>
			</li>
			{#if session}
				<li>
					<a
						href={resolve('/account')}
						class="text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
						onclick={onclose}
					>
						Account
					</a>
				</li>
			{:else}
				<li>
					<a
						href={resolvePath('/auth/sign-in')}
						class="text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:text-white"
						onclick={onclose}
					>
						Sign In
					</a>
				</li>
			{/if}
			<li class="pt-1">
				<LocaleSelector size="lg" />
			</li>
		</ul>
	</div>
{/snippet}

<SideDrawer
	{open}
	side="left"
	{onclose}
	ariaLabel="Mobile navigation"
	mobileOnly
	wide
	header={drawerHeader}
	children={drawerBody}
	footer={drawerFooter}
/>
