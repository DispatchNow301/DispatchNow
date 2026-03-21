"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Home, X } from "lucide-react";
import type { LatLngBounds, LatLngTuple } from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, useMap } from "react-leaflet";
import * as L from "leaflet";
import Inventory from "./Inventory";
import { vigilantes } from "@/app/components/data/vigilante";
import VettingMinigameModal from "@/components/game/VettingMinigameModal";

if (typeof window !== "undefined") {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const Lf = require("leaflet");
	const proto = Lf.GridLayer?.prototype;
	if (proto && !proto._edgeBufferPatched) {
		const orig = proto._setView;
		proto._setView = function (
			center: unknown,
			zoom: unknown,
			noPrune?: unknown,
			noUpdate?: unknown,
		) {
			const saved = this.options.keepBuffer;
			this.options.keepBuffer = Math.max(saved ?? 2, 6);
			orig.call(this, center, zoom, noPrune, noUpdate);
			this.options.keepBuffer = saved;
		};
		Lf.GridLayer.include({
			options: { ...proto.options, fadeAnimation: false },
		});
		proto._edgeBufferPatched = true;
	}
}

type Props = {
	saveKey: string;
};

type IncidentCategory = "fire" | "robbery" | "medical";
type IncidentStatus = "active" | "resolved";

type Incident = {
	id: string;
	category: IncidentCategory;
	status: IncidentStatus;
	lat: number;
	lng: number;
	title: string;
	summary: string;
	createdAt: number;
	expiresAt: number;
	successChance: number;
};

type CharacterKind = "vigilante" | "citizen" | "police";
type OverlayMode = "recruit" | "owned";

type CharacterPin = {
	id: string;
	name: string;
	initial: string;
	kind: CharacterKind;
	lat: number;
	lng: number;
};

type RecruitLead = {
	id: string;
	vigilanteId: string;
	lat: number;
	lng: number;
	createdAt: number;
	expiresAt: number;
};

type GameState = {
	level: number;
	selectedIncidentId: string | null;
	incidents: Incident[];
	showIncidentPanel: boolean;
	showInventoryPanel: boolean;
	ownedVigilanteIds: string[];
	recruitLeads: RecruitLead[];
};

const CENTER: LatLngTuple = [40.7128, -74.006];
const BASE: LatLngTuple = [40.7139, -74.0038];
const HOMEBASE_POS: LatLngTuple = [40.7139, -74.0038];

const LEVELS = [
	{ id: 1, label: "L1", zoomOut: 15, zoomIn: 15 },
	{ id: 2, label: "L2", zoomOut: 14, zoomIn: 14 },
	{ id: 3, label: "L3", zoomOut: 13, zoomIn: 13 },
];

const STATIC_CHARACTER_BASES: CharacterPin[] = [
	{ id: "cit-oldman", name: "Old Man", initial: "O", kind: "citizen", lat: 40.713, lng: -74.0112 },
	{ id: "cit-girl", name: "Girl", initial: "G", kind: "citizen", lat: 40.7178, lng: -74.0014 },
	{ id: "cit-woman", name: "Woman", initial: "W", kind: "citizen", lat: 40.7102, lng: -74.0005 },
	{ id: "cit-helper", name: "Helper", initial: "H", kind: "citizen", lat: 40.7185, lng: -74.0072 },

	{ id: "cop-diaz", name: "Officer Diaz", initial: "D", kind: "police", lat: 40.7129, lng: -73.9998 },
	{ id: "cop-kim", name: "Detective Kim", initial: "K", kind: "police", lat: 40.7166, lng: -74.01 },
	{ id: "chief-williams", name: "Chief Williams", initial: "C", kind: "police", lat: 40.7095, lng: -74.0069 },
];

type DialogueRole = "Citizen" | "Police" | "Chief";

type DialogueState = {
	name: string;
	role: DialogueRole;
	portrait: string;
	text: string;
} | null;

const NPC_DIALOGUE = {
	citizens: [
		{
			name: "Old Man",
			role: "Citizen" as const,
			portrait: "/npcs/OldMan.png",
			lines: [
				"I've lived on this block thirty years. Something's wrong tonight.",
				"I heard boots in the alley and then everything went quiet.",
				"You vigilantes are the only ones keeping this city together.",
			],
		},
		{
			name: "Girl",
			role: "Citizen" as const,
			portrait: "/npcs/Girl.png",
			lines: [
				"I saw them run past the subway entrance. They looked armed.",
				"If your crew is taking this job, don't be late.",
				"People are scared. Nobody's waiting for the cops anymore.",
			],
		},
		{
			name: "Woman",
			role: "Citizen" as const,
			portrait: "/npcs/Woman.png",
			lines: [
				"The whole street feels wrong tonight. Like everyone's waiting for something.",
				"I'm not asking questions. I just need this handled.",
				"They moved fast. Professional fast.",
			],
		},
		{
			name: "Helper",
			role: "Citizen" as const,
			portrait: "/npcs/Helper.png",
			lines: [
				"I can point your people to the exact building if they move now.",
				"I've got eyes on the block. Tell me where you want me.",
				"Your vigilantes aren't subtle, but they're faster than dispatch.",
			],
		},
	],
	police: [
		{
			name: "Officer Diaz",
			role: "Police" as const,
			portrait: "/npcs/OfficerDiaz.png",
			lines: [
				"You better hope I don't catch any of your people at my crime scenes.",
				"Civilian intervention is punishable, don't test me.",
				"HEY! STOP RIGHT THERE!",
			],
		},
		{
			name: "Detective Kim",
			role: "Police" as const,
			portrait: "/npcs/DetectiveKim.png",
			lines: [
				"This city makes vigilantes out of everyone eventually.",
				"When your people make messes for us to clean up, we don't get the chance to focus on what's really important...",
				"There's a pattern here. I know what you've been up to… I just need to prove it.",
			],
		},
	],
	chief: {
		name: "Chief Williams",
		role: "Chief" as const,
		portrait: "/npcs/ChiefWilliams.png",
		lines: [
			"The city is slipping faster than my officers can hold it together.",
			"Damn vigilantes running around the city thinking they're helping us. We don't need them.",
			"If you're going to play guardian, then act like professionals.",
		],
	},
};

function incidentCategoryLabel(cat: IncidentCategory) {
	if (cat === "fire") return "Fire";
	if (cat === "robbery") return "Robbery";
	return "Medical";
}

function levelConfig(level: number) {
	return LEVELS[Math.max(0, Math.min(level - 1, LEVELS.length - 1))];
}

