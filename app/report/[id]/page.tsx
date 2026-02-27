"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/util/sidebar";

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

// --- Styles & Helpers ---

const cardStyle = {
	background: "rgba(20,20,20,0.85)",
	border: "1px solid rgba(255,255,255,0.07)",
	boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const innerCardStyle = {
	background: "rgba(10,10,10,0.6)",
	border: "1px solid rgba(255,255,255,0.06)",
};

function fmt(ts?: string | null) {
	if (!ts) return "—";
	const d = new Date(ts);
	return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

// --- Subcomponents ---

function LoadingCard() {
	return (
		<div
			className="rounded-2xl overflow-hidden animate-pulse"
			style={cardStyle}
		>
			<div
				className="px-6 py-5 space-y-2"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div className="h-3 w-16 rounded bg-white/5" />
				<div className="h-7 w-56 rounded-lg bg-white/5" />
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
					Report not found
				</h2>
				<p
					className="mt-2 text-sm"
					style={{ color: "rgba(217,217,217,0.45)" }}
				>
					Unable to find report{" "}
					<span style={{ color: "rgba(217,217,217,0.8)" }}>{id}</span>
					.
				</p>
				<Link
					href="/reports"
					className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:text-white"
					style={{
						background: "rgba(255,255,255,0.04)",
						border: "1px solid rgba(255,255,255,0.08)",
						color: "rgba(217,217,217,0.6)",
					}}
				>
					← Back to Reports
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

function StatusBadge({ status }: { status?: string | null }) {
	const s = (status ?? "").toLowerCase();
	const color = s === "active" || s === "open" ? "#fd4d4d" : "#34D399";
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

// --- Main Component ---

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
				const res = await fetch(`/api/report/${reportId}`);
				if (res.status === 404) {
					if (!cancelled) setState({ kind: "not_found" });
					return;
				}
				const json = await res.json().catch(() => ({}));
				if (!res.ok) {
					if (!cancelled)
						setState({
							kind: "error",
							message: json?.error ?? "Failed to load report.",
						});
					return;
				}
				const report: Report | undefined = json?.data;
				if (!report) {
					if (!cancelled)
						setState({
							kind: "error",
							message: "API did not return a report.",
						});
					return;
				}
				if (!cancelled) setState({ kind: "ready", report });
			} catch (e: any) {
				if (!cancelled)
					setState({
						kind: "error",
						message: e?.message ?? "Unexpected error.",
					});
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [reportId]);

	return (
		<main
			className="relative min-h-screen text-[#D9D9D9]"
			style={{ background: "#090909" }}
		>
			{/* Ambient Background Effects */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					backgroundImage: `linear-gradient(rgba(253, 77, 77, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(253, 77, 77, 0.04) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
					zIndex: 0,
				}}
			/>
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
					zIndex: 1,
				}}
			/>
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

			<Sidebar activeHref="/reports" />

			<div className="relative pl-[84px]" style={{ zIndex: 10 }}>
				<div className="mx-auto max-w-4xl px-6 py-10">
					<div className="mb-8">
						<Link
							href="/reports"
							className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-white"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							← Back to Reports
						</Link>
						<h1 className="mt-4 text-4xl font-extrabold text-white tracking-tight">
							Report
						</h1>
						<p
							className="mt-1 text-sm"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							View report details and location information.
						</p>
					</div>

					{state.kind === "error" && (
						<div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
							{state.message}
						</div>
					)}

					{state.kind === "loading" && <LoadingCard />}
					{state.kind === "not_found" && (
						<NotFoundCard id={String(reportId ?? "")} />
					)}

					{state.kind === "ready" && (
						<div
							className="rounded-2xl overflow-hidden"
							style={cardStyle}
						>
							{/* Header */}
							<div
								className="flex items-start justify-between gap-4 px-6 py-5"
								style={{
									borderBottom:
										"1px solid rgba(255,255,255,0.06)",
								}}
							>
								<div>
									<p
										className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
										style={{ color: "#fd4d4d" }}
									>
										Report Info
									</p>
									<h2 className="text-2xl font-extrabold text-white tracking-tight">
										Report Details
									</h2>
									<p
										className="mt-1 text-xs"
										style={{
											color: "rgba(217,217,217,0.35)",
										}}
									>
										ID: {state.report.id}
									</p>
								</div>
								<StatusBadge status={state.report.status} />
							</div>

							{/* Pills */}
							<div
								className="flex flex-wrap gap-2 px-6 py-4"
								style={{
									borderBottom:
										"1px solid rgba(255,255,255,0.06)",
								}}
							>
								<Pill
									label="Status"
									value={state.report.status}
								/>
								<Pill label="Type" value={state.report.type} />
							</div>

							{/* Grid */}
							<div className="grid gap-4 md:grid-cols-2 p-6">
								<div
									className="rounded-xl p-5"
									style={innerCardStyle}
								>
									<h3
										className="text-[10px] font-bold uppercase tracking-widest mb-3"
										style={{
											color: "rgba(217,217,217,0.35)",
										}}
									>
										Description
									</h3>
									<p
										className="text-sm leading-6"
										style={{
											color: "rgba(217,217,217,0.7)",
										}}
									>
										{state.report.description ??
											"No description provided."}
									</p>
								</div>

								<div
									className="rounded-xl p-5"
									style={innerCardStyle}
								>
									<h3
										className="text-[10px] font-bold uppercase tracking-widest mb-3"
										style={{
											color: "rgba(217,217,217,0.35)",
										}}
									>
										Audit & Location
									</h3>
									<TimeRow
										label="Created"
										value={fmt(state.report.created_at)}
									/>
									<div className="flex justify-between gap-4 text-sm py-2.5">
										<span
											style={{
												color: "rgba(217,217,217,0.35)",
											}}
										>
											Coordinates
										</span>
										<span
											style={{
												color: "rgba(217,217,217,0.8)",
											}}
										>
											{state.report.latitude?.toFixed(4)},{" "}
											{state.report.longitude?.toFixed(4)}
										</span>
									</div>
								</div>
							</div>

							{/* Map Action */}
							{state.report.latitude && (
								<div
									className="mx-6 mb-6 rounded-xl p-5"
									style={innerCardStyle}
								>
									<h3
										className="text-[10px] font-bold uppercase tracking-widest mb-2"
										style={{
											color: "rgba(217,217,217,0.35)",
										}}
									>
										Mapping
									</h3>
									<a
										href={`https://www.google.com/maps?q=${state.report.latitude},${state.report.longitude}`}
										target="_blank"
										rel="noreferrer"
										className="text-sm font-semibold transition-colors hover:text-white"
										style={{ color: "#fd4d4d" }}
									>
										View on Google Maps →
									</a>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
