// usage: GET /api/incident/[id]

import { NextRequest, NextResponse } from "next/server";
import { getById, updateById } from "@/lib/supabase/utils";
import { ApiErrors } from "@/lib/api-errors";
import { IncidentStatus, IncidentPriority, Tier } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

interface Incident {
	id: string;
	title: string;
	description?: string;
	status: IncidentStatus;
	priority: IncidentPriority;
	report_id?: string | null;
	created_by: string;
	created_at: string;
	updated_at: string;
	closed_at?: string | null;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const incident = await getById<Incident>("incidents", id);

		if (!incident) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		return NextResponse.json({ data: incident });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}

// usage: PATCH /api/incident/[id]
// body: { title?: string, description?: string, status?: IncidentStatus, priority?: IncidentPriority }
// only tier 3 (Authority) can update incidents

interface Incident {
	id: string;
	title: string;
	description?: string;
	status: IncidentStatus;
	priority: IncidentPriority;
	report_id?: string | null;
	created_by: string;
	created_at: string;
	updated_at: string;
	closed_at?: string | null;
}

interface Profile {
	id: string;
	tier: Tier;
}

function isValidStatus(value: any): value is IncidentStatus {
	return Object.values(IncidentStatus).includes(value);
}

function isValidPriority(value: any): value is IncidentPriority {
	return Object.values(IncidentPriority).includes(value);
}

async function checkAuthority(userId: string): Promise<boolean> {
	const profile = await getById<Profile>("profiles", userId);
	return profile?.tier === Tier.Authority;
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const { title, description, status, priority } = body;

		// Validate title if provided
		if (title !== undefined && (!title || typeof title !== "string")) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate status if provided
		if (status && !isValidStatus(status)) {
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

		// Verify incident exists
		const existing = await getById<Incident>("incidents", id);

		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		// Build update object
		const updates: Partial<Incident> = {};
		if (title !== undefined) updates.title = title;
		if (description !== undefined) updates.description = description;
		if (status !== undefined) updates.status = status;
		if (priority !== undefined) updates.priority = priority;

		const data = await updateById<Incident>("incidents", id, updates);

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
