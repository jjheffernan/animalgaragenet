<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Military Discount — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Military Discount</h1>
		<p class="mt-4 text-lg text-zinc-400">
			<strong class="text-white">15% off</strong> for active duty, veterans, and their families. Thank
			you for your service.
		</p>

		<div class="mt-10 space-y-8 text-zinc-400 leading-relaxed">
			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">How to Verify</h2>
				<p class="mt-3">
					Verify your military status through our secure partner portal. We support verification
					via <strong class="text-zinc-300">ID.me</strong> and
					<strong class="text-zinc-300">VerifyPass</strong> — choose either option at checkout once
					the integration is live.
				</p>
				<div class="mt-6 flex flex-wrap gap-4">
					<div class="rounded-sm border border-zinc-700 bg-zinc-900/50 px-6 py-4">
						<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">ID.me</p>
						<p class="mt-1 text-sm text-zinc-400">Verify with military ID or .mil email</p>
						<button
							type="button"
							disabled
							class="mt-3 rounded-sm bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Coming Soon
						</button>
					</div>
					<div class="rounded-sm border border-zinc-700 bg-zinc-900/50 px-6 py-4">
						<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">VerifyPass</p>
						<p class="mt-1 text-sm text-zinc-400">Alternative verification for veterans &amp; spouses</p>
						<button
							type="button"
							disabled
							class="mt-3 rounded-sm bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Coming Soon
						</button>
					</div>
				</div>
				<p class="mt-4 text-sm text-zinc-500">
					Once verified, your 15% discount applies automatically at checkout for 12 months.
					Re-verification may be required annually.
				</p>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Who Is Eligible</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>Active duty US military (all branches)</li>
					<li>Veterans with honorable discharge</li>
					<li>Reservists and National Guard</li>
					<li>Military spouses and dependents (18+)</li>
					<li>First responders verify separately — see our loyalty program</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">Discount Rules</h2>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li><strong class="text-zinc-300">15% off</strong> eligible merchandise and in-stock parts</li>
					<li>Cannot be combined with other promo codes or stackable offers</li>
					<li>Excludes gift cards, clearance items, and final-sale products</li>
					<li>Does not apply to shipping charges or taxes</li>
					<li>One discount per order; maximum discount may apply on high-value carts</li>
				</ul>
			</div>

			<div>
				<h2 class="font-display text-lg font-bold uppercase text-white">FAQ</h2>
				<dl class="mt-4 space-y-4">
					<div>
						<dt class="font-bold text-zinc-300">Can I use this with Garage Squad loyalty points?</dt>
						<dd class="mt-1">Yes — military discount applies before loyalty redemption at checkout.</dd>
					</div>
					<div>
						<dt class="font-bold text-zinc-300">What if verification fails?</dt>
						<dd class="mt-1">
							Contact us with your DD-214 or military ID and we will manually verify within 2 business
							days.
						</dd>
					</div>
					<div>
						<dt class="font-bold text-zinc-300">Does this work internationally?</dt>
						<dd class="mt-1">
							Verification is US-focused today. International military members — email us for manual
							approval.
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</AnimatedReveal>
</section>
