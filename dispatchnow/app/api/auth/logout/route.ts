// usage: POST /api/auth/logout
// body: { none }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";

export async function POST() {
	try {
		const supabase = await createSupabaseServerClient();
		await supabase.auth.signOut();

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json(ApiErrors.SERVER_ERROR, {
			status: ApiErrors.SERVER_ERROR.code,
		});
	}
}
