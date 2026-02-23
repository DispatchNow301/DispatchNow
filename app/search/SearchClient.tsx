"use client";

import { useMemo, useState } from "react";
import ReportDetail from "./detail";

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

export default function SearchClient({ reports }: { reports: Report[] }) {
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return reports.filter((r) => {

      const textMatch =
        !query ||
        r.description.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query);

      if (!selectedDate) return textMatch;

      if (!r.created_at) return false;

      const reportDay = new Date(r.created_at).toISOString().split("T")[0];
      const dateMatch = reportDay === selectedDate;

      return textMatch && dateMatch;
    });
  }, [q, selectedDate, reports]);

  if (selectedReport) {
    return (
      <ReportDetail
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <section style={{ marginTop: 16 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by description or type..."
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #333",
          background: "transparent",
          color: "inherit",
        }}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "transparent",
            color: "inherit",
          }}
        />

        <button
          type="button"
          onClick={() => setSelectedDate("")}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "transparent",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          Clear date
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {filtered.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 12,
            }}
          >
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSelectedReport(r)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "1px solid #333",
                    borderRadius: 12,
                    padding: 14,
                    background: "transparent",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{r.description}</div>
                  <div style={{ opacity: 0.7, marginTop: 6 }}>Type: {r.type}</div>

                  {r.created_at ? (
                    <div style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
                      Created: {new Date(r.created_at).toISOString().split("T")[0]}
                    </div>
                  ) : null}

                  <div style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
                    Click to view details →
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}