<script lang="ts">
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminTopbar from '$lib/components/admin/AdminTopbar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let mobileOpen = $state(false);

	function closeMobile(): void {
		mobileOpen = false;
	}
</script>

<!--
  Dashboard shell — zinc palette (same as storefront).
  See docs/archive/dashboard-adoption-plan.md
-->
<div class="flex min-h-[calc(100vh-73px)] flex-col bg-zinc-950 text-zinc-100 lg:flex-row">
	<!-- Mobile overlay -->
	{#if mobileOpen}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/60 lg:hidden"
			aria-label="Close menu"
			onclick={closeMobile}
		></button>
	{/if}

	<!-- Sidebar: fixed drawer on mobile, static on lg+ -->
	<div
		class="fixed inset-y-0 left-0 z-40 translate-x-0 transition-transform lg:static lg:z-auto lg:translate-x-0 {mobileOpen
			? 'translate-x-0'
			: '-translate-x-full lg:translate-x-0'}"
		style="top: 73px"
	>
		<AdminSidebar navCounts={data.navCounts} onNavigate={closeMobile} />
	</div>

	<div class="flex min-w-0 flex-1 flex-col">
		<AdminTopbar
			sessionName={data.session?.name}
			sessionRole={data.session?.role}
			devAdmin={data.devAdmin}
			onMenuClick={() => (mobileOpen = !mobileOpen)}
		/>

		<main class="flex-1 overflow-y-auto p-6 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>