function sampleInBounds(bounds: LatLngBounds): { lat: number; lng: number } {
	const south = bounds.getSouth();
	const north = bounds.getNorth();
	const west = bounds.getWest();
	const east = bounds.getEast();

	const inset = 0.04;
	const latSpan = (north - south) * (1 - inset * 2);
	const lngSpan = (east - west) * (1 - inset * 2);

	const lat = south + (north - south) * inset + Math.random() * latSpan;
	const lng = west + (east - west) * inset + Math.random() * lngSpan;

	return { lat, lng };
}

function nudgeNearby(lat: number, lng: number) {
	const maxOffset = 0.0014;
	return {
		lat: lat + (Math.random() - 0.5) * maxOffset,
		lng: lng + (Math.random() - 0.5) * maxOffset,
	};
}

function nudgeNearPoint(lat: number, lng: number, maxOffset = 0.00085) {
	return {
		lat: lat + (Math.random() - 0.5) * maxOffset,
		lng: lng + (Math.random() - 0.5) * maxOffset,
	};
}

function moveToward(
	from: { lat: number; lng: number },
	to: { lat: number; lng: number },
	factor: number,
) {
	return {
		lat: from.lat + (to.lat - from.lat) * factor,
		lng: from.lng + (to.lng - from.lng) * factor,
	};
}

function distanceSq(
	a: { lat: number; lng: number },
	b: { lat: number; lng: number },
) {
	const dLat = a.lat - b.lat;
	const dLng = a.lng - b.lng;
	return dLat * dLat + dLng * dLng;
}

function pushAwayFromPoint(
	point: { lat: number; lng: number },
	center: { lat: number; lng: number },
	minDistance: number,
) {
	const dLat = point.lat - center.lat;
	const dLng = point.lng - center.lng;
	const dist = Math.sqrt(dLat * dLat + dLng * dLng);

	if (dist >= minDistance) return point;

	if (dist < 1e-9) {
		return {
			lat: center.lat + minDistance,
			lng: center.lng,
		};
	}

	const scale = minDistance / dist;
	return {
		lat: center.lat + dLat * scale,
		lng: center.lng + dLng * scale,
	};
}

function randomFrom<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function computeSuccessChance(cat: IncidentCategory, lifetimeMs: number) {
	const base = cat === "fire" ? 0.65 : cat === "robbery" ? 0.5 : 0.7;
	const t = Math.min(lifetimeMs / (5 * 60_000), 1);
	const noise = (Math.random() - 0.5) * 0.1;
	return Math.round(
		Math.max(0.05, Math.min(0.95, base - 0.25 * t + noise)) * 100,
	);
}

function makeIncident(lat: number, lng: number): Incident {
	const now = Date.now();
	const categories: IncidentCategory[] = ["fire", "robbery", "medical"];
	const category = categories[Math.floor(Math.random() * categories.length)];
	const lifetimeMs = 30_000;

	return {
		id: `incident_${Math.random().toString(16).slice(2)}_${now.toString(16)}`,
		category,
		status: "active",
		lat,
		lng,
		title:
			category === "fire"
				? "Alleyway Fire"
				: category === "robbery"
					? "Corner Store Robbery"
					: "Medical Emergency",
		summary:
			category === "fire"
				? "Reports of smoke near a tenement block. Neighbors say they heard shouting."
				: category === "robbery"
					? "Masked figures spotted running from a storefront. No sirens yet."
					: "Caller reports someone collapsed on a dimly lit street.",
		createdAt: now,
		expiresAt: now + lifetimeMs,
		successChance: computeSuccessChance(category, lifetimeMs),
	};
}

function makeRecruitLead(vigilanteId: string, bounds: LatLngBounds): RecruitLead {
	const now = Date.now();
	const lifetimeMs = 40_000;
	const { lat, lng } = sampleInBounds(bounds);

	return {
		id: `recruit_${vigilanteId}_${now.toString(16)}`,
		vigilanteId,
		lat,
		lng,
		createdAt: now,
		expiresAt: now + lifetimeMs,
	};
}

function makeIncidentIcon(category: IncidentCategory, isSelected: boolean, isResolved: boolean) {
	const border = isSelected ? "#b91c1c" : "#7f1d1d";
	const baseColor = "#f97373";
	const bg = isResolved ? "rgba(24,24,27,0.9)" : "rgba(127,29,29,0.6)";
	const pulse = !isResolved && isSelected;

	const html = `<div style="
		width:28px;height:28px;border-radius:999px;
		border:2px solid ${border};background:${bg};
		display:flex;align-items:center;justify-content:center;
		color:${baseColor};font-weight:800;font-size:16px;
		text-shadow:0 0 4px rgba(0,0,0,0.9);
		box-shadow:0 0 16px rgba(0,0,0,0.9);">!</div>`;

	return L.divIcon({
		html,
		className: pulse
			? "vigilante-incident-icon vigilante-incident-icon-pulse"
			: "vigilante-incident-icon",
		iconSize: [28, 28],
		iconAnchor: [14, 14],
	});
}

function makeCharacterIcon(initial: string, kind: CharacterKind) {
	const palette =
		kind === "police"
			? {
					border: "#1d4ed8",
					bg: "rgba(30,64,175,0.78)",
					text: "#dbeafe",
				}
			: {
					border: "#4b5563",
					bg: "rgba(55,65,81,0.8)",
					text: "#f3f4f6",
				};

	const html = `<div style="
		width:30px;
		height:30px;
		border-radius:999px;
		border:2px solid ${palette.border};
		background:${palette.bg};
		display:flex;
		align-items:center;
		justify-content:center;
		color:${palette.text};
		font-weight:800;
		font-size:14px;
		text-shadow:0 0 4px rgba(0,0,0,0.8);
		box-shadow:0 0 14px rgba(0,0,0,0.85);
		cursor:pointer;
	">${initial}</div>`;

	return L.divIcon({
		html,
		className: "vigilante-character-icon",
		iconSize: [30, 30],
		iconAnchor: [15, 15],
	});
}

function makeRecruitIcon(initial: string) {
	const html = `<div style="
		width:34px;
		height:34px;
		border-radius:999px;
		border:2px solid #b45309;
		background:rgba(120,53,15,0.86);
		display:flex;
		align-items:center;
		justify-content:center;
		color:#fde68a;
		font-weight:800;
		font-size:15px;
		text-shadow:0 0 4px rgba(0,0,0,0.85);
		box-shadow:0 0 18px rgba(120,53,15,0.55);
		cursor:pointer;
	">${initial}</div>`;

	return L.divIcon({
		html,
		className: "vigilante-recruit-icon",
		iconSize: [34, 34],
		iconAnchor: [17, 17],
	});
}

