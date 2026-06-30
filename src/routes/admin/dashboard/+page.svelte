<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { mockAdminUsers } from '$lib/data/mock/admin-users';
	import { mockMedia } from '$lib/data/mock/media';
	import { mockYouTubeChannels } from '$lib/data/mock/youtube-channels';

	let { data }: { data: PageData } = $props();

	const totalVideos = mockYouTubeChannels.reduce((sum, ch) => sum + ch.videoCount, 0);

	// @inspiration-scaffold: intentional — wire Saleor open-order count; see docs/plans/active/inspiration-polish-tracker.md
	const mockOpenOrders = 12;

	// @inspiration-scaffold: intentional — wire wholesale queue from wholesale/repository.ts
	const mockWholesalePending = 3;
</script>

<svelte:head>
	<title>Dashboard — Admin — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Dashboard</h1>
<p class="mt-1 text-zinc-400">Site administration overview.</p>

{#if data.devAdmin}
	<p
		class="mt-4 rounded-sm border border-amber-800/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-400"
	>
		DEV_ADMIN mode active — admin access granted without session role.
	</p>
{/if}

<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Users</p>
		<p class="mt-2 text-3xl font-bold text-white">{mockAdminUsers.length}</p>
		<p class="mt-1 text-xs text-zinc-600">Registered accounts</p>
	</div>
	<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Media Assets</p>
		<p class="mt-2 text-3xl font-bold text-white">{mockMedia.length}</p>
		<p class="mt-1 text-xs text-zinc-600">CDN catalog items</p>
	</div>
	<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">YouTube Channels</p>
		<p class="mt-2 text-3xl font-bold text-white">{mockYouTubeChannels.length}</p>
		<p class="mt-1 text-xs text-zinc-600">{totalVideos} synced videos</p>
	</div>
	<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Signed In</p>
		<p class="mt-2 text-lg font-bold text-white">{data.session?.name ?? 'Dev Admin'}</p>
		<p class="mt-1 text-xs capitalize text-zinc-600">{data.session?.role ?? 'admin (dev)'}</p>
	</div>
</div>

<!-- @inspiration-scaffold: intentional — commerce KPI row; wire Saleor + wholesale when routes ship -->
<div class="mt-4 grid gap-4 sm:grid-cols-2">
	<div class="rounded-sm border border-zinc-800/60 bg-zinc-900/30 p-5">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-600">Open Orders</p>
		<p class="mt-2 text-2xl font-bold text-zinc-400">{mockOpenOrders}</p>
		<p class="mt-1 text-xs text-zinc-600">Mock — Saleor orders API</p>
	</div>
	<div class="rounded-sm border border-zinc-800/60 bg-zinc-900/30 p-5">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-600">Wholesale Inquiries</p>
		<p class="mt-2 text-2xl font-bold text-zinc-400">{mockWholesalePending}</p>
		<p class="mt-1 text-xs text-zinc-600">Mock — /admin/wholesale queue</p>
	</div>
</div>

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Quick Links</h2>
	<ul class="mt-4 grid gap-2 text-sm sm:grid-cols-2">
		<li>
			<a href={resolve('/admin/runtime')} class="text-zinc-400 hover:text-red-400"
				>→ Runtime status and integrations</a
			>
		</li>
		<li>
			<a href={resolve('/admin/users')} class="text-zinc-400 hover:text-red-400"
				>→ Manage users and roles</a
			>
		</li>
		<li>
			<a href={resolve('/admin/media')} class="text-zinc-400 hover:text-red-400"
				>→ Browse and upload CDN assets</a
			>
		</li>
		<li>
			<a href={resolve('/admin/builds')} class="text-zinc-400 hover:text-red-400"
				>→ Moderate build log submissions</a
			>
		</li>
		<li>
			<a href={resolve('/admin/youtube')} class="text-zinc-400 hover:text-red-400"
				>→ Sync YouTube channels ({mockYouTubeChannels.length} connected)</a
			>
		</li>
		<li>
			<a href={resolve('/admin/featured')} class="text-zinc-400 hover:text-red-400"
				>→ Homepage featured sections</a
			>
		</li>
	</ul>
</section>

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Recent Activity</h2>
	<!-- @inspiration-scaffold: intentional — aggregate audit log from Supabase activity table -->
	<ul class="mt-4 space-y-3 text-sm text-zinc-400">
		<li>
			<span class="text-zinc-600">Jun 28</span> — Wholesale inquiry submitted from Pacific Auto Supply
		</li>
		<li>
			<span class="text-zinc-600">Jun 27</span> — Build submission: "Midnight 350Z" pending review
		</li>
		<li>
			<span class="text-zinc-600">Jun 25</span> — YouTube sync completed for @animalgarage (12 videos)
		</li>
		<li>
			<span class="text-zinc-600">Jun 20</span> — New customer account: Garage Fan
		</li>
	</ul>
</section>
