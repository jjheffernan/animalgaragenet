/** Admin sidebar navigation — mirrors template `routes/sidebar.js` pattern. */
export interface AdminNavItem {
	href: string;
	label: string;
	exact?: boolean;
	/** Shown when daisyUI shell ships; optional until then */
	icon?: string;
}

export interface AdminNavSection {
	label: string;
	items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
	{
		label: 'Overview',
		items: [
			{ href: '/admin', label: 'Dashboard', exact: true },
			{ href: '/admin/runtime', label: 'Runtime' }
		]
	},
	{
		label: 'Social',
		items: [
			{ href: '/admin/youtube', label: 'YouTube' },
			{ href: '/admin/social/ugc', label: 'UGC' },
			{ href: '/admin/social/discord', label: 'Discord' }
		]
	},
	{
		label: 'Commerce',
		items: [
			{ href: '/admin/commerce/channels', label: 'Saleor Channels' },
			{ href: '/admin/commerce/orders', label: 'Orders' }
		]
	},
	{
		label: 'Operations',
		items: [
			{ href: '/admin/calendar', label: 'Calendar' },
			{ href: '/admin/support', label: 'Support' },
			{ href: '/admin/builds', label: 'Builds' },
			{ href: '/admin/testimonials', label: 'Testimonials' }
		]
	},
	{
		label: 'Settings',
		items: [
			{ href: '/admin/users', label: 'Users' },
			{ href: '/admin/media', label: 'Media' },
			{ href: '/admin/featured', label: 'Featured Sections' }
		]
	}
];

/** Flat list for mobile horizontal nav */
export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((s) => s.items);
