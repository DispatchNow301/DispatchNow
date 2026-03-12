// usage: POST /api/resource/[id]/delete
// body: {}
// only tier 3 (Authority) can delete resources

import { NextRequest, NextResponse } from "next/server";
import { deleteById, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType, Tier } from "@/lib/types";

interface Resource {
	id?: string;
	name: string;
	type: ResourceType;
	quantity: number;
	description?: string;
	created_at?: string;
	updated_at?: string;
}

interface Profile {
	id: string;
	tier: Tier;
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		
		const supabase = await createSupabaseServerClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
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

		// Verify target resource exists
		const existing = await getById<Resource>("resources", id);
		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		const deleted = await deleteById("resources", id);

		if (!deleted) {
			return NextResponse.json(ApiErrors.SERVER_ERROR, {
				status: ApiErrors.SERVER_ERROR.code,
			});
		}

		return NextResponse.json({ data: deleted });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
