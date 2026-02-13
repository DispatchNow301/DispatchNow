// usage: GET /api/user/[id]

import { NextRequest, NextResponse } from "next/server";
import { getById } from "@/lib/supabase/utils";
import { ApiErrors } from "@/lib/api-errors";
import { Tier } from "@/lib/types";

interface Profile {
	id: string;
	email: string;
	tier: Tier;
	[key: string]: any;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Fetch the specific user
		const user = await getById<Profile>("profiles", id);

		if (!user) {
			return NextResponse.json(ApiErrors.USER_NOT_FOUND, {
				status: ApiErrors.USER_NOT_FOUND.code,
			});
		}

		return NextResponse.json({ data: user });
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
