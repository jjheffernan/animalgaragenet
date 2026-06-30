<script lang="ts">
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import type { OrderStatus } from '$lib/data/mock/orders';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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
</script>

<svelte:head>
	<title>Orders — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Orders</h1>
<p class="mt-1 text-zinc-400">Order history from your Garage Squad account.</p>

{#if data.orders.length === 0}
	<div class="mt-8">
		<EmptyState
			title="No orders yet"
			description={data.liveOrders
				? 'Completed purchases will appear here once checkout is live and orders sync from Saleor.'
				: 'Sign in to view your order history.'}
		/>
	</div>
{:else}
	<ul class="mt-8 space-y-4">
		{#each data.orders as order (order.id)}
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
{/if}
