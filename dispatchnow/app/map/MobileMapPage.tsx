// File path: app/map/MobileMapPage.tsx
// Purpose: Mobile layout for incidents map (map + bottom list)

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type IncidentForMap = {
    id: string;
    title: string | null;
    status?: string | null;
    priority?: string | null;
    lat: number | null;
    lng: number | null;
};

function escapeText(s: unknown) {
    return String(s ?? "");
}

function buildInfoNode(incident: IncidentForMap) {
    const wrap = document.createElement("div");
    wrap.style.maxWidth = "240px";

    const title = document.createElement("div");
    title.style.fontWeight = "600";
    title.style.marginBottom = "6px";
    title.textContent = escapeText(incident.title || "Untitled Incident");

    const meta = document.createElement("div");
    meta.style.fontSize = "12px";
    meta.style.opacity = "0.9";
    meta.textContent = `Status: ${escapeText(incident.status)} | Priority: ${escapeText(
        incident.priority
    )}`;

    wrap.appendChild(title);
    wrap.appendChild(meta);

    return wrap;
}

export default function MobileMapPage({ mapsReady }: { mapsReady: boolean }) {
    const mapDivRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [incidents, setIncidents] = useState<IncidentForMap[]>([]);
    const [sheetOpen, setSheetOpen] = useState(true);

    const incidentsWithCoords = useMemo(
        () => incidents.filter((x) => x.lat != null && x.lng != null),
        [incidents]
    );

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("/api/incidents", { method: "GET" });
                if (res.status === 401) {
                    throw new Error("UNAUTHORIZED (please sign in)");
                }
                const json = await res.json();
                const list = (json?.data ?? []) as IncidentForMap[];

                if (!cancelled) {
                    const normalized = list.map((x) => ({
                        ...x,
                        lat: x.lat == null ? null : Number(x.lat),
                        lng: x.lng == null ? null : Number(x.lng),
                    }));
                    setIncidents(normalized);
                }
            } catch (e) {
                if (!cancelled) setError((e as Error).message || "Failed to load incidents");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!mapsReady) return;
        if (!mapDivRef.current) return;
        if (mapRef.current) return;

        mapRef.current = new google.maps.Map(mapDivRef.current, {
            center: { lat: 43.6532, lng: -79.3832 },
            zoom: 11,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        infoWindowRef.current = new google.maps.InfoWindow();
    }, [mapsReady]);

    useEffect(() => {
        const map = mapRef.current;
        const infoWindow = infoWindowRef.current;
        if (!map || !infoWindow) return;

        const nextIds = new Set(incidentsWithCoords.map((i) => i.id));
        for (const [id, marker] of markersRef.current.entries()) {
            if (!nextIds.has(id)) {
                marker.setMap(null);
                markersRef.current.delete(id);
            }
        }

        for (const incident of incidentsWithCoords) {
            const pos = { lat: incident.lat as number, lng: incident.lng as number };
            let marker = markersRef.current.get(incident.id);

            if (!marker) {
                marker = new google.maps.Marker({
                    position: pos,
                    map,
                    title: incident.title ?? "Incident",
                });

                marker.addListener("click", () => {
                    infoWindow.setContent(buildInfoNode(incident));
                    infoWindow.open({ map, anchor: marker! });
                });

                markersRef.current.set(incident.id, marker);
            } else {
                marker.setPosition(pos);
            }
        }

        if (incidentsWithCoords.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            for (const i of incidentsWithCoords) {
                bounds.extend({ lat: i.lat as number, lng: i.lng as number });
            }
            map.fitBounds(bounds);
        }
    }, [incidentsWithCoords]);

    function focusIncident(incident: IncidentForMap) {
        const map = mapRef.current;
        const infoWindow = infoWindowRef.current;
        if (!map || !infoWindow) return;

        if (incident.lat == null || incident.lng == null) return;

        const marker = markersRef.current.get(incident.id);
        if (!marker) return;

        map.panTo({ lat: incident.lat, lng: incident.lng });
        map.setZoom(Math.max(map.getZoom() ?? 11, 14));
        infoWindow.setContent(buildInfoNode(incident));
        infoWindow.open({ map, anchor: marker });
        setSheetOpen(false);
    }

    return (
        <div className="h-screen relative">
            <div className="absolute inset-0" ref={mapDivRef} />

            {!mapsReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <div className="text-sm">Loading Google Maps…</div>
                </div>
            )}

            <div className="absolute top-3 left-3 right-3 bg-white/95 rounded shadow p-3">
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">Incidents Map (Test)</div>
                    <button
                        className="text-xs underline"
                        onClick={() => setSheetOpen((v) => !v)}
                    >
                        {sheetOpen ? "Hide list" : "Show list"}
                    </button>
                </div>

                {loading && <div className="text-xs mt-2">Loading incidents…</div>}
                {error && <div className="text-xs mt-2 text-red-600">Error: {error}</div>}
            </div>

            {sheetOpen && (
                <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-xl shadow-lg max-h-[45vh] overflow-auto">
                    <div className="p-3 border-b">
                        <div className="text-sm font-medium">Incidents</div>
                        <div className="text-xs text-gray-600 mt-1">
                            Tap an item to focus on the map
                        </div>
                    </div>

                    <div className="p-3 space-y-2">
                        {incidents.map((i) => {
                            const hasCoords = i.lat != null && i.lng != null;

                            return (
                                <button
                                    key={i.id}
                                    className="w-full text-left rounded border border-gray-200 p-3"
                                    onClick={() => focusIncident(i)}
                                    disabled={!hasCoords}
                                    title={!hasCoords ? "No location (lat/lng is null)" : "Focus on map"}
                                >
                                    <div className="font-medium text-sm">{i.title ?? "Untitled Incident"}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Status: {i.status ?? "-"} | Priority: {i.priority ?? "-"}
                                    </div>
                                    <div className="text-xs mt-1">
                                        {hasCoords ? (
                                            <span className="text-gray-700">
                                                ({i.lat?.toFixed(5)}, {i.lng?.toFixed(5)})
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">No location</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

