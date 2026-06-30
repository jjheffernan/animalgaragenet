<script lang="ts">
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Shipping Policy — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Shipping Policy</h1>
		<p class="mt-4 text-zinc-400">
			We ship merch and parts from our warehouse in the continental US. Processing times vary by
			product type — details below.
		</p>

		<div class="mt-8 space-y-8 text-zinc-400 leading-relaxed">
			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Free Shipping Threshold</h2>
				<p class="mt-3">
					Orders over <strong class="text-white">$75</strong> qualify for free standard shipping within
					the contiguous United States. The discount applies automatically at checkout once your cart subtotal
					reaches $75 before tax. Oversized parts (wheels, body kits, etc.) may require freight shipping
					and are excluded from the free-shipping offer.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Domestic Zones &amp; Times</h2>
				<p class="mt-3">Standard and expedited options are available at checkout.</p>
				<ul class="mt-4 space-y-3">
					<li>
						<strong class="text-zinc-300">Zone 1 — West Coast</strong> (CA, OR, WA, NV, AZ): 3–5 business
						days standard
					</li>
					<li>
						<strong class="text-zinc-300">Zone 2 — Central</strong> (TX, CO, IL, MN, etc.): 5–7 business
						days standard
					</li>
					<li>
						<strong class="text-zinc-300">Zone 3 — East Coast</strong> (NY, FL, GA, PA, etc.): 5–7 business
						days standard
					</li>
					<li>
						<strong class="text-zinc-300">Zone 4 — Alaska &amp; Hawaii</strong>: 7–14 business days; rates
						calculated at checkout
					</li>
				</ul>
				<p class="mt-4">
					Expedited shipping (2–3 business days) is available for most in-stock merch. Parts with
					drop-ship vendors may take longer — estimated delivery shown on the product page.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Processing Times</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li><strong class="text-zinc-300">Merch:</strong> ships within 1–2 business days when in stock</li>
					<li>
						<strong class="text-zinc-300">Parts:</strong> 2–5 business days for warehouse stock; 5–10
						business days for vendor drop-ship items
					</li>
					<li>
						<strong class="text-zinc-300">Pre-orders &amp; drops:</strong> ship on or after the listed
						available date
					</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">International Shipping</h2>
				<p class="mt-3">
					We ship to Canada, the UK, Australia, and select EU countries. International rates are
					calculated at checkout based on weight and destination. Delivery typically takes 10–21
					business days depending on customs processing.
				</p>
				<p class="mt-3">
					<strong class="text-zinc-300">Duties, taxes, and import fees</strong> are the responsibility
					of the recipient and are not included in our shipping charges. We cannot mark packages as
					gifts or declare lower values.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Tracking &amp; Issues</h2>
				<p class="mt-3">
					You will receive a tracking number by email once your order ships. If tracking shows
					delivered but you did not receive your package, contact us within 7 days so we can file a
					claim with the carrier.
				</p>
			</div>
		</div>
	</AnimatedReveal>
</section>
