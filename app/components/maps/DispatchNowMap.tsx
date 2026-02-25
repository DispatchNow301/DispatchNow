"use client";
// File path: app/components/maps/DispatchNowMap.tsx
// Purpose: Reusable map component for rendering incidents/reports + picking + filter bar (dark/red style)

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

export type IncidentForMap = {
    id: string;
    title: string | null;
    description?: string | null;
    type?: string | null;
    status?: string | null;
    priority?: string | null;
    lat: number | null;
    lng: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export type ReportForMap = {
    id: string;
    type: string | null;
    description?: string | null;
    status?: string | null;
    lat: number | null;
    lng: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    userId?: string | null;
};

export type DispatchNowMapSelection =
    | { kind: "incident"; id: string }
    | { kind: "report"; id: string };

export type DispatchNowMapHandle = {
    getMap: () => google.maps.Map | null;
    zoomToDefault: () => void;
    fitAll: () => void;
    focusIncident: (id: string) => void;
    focusReport: (id: string) => void;
};

type SelectedState = { kind: "incident" | "report" | null; id: string | null };

type Props = {
    mapsReady: boolean;
    incidents: IncidentForMap[];
    reports?: ReportForMap[];
    showReports?: boolean;

    selected?: SelectedState;
    onSelect?: (sel: DispatchNowMapSelection) => void;

    picking?: boolean;
    onPick?: (lat: number, lng: number) => void;

    className?: string;
};

const TORONTO_CENTER = { lat: 43.6532, lng: -79.3832 };
const TORONTO_DEFAULT_ZOOM = 12;

const REPORT_COLOR = "#38bdf8";

const INCIDENT_TYPES_ORDER = [
    "all",
    "fire",
    "flood",
    "severe_weather",
    "road_closure",
    "hazmat",
    "others",
] as const;

const TYPE_LABEL: Record<string, string> = {
    all: "All",
    fire: "Fire",
    flood: "Flood",
    severe_weather: "Severe weather",
    road_closure: "Road closure",
    hazmat: "Hazmat",
    others: "Others",
};

// Dark + subtle red accents + hide POI/transit icons
const DARK_RED_MAP_STYLE: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#0b0b0f" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0f" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },

    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#2a2a33" }],
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#b0b6c3" }],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#b0b6c3" }],
    },

    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#12121a" }] },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#80889a" }],
    },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0f1412" }] },

    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a24" }] },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#3b0f14" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#aeb6c6" }],
    },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2a0f14" }] },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#7f1d1d" }, { weight: 0.6 }],
    },

    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#14141c" }] },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9aa3b5" }],
    },

    { featureType: "water", elementType: "geometry", stylers: [{ color: "#080a12" }] },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7c879d" }],
    },

    { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },

    // { featureType: "poi", stylers: [{ visibility: "off" }] },
    // { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function safeText(v: unknown, fallback = "-") {
    const s = String(v ?? "");
    return s.trim().length > 0 ? s : fallback;
}

function safeISO(v: unknown, fallback = "N/A") {
    const s = String(v ?? "").trim();
    return s ? s : fallback;
}

