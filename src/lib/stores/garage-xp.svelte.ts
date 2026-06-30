import { garageLevels } from '$lib/data/garage-levels';
import { addGarageXpToApi, loadGarageFromApi, resetGarageApiCache } from './garage-api';

const STORAGE_KEY = 'ag-garage-xp';

interface XpState {
	xp: number;
	actions: string[];
}

function loadXp(): XpState {
	if (typeof window === 'undefined') return { xp: 0, actions: [] };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as XpState) : { xp: 0, actions: [] };
	} catch {
		return { xp: 0, actions: [] };
	}
}

function saveXp(state: XpState) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearLocalXp() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEY);
}

class GarageXpState {
	xp = $state(0);
	completedActions = $state<string[]>([]);
	private initialized = false;
	private synced = false;
	private initPromise: Promise<void> | null = null;

	resetForSession() {
		this.initialized = false;
		this.synced = false;
		this.initPromise = null;
		resetGarageApiCache();
	}

	init(): Promise<void> {
		if (typeof window === 'undefined') return Promise.resolve();
		if (this.initPromise) return this.initPromise;
		this.initPromise = this.load();
		return this.initPromise;
	}

	private async load() {
		if (this.initialized) return;
		this.initialized = true;

		const remote = await loadGarageFromApi();
		if (remote === 'guest') {
			const data = loadXp();
			this.xp = data.xp;
			this.completedActions = data.actions;
			this.synced = false;
			return;
		}

		this.xp = remote.garageXp;
		this.completedActions = remote.completedActions;
		this.synced = true;
		clearLocalXp();
	}

	get level() {
		void this.init();
		let current = garageLevels[0];
		for (const lvl of garageLevels) {
			if (this.xp >= lvl.xpRequired) current = lvl;
		}
		return current;
	}

	get nextLevel() {
		void this.init();
		const idx = garageLevels.findIndex((l) => l.level === this.level.level);
		return garageLevels[idx + 1];
	}

	get progressToNext(): number {
		void this.init();
		const next = this.nextLevel;
		if (!next) return 100;
		const current = this.level.xpRequired;
		const range = next.xpRequired - current;
		const progress = this.xp - current;
		return Math.min(100, Math.round((progress / range) * 100));
	}

	async addXp(amount: number, actionId?: string) {
		await this.init();
		if (actionId && this.completedActions.includes(actionId)) return;

		if (this.synced) {
			const state = await addGarageXpToApi(amount, actionId);
			if (!state) return;
			this.xp = state.garageXp;
			this.completedActions = state.completedActions;
			return;
		}

		this.xp += amount;
		if (actionId) this.completedActions = [...this.completedActions, actionId];
		saveXp({ xp: this.xp, actions: this.completedActions });
	}
}

export const garageXp = new GarageXpState();
