// usage: GET /api/reports?search=&status=&type=&limit=&offset=
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ReportType, ReportStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const search = searchParams.get("search") ?? "";
		const status = searchParams.get("status") as ReportStatus | null;
		const type = searchParams.get("type") as ReportType | null;
		const limit = Math.min(
			parseInt(searchParams.get("limit") ?? "20"),
			100,
		);
		const offset = parseInt(searchParams.get("offset") ?? "0");

		const supabase = await createSupabaseServerClient();

		let query = supabase
			.from("reports")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (search.trim()) {
			query = query.ilike("description", `%${search.trim()}%`);
		}

		if (status && Object.values(ReportStatus).includes(status)) {
			query = query.eq("status", status);
		}

		if (type && Object.values(ReportType).includes(type)) {
			query = query.eq("type", type);
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
			meta: {
				total: count ?? 0,
				limit,
				offset,
			},
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
