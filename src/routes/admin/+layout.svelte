<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const nav = [
		{ label: 'Users', href: '/admin/users' },
		{ label: 'Media', href: '/admin/media' },
		{ label: 'YouTube', href: '/admin/youtube' }
	];

	const currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-zinc-950">
	<header class="border-b border-zinc-800 bg-zinc-900/80">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<div>
				<a href={resolve('/')} class="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500">
					← Site
				</a>
				<h1 class="mt-1 font-display text-xl font-bold uppercase tracking-wider text-white">Admin</h1>
			</div>
			<nav class="flex gap-1" aria-label="Admin">
				{#each nav as item (item.href)}
					<a
						href={resolve(item.href)}
						class="rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-wider transition {currentPath.startsWith(item.href)
							? 'bg-red-600 text-white'
							: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>
	<main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
		{@render children?.()}
	</main>
</div>
