<script lang="ts">
	interface Props {
		endDate: string;
		class?: string;
	}

	let { endDate, class: className = '' }: Props = $props();

	let remaining = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	let expired = $state(false);

	function update() {
		const diff = new Date(endDate).getTime() - Date.now();
		if (diff <= 0) {
			expired = true;
			remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };
			return;
		}
		expired = false;
		remaining = {
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((diff / (1000 * 60)) % 60),
			seconds: Math.floor((diff / 1000) % 60)
		};
	}

	$effect(() => {
		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	});

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

{#if !expired}
	<div class="flex items-center gap-2 font-mono text-sm {className}" role="timer" aria-live="polite">
		<span class="rounded-sm bg-zinc-900 px-2 py-1 text-red-500">{pad(remaining.days)}d</span>
		<span class="text-zinc-600">:</span>
		<span class="rounded-sm bg-zinc-900 px-2 py-1 text-white">{pad(remaining.hours)}h</span>
		<span class="text-zinc-600">:</span>
		<span class="rounded-sm bg-zinc-900 px-2 py-1 text-white">{pad(remaining.minutes)}m</span>
		<span class="text-zinc-600">:</span>
		<span class="rounded-sm bg-zinc-900 px-2 py-1 text-white">{pad(remaining.seconds)}s</span>
	</div>
{/if}
