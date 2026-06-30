<script lang="ts">
	import { resolve } from '$app/paths';
	import { resolvePath } from '$lib/utils/paths';
	import { getShopCollections } from '$lib/data/mock-collections';
	import { mockPartCategories } from '$lib/data/mock-part-categories';

	interface Props {
		type: 'shop' | 'parts';
		open?: boolean;
		onclose?: () => void;
	}

	let { type, open = false, onclose }: Props = $props();

	const shopCategories = [
		{ label: 'Apparel', href: '/shop?category=apparel', seed: 'agmenu-apparel' },
		{ label: 'Accessories', href: '/shop?category=accessories', seed: 'agmenu-accessories' },
		{ label: 'Auto', href: '/shop?category=auto', seed: 'agmenu-auto' },
		{ label: 'Home', href: '/shop?category=home', seed: 'agmenu-home' },
		{ label: 'Clearance', href: '/shop?collection=clearance', seed: 'agmenu-clearance' },
		{ label: 'Gift Cards', href: '/gift-cards', seed: 'agmenu-gift' }
	];

	const collections = getShopCollections().slice(0, 4);
</script>

{#if open}
	<div class="absolute left-0 right-0 top-full pt-2">
		<div
			class="border-b border-zinc-800 bg-zinc-950 shadow-xl"
			role="menu"
			tabindex="0"
		>
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			{#if type === 'shop'}
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Categories</p>
						<div class="mt-3 grid grid-cols-2 gap-3">
							{#each shopCategories as cat (cat.href)}
								<a
									href={resolvePath(cat.href)}
									class="group relative overflow-hidden rounded-sm border border-zinc-800"
									role="menuitem"
									onclick={() => onclose?.()}
								>
									<img
										src="https://picsum.photos/seed/{cat.seed}/300/200"
										alt={cat.label}
										class="aspect-[3/2] w-full object-cover transition group-hover:scale-105"
									/>
									<span
										class="absolute inset-0 flex items-end bg-gradient-to-t from-zinc-950/90 to-transparent p-3 text-xs font-bold uppercase tracking-wider text-white"
									>
										{cat.label}
									</span>
								</a>
							{/each}
						</div>
					</div>
					<div>
						<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Collections</p>
						<ul class="mt-3 space-y-2">
							{#each collections as col (col.id)}
								<li>
									<a
										href={resolve(`/shop?collection=${col.slug}`)}
										class="flex items-center gap-3 rounded-sm p-2 hover:bg-zinc-900"
										onclick={() => onclose?.()}
									>
										{#if col.backgroundImage}
											<img
												src={col.backgroundImage.url}
												alt={col.name}
												class="h-12 w-16 rounded-sm object-cover"
											/>
										{/if}
										<div>
											<p class="text-sm font-medium text-white">{col.name}</p>
											<p class="text-xs text-zinc-500">{col.description.slice(0, 60)}…</p>
										</div>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{:else}
				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
					{#each mockPartCategories as cat (cat.id)}
						<a
							href={resolve(`/parts/${cat.slug}`)}
							class="group overflow-hidden rounded-sm border border-zinc-800"
							role="menuitem"
							onclick={() => onclose?.()}
						>
							{#if cat.imageUrl}
								<img
									src={cat.imageUrl}
									alt={cat.name}
									class="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
								/>
							{/if}
							<div class="p-3">
								<p class="text-xs font-bold uppercase tracking-wider text-white">{cat.name}</p>
								{#if cat.children}
									<ul class="mt-1 space-y-0.5">
										{#each cat.children.slice(0, 3) as child (child.id)}
											<li class="text-[10px] text-zinc-500">{child.name}</li>
										{/each}
									</ul>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
		</div>
	</div>
{/if}
