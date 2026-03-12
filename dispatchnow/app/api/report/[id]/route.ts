// usage: GET /api/report/[id]

import { NextRequest, NextResponse } from "next/server";
import { getById } from "@/lib/supabase/utils";
import { ApiErrors } from "@/lib/api-errors";
import { ReportType, ReportStatus } from "@/lib/types";

interface Report {
	id: string;
	description?: string;
	type: ReportType;
	latitude?: number;
	longitude?: number;
	status: ReportStatus;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Fetch the report
		const report = await getById<Report>("reports", id);

		if (!report) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		return NextResponse.json({ data: report });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
