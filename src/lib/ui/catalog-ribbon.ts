/** Shared classes for shop + parts catalog ribbons (mobile + desktop). */
export const catalogRibbonShellClass =
	'sticky top-[var(--site-header-height,4.5rem)] z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur';

export const catalogRibbonInnerClass = 'mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8';

/** Padding wrapper when scroll track is split from dropdown layer (parts ribbon). */
export const catalogRibbonInsetClass = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

/** Horizontal scroll track — keep dropdown panels outside this element. */
export const catalogRibbonScrollTrackClass = 'overflow-x-auto overscroll-x-contain';

export const catalogRibbonNavClass = 'flex min-w-0 gap-1 py-3';

/** Nav row inside a horizontal scroll track (w-max enables overflow scroll). */
export const catalogRibbonScrollNavClass =
	'flex w-max min-w-full flex-nowrap items-center gap-1 py-3';

export const categoryPillBaseClass =
	'shrink-0 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition';

export function categoryPillClass(active = false): string {
	return active
		? `${categoryPillBaseClass} bg-red-600 text-white`
		: `${categoryPillBaseClass} text-zinc-400 hover:bg-zinc-800 hover:text-white`;
}

export const ribbonSectionLabelClass = 'text-xs font-bold uppercase tracking-widest text-zinc-500';

export const ribbonMenuLinkBaseClass =
	'block rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition';

export function ribbonMenuLinkClass(active = false): string {
	return active
		? `${ribbonMenuLinkBaseClass} bg-red-600 text-white`
		: `${ribbonMenuLinkBaseClass} text-zinc-400 hover:bg-zinc-800 hover:text-white`;
}

/** Sticky shell for top list controls (shop / parts PLP). */
export const listControlsStickyShellClass =
	'sticky z-30 -mx-4 mb-6 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8';

export function listControlsStickyTopClass(ribbon: 'catalog' | 'parts'): string {
	const ribbonVar = ribbon === 'parts' ? '--parts-ribbon-height' : '--catalog-ribbon-height';
	return `top-[calc(var(--site-header-height,4.5rem)+var(${ribbonVar},0px))]`;
}
