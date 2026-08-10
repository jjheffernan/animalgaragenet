import type { SocialPlatformId } from '$lib/data/social-platforms';
import {
	loadConnectionsFromApi,
	updateConnectionOnApi,
	type ConnectionsApiState
} from '$lib/stores/social-connections-api';
import type { SocialConnectionsMap } from '$lib/types/social-connections';

/**
 * Reactive social connections state. HTTP stays in `social-connections-api.ts`.
 */
class ConnectionsState {
	loading = $state(true);
	error = $state<string | null>(null);
	mockMode = $state(true);
	platforms = $state<ConnectionsApiState['platforms']>([]);
	connections = $state<SocialConnectionsMap>({});
	pendingPlatform = $state<SocialPlatformId | null>(null);
	handleInput = $state('');
	saving = $state(false);

	async refresh() {
		this.loading = true;
		this.error = null;
		const data = await loadConnectionsFromApi();
		if (data === 'guest' || data === null) {
			this.error = 'Unable to load connections.';
			this.loading = false;
			return;
		}
		this.connections = data.connections;
		this.platforms = data.platforms;
		this.mockMode = data.mockMode;
		this.loading = false;
	}

	startConnect(platform: ConnectionsApiState['platforms'][number]) {
		if (platform.oauthAuthorizeUrl) {
			window.location.href = platform.oauthAuthorizeUrl;
			return;
		}
		this.pendingPlatform = platform.id;
		this.handleInput = '';
		this.error = null;
	}

	cancelConnect() {
		this.pendingPlatform = null;
		this.handleInput = '';
	}

	async submitConnect() {
		if (!this.pendingPlatform) return;
		this.saving = true;
		this.error = null;
		const result = await updateConnectionOnApi(this.pendingPlatform, {
			action: 'connect',
			handle: this.handleInput
		});
		this.saving = false;
		if (!result.ok) {
			this.error = result.error;
			return;
		}
		this.connections = result.connections;
		this.pendingPlatform = null;
		this.handleInput = '';
	}

	async disconnect(platformId: SocialPlatformId) {
		this.saving = true;
		this.error = null;
		const result = await updateConnectionOnApi(platformId, { action: 'disconnect' });
		this.saving = false;
		if (!result.ok) {
			this.error = result.error;
			return;
		}
		this.connections = result.connections;
	}
}

export const connections = new ConnectionsState();
