<script lang="ts">
	const links = [
		{ label: 'Instagram', href: 'https://instagram.com/animalgarage', icon: 'instagram' },
		{ label: 'YouTube', href: 'https://youtube.com/@animalgarage', icon: 'youtube' },
		{ label: 'TikTok', href: 'https://tiktok.com/@animalgarage', icon: 'tiktok' },
		{ label: 'Discord', href: 'https://discord.gg/animalgarage', icon: 'discord' }
	] as const;

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="flex items-center gap-4 {className}">
	{#each links as link (link.href)}
		<a
			href={link.href}
			target="_blank"
			rel="noopener noreferrer"
			class="text-zinc-500 transition hover:text-red-500"
			aria-label={link.label}
		>
			<span class="text-xs font-bold uppercase tracking-wider">{link.label}</span>
		</a>
	{/each}
</div>
