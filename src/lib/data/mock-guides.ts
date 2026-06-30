import type { Guide } from '$lib/types/domain';

const hero = (seed: string) => `https://picsum.photos/seed/${seed}/1200/600`;

export const mockGuides: Guide[] = [
	{
		id: 'g1',
		slug: 'how-to-choose-wheels',
		title: 'How to Choose the Right Wheels',
		excerpt: 'Offset, diameter, width, and bolt pattern — everything you need to pick the perfect wheel setup.',
		category: 'Wheels',
		heroImage: hero('agguide-wheels'),
		readTimeMinutes: 12,
		content: `## Wheel Basics\n\nChoosing wheels is about more than looks. Offset, width, and diameter all affect fitment, handling, and fender clearance.\n\n### Offset Explained\n\nOffset (ET) is the distance from the wheel centerline to the mounting surface. Lower offset = more poke. Higher offset = more tuck.\n\n### Sizing Guide\n\n- **17"** — Lightweight, budget-friendly, great for track\n- **18"** — Sweet spot for street and occasional track\n- **19"+** — Show car territory, watch unsprung weight\n\n### Bolt Pattern\n\nAlways verify your bolt pattern (e.g., 5×114.3 for Honda/Subaru). Hub-centric rings prevent vibration.\n\n### Pro Tips\n\n1. Use a fitment calculator before buying\n2. Consider tire width with wheel width\n3. Check inner clearance for big brake kits`
	},
	{
		id: 'g2',
		slug: 'tire-sizing-guide',
		title: 'Tire Sizing & Compound Guide',
		excerpt: 'Decode tire sizes, understand compound differences, and pick the right rubber for your build.',
		category: 'Tires',
		heroImage: hero('agguide-tires'),
		readTimeMinutes: 10,
		content: `## Reading Tire Sizes\n\nA 245/40R18 tire means:\n- **245** — width in mm\n- **40** — aspect ratio (sidewall height as % of width)\n- **R18** — radial construction, 18" rim\n\n### Compound Types\n\n- **All-Season** — Daily driver, mild performance\n- **Max Performance Summer** — Street + occasional track\n- **200 TW Track** — Dedicated HPDE and autocross\n- **100 TW Slick** — Time attack and serious track days\n\n### Plus Sizing\n\nGoing wider? Match wheel width to tire width. A 9" wheel pairs well with 255–265 width tires.`
	},
	{
		id: 'g3',
		slug: 'coilovers-vs-springs',
		title: 'Coilovers vs Lowering Springs',
		excerpt: 'Which suspension upgrade is right for your goals and budget?',
		category: 'Suspension',
		heroImage: hero('agguide-suspension'),
		readTimeMinutes: 8,
		content: `## Lowering Springs\n\n**Pros:** Affordable ($200–400), easy install, OEM-like ride with drop\n**Cons:** Fixed ride height, limited damping adjustment\n\n## Coilovers\n\n**Pros:** Adjustable height AND damping, track-capable, one-and-done solution\n**Cons:** $800–3000+, more complex install, quality varies wildly\n\n### Our Recommendation\n\n- **Daily driver, mild drop:** Lowering springs + upgraded shocks\n- **Track day hero:** Quality coilovers (BC Racing, KW, Ohlins)\n- **Stance build:** Air suspension or coilovers with extreme drop\n\n### Don't Forget\n\nAlignment after any suspension change. Budget $100–200 for a proper alignment.`
	},
	{
		id: 'g4',
		slug: 'exhaust-systems-explained',
		title: 'Exhaust Systems Explained',
		excerpt: 'Cat-back vs axle-back vs headers — what actually makes power and sounds best.',
		category: 'Exhaust',
		heroImage: hero('agguide-exhaust'),
		readTimeMinutes: 11,
		content: `## Exhaust Components\n\n### Axle-Back\n\nReplaces mufflers and tips from the axle back. Easiest install, moderate sound change.\n\n### Cat-Back\n\nFull system from catalytic converter back. Best sound improvement, moderate power gains (5–15 WHP).\n\n### Headers / Downpipe\n\nMost power gains but may require tune. Check emissions laws in your state.\n\n## Sound Profiles\n\n- **Touring** — Quiet, refined, daily friendly\n- **Sport** — Aggressive but no drone\n- **Race** — Maximum volume, track only\n\n### Drone\n\nResonator delete = drone risk. Quality cat-backs (Borla, Invidia) engineer out drone with tuned resonators.`
	},
	{
		id: 'g5',
		slug: 'first-mod-guide',
		title: 'Your First Mod: Where to Start',
		excerpt: 'New to modifying? Start here — the best first mods for any platform.',
		category: 'Getting Started',
		heroImage: hero('agguide-firstmod'),
		readTimeMinutes: 7,
		content: `## The First Mod Hierarchy\n\n1. **Tires** — Best bang for buck. Grip changes everything.\n2. **Brake pads + fluid** — Stop before you go fast.\n3. **Intake + exhaust** — Sound and modest power gains.\n4. **Tune** — Unlock power from bolt-ons.\n5. **Suspension** — Drop and handling.\n\n## What NOT to Do First\n\n- Cheap eBay coilovers\n- No-name turbo kit\n- Cutting springs\n- Skipping alignment\n\n## Budget Breakdown ($1500 starter kit)\n\n- Performance tires: $600\n- Brake pads: $150\n- Intake: $300\n- Axle-back exhaust: $400\n- Alignment: $100`
	},
	{
		id: 'g6',
		slug: 'budget-build-guide',
		title: 'Building on a Budget: $5K Full Build',
		excerpt: 'How to transform your car for $5,000 or less with smart part choices.',
		category: 'Getting Started',
		heroImage: hero('agguide-budget'),
		readTimeMinutes: 15,
		content: `## The $5K Build Formula\n\n### Wheels & Tires ($1200)\n\nEnkei PF01 or RPF1 reps (save for real Enkei later). Quality 200TW tires.\n\n### Suspension ($1200)\n\nBC Racing BR series or used KW V1. Don't cheap out here.\n\n### Exhaust ($700)\n\nAxle-back or used cat-back from forums. Invidia and Borla hold value.\n\n### Intake ($300)\n\nAEM or used OEM+. Easy DIY install.\n\n### Brakes ($400)\n\nStopTech pads + stainless lines. Rotors if needed.\n\n### Tune ($500)\n\nProfessional tune if turbo/supercharged. Otherwise skip.\n\n### Miscellaneous ($700)\n\nAlignment, bushings, fluids, detail supplies.\n\n## Used Parts Strategy\n\n- Forum classifieds (NASIOC, CivicX, My350Z)\n- Facebook Marketplace with inspection\n- Never buy used coilovers or helmets`
	}
];

export function getGuideBySlug(slug: string): Guide | undefined {
	return mockGuides.find((g) => g.slug === slug);
}

export function searchGuides(query: string): Guide[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockGuides.filter(
		(g) => g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
	);
}
