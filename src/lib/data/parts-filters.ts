import { mockVehicleData } from '$lib/data/mock/vehicles';
import { getBrandBySlug } from '$lib/data/mock/brands';
import type { Product } from '$lib/types/saleor';

export const PARTS_BUILD_TYPES = [
	{
		slug: 'swapped',
		label: 'Engine Swapped',
		tag: 'build-swapped',
		description: 'Boost, tune, and swap-ready hardware.'
	},
	{
		slug: 'stock',
		label: 'Bone Stock',
		tag: 'build-stock',
		description: 'OEM+ bolt-ons — wheels, exhaust, suspension.'
	},
	{
		slug: 'weird',
		label: 'Weird Platform',
		tag: 'build-weird',
		description: 'Niche chassis, universal fit, and left-field builds.'
	}
] as const;

export type PartsBuildType = (typeof PARTS_BUILD_TYPES)[number]['slug'];

export interface PartsFilterState {
	build?: string;
	brand?: string;
	year?: string;
	make?: string;
	model?: string;
	submodel?: string;
}

const BUILD_TAG_BY_SLUG = Object.fromEntries(
	PARTS_BUILD_TYPES.map((b) => [b.slug, b.tag])
) as Record<PartsBuildType, string>;

export function parsePartsFilters(url: URL): PartsFilterState {
	const ymm = url.searchParams.get('ymm');
	if (ymm) {
		const parsed = parseYmmParam(ymm);
		if (parsed) return { ...parsed, brand: url.searchParams.get('brand') ?? undefined, build: url.searchParams.get('build') ?? undefined };
	}

	return {
		build: url.searchParams.get('build') ?? undefined,
		brand: url.searchParams.get('brand') ?? undefined,
		year: url.searchParams.get('year') ?? undefined,
		make: url.searchParams.get('make') ?? undefined,
		model: url.searchParams.get('model') ?? undefined,
		submodel: url.searchParams.get('submodel') ?? undefined
	};
}

function parseYmmParam(ymm: string): Omit<PartsFilterState, 'build' | 'brand'> | null {
	const segments = ymm.toLowerCase().split('-');
	const year = segments[0];
	if (!/^\d{4}$/.test(year)) return null;

	for (const entry of mockVehicleData) {
		const makeSlug = entry.make.toLowerCase().replace(/\s+/g, '-');
		const makeIndex = segments.indexOf(makeSlug, 1);
		if (makeIndex === -1) continue;

		for (const modelEntry of entry.models) {
			const modelParts = modelEntry.model.toLowerCase().replace(/\s+/g, '-').split('-');
			const modelEnd = makeIndex + modelParts.length;
			if (segments.slice(makeIndex + 1, modelEnd + 1).join('-') !== modelParts.join('-')) continue;

			const submodelParts = segments.slice(modelEnd + 1);
			const submodel =
				submodelParts.length > 0
					? submodelParts
							.join('-')
							.replace(/-/g, ' ')
							.replace(/\b\w/g, (c) => c.toUpperCase())
					: undefined;

			return {
				year,
				make: entry.make,
				model: modelEntry.model,
				submodel
			};
		}
	}

	return null;
}

function matchesFitment(product: Product, filters: PartsFilterState): boolean {
	if (!product.fitment?.length) return false;
	const year = filters.year ? Number(filters.year) : null;
	const make = filters.make?.toLowerCase();
	const model = filters.model?.toLowerCase();
	const submodel = filters.submodel?.toLowerCase();

	return product.fitment.some((f) => {
		if (year !== null && f.year !== year) return false;
		if (make && f.make.toLowerCase() !== make) return false;
		if (model && f.model.toLowerCase() !== model) return false;
		if (submodel && (f.submodel?.toLowerCase() ?? '') !== submodel) return false;
		return true;
	});
}

export function filterPartsProducts(products: Product[], filters: PartsFilterState): Product[] {
	let result = products;

	if (filters.brand) {
		result = result.filter((p) => p.brand?.slug === filters.brand);
	}

	if (filters.build) {
		const tag = BUILD_TAG_BY_SLUG[filters.build as PartsBuildType];
		if (tag) {
			result = result.filter((p) => p.tags?.includes(tag));
		}
	}

	if (filters.year || filters.make || filters.model || filters.submodel) {
		result = result.filter((p) => matchesFitment(p, filters));
	}

	return result;
}

export function formatPartsFilterLabel(filters: PartsFilterState): string | null {
	const parts: string[] = [];

	if (filters.year || filters.make || filters.model) {
		parts.push(
			[filters.year, filters.make, filters.model, filters.submodel].filter(Boolean).join(' ')
		);
	}

	if (filters.brand) {
		parts.push(getBrandBySlug(filters.brand)?.name ?? filters.brand.replace(/-/g, ' '));
	}

	if (filters.build) {
		const build = PARTS_BUILD_TYPES.find((b) => b.slug === filters.build);
		if (build) parts.push(build.label);
	}

	return parts.length > 0 ? parts.join(' · ') : null;
}

export function buildPartsFilterUrl(
	pathname: string,
	searchParams: URLSearchParams,
	updates: Partial<PartsFilterState> & { resetPage?: boolean }
): string {
	const params = new URLSearchParams(searchParams);
	params.delete('ymm');

	const keys: (keyof PartsFilterState)[] = ['build', 'brand', 'year', 'make', 'model', 'submodel'];
	for (const key of keys) {
		if (key in updates) {
			const value = updates[key];
			if (value) params.set(key, value);
			else params.delete(key);
		}
	}

	if (updates.resetPage !== false) {
		params.delete('page');
	}

	const qs = params.toString();
	return qs ? `${pathname}?${qs}` : pathname;
}
