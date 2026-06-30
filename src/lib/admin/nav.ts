/** Admin sidebar navigation — mirrors template `routes/sidebar.js` pattern. */
export interface AdminNavItem {
	href: string;
	label: string;
	exact?: boolean;
	/** Shown when icon set ships; optional until then */
	icon?: string;
	/** Route not scaffolded yet — sidebar renders label without link */
	disabled?: boolean;
}

export interface AdminNavSection {
	label: string;
	items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
	{
		label: 'Overview',
		items: [{ href: '/admin/dashboard', label: 'Dashboard', exact: true }]
	},
	{
		label: 'Commerce',
		items: [
			{ href: '/admin/commerce/channels', label: 'Saleor Channels', disabled: true },
			{ href: '/admin/commerce/orders', label: 'Orders', disabled: true },
			{ href: '/admin/wholesale', label: 'Wholesale', disabled: true }
		]
	},
	{
		label: 'Content',
		items: [
			{ href: '/admin/featured', label: 'Featured Sections' },
			{ href: '/admin/builds', label: 'Builds' },
			{ href: '/admin/testimonials', label: 'Testimonials' },
			{ href: '/admin/youtube', label: 'YouTube' },
			{ href: '/admin/media', label: 'Media' },
			{ href: '/admin/social/ugc', label: 'UGC', disabled: true }
		]
	},
	{
		label: 'Users',
		items: [{ href: '/admin/users', label: 'Users & Roles' }]
	},
	{
		label: 'Runtime',
		items: [{ href: '/admin/runtime', label: 'Integrations', exact: true }]
	}
];

/** Flat list for mobile horizontal nav */
export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((s) => s.items);
