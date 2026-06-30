<script lang="ts">
	import { categoryPillClass } from '$lib/ui/catalog-ribbon';

	interface Props {
		href: string;
		label: string;
		active?: boolean;
		onclick?: () => void;
		class?: string;
	}

	let { href, label, active = false, onclick, class: className = '' }: Props = $props();
</script>

<a {href} class="{categoryPillClass(active)} {className}" {onclick}>
	{label}
</a>
