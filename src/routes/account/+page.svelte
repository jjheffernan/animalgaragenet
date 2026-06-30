<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import GarageLevelBadge from '$lib/components/shared/GarageLevelBadge.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { garage } from '$lib/stores/garage.svelte';
	import { garageXp } from '$lib/stores/garage-xp.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { getOrdersForAccount, type OrderStatus } from '$lib/data/mock/orders';
	import type { PageData } from './$types';

	const orders = getOrdersForAccount();

	const statusLabels: Record<OrderStatus, string> = {
		processing: 'Processing',
		shipped: 'Shipped',
		delivered: 'Delivered',
		cancelled: 'Cancelled'
	};

	const statusColors: Record<OrderStatus, string> = {
		processing: 'text-yellow-400',
		shipped: 'text-blue-400',
		delivered: 'text-green-400',
		cancelled: 'text-zinc-500'
	};

	let { data }: { data: PageData } = $props();

	onMount(() => {
		garage.init();
		garageXp.init();
	});
</script>

<svelte:head>
	<title>My Account — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Dashboard</h1>
<p class="mt-1 text-zinc-400">Welcome back, {data.user.name}.</p>

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Profile</h2>
	<dl class="mt-4 grid gap-4 sm:grid-cols-2">
		<div>
			<dt class="text-xs text-zinc-600">Name</dt>
			<dd class="mt-1 text-white">{data.user.name}</dd>
		</div>
		<div>
			<dt class="text-xs text-zinc-600">Email</dt>
			<dd class="mt-1 text-white">{data.user.email}</dd>
		</div>
		<div>
			<dt class="text-xs text-zinc-600">Role</dt>
			<dd class="mt-1 capitalize text-white">{data.user.role}</dd>
		</div>
	</dl>
</section>

<section class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Garage Squad XP</h2>
		<GarageLevelBadge showProgress />
	</div>
	<p class="mt-4 text-3xl font-bold text-red-500">{garageXp.xp} XP</p>
	{#if garageXp.nextLevel}
		<p class="mt-1 text-sm text-zinc-500">
			{garageXp.nextLevel.xpRequired - garageXp.xp} XP to {garageXp.nextLevel.title}
		</p>
	{/if}
	<a href={resolve('/loyalty')} class="mt-4 inline-block text-sm text-red-500 hover:text-red-400">
		View loyalty perks →
	</a>
</section>

<section class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Saved Vehicles</h2>
	{#if garage.vehicles.length > 0}
		<ul class="mt-4 space-y-3">
			{#each garage.vehicles as vehicle (vehicle.id)}
				<li class="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-3">
					<span class="text-white">{garage.formatVehicle(vehicle)}</span>
					{#if vehicle.nickname}
						<span class="text-xs text-zinc-500">{vehicle.nickname}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<div class="mt-4">
			<EmptyState title="No vehicles saved" description="Add your ride from the homepage vehicle selector." />
		</div>
	{/if}
</section>

<section class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Orders</h2>
	<ul class="mt-4 space-y-4">
		{#each orders as order (order.id)}
			<li class="rounded-sm border border-zinc-800 p-4">
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div>
						<p class="font-medium text-white">{order.orderNumber}</p>
						<p class="text-xs text-zinc-500">{order.date}</p>
					</div>
					<div class="text-right">
						<p class="text-sm font-medium text-white">{locale.formatPrice(order.total)}</p>
						<p class="text-xs font-bold uppercase tracking-wider {statusColors[order.status]}">
							{statusLabels[order.status]}
						</p>
					</div>
				</div>
				<ul class="mt-3 space-y-1 text-sm text-zinc-400">
					{#each order.lines as line, i (i)}
						<li>
							{line.productName}{line.variantName ? ` — ${line.variantName}` : ''} × {line.quantity}
						</li>
					{/each}
				</ul>
				{#if order.trackingNumber}
					<p class="mt-3 text-xs text-zinc-500">
						Tracking: <span class="font-mono text-zinc-400">{order.trackingNumber}</span>
					</p>
				{/if}
			</li>
		{/each}
	</ul>
</section>
