<script lang="ts">
	import AnimatedReveal from './AnimatedReveal.svelte';
</script>

<section class="relative flex min-h-[85vh] items-center overflow-hidden">
	<div
		class="absolute inset-0 bg-cover bg-center"
		style="background-image: url('https://picsum.photos/seed/aghero/1920/1080')"
		aria-hidden="true"
	></div>
	<div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40"></div>
	<div
		class="absolute inset-0 opacity-20"
		style="background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(220,38,38,0.1) 10px, rgba(220,38,38,0.1) 11px)"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Built Different</p>
			<h1
				class="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl"
			>
				Garage<br /><span class="text-red-600">Culture</span><br />Delivered
			</h1>
			<p class="mt-6 max-w-xl text-lg text-zinc-400">
				Merch, media, and the raw energy of the shop floor — Animal Garage is your automotive brand
				touchpoint.
			</p>
			<div class="mt-10 flex flex-wrap gap-4">
				<a
					href="/shop"
					class="inline-block rounded-sm bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/20"
				>
					Shop the Drop
				</a>
				<a
					href="/media"
					class="inline-block rounded-sm border border-zinc-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white"
				>
					Watch Builds
				</a>
			</div>
		</AnimatedReveal>
	</div>

	<div
		class="hero-scan absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"
		aria-hidden="true"
	></div>
</section>

<style>
	.hero-scan {
		animation: scan 4s ease-in-out infinite;
	}

	@keyframes scan {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}
</style>
