import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

export async function GET() {
	const supabase = await createSupabaseServerClient();

	// Auth check: ensure the request is from a logged-in user
	const { data: userRes, error: userErr } = await supabase.auth.getUser();
	if (userErr || !userRes?.user) {
		return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
	}


	const { data, error } = await supabase
		.from("incidents")
		.select("id,title,description,type,status,priority,report_id,latitude,longitude,created_at,updated_at,closed_at,reports(latitude,longitude,type,description)")
		.order("updated_at", { ascending: false });

	if (error) {
		return NextResponse.json(
			{ error: "DB_ERROR", message: error.message },
			{ status: 500 },
		);
	}


	const items =
		(data ?? [])
			.map((row: any) => {
				const rep = Array.isArray(row.reports) ? row.reports[0] : row.reports;

				const latRaw = row?.latitude ?? rep?.latitude ?? null;
				const lngRaw = row?.longitude ?? rep?.longitude ?? null;

				const latNum = latRaw == null ? NaN : Number(latRaw);
				const lngNum = lngRaw == null ? NaN : Number(lngRaw);

				const lat = Number.isFinite(latNum) ? latNum : null;
				const lng = Number.isFinite(lngNum) ? lngNum : null;


				return {
					id: row.id,
					title: row.title,
					description: row.description,
					status: row.status,
					priority: row.priority,
					reportId: row.report_id,
					lat,
					lng,
					createdAt: row.created_at,
					updatedAt: row.updated_at,
					type: row.type,
					closedAt: row.closed_at,
				};
			})
			?? [];

	return NextResponse.json({ data: items }, { status: 200 });
}

export async function POST(req: Request) {
	const supabase = await createSupabaseServerClient();

	const { data: userRes, error: userErr } = await supabase.auth.getUser();

	console.log(userRes);

	if (userErr || !userRes?.user) {
		return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
	}

	const gate = await requireTier3(supabase, userRes.user.id);
	if (!gate.ok) {
		return NextResponse.json(
			{ error: gate.error },
			{ status: gate.status },
		);
	}

	const body = await req.json().catch(() => ({}));

	const ALLOWED_TYPES = new Set([
		"fire", "flood", "severe_weather", "road_closure", "hazmat", "others",
	]);

	const type =
		typeof body?.type === "string" && ALLOWED_TYPES.has(body.type)
			? body.type
			: "others";

	const ALLOWED_STATUS = new Set(["active", "paused", "closed"]);

	const statusRaw =
		typeof body?.status === "string" ? body.status.trim().toLowerCase() : "";

	const status = ALLOWED_STATUS.has(statusRaw) ? statusRaw : "active";

	//Edit by Kenson
	const latRaw = body?.latitude ?? body?.lat ?? null;
	const lngRaw = body?.longitude ?? body?.lng ?? null;

	const latNum = latRaw == null ? NaN : Number(latRaw);
	const lngNum = lngRaw == null ? NaN : Number(lngRaw);

	const latitude = Number.isFinite(latNum) ? latNum : null;
	const longitude = Number.isFinite(lngNum) ? lngNum : null;

	// Minimal required fields for typical DB schema
	const title =
		typeof body?.title === "string" && body.title.trim().length > 0
			? body.title.trim()
			: "Untitled Incident";

	const description =
		typeof body?.description === "string" ? body.description : null;

	const priority =
		typeof body?.priority === "string" && body.priority.trim().length > 0
			? body.priority.trim()
			: undefined;

	const reportId =
		typeof body?.reportId === "string" && body.reportId.trim().length > 0
			? body.reportId.trim()
			: undefined;
	// Edit by Kenson(ends)

	const { data: incident, error } = await supabase
		.from("incidents")
		.insert({
			title,
			description,
			type,             
			status,
			...(priority ? { priority } : {}),
			...(reportId ? { report_id: reportId } : {}),
			created_by: userRes.user.id,
			latitude,
			longitude,
			closed_at: status === "closed" ? new Date().toISOString() : null,
		})
		.select("*")
		.single();

	if (error) {
		return NextResponse.json(
			{ error: "DB_ERROR", message: error.message },
			{ status: 500 },
		);
	}

	return NextResponse.json({ incident }, { status: 201 });
}
