export interface YouTubeChannel {
	id: string;
	channelId: string;
	handle: string;
	title: string;
	lastSyncedAt?: string;
	videoCount: number;
}

export const mockYouTubeChannels: YouTubeChannel[] = [
	{
		id: 'yc1',
		channelId: 'UCmockAnimalGarage',
		handle: '@animalgarage',
		title: 'Animal Garage',
		lastSyncedAt: '2026-02-20T14:30:00.000Z',
		videoCount: 12
	},
	{
		id: 'yc2',
		channelId: 'UCmockProjectRedline',
		handle: '@projectredline',
		title: 'Project Redline',
		lastSyncedAt: '2026-02-18T09:15:00.000Z',
		videoCount: 6
	}
];

export function getChannelById(id: string): YouTubeChannel | undefined {
	return mockYouTubeChannels.find((c) => c.id === id);
}
