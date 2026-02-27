import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import Sidebar from "@/util/sidebar";
import GlobalSearch from "./GlobalSearch";

type ReportRow = {
	id: string;
	description: string | null;
	type: string | null;
	status: string | null;
	created_at: string | null;
};

type IncidentRow = {
	id: string;
	title: string | null;
	status: string | null;
	created_at: string | null;
};

type RequestRow = {
	id: string;
};

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
	const tierText =
		tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";
	const color = tier === 1 ? "#34D399" : tier === 2 ? "#FF9F1A" : "#fd4d4d";
	return (
		<span
			className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
			style={{
				color,
				background: `${color}14`,
				border: `1px solid ${color}30`,
			}}
		>
			{tierText}
		</span>
	);
}

function PillButton({
	children,
	href,
	variant = "ghost",
}: {
	children: React.ReactNode;
	href?: string;
	variant?: "ghost" | "red";
}) {
	const cls = [
		"inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
		variant === "red"
			? "border-[#fd4d4d]/40 bg-[#fd4d4d]/10 text-[#fd4d4d] hover:bg-[#fd4d4d]/20 hover:border-[#fd4d4d]/60"
			: "border-white/10 bg-white/5 text-[#D9D9D9]/70 hover:bg-white/10 hover:text-white",
	].join(" ");
	return href ? (
		<Link href={href} className={cls}>
			{children}
		</Link>
	) : (
		<button type="button" className={cls}>
			{children}
		</button>
	);
}

function WideButton({
	children,
	href,
	variant = "ghost",
}: {
	children: React.ReactNode;
	href?: string;
	variant?: "ghost" | "red";
}) {
	const cls = [
		"flex w-full items-center justify-center rounded-xl border px-2 py-3 text-xs font-semibold transition-all duration-200",
		variant === "red"
			? "border-[#fd4d4d]/30 bg-[#fd4d4d]/10 text-[#fd4d4d] hover:bg-[#fd4d4d]/20 hover:border-[#fd4d4d]/50"
			: "border-white/[0.14] bg-white/[0.04] text-[#D9D9D9]/70 hover:bg-white/[0.08] hover:text-white",
	].join(" ");
	return href ? (
		<Link href={href} className={cls}>
			{children}
		</Link>
	) : (
		<button type="button" className={cls}>
			{children}
		</button>
	);
}

function CardHeader({
	title,
	subtitle,
	right,
}: {
	title: string;
	subtitle?: string;
	right?: React.ReactNode;
}) {
	return (
		<div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.12] px-6 py-4">
			<div>
				<p className="text-sm font-semibold text-[#D9D9D9]">{title}</p>
				{subtitle && (
					<p className="mt-0.5 text-xs text-[#D9D9D9]/35">
						{subtitle}
					</p>
				)}
			</div>
			{right && <div className="shrink-0">{right}</div>}
		</div>
	);
}

function StatBox({ label, value }: { label: string; value: number | string }) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center rounded-xl py-4 text-center transition-all duration-200 hover:bg-[#fd4d4d]/[0.06]"
			style={{
				border: "1px solid rgba(253,77,77,0.14)",
				background: "rgba(253,77,77,0.10)",
			}}
		>
			<span
				className="text-3xl font-extrabold"
				style={{
					color: "#fd4d4d",
					textShadow: "0 0 20px rgba(253,77,77,0.4)",
				}}
			>
				{value}
			</span>
			<span className="mt-1 text-xs text-[#D9D9D9]/40">{label}</span>
		</div>
	);
}

function ReportSquare({
	title,
	type,
	date,
}: {
	title: string;
	type: string;
	date: string;
}) {
	return (
		<div
			className="flex flex-col justify-between rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.04]"
			style={{
				border: "1px solid rgba(255,255,255,0.07)",
				background: "rgba(20,20,20,0.85)",
			}}
		>
			<div>
				<p
					className="text-[10px] font-bold uppercase tracking-widest"
					style={{ color: "#fd4d4d" }}
				>
					{type}
				</p>
				<p className="mt-1 text-sm font-semibold text-[#D9D9D9] leading-snug">
					{title}
				</p>
			</div>
			<p className="mt-3 text-xs text-[#D9D9D9]/35">{date}</p>
		</div>
	);
}

