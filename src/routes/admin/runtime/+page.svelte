<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminBadgeOff,
		adminBadgeOn,
		adminBadgeWarning,
		adminCard,
		adminSectionTitle
	} from '$lib/components/admin/admin-ui';
	import type { RuntimeStatus } from '$lib/server/admin/runtime-status';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type StatusKey = keyof RuntimeStatus;

	interface StatusCard {
		key: StatusKey;
		label: string;
		hint: string;
	}

	interface StatusGroup {
		heading: string;
		cards: StatusCard[];
	}

	const statusGroups: StatusGroup[] = [
		{
			heading: 'Commerce',
			cards: [
				{
					key: 'saleorEnabled',
					label: 'Saleor',
					hint: 'PUBLIC_SALEOR_API_URL'
				}
			]
		},
		{
			heading: 'Content',
			cards: [
				{
					key: 'ghostEnabled',
					label: 'Ghost CMS',
					hint: 'GHOST_URL + GHOST_CONTENT_API_KEY'
				},
				{
					key: 'youtubeSyncConfigured',
					label: 'YouTube cron',
					hint: 'YOUTUBE_SYNC_SECRET present'
				}
			]
		},
		{
			heading: 'Platform',
			cards: [
				{
					key: 'supabaseConfigured',
					label: 'Supabase',
					hint: 'SUPABASE_DATABASE_URL + SUPABASE_ANON_KEY'
				},
				{
					key: 'mockGuardsActive',
					label: 'Mock guards',
					hint: 'Production site URL — blocks silent mock fallbacks'
				},
				{
					key: 'siteLocked',
					label: 'Site lockdown',
					hint: 'SITE_LOCKED=true'
				}
			]
		}
	];

	const adminTools = [
		{ href: '/admin/featured', label: 'Featured sections', detail: 'Homepage hero CMS' },
		{ href: '/admin/builds', label: 'Builds', detail: 'Moderate build submissions' },
		{ href: '/admin/testimonials', label: 'Testimonials', detail: 'UGC moderation queue' },
		{ href: '/admin/youtube', label: 'YouTube', detail: 'Channel sync (manual + cron)' }
	] as const;

	const checkedAtLabel = $derived(
		new Date(data.checkedAt).toLocaleString(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		})
	);
</script>

<svelte:head>
	<title>Runtime — Admin — Animal Garage</title>
</svelte:head>

<div class="space-y-8">
	<AdminPageHeader
		title="Runtime"
		subtitle="Integration status and staff tools — booleans only, no secrets."
	/>

	<p class="text-xs text-zinc-500">
		Status as of server load: <time datetime={data.checkedAt}>{checkedAtLabel}</time>
	</p>

	{#each statusGroups as group (group.heading)}
		<section>
			<h2 class={adminSectionTitle}>{group.heading}</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each group.cards as card (card.key)}
					{@const on = data.status[card.key]}
					<div class={adminCard}>
						<div class="flex items-start justify-between gap-3">
							<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">
								{card.label}
							</p>
							<span class={on ? adminBadgeOn : adminBadgeOff}>
								{on ? 'On' : 'Off'}
							</span>
						</div>
						<p class="mt-2 text-sm text-zinc-400">{card.hint}</p>
					</div>
				{/each}
			</div>
		</section>
	{/each}

	<section>
		<h2 class={adminSectionTitle}>Cron triggers</h2>
		<p class="mt-2 text-sm text-zinc-500">
			Scheduled jobs use secret headers — configure in Netlify cron or external scheduler.
		</p>
		<ul class="mt-4 space-y-3">
			{#each data.cronTriggers as trigger (trigger.id)}
				<li class={adminCard}>
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="font-medium text-white">{trigger.label}</span>
						<span class={trigger.configured ? adminBadgeOn : adminBadgeWarning}>
							{trigger.configured ? 'Configured' : 'Not configured'}
						</span>
					</div>
					<p class="mt-2 font-mono text-xs text-zinc-500">{trigger.path}</p>
				</li>
			{/each}
		</ul>
	</section>

	<div class={adminCard}>
		<h2 class={adminSectionTitle}>Admin tools</h2>
		<ul class="mt-4 space-y-1">
			{#each adminTools as tool (tool.href)}
				<li>
					<a
						href={resolve(tool.href)}
						class="flex items-center justify-between rounded-sm px-3 py-2 transition hover:bg-zinc-800"
					>
						<div>
							<span class="font-medium text-zinc-100">{tool.label}</span>
							<p class="text-xs text-zinc-500">{tool.detail}</p>
						</div>
						<span class="text-zinc-600" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
