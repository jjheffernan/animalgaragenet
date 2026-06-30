import { describe, expect, it } from 'vitest';
import {
	catalogRibbonInnerClass,
	catalogRibbonNavClass,
	catalogRibbonShellClass,
	categoryPillBaseClass,
	categoryPillClass,
	ribbonMenuLinkClass,
	ribbonSectionLabelClass
} from './catalog-ribbon';

describe('catalog ribbon tokens', () => {
	it('exports stable layout shell classes', () => {
		expect(catalogRibbonShellClass).toContain('sticky');
		expect(catalogRibbonInnerClass).toContain('max-w-7xl');
		expect(catalogRibbonNavClass).toContain('flex');
		expect(ribbonSectionLabelClass).toContain('uppercase');
	});

	it('builds active and inactive category pill classes', () => {
		const inactive = categoryPillClass(false);
		const active = categoryPillClass(true);

		expect(inactive).toContain(categoryPillBaseClass);
		expect(inactive).toContain('text-zinc-400');
		expect(inactive).not.toContain('bg-red-600');

		expect(active).toContain(categoryPillBaseClass);
		expect(active).toContain('bg-red-600 text-white');
	});

	it('builds active and inactive ribbon menu link classes', () => {
		const inactive = ribbonMenuLinkClass(false);
		const active = ribbonMenuLinkClass(true);

		expect(inactive).toContain('hover:bg-zinc-800');
		expect(active).toContain('bg-red-600 text-white');
	});
});