function makeHomebaseIcon() {
	const html = `<div style="
		width:36px;
		height:36px;
		border-radius:12px;
		border:2px solid #7c2d12;
		background:rgba(20,20,20,0.92);
		display:flex;
		align-items:center;
		justify-content:center;
		color:#fde68a;
		font-weight:800;
		font-size:18px;
		text-shadow:0 0 4px rgba(0,0,0,0.85);
		box-shadow:0 0 16px rgba(0,0,0,0.9);
		cursor:pointer;
	">⌂</div>`;

	return L.divIcon({
		html,
		className: "vigilante-homebase-icon",
		iconSize: [36, 36],
		iconAnchor: [18, 18],
	});
}

function ZoomController({
	level,
	onBoundsReady,
}: {
	level: number;
	onBoundsReady: (level: number, bounds: LatLngBounds) => void;
}) {
	const map = useMap();

	useEffect(() => {
		const lvl = levelConfig(level);

		const pane = map.getPane("mapPane");
		if (!pane) return;

		map.setMinZoom(lvl.zoomOut);
		map.setMaxZoom(lvl.zoomIn);
		map.setMaxBounds(undefined as unknown as LatLngBounds);
		map.invalidateSize({ animate: false });

		requestAnimationFrame(() => {
			const safePane = map.getPane("mapPane");
			if (!safePane) return;

			map.setView(BASE, lvl.zoomOut, { animate: false });

			requestAnimationFrame(() => {
				const finalPane = map.getPane("mapPane");
				if (!finalPane) return;

				try {
					const b = map.getBounds();
					map.setMaxBounds(b);
					onBoundsReady(lvl.id, b);
				} catch {
					//
				}
			});
		});
	}, [level, map, onBoundsReady]);

	return null;
}

const TimerBar = React.memo(function TimerBar({
	createdAt,
	expiresAt,
	onExpire,
}: {
	createdAt: number;
	expiresAt: number;
	onExpire: () => void;
}) {
	const totalMs = expiresAt - createdAt;
	const delayMs = useRef(createdAt - Date.now()).current;

	return (
		<div className="mt-2 h-[3px] w-full rounded-full bg-amber-900/40 overflow-hidden">
			<div
				style={{
					animationName: "vigilante-timer-drain",
					animationDuration: `${totalMs}ms`,
					animationDelay: `${delayMs}ms`,
					animationTimingFunction: "linear",
					animationFillMode: "forwards",
				}}
				className="h-full w-full origin-left bg-amber-500/70"
				onAnimationEnd={onExpire}
			/>
		</div>
	);
});

function CharacterMarkers({
	pins,
	onSelect,
}: {
	pins: CharacterPin[];
	onSelect: (pin: CharacterPin) => void;
}) {
	return (
		<Pane name="characterPane" style={{ zIndex: 700 }}>
			{pins.map((pin) => {
				const key = `${pin.id}-${pin.lat.toFixed(5)}-${pin.lng.toFixed(5)}`;
				return (
					<Marker
						key={key}
						position={[pin.lat, pin.lng]}
						icon={makeCharacterIcon(pin.initial, pin.kind)}
						zIndexOffset={0}
						interactive
						riseOnHover
						eventHandlers={{
							click: () => onSelect(pin),
						}}
					/>
				);
			})}
		</Pane>
	);
}

function RecruitMarkers({
	leads,
	onSelect,
}: {
	leads: RecruitLead[];
	onSelect: (lead: RecruitLead) => void;
}) {
	return (
		<Pane name="recruitPane" style={{ zIndex: 860 }}>
			{leads.map((lead) => {
				const v = vigilantes.find((vv) => vv.id === lead.vigilanteId);
				if (!v) return null;
				return (
					<Marker
						key={lead.id}
						position={[lead.lat, lead.lng]}
						icon={makeRecruitIcon(v.name[0]?.toUpperCase() ?? "V")}
						zIndexOffset={15000}
						interactive
						riseOnHover
						eventHandlers={{
							click: () => onSelect(lead),
						}}
					/>
				);
			})}
		</Pane>
	);
}

function HomebaseMarker({ onClick }: { onClick: () => void }) {
	return (
		<Pane name="homebasePane" style={{ zIndex: 880 }}>
			<Marker
				position={HOMEBASE_POS}
				icon={makeHomebaseIcon()}
				zIndexOffset={20000}
				interactive
				riseOnHover
				eventHandlers={{ click: onClick }}
			/>
		</Pane>
	);
}

function IncidentMarkers({
	incidents,
	selectedId,
	onSelect,
}: {
	incidents: Incident[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}) {
	// Cache icons so existing markers don't get their DOM replaced on every
	// state tick/spawn (which would restart CSS animations and look choppy).
	const iconCacheRef = useRef<
		Map<string, { selected: boolean; icon: L.DivIcon }>
	>(new Map());

	// Prune cache entries for incidents that no longer exist.
	useEffect(() => {
		const activeIds = new Set(
			incidents.filter((i) => i.status === "active").map((i) => i.id),
		);
		for (const key of iconCacheRef.current.keys()) {
			if (!activeIds.has(key)) iconCacheRef.current.delete(key);
		}
	}, [incidents]);

	return (
		<Pane name="incidentPane" style={{ zIndex: 820 }}>
			{incidents
				.filter((inc) => inc.status === "active")
				.map((inc) => (
					<Marker
						key={inc.id}
						position={[inc.lat, inc.lng]}
						icon={(() => {
							const isSelected = inc.id === selectedId;
							const cached = iconCacheRef.current.get(inc.id);
							if (cached && cached.selected === isSelected) {
								return cached.icon;
							}
							const icon = makeIncidentIcon(inc.category, isSelected, false);
							iconCacheRef.current.set(inc.id, { selected: isSelected, icon });
							return icon;
						})()}
						zIndexOffset={10000}
						interactive
						riseOnHover
						eventHandlers={{ click: () => onSelect(inc.id) }}
					/>
				))}
		</Pane>
	);
}

function SelectedIncidentFollower({
	incidents,
	selectedId,
}: {
	incidents: Incident[];
	selectedId: string | null;
}) {
	const map = useMap();
	const lastIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (selectedId === lastIdRef.current) return;
		lastIdRef.current = selectedId;

		if (!selectedId) return;

		const inc = incidents.find((i) => i.id === selectedId);
		if (!inc) return;

		const pane = map.getPane("mapPane");
		if (!pane) return;

		requestAnimationFrame(() => {
			const safePane = map.getPane("mapPane");
			if (!safePane) return;
			map.setView([inc.lat, inc.lng], map.getZoom(), { animate: false });
		});
	}, [incidents, selectedId, map]);

	return null;
}

