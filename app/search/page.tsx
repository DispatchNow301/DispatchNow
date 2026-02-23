import Link from "next/link";
import SearchClient from "./SearchClient";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function SearchPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select("id, description, type, status, latitude, longitude, user_id, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Search Reports</h1>
        <p>Error loading reports</p>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Search Reports</h1>
        <Link href="/">Go Home</Link>
      </header>

      <SearchClient reports={data ?? []} />
    </main>
  );
}