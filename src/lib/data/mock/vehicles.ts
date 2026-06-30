import type { VehicleMake } from '$lib/types/domain';

export const VEHICLE_YEARS = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);

export const mockVehicleData: VehicleMake[] = [
	{
		make: 'Honda',
		models: [
			{ model: 'Civic', submodels: ['DX', 'EX', 'Si', 'Type R'] },
			{ model: 'Integra', submodels: ['LS', 'GS-R', 'Type R'] },
			{ model: 'S2000', submodels: ['Base', 'CR'] },
			{ model: 'Accord', submodels: ['Sport', 'EX-L', 'Touring'] },
			{ model: 'Prelude', submodels: ['Base', 'SH'] }
		]
	},
	{
		make: 'Subaru',
		models: [
			{ model: 'WRX', submodels: ['Base', 'Premium', 'Limited', 'STI'] },
			{ model: 'BRZ', submodels: ['Premium', 'Limited', 'tS'] },
			{ model: 'Impreza', submodels: ['Sport', 'Limited'] },
			{ model: 'Forester', submodels: ['Sport', 'XT', 'Wilderness'] }
		]
	},
	{
		make: 'Nissan',
		models: [
			{ model: '350Z', submodels: ['Base', 'Enthusiast', 'Touring', 'Track'] },
			{ model: '370Z', submodels: ['Sport', 'Nismo'] },
			{ model: 'GT-R', submodels: ['Premium', 'Track Edition', 'Nismo'] },
			{ model: '240SX', submodels: ['SE', 'LE'] },
			{ model: 'Silvia', submodels: ['S13', 'S14', 'S15'] }
		]
	},
	{
		make: 'BMW',
		models: [
			{ model: 'M3', submodels: ['Competition', 'CS', 'G80'] },
			{ model: 'M4', submodels: ['Competition', 'CSL'] },
			{ model: '335i', submodels: ['Sport', 'M Sport'] },
			{ model: 'M2', submodels: ['Competition', 'CS'] }
		]
	},
	{
		make: 'Ford',
		models: [
			{ model: 'Mustang', submodels: ['EcoBoost', 'GT', 'Mach 1', 'Dark Horse'] },
			{ model: 'Focus RS', submodels: ['Base'] },
			{ model: 'Fiesta ST', submodels: ['Base'] },
			{ model: 'Bronco', submodels: ['Badlands', 'Wildtrak', 'Raptor'] }
		]
	},
	{
		make: 'Toyota',
		models: [
			{ model: 'Supra', submodels: ['2.0', '3.0', '3.0 Premium', 'A91-MT'] },
			{ model: 'GR86', submodels: ['Premium', 'Special Edition'] },
			{ model: 'Corolla', submodels: ['SE', 'XSE', 'GR Corolla'] },
			{ model: 'MR2', submodels: ['SW20', 'ZZW30'] }
		]
	}
];

export function getMakes(): string[] {
	return mockVehicleData.map((v) => v.make);
}

export function getModels(make: string): string[] {
	const entry = mockVehicleData.find((v) => v.make === make);
	return entry?.models.map((m) => m.model) ?? [];
}

export function getSubmodels(make: string, model: string): string[] {
	const entry = mockVehicleData.find((v) => v.make === make);
	const modelEntry = entry?.models.find((m) => m.model === model);
	return modelEntry?.submodels ?? [];
}

export function getYears(): number[] {
	return VEHICLE_YEARS;
}

export function formatYmmQuery(
	year: number,
	make: string,
	model: string,
	submodel?: string
): string {
	const parts = [String(year), make, model];
	if (submodel) parts.push(submodel);
	return parts.join('-').toLowerCase().replace(/\s+/g, '-');
}
