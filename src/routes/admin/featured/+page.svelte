<script lang="ts">
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminAlertError,
		adminAlertSuccess,
		adminBadgeOff,
		adminBadgeOn,
		adminBtnPrimary,
		adminCard,
		adminInputSm,
		adminLabel,
		adminSectionTitle
	} from '$lib/components/admin/admin-ui';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: import('./$types').ActionData } = $props();

	const savedSection = $derived(form?.sectionKey ?? 'hero');
</script>

<svelte:head>
	<title>Featured Sections — Admin</title>
</svelte:head>

<div class="space-y-6">
	<AdminPageHeader
		title="Featured Sections"
		subtitle="Homepage CMS — hero, UGC strip, and campaign blocks from featured_sections."
	/>

	{#if form?.saved}
		<div role="alert" class={adminAlertSuccess}>
			{savedSection} section saved.
		</div>
	{:else if form?.error}
		<div role="alert" class={adminAlertError}>
			{form.error}
		</div>
	{/if}

	<div class="{adminCard} max-w-xl">
		<h2 class={adminSectionTitle}>Hero</h2>
		{#if data.hero}
			<form method="POST" action="?/saveHero" class="mt-4 space-y-4">
				<label class={adminLabel}>
					Headline
					<input
						name="headline"
						value={String(data.hero.content.headline ?? '')}
						class={adminInputSm}
					/>
				</label>
				<label class={adminLabel}>
					Subheadline
					<textarea name="subheadline" rows="2" class={adminInputSm}
						>{String(data.hero.content.subheadline ?? '')}</textarea
					>
				</label>
				<label class={adminLabel}>
					Hero image URL
					<input name="image" value={String(data.hero.content.image ?? '')} class={adminInputSm} />
				</label>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class={adminLabel}>
						CTA label
						<input
							name="ctaLabel"
							value={String(data.hero.content.ctaLabel ?? '')}
							class={adminInputSm}
						/>
					</label>
					<label class={adminLabel}>
						CTA href
						<input
							name="ctaHref"
							value={String(data.hero.content.ctaHref ?? '')}
							class={adminInputSm}
						/>
					</label>
				</div>
				<button type="submit" class={adminBtnPrimary}>Save hero</button>
			</form>
		{/if}
	</div>

	<div class="{adminCard} max-w-xl">
		<h2 class={adminSectionTitle}>UGC strip</h2>
		{#if data.ugc}
			<form method="POST" action="?/saveUgc" class="mt-4 space-y-4">
				<label class={adminLabel}>
					Section title
					<input name="title" value={String(data.ugc.content.title ?? '')} class={adminInputSm} />
				</label>
				<label class={adminLabel}>
					Subtitle
					<textarea name="subtitle" rows="2" class={adminInputSm}
						>{String(data.ugc.content.subtitle ?? '')}</textarea
					>
				</label>
				<label class="flex items-center gap-3 text-sm text-zinc-400">
					<input
						type="checkbox"
						name="active"
						checked={data.ugc.active}
						class="rounded border-zinc-600 bg-zinc-900 text-red-600 focus:ring-red-600"
					/>
					Show on homepage
				</label>
				<button type="submit" class={adminBtnPrimary}>Save UGC section</button>
			</form>
		{/if}
	</div>

	<div class="{adminCard} max-w-xl">
		<h2 class={adminSectionTitle}>Campaign block</h2>
		{#if data.campaign}
			<form method="POST" action="?/saveCampaign" class="mt-4 space-y-4">
				<label class={adminLabel}>
					Badge label
					<input
						name="badgeLabel"
						value={String(data.campaign.content.badgeLabel ?? 'Drop Incoming')}
						class={adminInputSm}
					/>
				</label>
				<label class={adminLabel}>
					Title
					<input
						name="title"
						value={String(data.campaign.content.title ?? '')}
						class={adminInputSm}
					/>
				</label>
				<label class={adminLabel}>
					Subtitle
					<textarea name="subtitle" rows="2" class={adminInputSm}
						>{String(data.campaign.content.subtitle ?? '')}</textarea
					>
				</label>
				<label class={adminLabel}>
					Countdown end (ISO datetime)
					<input
						name="endDate"
						value={String(data.campaign.content.endDate ?? '')}
						placeholder="2026-07-15T23:59:59Z"
						class={adminInputSm}
					/>
				</label>
				<label class="flex items-center gap-3 text-sm text-zinc-400">
					<input
						type="checkbox"
						name="active"
						checked={data.campaign.active}
						class="rounded border-zinc-600 bg-zinc-900 text-red-600 focus:ring-red-600"
					/>
					Show on homepage
				</label>
				<button type="submit" class={adminBtnPrimary}>Save campaign section</button>
			</form>
		{/if}
	</div>

	<div class={adminCard}>
		<h2 class={adminSectionTitle}>All sections</h2>
		<ul class="mt-4 divide-y divide-zinc-800">
			{#each data.sections as section (section.id)}
				<li class="flex items-center justify-between py-3">
					<span class="font-medium text-white">{section.sectionKey}</span>
					<span class={section.active ? adminBadgeOn : adminBadgeOff}>
						{section.active ? 'active' : 'hidden'}
					</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
