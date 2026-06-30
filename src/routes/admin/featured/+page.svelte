<script lang="ts">
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: import('./$types').ActionData } = $props();

	const savedSection = $derived(form?.sectionKey ?? 'hero');
</script>

<svelte:head>
	<title>Featured Sections — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase">Featured Sections</h1>
		<p class="mt-1 text-base-content/70 text-sm">
			Homepage CMS — hero, UGC strip, and campaign blocks from
			<code class="text-base-content/50">featured_sections</code>.
		</p>
	</div>

	{#if form?.saved}
		<div role="alert" class="alert alert-success alert-soft">
			<span>{savedSection} section saved.</span>
		</div>
	{:else if form?.error}
		<div role="alert" class="alert alert-error alert-soft">
			<span>{form.error}</span>
		</div>
	{/if}

	<div class="card bg-base-200 max-w-xl shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-sm">Hero</h2>
			{#if data.hero}
				<form method="POST" action="?/saveHero" class="mt-2 space-y-4">
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Headline</legend>
						<input
							name="headline"
							value={String(data.hero.content.headline ?? '')}
							class="input input-sm w-full"
						/>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Subheadline</legend>
						<textarea name="subheadline" rows="2" class="textarea textarea-sm w-full"
							>{String(data.hero.content.subheadline ?? '')}</textarea
						>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Hero image URL</legend>
						<input
							name="image"
							value={String(data.hero.content.image ?? '')}
							class="input input-sm w-full"
						/>
					</fieldset>
					<div class="grid gap-4 sm:grid-cols-2">
						<fieldset class="fieldset w-full">
							<legend class="fieldset-legend text-xs">CTA label</legend>
							<input
								name="ctaLabel"
								value={String(data.hero.content.ctaLabel ?? '')}
								class="input input-sm w-full"
							/>
						</fieldset>
						<fieldset class="fieldset w-full">
							<legend class="fieldset-legend text-xs">CTA href</legend>
							<input
								name="ctaHref"
								value={String(data.hero.content.ctaHref ?? '')}
								class="input input-sm w-full"
							/>
						</fieldset>
					</div>
					<button type="submit" class="btn btn-primary btn-sm">Save hero</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="card bg-base-200 max-w-xl shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-sm">UGC strip</h2>
			{#if data.ugc}
				<form method="POST" action="?/saveUgc" class="mt-2 space-y-4">
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Section title</legend>
						<input
							name="title"
							value={String(data.ugc.content.title ?? '')}
							class="input input-sm w-full"
						/>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Subtitle</legend>
						<textarea name="subtitle" rows="2" class="textarea textarea-sm w-full"
							>{String(data.ugc.content.subtitle ?? '')}</textarea
						>
					</fieldset>
					<label class="label cursor-pointer justify-start gap-3">
						<input
							type="checkbox"
							name="active"
							checked={data.ugc.active}
							class="checkbox checkbox-sm"
						/>
						<span class="label-text">Show on homepage</span>
					</label>
					<button type="submit" class="btn btn-primary btn-sm">Save UGC section</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="card bg-base-200 max-w-xl shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-sm">Campaign block</h2>
			{#if data.campaign}
				<form method="POST" action="?/saveCampaign" class="mt-2 space-y-4">
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Badge label</legend>
						<input
							name="badgeLabel"
							value={String(data.campaign.content.badgeLabel ?? 'Drop Incoming')}
							class="input input-sm w-full"
						/>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Title</legend>
						<input
							name="title"
							value={String(data.campaign.content.title ?? '')}
							class="input input-sm w-full"
						/>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Subtitle</legend>
						<textarea name="subtitle" rows="2" class="textarea textarea-sm w-full"
							>{String(data.campaign.content.subtitle ?? '')}</textarea
						>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend text-xs">Countdown end (ISO datetime)</legend>
						<input
							name="endDate"
							value={String(data.campaign.content.endDate ?? '')}
							placeholder="2026-07-15T23:59:59Z"
							class="input input-sm w-full"
						/>
					</fieldset>
					<label class="label cursor-pointer justify-start gap-3">
						<input
							type="checkbox"
							name="active"
							checked={data.campaign.active}
							class="checkbox checkbox-sm"
						/>
						<span class="label-text">Show on homepage</span>
					</label>
					<button type="submit" class="btn btn-primary btn-sm">Save campaign section</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="card bg-base-200 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-sm">All sections</h2>
			<ul class="list mt-2">
				{#each data.sections as section (section.id)}
					<li class="list-row">
						<div class="list-col-grow">
							<span class="font-medium">{section.sectionKey}</span>
						</div>
						<span class="badge badge-sm {section.active ? 'badge-success' : 'badge-ghost'}">
							{section.active ? 'active' : 'hidden'}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
