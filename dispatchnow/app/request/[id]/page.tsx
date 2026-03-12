"use client";

// app/request/[id]/page.tsx
// Request details page (load by id; show loading/not-found; show approve/deny only if permitted; update status in UI)

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/util/sidebar";

type RequestDTO = {
    id: string;
    requester_id: string;
    status: string;
    resource_type: string;
    quantity: number;
    latitude?: number | null;
    longitude?: number | null;
    description?: string | null;
    created_at: string;
    updated_at: string;
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
                    <div className="h-44 rounded-2xl bg-white/10" />
                    <div className="h-44 rounded-2xl bg-white/10" />
                </div>
            </div>
        </section>
    );
}

function NotFoundCard({ id }: { id: string }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <div className="p-8">
                <h2 className="text-2xl font-semibold">Request not found</h2>
                <p className="mt-2 text-sm text-white/60">
                    Unable to find request <span className="text-white/80">{id}</span>.
                    The ID may be invalid or you may not have access.
                </p>
                <Link
                    href="/requests-catalog"
                    className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition"
                >
                    Back to Requests
                </Link>
            </div>
        </section>
    );
}

function Pill({ label, value }: { label: string; value: string }) {
    return (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            {label}: <span className="text-white">{value}</span>
        </span>
    );
}

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();

    const id = useMemo(() => {
        const raw = (params as any)?.id;
        if (typeof raw === "string") return raw;
        if (Array.isArray(raw) && typeof raw[0] === "string") return raw[0];
        return "";
    }, [params]);

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [reqData, setReqData] = useState<RequestDTO | null>(null);

    const [canApprove, setCanApprove] = useState(false);
    const [permLoading, setPermLoading] = useState(true);

    const [action, setAction] = useState<"approve" | "deny" | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let alive = true;
        setLoading(true);
        setNotFound(false);
        setErrorMsg(null);

        (async () => {
            try {
                const res = await fetch(`/api/request/${id}`, { cache: "no-store" });
                if (!alive) return;

                if (!res.ok) {
                    setNotFound(true);
                    setReqData(null);
                    return;
                }

                const json = (await res.json()) as { data?: RequestDTO };
                if (!json?.data) {
                    setNotFound(true);
                    setReqData(null);
                    return;
                }

                setReqData(json.data);
            } catch (e: any) {
                if (!alive) return;
                setErrorMsg(e?.message ?? "Failed to load request.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    useEffect(() => {
        if (!id) return;

        let alive = true;
        setPermLoading(true);

        (async () => {
            try {
                const res = await fetch(`/api/request/${id}/approve`, {
                    method: "GET",
                    cache: "no-store",
                });

                if (!alive) return;

                if (!res.ok) {
                    setCanApprove(false);
                    return;
                }

                const json = (await res.json()) as { canApprove?: boolean };
                setCanApprove(Boolean(json?.canApprove));
            } catch {
                if (!alive) return;
                setCanApprove(false);
            } finally {
                if (!alive) return;
                setPermLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    async function doApprove(status: "approved" | "rejected") {
        if (!id) return;

        setAction(status === "approved" ? "approve" : "deny");
        setErrorMsg(null);
        setToast(null);

        try {
            const res = await fetch(`/api/request/${id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const body = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrorMsg(body?.error?.message ?? body?.message ?? body?.error ?? "Action failed.");
                return;
            }

            const updated = body?.data as RequestDTO | undefined;
            if (updated) {
                setReqData(updated);
            } else {
                // Fallback: re-fetch
                router.refresh();
                const refetch = await fetch(`/api/request/${id}`, { cache: "no-store" });
                if (refetch.ok) {
                    const j = (await refetch.json()) as { data?: RequestDTO };
                    if (j?.data) setReqData(j.data);
                }
            }

            setToast(status === "approved" ? "Request approved." : "Request denied.");
        } finally {
            setAction(null);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar activeHref="/requests-catalog" />

            <main className="pl-[84px]">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <Link
                                href="/requests-catalog"
                                className="text-sm text-white/60 hover:text-white/80 transition"
                            >
                                ← Back to Requests
                            </Link>

                            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Request</h1>
                            <p className="mt-1 text-sm text-white/60">
                                View status, audit info, and take actions if permitted.
                            </p>
                        </div>

                        {!loading && !notFound && reqData && !permLoading && canApprove && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => doApprove("approved")}
                                    disabled={action !== null}
                                    className={[
                                        "rounded-2xl border px-4 py-2 text-sm transition",
                                        "border-[#D9D9D9]/10 bg-[#8B000D] text-white hover:brightness-110",
                                        action !== null ? "opacity-40 cursor-not-allowed" : "",
                                    ].join(" ")}
                                >
                                    {action === "approve" ? "Approving..." : "Approve"}
                                </button>

                                <button
                                    onClick={() => doApprove("rejected")}
                                    disabled={action !== null}
                                    className={[
                                        "rounded-2xl border px-4 py-2 text-sm transition",
                                        "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                                        action !== null ? "opacity-40 cursor-not-allowed" : "",
                                    ].join(" ")}
                                >
                                    {action === "deny" ? "Denying..." : "Deny"}
                                </button>
                            </div>
                        )}
                    </div>

                    {errorMsg && (
                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                            {errorMsg}
                        </div>
                    )}

                    {toast && (
                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                            {toast}
                        </div>
                    )}

                    {loading ? (
                        <LoadingCard />
                    ) : notFound || !reqData ? (
                        <NotFoundCard id={id || "(missing id)"} />
                    ) : (
                        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight">Request Details</h2>
                                        <p className="mt-1 text-sm text-white/60">
                                            ID: <span className="text-white/80">{reqData.id}</span>
                                        </p>
                                    </div>

                                    <span className="inline-flex rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] px-3 py-2 text-xs text-white">
                                        {reqData.status ?? "—"}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Pill label="Status" value={reqData.status ?? "—"} />
                                    <Pill label="Resource" value={reqData.resource_type ?? "—"} />
                                    <Pill label="Quantity" value={String(reqData.quantity ?? "—")} />
                                </div>

                                <div className="mt-6 grid gap-6 md:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <h3 className="text-sm font-semibold text-white/85">Description</h3>
                                        <p className="mt-2 text-sm leading-6 text-white/70">
                                            {reqData.description ?? "—"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <h3 className="text-sm font-semibold text-white/85">Audit</h3>
                                        <div className="mt-3 space-y-2 text-sm text-white/70">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-white/55">Created</span>
                                                <span>{fmt(reqData.created_at)}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-white/55">Updated</span>
                                                <span>{fmt(reqData.updated_at)}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-white/55">Requester</span>
                                                <span className="text-white/80">{reqData.requester_id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <h3 className="text-sm font-semibold text-white/85">Location</h3>
                                    <p className="mt-2 text-sm text-white/70">
                                        Lat:{" "}
                                        <span className="text-white/80">
                                            {reqData.latitude ?? "—"}
                                        </span>
                                        {"  "} | Lng:{" "}
                                        <span className="text-white/80">
                                            {reqData.longitude ?? "—"}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <h3 className="text-sm font-semibold text-white/85">
                                        Related Items (optional)
                                    </h3>
                                    <p className="mt-2 text-sm text-white/60">
                                        If related incidents/resources exist, list them here later.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}