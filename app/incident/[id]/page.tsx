// app/incident/[id]/page.tsx

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

const cardStyle = {
	background: "rgba(20,20,20,0.85)",
	border: "1px solid rgba(255,255,255,0.07)",
	boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const innerCardStyle = {
	background: "rgba(10,10,10,0.6)",
	border: "1px solid rgba(255,255,255,0.06)",
};

function LoadingCard() {
	return (
		<div
			className="rounded-2xl overflow-hidden animate-pulse"
			style={cardStyle}
		>
			<div
				className="px-6 py-5 flex items-start justify-between gap-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div className="space-y-2">
					<div
						className="h-3 w-16 rounded"
						style={{ background: "rgba(255,255,255,0.06)" }}
					/>
					<div
						className="h-7 w-56 rounded-lg"
						style={{ background: "rgba(255,255,255,0.06)" }}
					/>
					<div
						className="h-3 w-32 rounded"
						style={{ background: "rgba(255,255,255,0.04)" }}
					/>
				</div>
				<div
					className="h-8 w-24 rounded-full"
					style={{ background: "rgba(253,77,77,0.08)" }}
				/>
			</div>
			<div
				className="flex gap-2 px-6 py-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div
					className="h-7 w-28 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
				<div
					className="h-7 w-24 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
				<div
					className="h-7 w-20 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
			</div>
			<div className="grid gap-4 md:grid-cols-2 p-6">
				<div className="h-40 rounded-xl" style={innerCardStyle} />
				<div className="h-40 rounded-xl" style={innerCardStyle} />
			</div>
		</div>
	);
}

function NotFoundCard({ id }: { id: string }) {
	return (
		<div className="rounded-2xl overflow-hidden" style={cardStyle}>
			<div className="p-8">
				<p
					className="text-[10px] font-bold uppercase tracking-widest mb-3"
					style={{ color: "#fd4d4d" }}
				>
					Not Found
				</p>
				<h2 className="text-2xl font-extrabold text-white tracking-tight">
					Incident not found
				</h2>
				<p
					className="mt-2 text-sm"
					style={{ color: "rgba(217,217,217,0.45)" }}
				>
					Unable to find incident{" "}
					<span style={{ color: "rgba(217,217,217,0.8)" }}>{id}</span>
					. The ID may be invalid or you may not have access.
				</p>
				<Link
					href="/incidents-catalog"
					className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:text-white"
					style={{
						background: "rgba(255,255,255,0.04)",
						border: "1px solid rgba(255,255,255,0.08)",
						color: "rgba(217,217,217,0.6)",
					}}
				>
					← Back to Incidents
				</Link>
			</div>
		</div>
	);
}

function Pill({ label, value }: { label: string; value?: string | null }) {
	return (
		<span
			className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
			style={{
				background: "rgba(255,255,255,0.04)",
				border: "1px solid rgba(255,255,255,0.08)",
			}}
		>
			<span style={{ color: "rgba(217,217,217,0.3)" }}>{label}</span>
			<span style={{ color: "rgba(217,217,217,0.85)" }}>
				{value ?? "—"}
			</span>
		</span>
	);
}

function TimeRow({ label, value }: { label: string; value: string }) {
	return (
		<div
			className="flex justify-between gap-4 text-sm py-2.5"
			style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
		>
			<span style={{ color: "rgba(217,217,217,0.35)" }}>{label}</span>
			<span style={{ color: "rgba(217,217,217,0.8)" }}>{value}</span>
		</div>
	);
}

function StatusBadge({ status }: { status?: string | null }) {
	const s = (status ?? "").toLowerCase();
	const isActive = s === "active" || s === "open";
	const isResolved = s === "resolved" || s === "closed";
	const color = isActive ? "#fd4d4d" : isResolved ? "#34D399" : "#FF9F1A";
	return (
		<span
			className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shrink-0"
			style={{
				color,
				background: `${color}14`,
				border: `1px solid ${color}30`,
			}}
		>
			<span
				className="w-1.5 h-1.5 rounded-full"
				style={{ background: color }}
			/>
			{status ?? "—"}
		</span>
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

	if (error || !incident) return <NotFoundCard id={id} />;

	const severity = incident.severity ?? incident.priority ?? "—";

	return (
		<div className="rounded-2xl overflow-hidden" style={cardStyle}>
			{/* Header */}
			<div
				className="flex items-start justify-between gap-4 px-6 py-5"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div>
					<p
						className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
						style={{ color: "#fd4d4d" }}
					>
						Incident
					</p>
					<h2 className="text-2xl font-extrabold text-white tracking-tight">
						Incident Details
					</h2>
					<p
						className="mt-1 text-xs"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						ID: {incident.id}
					</p>
				</div>
				<StatusBadge status={incident.status} />
			</div>

			{/* Pills */}
			<div
				className="flex flex-wrap gap-2 px-6 py-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<Pill label="Status" value={incident.status} />
				<Pill label="Severity" value={String(severity)} />
				<Pill label="Type" value={incident.type} />
			</div>

			{/* Detail grid */}
			<div className="grid gap-4 md:grid-cols-2 p-6">
				<div className="rounded-xl p-5" style={innerCardStyle}>
					<h3
						className="text-[10px] font-bold uppercase tracking-widest mb-3"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						Description
					</h3>
					<p
						className="text-sm leading-6"
						style={{ color: "rgba(217,217,217,0.7)" }}
					>
						{incident.description ?? "No description provided."}
					</p>
				</div>

				<div className="rounded-xl p-5" style={innerCardStyle}>
					<h3
						className="text-[10px] font-bold uppercase tracking-widest mb-3"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						Timestamps
					</h3>
					<TimeRow label="Created" value={fmt(incident.created_at)} />
					<TimeRow label="Updated" value={fmt(incident.updated_at)} />
					<TimeRow label="Closed" value={fmt(incident.closed_at)} />
				</div>
			</div>

			{/* Related */}
			<div className="mx-6 mb-6 rounded-xl p-5" style={innerCardStyle}>
				<h3
					className="text-[10px] font-bold uppercase tracking-widest mb-2"
					style={{ color: "rgba(217,217,217,0.35)" }}
				>
					Related Items
				</h3>
				<p
					className="text-sm"
					style={{ color: "rgba(217,217,217,0.3)" }}
				>
					If linked reports, requests, or resources exist, they will
					appear here.
				</p>
			</div>
		</div>
	);
}

export default async function IncidentPage({
	params,
}: {
	params: { id: string } | Promise<{ id: string }>;
}) {
	const { id } = await Promise.resolve(params);

	return (
		<main
			className="relative min-h-screen text-[#D9D9D9]"
			style={{ background: "#090909" }}
		>
			{/* Grid texture */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					backgroundImage: `
                        linear-gradient(rgba(253, 77, 77, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(253, 77, 77, 0.04) 1px, transparent 1px)
                    `,
					backgroundSize: "60px 60px",
					zIndex: 0,
				}}
			/>
			{/* Vignette */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
					zIndex: 1,
				}}
			/>
			{/* Red glow */}
			<div
				className="pointer-events-none fixed"
				style={{
					top: "-15%",
					right: "5%",
					width: "45%",
					height: "55%",
					background:
						"radial-gradient(circle, rgba(253,77,77,0.07) 0%, transparent 70%)",
					zIndex: 1,
				}}
			/>

			<Sidebar activeHref="/incidents-catalog" />

			<div className="relative pl-[84px]" style={{ zIndex: 10 }}>
				<div className="mx-auto max-w-4xl px-6 py-10">
					<div className="mb-8">
						<Link
							href="/incidents-catalog"
							className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-white"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							← Back to Incidents
						</Link>
						<h1 className="mt-4 text-4xl font-extrabold text-white tracking-tight">
							Incident
						</h1>
						<p
							className="mt-1 text-sm"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							View status, severity, description, and timestamps.
						</p>
					</div>

					<Suspense fallback={<LoadingCard />}>
						<IncidentDetails id={id} />
					</Suspense>
				</div>
			</div>
		</main>
	);
}
