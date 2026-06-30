<script lang="ts">
	import { page } from '$app/stores';
	import { resolvePath } from '$lib/utils/paths';

	const navItems = [
		{ href: '/account', label: 'Overview', disabled: false },
		{ href: '/account/connections', label: 'Connections', disabled: false },
		{ href: '/account/redeem', label: 'Redeem', disabled: false },
		{ href: '/account/builds', label: 'Build Logs', disabled: false },
		{ href: '/account/orders', label: 'Orders', disabled: false },
		{ href: '/account/vehicles', label: 'Vehicles', disabled: false }
	] as const;

	let { children } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-8 lg:flex-row">
		<aside class="lg:w-56 shrink-0">
			<h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">Account</h2>
			<nav class="mt-4 space-y-1" aria-label="Account">
				{#each navItems as item (item.href)}
					{#if item.disabled}
						<span class="block rounded-sm px-3 py-2 text-sm text-zinc-600">{item.label}</span>
					{:else}
						<a
							href={resolvePath(item.href)}
							class="block rounded-sm px-3 py-2 text-sm transition {$page.url.pathname ===
								item.href ||
							(item.href === '/account/builds' &&
								$page.url.pathname.startsWith('/account/builds')) ||
							(item.href === '/account/redeem' &&
								$page.url.pathname.startsWith('/account/redeem')) ||
							(item.href === '/account/orders' &&
								$page.url.pathname.startsWith('/account/orders')) ||
							(item.href === '/account/vehicles' &&
								$page.url.pathname.startsWith('/account/vehicles')) ||
							(item.href === '/account/connections' &&
								$page.url.pathname.startsWith('/account/connections'))
								? 'bg-zinc-800 text-white'
								: 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}"
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>

			<form method="POST" action={resolvePath('/auth/sign-out')} class="mt-8">
				<button type="submit" class="text-sm text-zinc-500 transition hover:text-red-400"
					>Sign out</button
				>
			</form>
		</aside>

		<div class="min-w-0 flex-1">
			{@render children()}
		</div>
	</div>
</div>