function formatDate(ts: string | null) {
	if (!ts) return "";
	const d = new Date(ts);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default async function AuthorityDashboardPage() {
	const SIDEBAR_W = 84;
	const supabase = await createSupabaseServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) notFound();

	const { data: profile, error: profileErr } = await supabase
		.from("profiles")
		.select("username, tier")
		.eq("id", user.id)
		.maybeSingle();

	if (profileErr) throw new Error(profileErr.message);

	const username = profile?.username ?? user.email?.split("@")[0] ?? "user";
	const tier = (profile?.tier ?? 1) as 1 | 2 | 3;

	const [
		{ data: reportsRaw, error: reportsErr },
		{ data: incidentsRaw, error: incidentsErr },
		{ data: requestsRaw, error: requestsErr },
	] = await Promise.all([
		supabase
			.from("reports")
			.select("id,description,type,status,created_at")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false })
			.limit(2),
		supabase
			.from("incidents")
			.select("id,title,status,created_at")
			.eq("created_by", user.id)
			.order("created_at", { ascending: false }),
		supabase.from("requests").select("id").eq("requester_id", user.id),
	]);

	if (reportsErr) throw new Error(reportsErr.message);
	if (incidentsErr) throw new Error(incidentsErr.message);
	if (requestsErr) throw new Error(requestsErr.message);

	const reports = (reportsRaw as ReportRow[]) ?? [];
	const incidents = (incidentsRaw as IncidentRow[]) ?? [];
	const requests = (requestsRaw as RequestRow[]) ?? [];

	const recentReports = reports.slice(0, 2).map((r) => ({
		title: r.description ?? r.type ?? "Report",
		type: r.type ?? "report",
		date: formatDate(r.created_at),
	}));

	return (
		<main
			className="relative h-screen overflow-hidden text-[#D9D9D9]"
			style={{ background: "#090909" }}
		>
			{/* Landing-page grid texture */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage: `
						linear-gradient(rgba(253, 77, 77, 0.04) 1px, transparent 1px),
						linear-gradient(90deg, rgba(253, 77, 77, 0.04) 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
					zIndex: 0,
				}}
			/>
			{/* Radial vignette over grid */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
					zIndex: 1,
				}}
			/>
			{/* Red glow top-right */}
			<div
				className="pointer-events-none absolute"
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

			<Sidebar activeHref="/dashboard" />

			<div
				className="absolute bottom-0 right-0 top-0 flex flex-col gap-4 p-5"
				style={{ left: SIDEBAR_W, zIndex: 10 }}
			>
				{/* Header */}
				<header
					className="flex shrink-0 items-center justify-between gap-4 rounded-2xl px-7 py-5"
					style={{
						background: "rgba(20,20,20,0.85)",
						border: "1px solid rgba(255,255,255,0.07)",
						boxShadow:
							"0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
					}}
				>
					<div>
						<div className="mb-2">
							<TierBadge tier={tier} />
						</div>
						<h1 className="text-3xl font-extrabold text-white tracking-tight">
							My Activity
						</h1>
						<p className="mt-1 text-sm text-[#D9D9D9]/35">
							@{username}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<GlobalSearch />
						<PillButton href={`/profile/${username}`}>
							View Profile
						</PillButton>
						<PillButton href="/report/new" variant="red">
							Create Report
						</PillButton>
					</div>
				</header>

				{/* Grid */}
				<div
					className="grid min-h-0 flex-1 gap-4"
					style={{
						gridTemplateColumns: "1fr 1fr",
						gridTemplateRows: "1fr 1fr",
					}}
				>
					{/* Quick Actions */}
					<div
						className="flex flex-col overflow-hidden rounded-2xl"
						style={{
							background: "rgba(20,20,20,0.85)",
							border: "1px solid rgba(255,255,255,0.07)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
						}}
					>
						<CardHeader
							title="Quick Actions"
							subtitle="Common things you'll do as an Authority."
							right={
								<PillButton href="/dashboard/authority/shortcuts">
									Shortcuts
								</PillButton>
							}
						/>
						<div
							className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-6"
							style={{ gridAutoRows: "1fr" }}
						>
							<WideButton href="/report/new" variant="red">
								Create report
							</WideButton>
							<WideButton href="/incidents-catalog">
								Browse incidents
							</WideButton>
							<WideButton href="/reports-catalog">
								Browse reports
							</WideButton>
							<WideButton href="/resource-catalog">
								Browse resources
							</WideButton>
						</div>
					</div>

					{/* Recent Reports */}
					<div
						className="flex flex-col overflow-hidden rounded-2xl"
						style={{
							background: "rgba(20,20,20,0.85)",
							border: "1px solid rgba(255,255,255,0.07)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
						}}
					>
						<CardHeader
							title="Recent Reports"
							subtitle="Your latest submissions."
							right={
								<PillButton href="/reports-catalog">
									See all
								</PillButton>
							}
						/>
						<div className="grid flex-1 grid-cols-2 gap-4 p-6">
							{recentReports[0] ? (
								<ReportSquare
									title={recentReports[0].title}
									type={recentReports[0].type}
									date={recentReports[0].date}
								/>
							) : (
								<Link
									href="/report/new"
									className="flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/[0.04]"
									style={{
										border: "1px solid rgba(255,255,255,0.07)",
										background: "rgba(20,20,20,0.85)",
									}}
								>
									<p className="text-sm font-semibold text-[#D9D9D9]">
										Create Report
									</p>
									<p className="mt-1 text-xs text-[#D9D9D9]/35">
										Submit your first report
									</p>
								</Link>
							)}
							{recentReports[1] ? (
								<ReportSquare
									title={recentReports[1].title}
									type={recentReports[1].type}
									date={recentReports[1].date}
								/>
							) : recentReports[0] ? (
								<Link
									href="/report/new"
									className="flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/[0.04]"
									style={{
										border: "1px solid rgba(255,255,255,0.07)",
										background: "rgba(20,20,20,0.85)",
									}}
								>
									<p className="text-sm font-semibold text-[#D9D9D9]">
										Create Report
									</p>
									<p className="mt-1 text-xs text-[#D9D9D9]/35">
										Submit another report
									</p>
								</Link>
							) : (
								<div
									className="rounded-xl"
									style={{
										border: "1px solid rgba(255,255,255,0.07)",
										background: "rgba(15,15,15,0.7)",
									}}
								/>
							)}
						</div>
					</div>

					{/* Status */}
					<div
						className="flex flex-col overflow-hidden rounded-2xl"
						style={{
							background: "rgba(20,20,20,0.85)",
							border: "1px solid rgba(255,255,255,0.07)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
						}}
					>
						<CardHeader
							title="Status"
							subtitle="Your recent activity summary."
						/>
						<div className="flex flex-1 gap-4 overflow-y-auto p-6">
							<StatBox
								label="My reports"
								value={reports.length}
							/>
							<StatBox
								label="My incidents"
								value={incidents.length}
							/>
							<StatBox label="Requests" value={requests.length} />
						</div>
					</div>

					{/* Nearby Incidents */}
					<div
						className="flex flex-col overflow-hidden rounded-2xl"
						style={{
							background: "rgba(20,20,20,0.85)",
							border: "1px solid rgba(255,255,255,0.07)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
						}}
					>
						<CardHeader
							title="Nearby Incidents"
							subtitle="Quick peek at what's active."
							right={
								<PillButton href="/incidents-catalog">
									Open
								</PillButton>
							}
						/>
						<div className="flex flex-1 flex-col overflow-y-auto p-6">
							<div
								className="flex flex-1 flex-col items-center justify-center rounded-xl p-6 text-center"
								style={{
									border: "1px solid rgba(255,255,255,0.07)",
									background: "rgba(15,15,15,0.7)",
								}}
							>
								<p className="text-sm font-semibold text-[#D9D9D9]/50">
									None pinned
								</p>
								<p className="mt-1.5 text-xs text-[#D9D9D9]/30">
									Browse the catalog to view details.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<p
					className="shrink-0 text-center text-[11px]"
					style={{ color: "rgba(253,77,77,0.25)" }}
				>
					DispatchNow • Authority dashboard
				</p>
			</div>
		</main>
	);
}
