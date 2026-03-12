// usage: POST /api/report/create
// body: { description?: string, type: ReportType, latitude?: number, longitude?: number }

import { NextRequest, NextResponse } from "next/server";
import { insertRow } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ReportType, ReportStatus } from "@/lib/types";

interface Report {
	id?: string;
	description?: string;
	type: ReportType;
	location?: {
		latitude: number;
		longitude: number;
	};
	latitude?: number;
	longitude?: number;
	status?: ReportStatus;
	user_id: string;
	created_at?: string;
	updated_at?: string;
}

function isValidReportType(value: any): value is ReportType {
	return Object.values(ReportType).includes(value);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { description, type, latitude, longitude } = body;

		// Validate type
		if (!isValidReportType(type)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate coordinates if provided
		if ((latitude && !longitude) || (!latitude && longitude)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		const reportData: Report = {
			description,
			type,
			latitude,
			longitude,
			status: ReportStatus.Unverified,
			user_id: user.id,
		};

		const data = await insertRow<Report>("reports", reportData);

		if (!data) {
			return NextResponse.json(ApiErrors.SERVER_ERROR, {
				status: ApiErrors.SERVER_ERROR.code,
			});
		}

		return NextResponse.json({ data });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
