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

<h1 class="font-display text-2xl font-bold uppercase text-white">Runtime</h1>
<p class="mt-1 text-zinc-400">Integration status and staff tools — booleans only, no secrets.</p>

<section class="mt-8">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Integration status</h2>
	<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each statusCards as card (card.key)}
			{@const on = data.status[card.key]}
			<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5">
				<div class="flex items-start justify-between gap-3">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">{card.label}</p>
					<span
						class="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase {on
							? 'bg-emerald-600/20 text-emerald-400'
							: 'bg-zinc-800 text-zinc-500'}"
					>
						{on ? 'On' : 'Off'}
					</span>
				</div>
				<p class="mt-3 text-sm text-zinc-400">{card.hint}</p>
			</div>
		{/each}
	</div>
</section>

<section class="mt-10">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Cron triggers</h2>
	<p class="mt-2 text-sm text-zinc-500">
		Scheduled jobs use secret headers — configure in Netlify cron or external scheduler.
	</p>
	<ul class="mt-4 space-y-3">
		{#each data.cronTriggers as trigger (trigger.id)}
			<li class="rounded-sm border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="font-medium text-zinc-200">{trigger.label}</span>
					<span
						class="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase {trigger.configured
							? 'bg-emerald-600/20 text-emerald-400'
							: 'bg-amber-600/20 text-amber-400'}"
					>
						{trigger.configured ? 'Configured' : 'Not configured'}
					</span>
				</div>
				<p class="mt-1 font-mono text-xs text-zinc-600">{trigger.path}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mt-10 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Admin tools</h2>
	<ul class="mt-4 space-y-3 text-sm">
		{#each adminTools as tool (tool.href)}
			<li>
				<a href={resolve(tool.href)} class="text-zinc-300 hover:text-red-400">
					→ {tool.label}
				</a>
				<span class="text-zinc-600"> — {tool.detail}</span>
			</li>
		{/each}
	</ul>
</section>
