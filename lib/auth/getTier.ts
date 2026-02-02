// File: lib/auth/getTier.ts
// Purpose: Resolve the authenticated user's tier from public.profiles using Supabase Auth (supports cookie session or access token).

import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type TierResult = {
	user: User;
	tier: number; // expected values: 1 / 2 / 3
};

/**
 * Gets the current authenticated user from the cookie-based Supabase session,
 * then reads the user's tier from public.profiles.
 */
export async function getCurrentUserTier(): Promise<TierResult | null> {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data.user) return null;

	const tier = await readTierByUserId(supabase, data.user.id);
	return { user: data.user, tier };
}

/**
 * Validates the provided Supabase access token, resolves the user,
 * then reads the user's tier from public.profiles.
 */
export async function getTierFromAccessToken(
	accessToken: string,
): Promise<TierResult | null> {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.auth.getUser(accessToken);
	if (error || !data.user) return null;

	const tier = await readTierByUserId(supabase, data.user.id);
	return { user: data.user, tier };
}

/**
 * Looks up public.profiles.tier for the given user id.
 * Falls back to tier 1 if the profile row is missing or invalid.
 */
async function readTierByUserId(
	supabase: SupabaseClient,
	userId: string,
): Promise<number> {
	const { data, error } = await supabase
		.from("profiles")
		.select("tier")
		.eq("id", userId)
		.maybeSingle();

	if (error || !data || typeof data.tier !== "number") {
		return 1;
	}
	return data.tier;
}
