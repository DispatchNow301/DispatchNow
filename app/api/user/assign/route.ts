import { NextRequest, NextResponse } from "next/server";
import { updateById, insertRow, getById } from "@/lib/supabase/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type AssignRequestBody = {
	userId: string;
	tier: number;
};

export async function POST(req: NextRequest) {
	try {
		const body: AssignRequestBody = await req.json();
		const { userId, tier } = body;

		// get logged-in user
		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const changedBy = user.id;

		const oldUser = await getById<any>("profiles", userId);

		if (!oldUser) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 },
			);
		}

		const oldTier = oldUser.tier;

		const updatedUser = await updateById("profiles", userId, { tier });

		if (!updatedUser) {
			return NextResponse.json(
				{ error: "Failed to update user tier" },
				{ status: 500 },
			);
		}

		await insertRow("profiles_audit", {
			profile_id: userId,
			changed_by: changedBy,
			column_changed: "tier",
			old_value: String(oldTier ?? ""),
			new_value: String(tier),
			changed_at: new Date().toISOString(),
		});

		return NextResponse.json({ data: updatedUser });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
