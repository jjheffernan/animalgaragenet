<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusCards: Array<{
		key: keyof PageData['status'];
		label: string;
		hint: string;
	}> = [
		{
			key: 'saleorEnabled',
			label: 'Saleor',
			hint: 'PUBLIC_SALEOR_API_URL'
		},
		{
			key: 'ghostEnabled',
			label: 'Ghost CMS',
			hint: 'GHOST_URL + GHOST_CONTENT_API_KEY'
		},
		{
			key: 'supabaseConfigured',
			label: 'Supabase',
			hint: 'PUBLIC_SUPABASE_URL + anon key'
		},
		{
			key: 'mockGuardsActive',
			label: 'Mock guards',
			hint: 'Production site URL — blocks silent mock fallbacks'
		},
		{
			key: 'youtubeSyncConfigured',
			label: 'YouTube cron',
			hint: 'YOUTUBE_SYNC_SECRET present'
		},
		{
			key: 'siteLocked',
			label: 'Site lockdown',
			hint: 'SITE_LOCKED=true'
		}
	];

	const adminTools = [
		{ href: '/admin/featured', label: 'Featured sections', detail: 'Homepage hero CMS' },
		{ href: '/admin/builds', label: 'Builds', detail: 'Moderate build submissions' },
		{ href: '/admin/testimonials', label: 'Testimonials', detail: 'UGC moderation queue' },
		{ href: '/admin/youtube', label: 'YouTube', detail: 'Channel sync (manual + cron)' }
	] as const;
</script>

<svelte:head>
	<title>Runtime — Admin — Animal Garage</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="font-display text-2xl font-bold uppercase">Runtime</h1>
		<p class="mt-1 text-base-content/70">Integration status and staff tools — booleans only, no secrets.</p>
	</div>

	<section>
		<h2 class="text-base-content/50 text-xs font-bold uppercase tracking-widest">Integration status</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each statusCards as card (card.key)}
				{@const on = data.status[card.key]}
				<div class="card bg-base-200 shadow-sm">
					<div class="card-body gap-2 py-4">
						<div class="flex items-start justify-between gap-3">
							<p class="text-base-content/50 text-xs font-bold uppercase tracking-widest">
								{card.label}
							</p>
							<span class="badge badge-sm {on ? 'badge-success' : 'badge-ghost'}">
								{on ? 'On' : 'Off'}
							</span>
						</div>
						<p class="text-base-content/70 text-sm">{card.hint}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-base-content/50 text-xs font-bold uppercase tracking-widest">Cron triggers</h2>
		<p class="text-base-content/60 mt-2 text-sm">
			Scheduled jobs use secret headers — configure in Netlify cron or external scheduler.
		</p>
		<ul class="mt-4 space-y-3">
			{#each data.cronTriggers as trigger (trigger.id)}
				<li class="card bg-base-200 shadow-sm">
					<div class="card-body gap-2 py-3">
						<div class="flex flex-wrap items-center justify-between gap-2">
							<span class="font-medium">{trigger.label}</span>
							<span
								class="badge badge-sm {trigger.configured ? 'badge-success' : 'badge-warning'}"
							>
								{trigger.configured ? 'Configured' : 'Not configured'}
							</span>
						</div>
						<p class="font-mono text-base-content/50 text-xs">{trigger.path}</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<div class="card bg-base-200 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-sm">Admin tools</h2>
			<ul class="list mt-2">
				{#each adminTools as tool (tool.href)}
					<li>
						<a href={resolve(tool.href)} class="list-row hover:bg-base-300 rounded-box">
							<div class="list-col-grow">
								<span class="font-medium">{tool.label}</span>
								<p class="text-base-content/60 text-xs">{tool.detail}</p>
							</div>
							<span class="text-base-content/40" aria-hidden="true">→</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
