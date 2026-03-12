"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/util/sidebar";
import { IncidentStatus, IncidentPriority } from "@/lib/types";
import {
	FiSearch,
	FiClock,
	FiChevronRight,
	FiFilter,
	FiX,
	FiAlertTriangle,
} from "react-icons/fi";

interface Incident {
	id: string;
	title: string;
	description?: string;
	status: IncidentStatus;
	priority: IncidentPriority;
	report_id?: string | null;
	created_by: string;
	created_at: string;
	updated_at: string;
	closed_at?: string | null;
}

interface Meta {
	total: number;
	limit: number;
	offset: number;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
	IncidentStatus,
	{ bg: string; text: string; dot: string }
> = {
	[IncidentStatus.Active]: {
		bg: "bg-red-500/10",
		text: "text-red-400",
		dot: "bg-red-400",
	},
	[IncidentStatus.Paused]: {
		bg: "bg-yellow-500/10",
		text: "text-yellow-400",
		dot: "bg-yellow-400",
	},
	[IncidentStatus.Closed]: {
		bg: "bg-neutral-500/10",
		text: "text-neutral-400",
		dot: "bg-neutral-400",
	},
};

const PRIORITY_STYLES: Record<
	IncidentPriority,
	{ bg: string; text: string; border: string; icon: string }
> = {
	[IncidentPriority.High]: {
		bg: "bg-red-500/10",
		text: "text-red-400",
		border: "border-red-500/20",
		icon: "🔴",
	},
	[IncidentPriority.Medium]: {
		bg: "bg-orange-500/10",
		text: "text-orange-400",
		border: "border-orange-500/20",
		icon: "🟠",
	},
	[IncidentPriority.Low]: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-400",
		border: "border-emerald-500/20",
		icon: "🟢",
	},
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

// ── sub-components ────────────────────────────────────────────────────────────

function IncidentCard({
	incident,
	onClick,
}: {
	incident: Incident;
	onClick: () => void;
}) {
	const status = STATUS_STYLES[incident.status];
	const priority = PRIORITY_STYLES[incident.priority];

	return (
		<button
			onClick={onClick}
			className="group w-full text-left bg-[#111111] border border-neutral-800 rounded-xl p-5
                       hover:border-[#fd4d4d]/40 hover:bg-[#161616] transition-all duration-200
                       focus:outline-none focus:border-[#fd4d4d]/60"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-4 min-w-0">
					{/* Priority icon */}
					<div
						className={`flex-shrink-0 w-10 h-10 rounded-lg ${priority.bg} border ${priority.border} flex items-center justify-center text-lg mt-0.5`}
					>
						{priority.icon}
					</div>

					<div className="min-w-0 flex-1">
						{/* Priority + status badges */}
						<div className="flex items-center gap-2 flex-wrap mb-1.5">
							<span
								className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}
							>
								{incident.priority}
							</span>
							<span
								className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
							>
								<span
									className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
								/>
								{incident.status}
							</span>
						</div>

						{/* Title */}
						<p className="text-white text-sm font-semibold mb-1">
							{incident.title}
						</p>

						{/* Description */}
						<p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 mb-3">
							{incident.description ?? "No description provided."}
						</p>

						{/* Meta row */}
						<div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
							<span className="flex items-center gap-1.5">
								<FiClock size={11} />
								{formatRelativeTime(incident.created_at)}
							</span>
							{incident.closed_at && (
								<span className="flex items-center gap-1.5 text-neutral-600">
									Closed{" "}
									{formatRelativeTime(incident.closed_at)}
								</span>
							)}
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
					<div className="h-3 w-28 bg-neutral-800 rounded" />
					<div className="h-4 w-2/3 bg-neutral-800 rounded" />
					<div className="h-4 w-3/4 bg-neutral-800 rounded" />
					<div className="h-3 w-24 bg-neutral-800 rounded mt-3" />
				</div>
			</div>
		</div>
	);
}

// ── main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

export default function IncidentsCatalogPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [meta, setMeta] = useState<Meta>({
		total: 0,
		limit: PAGE_SIZE,
		offset: 0,
	});
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [statusFilter, setStatusFilter] = useState<IncidentStatus | "">(
		(searchParams.get("status") as IncidentStatus) ?? "",
	);
	const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | "">(
		(searchParams.get("priority") as IncidentPriority) ?? "",
	);
	const [showFilters, setShowFilters] = useState(false);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchIncidents = useCallback(
		async (opts: {
			search: string;
			status: string;
			priority: string;
			offset: number;
			append?: boolean;
		}) => {
			const params = new URLSearchParams();
			if (opts.search) params.set("search", opts.search);
			if (opts.status) params.set("status", opts.status);
			if (opts.priority) params.set("priority", opts.priority);
			params.set("limit", String(PAGE_SIZE));
			params.set("offset", String(opts.offset));

			try {
				const res = await fetch(`/api/incidents?${params.toString()}`);
				const json = await res.json();
				if (opts.append) {
					setIncidents((prev) => [...prev, ...(json.data ?? [])]);
				} else {
					setIncidents(json.data ?? []);
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
			await fetchIncidents({
				search,
				status: statusFilter,
				priority: priorityFilter,
				offset: 0,
			});
			setLoading(false);
		}, 300);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [search, statusFilter, priorityFilter, fetchIncidents]);

	const handleLoadMore = async () => {
		setLoadingMore(true);
		await fetchIncidents({
			search,
			status: statusFilter,
			priority: priorityFilter,
			offset: meta.offset + PAGE_SIZE,
			append: true,
		});
		setLoadingMore(false);
	};

	const hasMore = incidents.length < meta.total;
	const activeFilters = [statusFilter, priorityFilter].filter(Boolean).length;

	return (
		<>
			<Sidebar activeHref="/incidents-catalog" />
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
					{/* ── Header ── */}
					<div className="mb-10">
						<div className="inline-flex items-center gap-2 bg-[#fd4d4d]/10 px-3 py-1.5 rounded-full border border-[#fd4d4d]/10 mb-4">
							<FiAlertTriangle
								size={12}
								className="text-[#fd4d4d]"
							/>
							<span className="text-[#fd4d4d] text-xs font-semibold uppercase tracking-widest">
								Active Operations
							</span>
						</div>
						<h1 className="text-4xl font-extrabold mb-2">
							Incidents Catalog
						</h1>
						<p className="text-neutral-500 text-base">
							Browse and filter all active and historical disaster
							incidents.
						</p>
					</div>

					{/* ── Search + Filter bar ── */}
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
								placeholder="Search by title or description…"
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

					{/* ── Filter dropdowns ── */}
					{showFilters && (
						<div className="flex gap-3 mb-6 flex-wrap p-4 bg-[#111111] border border-neutral-800 rounded-xl">
							{/* Status */}
							<div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
								<label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
									Status
								</label>
								<select
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(
											e.target.value as
												| IncidentStatus
												| "",
										)
									}
									className="bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fd4d4d]/50 transition-colors cursor-pointer"
								>
									<option value="">All statuses</option>
									{Object.values(IncidentStatus).map((s) => (
										<option key={s} value={s}>
											{s.charAt(0).toUpperCase() +
												s.slice(1)}
										</option>
									))}
								</select>
							</div>

							{/* Priority */}
							<div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
								<label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
									Priority
								</label>
								<select
									value={priorityFilter}
									onChange={(e) =>
										setPriorityFilter(
											e.target.value as
												| IncidentPriority
												| "",
										)
									}
									className="bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fd4d4d]/50 transition-colors cursor-pointer"
								>
									<option value="">All priorities</option>
									{Object.values(IncidentPriority).map(
										(p) => (
											<option key={p} value={p}>
												{PRIORITY_STYLES[p].icon}{" "}
												{p.charAt(0).toUpperCase() +
													p.slice(1)}
											</option>
										),
									)}
								</select>
							</div>

							{activeFilters > 0 && (
								<div className="flex items-end">
									<button
										onClick={() => {
											setStatusFilter("");
											setPriorityFilter("");
										}}
										className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors"
									>
										<FiX size={12} />
										Clear
									</button>
								</div>
							)}
						</div>
					)}

					{/* ── Results count ── */}
					{!loading && (
						<p className="text-xs text-neutral-600 mb-4">
							{meta.total === 0
								? "No incidents found"
								: `Showing ${incidents.length} of ${meta.total} incident${meta.total !== 1 ? "s" : ""}`}
						</p>
					)}

					{/* ── Incident list ── */}
					<div className="space-y-3">
						{loading ? (
							Array.from({ length: 6 }).map((_, i) => (
								<SkeletonCard key={i} />
							))
						) : incidents.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-24 text-center">
								<div className="w-16 h-16 rounded-2xl bg-[#fd4d4d]/5 border border-[#fd4d4d]/10 flex items-center justify-center text-2xl mb-4">
									🔍
								</div>
								<p className="text-neutral-400 font-medium mb-1">
									No incidents found
								</p>
								<p className="text-neutral-600 text-sm">
									Try adjusting your search or filters.
								</p>
							</div>
						) : (
							incidents.map((incident) => (
								<IncidentCard
									key={incident.id}
									incident={incident}
									onClick={() =>
										router.push(`/incident/${incident.id}`)
									}
								/>
							))
						)}
					</div>

					{/* ── Load more ── */}
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
										Load more (
										{meta.total - incidents.length}{" "}
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
