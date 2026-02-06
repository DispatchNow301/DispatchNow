import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST() {
	const supabase = await createSupabaseServerClient();
	await supabase.auth.signOut();

	return NextResponse.json({ success: true });
}
