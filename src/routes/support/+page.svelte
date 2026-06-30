<script lang="ts">
	import { resolvePath } from '$lib/utils/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	const supportLinks = [
		{
			label: 'Report a Bug',
			href: '/support/report-bug',
			description: 'Something broken on the site?'
		},
		{
			label: 'Contact Us',
			href: '/contact',
			description: 'Orders, fitment, and general questions'
		},
		{
			label: 'Order Status',
			href: '/account/orders',
			description: 'Track shipments and order history'
		},
		{ label: 'Refund Policy', href: '/policies/refunds', description: 'Returns and exchanges' }
	] as const;
</script>

<svelte:head>
	<title>Support — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Support</h1>
		<p class="mt-4 text-zinc-400">
			Need help? Start here — we typically respond to messages within 1–2 business days.
		</p>

		<ul class="mt-10 divide-y divide-zinc-800 rounded-sm border border-zinc-800">
			{#each supportLinks as link (link.href)}
				<li>
					<a href={resolvePath(link.href)} class="block px-5 py-5 transition hover:bg-zinc-900/50">
						<p class="font-display text-sm font-bold uppercase tracking-wider text-white">
							{link.label}
						</p>
						<p class="mt-1 text-sm text-zinc-500">{link.description}</p>
					</a>
				</li>
			{/each}
		</ul>

		<p class="mt-8 text-sm text-zinc-500">
			Prefer real-time help? Join our Discord for faster support from the squad.
		</p>
	</AnimatedReveal>
</section>
