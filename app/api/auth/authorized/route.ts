import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Tier, isAuthorized } from "@/utils/route-permissions";
import { getRow } from "@/lib/supabase/utils";

export async function POST(req: Request) {
	const { path } = await req.json();
	const supabase = await createSupabaseServerClient();

	// Get the currently logged-in user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ authorized: false, reason: "no-user" });
	}

	// Use the utility function to fetch the user's profile
	const profile = await getRow<{ tier: Tier }>("profiles", { id: user.id });

	if (!profile) {
		return NextResponse.json({ authorized: false, reason: "no-profile" });
	}

	const tier = profile.tier as Tier;
	const allowed = isAuthorized(path, tier);

	return NextResponse.json({
		authorized: allowed,
		tier,
	});
}
