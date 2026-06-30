<script lang="ts">
	import { resolvePath } from '$lib/utils/paths';
	import NewsletterSignup from './NewsletterSignup.svelte';
	import SocialLinks from './SocialLinks.svelte';
	import ManifestoBlock from './ManifestoBlock.svelte';
	import SupportCTA from './SupportCTA.svelte';

	const columns = {
		shop: [
			{ label: 'All Shop', href: '/shop' },
			{ label: 'Apparel', href: '/shop?category=apparel' },
			{ label: 'Accessories', href: '/shop?category=accessories' },
			{ label: 'Auto', href: '/shop?category=auto' },
			{ label: 'Gift Cards', href: '/gift-cards' },
			{ label: 'Clearance', href: '/shop?collection=clearance' }
		],
		parts: [
			{ label: 'All Parts', href: '/parts' },
			{ label: 'Wheels', href: '/parts/wheels' },
			{ label: 'Suspension', href: '/parts/suspension' },
			{ label: 'Exhaust', href: '/parts/exhaust' },
			{ label: 'Brakes', href: '/parts/brakes' },
			{ label: 'Brands', href: '/brands' }
		],
		community: [
			{ label: 'Builds', href: '/builds' },
			{ label: 'Watch', href: '/watch' },
			{ label: 'Media', href: '/media' },
			{ label: 'Events', href: '/events' },
			{ label: 'Guides', href: '/guides' },
			{ label: 'Blog', href: '/blog' }
		],
		support: [
			{ label: 'Contact', href: '/contact' },
			{ label: 'Shipping Policy', href: '/policies/shipping' },
			{ label: 'Refund Policy', href: '/policies/refunds' },
			{ label: 'Privacy Policy', href: '/policies/privacy' }
		],
		programs: [
			{ label: 'Garage Squad Loyalty', href: '/loyalty' },
			{ label: 'Wholesale Inquiry', href: '/wholesale' },
			{ label: 'Military Discount', href: '/military' },
			{ label: 'Pit Lane Deals', href: '/deals' }
		]
	} as const;
</script>

<footer class="border-t border-zinc-800 bg-zinc-950">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-10 lg:grid-cols-6">
			<div class="lg:col-span-2">
				<p class="font-display text-lg font-bold uppercase tracking-widest text-white">Animal Garage</p>
				<div class="mt-4">
					<ManifestoBlock />
				</div>
				<div class="mt-6">
					<SupportCTA />
				</div>
			</div>

			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Shop</p>
				<ul class="mt-4 space-y-2 text-sm text-zinc-500">
					{#each columns.shop as link (link.href)}
						<li><a href={resolvePath(link.href)} class="hover:text-red-500">{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Parts</p>
				<ul class="mt-4 space-y-2 text-sm text-zinc-500">
					{#each columns.parts as link (link.href)}
						<li><a href={resolvePath(link.href)} class="hover:text-red-500">{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Community</p>
				<ul class="mt-4 space-y-2 text-sm text-zinc-500">
					{#each columns.community as link (link.href)}
						<li><a href={resolvePath(link.href)} class="hover:text-red-500">{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Support</p>
				<ul class="mt-4 space-y-2 text-sm text-zinc-500">
					{#each columns.support as link (link.href)}
						<li><a href={resolvePath(link.href)} class="hover:text-red-500">{link.label}</a></li>
					{/each}
				</ul>
				<p class="mt-6 text-xs font-bold uppercase tracking-widest text-zinc-400">Programs</p>
				<ul class="mt-4 space-y-2 text-sm text-zinc-500">
					{#each columns.programs as link (link.href)}
						<li><a href={resolvePath(link.href)} class="hover:text-red-500">{link.label}</a></li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-10 grid gap-8 border-t border-zinc-800 pt-10 md:grid-cols-2">
			<NewsletterSignup />
			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Follow Us</p>
				<div class="mt-4">
					<SocialLinks />
				</div>
			</div>
		</div>

		<p class="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
			&copy; {new Date().getFullYear()} Animal Garage. All rights reserved.
		</p>
	</div>
</footer>
