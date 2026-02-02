import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-client";
import {
	isAuthorized,
	RoutePermissions,
	Tier,
} from "./utils/route-permissions";

export async function proxy(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	console.log({ user });

	const path = request.nextUrl.pathname;

	// Redirect non-authenticated users away from pages that require auth
	// We now check only the paths listed in RoutePermissions
	if (!user && Object.keys(RoutePermissions).includes(path)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (user) {
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("tier")
			.eq("id", user.id)
			.single();

		if (error || !profile) {
			return NextResponse.redirect(new URL("/404", request.url));
		}

		const tier = profile.tier as Tier;

		// Check if the user tier is allowed on this path
		if (!isAuthorized(path, tier)) {
			return NextResponse.redirect(new URL("/404", request.url));
		}
	}

	return response;
}
