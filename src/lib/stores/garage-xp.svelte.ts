import type { GarageLevel } from '$lib/types/domain';

const STORAGE_KEY = 'ag-garage-xp';

const LEVELS: GarageLevel[] = [
	{ level: 1, title: 'Parking Lot Rookie', xpRequired: 0, perks: ['Welcome sticker pack'] },
	{ level: 2, title: 'Pit Crew', xpRequired: 100, perks: ['5% merch discount'] },
	{ level: 3, title: 'Wrench Turner', xpRequired: 300, perks: ['Early drop access', 'Free shipping on parts'] },
	{ level: 4, title: 'Grid Starter', xpRequired: 600, perks: ['10% merch discount', 'Exclusive colorways'] },
	{ level: 5, title: 'Garage Squad OG', xpRequired: 1000, perks: ['15% sitewide', 'Build of the Month eligibility', 'VIP event access'] }
];

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

	get level(): GarageLevel {
		this.init();
		let current = LEVELS[0];
		for (const lvl of LEVELS) {
			if (this.xp >= lvl.xpRequired) current = lvl;
		}
		return current;
	}

	get nextLevel(): GarageLevel | undefined {
		this.init();
		const idx = LEVELS.findIndex((l) => l.level === this.level.level);
		return LEVELS[idx + 1];
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

	get levels() {
		return LEVELS;
	}
}

export const garageXp = new GarageXpState();
