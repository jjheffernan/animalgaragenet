export interface MediaItem {
	id: string;
	title: string;
	type: 'image' | 'video';
	thumbnail: string;
	src: string;
	category: string;
}

export const mockMedia: MediaItem[] = [
	{
		id: 'm1',
		title: 'Shop Build — Project Fox',
		type: 'video',
		thumbnail: 'https://picsum.photos/seed/agvid1/640/360',
		src: 'https://picsum.photos/seed/agvid1/1280/720',
		category: 'Builds'
	},
	{
		id: 'm2',
		title: 'Burnout Session',
		type: 'video',
		thumbnail: 'https://picsum.photos/seed/agvid2/640/360',
		src: 'https://picsum.photos/seed/agvid2/1280/720',
		category: 'Events'
	},
	{
		id: 'm3',
		title: 'Garage Tour',
		type: 'image',
		thumbnail: 'https://picsum.photos/seed/agimg1/640/360',
		src: 'https://picsum.photos/seed/agimg1/1280/720',
		category: 'Behind the Scenes'
	},
	{
		id: 'm4',
		title: 'Redline Launch Party',
		type: 'image',
		thumbnail: 'https://picsum.photos/seed/agimg2/640/360',
		src: 'https://picsum.photos/seed/agimg2/1280/720',
		category: 'Events'
	},
	{
		id: 'm5',
		title: 'Dyno Pull',
		type: 'video',
		thumbnail: 'https://picsum.photos/seed/agvid3/640/360',
		src: 'https://picsum.photos/seed/agvid3/1280/720',
		category: 'Builds'
	},
	{
		id: 'm6',
		title: 'Team Portrait',
		type: 'image',
		thumbnail: 'https://picsum.photos/seed/agimg3/640/360',
		src: 'https://picsum.photos/seed/agimg3/1280/720',
		category: 'Behind the Scenes'
	}
];
