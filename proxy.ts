import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-client";
import { isAuthorized, RoutePermissions } from "./lib/route-permissions";
import { Tier } from "./lib/types";
import { getRow } from "./lib/supabase/utils";

export async function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Check if this path requires authorization
	const requiresAuth = Object.keys(RoutePermissions).includes(path);

	if (!requiresAuth) {
		return NextResponse.next();
	}

	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// User not logged in
	if (!user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// User logged in - check tier permissions
	const profile = await getRow<{ tier: Tier }>("profiles", {
		id: user.id,
	});

	if (!profile) {
		return NextResponse.redirect(new URL("/404", request.url));
	}

	// Check if user tier is allowed for this route
	if (!isAuthorized(path, profile.tier)) {
		return NextResponse.redirect(new URL("/404", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
