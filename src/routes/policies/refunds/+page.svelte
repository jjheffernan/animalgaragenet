<script lang="ts">
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Refund Policy — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Refund Policy</h1>
		<p class="mt-4 text-zinc-400">
			We want you stoked on every order. If something is not right, we will make it right — within
			the guidelines below.
		</p>

		<div class="mt-8 space-y-8 text-zinc-400 leading-relaxed">
			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">30-Day Return Window</h2>
				<p class="mt-3">
					Most items may be returned within <strong class="text-white">30 days of delivery</strong> for
					a refund or exchange. Items must be unused, in original condition, and include all tags, packaging,
					and accessories.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Merchandise</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>Unworn apparel with original tags attached</li>
					<li>Accessories in resalable condition with packaging intact</li>
					<li>Customer pays return shipping unless the item arrived damaged or incorrect</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Parts</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>Unused parts in original, unopened packaging — 30-day window</li>
					<li>Installed, modified, or test-fit parts are not eligible for return</li>
					<li>Electrical and tuning components cannot be returned once opened</li>
					<li>Custom or special-order parts are final sale</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Final Sale &amp; Clearance</h2>
				<p class="mt-3">
					Items marked <strong class="text-white">Clearance</strong>, <strong class="text-white"
						>Final Sale</strong
					>, or sold at 40%+ off are not eligible for return or exchange. This includes end-of-season
					merch, open-box parts, and limited-run drops sold as-is.
				</p>
				<p class="mt-3">
					Gift cards, digital products, and downloadables are non-refundable.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Damaged or Wrong Items</h2>
				<p class="mt-3">
					Received something damaged or not what you ordered? Contact us within 7 days with photos.
					We will cover return shipping and send a replacement or full refund — your choice.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">How to Start a Return</h2>
				<ol class="mt-4 list-inside list-decimal space-y-2">
					<li>Email support with your order number and reason for return</li>
					<li>We will send a return authorization and shipping instructions</li>
					<li>Ship the item back within 14 days of approval</li>
					<li>Refunds process within 5–10 business days after we receive and inspect the return</li>
				</ol>
				<p class="mt-4">Refunds are issued to the original payment method. Shipping charges are non-refundable unless we made an error.</p>
			</div>
		</div>
	</AnimatedReveal>
</section>
