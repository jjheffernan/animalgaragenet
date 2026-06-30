import type { Video } from '$lib/types/domain';

export const mockVideos: Video[] = [
	{
		id: 'v1',
		youtubeId: 'dQw4w9WgXcQ',
		title: 'Project Redline — Full Build Documentary',
		description: 'Follow the FK8 Type R build from stock to track weapon.',
		longDescription:
			'We document every stage of Project Redline — from the first coilover install through the final dyno pull. See how BC Racing BR Series coilovers, Enkei RPF1 wheels, and the Borla S-Type exhaust transformed this FK8 into a track-ready daily.',
		publishedAt: '2025-11-14',
		thumbnail: 'https://picsum.photos/seed/agvid-1/640/360',
		duration: '18:42',
		linkedProductIds: ['p1', 'p4', 'p8']
	},
	{
		id: 'v2',
		youtubeId: 'jNQXAC9IVRw',
		title: 'Burnout Box: Shop Floor Session',
		description: 'Tire smoke, loud exhausts, and garage dogs.',
		longDescription:
			'An unscripted afternoon on the shop floor — burnouts, exhaust rev battles, and the crew breaking down what makes a good first mod. Grab the same gear we wear in the shop: the Garage Flag Tee and OG Logo Hoodie.',
		publishedAt: '2025-10-02',
		thumbnail: 'https://picsum.photos/seed/agvid-2/640/360',
		duration: '8:15',
		linkedProductIds: ['1', '2']
	},
	{
		id: 'v3',
		youtubeId: 'M7lc1UVf-VE',
		title: 'Coilover Install — BC Racing BR Series',
		description: 'Step-by-step coilover install on a 10th gen Civic Si.',
		longDescription:
			'Full install walkthrough for BC Racing BR Series coilovers on a 10th gen Civic Si. We cover spring perch adjustment, corner balancing basics, and alignment targets for street and HPDE use.',
		publishedAt: '2025-09-18',
		thumbnail: 'https://picsum.photos/seed/agvid-3/640/360',
		duration: '24:30',
		linkedProductIds: ['p4', 'p6', 'p21']
	},
	{
		id: 'v4',
		youtubeId: '9bZkp7q19f0',
		title: 'Dyno Day: WRX vs Civic vs 350Z',
		description: 'Three platforms, one dyno, maximum chaos.',
		longDescription:
			'Three platforms, one dyno cell, and a lot of friendly trash talk. Compare power curves and hear the Invidia N1, BC Racing DS Series, and Borla ATAK side by side before picking your next exhaust or suspension upgrade.',
		publishedAt: '2025-08-30',
		thumbnail: 'https://picsum.photos/seed/agvid-4/640/360',
		duration: '15:08',
		linkedProductIds: ['p5', 'p9', 'p10']
	},
	{
		id: 'v5',
		youtubeId: 'kJQP7kiw5Fk',
		title: 'Enkei RPF1 — Why Everyone Runs Them',
		description: 'History, specs, and fitment guide for the legendary RPF1.',
		longDescription:
			'The Enkei RPF1 is the default answer for lightweight track wheels. We cover sizing, offset, load ratings, and why the budget-friendly PF01 is a solid alternative for autocross builds.',
		publishedAt: '2025-07-22',
		thumbnail: 'https://picsum.photos/seed/agvid-5/640/360',
		duration: '12:44',
		linkedProductIds: ['p1', 'p22', 'p3']
	},
	{
		id: 'v6',
		youtubeId: 'L_jWHffIx5E',
		title: 'Exhaust Sound Check: Borla vs Invidia',
		description: 'Side-by-side sound comparison on the same platform.',
		longDescription:
			'Same car, two cat-backs — Borla S-Type vs Invidia N1. Onboard mic, fly-bys, and idle clips so you can pick the tone that matches your build before you buy.',
		publishedAt: '2025-06-11',
		thumbnail: 'https://picsum.photos/seed/agvid-6/640/360',
		duration: '10:22',
		linkedProductIds: ['p8', 'p9']
	},
	{
		id: 'v7',
		youtubeId: 'fJ9rUzIMcZQ',
		title: 'Track Day POV — Buttonwillow',
		description: 'Onboard footage from our latest HPDE event.',
		longDescription:
			'Helmet cam footage from Buttonwillow Group 1 — lines, traffic, and the mods that matter most for a safe first track day. No product pitch, just seat time.',
		publishedAt: '2025-05-04',
		thumbnail: 'https://picsum.photos/seed/agvid-7/640/360',
		duration: '6:55',
		linkedProductIds: []
	},
	{
		id: 'v8',
		youtubeId: 'OPf0YbXqDm0',
		title: 'Garage Tour 2026',
		description: 'Walk through the Animal Garage shop and dyno room.',
		longDescription:
			'A full walkthrough of the Animal Garage shop — lifts, alignment rack, dyno room, and merch wall. Meet the crew and see where your orders ship from.',
		publishedAt: '2026-01-08',
		thumbnail: 'https://picsum.photos/seed/agvid-8/640/360',
		duration: '11:18',
		linkedProductIds: ['6', '9']
	},
	{
		id: 'v9',
		youtubeId: 'RgKAFK5djSk',
		title: 'First Mod Guide — Where to Start',
		description: 'Video companion to our first mod pillar guide.',
		longDescription:
			'Intake, brakes, or suspension first? We rank beginner mods by cost, install difficulty, and real-world gain — with links to the AEM Cold Air Intake and StopTech rotors we recommend in the written guide.',
		publishedAt: '2025-04-19',
		thumbnail: 'https://picsum.photos/seed/agvid-9/640/360',
		duration: '14:02',
		linkedProductIds: ['p11', 'p14']
	},
	{
		id: 'v10',
		youtubeId: 'CevxZvSJLk8',
		title: 'Redline Drop Unboxing',
		description: 'First look at the latest merch drop.',
		longDescription:
			'Unboxing the Redline collection — tees, hoodies, and stickers from the latest drop. See fabric weight, fit, and how the graphics look in natural light before you cop.',
		publishedAt: '2025-12-01',
		thumbnail: 'https://picsum.photos/seed/agvid-10/640/360',
		duration: '7:33',
		linkedProductIds: ['1', '6', '9']
	},
	{
		id: 'v11',
		youtubeId: 'YQHsXMglC9A',
		title: '350Z Oil Cooler Install',
		description: 'Mishimoto oil cooler kit install walkthrough.',
		longDescription:
			'Step-by-step Mishimoto oil cooler install on a VQ35DE 350Z. We cover sandwich adapter plumbing, cooler mounting, and bleed procedure for track-day oil temps.',
		publishedAt: '2025-03-07',
		thumbnail: 'https://picsum.photos/seed/agvid-11/640/360',
		duration: '19:47',
		linkedProductIds: ['p19', 'p16']
	},
	{
		id: 'v12',
		youtubeId: 'hT_nvWreIhg',
		title: 'Garage Squad Loyalty Program Explained',
		description: 'How XP, levels, and perks work in Garage Squad.',
		longDescription:
			'Everything you need to know about Garage Squad — earning XP on purchases, level perks, and how loyalty ties into early access drops. No parts featured; pure program overview.',
		publishedAt: '2026-02-15',
		thumbnail: 'https://picsum.photos/seed/agvid-12/640/360',
		duration: '5:20',
		linkedProductIds: []
	}
];

export function getLatestVideo(): Video | undefined {
	if (mockVideos.length === 0) return undefined;
	return [...mockVideos].sort(
		(a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
	)[0];
}

export function getVideosExcluding(video: Video): Video[] {
	return mockVideos.filter((v) => v.id !== video.id);
}

export function getVideoById(id: string): Video | undefined {
	return mockVideos.find((v) => v.id === id);
}

export function searchVideos(query: string): Video[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockVideos.filter(
		(v) =>
			v.title.toLowerCase().includes(q) ||
			v.description.toLowerCase().includes(q) ||
			(v.longDescription?.toLowerCase().includes(q) ?? false)
	);
}

export function getRelatedVideos(video: Video, limit = 4): Video[] {
	return mockVideos.filter((v) => v.id !== video.id).slice(0, limit);
}
