import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

const MIN_ENDORSEMENTS = 3;

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function computeStatus(report: { status?: string | null; endorsements?: number | null }) {
  if (report.status && report.status.trim().length > 0) return report.status;
  const e = typeof report.endorsements === "number" ? report.endorsements : 0;
  return e >= MIN_ENDORSEMENTS ? "VERIFIED" : "UNVERIFIED";
}

type ReportRow = {
  id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  endorsements: number | null;
  type: string | null;
  location: string | null;
  status: string | null;
};

export default async function ReportStatusPage() {
  const supabase = await createSupabaseServerClient();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/");

  const { data, error } = await supabase
    .from("reports")
    .select("id, created_at, title, description, endorsements, type, location, status")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Report Status</h1>
        <p style={{ marginTop: 12, color: "crimson" }}>Error: {error.message}</p>
      </main>
    );
  }

  const reports = (data ?? []) as ReportRow[];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Report Status</h1>

      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Status is read from <code>reports.status</code>. If empty, we fall back to endorsements ≥ {MIN_ENDORSEMENTS}.
      </p>

      {reports.length === 0 ? (
        <p style={{ marginTop: 16, opacity: 0.8 }}>No reports found.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {reports.map((r) => {
            const status = computeStatus(r);
            const endorsementsCount = typeof r.endorsements === "number" ? r.endorsements : 0;

            return (
              <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{r.title ?? "Untitled report"}</strong>
                  <span>{fmt(r.created_at)}</span>
                </div>

                <div style={{ marginTop: 6 }}>
                  Type: <strong>{r.type ?? "UNSPECIFIED"}</strong>
                </div>
                <div>
                  Location: <strong>{r.location ?? "UNSPECIFIED"}</strong>
                </div>

                <div style={{ marginTop: 6 }}>
                  Status:{" "}
                  <strong style={{ color: status === "VERIFIED" ? "green" : "crimson" }}>
                    {status}
                  </strong>
                </div>

                <div>
                  Endorsements: <strong>{endorsementsCount}</strong>
                </div>

                {r.description && <div style={{ marginTop: 8 }}>{r.description}</div>}

                <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>Report ID: {r.id}</div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}