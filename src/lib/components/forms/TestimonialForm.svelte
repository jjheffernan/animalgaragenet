<script lang="ts">
	import type { TestimonialFields } from '$lib/server/testimonials/validation';

	interface Props {
		displayName: string;
		loyaltyTier?: string;
		errors?: Record<string, string>;
		fields?: Partial<TestimonialFields>;
	}

	let { displayName, loyaltyTier = '', errors = {}, fields = {} }: Props = $props();

	let rating = $state('5');
	$effect.pre(() => {
		rating = fields.rating ?? '5';
	});
</script>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Display Name</span>
	<input
		type="text"
		name="displayName"
		value={fields.displayName ?? displayName}
		required
		maxlength="80"
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none {errors.displayName ? 'border-red-600' : ''}"
	/>
	{#if errors.displayName}<p class="mt-1 text-xs text-red-500">{errors.displayName}</p>{/if}
</label>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Vehicle / Build (optional)</span>
	<input
		type="text"
		name="vehicleSummary"
		value={fields.vehicleSummary ?? ''}
		maxlength="120"
		placeholder="2018 Civic Type R track build"
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none {errors.vehicleSummary ? 'border-red-600' : ''}"
	/>
	{#if errors.vehicleSummary}<p class="mt-1 text-xs text-red-500">{errors.vehicleSummary}</p>{/if}
</label>

<fieldset class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Rating</span>
	<div class="mt-2 flex gap-1" role="radiogroup" aria-label="Star rating">
		{#each [1, 2, 3, 4, 5] as star (star)}
			<label class="cursor-pointer">
				<input type="radio" name="rating" value={String(star)} bind:group={rating} class="sr-only" />
				<svg
					class="h-8 w-8 transition {Number(rating) >= star ? 'text-red-500' : 'text-zinc-700'}"
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-hidden="true"
				>
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
					/>
				</svg>
				<span class="sr-only">{star} star{star === 1 ? '' : 's'}</span>
			</label>
		{/each}
	</div>
	{#if errors.rating}<p class="mt-1 text-xs text-red-500">{errors.rating}</p>{/if}
</fieldset>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Review Title</span>
	<input
		type="text"
		name="title"
		value={fields.title ?? ''}
		required
		maxlength="100"
		placeholder="Why you ride with Animal Garage"
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none {errors.title ? 'border-red-600' : ''}"
	/>
	{#if errors.title}<p class="mt-1 text-xs text-red-500">{errors.title}</p>{/if}
</label>

<label class="block">
	<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Story</span>
	<textarea
		name="body"
		rows="5"
		required
		maxlength="2000"
		placeholder="Tell the squad about your build, your experience, and what Garage Squad means to you."
		class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none {errors.body ? 'border-red-600' : ''}"
	>{fields.body ?? ''}</textarea>
	{#if errors.body}<p class="mt-1 text-xs text-red-500">{errors.body}</p>{/if}
</label>

<p class="text-xs text-zinc-600">
	Reviews are moderated before they appear publicly. Approved stories earn +50 XP toward your next level.
</p>

<input type="hidden" name="loyaltyTier" value={loyaltyTier} />
