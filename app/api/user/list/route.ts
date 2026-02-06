import { NextRequest, NextResponse } from "next/server";
import { getRows } from "@/lib/supabase/utils";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username");

		let users;

		if (username) {
			// search users by username/email
			users = await getRows(
				"profiles",
				{},
				{
					select: "id,email,tier",
				},
			);
			// simple filter for username/email containing the string
			users = users.filter((u: any) =>
				(u.email || "").toLowerCase().includes(username.toLowerCase()),
			);
		} else {
			// fetch all users
			users = await getRows("profiles", {}, { select: "id,email,tier" });

			// Exclude users with tier 3
			users = users.filter((u: any) => u.tier !== 3);
		}

		return NextResponse.json({ data: users });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 },
		);
	}
}
