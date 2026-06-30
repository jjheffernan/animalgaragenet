import type { Video } from '$lib/types/domain';

export const mockVideos: Video[] = [
	{
		id: 'v1',
		youtubeId: 'dQw4w9WgXcQ',
		title: 'Project Redline — Full Build Documentary',
		description: 'Follow the FK8 Type R build from stock to track weapon.',
		thumbnail: 'https://picsum.photos/seed/agvid-1/640/360',
		duration: '18:42',
		linkedProductIds: ['p1', 'p4', 'p8']
	},
	{
		id: 'v2',
		youtubeId: 'jNQXAC9IVRw',
		title: 'Burnout Box: Shop Floor Session',
		description: 'Tire smoke, loud exhausts, and garage dogs.',
		thumbnail: 'https://picsum.photos/seed/agvid-2/640/360',
		duration: '8:15',
		linkedProductIds: ['1', '2']
	},
	{
		id: 'v3',
		youtubeId: 'M7lc1UVf-VE',
		title: 'Coilover Install — BC Racing BR Series',
		description: 'Step-by-step coilover install on a 10th gen Civic Si.',
		thumbnail: 'https://picsum.photos/seed/agvid-3/640/360',
		duration: '24:30',
		linkedProductIds: ['p4']
	},
	{
		id: 'v4',
		youtubeId: '9bZkp7q19f0',
		title: 'Dyno Day: WRX vs Civic vs 350Z',
		description: 'Three platforms, one dyno, maximum chaos.',
		thumbnail: 'https://picsum.photos/seed/agvid-4/640/360',
		duration: '15:08',
		linkedProductIds: ['p5', 'p9', 'p10']
	},
	{
		id: 'v5',
		youtubeId: 'kJQP7kiw5Fk',
		title: 'Enkei RPF1 — Why Everyone Runs Them',
		description: 'History, specs, and fitment guide for the legendary RPF1.',
		thumbnail: 'https://picsum.photos/seed/agvid-5/640/360',
		duration: '12:44',
		linkedProductIds: ['p1', 'p22']
	},
	{
		id: 'v6',
		youtubeId: 'L_jWHffIx5E',
		title: 'Exhaust Sound Check: Borla vs Invidia',
		description: 'Side-by-side sound comparison on the same platform.',
		thumbnail: 'https://picsum.photos/seed/agvid-6/640/360',
		duration: '10:22',
		linkedProductIds: ['p8', 'p9']
	},
	{
		id: 'v7',
		youtubeId: 'fJ9rUzIMcZQ',
		title: 'Track Day POV — Buttonwillow',
		description: 'Onboard footage from our latest HPDE event.',
		thumbnail: 'https://picsum.photos/seed/agvid-7/640/360',
		duration: '6:55',
		linkedProductIds: []
	},
	{
		id: 'v8',
		youtubeId: 'OPf0YbXqDm0',
		title: 'Garage Tour 2026',
		description: 'Walk through the Animal Garage shop and dyno room.',
		thumbnail: 'https://picsum.photos/seed/agvid-8/640/360',
		duration: '11:18',
		linkedProductIds: []
	},
	{
		id: 'v9',
		youtubeId: 'RgKAFK5djSk',
		title: 'First Mod Guide — Where to Start',
		description: 'Video companion to our first mod pillar guide.',
		thumbnail: 'https://picsum.photos/seed/agvid-9/640/360',
		duration: '14:02',
		linkedProductIds: ['p11', 'p14']
	},
	{
		id: 'v10',
		youtubeId: 'CevxZvSJLk8',
		title: 'Redline Drop Unboxing',
		description: 'First look at the latest merch drop.',
		thumbnail: 'https://picsum.photos/seed/agvid-10/640/360',
		duration: '7:33',
		linkedProductIds: ['1', '6', '9']
	},
	{
		id: 'v11',
		youtubeId: 'YQHsXMglC9A',
		title: '350Z Oil Cooler Install',
		description: 'Mishimoto oil cooler kit install walkthrough.',
		thumbnail: 'https://picsum.photos/seed/agvid-11/640/360',
		duration: '19:47',
		linkedProductIds: ['p19']
	},
	{
		id: 'v12',
		youtubeId: 'hT_nvWreIhg',
		title: 'Garage Squad Loyalty Program Explained',
		description: 'How XP, levels, and perks work in Garage Squad.',
		thumbnail: 'https://picsum.photos/seed/agvid-12/640/360',
		duration: '5:20',
		linkedProductIds: []
	}
];

export function getVideoById(id: string): Video | undefined {
	return mockVideos.find((v) => v.id === id);
}

export function searchVideos(query: string): Video[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockVideos.filter(
		(v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
	);
}
