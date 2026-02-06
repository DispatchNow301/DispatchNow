import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { description, type, location } = body;

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
			.insert([
				{
					description,
					type,
					location,
					status: "UNVERIFIED",
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({ data });
	} catch (err: any) {
		console.error(err);
		return NextResponse.json(
			{ error: err.message || "Failed to create report" },
			{ status: 500 },
		);
	}
}
