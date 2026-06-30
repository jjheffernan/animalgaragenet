<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { ADMIN_NAV } from '$lib/admin/nav';

	interface Props {
		onNavigate?: () => void;
	}

	let { onNavigate }: Props = $props();

	function isActive(href: string, exact = false): boolean {
		const path = $page.url.pathname;
		if (exact) return path === href;
		return path.startsWith(href);
	}

	function linkClass(href: string, exact = false): string {
		return isActive(href, exact)
			? 'bg-zinc-800 text-white'
			: 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white';
	}
</script>

<aside class="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/40 p-4">
	<a href={resolve('/admin/dashboard')} class="mb-6 flex items-center gap-2 px-2">
		<span class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Animal Garage</span>
	</a>

	<nav class="flex-1 space-y-6 overflow-y-auto" aria-label="Admin">
		{#each ADMIN_NAV as section (section.label)}
			<div>
				<p class="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
					{section.label}
				</p>
				<ul class="space-y-0.5">
					{#each section.items as item (item.href)}
						<li>
							{#if item.disabled}
								<span
									class="block cursor-not-allowed rounded-sm px-2 py-1.5 text-sm text-zinc-600"
									title="Coming soon"
								>
									{item.label}
								</span>
							{:else}
								<a
									href={resolve(item.href as '/admin')}
									class="block rounded-sm px-2 py-1.5 text-sm transition {linkClass(
										item.href,
										item.exact
									)}"
									onclick={onNavigate}
								>
									{item.label}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<p class="mt-4 px-2 text-[10px] text-zinc-600">Admin shell — zinc palette, red accents.</p>
</aside>
