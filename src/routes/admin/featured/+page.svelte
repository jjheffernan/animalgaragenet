<script lang="ts">
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: import('./$types').ActionData } = $props();

	const savedSection = $derived(form?.sectionKey ?? 'hero');
</script>

<svelte:head>
	<title>Featured Sections — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Featured Sections</h1>
<p class="mt-1 text-sm text-zinc-500">
	Homepage CMS — hero, UGC strip, and campaign blocks from
	<code class="text-zinc-400">featured_sections</code>.
</p>

{#if form?.saved}
	<p class="mt-4 rounded-sm border border-green-900/50 bg-green-950/30 px-4 py-2 text-sm text-green-400">
		{savedSection} section saved.
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

<section class="mt-10 max-w-xl">
	<h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">UGC strip</h2>
	{#if data.ugc}
		<form method="POST" action="?/saveUgc" class="mt-4 space-y-4">
			<label class="block">
				<span class="text-xs text-zinc-500">Section title</span>
				<input
					name="title"
					value={String(data.ugc.content.title ?? '')}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Subtitle</span>
				<textarea
					name="subtitle"
					rows="2"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
					>{String(data.ugc.content.subtitle ?? '')}</textarea
				>
			</label>
			<label class="flex items-center gap-2 text-sm text-zinc-400">
				<input type="checkbox" name="active" checked={data.ugc.active} class="rounded-sm" />
				Show on homepage
			</label>
			<button
				type="submit"
				class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
			>
				Save UGC section
			</button>
		</form>
	{/if}
</section>

<section class="mt-10 max-w-xl">
	<h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">Campaign block</h2>
	{#if data.campaign}
		<form method="POST" action="?/saveCampaign" class="mt-4 space-y-4">
			<label class="block">
				<span class="text-xs text-zinc-500">Badge label</span>
				<input
					name="badgeLabel"
					value={String(data.campaign.content.badgeLabel ?? 'Drop Incoming')}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Title</span>
				<input
					name="title"
					value={String(data.campaign.content.title ?? '')}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Subtitle</span>
				<textarea
					name="subtitle"
					rows="2"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
					>{String(data.campaign.content.subtitle ?? '')}</textarea
				>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-500">Countdown end (ISO datetime)</span>
				<input
					name="endDate"
					value={String(data.campaign.content.endDate ?? '')}
					placeholder="2026-07-15T23:59:59Z"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="flex items-center gap-2 text-sm text-zinc-400">
				<input type="checkbox" name="active" checked={data.campaign.active} class="rounded-sm" />
				Show on homepage
			</label>
			<button
				type="submit"
				class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
			>
				Save campaign section
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
