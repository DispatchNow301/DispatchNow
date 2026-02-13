// usage: GET /api/request/[id]

import { NextRequest, NextResponse } from "next/server";
import { getById } from "@/lib/supabase/utils";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType } from "@/lib/types";

interface Request {
	id: string;
	requester_id: string;
	status: string;
	resource_type: ResourceType;
	quantity: number;
	latitude?: number;
	longitude?: number;
	description?: string;
	created_at: string;
	updated_at: string;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const request = await getById<Request>("requests", id);

		if (!request) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		return NextResponse.json({ data: request });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
