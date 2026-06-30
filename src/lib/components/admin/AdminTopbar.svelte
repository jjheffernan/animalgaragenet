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

	const title = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
		if (path === '/admin/runtime') return 'Runtime';
		const segment = path.split('/').filter(Boolean).pop() ?? 'Admin';
		return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
	});
</script>

<header
	class="navbar bg-base-100 border-base-300 sticky top-0 z-20 h-14 shrink-0 border-b px-4 lg:px-6"
>
	<div class="navbar-start min-w-0 gap-2">
		<button
			type="button"
			class="btn btn-ghost btn-square btn-sm lg:hidden"
			aria-label="Open menu"
			onclick={onMenuClick}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<h1 class="truncate font-display text-lg font-semibold uppercase">{title}</h1>
		{#if devAdmin}
			<span class="badge badge-warning badge-sm hidden sm:inline">Dev Admin</span>
		{/if}
	</div>

	<div class="navbar-end gap-2">
		<a href={resolve('/')} class="btn btn-ghost btn-sm hidden sm:inline-flex"> ← Storefront </a>
		<details class="dropdown dropdown-end">
			<summary class="btn btn-ghost btn-sm gap-2">
				<span class="avatar avatar-placeholder">
					<span class="bg-primary/20 text-primary w-8 rounded-full text-xs font-bold">
						{(sessionName ?? 'A').charAt(0).toUpperCase()}
					</span>
				</span>
				<span class="hidden max-w-[8rem] truncate sm:inline">{sessionName ?? 'Admin'}</span>
			</summary>
			<ul class="dropdown-content menu bg-base-200 rounded-box z-30 mt-2 w-48 p-2 shadow-lg">
				<li class="menu-title capitalize">{sessionRole ?? 'admin'}</li>
				<li>
					<a href={resolve('/account')}>Account</a>
				</li>
				<li>
					<form method="POST" action={resolvePath('/auth/sign-out')}>
						<button type="submit" class="w-full text-left">Sign out</button>
					</form>
				</li>
			</ul>
		</details>
	</div>
</header>
