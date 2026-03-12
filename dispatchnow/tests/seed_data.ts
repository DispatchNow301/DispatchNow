import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function seed() {
	try {
		console.log("Seeding...");

		/* ---------------- PROFILES ---------------- */
		const { error: profileError } = await supabase.from("profiles").upsert(
			[
				{ email: "citizen@test.com", tier: 1 },
				{ email: "volunteer@test.com", tier: 2 },
				{ email: "authority@test.com", tier: 3 },
			],
			{ onConflict: "email" },
		);

		if (profileError) console.error("profiles error:", profileError);

		/* ---------------- INCIDENTS ---------------- */
		const { error: incidentError } = await supabase
			.from("incidents")
			.insert([
				{
					IdleDeadline: new Date(Date.now() + 3600_000).toISOString(),
					status: "open",
					priority: "high",
				},
				{
					IdleDeadline: new Date(Date.now() + 7200_000).toISOString(),
					status: "pending",
					priority: "medium",
				},
			]);

		if (incidentError) console.error("incidents error:", incidentError);

		/* ---------------- REPORTS ---------------- */
		const { error: reportError } = await supabase.from("reports").insert([
			{
				id: crypto.randomUUID(),
				title: "Flooded street",
				description: "Street blocked by water",
				endorsements_count: 3,
				type: "flood",
				location: "Downtown",
				status: "active",
			},
			{
				id: crypto.randomUUID(),
				title: "Power outage",
				description: "Electricity down",
				endorsements_count: 1,
				type: "utility",
				location: "North area",
				status: "review",
			},
		]);

		if (reportError) console.error("reports error:", reportError);

		/* ---------------- RESOURCES ---------------- */
		const { error: resourceError } = await supabase
			.from("resources")
			.insert([
				{
					id: crypto.randomUUID(),
					shelter_id: crypto.randomUUID(), // must be UUID
					name: "Water bottles",
					total_qty: 100,
				},
				{
					id: crypto.randomUUID(),
					shelter_id: crypto.randomUUID(),
					name: "Blankets",
					total_qty: 40,
				},
			]);

		if (resourceError) console.error("resources error:", resourceError);

		console.log("Seed complete ✅");
	} catch (err) {
		console.error("Seed crashed:", err);
	}
}

seed();