function initialState(): GameState {
	return {
		level: 1,
		selectedIncidentId: null,
		incidents: [],
		showIncidentPanel: true,
		showInventoryPanel: true,
		ownedVigilanteIds: ["bruce", "parya"],
		recruitLeads: [],
	};
}

function loadState(saveKey: string): GameState {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return initialState();
		const p = JSON.parse(raw) as Partial<GameState>;
		return {
			level:
				typeof p.level === "number" && p.level >= 1 && p.level <= 3
					? p.level
					: 1,
			selectedIncidentId:
				typeof p.selectedIncidentId === "string"
					? p.selectedIncidentId
					: null,
			incidents: Array.isArray(p.incidents) ? (p.incidents as Incident[]) : [],
			showIncidentPanel:
				typeof p.showIncidentPanel === "boolean"
					? p.showIncidentPanel
					: true,
			showInventoryPanel:
				typeof p.showInventoryPanel === "boolean"
					? p.showInventoryPanel
					: true,
			ownedVigilanteIds: Array.isArray(p.ownedVigilanteIds)
				? (p.ownedVigilanteIds as string[])
				: ["bruce", "parya"],
			recruitLeads: Array.isArray(p.recruitLeads)
				? (p.recruitLeads as RecruitLead[])
				: [],
		};
	} catch {
		return initialState();
	}
}

function saveState(saveKey: string, state: GameState) {
	localStorage.setItem(saveKey, JSON.stringify(state));
}

