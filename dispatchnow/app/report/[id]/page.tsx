"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Report = {
    id: string;
    description: string | null;
    type: string;
    latitude: number | null;
    longitude: number | null;
    status: string;
    created_at?: string;
};

type LoadState =
    | { kind: "loading" }
    | { kind: "not_found" }
    | { kind: "error"; message: string }
    | { kind: "ready"; report: Report };

export default function ReportPage() {
    const params = useParams<{ id: string }>();
    const reportId = params?.id;

    const [state, setState] = useState<LoadState>({ kind: "loading" });

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!reportId) return;

            setState({ kind: "loading" });

            try {
                const res = await fetch(`/api/report/${reportId}`, { method: "GET" });

                if (res.status === 404) {
                    if (!cancelled) setState({ kind: "not_found" });
                    return;
                }

                const json = await res.json().catch(() => ({}));

                if (!res.ok) {
                    if (!cancelled) {
                        setState({
                            kind: "error",
                            message: json?.error ?? "Failed to load report.",
                        });
                    }
                    return;
                }

                // Expecting { report: {...} }
                const report: Report | undefined = json?.data;

                if (!report) {
                    if (!cancelled)
                        setState({ kind: "error", message: "API did not return a report." });
                    return;
                }

                if (!cancelled) setState({ kind: "ready", report });
            } catch (e: any) {
                if (!cancelled) {
                    setState({
                        kind: "error",
                        message: e?.message ?? "Unexpected error.",
                    });
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [reportId]);

    // ---------- UI states ----------
    if (state.kind === "loading") {
        return (
            <div style={{ padding: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Report</h1>
                <p style={{ marginTop: 12 }}>Loading…</p>
            </div>
        );
    }

    if (state.kind === "not_found") {
        return (
            <div style={{ padding: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Report not found</h1>
                <p style={{ marginTop: 12 }}>
                    No report exists with id: <code>{String(reportId)}</code>
                </p>
            </div>
        );
    }

    if (state.kind === "error") {
        return (
            <div style={{ padding: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Error</h1>
                <p style={{ marginTop: 12 }}>{state.message}</p>
            </div>
        );
    }

    const r = state.report;

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
                Report Details
            </h1>

            <div style={{ display: "grid", gap: 10 }}>
                <div>
                    <strong>ID:</strong> {r.id}
                </div>
                <div>
                    <strong>Status:</strong> {r.status}
                </div>
                <div>
                    <strong>Type:</strong> {r.type}
                </div>
                <div>
                    <strong>Latitude:</strong> {r.latitude ?? "N/A"}
                </div>
                <div>
                    <strong>Longitude:</strong> {r.longitude ?? "N/A"}
                </div>
                {r.created_at ? (
                    <div>
                        <strong>Created:</strong>{" "}
                        {new Date(r.created_at).toLocaleString()}
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Description</h2>
                <p style={{ lineHeight: 1.6 }}>
                    {r.description?.trim() ? r.description : "No description provided."}
                </p>
            </div>

            {/* Optional nicety: Google Maps link if lat/long exists */}
            {typeof r.latitude === "number" && typeof r.longitude === "number" ? (
                <div style={{ marginTop: 18 }}>
                    <a
                        href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "underline" }}
                    >
                        Open location in Google Maps
                    </a>
                </div>
            ) : null}
        </div>
    );
}