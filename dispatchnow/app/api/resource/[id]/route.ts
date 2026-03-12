// usage:
// GET /api/resource/[id] - fetch resource
// PATCH /api/resource/[id] - update resource (only tier 3)

import { NextRequest, NextResponse } from "next/server";
import { updateById, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType, Tier } from "@/lib/types";

interface Resource {
	id: string;
	name: string;
	type: ResourceType;
	quantity: number;
	description?: string;
	created_at: string;
	updated_at: string;
}

interface Profile {
	id: string;
	tier: Tier;
}

function isValidResourceType(value: any): value is ResourceType {
	return Object.values(ResourceType).includes(value);
}

async function checkAuthority(userId: string): Promise<boolean> {
	const profile = await getById<Profile>("profiles", userId);
	return profile?.tier === Tier.Authority;
}

// ============================================================================
// GET
// ============================================================================
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Fetch the resource
		const resource = await getById<Resource>("resources", id);

		if (!resource) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		return NextResponse.json({ data: resource });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}

// ============================================================================
// PATCH
// ============================================================================
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const { name, type, quantity, description } = body;

		// Validate type if provided
		if (type && !isValidResourceType(type)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate name if provided
		if (name !== undefined && (!name || typeof name !== "string")) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate quantity if provided
		if (
			quantity !== undefined &&
			(quantity < 0 || typeof quantity !== "number")
		) {
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

		// Verify resource exists
		const existing = await getById<Resource>("resources", id);

		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		// Build update object with only provided fields
		const updates: Partial<Resource> = {};
		if (name !== undefined) updates.name = name;
		if (type !== undefined) updates.type = type;
		if (quantity !== undefined) updates.quantity = quantity;
		if (description !== undefined) updates.description = description;

		const data = await updateById<Resource>("resources", id, updates);

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
