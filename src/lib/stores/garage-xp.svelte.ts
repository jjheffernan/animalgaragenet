import { garageLevels } from '$lib/data/garage-levels';

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

class GarageXpState {
	xp = $state(0);
	completedActions = $state<string[]>([]);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		const data = loadXp();
		this.xp = data.xp;
		this.completedActions = data.actions;
		this.initialized = true;
	}

	get level() {
		this.init();
		let current = garageLevels[0];
		for (const lvl of garageLevels) {
			if (this.xp >= lvl.xpRequired) current = lvl;
		}
		return current;
	}

	get nextLevel() {
		this.init();
		const idx = garageLevels.findIndex((l) => l.level === this.level.level);
		return garageLevels[idx + 1];
	}

	get progressToNext(): number {
		this.init();
		const next = this.nextLevel;
		if (!next) return 100;
		const current = this.level.xpRequired;
		const range = next.xpRequired - current;
		const progress = this.xp - current;
		return Math.min(100, Math.round((progress / range) * 100));
	}

	addXp(amount: number, actionId?: string) {
		this.init();
		if (actionId && this.completedActions.includes(actionId)) return;
		this.xp += amount;
		if (actionId) this.completedActions = [...this.completedActions, actionId];
		saveXp({ xp: this.xp, actions: this.completedActions });
	}
}

export const garageXp = new GarageXpState();
