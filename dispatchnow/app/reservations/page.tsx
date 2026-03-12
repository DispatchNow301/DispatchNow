import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default async function ReservationsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/");

  const { data, error } = await supabase
    .from("resource_reservations")
    .select("id, resource_id, qty, status, created_at")
    .eq("user_id", userRes.user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <main style={{ padding: 24 }}>Error: {error.message}</main>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>My Reservations</h1>

      {!data?.length ? (
        <p style={{ opacity: 0.8 }}>No reservations yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {data.map((r) => (
            <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>Resource: {r.resource_id}</strong>
                <span>{fmt(r.created_at)}</span>
              </div>
              <div>Qty: <strong>{r.qty}</strong></div>
              <div>Status: <strong>{r.status ?? "SUBMITTED"}</strong></div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}