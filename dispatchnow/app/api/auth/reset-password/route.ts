// File: /app/api/auth/reset-password/route.ts
// usage: POST /api/auth/reset-password
// body: { newPassword: string, accessToken: string }

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";

export async function POST(req: Request) {
	try {
		const { newPassword, accessToken } = await req.json();

		if (!newPassword || !accessToken) {
			return NextResponse.json(ApiErrors.INVALID_CREDENTIALS, {
				status: ApiErrors.INVALID_CREDENTIALS.code,
			});
		}

		const supabase = await createSupabaseServerClient();

		// Update the user's password using the access token
		const { error } = await supabase.auth.updateUser(
			{ password: newPassword },
			accessToken,
		);

		if (error) {
			console.error("Reset password error:", error);
			return NextResponse.json(
				{ success: false, message: error.message },
				{ status: 400 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Reset password route error:", err);
		return NextResponse.json(
			{ success: false, message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
