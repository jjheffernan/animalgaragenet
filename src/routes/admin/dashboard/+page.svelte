<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminAlertWarning,
		adminBadgeOff,
		adminBadgeOn,
		adminBtnGhost,
		adminCard,
		adminCardFlush,
		adminKpiCard,
		adminKpiCardMuted,
		adminLink,
		adminTableHead
	} from '$lib/components/admin/admin-ui';
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

	const activityViewAll = [
		{ href: '/admin/builds', label: 'Builds' },
		{ href: '/admin/bug-reports', label: 'Bugs' },
		{ href: '/admin/youtube', label: 'YouTube' }
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

	const kpiCardClass = $derived(
		data.stats.commerceSource === 'mirror' ? adminKpiCard : adminKpiCardMuted
	);

	const ordersHint = $derived(
		data.stats.commerceSource === 'mirror'
			? 'Live — order_snapshots (MTD)'
			: data.stats.commerceSource === 'empty'
				? 'No orders this month'
				: 'Mock — Supabase service role unset'
	);

	const revenueHint = $derived(
		data.stats.commerceSource === 'mirror'
			? 'Live — mirrored Saleor totals'
			: data.stats.commerceSource === 'empty'
				? 'No revenue this month'
				: 'Mock — connect Supabase'
	);
</script>

<svelte:head>
	<title>Dashboard — Admin — Animal Garage</title>
</svelte:head>

<div class="space-y-6">
	<AdminPageHeader title="Dashboard" subtitle="Site administration overview." />

	{#if data.devAdmin}
		<div role="alert" class={adminAlertWarning}>
			DEV_ADMIN mode active — admin access granted without session role.
		</div>
	{/if}

	<section class={adminCard}>
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h2 class="text-sm font-bold uppercase tracking-widest text-white">System health</h2>
				<p class="mt-1 text-xs text-zinc-500">Key integrations — full status on Runtime</p>
			</div>
			<a href={resolve('/admin/runtime')} class={adminBtnGhost}>Runtime details</a>
		</div>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each snapshotKeys as item (item.key)}
				{@const on = data.status[item.key]}
				<span class={on ? adminBadgeOn : adminBadgeOff}>
					{item.label}: {on ? 'On' : 'Off'}
				</span>
			{/each}
		</div>
	</section>

	<!-- @inspiration-scaffold: intentional — commerce KPI row; wire Saleor aggregates when commerce routes ship -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class={kpiCardClass}>
			<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Open orders</p>
			<p class="mt-2 text-3xl font-bold text-red-500">{data.stats.orders}</p>
			<p class="mt-1 text-xs text-zinc-600">{ordersHint}</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Revenue (MTD)</p>
			<p class="mt-2 text-3xl font-bold text-zinc-100">{data.stats.revenueLabel}</p>
			<p class="mt-1 text-xs text-zinc-600">{revenueHint}</p>
		</div>
		<a
			href={resolve('/admin/users')}
			class="{adminKpiCard} transition hover:border-zinc-700 hover:bg-zinc-900/80"
		>
			<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Users</p>
			<p class="mt-2 text-3xl font-bold text-white">{data.stats.users}</p>
			<p class="mt-1 text-xs text-red-400">Manage accounts →</p>
		</a>
		<a
			href={resolve('/admin/bug-reports')}
			class="{adminKpiCard} transition hover:border-zinc-700 hover:bg-zinc-900/80"
		>
			<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Open bugs</p>
			<p class="mt-2 text-3xl font-bold text-red-400">{data.stats.openBugs}</p>
			<p class="mt-1 text-xs text-red-400">View inbox →</p>
		</a>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<section class="{adminCardFlush} lg:col-span-2">
			<div class="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
				<h2 class="text-sm font-bold uppercase tracking-widest text-white">Recent activity</h2>
				<div class="flex flex-wrap gap-3">
					{#each activityViewAll as link (link.href)}
						<a href={resolve(link.href)} class={adminLink}>View {link.label}</a>
					{/each}
				</div>
				<!-- @inspiration-scaffold: future admin_activity Supabase view -->
			</div>
			{#if data.activity.length === 0}
				<p class="px-6 pb-6 text-sm text-zinc-500">
					No recent events from builds, bugs, or YouTube.
				</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr class={adminTableHead}>
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
										<a href={resolve(item.href as '/admin')} class={adminLink}>Open</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<section class={adminCard}>
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
