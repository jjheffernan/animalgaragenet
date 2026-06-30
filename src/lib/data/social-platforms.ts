/** Platforms shown in footer SocialLinks and account connections. */
export const SOCIAL_PLATFORMS = [
	{
		id: 'instagram',
		label: 'Instagram',
		icon: 'instagram',
		brandHref: 'https://instagram.com/animalgarage'
	},
	{
		id: 'youtube',
		label: 'YouTube',
		icon: 'youtube',
		brandHref: 'https://youtube.com/@animalgarage'
	},
	{
		id: 'tiktok',
		label: 'TikTok',
		icon: 'tiktok',
		brandHref: 'https://tiktok.com/@animalgarage'
	},
	{
		id: 'discord',
		label: 'Discord',
		icon: 'discord',
		brandHref: 'https://discord.gg/animalgarage'
	}
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]['id'];

export const SOCIAL_PLATFORM_IDS: readonly SocialPlatformId[] = SOCIAL_PLATFORMS.map((p) => p.id);

export function isSocialPlatformId(value: string): value is SocialPlatformId {
	return (SOCIAL_PLATFORM_IDS as readonly string[]).includes(value);
}
