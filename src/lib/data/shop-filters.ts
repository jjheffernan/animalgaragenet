/** Client-safe shop filter taxonomy shapes and ribbon grouping. */

export interface ShopFilterOption {
	id: string;
	slug: string;
	label: string;
	/** Parent group label for ribbon grouping (mock taxonomy or Saleor parent category). */
	group?: string;
}

export interface ShopFilterGroup {
	label: string;
	options: ShopFilterOption[];
}

/** Group flat filter options by `group` for shop ribbon / dropdown UI. */
export function groupShopFilterOptions(categories: ShopFilterOption[]): ShopFilterGroup[] {
	const ungrouped: ShopFilterOption[] = [];
	const byGroup = new Map<string, ShopFilterOption[]>();
	const groupOrder: string[] = [];

	for (const option of categories) {
		if (!option.group) {
			ungrouped.push(option);
			continue;
		}
		if (!byGroup.has(option.group)) {
			byGroup.set(option.group, []);
			groupOrder.push(option.group);
		}
		byGroup.get(option.group)!.push(option);
	}

	const groups: ShopFilterGroup[] = [];
	if (ungrouped.length > 0) {
		groups.push({ label: '', options: ungrouped });
	}
	for (const label of groupOrder) {
		groups.push({ label, options: byGroup.get(label)! });
	}
	return groups;
}
