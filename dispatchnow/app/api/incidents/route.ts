// usage: GET /api/incidents?search=&status=&priority=&limit=&offset=
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { IncidentStatus, IncidentPriority } from "@/lib/types";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const search = searchParams.get("search") ?? "";
		const status = searchParams.get("status") as IncidentStatus | null;
		const priority = searchParams.get(
			"priority",
		) as IncidentPriority | null;
		const limit = Math.min(
			parseInt(searchParams.get("limit") ?? "20"),
			100,
		);
		const offset = parseInt(searchParams.get("offset") ?? "0");

		const supabase = await createSupabaseServerClient();

		let query = supabase
			.from("incidents")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (search.trim()) {
			query = query.or(
				`title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`,
			);
		}

		if (status && Object.values(IncidentStatus).includes(status)) {
			query = query.eq("status", status);
		}

		if (priority && Object.values(IncidentPriority).includes(priority)) {
			query = query.eq("priority", priority);
		}

		const { data, error, count } = await query;

		if (error) {
			console.error(error);
			return NextResponse.json(ApiErrors.SERVER_ERROR, {
				status: ApiErrors.SERVER_ERROR.code,
			});
		}

		return NextResponse.json({
			data,
			meta: { total: count ?? 0, limit, offset },
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
