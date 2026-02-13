// usage: POST /api/auth/authorized
// body: { path: string }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { isAuthorized } from "@/lib/route-permissions";
import { getRow } from "@/lib/supabase/utils";
import { ApiErrors } from "@/lib/api-errors";
import { Tier } from "@/lib/types";

export async function POST(req: Request) {
	try {
		const { path } = await req.json();
		const supabase = await createSupabaseServerClient();

		// Get the currently logged-in user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// Fetch the user's profile
		const profile = await getRow<{ tier: Tier }>("profiles", {
			id: user.id,
		});

		if (!profile) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		const tier = profile.tier as Tier;
		const allowed = isAuthorized(path, tier);

		if (!allowed) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		return NextResponse.json({
			authorized: true,
			tier,
		});
	} catch {
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
