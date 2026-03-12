// usage: POST /api/auth/reset-password
// body: { email: string }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
				status: ApiErrors.INVALID_CREDENTIALS.code,
			});
		}

		const supabase = await createSupabaseServerClient();

		// trigger password reset email
		const { data, error } = await supabase.auth.resetPasswordForEmail(
			email,
			{
				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`, // page where user sets new password
			},
		);

		if (error) {
			console.error("Password reset error:", error);
			return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
				status: ApiErrors.INVALID_CREDENTIALS.code,
			});
		}

		return NextResponse.json({
			success: true,
			message: "Password reset email sent",
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
			status: ApiErrors.INVALID_CREDENTIALS.code,
		});
	}
}
