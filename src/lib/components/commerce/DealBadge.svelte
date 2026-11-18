<script lang="ts">
	interface Props {
		count: number;
		class?: string;
	}

	let { count, class: className = '' }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase {className}"
>
	{count}
</span>
