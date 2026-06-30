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
		return isActive(href, exact) ? 'menu-active' : '';
	}
</script>

<aside class="bg-base-200 flex h-full w-64 shrink-0 flex-col border-r border-base-300 p-4">
	<a href={resolve('/admin/dashboard')} class="mb-6 flex items-center gap-2 px-2">
		<span class="text-primary text-xs font-bold uppercase tracking-[0.3em]">Animal Garage</span>
	</a>

	<nav class="flex-1 overflow-y-auto" aria-label="Admin">
		{#each ADMIN_NAV as section (section.label)}
			<ul class="menu menu-sm mb-4 rounded-box p-0">
				<li class="menu-title text-[10px] uppercase tracking-widest">{section.label}</li>
				{#each section.items as item (item.href)}
					<li>
						{#if item.disabled}
							<span class="menu-disabled text-base-content/40" title="Coming soon">
								{item.label}
							</span>
						{:else}
							<a
								href={resolve(item.href as '/admin')}
								class={linkClass(item.href, item.exact)}
								onclick={onNavigate}
							>
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	<p class="text-base-content/40 mt-4 px-2 text-[10px]">Admin shell — daisyUI dark theme.</p>
</aside>
