"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/util/sidebar";
import { ReportType, ReportStatus } from "@/lib/types";
import {
	FiSearch,
	FiMapPin,
	FiClock,
	FiAlertTriangle,
	FiChevronRight,
	FiFilter,
	FiX,
	FiPlus,
} from "react-icons/fi";

interface Report {
	id: string;
	description?: string;
	type: ReportType;
	latitude?: number;
	longitude?: number;
	status: ReportStatus;
	user_id: string;
	created_at: string;
	updated_at: string;
}

interface Meta {
	total: number;
	limit: number;
	offset: number;
}

const STATUS_COLORS: Record<
	ReportStatus,
	{ bg: string; text: string; dot: string }
> = {
	[ReportStatus.Unverified]: {
		bg: "bg-yellow-500/10",
		text: "text-yellow-400",
		dot: "bg-yellow-400",
	},
	[ReportStatus.Verified]: {
		bg: "bg-blue-500/10",
		text: "text-blue-400",
		dot: "bg-blue-400",
	},
	[ReportStatus.Resolved]: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-400",
		dot: "bg-emerald-400",
	},
	[ReportStatus.Rejected]: {
		bg: "bg-neutral-500/10",
		text: "text-neutral-400",
		dot: "bg-neutral-400",
	},
};

const TYPE_ICONS: Record<ReportType, string> = {
	[ReportType.Pothole]: "🕳️",
	[ReportType.Flooding]: "🌊",
	[ReportType.Debris]: "🪨",
	[ReportType.Accident]: "🚨",
	[ReportType.Other]: "⚠️",
};

function formatRelativeTime(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	return `${days}d ago`;
}

