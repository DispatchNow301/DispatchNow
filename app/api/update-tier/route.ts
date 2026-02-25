import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { userId, tier } = body;

	if (!userId || tier === undefined) {
		return NextResponse.json(
			{ error: "Missing userId or tier" },
			{ status: 400 },
		);
	}

	const supabase = await createSupabaseServerClient();

	// 1️⃣ Get the logged-in user making the change
	const {
		data: { user: currentUser },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !currentUser) {
		return NextResponse.json(
			{ error: "Not authenticated" },
			{ status: 401 },
		);
	}

	const currentUserId = currentUser.id;

	// 2️⃣ Fetch the old tier for audit
	const { data: oldUser, error: fetchError } = await supabase
		.from("profiles")
		.select("tier")
		.eq("id", userId)
		.single();

	if (fetchError || !oldUser) {
		return NextResponse.json(
			{ error: fetchError?.message || "User not found" },
			{ status: 404 },
		);
	}

	// 3️⃣ Update the tier
	const { data, error: updateError } = await supabase
		.from("profiles")
		.update({ tier })
		.eq("id", userId)
		.select();

	if (updateError || !data || data.length === 0) {
		return NextResponse.json(
			{ error: updateError?.message || "Update blocked by RLS" },
			{ status: 500 },
		);
	}

	// 4️⃣ Insert audit log
	const { error: auditError } = await supabase.from("profiles_audit").insert([
		{
			profile_id: userId,
			changed_by: currentUserId,
			column_changed: "tier",
			old_value: String(oldUser.tier),
			new_value: String(tier),
		},
	]);

	if (auditError) {
		console.error("Failed to log audit:", auditError.message);
	}

	return NextResponse.json({ data });
}
