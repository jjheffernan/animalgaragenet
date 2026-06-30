<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { resolvePath } from '$lib/utils/paths';

	interface Props {
		sessionName?: string | null;
		sessionRole?: string | null;
		devAdmin?: boolean;
		onMenuClick?: () => void;
	}

	let { sessionName, sessionRole, devAdmin = false, onMenuClick }: Props = $props();

	let profileOpen = $state(false);

	const title = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
		if (path === '/admin/runtime') return 'Runtime';
		const segment = path.split('/').filter(Boolean).pop() ?? 'Admin';
		return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
	});

	const ghostBtn =
		'rounded-sm px-3 py-1.5 text-sm transition text-zinc-300 hover:bg-zinc-800 hover:text-white';
</script>

<header
	class="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 lg:px-6"
>
	<div class="flex min-w-0 items-center gap-2">
		<button type="button" class="{ghostBtn} lg:hidden" aria-label="Open menu" onclick={onMenuClick}>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<h1 class="truncate font-display text-lg font-semibold uppercase">{title}</h1>
		{#if devAdmin}
			<span
				class="hidden rounded-sm bg-amber-600/20 px-2 py-0.5 text-xs font-bold uppercase text-amber-400 sm:inline"
			>
				Dev Admin
			</span>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<a href={resolve('/')} class="{ghostBtn} hidden sm:inline-flex"> ← Storefront </a>
		<div class="relative">
			<button
				type="button"
				class="{ghostBtn} flex items-center gap-2"
				aria-expanded={profileOpen}
				aria-haspopup="menu"
				onclick={() => (profileOpen = !profileOpen)}
			>
				<span
					class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20 text-xs font-bold text-red-400"
				>
					{(sessionName ?? 'A').charAt(0).toUpperCase()}
				</span>
				<span class="hidden max-w-[8rem] truncate sm:inline">{sessionName ?? 'Admin'}</span>
			</button>
			{#if profileOpen}
				<div
					class="fixed inset-0 z-10"
					role="presentation"
					onclick={() => (profileOpen = false)}
				></div>
				<div
					class="absolute right-0 z-20 mt-2 w-48 rounded-sm border border-zinc-800 bg-zinc-900 py-2 shadow-lg"
					role="menu"
				>
					<p class="px-4 py-1 text-xs capitalize text-zinc-500">{sessionRole ?? 'admin'}</p>
					<a
						href={resolve('/account')}
						class="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
						role="menuitem"
					>
						Account
					</a>
					<form method="POST" action={resolvePath('/auth/sign-out')}>
						<button
							type="submit"
							class="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
							role="menuitem"
						>
							Sign out
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>
