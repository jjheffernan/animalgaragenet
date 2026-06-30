/** Admin sidebar navigation — mirrors template `routes/sidebar.js` pattern. */
export interface AdminNavItem {
	href: string;
	label: string;
	exact?: boolean;
	/** Shown when daisyUI shell ships; optional until then */
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
		items: [{ href: '/admin/runtime', label: 'Runtime', exact: true }]
	},
	{
		label: 'Social',
		items: [
			{ href: '/admin/youtube', label: 'YouTube' },
			// Scaffold pending — nav disabled until routes exist
			{ href: '/admin/social/ugc', label: 'UGC', disabled: true },
			{ href: '/admin/social/discord', label: 'Discord', disabled: true }
		]
	},
	{
		label: 'Commerce',
		items: [
			{ href: '/admin/commerce/channels', label: 'Saleor Channels', disabled: true },
			{ href: '/admin/commerce/orders', label: 'Orders', disabled: true }
		]
	},
	{
		label: 'Operations',
		items: [
			{ href: '/admin/calendar', label: 'Calendar', disabled: true },
			{ href: '/admin/support', label: 'Support', disabled: true },
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
