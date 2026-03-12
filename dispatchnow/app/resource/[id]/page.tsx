// app/resource/[id]/page.tsx
// Resource details page (load by id via API; show loading + not-found; display key fields)

import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import Sidebar from "@/util/sidebar";

type ResourceDTO = {
    id: string;
    name?: string | null;
    type?: string | null;
    category?: string | null;
    quantity?: number | null;
    location?: string | null;
    notes?: string | null;
    description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

function fmt(ts?: string | null) {
    if (!ts) return "—";
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

async function getBaseUrl() {
    // Next versions may return either a Headers object or a Promise<Headers>
    const h = await Promise.resolve(headers());
    const host = h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
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
                <h2 className="text-2xl font-semibold">Resource not found</h2>
                <p className="mt-2 text-sm text-white/60">
                    Unable to find resource <span className="text-white/80">{id}</span>.
                    The ID may be invalid or you may not have access.
                </p>
                <Link
                    href="/resource-catalog"
                    className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition"
                >
                    Back to Resources
                </Link>
            </div>
        </section>
    );
}

function Field({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-white/55">{label}</span>
            <span className="text-white/80">{value ?? "—"}</span>
        </div>
    );
}

async function ResourceDetails({ id }: { id: string }) {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/resource/${id}`, { cache: "no-store" });

    if (!res.ok) return <NotFoundCard id={id} />;

    const json = (await res.json()) as { data?: ResourceDTO };
    const r = json?.data;

    if (!r) return <NotFoundCard id={id} />;

    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Resource Details
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                            ID: <span className="text-white/80">{r.id}</span>
                        </p>
                    </div>

                    <span className="inline-flex rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] px-3 py-2 text-xs text-white">
                        Qty: {typeof r.quantity === "number" ? r.quantity : "—"}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Category: <span className="text-white">{r.category ?? "—"}</span>
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Type: <span className="text-white">{r.type ?? "—"}</span>
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        Location: <span className="text-white">{r.location ?? "—"}</span>
                    </span>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="text-sm font-semibold text-white/85">Notes</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                            {r.notes ?? r.description ?? "—"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="text-sm font-semibold text-white/85">Info</h3>
                        <div className="mt-3 space-y-2">
                            <Field label="Name" value={r.name} />
                            <Field label="Quantity" value={r.quantity} />
                            <Field label="Created" value={fmt(r.created_at)} />
                            <Field label="Updated" value={fmt(r.updated_at)} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h3 className="text-sm font-semibold text-white/85">
                        Related Items (optional)
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                        If related requests/incidents exist, list them here later.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default async function ResourcePage({
    params,
}: {
    params: { id: string } | Promise<{ id: string }>;
}) {
    const { id } = await Promise.resolve(params);

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar activeHref="/resource-catalog" />

            <main className="pl-[84px]">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    <div className="mb-6">
                        <Link
                            href="/resource-catalog"
                            className="text-sm text-white/60 hover:text-white/80 transition"
                        >
                            ← Back to Resources
                        </Link>

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            Resource
                        </h1>
                        <p className="mt-1 text-sm text-white/60">
                            View category, quantity, location, and notes.
                        </p>
                    </div>

                    <Suspense fallback={<LoadingCard />}>
                        <ResourceDetails id={id} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}