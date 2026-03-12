/*
// Location: app/api/requests/decision/route.ts
// Purpose: Tier 3 endpoint to APPROVE or DENY a PENDING request.
//          For DENY, a denial reason is required and will be recorded.
//          Preferred: requests.denial_reason (if column exists). Fallback: append to requests.additional_notes.
*/

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

type Body = {
	requestId?: string;
	decision?: "APPROVE" | "DENY";
	denialReason?: string | null;
};

function isMissingColumnError(message: string, column: string) {
	// Typical Postgres error: column "denial_reason" of relation "requests" does not exist
	const msg = message.toLowerCase();
	return msg.includes(`column "${column.toLowerCase()}"`) && msg.includes("does not exist");
}

export async function POST(req: Request) {
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

	const body = (await req.json().catch(() => ({}))) as Body;

	const requestId =
		typeof body.requestId === "string" && body.requestId.trim().length > 0
			? body.requestId.trim()
			: null;

	const decision = body.decision;

	if (!requestId || (decision !== "APPROVE" && decision !== "DENY")) {
		return NextResponse.json(
			{ error: "BAD_REQUEST", message: "requestId and decision are required" },
			{ status: 400 },
		);
	}

	// Load request to ensure it exists and is still PENDING
	const { data: reqRow, error: readErr } = await supabase
		.from("requests")
		.select("id, status, additional_notes")
		.eq("id", requestId)
		.single();

	if (readErr || !reqRow) {
		return NextResponse.json(
			{ error: "NOT_FOUND", message: "Request not found" },
			{ status: 404 },
		);
	}

	if (reqRow.status !== "PENDING") {
		return NextResponse.json(
			{
				error: "NOT_PENDING",
				message: `Request status must be PENDING (current: ${reqRow.status})`,
			},
			{ status: 409 },
		);
	}

	if (decision === "APPROVE") {
		// Approve: update status only
		const { error: upErr } = await supabase
			.from("requests")
			.update({ status: "APPROVED" })
			.eq("id", requestId);

		if (upErr) {
			return NextResponse.json(
				{ error: "DB_ERROR", message: upErr.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ ok: true, status: "APPROVED" }, { status: 200 });
	}

	// Deny: denial reason is required
	const denialReason =
		typeof body.denialReason === "string" ? body.denialReason.trim() : "";

	if (!denialReason) {
		return NextResponse.json({ error: "DENIAL_REASON_REQUIRED" }, { status: 400 });
	}

	// Preferred write path: requests.denial_reason (if it exists)
	const primary = await supabase
		.from("requests")
		.update({ status: "DENIED", denial_reason: denialReason } as any)
		.eq("id", requestId);

	if (!primary.error) {
		return NextResponse.json({ ok: true, status: "DENIED" }, { status: 200 });
	}

	// Fallback: if denial_reason column does not exist, append reason into additional_notes
	if (primary.error?.message && isMissingColumnError(primary.error.message, "denial_reason")) {
		const prev = typeof reqRow.additional_notes === "string" ? reqRow.additional_notes : "";
		const appended =
			prev.trim().length > 0 ? `${prev}\n[DENIED] ${denialReason}` : `[DENIED] ${denialReason}`;

		const { error: fallbackErr } = await supabase
			.from("requests")
			.update({ status: "DENIED", additional_notes: appended })
			.eq("id", requestId);

		if (fallbackErr) {
			return NextResponse.json(
				{ error: "DB_ERROR", message: fallbackErr.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ ok: true, status: "DENIED" }, { status: 200 });
	}

	// Any other error: surface it
	return NextResponse.json(
		{ error: "DB_ERROR", message: primary.error.message },
		{ status: 500 },
	);
}
