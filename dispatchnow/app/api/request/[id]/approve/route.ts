// usage: POST /api/request/[id]/approve
// body: { status: "approved" | "rejected" }
// only tier 3 (Authority) can approve/reject requests

import { NextRequest, NextResponse } from "next/server";
import { updateById, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType, Tier } from "@/lib/types";

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

interface Profile {
	id: string;
	tier: Tier;
}

async function checkAuthority(userId: string): Promise<boolean> {
	const profile = await getById<Profile>("profiles", userId);
	return profile?.tier === Tier.Authority;
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const { status } = body;

		// Validate status
		if (!["approved", "rejected"].includes(status)) {
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

		// Verify request exists
		const existing = await getById<Request>("requests", id);

		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		// Update status
		const data = await updateById<Request>("requests", id, { status });

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

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ canApprove: false }, { status: 200 });
		}

		const isAuthority = await checkAuthority(user.id);
		return NextResponse.json({ canApprove: Boolean(isAuthority) }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ canApprove: false }, { status: 200 });
	}
}