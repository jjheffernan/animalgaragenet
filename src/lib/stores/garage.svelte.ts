import type { SavedVehicle } from '$lib/types/domain';

const STORAGE_KEY = 'ag-garage';

function loadGarage(): SavedVehicle[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as SavedVehicle[]) : [];
	} catch {
		return [];
	}
}

function saveGarage(vehicles: SavedVehicle[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

function generateId(): string {
	return `veh-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

class GarageState {
	vehicles = $state<SavedVehicle[]>([]);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.vehicles = loadGarage();
		this.initialized = true;
	}

	addVehicle(vehicle: Omit<SavedVehicle, 'id'>) {
		this.init();
		const entry: SavedVehicle = { ...vehicle, id: generateId() };
		this.vehicles = [...this.vehicles, entry];
		saveGarage(this.vehicles);
		return entry;
	}

	removeVehicle(id: string) {
		this.init();
		this.vehicles = this.vehicles.filter((v) => v.id !== id);
		saveGarage(this.vehicles);
	}

	updateVehicle(id: string, updates: Partial<SavedVehicle>) {
		this.init();
		this.vehicles = this.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v));
		saveGarage(this.vehicles);
	}

	get primary(): SavedVehicle | undefined {
		this.init();
		return this.vehicles[0];
	}

	formatVehicle(v: SavedVehicle): string {
		const parts = [String(v.year), v.make, v.model];
		if (v.submodel) parts.push(v.submodel);
		return parts.join(' ');
	}
}

export const garage = new GarageState();
