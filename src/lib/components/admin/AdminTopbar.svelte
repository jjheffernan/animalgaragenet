<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

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
		if (path === '/admin') return 'Dashboard';
		const segment = path.split('/').filter(Boolean).pop() ?? 'Admin';
		return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
	});
</script>

<header
	class="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur lg:px-6"
>
	<div class="flex min-w-0 items-center gap-3">
		<button
			type="button"
			class="rounded-sm p-2 text-zinc-400 transition hover:text-white lg:hidden"
			aria-label="Open menu"
			onclick={onMenuClick}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<h1 class="truncate font-display text-lg font-semibold uppercase text-white">{title}</h1>
		{#if devAdmin}
			<span class="hidden rounded-sm bg-amber-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400 sm:inline">Dev Admin</span>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<a href={resolve('/')} class="hidden text-xs text-zinc-400 transition hover:text-white sm:inline">
			← Storefront
		</a>
		<div class="relative">
			<button
				type="button"
				class="flex items-center gap-2 rounded-sm px-2 py-1 text-zinc-300 transition hover:text-white"
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
				<ul
					class="absolute right-0 z-30 mt-2 w-48 rounded-sm border border-zinc-800 bg-zinc-900 py-1 shadow-lg"
					role="menu"
				>
					<li class="px-3 py-1.5 text-xs capitalize text-zinc-500" role="presentation">
						{sessionRole ?? 'admin'}
					</li>
					<li>
						<a
							href={resolve('/account')}
							class="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
							role="menuitem"
							onclick={() => (profileOpen = false)}
						>
							Account
						</a>
					</li>
					<li>
						<a
							href={resolve('/auth/sign-out')}
							class="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
							role="menuitem"
							onclick={() => (profileOpen = false)}
						>
							Sign out
						</a>
					</li>
				</ul>
			{/if}
		</div>
	</div>
</header>
