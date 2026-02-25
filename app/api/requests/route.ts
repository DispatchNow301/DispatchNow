// usage: GET /api/requests?search=&status=&resource_type=&limit=&offset=
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType } from "@/lib/types";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const search = searchParams.get("search") ?? "";
		const status = searchParams.get("status") ?? "";
		const resourceType = searchParams.get(
			"resource_type",
		) as ResourceType | null;
		const limit = Math.min(
			parseInt(searchParams.get("limit") ?? "20"),
			100,
		);
		const offset = parseInt(searchParams.get("offset") ?? "0");

		const supabase = await createSupabaseServerClient();

		let query = supabase
			.from("requests")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (search.trim()) {
			query = query.ilike("description", `%${search.trim()}%`);
		}

		if (status.trim()) {
			query = query.eq("status", status.trim());
		}

		if (
			resourceType &&
			Object.values(ResourceType).includes(resourceType)
		) {
			query = query.eq("resource_type", resourceType);
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
