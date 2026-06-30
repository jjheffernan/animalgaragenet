import type { Video } from '$lib/types/domain';

class VideoPanelState {
	open = $state(false);
	video = $state<Video | null>(null);

	openVideo(video: Video) {
		this.video = video;
		this.open = true;
	}

	close() {
		this.open = false;
		this.video = null;
	}

	toggle(video: Video) {
		if (this.open && this.video?.id === video.id) {
			this.close();
		} else {
			this.openVideo(video);
		}
	}
}

export const videoPanel = new VideoPanelState();
