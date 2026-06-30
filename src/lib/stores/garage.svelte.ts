import type { SavedVehicle } from '$lib/types/domain';
import { loadGarageFromApi, resetGarageApiCache, saveVehiclesToApi } from './garage-api';
import { readStoredJson, removeStoredJson, writeStoredJson } from './storage';

const STORAGE_KEY = 'ag-garage';

function loadGarage(): SavedVehicle[] {
	return readStoredJson<SavedVehicle[]>(STORAGE_KEY, []);
}

function saveGarage(vehicles: SavedVehicle[]) {
	writeStoredJson(STORAGE_KEY, vehicles);
}

function clearLocalGarage() {
	removeStoredJson(STORAGE_KEY);
}

function generateId(): string {
	return `veh-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

class GarageState {
	vehicles = $state<SavedVehicle[]>([]);
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
			this.vehicles = loadGarage();
			this.synced = false;
			return;
		}

		const local = loadGarage();
		if (remote.vehicles.length === 0 && local.length > 0) {
			this.vehicles = local;
			this.synced = true;
			clearLocalGarage();
			void saveVehiclesToApi(local);
			return;
		}

		this.vehicles = remote.vehicles;
		this.synced = true;
		clearLocalGarage();
	}

	private async persist() {
		if (this.synced) {
			await saveVehiclesToApi(this.vehicles);
			return;
		}
		saveGarage(this.vehicles);
	}

	async addVehicle(vehicle: Omit<SavedVehicle, 'id'>) {
		await this.init();
		const entry: SavedVehicle = { ...vehicle, id: generateId() };
		this.vehicles = [...this.vehicles, entry];
		await this.persist();
		return entry;
	}

	async removeVehicle(id: string) {
		await this.init();
		this.vehicles = this.vehicles.filter((v) => v.id !== id);
		await this.persist();
	}

	async updateVehicle(id: string, updates: Partial<SavedVehicle>) {
		await this.init();
		this.vehicles = this.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v));
		await this.persist();
	}

	get primary(): SavedVehicle | undefined {
		void this.init();
		return this.vehicles[0];
	}

	formatVehicle(v: SavedVehicle): string {
		const parts = [String(v.year), v.make, v.model];
		if (v.submodel) parts.push(v.submodel);
		return parts.join(' ');
	}
}

export const garage = new GarageState();
