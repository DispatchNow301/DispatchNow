import { supabase } from "@/lib/supabase/client";
import EndorseButton from "@/app/components/EndorseButton";
import AuthPanel from "@/app/components/AuthPanel";
import WhoAmI from "@/app/components/AuthPanel";

export default async function Home() {
  const { data: reports, error } = await supabase
    .from("reports")
    .select("id, title, description, endorsements_count, created_at")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 24 }}>
      <h1>Reports</h1>
      <AuthPanel />
      <WhoAmI />

      <pre style={{ marginTop: 12 }}>
        {JSON.stringify(
          { count: reports?.length ?? 0, error },
          null,
          2
        )}
      </pre>

      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {(reports ?? []).map((r) => (
          <div key={r.id} style={{ border: "1px solid #444", borderRadius: 8, padding: 12 }}>
            <h3>{r.title}</h3>
            <p>{r.description ?? ""}</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Endorsements: {r.endorsements_count}
            </p>
            <EndorseButton reportId={r.id} />
          </div>
        ))}
      </div>
    </main>
  );
}
