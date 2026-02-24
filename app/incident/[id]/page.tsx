// app/incident/[id]/page.tsx
// Single Incident details page (load by id; show loading + not-found; display status/severity/description/timestamps)

import { Suspense } from "react";
import Link from "next/link";
import Sidebar from "@/util/sidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type IncidentRow = {
    id: string;
    status?: string | null;
    type?: string | null;
    description?: string | null;
    severity?: string | number | null;
    priority?: string | number | null;
    created_at?: string | null;
    updated_at?: string | null;
    closed_at?: string | null;
};

function fmt(ts?: string | null) {
    if (!ts) return "—";
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function LoadingCard() {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <div className="p-6">
                <div className="h-6 w-64 rounded-xl bg-white/10" />
                <div className="mt-4 flex gap-3">
                    <div className="h-7 w-32 rounded-full bg-white/10" />
                    <div className="h-7 w-32 rounded-full bg-white/10" />
                    <div className="h-7 w-32 rounded-full bg-white/10" />
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="h-40 rounded-2xl bg-white/10" />
                    <div className="h-40 rounded-2xl bg-white/10" />
                </div>
            </div>
        </section>
    );
}

function NotFoundCard({ id }: { id: string }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <div className="p-8">
                <h2 className="text-2xl font-semibold">Incident not found</h2>
                <p className="mt-2 text-sm text-white/60">
                    Unable to find incident{" "}
                    <span className="text-white/80">{id}</span>. The ID may be invalid or
                    you may not have access.
                </p>

                <Link
                    href="/incidents-catalog"
                    className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition"
                >
                    Back to Incidents
                </Link>
            </div>
        </section>
    );
}

async function IncidentDetails({ id }: { id: string }) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("id", id)
        .single();

    const incident = data as IncidentRow | null;

    if (error || !incident) {
        return <NotFoundCard id={id} />;
    }

    // Some schemas use `priority` instead of `severity`
    const severity = incident.severity ?? incident.priority ?? "—";

    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Incident Details
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                            ID: <span className="text-white/80">{incident.id}</span>
                        </p>
                    </div>

                    <span className="inline-flex rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] px-3 py-2 text-xs text-white">
                        {incident.status ?? "—"}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Status: <span className="text-white">{incident.status ?? "—"}</span>
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Severity: <span className="text-white">{String(severity)}</span>
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Type: <span className="text-white">{incident.type ?? "—"}</span>
                    </span>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="text-sm font-semibold text-white/85">Description</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                            {incident.description ?? "—"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="text-sm font-semibold text-white/85">Timestamps</h3>
                        <div className="mt-3 space-y-2 text-sm text-white/70">
                            <div className="flex justify-between gap-4">
                                <span className="text-white/55">Created</span>
                                <span>{fmt(incident.created_at)}</span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-white/55">Updated</span>
                                <span>{fmt(incident.updated_at)}</span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-white/55">Closed</span>
                                <span>{fmt(incident.closed_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h3 className="text-sm font-semibold text-white/85">
                        Related Items (optional)
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                        If linked reports/requests/resources exist, you can list them here
                        later.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default async function IncidentPage({
    params,
}: {
    params: { id: string } | Promise<{ id: string }>;
}) {
    const { id } = await Promise.resolve(params);

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar activeHref="/incidents-catalog" />

            <main className="pl-[84px]">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    <div className="mb-6">
                        <Link
                            href="/incidents-catalog"
                            className="text-sm text-white/60 hover:text-white/80 transition"
                        >
                            ← Back to Incidents
                        </Link>

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            Incident
                        </h1>

                        <p className="mt-1 text-sm text-white/60">
                            View status, severity, description, and timestamps.
                        </p>
                    </div>

                    <Suspense fallback={<LoadingCard />}>
                        <IncidentDetails id={id} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}