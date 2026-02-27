import React from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/util/sidebar";

// --- Configuration & Constants ---
const REPORTS_TABLE = "reports";
const REQUESTS_TABLE = "requests";
const RESOURCES_TABLE = "resources";
const CHART_DAYS = 30;
const SIDEBAR_W = 84;

// --- Types ---
type ReportRow = { id: string; created_at: string; type: string | null };
type RequestRow = {
	id: string;
	created_at: string;
	resource_type: string | null;
	quantity: number | null;
};
type ResourceRow = {
	id: string;
	name: string | null;
	type: string | null;
	quantity: number | null;
	updated_at: string | null;
};

// --- Helper Functions ---
function getSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anon) throw new Error("Missing Supabase env vars.");
	return createClient(url, anon, { auth: { persistSession: false } });
}

function toDateKeyLocal(d: Date) {
	return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function addDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

// --- Internal Sub-components (Themed) ---
function StatBox({
	label,
	value,
	subtext,
}: {
	label: string;
	value: number | string;
	subtext?: string;
}) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center rounded-2xl py-6 text-center transition-all duration-200"
			style={{
				border: "1px solid rgba(253,77,77,0.14)",
				background: "rgba(253,77,77,0.05)",
			}}
		>
			<span
				className="text-4xl font-black tracking-tighter"
				style={{
					color: "#fd4d4d",
					textShadow: "0 0 20px rgba(253,77,77,0.4)",
				}}
			>
				{value}
			</span>
			<span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40">
				{label}
			</span>
			{subtext && (
				<span className="mt-1 text-[9px] text-[#D9D9D9]/20">
					{subtext}
				</span>
			)}
		</div>
	);
}

function GlassCard({
	title,
	subtitle,
	children,
	right,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	right?: React.ReactNode;
}) {
	return (
		<div
			className="flex flex-col overflow-hidden rounded-2xl"
			style={{
				background: "rgba(20,20,20,0.85)",
				border: "1px solid rgba(255,255,255,0.07)",
				boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
			}}
		>
			<div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
				<div>
					<p className="text-sm font-semibold text-[#D9D9D9]">
						{title}
					</p>
					{subtitle && (
						<p className="text-[10px] text-[#D9D9D9]/30 uppercase tracking-wider mt-0.5">
							{subtitle}
						</p>
					)}
				</div>
				{right}
			</div>
			<div className="flex-1 p-6">{children}</div>
		</div>
	);
}

