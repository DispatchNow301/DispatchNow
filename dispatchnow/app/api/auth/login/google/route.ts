// usage: GET /api/auth/login/google
// query: ?redirectTo=...

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.redirect(data.url);
}
