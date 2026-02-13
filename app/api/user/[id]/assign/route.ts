// usage: POST /api/user/[id]/assign
// body: { tier: Tier }
// only tier 3 (Authority) can assign tiers to other users

import { NextRequest, NextResponse } from "next/server";
import { updateById, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Tier } from "@/lib/types";
import { ApiErrors } from "@/lib/api-errors";

interface Profile {
	id: string;
	tier: Tier;
	[key: string]: any;
}

function isValidTier(value: any): value is Tier {
	return Object.values(Tier).includes(value);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { tier } = await req.json();
		const { id } = await params;
		const userId = id;

		// Validate tier is a valid Tier enum value
		if (!isValidTier(tier)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		console.log(user.id, userId);

		// Cannot change own tier
		if (user.id === userId) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// Fetch current user's profile for authorization
		const userProfile = await getById<Profile>("profiles", user.id);
		const userTier = userProfile?.tier;

		// Check authorization: only tier 3 (Authority) can assign tiers
		const isAuthority = userTier === Tier.Authority;

		if (!isAuthority) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// Verify target user exists
		const existing = await getById<Profile>("profiles", userId);

		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		// Update the tier
		const updated = await updateById<Profile>("profiles", userId, { tier });

		if (!updated) {
			return NextResponse.json(ApiErrors.SERVER_ERROR, {
				status: ApiErrors.SERVER_ERROR.code,
			});
		}

		return NextResponse.json({ data: updated });
	} catch {
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
