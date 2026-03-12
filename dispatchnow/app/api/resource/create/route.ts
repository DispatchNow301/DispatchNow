// usage: POST /api/resource/create
// body: { name: string, type: ResourceType, quantity: number, description?: string }
// only tier 3 (Authority) can create resources

import { NextRequest, NextResponse } from "next/server";
import { insertRow } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getById } from "@/lib/supabase/utils";
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

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, type, quantity, description } = body;

		// Validate type
		if (!isValidResourceType(type)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate name
		if (!name || typeof name !== "string") {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate quantity
		if (quantity === undefined || quantity === null || quantity < 0) {
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
		const profile = await getById<Profile>("profiles", user.id);

		if (!profile || profile.tier !== Tier.Authority) {
			return NextResponse.json(ApiErrors.UNAUTHORIZED, {
				status: ApiErrors.UNAUTHORIZED.code,
			});
		}

		const resourceData: Resource = {
			name,
			type,
			quantity,
			description,
		};

		const data = await insertRow<Resource>("resources", resourceData);

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