export default function StreetMapScene({ saveKey }: Props) {
	const [state, setState] = useState<GameState>(() => initialState());

	const [selectedRecruitLeadId, setSelectedRecruitLeadId] = useState<string | null>(null);
	const [selectedOwnedVigilanteId, setSelectedOwnedVigilanteId] = useState<string | null>(null);
	const [overlayMode, setOverlayMode] = useState<OverlayMode>("recruit");

	const [dialogue, setDialogue] = useState<DialogueState>(null);
	const [showHomebasePanel, setShowHomebasePanel] = useState(false);
	const [showVettingModal, setShowVettingModal] = useState(false);

	const helperBase =
		STATIC_CHARACTER_BASES.find((p) => p.id === "cit-helper") ?? STATIC_CHARACTER_BASES[0];
	const diazBase =
		STATIC_CHARACTER_BASES.find((p) => p.id === "cop-diaz") ?? STATIC_CHARACTER_BASES[0];

	const [helperPos, setHelperPos] = useState({
		lat: helperBase.lat,
		lng: helperBase.lng,
	});

	const [diazPos, setDiazPos] = useState({
		lat: diazBase.lat,
		lng: diazBase.lng,
	});

	useEffect(() => {
		setState(loadState(saveKey));
	}, [saveKey]);

	useEffect(() => {
		saveState(saveKey, state);
	}, [saveKey, state]);

	const levelBoundsRef = useRef<Map<number, LatLngBounds>>(new Map());

	const handleBoundsReady = (level: number, bounds: LatLngBounds) => {
		levelBoundsRef.current.set(level, bounds);
	};

	const expireIncident = (id: string) => {
		setState((s) => ({
			...s,
			selectedIncidentId:
				s.selectedIncidentId === id ? null : s.selectedIncidentId,
			incidents: s.incidents.filter((i) => i.id !== id),
		}));
	};

	const handleIncidentSelect = (id: string) => {
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setDialogue(null);
		setShowHomebasePanel(false);
		setShowVettingModal(false);

		setState((s) => {
			if (s.selectedIncidentId === id && s.showIncidentPanel) {
				return {
					...s,
					selectedIncidentId: null,
					showIncidentPanel: false,
				};
			}
			const incidents = [...s.incidents];
			const idx = incidents.findIndex((i) => i.id === id);
			if (idx > 0) {
				const [chosen] = incidents.splice(idx, 1);
				incidents.unshift(chosen);
			}
			return {
				...s,
				selectedIncidentId: id,
				showIncidentPanel: true,
				incidents,
			};
		});
	};

	const handleRecruitSelect = (lead: RecruitLead) => {
		setDialogue(null);
		setShowHomebasePanel(false);
		setShowVettingModal(false);
		setState((s) => ({
			...s,
			selectedIncidentId: null,
		}));
		setOverlayMode("recruit");
		setSelectedOwnedVigilanteId(null);
		setSelectedRecruitLeadId(lead.id);
	};

	const handleOwnedVigilanteSelect = (vigilanteId: string) => {
		setDialogue(null);
		setShowVettingModal(false);
		setOverlayMode("owned");
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(vigilanteId);
	};

	const handleCharacterSelect = (pin: CharacterPin) => {
		setState((s) => ({
			...s,
			selectedIncidentId: null,
		}));
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowHomebasePanel(false);
		setShowVettingModal(false);

		if (pin.kind === "citizen") {
			const citizen =
				NPC_DIALOGUE.citizens.find((c) => c.name === pin.name) ??
				NPC_DIALOGUE.citizens[0];

			setDialogue({
				name: citizen.name,
				role: citizen.role,
				portrait: citizen.portrait,
				text: randomFrom(citizen.lines),
			});
			return;
		}

		if (pin.name === "Chief Williams") {
			setDialogue({
				name: NPC_DIALOGUE.chief.name,
				role: NPC_DIALOGUE.chief.role,
				portrait: NPC_DIALOGUE.chief.portrait,
				text: randomFrom(NPC_DIALOGUE.chief.lines),
			});
			return;
		}

		const officer =
			NPC_DIALOGUE.police.find((p) => p.name === pin.name) ??
			NPC_DIALOGUE.police[0];

		setDialogue({
			name: officer.name,
			role: officer.role,
			portrait: officer.portrait,
			text: randomFrom(officer.lines),
		});
	};

	const handleHomebaseClick = () => {
		setDialogue(null);
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowVettingModal(false);
		setState((s) => ({
			...s,
			selectedIncidentId: null,
		}));
		setShowHomebasePanel((v) => !v);
	};

	const handleHireSelected = () => {
		const lead = state.recruitLeads.find((r) => r.id === selectedRecruitLeadId);
		if (!lead) return;

		setState((s) => ({
			...s,
			ownedVigilanteIds: s.ownedVigilanteIds.includes(lead.vigilanteId)
				? s.ownedVigilanteIds
				: [...s.ownedVigilanteIds, lead.vigilanteId],
			recruitLeads: s.recruitLeads.filter((r) => r.id !== lead.id),
		}));

		setSelectedRecruitLeadId(null);
		setShowVettingModal(false);
		setShowHomebasePanel(true);
	};

	useEffect(() => {
		let alive = true;
		const MAX_ACTIVE = 20;
		const SPAWN_INTERVAL_MS = 20_000;

		const scheduleNext = () => {
			if (!alive) return;
			window.setTimeout(() => {
				if (!alive) return;
				setState((s) => {
					const activeCount = s.incidents.filter(
						(i) => i.status === "active",
					).length;
					if (activeCount >= MAX_ACTIVE) return s;

					const bounds =
						levelBoundsRef.current.get(s.level) ??
						levelBoundsRef.current.get(s.level - 1) ??
						levelBoundsRef.current.get(s.level + 1) ??
						[...levelBoundsRef.current.values()][0];

					if (!bounds) return s;

					const { lat, lng } = sampleInBounds(bounds);
					return {
						...s,
						incidents: [...s.incidents, makeIncident(lat, lng)],
					};
				});
				scheduleNext();
			}, SPAWN_INTERVAL_MS);
		};

		scheduleNext();
		return () => {
			alive = false;
		};
	}, []);

	useEffect(() => {
		let alive = true;
		const MAX_RECRUITS = 3;
		const SPAWN_INTERVAL_MS = 18_000;

		const scheduleNext = () => {
			if (!alive) return;
			window.setTimeout(() => {
				if (!alive) return;
				setState((s) => {
					if (s.recruitLeads.length >= MAX_RECRUITS) return s;

					const bounds =
						levelBoundsRef.current.get(s.level) ??
						levelBoundsRef.current.get(s.level - 1) ??
						levelBoundsRef.current.get(s.level + 1) ??
						[...levelBoundsRef.current.values()][0];

					if (!bounds) return s;

					const unavailable = new Set([
						...s.ownedVigilanteIds,
						...s.recruitLeads.map((r) => r.vigilanteId),
					]);

					const available = vigilantes.filter((v) => !unavailable.has(v.id));
					if (available.length === 0) return s;

					const undercoverAvailable = available.filter((v) => v.isUndercover);
					const normalAvailable = available.filter((v) => !v.isUndercover);

					const undercoverAlreadyOnMap = s.recruitLeads.some((lead) => {
						const match = vigilantes.find((v) => v.id === lead.vigilanteId);
						return match?.isUndercover;
					});

					let chosen;

					if (!undercoverAlreadyOnMap && undercoverAvailable.length > 0) {
						const roll = Math.random();

						if (roll < 0.45) {
							chosen = randomFrom(undercoverAvailable);
						} else {
							chosen = randomFrom(
								normalAvailable.length > 0 ? normalAvailable : available,
							);
						}
					} else {
						chosen = randomFrom(
							normalAvailable.length > 0 ? normalAvailable : available,
						);
					}

					return {
						...s,
						recruitLeads: [...s.recruitLeads, makeRecruitLead(chosen.id, bounds)],
					};
				});
				scheduleNext();
			}, SPAWN_INTERVAL_MS);
		};

		scheduleNext();
		return () => {
			alive = false;
		};
	}, []);

	useEffect(() => {
		const id = window.setInterval(() => {
			setState((s) => {
				const now = Date.now();

				const expiredIncidentIds = new Set(
					s.incidents
						.filter((i) => i.status === "active" && now >= i.expiresAt)
						.map((i) => i.id),
				);

				const expiredRecruitIds = new Set(
					s.recruitLeads.filter((r) => now >= r.expiresAt).map((r) => r.id),
				);

				if (expiredIncidentIds.size === 0 && expiredRecruitIds.size === 0) return s;

				return {
					...s,
					selectedIncidentId: expiredIncidentIds.has(s.selectedIncidentId ?? "")
						? null
						: s.selectedIncidentId,
					incidents: s.incidents.filter((i) => !expiredIncidentIds.has(i.id)),
					recruitLeads: s.recruitLeads.filter((r) => !expiredRecruitIds.has(r.id)),
				};
			});

			if (
				selectedRecruitLeadId &&
				!state.recruitLeads.some((r) => r.id === selectedRecruitLeadId)
			) {
				setSelectedRecruitLeadId(null);
			}
		}, 1_000);

		return () => window.clearInterval(id);
	}, [selectedRecruitLeadId, state.recruitLeads]);

	useEffect(() => {
		const id = window.setInterval(() => {
			setHelperPos(() => {
				const moved = nudgeNearby(helperBase.lat, helperBase.lng);
				return {
					lat: moved.lat,
					lng: moved.lng,
				};
			});
		}, 9000);

		return () => window.clearInterval(id);
	}, [helperBase.lat, helperBase.lng]);

	useEffect(() => {
		const id = window.setInterval(() => {
			setDiazPos((prev) => {
				const activeIncidents = state.incidents.filter((i) => i.status === "active");

				if (activeIncidents.length === 0) {
					return moveToward(prev, { lat: diazBase.lat, lng: diazBase.lng }, 0.12);
				}

				const nearest = activeIncidents.reduce((best, current) => {
					const bestDist = distanceSq(prev, { lat: best.lat, lng: best.lng });
					const currDist = distanceSq(prev, { lat: current.lat, lng: current.lng });
					return currDist < bestDist ? current : best;
				});

				const movedToward = moveToward(
					prev,
					{ lat: nearest.lat, lng: nearest.lng },
					0.12,
				);

				const heldBack = pushAwayFromPoint(
					movedToward,
					{ lat: nearest.lat, lng: nearest.lng },
					0.00135,
				);

				return heldBack;
			});
		}, 1400);

		return () => window.clearInterval(id);
	}, [state.incidents, diazBase.lat, diazBase.lng]);

	const visibleDynamicPins = useMemo(() => {
		const activeIncidents = state.incidents.filter((i) => i.status === "active");
		const evanAvailable = state.recruitLeads.some((lead) => lead.vigilanteId === "familiar-face");

		const helperPin: CharacterPin = {
			id: "cit-helper",
			name: "Helper",
			initial: "H",
			kind: "citizen",
			lat: helperPos.lat,
			lng: helperPos.lng,
		};

		const citizenTemplates = [
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-oldman"),
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-girl"),
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-woman"),
		].filter(Boolean) as CharacterPin[];

		const incidentCitizens: CharacterPin[] = activeIncidents
			.slice(0, citizenTemplates.length)
			.map((incident, idx) => {
				const tpl = citizenTemplates[idx];
				const near = nudgeNearPoint(incident.lat, incident.lng, 0.0018);
				const safe = pushAwayFromPoint(
					near,
					{ lat: incident.lat, lng: incident.lng },
					0.00095,
				);
				return {
					...tpl,
					lat: safe.lat,
					lng: safe.lng,
				};
			});

		const diazPin: CharacterPin = {
			id: "cop-diaz",
			name: "Officer Diaz",
			initial: "D",
			kind: "police",
			lat: diazPos.lat,
			lng: diazPos.lng,
		};

		const kimBase = STATIC_CHARACTER_BASES.find((p) => p.id === "cop-kim");
		const chiefBase = STATIC_CHARACTER_BASES.find((p) => p.id === "chief-williams");

		const policePins: CharacterPin[] = [
			diazPin,
			...(evanAvailable || !kimBase ? [] : [kimBase]),
			...(chiefBase ? [chiefBase] : []),
		];

		return [helperPin, ...incidentCitizens, ...policePins];
	}, [state.incidents, state.recruitLeads, helperPos, diazPos]);

	const zoomConfig = useMemo(() => {
		const minZoom = LEVELS[LEVELS.length - 1].zoomOut;
		const maxZoom = LEVELS[0].zoomIn;
		const initialZoom = levelConfig(state.level).zoomOut;
		return { minZoom, maxZoom, initialZoom };
	}, [state.level]);

	const selectedRecruitLead = useMemo(
		() => state.recruitLeads.find((r) => r.id === selectedRecruitLeadId) ?? null,
		[state.recruitLeads, selectedRecruitLeadId],
	);

	const selectedRecruitVigilante = useMemo(
		() =>
			selectedRecruitLead
				? vigilantes.find((v) => v.id === selectedRecruitLead.vigilanteId) ?? null
				: null,
		[selectedRecruitLead],
	);

	const selectedOwnedVigilante = useMemo(
		() =>
			selectedOwnedVigilanteId
				? vigilantes.find((v) => v.id === selectedOwnedVigilanteId) ?? null
				: null,
		[selectedOwnedVigilanteId],
	);

	const ownedVigilantes = useMemo(
		() => vigilantes.filter((v) => state.ownedVigilanteIds.includes(v.id)),
		[state.ownedVigilanteIds],
	);

	const activeDossier =
		overlayMode === "recruit" ? selectedRecruitVigilante : selectedOwnedVigilante;

	const closeDossier = () => {
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowVettingModal(false);
	};

	return (
		<div className="fixed inset-0">
			<style>{`
				.vigilante-leaflet .leaflet-tile {
					filter: brightness(0.55) saturate(0.7) hue-rotate(200deg);
					transition: none !important;
					opacity: 1 !important;
				}
				.vigilante-leaflet .leaflet-tile-container {
					opacity: 1 !important;
					transition: none !important;
				}
				.vigilante-leaflet { background: #05070a !important; }
				.vigilante-incident-icon,
				.vigilante-character-icon,
				.vigilante-recruit-icon,
				.vigilante-homebase-icon { background: none; border: none; }
				.vigilante-hide-scrollbar::-webkit-scrollbar { display: none; }
				.vigilante-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
				.leaflet-pane.characterPane { z-index: 700 !important; }
				.leaflet-pane.incidentPane { z-index: 820 !important; }
				.leaflet-pane.recruitPane { z-index: 860 !important; }
				.leaflet-pane.homebasePane { z-index: 880 !important; }
				.vigilante-character-icon > div,
				.vigilante-recruit-icon > div,
				.vigilante-homebase-icon > div {
					cursor: pointer !important;
					pointer-events: auto !important;
				}
				@keyframes vigilante-pulse-soft {
					0%   { box-shadow: 0 0 0 0 rgba(185,28,28,0.35); }
					60%  { box-shadow: 0 0 0 10px rgba(185,28,28,0); }
					100% { box-shadow: 0 0 0 12px rgba(185,28,28,0); }
				}
				.vigilante-incident-icon-pulse > div {
					animation-name: vigilante-pulse-soft;
					animation-duration: 2.2s;
					animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
					animation-iteration-count: infinite;
					will-change: box-shadow;
				}
				@keyframes vigilante-timer-drain {
					from { transform: scaleX(1); }
					to   { transform: scaleX(0); }
				}
			`}</style>

			<MapContainer
				center={CENTER}
				zoom={zoomConfig.initialZoom}
				minZoom={zoomConfig.minZoom}
				maxZoom={zoomConfig.maxZoom}
				maxBoundsViscosity={1.0}
				scrollWheelZoom={false}
				doubleClickZoom={false}
				touchZoom={false}
				boxZoom={false}
				keyboard={false}
				dragging={false}
				zoomControl={false}
				attributionControl={false}
				className="vigilante-leaflet"
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: "#05070a",
				}}
			>
				<ZoomController level={state.level} onBoundsReady={handleBoundsReady} />
				<TileLayer
					url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
					keepBuffer={8}
					updateWhenZooming
					updateWhenIdle={false}
				/>

				<HomebaseMarker onClick={handleHomebaseClick} />
				<CharacterMarkers pins={visibleDynamicPins} onSelect={handleCharacterSelect} />
				<RecruitMarkers leads={state.recruitLeads} onSelect={handleRecruitSelect} />
				<IncidentMarkers
					incidents={state.incidents}
					selectedId={state.selectedIncidentId}
					onSelect={handleIncidentSelect}
				/>
				<SelectedIncidentFollower
					incidents={state.incidents}
					selectedId={state.selectedIncidentId}
				/>
			</MapContainer>

			{/* ── Dossier overlay (recruit lead or owned vigilante) ── */}
			<AnimatePresence>
				{activeDossier ? (
					<>
						<motion.div
							className="absolute inset-0 z-[2000] bg-black/35"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeDossier}
						/>
						<motion.aside
							initial={{ opacity: 0, x: overlayMode === "owned" ? 30 : -30, scale: 0.98 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: overlayMode === "owned" ? 24 : -24, scale: 0.98 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className={`absolute top-6 bottom-6 z-[2010] w-[min(34vw,460px)] min-w-[340px] overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md ${
								overlayMode === "owned" ? "right-6" : "left-6"
							}`}
						>
							<div className="flex h-full flex-col">
								<div className="flex items-start justify-between border-b border-amber-900/30 px-5 py-4">
									<div>
										<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
											{overlayMode === "owned" ? "Homebase Dossier" : "Recruit Lead"}
										</div>
										<h2 className="mt-2 text-2xl font-bold text-amber-100">
											{activeDossier.alias}
										</h2>
										<div className="mt-1 text-sm text-amber-200/60">
											{activeDossier.name} • {activeDossier.role}
										</div>
									</div>

									<button
										type="button"
										onClick={closeDossier}
										className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 hover:bg-amber-950/20 hover:text-amber-100 transition"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="flex-1 overflow-y-auto vigilante-hide-scrollbar px-5 py-4">
									<div className="grid grid-cols-[108px_1fr] gap-4">
										<div className="relative h-[140px] overflow-hidden rounded-xl border border-amber-900/35 bg-black/35">
											<Image
												src={activeDossier.portrait}
												alt={activeDossier.alias}
												fill
												className="object-cover"
												sizes="140px"
											/>
										</div>

										<div className="space-y-3">
											<div className="flex flex-wrap gap-2">
												{activeDossier.status ? (
													<span className="rounded-full border border-amber-900/35 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-amber-200/75">
														{activeDossier.status}
													</span>
												) : null}
												{typeof activeDossier.heat === "number" ? (
													<span className="rounded-full border border-red-900/35 bg-red-950/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-red-300/75">
														Heat {activeDossier.heat}
													</span>
												) : null}
											</div>

											{activeDossier.backgroundNote ? (
												<div className="rounded-xl border border-amber-900/30 bg-black/25 p-4">
													<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
														Background
													</div>
													<div className="mt-2 text-sm leading-6 text-amber-100/75">
														{activeDossier.backgroundNote}
													</div>
												</div>
											) : null}

											<p className="text-sm leading-6 text-amber-100/75">
												{activeDossier.bio ?? "Backstory TBD."}
											</p>
										</div>
									</div>

									<div className="mt-6 grid grid-cols-2 gap-3">
										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-3">
											<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">Combat</div>
											<div className="mt-2 text-lg font-bold">{activeDossier.stats.combat}</div>
										</div>
										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-3">
											<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">Stealth</div>
											<div className="mt-2 text-lg font-bold">{activeDossier.stats.stealth}</div>
										</div>
										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-3">
											<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">Tactics</div>
											<div className="mt-2 text-lg font-bold">{activeDossier.stats.tactics}</div>
										</div>
										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-3">
											<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">Nerve</div>
											<div className="mt-2 text-lg font-bold">{activeDossier.stats.nerve}</div>
										</div>
									</div>

									<div className="mt-6 rounded-xl border border-amber-900/30 bg-black/25 p-4">
										<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
											Traits
										</div>
										<div className="mt-3 flex flex-wrap gap-2">
											{(activeDossier.traits ?? []).map((trait: string) => (
												<span
													key={trait}
													className="rounded-full border border-amber-900/30 bg-black/30 px-3 py-1 text-xs text-amber-100/80"
												>
													{trait}
												</span>
											))}
										</div>
									</div>
								</div>

								<div className="border-t border-amber-900/30 px-5 py-4">
									<div className="flex items-center justify-between gap-3">
										<button
											type="button"
											onClick={closeDossier}
											className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 hover:bg-amber-950/20 transition"
										>
											Close File
										</button>

										{overlayMode === "recruit" ? (
											<button
												type="button"
												onClick={() => setShowVettingModal(true)}
												className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
											>
												Hire Vigilante
											</button>
										) : (
											<button
												type="button"
												className="rounded-xl border border-amber-700/25 bg-black/20 px-5 py-3 text-sm font-semibold text-amber-100/60"
											>
												Available at Homebase
											</button>
										)}
									</div>
								</div>
							</div>
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>

			{/* ── NPC dialogue box ── */}
			<AnimatePresence>
				{dialogue ? (
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute bottom-6 left-6 z-[2020] w-[min(52vw,720px)] min-w-[320px]"
					>
						<div className="overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md">
							<div className="flex items-start">
								<div className="shrink-0 border-r border-amber-900/30 bg-black/30 p-4">
									<div className="relative h-[170px] w-[132px] overflow-hidden rounded-md">
										<Image
											src={dialogue.portrait}
											alt={dialogue.name}
											fill
											className="object-cover object-center"
											sizes="132px"
										/>
									</div>
								</div>

								<div className="flex min-h-[202px] flex-1 flex-col justify-between px-5 py-4">
									<div>
										<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
											{dialogue.role}
										</div>
										<div className="mt-1 text-xl font-bold text-amber-100">
											{dialogue.name}
										</div>

										<p className="mt-4 text-sm leading-7 text-amber-100/80">
											{dialogue.text}
										</p>
									</div>

									<div className="mt-4 flex items-center justify-end gap-3">
										<button
											type="button"
											onClick={() => setDialogue(null)}
											className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-4 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
										>
											Continue
										</button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>

			{/* ── Homebase panel ── */}
			<AnimatePresence>
				{showHomebasePanel && (
					<motion.aside
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 36 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute right-0 top-20 bottom-6 z-[1900] w-[360px] max-w-[42vw] rounded-l-2xl border border-r-0 border-amber-900/40 bg-black/70 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md"
					>
						<div className="flex h-full flex-col">
							<div className="flex items-center justify-between border-b border-amber-900/30 px-5 py-4">
								<div className="flex items-center gap-2">
									<Home className="h-4 w-4 text-amber-300/75" />
									<div>
										<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
											Homebase
										</div>
										<div className="mt-1 text-sm font-semibold text-amber-100">
											Owned Vigilantes
										</div>
									</div>
								</div>

								<button
									type="button"
									onClick={() => setShowHomebasePanel(false)}
									className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 hover:bg-amber-950/20 hover:text-amber-100 transition"
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto vigilante-hide-scrollbar px-4 py-4 space-y-3">
								{ownedVigilantes.length === 0 ? (
									<div className="rounded-xl border border-amber-900/30 bg-black/25 p-4 text-sm text-amber-200/55">
										No vigilantes recruited yet. Keep an eye on the map for available hires.
									</div>
								) : (
									ownedVigilantes.map((v) => (
										<button
											key={v.id}
											type="button"
											onClick={() => handleOwnedVigilanteSelect(v.id)}
											className="w-full text-left rounded-xl border border-amber-900/30 bg-black/25 px-4 py-3 hover:bg-amber-950/15 transition"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-700/35 bg-amber-950/20 text-sm font-bold text-amber-100">
													{v.name[0]?.toUpperCase() ?? "V"}
												</div>
												<div className="min-w-0">
													<div className="truncate text-sm font-semibold text-amber-100">
														{v.alias}
													</div>
													<div className="truncate text-xs text-amber-200/55">
														{v.name} • {v.role}
													</div>
												</div>
											</div>
										</button>
									))
								)}
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			<VettingMinigameModal
				open={showVettingModal && overlayMode === "recruit" && !!selectedRecruitVigilante}
				character={selectedRecruitVigilante}
				onClose={() => setShowVettingModal(false)}
				onReject={() => {
					setShowVettingModal(false);
					setSelectedRecruitLeadId(null);
				}}
				onApprove={() => {
					setShowVettingModal(false);
					handleHireSelected();
				}}
			/>

			{/* ── Top bar ── */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex justify-center pt-4">
				<div className="pointer-events-auto inline-flex items-center gap-3 rounded-xl border border-amber-900/40 bg-black/40 backdrop-blur-md px-4 py-3 text-amber-200/70">
					<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
						Zoom Tier
					</div>
					<div className="flex gap-2 text-xs">
						{LEVELS.map((lvl) => (
							<button
								key={lvl.id}
								type="button"
								onClick={() =>
									setState((s) => ({ ...s, level: lvl.id }))
								}
								className={`px-3 py-1 rounded-md border cursor-pointer ${
									state.level === lvl.id
										? "border-amber-500/70 bg-amber-900/40 text-amber-100"
										: "border-amber-900/50 bg-black/30 text-amber-200/60 hover:border-amber-700/60 hover:text-amber-100"
								}`}
							>
								{lvl.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ── Left incident panel + toggle ── */}
			<div className="pointer-events-none absolute inset-y-16 left-0 z-[950] flex items-start">
				<div className="pointer-events-auto mt-4">
					<button
						type="button"
						onClick={() =>
							setState((s) => ({
								...s,
								showIncidentPanel: !s.showIncidentPanel,
							}))
						}
						className="cursor-pointer rounded-r-full rounded-l-none border border-amber-900/60 bg-black/75 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-amber-200/80 hover:border-amber-500/80 hover:text-amber-100 transition-colors flex items-center gap-1"
					>
						<span>Incidents</span>
						<span className="text-[11px] flex items-center">
							{state.showIncidentPanel ? (
								<ChevronLeft className="w-3 h-3" aria-hidden />
							) : (
								<ChevronRight className="w-3 h-3" aria-hidden />
							)}
						</span>
					</button>
				</div>

				<AnimatePresence initial={false}>
					{state.showIncidentPanel && (
						<motion.div
							key="incident-panel"
							initial={{ x: -320, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -320, opacity: 0 }}
							transition={{
								type: "tween",
								duration: 0.22,
								ease: "easeOut",
							}}
							className="pointer-events-auto ml-2 mt-0 mb-4 w-80 max-w-[80vw] rounded-xl border border-amber-900/40 bg-black/55 backdrop-blur-md shadow-xl shadow-black/60 flex flex-col"
						>
							<div className="flex items-center justify-between px-4 py-3 border-b border-amber-900/40">
								<div className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-300/80">
									Incidents
								</div>
							</div>

							<div className="relative flex-1 max-h-72 overflow-y-auto px-3 py-2 space-y-2 vigilante-hide-scrollbar">
								{state.incidents
									.filter((i) => i.status === "active")
									.sort((a, b) => {
										if (a.id === state.selectedIncidentId) return -1;
										if (b.id === state.selectedIncidentId) return 1;
										return a.expiresAt - b.expiresAt;
									})
									.map((inc) => {
										const isSelected = state.selectedIncidentId === inc.id;
										return (
											<button
												key={inc.id}
												type="button"
												onClick={() => handleIncidentSelect(inc.id)}
												className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
													isSelected
														? "border-amber-500/80 bg-amber-900/50 text-amber-100"
														: "border-amber-900/50 bg-black/40 text-amber-200/70 hover:border-amber-700/70 hover:text-amber-100"
												}`}
											>
												<div className="flex items-start gap-3">
													<div className="mt-0.5 h-5 w-5 rounded-full border border-red-900 bg-red-900/30 flex items-center justify-center text-[11px] text-red-300">
														!
													</div>
													<div className="flex-1">
														<div className="font-semibold text-[11px] uppercase tracking-[0.16em]">
															{incidentCategoryLabel(inc.category)}
														</div>
														<div className="mt-1 text-[11px] text-amber-200/70 line-clamp-2">
															{inc.summary}
														</div>
														<TimerBar
															createdAt={inc.createdAt}
															expiresAt={inc.expiresAt}
															onExpire={() => expireIncident(inc.id)}
														/>
													</div>
												</div>
											</button>
										);
									})}

								{state.incidents.filter((i) => i.status === "active").length === 0 && (
									<div className="text-[11px] text-amber-200/40 px-1 py-2">
										No active incidents. The city is quiet… for now.
									</div>
								)}

								<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-black/70 to-transparent" />
							</div>

							{state.incidents.filter((i) => i.status === "active").length > 3 && (
								<div className="px-3 pt-2 pb-3 text-[10px] text-amber-200/50">
									More incidents below – scroll to view.
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* ── Bottom inventory panel ── */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[980] max-h-[min(92vh,100%)] overflow-hidden">
				<AnimatePresence initial={false} mode="wait">
					{state.showInventoryPanel ? (
						<motion.div
							key="inventory-panel"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{
								type: "tween",
								duration: 0.48,
								ease: [0.22, 0.9, 0.28, 1],
							}}
							style={{ transformOrigin: "bottom center" }}
							className="pointer-events-none w-full transform-gpu will-change-transform"
						>
							<Inventory
								onHide={() =>
									setState((s) => ({
										...s,
										showInventoryPanel: false,
									}))
								}
							/>
						</motion.div>
					) : (
						<motion.div
							key="inventory-collapsed"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{
								type: "tween",
								duration: 0.38,
								ease: [0.22, 0.9, 0.28, 1],
							}}
							style={{ transformOrigin: "bottom center" }}
							className="pointer-events-auto w-full transform-gpu will-change-transform border-t border-amber-900/55 bg-black/80 px-4 py-2.5 backdrop-blur-md"
						>
							<button
								type="button"
								onClick={() =>
									setState((s) => ({
										...s,
										showInventoryPanel: true,
									}))
								}
								className="flex w-full cursor-pointer items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-200/75 transition-colors hover:text-amber-100"
								aria-expanded={false}
								aria-label="Show inventory"
							>
								<span>Show inventory</span>
								<ChevronUp
									className="h-4 w-4 shrink-0"
									strokeWidth={2.25}
									aria-hidden
								/>
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}