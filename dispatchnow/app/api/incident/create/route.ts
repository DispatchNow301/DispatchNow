// usage: POST /api/incident/create
// body: { title: string, description?: string, priority?: IncidentPriority, report_id?: string }
// only tier 3 (Authority) can create incidents

import { NextRequest, NextResponse } from "next/server";
import { insertRow, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { IncidentStatus, IncidentPriority, Tier } from "@/lib/types";

interface Incident {
	id?: string;
	title: string;
	description?: string;
	status?: IncidentStatus;
	priority?: IncidentPriority;
	report_id?: string | null;
	created_by: string;
	created_at?: string;
	updated_at?: string;
	closed_at?: string | null;
}

interface Profile {
	id: string;
	tier: Tier;
}

function isValidPriority(value: any): value is IncidentPriority {
	return Object.values(IncidentPriority).includes(value);
}

async function checkAuthority(userId: string): Promise<boolean> {
	const profile = await getById<Profile>("profiles", userId);
	return profile?.tier === Tier.Authority;
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { title, description, priority, report_id } = body;

		// Validate title
		if (!title || typeof title !== "string") {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate priority if provided
		if (priority && !isValidPriority(priority)) {
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

		// Check if user is Authority (tier 3)
		const isAuthority = await checkAuthority(user.id);
		if (!isAuthority) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// If report_id provided, verify it exists
		if (report_id) {
			const report = await getById("reports", report_id);
			if (!report) {
				return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
					status: ApiErrors.USER_NOT_FOUND.code,
				});
			}
		}

		const incidentData: Incident = {
			title,
			description,
			priority: priority || IncidentPriority.Medium,
			status: IncidentStatus.Active,
			report_id: report_id || null,
			created_by: user.id,
		};

		const data = await insertRow<Incident>("incidents", incidentData);

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
