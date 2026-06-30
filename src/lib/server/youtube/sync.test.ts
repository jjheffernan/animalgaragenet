import { describe, expect, it, vi } from 'vitest';
import {
	fetchChannelVideos,
	formatYoutubeDuration,
	mapToVideo,
	type YouTubeApiVideo
} from './sync';

const apiVideoFixture: YouTubeApiVideo = {
	youtubeId: 'abc123',
	title: 'Track Day POV',
	description: 'Onboard footage from HPDE.',
	thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
	duration: '12:34',
	publishedAt: '2026-06-01'
};

describe('formatYoutubeDuration', () => {
	it('formats hours, minutes, and seconds', () => {
		expect(formatYoutubeDuration('PT1H2M10S')).toBe('1:02:10');
	});

	it('formats minutes and seconds without hours', () => {
		expect(formatYoutubeDuration('PT12M34S')).toBe('12:34');
	});

	it('returns original string when pattern does not match', () => {
		expect(formatYoutubeDuration('12:34')).toBe('12:34');
	});
});

describe('mapToVideo', () => {
	it('maps API payload to domain Video', () => {
		const video = mapToVideo(apiVideoFixture, 'UCchannel');

		expect(video).toMatchObject({
			id: 'yt-UCchannel-abc123',
			youtubeId: 'abc123',
			title: 'Track Day POV',
			description: 'Onboard footage from HPDE.',
			longDescription: 'Onboard footage from HPDE.',
			publishedAt: '2026-06-01',
			thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
			duration: '12:34',
			linkedProductIds: []
		});
	});
});

describe('fetchChannelVideos', () => {
	it('returns mock catalog slice when API key is unset', async () => {
		const videos = await fetchChannelVideos('', 'UCmockAnimalGarage');

		expect(videos).toHaveLength(4);
		expect(videos[0]?.youtubeId).toBeTruthy();
		expect(videos[0]?.title).toBeTruthy();
	});

	it('calls YouTube Data API when API key is set', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					items: [{ contentDetails: { relatedPlaylists: { uploads: 'UUuploads' } } }]
				})
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					items: [{ contentDetails: { videoId: 'vid1' } }]
				})
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					items: [
						{
							id: 'vid1',
							snippet: {
								title: 'Live Sync Test',
								description: 'From API',
								publishedAt: '2026-06-15T12:00:00Z',
								thumbnails: { high: { url: 'https://cdn.example/thumb.jpg' } }
							},
							contentDetails: { duration: 'PT5M20S' }
						}
					]
				})
			});

		vi.stubGlobal('fetch', fetchMock);

		const videos = await fetchChannelVideos('test-key', 'UCchannel');

		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(videos).toEqual([
			{
				youtubeId: 'vid1',
				title: 'Live Sync Test',
				description: 'From API',
				thumbnail: 'https://cdn.example/thumb.jpg',
				duration: '5:20',
				publishedAt: '2026-06-15'
			}
		]);

		vi.unstubAllGlobals();
	});
});
