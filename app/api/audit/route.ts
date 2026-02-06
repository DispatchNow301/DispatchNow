import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET() {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase
		.from("profiles_audit")
		.select(
			"id, profile_id, changed_by, column_changed, old_value, new_value, changed_at",
		)
		.order("changed_at", { ascending: false })
		.limit(50);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ data });
}
