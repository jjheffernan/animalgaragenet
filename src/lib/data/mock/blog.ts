import type { BlogPost } from '$lib/types/domain';

const hero = (seed: string) => `https://picsum.photos/seed/${seed}/1200/600`;

export const mockBlogPosts: BlogPost[] = [
	{
		id: 'blog-1',
		slug: 'redline-drop-recap',
		title: 'Redline Drop Recap: What Sold Out in 48 Hours',
		excerpt: 'Our latest drop moved fast. Here is what flew off the shelves and what is coming next.',
		author: 'AG Crew',
		publishedAt: '2026-06-15',
		heroImage: hero('agblog-1'),
		tags: ['drops', 'merch'],
		content: 'The Redline Drop was our biggest release yet. The Censor Bar Tee sold out in 6 hours...'
	},
	{
		id: 'blog-2',
		slug: 'track-day-prep-checklist',
		title: 'Track Day Prep Checklist',
		excerpt: 'Everything you need in your pit bag before your first HPDE event.',
		author: 'Mike T.',
		publishedAt: '2026-06-10',
		heroImage: hero('agblog-2'),
		tags: ['track', 'guides'],
		content: 'Torque wrench, tire pressure gauge, extra brake fluid, and a positive attitude...'
	},
	{
		id: 'blog-3',
		slug: 'build-of-the-month-june',
		title: 'Build of the Month: Project Redline Civic',
		excerpt: 'FK8 Type R with full aero, coilovers, and 400 WHP — meet this month\'s featured build.',
		author: 'AG Crew',
		publishedAt: '2026-06-01',
		heroImage: hero('agblog-3'),
		tags: ['builds', 'featured'],
		content: 'Project Redline started as a stock FK8 and evolved into a track-capable monster...'
	},
	{
		id: 'blog-4',
		slug: 'garage-squad-level-up',
		title: 'Garage Squad: How to Level Up Fast',
		excerpt: 'XP tips, perk unlocks, and how to maximize your Garage Squad rewards.',
		author: 'AG Crew',
		publishedAt: '2026-05-28',
		heroImage: hero('agblog-4'),
		tags: ['loyalty', 'community'],
		content: 'Earn XP by submitting builds, leaving reviews, and referring friends...'
	},
	{
		id: 'blog-5',
		slug: 'enkei-rpf1-fitment-guide',
		title: 'Enkei RPF1 Fitment Guide by Platform',
		excerpt: 'The definitive offset and size guide for RPF1s on popular platforms.',
		author: 'Parts Team',
		publishedAt: '2026-05-20',
		heroImage: hero('agblog-5'),
		tags: ['parts', 'wheels'],
		content: 'Civic Si: 17×9 +35 clears stock fenders with -1.5 camber. WRX: 18×9.5 +38 needs roll...'
	},
	{
		id: 'blog-6',
		slug: 'shop-tour-2026',
		title: 'Inside the Animal Garage Shop — 2026 Tour',
		excerpt: 'A behind-the-scenes look at where the magic happens.',
		author: 'AG Crew',
		publishedAt: '2026-05-15',
		heroImage: hero('agblog-6'),
		tags: ['culture', 'media'],
		content: 'Two lifts, a dyno, and enough tools to make any wrench cry happy tears...'
	},
	{
		id: 'blog-7',
		slug: 'pit-lane-deals-june',
		title: 'Pit Lane Deals: June Picks',
		excerpt: 'Our crew-curated deals this month — wheels, exhaust, and clearance merch.',
		author: 'Deals Team',
		publishedAt: '2026-06-20',
		heroImage: hero('agblog-7'),
		tags: ['deals', 'parts'],
		content: 'BC Racing coilovers at 15% off, Enkei PF01 clearance, and more...'
	},
	{
		id: 'blog-8',
		slug: 'discord-community-spotlight',
		title: 'Community Spotlight: Discord Builds',
		excerpt: 'Highlighting the best builds shared in our Discord this month.',
		author: 'Community Team',
		publishedAt: '2026-06-18',
		heroImage: hero('agblog-8'),
		tags: ['community', 'discord'],
		content: 'From stanced BRZs to 1000 WHP Supras — our Discord never disappoints...'
	}
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
	return mockBlogPosts.find((p) => p.slug === slug);
}

export function searchBlogPosts(query: string): BlogPost[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockBlogPosts.filter(
		(p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
	);
}
