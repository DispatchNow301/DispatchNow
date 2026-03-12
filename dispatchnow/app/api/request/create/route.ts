// usage: POST /api/request/create
// body: { resource_type: ResourceType, quantity: number, latitude?: number, longitude?: number, description?: string }
// anyone can create a request

import { NextRequest, NextResponse } from "next/server";
import { insertRow, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType } from "@/lib/types";

interface Request {
	id?: string;
	requester_id: string;
	status?: string;
	resource_type: ResourceType;
	quantity: number;
	latitude?: number;
	longitude?: number;
	description?: string;
	created_at?: string;
	updated_at?: string;
}

function isValidResourceType(value: any): value is ResourceType {
	return Object.values(ResourceType).includes(value);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { resource_type, quantity, latitude, longitude, description } =
			body;

		// Validate resource type
		if (!isValidResourceType(resource_type)) {
			return NextResponse.json(ApiErrors.FORM_VALIDATION, {
				status: ApiErrors.FORM_VALIDATION.code,
			});
		}

		// Validate quantity
		if (
			quantity === undefined ||
			quantity === null ||
			quantity <= 0 ||
			typeof quantity !== "number"
		) {
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

		const requestData: Request = {
			requester_id: user.id,
			resource_type,
			quantity,
			latitude,
			longitude,
			description,
		};

		const data = await insertRow<Request>("requests", requestData);

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
