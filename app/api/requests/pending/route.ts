/*
// Location: app/api/requests/pending/route.ts
// Purpose: Tier 3 endpoint to fetch PENDING requests plus their related incidents for grouping/sorting in the UI.
*/

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

export async function GET() {
	const supabase = await createSupabaseServerClient();

	// Must be logged in
	const { data: userRes, error: userErr } = await supabase.auth.getUser();
	if (userErr || !userRes?.user) {
		return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
	}

	// Must be Tier 3
	const gate = await requireTier3(supabase, userRes.user.id);
	if (!gate.ok) {
		return NextResponse.json({ error: gate.error }, { status: gate.status });
	}

	// Fetch PENDING requests (minimal columns needed for the approvals UI)
	const { data: requests, error: reqErr } = await supabase
		.from("requests")
		.select(
			"id, requester_id, status, created_at, incident_id, resource_name, quantity, location, additional_notes",
		)
		.eq("status", "PENDING");

	if (reqErr) {
		return NextResponse.json(
			{ error: "DB_ERROR", message: reqErr.message },
			{ status: 500 },
		);
	}

	// Fetch related incidents for grouping/sorting (best-effort)
	const incidentIds = Array.from(
		new Set((requests ?? []).map((r) => r.incident_id).filter(Boolean)),
	) as string[];

	let incidents: any[] = [];
	if (incidentIds.length > 0) {
		const { data: incs, error: incErr } = await supabase
			.from("incidents")
			.select("id, priority, status, created_at, closed_at")
			.in("id", incidentIds);

		// Incidents fetch failure should not block returning pending requests
		incidents = incErr ? [] : incs ?? [];
	}

	return NextResponse.json(
		{
			incidents,
			requests: requests ?? [],
		},
		{ status: 200 },
	);
}
