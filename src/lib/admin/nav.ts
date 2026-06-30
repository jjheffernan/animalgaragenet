/** Admin sidebar navigation — mirrors template `routes/sidebar.js` pattern. */
export interface AdminNavItem {
	href: string;
	label: string;
	exact?: boolean;
	/** Shown when icon set ships; optional until then */
	icon?: string;
	/** Route not scaffolded yet — sidebar renders label without link */
	disabled?: boolean;
	/** Key into layout `navCounts` for pending-work badge */
	badgeKey?: 'builds' | 'testimonials';
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
			{ href: '/admin/builds', label: 'Builds', badgeKey: 'builds' },
			{ href: '/admin/testimonials', label: 'Testimonials', badgeKey: 'testimonials' },
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
		label: 'Support',
		items: [{ href: '/admin/bug-reports', label: 'Bug Reports' }]
	},
	{
		label: 'Runtime',
		items: [{ href: '/admin/runtime', label: 'Integrations', exact: true }]
	}
];

/** Flat list for mobile horizontal nav */
export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((s) => s.items);
