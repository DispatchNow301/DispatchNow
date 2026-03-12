// File: app/api/inventory/edit/route.ts
// Purpose: Update a resource's total quantity with Tier 3 authorization and non-negative validation.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type Body = {
	resourceId: string;
	totalQty: number;
};

export async function PATCH(req: Request) {
	let body: Body;

	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json(
			{ error: "Invalid JSON body." },
			{ status: 400 },
		);
	}

	const { resourceId, totalQty } = body ?? {};

	if (!resourceId || typeof resourceId !== "string") {
		return NextResponse.json(
			{ error: "resourceId is required." },
			{ status: 400 },
		);
	}

	if (!Number.isInteger(totalQty) || totalQty < 0) {
		return NextResponse.json(
			{ error: "totalQty must be a non-negative integer." },
			{ status: 400 },
		);
	}

	const supabase = await createSupabaseServerClient();

	// Resolve the authenticated user from the cookie-based session.
	const { data: userData, error: userErr } = await supabase.auth.getUser();
	if (userErr || !userData.user) {
		return NextResponse.json(
			{ error: "Unauthorized." },
			{ status: 401 },
		);
	}

	// Fetch tier from public.profiles.
	const { data: profile, error: tierErr } = await supabase
		.from("profiles")
		.select("tier")
		.eq("id", userData.user.id)
		.maybeSingle();

	const tier = typeof profile?.tier === "number" ? profile.tier : 1;

	if (tierErr) {
		return NextResponse.json(
			{ error: "Failed to verify user tier." },
			{ status: 500 },
		);
	}

	if (tier < 3) {
		return NextResponse.json(
			{ error: "Forbidden: Tier 3 required." },
			{ status: 403 },
		);
	}

	// Update inventory quantity.
	const { data: updated, error: updateErr } = await supabase
		.from("resources")
		.update({ total_qty: totalQty })
		.eq("id", resourceId)
		.select("id, name, total_qty, shelter_id")
		.single();

	if (updateErr) {
		return NextResponse.json(
			{ error: updateErr.message },
			{ status: 400 },
		);
	}

	return NextResponse.json(
		{ ok: true, resource: updated },
		{ status: 200 },
	);
}
