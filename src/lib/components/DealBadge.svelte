<script lang="ts">
	import { getActiveDealCount } from '$lib/data/mock-deals';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white {className}"
>
	{getActiveDealCount()}
</span>
