<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { ADMIN_NAV, type AdminNavItem } from '$lib/admin/nav';
	import type { AdminNavCounts } from '$lib/server/admin/nav-counts';

	interface Props {
		navCounts: AdminNavCounts;
		onNavigate?: () => void;
	}

	let { navCounts, onNavigate }: Props = $props();

	function isActive(href: string, exact = false): boolean {
		const path = $page.url.pathname;
		if (exact) return path === href;
		return path.startsWith(href);
	}

	function linkClass(href: string, exact = false): string {
		const base = 'flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition';
		return isActive(href, exact)
			? `${base} bg-red-600 font-medium text-white`
			: `${base} text-zinc-400 hover:bg-zinc-800 hover:text-white`;
	}

	function pendingCount(item: AdminNavItem): number {
		if (item.badgeKey === 'builds') return navCounts.builds;
		if (item.badgeKey === 'testimonials') return navCounts.testimonials;
		return 0;
	}
</script>

<aside class="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/80 p-4">
	<a href={resolve('/admin/dashboard')} class="mb-6 flex items-center gap-2 px-2">
		<span class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Animal Garage</span>
	</a>

	<nav class="flex-1 overflow-y-auto" aria-label="Admin">
		{#each ADMIN_NAV as section (section.label)}
			<div class="mb-4">
				<p class="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
					{section.label}
				</p>
				<ul class="space-y-0.5">
					{#each section.items as item (item.href)}
						<li>
							{#if item.disabled}
								<span
									class="flex cursor-not-allowed items-center gap-2 rounded-sm px-3 py-2 text-sm text-zinc-600"
									title="Coming soon"
								>
									{item.label}
								</span>
							{:else}
								{@const count = pendingCount(item)}
								<a
									href={resolve(item.href as '/admin')}
									class={linkClass(item.href, item.exact)}
									onclick={onNavigate}
								>
									<span class="flex-1">{item.label}</span>
									{#if count > 0}
										<span
											class="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white"
											aria-label="{count} pending"
										>
											{count}
										</span>
									{/if}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<p class="mt-4 px-2 text-[10px] text-zinc-600">Staff admin — zinc theme</p>
</aside>