function formatCoords(lat?: number, lng?: number) {
	if (lat == null || lng == null) return "Location unknown";
	return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function ReportCard({
	report,
	onClick,
}: {
	report: Report;
	onClick: () => void;
}) {
	const status = STATUS_COLORS[report.status];
	const icon = TYPE_ICONS[report.type];

	return (
		<button
			onClick={onClick}
			className="group w-full text-left bg-[#111111] border border-neutral-800 rounded-xl p-5
                       hover:border-[#fd4d4d]/40 hover:bg-[#161616] transition-all duration-200
                       focus:outline-none focus:border-[#fd4d4d]/60"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-4 min-w-0">
					<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#fd4d4d]/10 border border-[#fd4d4d]/10 flex items-center justify-center text-lg mt-0.5">
						{icon}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2 flex-wrap mb-1.5">
							<span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
								{report.type}
							</span>
							<span
								className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
							>
								<span
									className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
								/>
								{report.status}
							</span>
						</div>
						<p className="text-neutral-200 text-sm leading-relaxed line-clamp-2 mb-3">
							{report.description ?? "No description provided."}
						</p>
						<div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
							<span className="flex items-center gap-1.5">
								<FiMapPin size={11} />
								{formatCoords(
									report.latitude,
									report.longitude,
								)}
							</span>
							<span className="flex items-center gap-1.5">
								<FiClock size={11} />
								{formatRelativeTime(report.created_at)}
							</span>
						</div>
					</div>
				</div>
				<FiChevronRight
					size={16}
					className="flex-shrink-0 text-neutral-600 group-hover:text-[#fd4d4d] transition-colors mt-1"
				/>
			</div>
		</button>
	);
}

function SkeletonCard() {
	return (
		<div className="w-full bg-[#111111] border border-neutral-800 rounded-xl p-5 animate-pulse">
			<div className="flex items-start gap-4">
				<div className="w-10 h-10 rounded-lg bg-neutral-800 flex-shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="h-3 w-24 bg-neutral-800 rounded" />
					<div className="h-4 w-3/4 bg-neutral-800 rounded" />
					<div className="h-4 w-1/2 bg-neutral-800 rounded" />
					<div className="h-3 w-40 bg-neutral-800 rounded mt-3" />
				</div>
			</div>
		</div>
	);
}

const PAGE_SIZE = 15;

export default function ReportsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [reports, setReports] = useState<Report[]>([]);
	const [meta, setMeta] = useState<Meta>({
		total: 0,
		limit: PAGE_SIZE,
		offset: 0,
	});
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [statusFilter, setStatusFilter] = useState<ReportStatus | "">(
		(searchParams.get("status") as ReportStatus) ?? "",
	);
	const [typeFilter, setTypeFilter] = useState<ReportType | "">(
		(searchParams.get("type") as ReportType) ?? "",
	);
	const [showFilters, setShowFilters] = useState(false);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchReports = useCallback(
		async (opts: {
			search: string;
			status: string;
			type: string;
			offset: number;
			append?: boolean;
		}) => {
			const params = new URLSearchParams();
			if (opts.search) params.set("search", opts.search);
			if (opts.status) params.set("status", opts.status);
			if (opts.type) params.set("type", opts.type);
			params.set("limit", String(PAGE_SIZE));
			params.set("offset", String(opts.offset));
			try {
				const res = await fetch(`/api/reports?${params.toString()}`);
				const json = await res.json();
				if (opts.append) {
					setReports((prev) => [...prev, ...(json.data ?? [])]);
				} else {
					setReports(json.data ?? []);
				}
				setMeta(
					json.meta ?? {
						total: 0,
						limit: PAGE_SIZE,
						offset: opts.offset,
					},
				);
			} catch (e) {
				console.error(e);
			}
		},
		[],
	);

	useEffect(() => {
		setLoading(true);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			await fetchReports({
				search,
				status: statusFilter,
				type: typeFilter,
				offset: 0,
			});
			setLoading(false);
		}, 300);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [search, statusFilter, typeFilter, fetchReports]);

	const handleLoadMore = async () => {
		setLoadingMore(true);
		await fetchReports({
			search,
			status: statusFilter,
			type: typeFilter,
			offset: meta.offset + PAGE_SIZE,
			append: true,
		});
		setLoadingMore(false);
	};

	const hasMore = reports.length < meta.total;
	const activeFilters = [statusFilter, typeFilter].filter(Boolean).length;

	return (
		<>
			<Sidebar activeHref="/reports-catalog" />
			<div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#1a1a1a] to-[#090909] text-white pl-[84px]">
				<div
					className="fixed inset-0 pointer-events-none opacity-30"
					style={{
						backgroundImage: `
							linear-gradient(rgba(253,77,77,0.04) 1px, transparent 1px),
							linear-gradient(90deg, rgba(253,77,77,0.04) 1px, transparent 1px)
						`,
						backgroundSize: "80px 80px",
					}}
				/>

				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
					{/* Header */}
					<div className="flex items-start justify-between gap-4 mb-10">
						<div>
							<div className="inline-flex items-center gap-2 bg-[#fd4d4d]/10 px-3 py-1.5 rounded-full border border-[#fd4d4d]/10 mb-4">
								<FiAlertTriangle
									size={12}
									className="text-[#fd4d4d]"
								/>
								<span className="text-[#fd4d4d] text-xs font-semibold uppercase tracking-widest">
									Live Feed
								</span>
							</div>
							<h1 className="text-4xl font-extrabold mb-2">
								Reports Catalog
							</h1>
							<p className="text-neutral-500 text-base">
								Browse, search, and filter all submitted
								disaster reports.
							</p>
						</div>

						<button
							onClick={() => router.push("/map")}
							className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 mt-1
                                       bg-[#fd4d4d] hover:bg-[#e63e3e] text-white rounded-lg
                                       text-sm font-semibold transition-all duration-200
                                       shadow-[0_0_20px_rgba(253,77,77,0.3)] hover:shadow-[0_0_28px_rgba(253,77,77,0.45)]"
						>
							<FiPlus size={16} />
							New Report
						</button>
					</div>

					{/* Search + Filter bar */}
					<div className="flex gap-3 mb-4">
						<div className="relative flex-1">
							<FiSearch
								size={15}
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
							/>
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by description…"
								className="w-full bg-[#111111] border border-neutral-800 rounded-lg
                                           pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600
                                           focus:outline-none focus:border-[#fd4d4d]/50 transition-colors"
							/>
							{search && (
								<button
									onClick={() => setSearch("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
								>
									<FiX size={14} />
								</button>
							)}
						</div>

						<button
							onClick={() => setShowFilters((v) => !v)}
							className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                                        ${
											showFilters || activeFilters > 0
												? "bg-[#fd4d4d]/10 border-[#fd4d4d]/40 text-[#fd4d4d]"
												: "bg-[#111111] border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
										}`}
						>
							<FiFilter size={14} />
							Filters
							{activeFilters > 0 && (
								<span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#fd4d4d] text-white text-[10px] font-bold flex items-center justify-center">
									{activeFilters}
								</span>
							)}
						</button>
					</div>

					{/* Filter dropdowns */}
					{showFilters && (
						<div className="flex gap-3 mb-6 flex-wrap p-4 bg-[#111111] border border-neutral-800 rounded-xl">
							<div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
								<label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
									Status
								</label>
								<select
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(
											e.target.value as ReportStatus | "",
										)
									}
									className="bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fd4d4d]/50 transition-colors cursor-pointer"
								>
									<option value="">All statuses</option>
									{Object.values(ReportStatus).map((s) => (
										<option key={s} value={s}>
											{s.charAt(0).toUpperCase() +
												s.slice(1)}
										</option>
									))}
								</select>
							</div>

							<div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
								<label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
									Type
								</label>
								<select
									value={typeFilter}
									onChange={(e) =>
										setTypeFilter(
											e.target.value as ReportType | "",
										)
									}
									className="bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fd4d4d]/50 transition-colors cursor-pointer"
								>
									<option value="">All types</option>
									{Object.values(ReportType).map((t) => (
										<option key={t} value={t}>
											{TYPE_ICONS[t]}{" "}
											{t.charAt(0).toUpperCase() +
												t.slice(1)}
										</option>
									))}
								</select>
							</div>

							{activeFilters > 0 && (
								<div className="flex items-end">
									<button
										onClick={() => {
											setStatusFilter("");
											setTypeFilter("");
										}}
										className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors"
									>
										<FiX size={12} /> Clear
									</button>
								</div>
							)}
						</div>
					)}

					{/* Results count */}
					{!loading && (
						<p className="text-xs text-neutral-600 mb-4">
							{meta.total === 0
								? "No reports found"
								: `Showing ${reports.length} of ${meta.total} report${meta.total !== 1 ? "s" : ""}`}
						</p>
					)}

					{/* Report list */}
					<div className="space-y-3">
						{loading ? (
							Array.from({ length: 6 }).map((_, i) => (
								<SkeletonCard key={i} />
							))
						) : reports.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-24 text-center">
								<div className="w-16 h-16 rounded-2xl bg-[#fd4d4d]/5 border border-[#fd4d4d]/10 flex items-center justify-center text-2xl mb-4">
									🔍
								</div>
								<p className="text-neutral-400 font-medium mb-1">
									No reports found
								</p>
								<p className="text-neutral-600 text-sm">
									Try adjusting your search or filters.
								</p>
							</div>
						) : (
							reports.map((report) => (
								<ReportCard
									key={report.id}
									report={report}
									onClick={() =>
										router.push(`/report/${report.id}`)
									}
								/>
							))
						)}
					</div>

					{/* Load more */}
					{!loading && hasMore && (
						<div className="flex justify-center mt-8">
							<button
								onClick={handleLoadMore}
								disabled={loadingMore}
								className="flex items-center gap-2 px-6 py-2.5 bg-[#111111] border border-neutral-800
                                           rounded-lg text-sm text-neutral-300 hover:border-neutral-600 hover:text-white
                                           disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								{loadingMore ? (
									<>
										<span className="w-4 h-4 border-2 border-neutral-600 border-t-[#fd4d4d] rounded-full animate-spin" />
										Loading…
									</>
								) : (
									<>
										Load more ({meta.total - reports.length}{" "}
										remaining)
									</>
								)}
							</button>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}
