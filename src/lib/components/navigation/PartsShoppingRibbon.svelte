<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PartsNavSections from '$lib/components/navigation/PartsNavSections.svelte';
	import { buildPartsFilterUrl, parsePartsFilters } from '$lib/data/parts-filters';
	import {
		catalogRibbonInnerClass,
		catalogRibbonNavClass,
		catalogRibbonShellClass,
		categoryPillClass
	} from '$lib/ui/catalog-ribbon';
	import type { Brand, PartCategory, PopularModel } from '$lib/types/domain';
	import { resolvePath } from '$lib/utils/paths';

	interface Props {
		categories: PartCategory[];
		brands: Brand[];
		popularModels: PopularModel[];
	}

	let { categories, brands, popularModels }: Props = $props();

	let ribbonShell = $state<HTMLElement | null>(null);
	let openMenu = $state<string | null>(null);
	let pinnedMenu = $state<string | null>(null);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const filters = $derived(parsePartsFilters(page.url));
	const pathname = $derived(page.url.pathname);
	const searchParams = $derived(page.url.searchParams);

	$effect(() => {
		if (!ribbonShell) return;

		const syncRibbonHeight = () => {
			document.documentElement.style.setProperty(
				'--parts-ribbon-height',
				`${ribbonShell!.offsetHeight}px`
			);
		};

		syncRibbonHeight();
		const observer = new ResizeObserver(syncRibbonHeight);
		observer.observe(ribbonShell);

		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty('--parts-ribbon-height');
		};
	});

	$effect(() => {
		page.url.pathname;
		page.url.search;
		closeMenus();
	});

	function closeMenus() {
		openMenu = null;
		pinnedMenu = null;
	}

	function scheduleClose() {
		if (pinnedMenu) return;
		clearTimeout(closeTimer);
		closeTimer = setTimeout(closeMenus, 120);
	}

	function cancelClose() {
		clearTimeout(closeTimer);
	}

	function openDropdown(id: string) {
		cancelClose();
		if (pinnedMenu && pinnedMenu !== id) {
			pinnedMenu = null;
		}
		openMenu = id;
	}

	function toggleDropdown(id: string) {
		if (openMenu === id && pinnedMenu === id) {
			closeMenus();
		} else {
			pinnedMenu = id;
			openDropdown(id);
		}
	}

	function filterHref(updates: Parameters<typeof buildPartsFilterUrl>[2]) {
		return resolvePath(buildPartsFilterUrl(pathname, searchParams, updates));
	}

	function isActiveFilter(key: string, value?: string) {
		if (key === 'build') return filters.build === value;
		if (key === 'brand') return filters.brand === value;
		return false;
	}

	const chevronClass = 'h-3.5 w-3.5 shrink-0 transition';

	const dropdownPanels = [
		{
			id: 'categories',
			label: 'Product Categories',
			section: 'categories' as const,
			width: 'w-[min(100vw-2rem,22rem)]',
			align: 'left-0',
			iconPaths: [
				'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
			]
		},
		{
			id: 'brands',
			label: 'Shop by Brand',
			section: 'brands' as const,
			width: 'w-56',
			align: 'left-0',
			iconPaths: [
				'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
			]
		},
		{
			id: 'vehicle',
			label: 'Shop by Vehicle',
			section: 'vehicle' as const,
			width: 'w-[min(100vw-2rem,24rem)]',
			align: 'left-0',
			iconPaths: [
				'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z',
				'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1v-1m4-8h2a1 1 0 011 1v4a1 1 0 01-1 1h-1'
			]
		},
		{
			id: 'build',
			label: 'Build Type',
			section: 'build' as const,
			width: 'w-64',
			align: 'right-0',
			iconPaths: ['M13 10V3L4 14h7v7l9-11h-7z']
		}
	];
</script>

<div bind:this={ribbonShell} class="{catalogRibbonShellClass} overflow-visible">
	<div class="{catalogRibbonInnerClass} overflow-visible">
		<nav
			class="{catalogRibbonNavClass} flex-wrap items-center sm:flex-nowrap"
			aria-label="Parts shopping"
		>
			<a
				href={resolve('/parts')}
				class="{categoryPillClass(pathname === '/parts')} flex items-center gap-2"
			>
				<svg
					class="h-4 w-4 shrink-0 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span>Shop Parts</span>
			</a>

			<a href={resolve('/shop')} class="{categoryPillClass(false)} flex items-center gap-2">
				<svg
					class="h-4 w-4 shrink-0 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
				<span>Merch</span>
				<svg
					class="{chevronClass} text-zinc-500 group-hover:text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>

			{#each dropdownPanels as panel (panel.id)}
				<div
					class="relative shrink-0"
					onmouseenter={() => openDropdown(panel.id)}
					onmouseleave={scheduleClose}
				>
					<button
						type="button"
						class="{categoryPillClass(openMenu === panel.id)} flex items-center gap-2"
						aria-expanded={openMenu === panel.id}
						aria-haspopup="menu"
						onclick={() => toggleDropdown(panel.id)}
					>
						<svg
							class="h-4 w-4 shrink-0 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							{#each panel.iconPaths as iconPath (iconPath)}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d={iconPath}
								/>
							{/each}
						</svg>
						<span>{panel.label}</span>
						<svg
							class="{chevronClass} text-zinc-500 {openMenu === panel.id
								? 'rotate-90 text-white'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>

					{#if openMenu === panel.id}
						<div
							class="absolute {panel.align} top-full z-50 pt-1"
							role="presentation"
							onmouseenter={cancelClose}
							onmouseleave={scheduleClose}
						>
							<div
								class="{panel.width} overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-2 shadow-2xl {panel.section ===
								'vehicle'
									? 'p-0'
									: ''}"
								role="menu"
							>
								<PartsNavSections
									layout="dropdown"
									section={panel.section}
									{categories}
									{brands}
									{popularModels}
									{filterHref}
									{isActiveFilter}
									onNavigate={closeMenus}
								/>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</nav>
	</div>
</div>
