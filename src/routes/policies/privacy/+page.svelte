<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Privacy Policy — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Privacy Policy</h1>
		<p class="mt-4 text-zinc-400">
			Last updated: June 2026. Animal Garage ("we," "us," "our") operates animalgarage.net. This
			policy explains how we collect, use, and protect your personal information when you shop with
			us.
		</p>

		<div class="mt-8 space-y-8 text-zinc-400 leading-relaxed">
			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Information We Collect</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>
						<strong class="text-zinc-300">Account data:</strong> name, email, password hash (via Supabase
						Auth when enabled)
					</li>
					<li>
						<strong class="text-zinc-300">Order data:</strong> shipping and billing address, payment method
						(last four digits only — full card data handled by our payment processor)
					</li>
					<li>
						<strong class="text-zinc-300">Garage preferences:</strong> saved vehicles, wishlists, and loyalty
						program activity
					</li>
					<li>
						<strong class="text-zinc-300">Communications:</strong> newsletter signups, contact form submissions,
						wholesale inquiries
					</li>
					<li>
						<strong class="text-zinc-300">Usage data:</strong> pages visited, device type, IP address, and
						cookies for site functionality and analytics
					</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">How We Use Your Information</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>Process and fulfill orders, including shipping notifications</li>
					<li>Provide customer support and respond to inquiries</li>
					<li>Send marketing emails if you opt in (unsubscribe anytime)</li>
					<li>Personalize your experience — vehicle fitment, recommendations</li>
					<li>Detect fraud, enforce our terms, and comply with legal obligations</li>
					<li>Improve our site, products, and services through aggregated analytics</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Sharing &amp; Third Parties</h2>
				<p class="mt-3">We do not sell your personal information. We share data only with service providers who help us operate:</p>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li><strong class="text-zinc-300">Saleor</strong> — e-commerce platform and order management</li>
					<li><strong class="text-zinc-300">Supabase</strong> — authentication, database, and form storage</li>
					<li><strong class="text-zinc-300">Payment processors</strong> — secure payment handling</li>
					<li><strong class="text-zinc-300">Shipping carriers</strong> — delivery of your orders</li>
					<li><strong class="text-zinc-300">Analytics providers</strong> — anonymized site usage metrics</li>
				</ul>
				<p class="mt-3">We may disclose information if required by law or to protect our rights and users.</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Cookies</h2>
				<p class="mt-3">
					We use essential cookies for cart and session management, and optional analytics cookies
					to understand how visitors use our site. You can control cookies through your browser
					settings; disabling essential cookies may limit site functionality.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Data Retention &amp; Security</h2>
				<p class="mt-3">
					We retain order and account data as long as your account is active or as needed to fulfill
					legal obligations. We use industry-standard encryption and access controls to protect your
					data.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Your Rights</h2>
				<p class="mt-3">
					Depending on your location, you may have the right to access, correct, delete, or export
					your personal data, and to opt out of marketing communications. California residents have
					additional rights under the CCPA. Contact us to exercise these rights.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Children</h2>
				<p class="mt-3">
					Our site is not intended for users under 16. We do not knowingly collect data from
					children.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Contact</h2>
				<p class="mt-3">
					Questions about this policy? Reach us through our <a href="/contact" class="text-red-500 hover:text-red-400">contact page</a>.
				</p>
			</div>
		</div>
	</AnimatedReveal>
</section>
