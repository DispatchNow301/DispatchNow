import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

const MIN_ENDORSEMENTS = 3;

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

// If reports.status exists use it; otherwise fall back to endorsements threshold.
function computeStatus(report: { status?: string | null; endorsements?: number | null }) {
  if (report.status && report.status.trim().length > 0) return report.status;
  const e = typeof report.endorsements === "number" ? report.endorsements : 0;
  return e >= MIN_ENDORSEMENTS ? "VERIFIED" : "UNVERIFIED";
}

type EmbeddedReport = {
  id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  endorsements: number | null;
  type: string | null;
  location: string | null;
  status: string | null;
};

type EndorsementRow = {
  id: number;
  report_id: string;
  created_at: string;
  // IMPORTANT: Supabase embed is coming back as an array.
  reports: EmbeddedReport[] | null;
};

type ReservationRow = {
  id: string;
  resource_id: string;
  user_id: string;
  qty: number;
  status: string | null;
  created_at: string;
};

export default async function ActivityPage() {
  const supabase = await createSupabaseServerClient();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/"); // change to /login if you have it
  const userId = userRes.user.id;

  const [{ data: endorsements, error: endErr }, { data: reservations, error: resErr }] =
    await Promise.all([
      supabase
        .from("report_endorsements")
        .select(
          `
          id,
          report_id,
          created_at,
          reports:reports(
            id,
            created_at,
            title,
            description,
            endorsements,
            type,
            location,
            status
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),

      supabase
        .from("resource_reservations")
        .select("id, resource_id, user_id, qty, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  // Cast via unknown to avoid TS complaining about supabase's loose return typing
  const endorsementsTyped = (endorsements ?? []) as unknown as EndorsementRow[];
  const reservationsTyped = (reservations ?? []) as unknown as ReservationRow[];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>My Activity</h1>

      {(endErr || resErr) && (
        <p style={{ marginTop: 12, color: "crimson" }}>
          Error loading activity: {(endErr?.message || resErr?.message)}
        </p>
      )}

      {/* Reports I Endorsed */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Reports I Endorsed</h2>

        {endorsementsTyped.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No endorsements yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {endorsementsTyped.map((e) => {
              const r = e.reports?.[0] ?? null; // take the first embedded report

              const title = r?.title ?? "Untitled report";
              const type = r?.type ?? "UNSPECIFIED";
              const location = r?.location ?? "UNSPECIFIED";
              const endorsementsCount = typeof r?.endorsements === "number" ? r.endorsements : 0;
              const status = r ? computeStatus(r) : "UNKNOWN";

              return (
                <div key={e.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{title}</strong>
                    <span>Endorsed: {fmt(e.created_at)}</span>
                  </div>

                  <div style={{ marginTop: 6 }}>Type: <strong>{type}</strong></div>
                  <div>Location: <strong>{location}</strong></div>
                  <div>Status: <strong>{status}</strong></div>
                  <div>Endorsements: <strong>{endorsementsCount}</strong></div>

                  {r?.description && <div style={{ marginTop: 8 }}>{r.description}</div>}

                  <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
                    Report ID: {e.report_id}
                    {r?.created_at ? <> • Created: {fmt(r.created_at)}</> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* My Resource Reservations */}
      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>My Resource Reservations</h2>

        {reservationsTyped.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No reservations yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {reservationsTyped.map((r) => (
              <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>Resource: {r.resource_id}</strong>
                  <span>{fmt(r.created_at)}</span>
                </div>
                <div>Qty: <strong>{r.qty}</strong></div>
                <div>Status: <strong>{r.status ?? "UNKNOWN"}</strong></div>

                <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
                  Reservation ID: {r.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}