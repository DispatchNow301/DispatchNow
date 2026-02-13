// usage: POST /api/auth/login
// body: { email: string, password: string }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";

export async function POST(req: Request) {
	const { email, password } = await req.json();

	const supabase = await createSupabaseServerClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
			status: ApiErrors.INVALID_CREDENTIALS.code,
		});
	}

	return NextResponse.json({ success: true });
}
