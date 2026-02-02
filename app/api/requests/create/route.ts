// File: app/api/requests/create/route.ts
// Purpose: Create a request with shortage handling (fulfilled / partial / out_of_stock) using Central Shelter inventory.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type Body = {
	resourceName: string;
	qtyRequested: number;
};

function sumReserved(rows: { qty: number | null }[]) {
	let total = 0;
	for (const r of rows) total += r.qty ?? 0;
	return total;
}

export async function POST(req: Request) {
	let body: Body;

	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json(
			{ ok: false, error: "Invalid JSON body." },
			{ status: 400 },
		);
	}

	const resourceName = body?.resourceName?.trim();
	const qtyRequested = body?.qtyRequested;

	if (!resourceName) {
		return NextResponse.json(
			{ ok: false, error: "resourceName is required." },
			{ status: 400 },
		);
	}

	if (!Number.isInteger(qtyRequested) || qtyRequested <= 0) {
		return NextResponse.json(
			{ ok: false, error: "qtyRequested must be a positive integer." },
			{ status: 400 },
		);
	}

	const supabase = await createSupabaseServerClient();

	// Resolve authenticated user from cookie session.
	const { data: userData, error: userErr } = await supabase.auth.getUser();
	if (userErr || !userData.user) {
		return NextResponse.json(
			{ ok: false, error: "Unauthorized." },
			{ status: 401 },
		);
	}

	// Check tier from public.profiles (Tier 2+ required).
	const { data: profile, error: tierErr } = await supabase
		.from("profiles")
		.select("tier")
		.eq("id", userData.user.id)
		.maybeSingle();

	if (tierErr) {
		return NextResponse.json(
			{ ok: false, error: "Failed to verify user tier." },
			{ status: 500 },
		);
	}

	const tier = typeof profile?.tier === "number" ? profile.tier : 1;
	if (tier < 2) {
		return NextResponse.json(
			{ ok: false, error: "Forbidden: Tier 2+ required." },
			{ status: 403 },
		);
	}

	// Look up the resource by name (assumes resources.name is unique).
	const { data: resource, error: resErr } = await supabase
		.from("resources")
		.select("id, name, total_qty")
		.eq("name", resourceName)
		.single();

	if (resErr || !resource) {
		return NextResponse.json(
			{ ok: false, error: "Resource not found." },
			{ status: 404 },
		);
	}

	// Compute reserved and available (Central Shelter inventory only).
	const { data: reservedRows, error: reservedErr } = await supabase
		.from("resource_reservations")
		.select("qty")
		.eq("resource_id", resource.id)
		.eq("status", "reserved");

	if (reservedErr) {
		return NextResponse.json(
			{ ok: false, error: "Failed to compute availability." },
			{ status: 500 },
		);
	}

	const reservedQty = sumReserved((reservedRows ?? []) as { qty: number | null }[]);
	const totalQty = typeof resource.total_qty === "number" ? resource.total_qty : 0;
	const availableBefore = Math.max(totalQty - reservedQty, 0);

	let outcome: "fulfilled" | "partial" | "out_of_stock" = "fulfilled";
	let qtyAllocated = qtyRequested;

	if (availableBefore <= 0) {
		outcome = "out_of_stock";
		qtyAllocated = 0;
	} else if (availableBefore < qtyRequested) {
		outcome = "partial";
		qtyAllocated = availableBefore;
	}

	let message = "";
	if (outcome === "out_of_stock") {
		message = `${resource.name} is out of stock. Available: 0.`;
	} else if (outcome === "partial") {
		message = `Only ${qtyAllocated} unit(s) available for ${resource.name}. Requested ${qtyRequested}.`;
	} else {
		message = `Request accepted for ${resource.name}. Reserved ${qtyAllocated}.`;
	}

	// Create request header.
	const { data: reqRow, error: reqInsertErr } = await supabase
		.from("requests")
		.insert({
			requester_id: userData.user.id,
			status: outcome,
		})
		.select("id")
		.single();

	if (reqInsertErr || !reqRow) {
		return NextResponse.json(
			{ ok: false, error: "Failed to create request." },
			{ status: 500 },
		);
	}

	// Create request item.
	const { data: itemRow, error: itemInsertErr } = await supabase
		.from("request_items")
		.insert({
			request_id: reqRow.id,
			resource_id: resource.id,
			resource_name: resource.name,
			qty_requested: qtyRequested,
			qty_allocated: qtyAllocated,
			outcome,
			message,
		})
		.select("id")
		.single();

	if (itemInsertErr || !itemRow) {
		return NextResponse.json(
			{ ok: false, error: "Failed to create request item." },
			{ status: 500 },
		);
	}

	// Reserve inventory for fulfilled/partial outcomes.
	if (qtyAllocated > 0) {
		const { error: reserveErr2 } = await supabase
			.from("resource_reservations")
			.insert({
				resource_id: resource.id,
				user_id: userData.user.id,
				qty: qtyAllocated,
				status: "reserved",
			});

		if (reserveErr2) {
			return NextResponse.json(
				{ ok: false, error: `Failed to reserve inventory: ${reserveErr2.message}` },
				{ status: 500 },
			);
		}
	}

	return NextResponse.json(
		{
			ok: true,
			outcome,
			message,
			requestId: reqRow.id,
			requestItemId: itemRow.id,
			resourceName: resource.name,
			qtyRequested,
			qtyAllocated,
			availableBefore,
		},
		{ status: 200 },
	);
}
