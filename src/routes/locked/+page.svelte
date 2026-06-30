<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Maintenance — Animal Garage</title>
</svelte:head>

<section
	class="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center"
>
	<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Site locked</p>
	<h1 class="mt-4 font-display text-3xl font-bold uppercase text-white">Pit stop in progress</h1>
	<p class="mt-4 text-zinc-400">
		Animal Garage is in maintenance mode. Check back soon — admins can still sign in below.
	</p>
	<a
		href={resolve('/auth/sign-in')}
		class="mt-8 rounded-sm bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
	>
		Sign in
	</a>
</section>
