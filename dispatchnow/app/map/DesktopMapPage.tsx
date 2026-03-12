// File path: app/map/DesktopMapPage.tsx
// Purpose: Desktop map page for viewing incidents + (Tier3 creates incidents / non-Tier3 submits reports)

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

// Incident list pagination settings (show 2 items per page)
const INCIDENTS_PER_PAGE = 2;

// Safe text helper for UI
function safeText(v: unknown, fallback = "-") {
    const s = String(v ?? "");
    return s.trim().length > 0 ? s : fallback;
}

// Safe ISO helper
function safeISO(v: unknown, fallback = "N/A") {
    const s = String(v ?? "").trim();
    if (!s) return fallback;
    return s;
}

export default function DesktopMapPage({
    mapsReady,
    isTier3,
}: {
    mapsReady: boolean;
    isTier3: boolean;
}) {
    const mapHandleRef = useRef<DispatchNowMapHandle | null>(null);

    // Search marker for geocoding result
    const searchMarkerRef = useRef<google.maps.Marker | null>(null);

    // Marker used when picking coordinates on the map
    const pickMarkerRef = useRef<google.maps.Marker | null>(null);

    const [loadingIncidents, setLoadingIncidents] = useState(true);
    const [errorIncidents, setErrorIncidents] = useState<string | null>(null);
    const [incidents, setIncidents] = useState<IncidentForMap[]>([]);

    const [loadingMyReports, setLoadingMyReports] = useState(false);
    const [errorMyReports, setErrorMyReports] = useState<string | null>(null);
    const [myReports, setMyReports] = useState<ReportForMap[]>([]);

    const [selectedKind, setSelectedKind] = useState<"incident" | "report" | null>(
        null
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Sidebar: address search
    const [address, setAddress] = useState("");
    const [searchError, setSearchError] = useState<string | null>(null);

    // Sidebar: create form toggle
    const [createOpen, setCreateOpen] = useState(true);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Sidebar: incidents list toggle
    const [incidentsListOpen, setIncidentsListOpen] = useState(true);

    const [isPicking, setIsPicking] = useState(false);
    const [pickHint, setPickHint] = useState<string | null>(null);

    // Incident list pagination state
    const [incidentPage, setIncidentPage] = useState(1);

    // Unified form (Tier3: incident, otherwise: report)
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
        [incidents]
    );

    const myReportsWithCoords = useMemo(
        () => myReports.filter((x) => x.lat != null && x.lng != null),
        [myReports]
    );

    const selectedIncident = useMemo(
        () =>
            selectedKind === "incident"
                ? incidents.find((x) => x.id === selectedId) ?? null
                : null,
        [incidents, selectedId, selectedKind]
    );

    const selectedReport = useMemo(
        () =>
            selectedKind === "report"
                ? myReports.find((x) => x.id === selectedId) ?? null
                : null,
        [myReports, selectedId, selectedKind]
    );

    const incidentTotalPages = useMemo(() => {
        const n = incidents.length;
        return Math.max(1, Math.ceil(n / INCIDENTS_PER_PAGE));
    }, [incidents.length]);

    const pagedIncidents = useMemo(() => {
        const start = (incidentPage - 1) * INCIDENTS_PER_PAGE;
        const end = start + INCIDENTS_PER_PAGE;
        return incidents.slice(start, end);
    }, [incidents, incidentPage]);

    // Keep incidentPage within valid range when incident list changes
    useEffect(() => {
        setIncidentPage((p) => {
            const clamped = Math.min(Math.max(1, p), incidentTotalPages);
            return clamped;
        });
    }, [incidentTotalPages]);

    function normalizeLatLng(obj: any): { lat: number | null; lng: number | null } {
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
            if (res.status === 401) throw new Error("UNAUTHORIZED (please sign in)");

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
            setErrorIncidents((e as Error).message || "Failed to load incidents");
        } finally {
            setLoadingIncidents(false);
        }
    }

    async function loadMyReports() {
        setLoadingMyReports(true);
        setErrorMyReports(null);

        try {
            const res = await fetch("/api/reports", { method: "GET" });
            if (res.status === 401) throw new Error("UNAUTHORIZED (please sign in)");

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
            if (cancelled) return;
            await refreshAll();
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const t = String(type ?? "").trim().toLowerCase();
        const found = INCIDENT_TYPE_OPTIONS.find((x) => x.value === t);
        return found?.icon ?? HelpCircle;
    }

    function getReportIcon(type: unknown) {
        const t = String(type ?? "").trim().toLowerCase() as ReportType;
        const found = REPORT_TYPE_OPTIONS.find((x) => x.value === t);
        return found?.icon ?? HelpCircle;
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
            new google.maps.LatLng(43.86, -79.06)
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
            }
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
        setPickHint("Click on the map to set coordinates. Click Cancel to stop.");
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

            const latNum = form.lat.trim().length > 0 ? Number(form.lat.trim()) : null;
            const lngNum = form.lng.trim().length > 0 ? Number(form.lng.trim()) : null;

            if (isTier3) {
                const payload: CreateIncidentPayload = {
                    title: form.title.trim().length > 0 ? form.title.trim() : undefined,
                    type: typeRaw,
                    description: form.description.trim().length > 0 ? form.description : null,
                    priority: form.priority.trim().length > 0 ? form.priority.trim() : undefined,
                    latitude: latNum != null && Number.isFinite(latNum) ? latNum : null,
                    longitude: lngNum != null && Number.isFinite(lngNum) ? lngNum : null,
                };

                const res = await fetch("/api/incident", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    const msg = safeText(json?.error ?? json?.message, `HTTP_${res.status}`);
                    throw new Error(msg);
                }

                setForm({ title: "", type: "", priority: "", description: "", lat: "", lng: "" });
                clearCoords();
                await loadIncidents();
            } else {
                const allowed = new Set(Object.values(ReportType));
                const reportType = (allowed.has(typeRaw as ReportType)
                    ? (typeRaw as ReportType)
                    : ReportType.Other) as ReportType;

                const payload: CreateReportPayload = {
                    type: reportType,
                    description: form.description.trim().length > 0 ? form.description : null,
                    latitude: latNum != null && Number.isFinite(latNum) ? latNum : null,
                    longitude: lngNum != null && Number.isFinite(lngNum) ? lngNum : null,
                };

                const res = await fetch("/api/reports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    const msg = safeText(json?.error ?? json?.message, `HTTP_${res.status}`);
                    throw new Error(msg);
                }

                setForm({ title: "", type: "", priority: "", description: "", lat: "", lng: "" });
                clearCoords();
                await loadMyReports();
            }
        } catch (e) {
            setCreateError((e as Error).message || "Create failed");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="h-screen w-screen bg-zinc-950 text-zinc-100">
            <Sidebar activeHref="/map" />
            <div className="h-full w-full flex pl-[84px]">
            {/* Sidebar */}
            <aside className="w-[420px] shrink-0 border-r border-zinc-800 bg-zinc-950 p-4 overflow-auto">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold tracking-wide">Incidents + Reports</h1>
                        <p className="text-xs text-zinc-400 mt-1">
                            {isTier3
                                ? "Tier 3: Create incidents and view them on the map"
                                : "Tier 1/2: Submit reports and view them on the map"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-3 py-2 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-2"
                            onClick={refreshAll}
                            disabled={loadingIncidents || loadingMyReports}
                            title="Refresh"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                        <button
                            className="px-3 py-2 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-2"
                            onClick={zoomToToronto}
                            title="Zoom to Toronto"
                        >
                            <LocateFixed className="h-4 w-4" />
                            Toronto
                        </button>
                        <button
                            className="px-3 py-2 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-2"
                            onClick={fitMarkers}
                            title="Fit all markers"
                        >
                            <Target className="h-4 w-4" />
                            Fit
                        </button>
                    </div>
                </div>

                {/* Address search */}
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="text-xs text-zinc-300 mb-2 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Address search
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g., 27 King's College Cir, Toronto"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") searchAddress();
                            }}
                        />
                        <button
                            className="px-3 py-2 text-sm rounded bg-red-700 hover:bg-red-600 flex items-center gap-2"
                            onClick={searchAddress}
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                    </div>
                    {searchError && <div className="text-xs text-red-400 mt-2">Error: {searchError}</div>}
                </div>

                {/* Create (Incident or Report) */}
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <button
                        className="w-full flex items-center justify-between px-3 py-3"
                        onClick={() => setCreateOpen((v) => !v)}
                        title="Toggle create form"
                    >
                        <div className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {isTier3 ? "Create Incident" : "Submit Report"}
                        </div>
                        <div className="text-xs text-zinc-400">{createOpen ? "Hide" : "Show"}</div>
                    </button>

                    {createOpen && (
                        <div className="px-3 pb-3 space-y-3">
                            {createError && <div className="text-xs text-red-400">Error: {createError}</div>}

                            {isTier3 && (
                                <div>
                                    <label className="block text-xs text-zinc-300 mb-1">Title</label>
                                    <input
                                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                                        value={form.title}
                                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g., Fire near campus"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs text-zinc-300 mb-1">Type *</label>
                                <select
                                    className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                                    value={form.type}
                                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                                >
                                    <option value="">Select a type</option>
                                    {(isTier3 ? INCIDENT_TYPE_OPTIONS : REPORT_TYPE_OPTIONS).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {isTier3 && (
                                <div>
                                    <label className="block text-xs text-zinc-300 mb-1">Priority</label>
                                    <select
                                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                                        value={form.priority}
                                        onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                                    >
                                        <option value="">Use default (medium)</option>
                                        {INCIDENT_PRIORITY_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs text-zinc-300 mb-1">Description (optional)</label>
                                <textarea
                                    className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600 min-h-[70px]"
                                    value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="What happened?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-zinc-300 mb-1">Latitude</label>
                                    <input
                                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                                        value={form.lat}
                                        onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
                                        placeholder="Pick on map"
                                        inputMode="decimal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-zinc-300 mb-1">Longitude</label>
                                    <input
                                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-red-600"
                                        value={form.lng}
                                        onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
                                        placeholder="Pick on map"
                                        inputMode="decimal"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-2 text-xs rounded bg-zinc-800 hover:bg-zinc-700 flex items-center gap-2"
                                        onClick={startPickOnMap}
                                        disabled={!mapsReady}
                                        title="Pick a point on the map"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Pick on map
                                    </button>
                                    <button
                                        className="px-3 py-2 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-2"
                                        onClick={clearCoords}
                                        title="Clear coordinates"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Clear
                                    </button>
                                </div>

                                <button
                                    className="px-3 py-2 text-xs rounded bg-sky-700 hover:bg-sky-600 disabled:opacity-60"
                                    onClick={submitCreate}
                                    disabled={creating}
                                    title={isTier3 ? "Create incident" : "Submit report"}
                                >
                                    {creating ? "Submitting..." : isTier3 ? "Create" : "Submit"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Incidents list */}
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <button
                        className="w-full flex items-center justify-between px-3 py-3"
                        onClick={() => setIncidentsListOpen((v) => !v)}
                        title="Toggle incidents list"
                    >
                        <div className="text-sm font-semibold">
                            Incidents{" "}
                            <span className="text-xs text-zinc-400">({incidents.length})</span>
                        </div>
                        <div className="text-xs text-zinc-400">{incidentsListOpen ? "Hide" : "Show"}</div>
                    </button>

                    {incidentsListOpen && (
                        <div className="px-3 pb-3">
                            {loadingIncidents && <div className="text-sm text-zinc-300">Loading incidents...</div>}
                            {errorIncidents && <div className="text-sm text-red-400 mt-2">Error: {errorIncidents}</div>}

                            {/* Pagination controls (2 incidents per page) */}
                            {incidents.length > INCIDENTS_PER_PAGE && (
                                <div className="mt-2 flex items-center justify-between">
                                    <button
                                        className="px-2 py-1 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-1 disabled:opacity-50"
                                        onClick={() => setIncidentPage((p) => Math.max(1, p - 1))}
                                        disabled={incidentPage <= 1}
                                        title="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Prev
                                    </button>

                                    <div className="text-xs text-zinc-400">
                                        Page {incidentPage} / {incidentTotalPages}
                                    </div>

                                    <button
                                        className="px-2 py-1 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-1 disabled:opacity-50"
                                        onClick={() => setIncidentPage((p) => Math.min(incidentTotalPages, p + 1))}
                                        disabled={incidentPage >= incidentTotalPages}
                                        title="Next page"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="mt-3 space-y-2">
                                {pagedIncidents.map((i) => {
                                    const hasCoords = i.lat != null && i.lng != null;
                                    const active = selectedIncident?.id === i.id;

                                    const desc = (i.description ?? "").trim();
                                    const descShort = desc
                                        ? desc.slice(0, 90) + (desc.length > 90 ? "..." : "")
                                        : "No details";

                                    const Icon = getIncidentIcon(i.type);

                                    return (
                                        <button
                                            key={i.id}
                                            className={[
                                                "w-full text-left rounded-lg border p-3 transition",
                                                "bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900",
                                                active ? "ring-1 ring-red-600 border-red-700/60" : "",
                                            ].join(" ")}
                                            onClick={() => focusIncident(i)}
                                            disabled={!mapsReady || !hasCoords}
                                            title={!mapsReady ? "Map not ready" : !hasCoords ? "No location" : "Focus on map"}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="font-medium flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    {i.title ?? "Untitled Incident"}
                                                </div>
                                                <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-200">
                                                    {safeText(i.priority)}
                                                </span>
                                            </div>

                                            <div className="text-xs text-zinc-300 mt-2 space-y-1">
                                                <div>
                                                    Type: {safeText(i.type)} | Status: {safeText(i.status)} | Priority:{" "}
                                                    {safeText(i.priority)}
                                                </div>
                                                <div className="text-zinc-400">ID: {i.id}</div>
                                                <div className="text-zinc-400">Updated: {safeISO(i.updatedAt)}</div>
                                                <div className="text-zinc-300">Details: {descShort}</div>
                                                <div className="text-xs mt-1">
                                                    {hasCoords ? (
                                                        <span className="text-zinc-200">
                                                            Location: ({(i.lat as number).toFixed(5)}, {(i.lng as number).toFixed(5)})
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-500">No location</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* My reports list */}
                <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">My Reports</div>
                        <button
                            className="px-2 py-1 text-xs rounded border border-zinc-700 hover:border-zinc-500 flex items-center gap-2"
                            onClick={loadMyReports}
                            disabled={loadingMyReports}
                            title="Reload my reports"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reload
                        </button>
                    </div>

                    {errorMyReports && <div className="text-xs text-red-400 mt-2">{errorMyReports}</div>}
                    {loadingMyReports && <div className="text-xs text-zinc-300 mt-2">Loading reports...</div>}
                    {myReports.length === 0 && !loadingMyReports && !errorMyReports && (
                        <div className="text-xs text-zinc-400 mt-2">No reports submitted yet.</div>
                    )}

                    <div className="mt-3 space-y-2">
                        {myReports.map((r) => {
                            const hasCoords = r.lat != null && r.lng != null;
                            const active = selectedReport?.id === r.id;

                            const desc = (r.description ?? "").trim();
                            const descShort = desc
                                ? desc.slice(0, 80) + (desc.length > 80 ? "..." : "")
                                : "No details";

                            const Icon = getReportIcon(r.type);

                            return (
                                <button
                                    key={r.id}
                                    className={[
                                        "w-full text-left rounded-lg border p-3 transition",
                                        "bg-zinc-950/40 border-zinc-800 hover:border-zinc-600",
                                        active ? "ring-1 ring-sky-500 border-sky-700/60" : "",
                                    ].join(" ")}
                                    onClick={() => focusReport(r)}
                                    disabled={!mapsReady || !hasCoords}
                                    title={!hasCoords ? "No location" : "Focus on map"}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="font-medium flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {r.type ?? "Report"}
                                        </div>
                                        <span className="text-[10px] px-2 py-1 rounded bg-sky-900/40 text-sky-200">
                                            {safeText(r.status)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-300 mt-2 space-y-1">
                                        <div>Type: {safeText(r.type)}</div>
                                        <div className="text-zinc-300">Details: {descShort}</div>
                                        <div className="text-zinc-400">Updated: {safeISO(r.updatedAt)}</div>
                                        <div className="text-xs mt-1">
                                            {hasCoords ? (
                                                <span className="text-zinc-200">
                                                    Location: ({(r.lat as number).toFixed(5)}, {(r.lng as number).toFixed(5)})
                                                </span>
                                            ) : (
                                                <span className="text-zinc-500">No location</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Map */}
            <main className="flex-1 min-w-0 relative bg-black">
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
                            // Pick marker: bright red dot with white outline (high contrast on dark maps)
                            const icon: google.maps.Symbol = {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 14,
                                fillColor: "#ef4444",
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeOpacity: 1,
                                strokeWeight: 3,
                            };

                            if (!pickMarkerRef.current) {
                                pickMarkerRef.current = new google.maps.Marker({
                                    position: { lat, lng },
                                    map,
                                    title: "Selected location",
                                    icon,
                                    zIndex: 1000,
                                });
                            } else {
                                pickMarkerRef.current.setPosition({ lat, lng });
                                pickMarkerRef.current.setMap(map);
                                pickMarkerRef.current.setIcon(icon);
                                pickMarkerRef.current.setZIndex(1000);
                            }
                        }

                        setForm((p) => ({ ...p, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
                        setIsPicking(false);
                        setPickHint(null);
                    }}
                />

                {isPicking && (
                    <div className="absolute top-4 left-4 right-4 z-40 pointer-events-none">
                        <div className="mx-auto max-w-3xl rounded-lg border border-red-700/60 bg-zinc-950/90 px-4 py-3 shadow-lg pointer-events-auto">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm">
                                    <span className="font-semibold text-red-300">Pick location:</span>{" "}
                                    {pickHint ?? "Click on the map to set coordinates."}
                                </div>
                                <button
                                    className="px-3 py-2 text-xs rounded bg-zinc-800 hover:bg-zinc-700 flex items-center gap-2"
                                    onClick={cancelPick}
                                >
                                    <XCircle className="h-4 w-4" />
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