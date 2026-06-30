<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import { adminBtnOutline, adminBtnPrimary, adminQueueCard } from '$lib/components/admin/admin-ui';
	import PaginatedListCanvas from '$lib/components/catalog/PaginatedListCanvas.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Testimonial Moderation — Admin</title>
</svelte:head>

<AdminPageHeader
	title="Testimonial Moderation"
	subtitle="Approve Garage Squad reviews before they publish on /loyalty."
/>

{#if data.pending.length === 0}
	<p class="mt-8 text-zinc-500">No testimonials awaiting review.</p>
{:else}
	<PaginatedListCanvas pagination={data.pagination} class="mt-8">
		<ul class="space-y-4">
			{#each data.pending as testimonial (testimonial.id)}
				<li class={adminQueueCard}>
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<h2 class="font-medium text-white">{testimonial.title}</h2>
							<p class="mt-1 text-sm text-zinc-500">
								{testimonial.displayName}
								{#if testimonial.vehicleSummary}
									· {testimonial.vehicleSummary}
								{/if}
							</p>
						</div>
						<p class="text-sm font-bold text-red-500">{testimonial.rating}/5</p>
					</div>
					<p class="mt-3 text-sm text-zinc-400">{testimonial.body}</p>
					{#if testimonial.loyaltyTier}
						<p class="mt-2 text-xs text-zinc-600">Tier snapshot: {testimonial.loyaltyTier}</p>
					{/if}
					<div class="mt-4 flex flex-wrap items-center gap-4">
						<form
							method="POST"
							action="?/approve"
							use:enhance
							class="flex flex-wrap items-center gap-3"
						>
							<input type="hidden" name="id" value={testimonial.id} />
							<label class="flex items-center gap-2 text-sm text-zinc-400">
								<input
									type="checkbox"
									name="featured"
									class="rounded border-zinc-600 bg-zinc-900 text-red-600 focus:ring-red-600"
								/>
								Feature on homepage
							</label>
							<button type="submit" class={adminBtnPrimary}>Approve</button>
						</form>
						<form method="POST" action="?/reject" use:enhance>
							<input type="hidden" name="id" value={testimonial.id} />
							<button type="submit" class={adminBtnOutline}>Reject</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</PaginatedListCanvas>
{/if}
