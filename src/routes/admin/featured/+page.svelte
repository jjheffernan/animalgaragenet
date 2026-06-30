<script lang="ts">
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: import('./$types').ActionData } = $props();
</script>

<svelte:head>
	<title>Featured Sections — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Featured Sections</h1>
<p class="mt-1 text-sm text-zinc-500">
	Homepage CMS — hero campaign content from <code class="text-zinc-400">featured_sections</code>.
</p>

{#if form?.saved}
	<p class="mt-4 rounded-sm border border-green-900/50 bg-green-950/30 px-4 py-2 text-sm text-green-400">
		Hero section saved.
	</p>
{:else if form?.error}
	<p class="mt-4 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-400">
		{form.error}
	</p>
{/if}

<section class="mt-8 max-w-xl">
	<h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">Hero</h2>
	{#if data.hero}
		<form method="POST" action="?/saveHero" class="mt-4 space-y-4">
			<label class="block">
				<span class="text-xs text-zinc-500">Headline</span>
				<input
					name="headline"
					value={String(data.hero.content.headline ?? '')}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Subheadline</span>
				<textarea
					name="subheadline"
					rows="2"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
					>{String(data.hero.content.subheadline ?? '')}</textarea
				>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Hero image URL</span>
				<input
					name="image"
					value={String(data.hero.content.image ?? '')}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block">
					<span class="text-xs text-zinc-500">CTA label</span>
					<input
						name="ctaLabel"
						value={String(data.hero.content.ctaLabel ?? '')}
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
					/>
				</label>
				<label class="block">
					<span class="text-xs text-zinc-500">CTA href</span>
					<input
						name="ctaHref"
						value={String(data.hero.content.ctaHref ?? '')}
						class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
					/>
				</label>
			</div>
			<button
				type="submit"
				class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
			>
				Save hero
			</button>
		</form>
	{/if}
</section>

<section class="mt-10">
	<h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">All sections</h2>
	<ul class="mt-3 space-y-2 text-sm">
		{#each data.sections as section (section.id)}
			<li class="rounded-sm border border-zinc-800 px-3 py-2 text-zinc-400">
				<span class="text-white">{section.sectionKey}</span>
				<span class="ml-2 text-xs {section.active ? 'text-green-500' : 'text-zinc-600'}">
					{section.active ? 'active' : 'hidden'}
				</span>
			</li>
		{/each}
	</ul>
</section>
