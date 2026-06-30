<script lang="ts">
	import { resolve } from '$app/paths';
	import { resolvePath } from '$lib/utils/paths';

	let {
		open = false,
		onclose,
		menuId = 'account-menu',
		container = null
	}: {
		open?: boolean;
		onclose: () => void;
		menuId?: string;
		container?: HTMLElement | null;
	} = $props();

	let menuEl = $state<HTMLDivElement | null>(null);

	const links = [
		{ label: 'Dashboard', href: '/account' },
		{ label: 'Redeem', href: '/account/redeem' },
		{ label: 'Loyalty & Balance', href: '/loyalty' },
		{ label: 'Build Logs', href: '/account/builds' }
	] as const;

	$effect(() => {
		if (!open) return;

		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (menuEl?.contains(target)) return;
			if (container?.contains(target)) return;
			onclose();
		};

		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});
</script>

{#if open}
	<div
		bind:this={menuEl}
		id={menuId}
		class="absolute right-0 top-full z-50 mt-2 min-w-[13rem] overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-2 shadow-2xl"
		role="menu"
	>
		<p class="px-4 pb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Account</p>
		<ul>
			{#each links as link (link.href)}
				<li role="none">
					<a
						href={resolve(link.href)}
						role="menuitem"
						class="block px-4 py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-900/80 hover:text-red-400"
						onclick={onclose}
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li role="none" class="mt-1 border-t border-zinc-800 pt-1">
				<form method="POST" action={resolvePath('/auth/sign-out')}>
					<button
						type="submit"
						role="menuitem"
						class="block w-full px-4 py-2.5 text-left text-sm font-medium uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-900/80 hover:text-red-400"
					>
						Sign out
					</button>
				</form>
			</li>
		</ul>
	</div>
{/if}
