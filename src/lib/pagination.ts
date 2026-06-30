export const DEFAULT_PER_PAGE = 10;
export const PER_PAGE_OPTIONS = [10, 20, 30, 50] as const;

export const LIST_VIEW_OPTIONS = ['list', 'grid-lg', 'grid-sm'] as const;
export const DEFAULT_LIST_VIEW = 'grid-lg' as const;

export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];
export type ListView = (typeof LIST_VIEW_OPTIONS)[number];

export interface PaginationMeta {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export function parsePagination(url: URL): { page: number; perPage: number; offset: number } {
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const rawPerPage = Number(url.searchParams.get('perPage')) || DEFAULT_PER_PAGE;
	const perPage = (PER_PAGE_OPTIONS as readonly number[]).includes(rawPerPage)
		? rawPerPage
		: DEFAULT_PER_PAGE;

	return { page, perPage, offset: (page - 1) * perPage };
}

export function parseListView(url: URL): ListView {
	const raw = url.searchParams.get('view');
	if (raw && (LIST_VIEW_OPTIONS as readonly string[]).includes(raw)) {
		return raw as ListView;
	}
	return DEFAULT_LIST_VIEW;
}

export function paginateArray<T>(
	items: T[],
	page: number,
	perPage: number
): { items: T[]; pagination: PaginationMeta } {
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const offset = (safePage - 1) * perPage;

	return {
		items: items.slice(offset, offset + perPage),
		pagination: {
			page: safePage,
			perPage,
			total,
			totalPages
		}
	};
}

export function paginateFromUrl<T>(
	url: URL,
	items: T[]
): { items: T[]; pagination: PaginationMeta } {
	const { page, perPage } = parsePagination(url);
	return paginateArray(items, page, perPage);
}

export function paginationRange(pagination: PaginationMeta): { start: number; end: number } {
	if (pagination.total === 0) return { start: 0, end: 0 };
	const start = (pagination.page - 1) * pagination.perPage + 1;
	const end = Math.min(pagination.page * pagination.perPage, pagination.total);
	return { start, end };
}

export function buildPaginationUrl(
	pathname: string,
	searchParams: URLSearchParams,
	updates: { page?: number; perPage?: number; tab?: string; view?: ListView }
): string {
	const params = new URLSearchParams(searchParams);

	if (updates.tab !== undefined) {
		if (updates.tab === 'all' || updates.tab === '') params.delete('tab');
		else params.set('tab', updates.tab);
		params.delete('page');
	}

	if (updates.view !== undefined) {
		if (updates.view === DEFAULT_LIST_VIEW) params.delete('view');
		else params.set('view', updates.view);
	}

	if (updates.perPage !== undefined) {
		if (updates.perPage === DEFAULT_PER_PAGE) params.delete('perPage');
		else params.set('perPage', String(updates.perPage));
		params.delete('page');
	}

	if (updates.page !== undefined) {
		if (updates.page <= 1) params.delete('page');
		else params.set('page', String(updates.page));
	}

	const qs = params.toString();
	return qs ? `${pathname}?${qs}` : pathname;
}
