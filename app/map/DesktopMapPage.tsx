// File path: app/map/DesktopMapPage.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	AlertTriangle,
	Car,
	ChevronLeft,
	ChevronRight,
	CloudLightning,
	Droplets,
	Flame,
	HelpCircle,
	LocateFixed,
	MapPin,
	RefreshCw,
	Route,
	Search,
	Target,
	Trash2,
	TriangleAlert,
	XCircle,
} from "lucide-react";
import DispatchNowMap, {
	type DispatchNowMapHandle,
	type IncidentForMap,
	type ReportForMap,
} from "@/app/components/maps/DispatchNowMap";
import Sidebar from "@/util/sidebar";

export enum ReportType {
	Pothole = "pothole",
	Flooding = "flooding",
	Debris = "debris",
	Accident = "accident",
	Other = "other",
}

type CreateReportPayload = {
	type: ReportType;
	description?: string | null;
	latitude?: number | null;
	longitude?: number | null;
};

type CreateIncidentPayload = {
	title?: string;
	type?: string;
	description?: string | null;
	priority?: string;
	latitude?: number | null;
	longitude?: number | null;
};

const TORONTO_CENTER = { lat: 43.6532, lng: -79.3832 };

const INCIDENT_TYPE_OPTIONS = [
	{ value: "fire", label: "Fire", icon: Flame },
	{ value: "flood", label: "Flood", icon: Droplets },
	{ value: "severe_weather", label: "Severe Weather", icon: CloudLightning },
	{ value: "road_closure", label: "Road Closure", icon: Route },
	{ value: "hazmat", label: "Hazmat", icon: TriangleAlert },
	{ value: "others", label: "Others", icon: HelpCircle },
] as const;

const REPORT_TYPE_OPTIONS = [
	{ value: ReportType.Pothole, label: "Pothole", icon: AlertTriangle },
	{ value: ReportType.Flooding, label: "Flooding", icon: Droplets },
	{ value: ReportType.Debris, label: "Debris", icon: Trash2 },
	{ value: ReportType.Accident, label: "Accident", icon: Car },
	{ value: ReportType.Other, label: "Other", icon: HelpCircle },
] as const;

const INCIDENT_PRIORITY_OPTIONS = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
] as const;

const INCIDENTS_PER_PAGE = 2;

function safeText(v: unknown, fallback = "-") {
	const s = String(v ?? "");
	return s.trim().length > 0 ? s : fallback;
}

function safeISO(v: unknown, fallback = "N/A") {
	const s = String(v ?? "").trim();
	if (!s) return fallback;
	return s;
}

// Shared input/select/textarea style
const inputCls =
	"w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 text-[#D9D9D9] placeholder-[#D9D9D9]/25 focus:border-[#fd4d4d]/60";
const inputStyle = {
	background: "rgba(10,10,10,0.8)",
	border: "1px solid rgba(255,255,255,0.08)",
};
const inputFocusStyle = {}; // handled via Tailwind focus:border

