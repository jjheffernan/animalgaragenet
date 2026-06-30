<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DashboardActivityType } from '$lib/server/admin/dashboard-activity';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const snapshotKeys = [
		{ key: 'saleorEnabled' as const, label: 'Saleor' },
		{ key: 'supabaseConfigured' as const, label: 'Supabase' },
		{ key: 'siteLocked' as const, label: 'Site lock' }
	];

	const quickLinks = [
		{ href: '/admin/builds', label: 'Builds', detail: 'Moderate submissions' },
		{ href: '/admin/testimonials', label: 'Testimonials', detail: 'Review community quotes' },
		{ href: '/admin/bug-reports', label: 'Bug reports', detail: 'Open support inbox' }
	] as const;

	const typeBadgeClass: Record<DashboardActivityType, string> = {
		build: 'bg-sky-600/20 text-sky-400',
		bug: 'bg-amber-600/20 text-amber-400',
		youtube: 'bg-red-600/20 text-red-400'
	};

	const typeLabels: Record<DashboardActivityType, string> = {
		build: 'Build',
		bug: 'Bug',
		youtube: 'YouTube'
	};

	function statusBadgeClass(on: boolean): string {
		return on
			? 'bg-emerald-600/20 text-emerald-400'
			: 'border border-zinc-700 text-zinc-300';
	}
</script>

<svelte:head>
	<title>Dashboard — Admin — Animal Garage</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase">Dashboard</h1>
		<p class="mt-1 text-zinc-400">Site administration overview.</p>
	</div>

	{#if data.devAdmin}
		<p
			role="alert"
			class="rounded-sm border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-400"
		>
			DEV_ADMIN mode active — admin access granted without session role.
		</p>
	{/if}

	<!-- Integration snapshot strip (top 3 runtime booleans) -->
	<section class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h2 class="text-sm font-bold uppercase tracking-widest text-white">System health</h2>
				<p class="mt-1 text-xs text-zinc-500">Key integrations — full status on Runtime</p>
			</div>
			<a
				href={resolve('/admin/runtime')}
				class="rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
			>
				Runtime details
			</a>
		</div>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each snapshotKeys as item (item.key)}
				{@const on = data.status[item.key]}
				<span
					class="rounded-sm px-2 py-0.5 text-xs font-bold uppercase {statusBadgeClass(on)}"
				>
					{item.label}: {on ? 'On' : 'Off'}
				</span>
			{/each}
		</div>
	</section>

	<!-- @inspiration-scaffold: intentional — commerce KPI row; wire Saleor + wholesale when routes ship -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Open orders</p>
					<p class="mt-2 text-3xl font-bold text-red-500">{data.stats.orders}</p>
					<p class="mt-1 text-xs text-zinc-600">Mock — Saleor orders API</p>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-8 w-8 shrink-0 text-red-500"
					aria-hidden="true"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			</div>
		</div>
		<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Revenue (MTD)</p>
					<p class="mt-2 text-3xl font-bold text-zinc-100">{data.stats.revenueLabel}</p>
					<p class="mt-1 text-xs text-zinc-600">Mock — Saleor revenue aggregate</p>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-8 w-8 shrink-0 text-zinc-400"
					aria-hidden="true"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
		</div>
		<a
			href={resolve('/admin/users')}
			class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80"
		>
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Users</p>
					<p class="mt-2 text-3xl font-bold text-white">{data.stats.users}</p>
					<p class="mt-1 text-xs text-red-400">Manage accounts →</p>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-8 w-8 shrink-0 text-sky-400"
					aria-hidden="true"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
		</a>
		<a
			href={resolve('/admin/bug-reports')}
			class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80"
		>
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Open bugs</p>
					<p class="mt-2 text-3xl font-bold text-red-400">{data.stats.openBugs}</p>
					<p class="mt-1 text-xs text-red-400">View inbox →</p>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-8 w-8 shrink-0 text-red-400"
					aria-hidden="true"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
		</a>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<section class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/50 lg:col-span-2">
			<div class="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
				<h2 class="text-sm font-bold uppercase tracking-widest text-white">Recent activity</h2>
				<!-- @inspiration-scaffold: future admin_activity Supabase view -->
			</div>
			{#if data.activity.length === 0}
				<p class="px-6 pb-6 text-sm text-zinc-500">
					No recent events from builds, bugs, or YouTube.
				</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead
							class="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500"
						>
							<tr>
								<th class="px-4 py-3">When</th>
								<th class="px-4 py-3">Type</th>
								<th class="px-4 py-3">Summary</th>
								<th class="px-4 py-3 text-right">Link</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-800">
							{#each data.activity as item (item.at + item.summary)}
								<tr class="bg-zinc-900/30">
									<td class="px-4 py-3 text-xs whitespace-nowrap text-zinc-600">{item.at}</td>
									<td class="px-4 py-3">
										<span
											class="rounded-sm px-2 py-0.5 text-xs font-bold uppercase {typeBadgeClass[
												item.type
											]}"
										>
											{typeLabels[item.type]}
										</span>
									</td>
									<td class="max-w-md truncate px-4 py-3" title={item.summary}>{item.summary}</td>
									<td class="px-4 py-3 text-right">
										<a
											href={resolve(item.href)}
											class="text-xs text-red-400 transition hover:text-red-300"
										>
											Open
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<section class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
			<h2 class="text-sm font-bold uppercase tracking-widest text-white">Staff shortcuts</h2>
			<ul class="mt-4 space-y-1">
				{#each quickLinks as link (link.href)}
					<li>
						<a
							href={resolve(link.href)}
							class="flex items-center justify-between gap-3 rounded-sm px-3 py-3 transition hover:bg-zinc-900/80"
						>
							<div>
								<span class="font-medium text-zinc-200">{link.label}</span>
								<p class="text-xs text-zinc-500">{link.detail}</p>
							</div>
							<span class="text-zinc-600" aria-hidden="true">→</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
