<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	const navItems = [
		{ href: '/admin', label: 'Dashboard', exact: true },
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/media', label: 'Media' },
		{ href: '/admin/youtube', label: 'YouTube' }
	] as const;

	let { children } = $props();

	function isActive(href: string, exact = false): boolean {
		const path = $page.url.pathname;
		if (exact) return path === href;
		return path.startsWith(href);
	}
</script>

<div class="min-h-[calc(100vh-73px)] bg-zinc-950">
	<div class="mx-auto flex max-w-7xl">
		<aside class="hidden w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/30 p-6 lg:block">
			<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Admin</p>
			<nav class="mt-6 space-y-1" aria-label="Admin">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="block rounded-sm px-3 py-2 text-sm transition {isActive(item.href, 'exact' in item && item.exact)
							? 'bg-zinc-800 text-white'
							: 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</aside>

		<div class="min-w-0 flex-1 p-6 lg:p-8">
			<nav class="mb-6 flex gap-2 overflow-x-auto lg:hidden" aria-label="Admin mobile">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="shrink-0 rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-wider {isActive(item.href, 'exact' in item && item.exact)
							? 'bg-red-600 text-white'
							: 'bg-zinc-800 text-zinc-400'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			{@render children()}
		</div>
	</div>
</div>
