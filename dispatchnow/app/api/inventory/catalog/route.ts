// File: app/api/inventory/catalog/route.ts
// Purpose: Return the resource catalog rows for Tier 2+ users.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserTier } from "@/lib/auth/getTier";

export async function GET() {
	const auth = await getCurrentUserTier();
	if (!auth) {
		return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
	}

	if (auth.tier < 2) {
		return NextResponse.json({ ok: false, error: "Forbidden: Tier 2+ required." }, { status: 403 });
	}

	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("resource_catalog")
		.select("shelter_name, resource_name, available_qty, reserved_qty")
		.order("shelter_name", { ascending: true })
		.order("resource_name", { ascending: true });

	if (error) {
		return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
	}

	return NextResponse.json({ ok: true, tier: auth.tier, rows: data ?? [] }, { status: 200 });
}
