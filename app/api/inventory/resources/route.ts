// File: app/api/inventory/resources/route.ts
// Purpose: Return resources for editing (Tier 3 only).

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserTier } from "@/lib/auth/getTier";

export async function GET() {
	const auth = await getCurrentUserTier();
	if (!auth) {
		return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
	}

	if (auth.tier < 3) {
		return NextResponse.json({ ok: false, error: "Forbidden: Tier 3 required." }, { status: 403 });
	}

	const supabase = await createSupabaseServerClient();

	// Fetch resources and attempt to include shelter name via FK relationship.
	const { data, error } = await supabase
		.from("resources")
		.select("id, name, total_qty, shelters(name)")
		.order("name", { ascending: true });

	if (error) {
		return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
	}

	const rows = (data ?? []).map((r: any) => ({
		id: r.id,
		name: r.name ?? null,
		total_qty: r.total_qty ?? null,
		shelter_name: r.shelters?.name ?? null,
	}));

	return NextResponse.json({ ok: true, tier: auth.tier, rows }, { status: 200 });
}
