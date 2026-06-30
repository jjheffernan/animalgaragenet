/** Columns inserted by `handle_new_user` — keep in sync with `20260629130000_profiles_signup_trigger.sql`. */
export const PROFILE_SIGNUP_COLUMNS = ['id', 'display_name'] as const;

export type ProfileSignupPayload = {
	id: string;
	display_name: string;
};

/** Mirrors `public.handle_new_user()` display_name derivation for contract tests. */
export function buildProfileSignupPayload(
	userId: string,
	email: string,
	rawUserMetaData: Record<string, unknown> | null | undefined
): ProfileSignupPayload {
	const name = rawUserMetaData?.name;
	const displayName =
		typeof name === 'string' && name.trim() ? name.trim() : (email.split('@')[0] ?? email);
	return { id: userId, display_name: displayName };
}