// --- Main Component ---
export default async function AnalyticsPage() {
	const now = new Date();
	const chartStartDay = addDays(now, -(CHART_DAYS - 1));
	chartStartDay.setHours(0, 0, 0, 0);

	let reportsTotal = 0,
		requestsTotal = 0,
		resourcesAll: ResourceRow[] = [];
	let reportChartRows: { created_at: string }[] = [];
	let requestChartRows: RequestRow[] = [];

	try {
		const supabase = getSupabase();
		const results = await Promise.all([
			supabase
				.from(REPORTS_TABLE)
				.select("id", { count: "exact", head: true }),
			supabase
				.from(REQUESTS_TABLE)
				.select("id", { count: "exact", head: true }),
			supabase
				.from(RESOURCES_TABLE)
				.select("*")
				.order("updated_at", { ascending: false }),
			supabase
				.from(REPORTS_TABLE)
				.select("created_at")
				.gte("created_at", chartStartDay.toISOString()),
			supabase
				.from(REQUESTS_TABLE)
				.select("id, created_at, resource_type, quantity")
				.gte("created_at", chartStartDay.toISOString()),
		]);

		reportsTotal = results[0].count || 0;
		requestsTotal = results[1].count || 0;
		resourcesAll = results[2].data || [];
		reportChartRows = results[3].data || [];
		requestChartRows = (results[4].data as RequestRow[]) || [];
	} catch (e) {
		console.error(e);
	}

	// Derived Calculations
	const dayKeys: string[] = [];
	for (let i = 0; i < CHART_DAYS; i++)
		dayKeys.push(toDateKeyLocal(addDays(chartStartDay, i)));

	const reportsPerDay = new Map(dayKeys.map((k) => [k, 0]));
	reportChartRows.forEach((row) => {
		const k = toDateKeyLocal(new Date(row.created_at));
		if (reportsPerDay.has(k))
			reportsPerDay.set(k, reportsPerDay.get(k)! + 1);
	});
	const maxReport = Math.max(1, ...Array.from(reportsPerDay.values()));

	return (
		<main
			className="relative h-screen overflow-hidden text-[#D9D9D9]"
			style={{ background: "#090909" }}
		>
			{/* Background Textures */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"linear-gradient(rgba(253, 77, 77, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(253, 77, 77, 0.04) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
				}}
			/>

			<Sidebar activeHref="/analytics" />

			<div
				className="absolute bottom-0 right-0 top-0 flex flex-col gap-4 p-5 overflow-y-auto"
				style={{ left: SIDEBAR_W, zIndex: 10 }}
			>
				{/* Header */}
				<header
					className="flex shrink-0 items-center justify-between gap-4 rounded-2xl px-7 py-5"
					style={{
						background: "rgba(20,20,20,0.85)",
						border: "1px solid rgba(255,255,255,0.07)",
						boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
					}}
				>
					<div>
						<span
							className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fd4d4d]"
							style={{
								background: "rgba(253,77,77,0.1)",
								border: "1px solid rgba(253,77,77,0.2)",
							}}
						>
							System Telemetry
						</span>
						<h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
							Analytics Overview
						</h1>
					</div>
					<div className="text-right">
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/20">
							Last Sync
						</p>
						<p className="text-sm font-mono text-[#fd4d4d]">
							{now.toLocaleTimeString()}
						</p>
					</div>
				</header>

				{/* Top Stats */}
				<div className="grid grid-cols-4 gap-4 shrink-0">
					<StatBox
						label="Total Reports"
						value={reportsTotal.toLocaleString()}
					/>
					<StatBox
						label="Active Requests"
						value={requestsTotal.toLocaleString()}
					/>
					<StatBox
						label="Inventory Items"
						value={resourcesAll.length}
					/>
					<StatBox label="Days Tracked" value={CHART_DAYS} />
				</div>

				{/* Charts Grid */}
				<div
					className="grid flex-1 gap-4"
					style={{ gridTemplateColumns: "1.5fr 1fr" }}
				>
					<GlassCard
						title="Report Velocity"
						subtitle="Daily Volume (Last 30 Days)"
					>
						<div className="flex h-56 items-end gap-1.5 pt-12">
							{" "}
							{/* Increased height & padding for tooltip space */}
							{dayKeys.map((k) => {
								const value = reportsPerDay.get(k) || 0;
								const heightPercent = (value / maxReport) * 100;

								return (
									<div
										key={k}
										className="group relative flex-1 h-full flex flex-col justify-end"
									>
										{/* Enhanced HUD Tooltip */}
										<div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:-top-14">
											<div className="flex flex-col items-center">
												<span className="text-2xl font-black text-white leading-none tracking-tighter">
													{value}
												</span>
												<span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#fd4d4d]">
													Reports
												</span>
												{/* Pointy indicator */}
												<div className="w-px h-4 bg-[#fd4d4d] mt-1" />
											</div>
										</div>

										{/* The Bar: Solid Matte with High-Contrast Header */}
										<div
											className="w-full transition-all duration-200 ease-in-out group-hover:bg-[#fd4d4d]"
											style={{
												height: `${heightPercent}%`,
												background:
													value > 0
														? "rgba(253, 77, 77, 0.4)"
														: "rgba(255,255,255,0.03)",
												borderTop:
													value > 0
														? "2px solid #fd4d4d"
														: "none",
												position: "relative",
											}}
										>
											{/* Subtle Hover State Fill */}
											<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#fd4d4d] transition-opacity" />
										</div>
									</div>
								);
							})}
						</div>

						<div className="mt-6 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9D9D9]/20 border-t border-white/[0.03] pt-4">
							<span>{dayKeys[0]}</span>
							<span className="text-[#D9D9D9]/10">
								Terminal Metric Stream
							</span>
							<span>Today</span>
						</div>
					</GlassCard>

					<GlassCard
						title="Inventory Distribution"
						subtitle="Stock levels per category"
					>
						<div className="space-y-4">
							{resourcesAll.slice(0, 5).map((r) => (
								<div key={r.id}>
									<div className="mb-1 flex justify-between text-[11px] font-semibold">
										<span className="text-[#D9D9D9]/70">
											{r.name}
										</span>
										<span
											style={{
												color:
													(r.quantity || 0) < 5
														? "#fd4d4d"
														: "#D9D9D9",
											}}
										>
											{r.quantity}
										</span>
									</div>
									<div className="h-1 w-full rounded-full bg-white/[0.03]">
										<div
											className="h-full rounded-full"
											style={{
												width: `${Math.min(100, (r.quantity || 0) * 2)}%`,
												background:
													(r.quantity || 0) < 5
														? "#fd4d4d"
														: "rgba(253,77,77,0.4)",
											}}
										/>
									</div>
								</div>
							))}
							<Link
								href="/resource-catalog"
								className="mt-4 block text-center text-[10px] font-bold uppercase tracking-widest text-[#fd4d4d] hover:underline"
							>
								View full catalog
							</Link>
						</div>
					</GlassCard>
				</div>

				{/* Bottom Row */}
				<GlassCard
					title="System Resources"
					subtitle="Latest Inventory Updates"
				>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs">
							<thead>
								<tr className="border-b border-white/[0.06] text-[#D9D9D9]/30">
									<th className="pb-3 pl-2 font-bold uppercase tracking-widest">
										Resource
									</th>
									<th className="pb-3 font-bold uppercase tracking-widest">
										Type
									</th>
									<th className="pb-3 font-bold uppercase tracking-widest">
										Quantity
									</th>
									<th className="pb-3 font-bold uppercase tracking-widest">
										Last Updated
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/[0.04]">
								{resourcesAll.slice(0, 6).map((r) => (
									<tr
										key={r.id}
										className="group hover:bg-white/[0.02]"
									>
										<td className="py-3 pl-2 font-semibold text-[#D9D9D9]">
											{r.name}
										</td>
										<td className="py-3 text-[#D9D9D9]/40">
											{r.type}
										</td>
										<td
											className="py-3 font-mono"
											style={{
												color:
													(r.quantity || 0) < 5
														? "#fd4d4d"
														: "#34D399",
											}}
										>
											{r.quantity}
										</td>
										<td className="py-3 text-[#D9D9D9]/20">
											{r.updated_at
												? new Date(
														r.updated_at,
													).toLocaleDateString()
												: "-"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</GlassCard>

				<footer className="py-4 text-center">
					<p
						className="text-[11px] font-bold uppercase tracking-[0.2em]"
						style={{ color: "rgba(253,77,77,0.25)" }}
					>
						DispatchNow • Telemetry Unit 01
					</p>
				</footer>
			</div>
		</main>
	);
}
