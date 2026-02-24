// File: /app/api/auth/resend-verification/route.ts
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

		// Resend verification email
		const { data, error } = await supabase.auth.resend({
			email: email,
			type: "signup",
		});

		if (error) {
			console.error("Resend verification email error:", error);
			return NextResponse.json(
				{ success: false, message: error.message },
				{ status: 400 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Verification email sent",
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