export default function DesktopMapPage({
	mapsReady,
	isTier3,
}: {
	mapsReady: boolean;
	isTier3: boolean;
}) {
	const mapHandleRef = useRef<DispatchNowMapHandle | null>(null);
	const searchMarkerRef = useRef<google.maps.Marker | null>(null);
	const pickMarkerRef = useRef<google.maps.Marker | null>(null);

	const [loadingIncidents, setLoadingIncidents] = useState(true);
	const [errorIncidents, setErrorIncidents] = useState<string | null>(null);
	const [incidents, setIncidents] = useState<IncidentForMap[]>([]);

	const [loadingMyReports, setLoadingMyReports] = useState(false);
	const [errorMyReports, setErrorMyReports] = useState<string | null>(null);
	const [myReports, setMyReports] = useState<ReportForMap[]>([]);

	const [selectedKind, setSelectedKind] = useState<
		"incident" | "report" | null
	>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const [address, setAddress] = useState("");
	const [searchError, setSearchError] = useState<string | null>(null);

	const [createOpen, setCreateOpen] = useState(true);
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [incidentsListOpen, setIncidentsListOpen] = useState(true);

	const [isPicking, setIsPicking] = useState(false);
	const [pickHint, setPickHint] = useState<string | null>(null);
	const [incidentPage, setIncidentPage] = useState(1);

	const [form, setForm] = useState({
		title: "",
		type: "",
		priority: "",
		description: "",
		lat: "",
		lng: "",
	});

	const incidentsWithCoords = useMemo(
		() => incidents.filter((x) => x.lat != null && x.lng != null),
		[incidents],
	);
	const myReportsWithCoords = useMemo(
		() => myReports.filter((x) => x.lat != null && x.lng != null),
		[myReports],
	);

	const selectedIncident = useMemo(
		() =>
			selectedKind === "incident"
				? (incidents.find((x) => x.id === selectedId) ?? null)
				: null,
		[incidents, selectedId, selectedKind],
	);
	const selectedReport = useMemo(
		() =>
			selectedKind === "report"
				? (myReports.find((x) => x.id === selectedId) ?? null)
				: null,
		[myReports, selectedId, selectedKind],
	);

	const incidentTotalPages = useMemo(
		() => Math.max(1, Math.ceil(incidents.length / INCIDENTS_PER_PAGE)),
		[incidents.length],
	);
	const pagedIncidents = useMemo(() => {
		const start = (incidentPage - 1) * INCIDENTS_PER_PAGE;
		return incidents.slice(start, start + INCIDENTS_PER_PAGE);
	}, [incidents, incidentPage]);

	useEffect(() => {
		setIncidentPage((p) => Math.min(Math.max(1, p), incidentTotalPages));
	}, [incidentTotalPages]);

	function normalizeLatLng(obj: any): {
		lat: number | null;
		lng: number | null;
	} {
		const latVal = obj?.lat ?? obj?.latitude;
		const lngVal = obj?.lng ?? obj?.longitude;
		const latNum = latVal == null ? null : Number(latVal);
		const lngNum = lngVal == null ? null : Number(lngVal);
		return {
			lat: latNum != null && Number.isFinite(latNum) ? latNum : null,
			lng: lngNum != null && Number.isFinite(lngNum) ? lngNum : null,
		};
	}

	async function loadIncidents() {
		setLoadingIncidents(true);
		setErrorIncidents(null);
		try {
			const res = await fetch("/api/incident", { method: "GET" });
			if (res.status === 401)
				throw new Error("UNAUTHORIZED (please sign in)");
			const json = await res.json().catch(() => ({}));
			const list = (json?.data ?? json?.incidents ?? []) as Array<any>;
			const normalized: IncidentForMap[] = (list ?? [])
				.filter(Boolean)
				.map((raw: any) => {
					const { lat, lng } = normalizeLatLng(raw);
					return {
						id: String(raw.id),
						title: raw.title ?? null,
						description: raw.description ?? null,
						type: raw.type ?? null,
						status: raw.status ?? null,
						priority: raw.priority ?? null,
						lat,
						lng,
						createdAt: raw.createdAt ?? raw.created_at ?? null,
						updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
					};
				});
			setIncidents(normalized);
			setIncidentPage(1);
		} catch (e) {
			setErrorIncidents(
				(e as Error).message || "Failed to load incidents",
			);
		} finally {
			setLoadingIncidents(false);
		}
	}

	async function loadMyReports() {
		setLoadingMyReports(true);
		setErrorMyReports(null);
		try {
			const res = await fetch("/api/reports", { method: "GET" });
			if (res.status === 401)
				throw new Error("UNAUTHORIZED (please sign in)");
			const json = await res.json().catch(() => ({}));
			const list = (json?.reports ?? json?.data ?? []) as Array<any>;
			const normalized: ReportForMap[] = (list ?? [])
				.filter(Boolean)
				.map((raw: any) => {
					const { lat, lng } = normalizeLatLng(raw);
					return {
						id: String(raw.id),
						type: raw.type ?? null,
						description: raw.description ?? null,
						status: raw.status ?? null,
						lat,
						lng,
						userId: raw.userId ?? raw.user_id ?? null,
						createdAt: raw.createdAt ?? raw.created_at ?? null,
						updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
					};
				});
			setMyReports(normalized);
		} catch (e) {
			setErrorMyReports((e as Error).message || "Failed to load reports");
		} finally {
			setLoadingMyReports(false);
		}
	}

	async function refreshAll() {
		await Promise.all([loadIncidents(), loadMyReports()]);
	}

	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!cancelled) await refreshAll();
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	function zoomToToronto() {
		mapHandleRef.current?.zoomToDefault();
	}
	function fitMarkers() {
		mapHandleRef.current?.fitAll();
	}

	function focusIncident(incident: IncidentForMap) {
		setSelectedKind("incident");
		setSelectedId(incident.id);
		mapHandleRef.current?.focusIncident(incident.id);
	}

	function focusReport(report: ReportForMap) {
		setSelectedKind("report");
		setSelectedId(report.id);
		mapHandleRef.current?.focusReport(report.id);
	}

	function getIncidentIcon(type: unknown) {
		const t = String(type ?? "")
			.trim()
			.toLowerCase();
		return (
			INCIDENT_TYPE_OPTIONS.find((x) => x.value === t)?.icon ?? HelpCircle
		);
	}

	function getReportIcon(type: unknown) {
		const t = String(type ?? "")
			.trim()
			.toLowerCase() as ReportType;
		return (
			REPORT_TYPE_OPTIONS.find((x) => x.value === t)?.icon ?? HelpCircle
		);
	}

	async function searchAddress() {
		setSearchError(null);
		const map = mapHandleRef.current?.getMap();
		if (!map) {
			setSearchError("MAP_NOT_READY");
			return;
		}
		const q = address.trim();
		if (!q) return;
		const geocoder = new google.maps.Geocoder();
		const biasBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(43.48, -79.64),
			new google.maps.LatLng(43.86, -79.06),
		);
		geocoder.geocode(
			{
				address: q,
				bounds: biasBounds,
				region: "ca",
				componentRestrictions: { country: "CA" },
			},
			(results, status) => {
				if (status !== "OK" || !results || results.length === 0) {
					setSearchError(`GEOCODE_${status}`);
					return;
				}
				const loc = results[0].geometry.location;
				const lat = loc.lat();
				const lng = loc.lng();
				const icon: google.maps.Symbol = {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8,
					strokeWeight: 2,
					fillOpacity: 1,
				};
				if (!searchMarkerRef.current) {
					searchMarkerRef.current = new google.maps.Marker({
						position: { lat, lng },
						map,
						title: "Search result",
						icon,
					});
				} else {
					searchMarkerRef.current.setPosition({ lat, lng });
					searchMarkerRef.current.setMap(map);
					searchMarkerRef.current.setIcon(icon);
				}
				map.panTo({ lat, lng });
				map.setZoom(15);
			},
		);
	}

	function startPickOnMap() {
		const map = mapHandleRef.current?.getMap();
		if (!map) {
			setCreateError("MAP_NOT_READY");
			return;
		}
		setCreateError(null);
		setIsPicking(true);
		setPickHint(
			"Click on the map to set coordinates. Click Cancel to stop.",
		);
		map.panTo(TORONTO_CENTER);
		map.setZoom(14);
	}

	function cancelPick() {
		setIsPicking(false);
		setPickHint(null);
	}

	function clearCoords() {
		pickMarkerRef.current?.setMap(null);
		pickMarkerRef.current = null;
		setForm((p) => ({ ...p, lat: "", lng: "" }));
	}

	async function submitCreate() {
		setCreateError(null);
		setCreating(true);
		try {
			const typeRaw = form.type.trim();
			if (!typeRaw) throw new Error("Type is required");
			const latNum =
				form.lat.trim().length > 0 ? Number(form.lat.trim()) : null;
			const lngNum =
				form.lng.trim().length > 0 ? Number(form.lng.trim()) : null;

			if (isTier3) {
				const payload: CreateIncidentPayload = {
					title:
						form.title.trim().length > 0
							? form.title.trim()
							: undefined,
					type: typeRaw,
					description:
						form.description.trim().length > 0
							? form.description
							: null,
					priority:
						form.priority.trim().length > 0
							? form.priority.trim()
							: undefined,
					latitude:
						latNum != null && Number.isFinite(latNum)
							? latNum
							: null,
					longitude:
						lngNum != null && Number.isFinite(lngNum)
							? lngNum
							: null,
				};
				const res = await fetch("/api/incident", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				const json = await res.json().catch(() => ({}));
				if (!res.ok)
					throw new Error(
						safeText(
							json?.error ?? json?.message,
							`HTTP_${res.status}`,
						),
					);
				setForm({
					title: "",
					type: "",
					priority: "",
					description: "",
					lat: "",
					lng: "",
				});
				clearCoords();
				await loadIncidents();
			} else {
				const allowed = new Set(Object.values(ReportType));
				const reportType = (
					allowed.has(typeRaw as ReportType)
						? (typeRaw as ReportType)
						: ReportType.Other
				) as ReportType;
				const payload: CreateReportPayload = {
					type: reportType,
					description:
						form.description.trim().length > 0
							? form.description
							: null,
					latitude:
						latNum != null && Number.isFinite(latNum)
							? latNum
							: null,
					longitude:
						lngNum != null && Number.isFinite(lngNum)
							? lngNum
							: null,
				};
				const res = await fetch("/api/reports", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				const json = await res.json().catch(() => ({}));
				if (!res.ok)
					throw new Error(
						safeText(
							json?.error ?? json?.message,
							`HTTP_${res.status}`,
						),
					);
				setForm({
					title: "",
					type: "",
					priority: "",
					description: "",
					lat: "",
					lng: "",
				});
				clearCoords();
				await loadMyReports();
			}
		} catch (e) {
			setCreateError((e as Error).message || "Create failed");
		} finally {
			setCreating(false);
		}
	}

	// Shared section card style
	const cardStyle = {
		background: "rgba(20,20,20,0.85)",
		border: "1px solid rgba(255,255,255,0.07)",
		borderRadius: "1rem",
	};

	const sectionHeaderCls =
		"w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#D9D9D9]";

	return (
		<div
			className="h-screen w-screen text-[#D9D9D9] overflow-hidden relative"
			style={{ background: "#090909" }}
		>
			{/* Grid texture */}
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
			{/* Vignette */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
					zIndex: 1,
				}}
			/>

			<Sidebar activeHref="/map" />

			<div
				className="absolute inset-0 flex pl-[84px] overflow-hidden"
				style={{ zIndex: 10 }}
			>
				{/* Left panel */}
				<aside
					className="w-[400px] shrink-0 p-4 overflow-y-auto h-full space-y-3"
					style={{
						borderRight: "1px solid rgba(255,255,255,0.06)",
						background: "rgba(9,9,9,0.95)",
					}}
				>
					{/* Header */}
					<div
						className="flex items-start justify-between gap-3 pb-3 shrink-0"
						style={{
							borderBottom: "1px solid rgba(255,255,255,0.06)",
						}}
					>
						<div>
							<h1 className="text-base font-extrabold tracking-tight text-white">
								{isTier3 ? "Incidents" : "Reports"} Map
							</h1>
							<p className="text-xs text-[#D9D9D9]/35 mt-0.5">
								{isTier3
									? "Create incidents and view them on the map"
									: "Submit reports and view them on the map"}
							</p>
						</div>
						<div className="flex gap-2 shrink-0">
							{[
								{
									icon: RefreshCw,
									label: "Refresh",
									onClick: refreshAll,
									disabled:
										loadingIncidents || loadingMyReports,
								},
								{
									icon: LocateFixed,
									label: "Toronto",
									onClick: zoomToToronto,
									disabled: false,
								},
								{
									icon: Target,
									label: "Fit",
									onClick: fitMarkers,
									disabled: false,
								},
							].map(
								({ icon: Icon, label, onClick, disabled }) => (
									<button
										key={label}
										onClick={onClick}
										disabled={disabled}
										title={label}
										className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D9D9D9]/70 hover:text-white transition-all duration-200 disabled:opacity-40"
										style={{
											background:
												"rgba(255,255,255,0.04)",
											border: "1px solid rgba(255,255,255,0.08)",
										}}
									>
										<Icon className="h-3.5 w-3.5" />
										{label}
									</button>
								),
							)}
						</div>
					</div>

					{/* Address search */}
					<div style={cardStyle} className="overflow-hidden shrink-0">
						<div
							className="px-4 py-3"
							style={{
								borderBottom:
									"1px solid rgba(255,255,255,0.06)",
							}}
						>
							<p className="text-xs font-semibold text-[#D9D9D9]/60 flex items-center gap-2 uppercase tracking-widest">
								<Search className="h-3.5 w-3.5" /> Address
								Search
							</p>
						</div>
						<div className="p-4 flex gap-2">
							<input
								className={inputCls}
								style={inputStyle}
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder="e.g., 27 King's College Cir, Toronto"
								onKeyDown={(e) => {
									if (e.key === "Enter") searchAddress();
								}}
							/>
							<button
								className="px-3 py-2 rounded-lg text-xs font-semibold text-[#fd4d4d] flex items-center gap-1.5 shrink-0 transition-all duration-200 hover:bg-[#fd4d4d]/20"
								style={{
									background: "rgba(253,77,77,0.10)",
									border: "1px solid rgba(253,77,77,0.25)",
								}}
								onClick={searchAddress}
							>
								<Search className="h-3.5 w-3.5" /> Search
							</button>
						</div>
						{searchError && (
							<p className="px-4 pb-3 text-xs text-[#fd4d4d]/80">
								Error: {searchError}
							</p>
						)}
					</div>

					{/* Create form */}
					<div style={cardStyle} className="overflow-hidden shrink-0">
						<button
							className={sectionHeaderCls}
							onClick={() => setCreateOpen((v) => !v)}
						>
							<span className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-[#fd4d4d]" />
								{isTier3 ? "Create Incident" : "Submit Report"}
							</span>
							<span className="text-xs text-[#D9D9D9]/35">
								{createOpen ? "Hide" : "Show"}
							</span>
						</button>

						{createOpen && (
							<div
								className="px-4 pb-4 space-y-3"
								style={{
									borderTop:
										"1px solid rgba(255,255,255,0.06)",
								}}
							>
								{createError && (
									<p className="pt-3 text-xs text-[#fd4d4d]/80">
										Error: {createError}
									</p>
								)}

								{isTier3 && (
									<div className="pt-3">
										<label className="block text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40 mb-1.5">
											Title
										</label>
										<input
											className={inputCls}
											style={inputStyle}
											value={form.title}
											onChange={(e) =>
												setForm((p) => ({
													...p,
													title: e.target.value,
												}))
											}
											placeholder="e.g., Fire near campus"
										/>
									</div>
								)}

								<div className={isTier3 ? "" : "pt-3"}>
									<label className="block text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40 mb-1.5">
										Type *
									</label>
									<select
										className={inputCls}
										style={inputStyle}
										value={form.type}
										onChange={(e) =>
											setForm((p) => ({
												...p,
												type: e.target.value,
											}))
										}
									>
										<option value="">Select a type</option>
										{(isTier3
											? INCIDENT_TYPE_OPTIONS
											: REPORT_TYPE_OPTIONS
										).map((opt) => (
											<option
												key={opt.value}
												value={opt.value}
											>
												{opt.label}
											</option>
										))}
									</select>
								</div>

								{isTier3 && (
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40 mb-1.5">
											Priority
										</label>
										<select
											className={inputCls}
											style={inputStyle}
											value={form.priority}
											onChange={(e) =>
												setForm((p) => ({
													...p,
													priority: e.target.value,
												}))
											}
										>
											<option value="">
												Default (medium)
											</option>
											{INCIDENT_PRIORITY_OPTIONS.map(
												(opt) => (
													<option
														key={opt.value}
														value={opt.value}
													>
														{opt.label}
													</option>
												),
											)}
										</select>
									</div>
								)}

								<div>
									<label className="block text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40 mb-1.5">
										Description (optional)
									</label>
									<textarea
										className={
											inputCls +
											" min-h-[70px] resize-none"
										}
										style={inputStyle}
										value={form.description}
										onChange={(e) =>
											setForm((p) => ({
												...p,
												description: e.target.value,
											}))
										}
										placeholder="What happened?"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									{["lat", "lng"].map((field) => (
										<div key={field}>
											<label className="block text-[10px] font-bold uppercase tracking-widest text-[#D9D9D9]/40 mb-1.5">
												{field === "lat"
													? "Latitude"
													: "Longitude"}
											</label>
											<input
												className={inputCls}
												style={inputStyle}
												value={
													form[field as "lat" | "lng"]
												}
												onChange={(e) =>
													setForm((p) => ({
														...p,
														[field]: e.target.value,
													}))
												}
												placeholder="Pick on map"
												inputMode="decimal"
											/>
										</div>
									))}
								</div>

								<div className="flex items-center justify-between gap-2 pt-1">
									<div className="flex gap-2">
										<button
											className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#D9D9D9]/70 hover:text-white transition-all duration-200 disabled:opacity-40"
											style={{
												background:
													"rgba(255,255,255,0.04)",
												border: "1px solid rgba(255,255,255,0.08)",
											}}
											onClick={startPickOnMap}
											disabled={!mapsReady}
										>
											<MapPin className="h-3.5 w-3.5" />{" "}
											Pick on map
										</button>
										<button
											className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#D9D9D9]/50 hover:text-white transition-all duration-200"
											style={{
												background:
													"rgba(255,255,255,0.03)",
												border: "1px solid rgba(255,255,255,0.06)",
											}}
											onClick={clearCoords}
										>
											<XCircle className="h-3.5 w-3.5" />{" "}
											Clear
										</button>
									</div>
									<button
										className="px-4 py-2 rounded-lg text-xs font-bold text-[#fd4d4d] transition-all duration-200 hover:bg-[#fd4d4d]/20 disabled:opacity-40"
										style={{
											background: "rgba(253,77,77,0.10)",
											border: "1px solid rgba(253,77,77,0.25)",
										}}
										onClick={submitCreate}
										disabled={creating}
									>
										{creating
											? "Submitting..."
											: isTier3
												? "Create"
												: "Submit"}
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Incidents list */}
					<div style={cardStyle} className="overflow-hidden shrink-0">
						<button
							className={sectionHeaderCls}
							onClick={() => setIncidentsListOpen((v) => !v)}
						>
							<span>
								Incidents{" "}
								<span className="text-xs text-[#D9D9D9]/35">
									({incidents.length})
								</span>
							</span>
							<span className="text-xs text-[#D9D9D9]/35">
								{incidentsListOpen ? "Hide" : "Show"}
							</span>
						</button>

						{incidentsListOpen && (
							<div
								className="px-4 pb-4"
								style={{
									borderTop:
										"1px solid rgba(255,255,255,0.06)",
								}}
							>
								{loadingIncidents && (
									<p className="pt-3 text-xs text-[#D9D9D9]/40">
										Loading incidents...
									</p>
								)}
								{errorIncidents && (
									<p className="pt-3 text-xs text-[#fd4d4d]/80">
										Error: {errorIncidents}
									</p>
								)}

								{incidents.length > INCIDENTS_PER_PAGE && (
									<div className="pt-3 flex items-center justify-between">
										<button
											className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#D9D9D9]/60 hover:text-white transition-all duration-200 disabled:opacity-30"
											style={{
												background:
													"rgba(255,255,255,0.04)",
												border: "1px solid rgba(255,255,255,0.07)",
											}}
											onClick={() =>
												setIncidentPage((p) =>
													Math.max(1, p - 1),
												)
											}
											disabled={incidentPage <= 1}
										>
											<ChevronLeft className="h-3.5 w-3.5" />{" "}
											Prev
										</button>
										<span className="text-xs text-[#D9D9D9]/35">
											{incidentPage} /{" "}
											{incidentTotalPages}
										</span>
										<button
											className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#D9D9D9]/60 hover:text-white transition-all duration-200 disabled:opacity-30"
											style={{
												background:
													"rgba(255,255,255,0.04)",
												border: "1px solid rgba(255,255,255,0.07)",
											}}
											onClick={() =>
												setIncidentPage((p) =>
													Math.min(
														incidentTotalPages,
														p + 1,
													),
												)
											}
											disabled={
												incidentPage >=
												incidentTotalPages
											}
										>
											Next{" "}
											<ChevronRight className="h-3.5 w-3.5" />
										</button>
									</div>
								)}

								<div className="mt-3 space-y-2">
									{pagedIncidents.map((i) => {
										const hasCoords =
											i.lat != null && i.lng != null;
										const active =
											selectedIncident?.id === i.id;
										const desc = (
											i.description ?? ""
										).trim();
										const descShort = desc
											? desc.slice(0, 90) +
												(desc.length > 90 ? "..." : "")
											: "No details";
										const Icon = getIncidentIcon(i.type);

										return (
											<button
												key={i.id}
												className="w-full text-left rounded-xl p-3 transition-all duration-200"
												style={{
													background: active
														? "rgba(253,77,77,0.08)"
														: "rgba(255,255,255,0.02)",
													border: active
														? "1px solid rgba(253,77,77,0.30)"
														: "1px solid rgba(255,255,255,0.06)",
													boxShadow: active
														? "0 0 0 1px rgba(253,77,77,0.15)"
														: "none",
												}}
												onClick={() => focusIncident(i)}
												disabled={
													!mapsReady || !hasCoords
												}
											>
												<div className="flex items-center justify-between gap-2">
													<div className="font-semibold text-sm flex items-center gap-2 text-[#D9D9D9]">
														<Icon className="h-4 w-4 text-[#fd4d4d]" />
														{i.title ??
															"Untitled Incident"}
													</div>
													<span
														className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
														style={{
															background:
																"rgba(253,77,77,0.10)",
															color: "#fd4d4d",
															border: "1px solid rgba(253,77,77,0.2)",
														}}
													>
														{safeText(i.priority)}
													</span>
												</div>
												<div className="text-xs text-[#D9D9D9]/40 mt-2 space-y-0.5">
													<div>
														Type: {safeText(i.type)}{" "}
														· Status:{" "}
														{safeText(i.status)}
													</div>
													<div>
														Updated:{" "}
														{safeISO(i.updatedAt)}
													</div>
													<div className="text-[#D9D9D9]/55">
														{descShort}
													</div>
													{hasCoords ? (
														<div className="text-[#D9D9D9]/40">
															{(
																i.lat as number
															).toFixed(5)}
															,{" "}
															{(
																i.lng as number
															).toFixed(5)}
														</div>
													) : (
														<div className="text-[#D9D9D9]/25">
															No location
														</div>
													)}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					{/* My Reports list */}
					<div style={cardStyle} className="overflow-hidden shrink-0">
						<div
							className="flex items-center justify-between px-4 py-3"
							style={{
								borderBottom:
									"1px solid rgba(255,255,255,0.06)",
							}}
						>
							<span className="text-sm font-semibold text-[#D9D9D9]">
								My Reports
							</span>
							<button
								className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#D9D9D9]/60 hover:text-white transition-all duration-200 disabled:opacity-40"
								style={{
									background: "rgba(255,255,255,0.04)",
									border: "1px solid rgba(255,255,255,0.07)",
								}}
								onClick={loadMyReports}
								disabled={loadingMyReports}
							>
								<RefreshCw className="h-3.5 w-3.5" /> Reload
							</button>
						</div>

						<div className="px-4 pb-4">
							{errorMyReports && (
								<p className="pt-3 text-xs text-[#fd4d4d]/80">
									{errorMyReports}
								</p>
							)}
							{loadingMyReports && (
								<p className="pt-3 text-xs text-[#D9D9D9]/40">
									Loading reports...
								</p>
							)}
							{myReports.length === 0 &&
								!loadingMyReports &&
								!errorMyReports && (
									<p className="pt-3 text-xs text-[#D9D9D9]/30">
										No reports submitted yet.
									</p>
								)}

							<div className="mt-3 space-y-2">
								{myReports.map((r) => {
									const hasCoords =
										r.lat != null && r.lng != null;
									const active = selectedReport?.id === r.id;
									const desc = (r.description ?? "").trim();
									const descShort = desc
										? desc.slice(0, 80) +
											(desc.length > 80 ? "..." : "")
										: "No details";
									const Icon = getReportIcon(r.type);

									return (
										<button
											key={r.id}
											className="w-full text-left rounded-xl p-3 transition-all duration-200"
											style={{
												background: active
													? "rgba(255,255,255,0.05)"
													: "rgba(255,255,255,0.02)",
												border: active
													? "1px solid rgba(255,255,255,0.15)"
													: "1px solid rgba(255,255,255,0.06)",
											}}
											onClick={() => focusReport(r)}
											disabled={!mapsReady || !hasCoords}
										>
											<div className="flex items-center justify-between gap-2">
												<div className="font-semibold text-sm flex items-center gap-2 text-[#D9D9D9]">
													<Icon className="h-4 w-4 text-[#D9D9D9]/50" />
													{r.type ?? "Report"}
												</div>
												<span
													className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
													style={{
														background:
															"rgba(255,255,255,0.06)",
														color: "#D9D9D9",
														border: "1px solid rgba(255,255,255,0.10)",
													}}
												>
													{safeText(r.status)}
												</span>
											</div>
											<div className="text-xs text-[#D9D9D9]/40 mt-2 space-y-0.5">
												<div className="text-[#D9D9D9]/55">
													{descShort}
												</div>
												<div>
													Updated:{" "}
													{safeISO(r.updatedAt)}
												</div>
												{hasCoords ? (
													<div>
														{(
															r.lat as number
														).toFixed(5)}
														,{" "}
														{(
															r.lng as number
														).toFixed(5)}
													</div>
												) : (
													<div className="text-[#D9D9D9]/25">
														No location
													</div>
												)}
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</aside>

				{/* Map */}
				<main className="flex-1 min-w-0 relative h-full">
					<DispatchNowMap
						ref={mapHandleRef}
						mapsReady={mapsReady}
						incidents={incidentsWithCoords}
						reports={myReportsWithCoords}
						showReports={true}
						selected={{ kind: selectedKind, id: selectedId }}
						onSelect={(sel) => {
							setSelectedKind(sel.kind);
							setSelectedId(sel.id);
						}}
						picking={isPicking}
						onPick={(lat, lng) => {
							const map = mapHandleRef.current?.getMap();
							if (map) {
								const icon: google.maps.Symbol = {
									path: google.maps.SymbolPath.CIRCLE,
									scale: 14,
									fillColor: "#fd4d4d",
									fillOpacity: 1,
									strokeColor: "#ffffff",
									strokeOpacity: 1,
									strokeWeight: 3,
								};
								if (!pickMarkerRef.current) {
									pickMarkerRef.current =
										new google.maps.Marker({
											position: { lat, lng },
											map,
											title: "Selected location",
											icon,
											zIndex: 1000,
										});
								} else {
									pickMarkerRef.current.setPosition({
										lat,
										lng,
									});
									pickMarkerRef.current.setMap(map);
									pickMarkerRef.current.setIcon(icon);
									pickMarkerRef.current.setZIndex(1000);
								}
							}
							setForm((p) => ({
								...p,
								lat: lat.toFixed(6),
								lng: lng.toFixed(6),
							}));
							setIsPicking(false);
							setPickHint(null);
						}}
					/>

					{isPicking && (
						<div className="absolute top-4 left-4 right-4 z-40 pointer-events-none">
							<div
								className="mx-auto max-w-3xl rounded-xl px-4 py-3 shadow-2xl pointer-events-auto"
								style={{
									background: "rgba(20,20,20,0.95)",
									border: "1px solid rgba(253,77,77,0.30)",
									boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
								}}
							>
								<div className="flex items-center justify-between gap-3">
									<div className="text-sm">
										<span className="font-bold text-[#fd4d4d]">
											Pick location:{" "}
										</span>
										<span className="text-[#D9D9D9]/70">
											{pickHint ??
												"Click on the map to set coordinates."}
										</span>
									</div>
									<button
										className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D9D9D9]/70 hover:text-white transition-all duration-200"
										style={{
											background:
												"rgba(255,255,255,0.06)",
											border: "1px solid rgba(255,255,255,0.10)",
										}}
										onClick={cancelPick}
									>
										<XCircle className="h-3.5 w-3.5" />{" "}
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