function normalizeIncidentType(v: unknown): string {
    const raw = typeof v === "string" ? v.trim().toLowerCase() : "";
    const allowed = new Set(INCIDENT_TYPES_ORDER.filter((x) => x !== "all"));
    return allowed.has(raw) ? raw : "others";
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

// Marker size scales with zoom so icons look reasonable at far zoom-outs
function iconPxForZoom(zoom: number, kind: "incident" | "report") {
    // Tune these numbers to match your UI preference
    const base = kind === "incident" ? 34 : 26; // around zoom ~14
    const scale = Math.pow(1.12, zoom - 14); // +/- 1 zoom changes size ~12%
    return clamp(Math.round(base * scale), kind === "incident" ? 14 : 12, kind === "incident" ? 46 : 36);
}

function getIncidentPngIcon(type: string, zoom: number) {
    const key = normalizeIncidentType(type);
    const px = iconPxForZoom(zoom, "incident");

    return {
        url: `/markers/incidents/${key}.png`,
        scaledSize: new google.maps.Size(px, px),
        anchor: new google.maps.Point(px / 2, px / 2),
    } as google.maps.Icon;
}

function getReportMarkerIcon(color = REPORT_COLOR, zoom = TORONTO_DEFAULT_ZOOM) {
    const px = iconPxForZoom(zoom, "report");

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
  <path fill="${color}" d="M12 2c-3.314 0-6 2.686-6 6c0 4.418 6 14 6 14s6-9.582 6-14c0-3.314-2.686-6-6-6zm0 9a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/>
</svg>
  `.trim();

    return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(px, px),
        anchor: new google.maps.Point(px / 2, px),
    } as google.maps.Icon;
}

function buildIncidentInfoNode(incident: IncidentForMap) {
    const wrap = document.createElement("div");
    wrap.style.maxWidth = "300px";
    wrap.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    wrap.style.background = "#0b0b0f";
    wrap.style.border = "none";
    wrap.style.borderRadius = "12px";
    wrap.style.padding = "12px";
    wrap.style.color = "#f9fafb";
    wrap.style.boxShadow = "none";

    const title = document.createElement("div");
    title.style.fontWeight = "800";
    title.style.color = "#f9fafb";
    title.style.marginBottom = "8px";
    title.style.fontSize = "14px";
    title.textContent = safeText(incident.title, "Untitled Incident");

    const meta = document.createElement("div");
    meta.style.fontSize = "12px";
    meta.style.opacity = "0.95";
    meta.style.marginBottom = "10px";
    meta.textContent = `Type: ${safeText(incident.type)} | Priority: ${safeText(
        incident.priority
    )} | Status: ${safeText(incident.status)}`;

    const detailsLabel = document.createElement("div");
    detailsLabel.style.fontSize = "12px";
    detailsLabel.style.fontWeight = "700";
    detailsLabel.style.opacity = "0.95";
    detailsLabel.style.marginBottom = "6px";
    detailsLabel.textContent = "Details";

    const desc = document.createElement("div");
    desc.style.fontSize = "12px";
    desc.style.opacity = "0.95";
    desc.style.whiteSpace = "pre-wrap";
    desc.style.marginBottom = "10px";
    desc.textContent = incident.description?.trim() ? incident.description.trim() : "No details";

    const coords = document.createElement("div");
    coords.style.fontSize = "12px";
    coords.style.opacity = "0.9";
    const latTxt = incident.lat == null ? "N/A" : Number(incident.lat).toFixed(5);
    const lngTxt = incident.lng == null ? "N/A" : Number(incident.lng).toFixed(5);
    coords.textContent = `Location: (${latTxt}, ${lngTxt})`;

    wrap.appendChild(title);
    wrap.appendChild(meta);
    wrap.appendChild(detailsLabel);
    wrap.appendChild(desc);
    wrap.appendChild(coords);

    return wrap;
}

function buildReportInfoNode(report: ReportForMap) {
    const wrap = document.createElement("div");
    wrap.style.maxWidth = "300px";
    wrap.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    wrap.style.background = "#0b0b0f";
    wrap.style.border = "none";
    wrap.style.borderRadius = "12px";
    wrap.style.padding = "12px";
    wrap.style.color = "#f9fafb";
    wrap.style.boxShadow = "none";

    const title = document.createElement("div");
    title.style.fontWeight = "800";
    title.style.marginBottom = "8px";
    title.style.fontSize = "14px";
    title.textContent = safeText(report.type, "Report");

    const meta = document.createElement("div");
    meta.style.fontSize = "12px";
    meta.style.opacity = "0.95";
    meta.style.marginBottom = "10px";
    meta.textContent = `Type: ${safeText(report.type)} | Status: ${safeText(report.status)}`;

    const detailsLabel = document.createElement("div");
    detailsLabel.style.fontSize = "12px";
    detailsLabel.style.fontWeight = "700";
    detailsLabel.style.opacity = "0.95";
    detailsLabel.style.marginBottom = "6px";
    detailsLabel.textContent = "Details";

    const desc = document.createElement("div");
    desc.style.fontSize = "12px";
    desc.style.opacity = "0.95";
    desc.style.whiteSpace = "pre-wrap";
    desc.style.marginBottom = "10px";
    desc.textContent = report.description?.trim() ? report.description.trim() : "No details";

    const coords = document.createElement("div");
    coords.style.fontSize = "12px";
    coords.style.opacity = "0.9";
    const latTxt = report.lat == null ? "N/A" : Number(report.lat).toFixed(5);
    const lngTxt = report.lng == null ? "N/A" : Number(report.lng).toFixed(5);
    coords.textContent = `Location: (${latTxt}, ${lngTxt})`;

    wrap.appendChild(title);
    wrap.appendChild(meta);
    wrap.appendChild(detailsLabel);
    wrap.appendChild(desc);
    wrap.appendChild(coords);

    return wrap;
}

const DispatchNowMap = forwardRef<DispatchNowMapHandle, Props>(function DispatchNowMap(
    {
        mapsReady,
        incidents,
        reports = [],
        showReports = true,
        selected,
        onSelect,
        picking = false,
        onPick,
        className,
    },
    ref
) {
    const mapDivRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    const incidentMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
    const reportMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());

    // Keep a memory of incident type for icon refresh on zoom changes
    const incidentTypeByIdRef = useRef<Map<string, string>>(new Map());

    const [typeFilter, setTypeFilter] = useState<(typeof INCIDENT_TYPES_ORDER)[number]>("all");

    const pickingRef = useRef(picking);
    const onPickRef = useRef<typeof onPick>(onPick);

    useEffect(() => {
        pickingRef.current = picking;
    }, [picking]);

    useEffect(() => {
        onPickRef.current = onPick;
    }, [onPick]);

    const incidentsWithCoords = useMemo(
        () => incidents.filter((x) => x.lat != null && x.lng != null),
        [incidents]
    );

    const reportsWithCoords = useMemo(
        () => reports.filter((x) => x.lat != null && x.lng != null),
        [reports]
    );

    const visibleIncidents = useMemo(() => {
        if (typeFilter === "all") return incidentsWithCoords;
        return incidentsWithCoords.filter((i) => normalizeIncidentType(i.type) === typeFilter);
    }, [incidentsWithCoords, typeFilter]);

    const incidentById = useMemo(() => {
        const m = new Map<string, IncidentForMap>();
        for (const i of incidentsWithCoords) m.set(i.id, i);
        return m;
    }, [incidentsWithCoords]);

    const reportById = useMemo(() => {
        const m = new Map<string, ReportForMap>();
        for (const r of reportsWithCoords) m.set(r.id, r);
        return m;
    }, [reportsWithCoords]);

    useEffect(() => {
        if (!mapsReady) return;
        if (!mapDivRef.current) return;
        if (mapRef.current) return;

        const map = new google.maps.Map(mapDivRef.current, {
            center: TORONTO_CENTER,
            zoom: TORONTO_DEFAULT_ZOOM,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: DARK_RED_MAP_STYLE,
            backgroundColor: "#0b0b0f",
        });

        mapRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        const clickListener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (!pickingRef.current) return;
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onPickRef.current?.(lat, lng);
        });

        // Refresh marker icon sizes when zoom changes
        const zoomListener = map.addListener("zoom_changed", () => {
            const z = map.getZoom() ?? TORONTO_DEFAULT_ZOOM;

            for (const [id, marker] of incidentMarkersRef.current.entries()) {
                const t = incidentTypeByIdRef.current.get(id) ?? "others";
                marker.setIcon(getIncidentPngIcon(t, z));
            }

            for (const [, marker] of reportMarkersRef.current.entries()) {
                marker.setIcon(getReportMarkerIcon(REPORT_COLOR, z));
            }
        });

        return () => {
            google.maps.event.removeListener(clickListener);
            google.maps.event.removeListener(zoomListener);
        };
    }, [mapsReady]);

    // picking
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        map.setOptions({ draggableCursor: picking ? "crosshair" : undefined });
    }, [picking]);

    // incidents markers
    useEffect(() => {
        const map = mapRef.current;
        const infoWindow = infoWindowRef.current;
        if (!map || !infoWindow) return;

        const nextIds = new Set(visibleIncidents.map((i) => i.id));
        for (const [id, marker] of incidentMarkersRef.current.entries()) {
            if (!nextIds.has(id)) {
                marker.setMap(null);
                incidentMarkersRef.current.delete(id);
                incidentTypeByIdRef.current.delete(id);
            }
        }

        const z = map.getZoom() ?? TORONTO_DEFAULT_ZOOM;

        for (const incident of visibleIncidents) {
            const pos = { lat: incident.lat as number, lng: incident.lng as number };
            let marker = incidentMarkersRef.current.get(incident.id);

            const normalizedType = normalizeIncidentType(incident.type);
            incidentTypeByIdRef.current.set(incident.id, normalizedType);

            const icon = getIncidentPngIcon(normalizedType, z);

            if (!marker) {
                marker = new google.maps.Marker({
                    position: pos,
                    map,
                    title: incident.title ?? "Incident",
                    icon,
                });

                marker.addListener("click", () => {
                    onSelect?.({ kind: "incident", id: incident.id });
                    infoWindow.setContent(buildIncidentInfoNode(incident));
                    infoWindow.open({ map, anchor: marker! });
                });

                incidentMarkersRef.current.set(incident.id, marker);
            } else {
                marker.setPosition(pos);
                marker.setIcon(icon);
            }
        }
    }, [visibleIncidents, onSelect]);

    // reports marker
    useEffect(() => {
        if (!showReports) {
            for (const [, marker] of reportMarkersRef.current.entries()) marker.setMap(null);
            reportMarkersRef.current.clear();
            return;
        }

        const map = mapRef.current;
        const infoWindow = infoWindowRef.current;
        if (!map || !infoWindow) return;

        const nextIds = new Set(reportsWithCoords.map((r) => r.id));
        for (const [id, marker] of reportMarkersRef.current.entries()) {
            if (!nextIds.has(id)) {
                marker.setMap(null);
                reportMarkersRef.current.delete(id);
            }
        }

        const z = map.getZoom() ?? TORONTO_DEFAULT_ZOOM;

        for (const report of reportsWithCoords) {
            const pos = { lat: report.lat as number, lng: report.lng as number };
            let marker = reportMarkersRef.current.get(report.id);

            const icon = getReportMarkerIcon(REPORT_COLOR, z);

            if (!marker) {
                marker = new google.maps.Marker({
                    position: pos,
                    map,
                    title: report.type ?? "Report",
                    icon,
                });

                marker.addListener("click", () => {
                    onSelect?.({ kind: "report", id: report.id });
                    infoWindow.setContent(buildReportInfoNode(report));
                    infoWindow.open({ map, anchor: marker! });
                });

                reportMarkersRef.current.set(report.id, marker);
            } else {
                marker.setPosition(pos);
                marker.setIcon(icon);
            }
        }
    }, [reportsWithCoords, showReports, onSelect]);

    useImperativeHandle(
        ref,
        (): DispatchNowMapHandle => ({
            getMap: () => mapRef.current,

            zoomToDefault: () => {
                const map = mapRef.current;
                if (!map) return;
                map.panTo(TORONTO_CENTER);
                map.setZoom(TORONTO_DEFAULT_ZOOM);
            },

            fitAll: () => {
                const map = mapRef.current;
                if (!map) return;

                const points: Array<{ lat: number; lng: number }> = [];
                for (const i of visibleIncidents) points.push({ lat: i.lat as number, lng: i.lng as number });
                if (showReports)
                    for (const r of reportsWithCoords) points.push({ lat: r.lat as number, lng: r.lng as number });

                if (points.length === 0) {
                    map.panTo(TORONTO_CENTER);
                    map.setZoom(TORONTO_DEFAULT_ZOOM);
                    return;
                }

                const bounds = new google.maps.LatLngBounds();
                for (const p of points) bounds.extend(p);
                map.fitBounds(bounds);

                const z = map.getZoom();
                if (typeof z === "number" && z < 10) map.setZoom(10);
            },

            focusIncident: (id: string) => {
                const map = mapRef.current;
                const infoWindow = infoWindowRef.current;
                if (!map || !infoWindow) return;

                const incident = incidentById.get(id);
                if (!incident || incident.lat == null || incident.lng == null) return;

                const pos = { lat: incident.lat, lng: incident.lng };
                map.panTo(pos);
                map.setZoom(Math.max(map.getZoom() ?? TORONTO_DEFAULT_ZOOM, 14));

                const marker = incidentMarkersRef.current.get(id);
                infoWindow.setContent(buildIncidentInfoNode(incident));
                if (marker) {
                    infoWindow.open({ map, anchor: marker });
                } else {
                    infoWindow.setPosition(pos);
                    infoWindow.open({ map });
                }
            },

            focusReport: (id: string) => {
                const map = mapRef.current;
                const infoWindow = infoWindowRef.current;
                if (!map || !infoWindow) return;

                const report = reportById.get(id);
                if (!report || report.lat == null || report.lng == null) return;

                const pos = { lat: report.lat, lng: report.lng };
                map.panTo(pos);
                map.setZoom(Math.max(map.getZoom() ?? TORONTO_DEFAULT_ZOOM, 14));

                const marker = reportMarkersRef.current.get(id);
                infoWindow.setContent(buildReportInfoNode(report));
                if (marker) {
                    infoWindow.open({ map, anchor: marker });
                } else {
                    infoWindow.setPosition(pos);
                    infoWindow.open({ map });
                }
            },
        }),
        [incidentById, reportById, reportsWithCoords, showReports, visibleIncidents]
    );

    return (
        <div className={["relative w-full h-full", className ?? ""].join(" ")}>
            <style>{`
        .gm-style .gm-style-iw-c {
          background: #0b0b0f !important;
          padding: 0 !important;
          border: 1px solid rgba(239, 68, 68, 0.65) !important;
          border-radius: 12px !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.45) !important;
        }
        .gm-style .gm-style-iw-d {
          overflow: hidden !important;
          background: transparent !important;
        }
        .gm-style .gm-style-iw-t::after {
          background: #0b0b0f !important;
        }
        .gm-style .gm-ui-hover-effect {
          filter: invert(1) !important;
          opacity: 0.9 !important;
        }
      `}</style>

            <div className="absolute inset-0" ref={mapDivRef} />

            <div className="absolute top-4 right-4 z-50">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/85 backdrop-blur px-3 py-2 shadow-lg">
                    <div className="text-[11px] text-zinc-300 mb-1">Filter incidents</div>
                    <select
                        className="w-[200px] rounded bg-zinc-900 border border-zinc-700 px-2 py-2 text-sm outline-none focus:border-red-600"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                    >
                        {INCIDENT_TYPES_ORDER.map((t) => (
                            <option key={t} value={t}>
                                {TYPE_LABEL[t]}
                            </option>
                        ))}
                    </select>

                    <div className="text-[10px] text-zinc-400 mt-2">
                        Showing:{" "}
                        {typeFilter === "all"
                            ? `${visibleIncidents.length} incidents`
                            : `${visibleIncidents.length} ${TYPE_LABEL[typeFilter]}`}
                    </div>
                </div>
            </div>

            {!mapsReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-sm text-zinc-200">Loading Google Maps...</div>
                </div>
            )}
        </div>
    );
});

export default DispatchNowMap;