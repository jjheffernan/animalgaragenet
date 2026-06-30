<script lang="ts">
	import { resolvePath } from '$lib/utils/paths';
	import NewsletterSignup from '$lib/components/marketing/NewsletterSignup.svelte';
	import SocialLinks from '$lib/components/marketing/SocialLinks.svelte';

	const helpfulLinkColumns = [
		[
			{ label: 'Our Story', href: '/about' },
			{ label: 'Contact', href: '/contact' },
			{ label: 'Order Status', href: '/account/orders' },
			{ label: 'Wholesale', href: '/wholesale' },
			{ label: 'Military Discount', href: '/military' }
		],
		[
			{ label: 'Shop', href: '/shop' },
			{ label: 'Parts', href: '/parts' },
			{ label: 'Gift Cards', href: '/gift-cards' },
			{ label: 'Builds', href: '/builds' }
		],
		[
			{ label: 'Shipping Policy', href: '/policies/shipping' },
			{ label: 'Refund Policy', href: '/policies/refunds' },
			{ label: 'Privacy Policy', href: '/policies/privacy' },
			{ label: 'Blog', href: '/blog' }
		]
	] as const;

	const helpfulLinks = helpfulLinkColumns.flat();

	const businessHours = [
		{ days: 'Mon – Fri', hours: '9am – 6pm PT' },
		{ days: 'Saturday', hours: '10am – 4pm PT' },
		{ days: 'Sunday', hours: 'Closed' }
	] as const;
</script>

<footer class="border-t border-zinc-800 bg-zinc-950">
	<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
		<div class="grid gap-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
			<!-- Brand: logo, address, hours -->
			<div class="lg:col-span-4">
				<a href={resolvePath('/')} class="inline-flex items-center gap-3">
					<img src="/logo.svg" alt="" width="40" height="40" class="h-10 w-10 shrink-0" />
					<span class="font-display text-lg font-bold uppercase tracking-widest text-white">
						Animal Garage
					</span>
				</a>

				<address class="mt-5 space-y-1 text-sm not-italic leading-relaxed text-zinc-500">
					<p class="text-zinc-400">Animal Garage HQ</p>
					<p>123 Redline Drive</p>
					<p>Los Angeles, CA 90001</p>
				</address>

				<div class="mt-5">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Business Hours</p>
					<ul class="mt-3 space-y-2 text-sm text-zinc-500">
						{#each businessHours as row (row.days)}
							<li class="flex justify-between gap-4">
								<span>{row.days}</span>
								<span class="text-zinc-400">{row.hours}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="mt-6 w-full lg:max-w-sm">
					<NewsletterSignup />
				</div>
			</div>

			<!-- Contact + social -->
			<div class="lg:col-span-2">
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Get in Touch</p>
				<ul class="mt-4 space-y-1 text-sm">
					<li>
						<a
							href="tel:+15558675309"
							class="block py-2.5 text-zinc-500 transition hover:text-red-500"
						>
							(555) 867-5309
						</a>
					</li>
					<li>
						<a
							href="mailto:support@animalgarage.com"
							class="block py-2.5 text-zinc-500 transition hover:text-red-500"
						>
							support@animalgarage.com
						</a>
					</li>
				</ul>

				<div class="mt-6">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Follow Us</p>
					<div class="mt-3 [&_a]:h-11 [&_a]:w-11">
						<SocialLinks />
					</div>
				</div>
			</div>

			<!-- Helpful links — desktop -->
			<div class="hidden lg:col-span-6 lg:col-start-7 lg:block">
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Helpful Links</p>
				<div class="mt-4 grid grid-cols-3 gap-x-8 gap-y-1">
					{#each helpfulLinkColumns as column, columnIndex (columnIndex)}
						<ul class="space-y-1.5">
							{#each column as link (link.href)}
								<li>
									<a
										href={resolvePath(link.href)}
										class="text-sm text-zinc-500 transition hover:text-red-500"
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					{/each}
				</div>
			</div>

			<!-- Helpful links — mobile (always visible) -->
			<div class="w-full lg:hidden">
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Helpful Links</p>
				<ul class="mt-4 grid grid-cols-2 gap-x-4">
					{#each helpfulLinks as link (link.href)}
						<li>
							<a
								href={resolvePath(link.href)}
								class="block py-2.5 text-sm text-zinc-500 transition hover:text-red-500"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Trust strip -->
		<div
			class="mt-10 flex flex-col items-center gap-4 border-t border-zinc-800 pt-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left"
		>
			<div class="flex items-center gap-3 text-zinc-600">
				<img src="/logo.svg" alt="" width="28" height="28" class="h-7 w-7 opacity-60" />
				<p class="text-xs uppercase tracking-widest">Performance lifestyle brand since 2019</p>
			</div>
		</div>

		<!-- Bottom bar -->
		<div
			class="mt-6 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600 sm:flex-row sm:text-left"
		>
			<p>&copy; {new Date().getFullYear()} Animal Garage. All rights reserved.</p>
			<p class="flex items-center gap-1.5 text-zinc-500">
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
				Secure checkout
			</p>
		</div>
	</div>
</footer>
