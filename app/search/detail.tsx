"use client";

type Report = {
  id: string;
  description: string;
  type: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export default function ReportDetail({
  report,
  onBack,
}: {
  report: Report;
  onBack: () => void;
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "transparent",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        ← Back to Results
      </button>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Report Details</h2>

        <div style={{ display: "grid", gap: 8 }}>
          <div><strong>ID:</strong> {report.id}</div>
          <div><strong>Description:</strong> {report.description}</div>
          <div><strong>Type:</strong> {report.type}</div>
          <div><strong>Status:</strong> {report.status ?? "N/A"}</div>
          <div><strong>Latitude:</strong> {report.latitude ?? "N/A"}</div>
          <div><strong>Longitude:</strong> {report.longitude ?? "N/A"}</div>
          <div><strong>User ID:</strong> {report.user_id ?? "N/A"}</div>
          <div><strong>Created At:</strong> {report.created_at ?? "N/A"}</div>
          <div><strong>Updated At:</strong> {report.updated_at ?? "N/A"}</div>
        </div>
      </div>
    </div>
  );
}