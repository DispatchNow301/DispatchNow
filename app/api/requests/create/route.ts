// File: app/api/requests/create/route.ts
// Purpose: Create a request item for a shelter. If the item does not exist in inventory, create a placeholder resource with total_qty = 0.
//          Returns fulfilled/partial/out_of_stock with a clear message (MVP).

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserTier } from "@/lib/auth/getTier";

type Body = {
	shelter_name?: string;
	item_name?: string;
	qty?: number;
	additional_notes?: string;
};

type ShelterRow = { id: string; name: string };
type ResourceRow = { id: string; total_qty: number };

function normalizeName(s: string) {
	return s.trim();
}

export async function POST(req: Request) {
	const supabase = await createSupabaseServerClient();

	// 1) Auth
	const {
		data: { user },
		error: userErr,
	} = await supabase.auth.getUser();

	if (userErr || !user) {
		return NextResponse.json(
			{ ok: false, error: "Not authenticated." },
			{ status: 401 },
		);
	}

	// 2) Tier check (Trusted Volunteer = Tier 2+, Authority = Tier 3)
	const tier = await getCurrentUserTier();
	const tierValue =
		typeof tier === "object" && tier !== null && "value" in tier
			? (tier as any).value
			: tier;
	if (tierValue == null || tierValue < 2) {
		return NextResponse.json(
			{ ok: false, error: "Tier 2+ required." },
			{ status: 403 },
		);
	}

	// 3) Parse input
	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json(
			{ ok: false, error: "Invalid JSON body." },
			{ status: 400 },
		);
	}

	const shelterName = normalizeName(body.shelter_name ?? "");
	const itemName = normalizeName(body.item_name ?? "");
	const requestedQty = Number.isFinite(body.qty)
		? Math.floor(body.qty as number)
		: NaN;
	const notes = (body.additional_notes ?? "").trim();

	if (!shelterName) {
		return NextResponse.json(
			{ ok: false, error: "Missing shelter_name." },
			{ status: 400 },
		);
	}
	if (!itemName) {
		return NextResponse.json(
			{ ok: false, error: "Missing item_name." },
			{ status: 400 },
		);
	}
	if (!requestedQty || requestedQty <= 0) {
		return NextResponse.json(
			{ ok: false, error: "qty must be a positive integer." },
			{ status: 400 },
		);
	}

	// 4) Resolve shelter_id by shelter name
	const { data: shelter, error: shelterErr } = await supabase
		.from("shelters")
		.select("id,name")
		.eq("name", shelterName)
		.maybeSingle<ShelterRow>();

	if (shelterErr) {
		return NextResponse.json(
			{
				ok: false,
				error: `Failed to lookup shelter: ${shelterErr.message}`,
			},
			{ status: 500 },
		);
	}
	if (!shelter) {
		return NextResponse.json(
			{ ok: false, error: "Shelter not found. Seed shelters first." },
			{ status: 404 },
		);
	}

	// 5) Find or create the resource for this shelter + item name
	let resourceId: string | null = null;
	let totalQty = 0;
	let createdPlaceholder = false;

	const { data: existingResource, error: resFindErr } = await supabase
		.from("resources")
		.select("id,total_qty")
		.eq("shelter_id", shelter.id)
		.eq("name", itemName)
		.limit(1)
		.maybeSingle<ResourceRow>();

	if (resFindErr) {
		return NextResponse.json(
			{
				ok: false,
				error: `Failed to lookup resource: ${resFindErr.message}`,
			},
			{ status: 500 },
		);
	}

	if (existingResource) {
		resourceId = existingResource.id;
		totalQty = existingResource.total_qty ?? 0;
	} else {
		const { data: inserted, error: resInsErr } = await supabase
			.from("resources")
			.insert({
				shelter_id: shelter.id,
				name: itemName,
				total_qty: 0,
			})
			.select("id,total_qty")
			.single<ResourceRow>();

		if (resInsErr) {
			return NextResponse.json(
				{
					ok: false,
					error: `Failed to create placeholder resource: ${resInsErr.message}`,
				},
				{ status: 500 },
			);
		}

		resourceId = inserted.id;
		totalQty = inserted.total_qty ?? 0;
		createdPlaceholder = true;
	}

	if (!resourceId) {
		return NextResponse.json(
			{ ok: false, error: "Resource resolution failed." },
			{ status: 500 },
		);
	}

	// 6) Compute current reserved + available (MVP: sum on the server)
	const { data: reservations, error: resvErr } = await supabase
		.from("resource_reservations")
		.select("qty,status")
		.eq("resource_id", resourceId)
		.eq("status", "reserved");

	if (resvErr) {
		return NextResponse.json(
			{
				ok: false,
				error: `Failed to compute availability: ${resvErr.message}`,
			},
			{ status: 500 },
		);
	}

	const reservedQty = (reservations ?? []).reduce((sum, r: any) => {
		const q = typeof r.qty === "number" ? r.qty : 0;
		return sum + q;
	}, 0);

	const availableQty = Math.max((totalQty ?? 0) - reservedQty, 0);

	// 7) Decide outcome (MVP)
	let outcome: "fulfilled" | "partial" | "out_of_stock" = "fulfilled";
	let allocatedQty = requestedQty;

	if (availableQty <= 0) {
		outcome = "out_of_stock";
		allocatedQty = 0;
	} else if (requestedQty > availableQty) {
		outcome = "partial";
		allocatedQty = availableQty;
	}

	let message = "Request created.";
	if (outcome === "out_of_stock") {
		message =
			"Out of stock. Your request was recorded, but nothing could be allocated right now.";
	} else if (outcome === "partial") {
		message = `Partial allocation: requested ${requestedQty}, allocated ${allocatedQty}.`;
	} else {
		message = `Allocated ${allocatedQty}.`;
	}

	// 9) Create request row (status must match check constraint, e.g., 'pending')
	const { data: request, error: reqErr } = await supabase
		.from("requests")
		.insert({
			requester_id: user.id,
			resource_name: itemName,
			quantity: requestedQty,
			location: shelterName,
			additional_notes: notes || null,
			status: "PENDING", // <-- fix the check constraint error
		})
		.select("id")
		.single<{ id: string }>();

	if (reqErr) {
		return NextResponse.json(
			{ ok: false, error: `Failed to create request: ${reqErr.message}` },
			{ status: 500 },
		);
	}

	// 10) Create request_items row
	const { error: itemErr } = await supabase.from("request_items").insert({
		request_id: request.id,
		resource_id: resourceId,
		resource_name: itemName,
		qty_requested: requestedQty,
		qty_allocated: allocatedQty,
		outcome,
		message,
	});

	if (itemErr) {
		return NextResponse.json(
			{
				ok: false,
				error: `Failed to create request item: ${itemErr.message}`,
			},
			{ status: 500 },
		);
	}

	// 11) Reserve allocated qty (only if > 0)
	if (allocatedQty > 0) {
		const { error: reserveErr } = await supabase
			.from("resource_reservations")
			.insert({
				resource_id: resourceId,
				user_id: user.id,
				qty: allocatedQty,
				status: "reserved",
			});

		if (reserveErr) {
			return NextResponse.json(
				{
					ok: false,
					error: `Request created, but reservation failed: ${reserveErr.message}`,
				},
				{ status: 500 },
			);
		}
	}

	return NextResponse.json({
		ok: true,
		tier,
		request_id: request.id,
		shelter_name: shelterName,
		item_name: itemName,
		requested_qty: requestedQty,
		allocated_qty: allocatedQty,
		status: outcome,
		message,
		meta: {
			available_qty: availableQty,
			reserved_qty: reservedQty,
			placeholder_resource_created: createdPlaceholder,
		},
	});
}
