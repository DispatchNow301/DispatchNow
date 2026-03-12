import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import AssignPageClient from "./AssignPageClient";

export default async function AssignPage() {
	const supabase = createSupabaseServerClient();

	const { data: users } = await (await supabase)
		.from("profiles")
		.select("id, email, tier")
		.neq("tier", 3);

	return <AssignPageClient users={users || []} />;
}
