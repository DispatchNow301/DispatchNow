import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-client";
import {
	Tier,
	RoutePermissions,
	isAuthorized,
} from "./utils/route-permissions";
import { getRow } from "./lib/supabase/utils";

export async function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	const supabase = await createSupabaseServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Case 1: user not logged in & path requires auth
	if (!user && Object.keys(RoutePermissions).includes(path)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Case 2: user is logged in
	if (user) {
		const profile = await getRow<{ tier: Tier }>("profiles", {
			id: user.id,
		});

		if (!profile) {
			return NextResponse.redirect(new URL("/404", request.url));
		}

		const tier = profile.tier;

		// Check if user tier is allowed
		if (!isAuthorized(path, tier)) {
			return NextResponse.redirect(new URL("/404", request.url));
		}
	}

	return NextResponse.next({
		request: {
			headers: request.headers,
		},
	});
}
