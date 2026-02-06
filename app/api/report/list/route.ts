import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET() {
	try {
		const supabase = await createSupabaseServerClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const { data, error } = await supabase
			.from("reports")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return NextResponse.json({ data });
	} catch (err: any) {
		console.error(err);
		return NextResponse.json(
			{ error: err.message || "Failed to fetch reports" },
			{ status: 500 },
		);
	}
}
