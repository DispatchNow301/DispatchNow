// usage: POST /api/resource/[id]/edit
// body: { name: string, type: ResourceType, quantity: number, description?: string }
// only tier 3 (Authority) can edit resources

import { NextRequest, NextResponse } from "next/server";
import { updateById, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType, Tier } from "@/lib/types";

interface Resource {
	id?: string;
	name: string;
	type: ResourceType;
	quantity: number;
	description?: string;
	created_at?: string;
	updated_at?: string;
}

interface Profile {
	id: string;
	tier: Tier;
}

function isValidResourceType(value: any): value is ResourceType {
	return Object.values(ResourceType).includes(value);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const body = await req.json();
		const validUpdates: Partial<Resource> = {};

		// Validate name (if provided)
		if (body.name !== undefined) {
			if (typeof body.name !== "string" || body.name.trim() === "") {
				return NextResponse.json(ApiErrors.FORM_VALIDATION, {
					status: ApiErrors.FORM_VALIDATION.code,
				});
			}
			validUpdates.name = body.name;
		}

		// Validate type (if provided)
		if (body.type !== undefined) {
			if (!isValidResourceType(body.type)) {
				return NextResponse.json(ApiErrors.FORM_VALIDATION, {
					status: ApiErrors.FORM_VALIDATION.code,
				});
			}
			validUpdates.type = body.type;
		}

		// Validate quantity (if provided)
		if (body.quantity !== undefined) {
			if (typeof body.quantity !== "number" || body.quantity < 0) {
				return NextResponse.json(ApiErrors.FORM_VALIDATION, {
					status: ApiErrors.FORM_VALIDATION.code,
				});
			}
			validUpdates.quantity = body.quantity;
		}

		// Validate description (if provided)
		if (body.description !== undefined) {
			if (typeof body.description !== "string") {
				return NextResponse.json(ApiErrors.FORM_VALIDATION, {
					status: ApiErrors.FORM_VALIDATION.code,
				});
			}
			validUpdates.description = body.description;
		}

		if (Object.keys(validUpdates).length === 0) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		const { id } = await params;

		const supabase = await createSupabaseServerClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// Fetch current user's profile for authorization
		const userProfile = await getById<Profile>("profiles", user.id);
		const userTier = userProfile?.tier;

		// Check authorization: only tier 3 (Authority) can assign tiers
		const isAuthority = userTier === Tier.Authority;

		if (!isAuthority) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		// Verify target resource exists
		const existing = await getById<Resource>("resources", id);
		if (!existing) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		// Update the resource
		const updated = await updateById<Resource>(
			"resources", id, validUpdates
		);

		if (!updated) {
			return NextResponse.json(ApiErrors.SERVER_ERROR, {
				status: ApiErrors.SERVER_ERROR.code,
			});
		}

		return NextResponse.json({ data: updated });
	} catch {
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}