// usage: GET /api/resources?search=&type=&limit=&offset=
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType } from "@/lib/types";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const search = searchParams.get("search") ?? "";
		const type = searchParams.get("type") as ResourceType | null;
		const limit = Math.min(
			parseInt(searchParams.get("limit") ?? "20"),
			100,
		);
		const offset = parseInt(searchParams.get("offset") ?? "0");

		const supabase = await createSupabaseServerClient();

		let query = supabase
			.from("resources")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (search.trim()) {
			query = query.or(
				`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`,
			);
		}

		if (type && Object.values(ResourceType).includes(type)) {
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
