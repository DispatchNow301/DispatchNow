// usage: POST /api/auth/register
// body: { email: string, password: string }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";

export async function POST(req: Request) {
	const { email, password, confirmPassword } = await req.json();

	console.log("Registering user:", password, confirmPassword);

	if (password !== confirmPassword) {
		return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
			status: ApiErrors.INVALID_CREDENTIALS.code,
		});
	}

	const supabase = await createSupabaseServerClient();

	const { error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		console.log(error);
		// If sign-up fails due to bad input or duplicate, map to INVALID_CREDENTIALS
		return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
			status: ApiErrors.INVALID_CREDENTIALS.code,
		});
	}

	return NextResponse.json({ success: true });
}
