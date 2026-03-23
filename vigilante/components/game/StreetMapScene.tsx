"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Home,
	Package2,
	X,
} from "lucide-react";
import InventorySorterModal from "../minigames/InventorySorterModal";
import type { LatLngBounds, LatLngTuple } from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, useMap } from "react-leaflet";
import * as L from "leaflet";
import { useSfx } from "@/lib/sfx";
import Inventory from "./Inventory";
import IncidentChanceRollOverlay from "./IncidentChanceRollOverlay";
import IncidentDeployModal from "./IncidentDeployModal";
import { IncidentTimerBar } from "./IncidentTimerBar";
import { vigilantes } from "@/app/components/data/vigilante";
import { NPC_PORTRAIT } from "@/lib/characterPortraitUrls";
import {
	DEFAULT_RESOURCE_POOL,
	applyDeployment,
	canStageDeployment,
	forfeitDeployment,
	returnDeployment,
	type ResourcePoolEntry,
} from "@/lib/resourcePool";
import {
	DEFAULT_CAREER_STATS,
	mergeCareerStats,
	type CareerStats,
} from "@/lib/careerStats";
import { mergePurchasedBuffIds } from "@/lib/purchasedBuffs";
import { markCloudFlush, upsertGameSave } from "@/lib/cloudSaves";
import { readSave, touchSave, type SaveSlotId } from "@/lib/saves";
import {
	computeIncidentRollOutcome,
	type DispatchRollBreakdown,
} from "@/lib/incidentRoll";
import {
	isVigilanteRecovering,
	pruneExpiredInjuries,
	rollInjuryUpdatesAfterResolve,
} from "@/lib/vigilanteInjury";
import VettingMinigameModal from "@/components/game/VettingMinigameModal";
import { formatIncidentTypeLabel } from "@/lib/formatIncidentTitle";
import {
	INCIDENT_TEMPLATES,
	shortenPlaceName,
	type IncidentArchetype,
	type IncidentTemplate,
} from "@/lib/incidentTemplates";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import {
	pickIncidentDialogueLine,
	pickRecruitDialogueLine,
	INCIDENT_SELECT_DIALOGUE_CHANCE,
	type IncidentDialogueLine,
} from "@/lib/incidentDialogue";
import NPCDialogueBox from "@/components/game/NPCDialogueBox";

// ── Inlined helpers (not exported by incidentTemplates) ───────────────────────

function archetypeSuccessBase(archetype: IncidentArchetype): number {
	/* Tuned so base + stats + gear still needs a real roll — not auto-wins */
	switch (archetype) {
		case "crime":
			return 0.58;
		case "fire_rescue":
			return 0.48;
		case "medical":
			return 0.52;
		case "disaster":
			return 0.4;
		case "traffic":
			return 0.6;
		default:
			return 0.52;
	}
}

function pickIncidentTemplate(): IncidentTemplate {
	const total = INCIDENT_TEMPLATES.reduce((sum, t) => sum + t.weight, 0);
	let r = Math.random() * total;
	for (const t of INCIDENT_TEMPLATES) {
		r -= t.weight;
		if (r <= 0) return t;
	}
	return INCIDENT_TEMPLATES[INCIDENT_TEMPLATES.length - 1]!;
}

function fillIncidentTemplate(
	template: IncidentTemplate,
	placeName: string,
): {
	archetype: IncidentArchetype;
	typeLabel: string;
	title: string;
	summary: string;
} {
	const filled = template.summary.replace(/\{place\}/g, placeName);
	const typeLabel = formatIncidentTypeLabel(template.typeLabel);
	return {
		archetype: template.archetype,
		typeLabel,
		title: `${typeLabel} — ${placeName}`,
		summary: filled,
	};
}
// Inlined from @/lib/osmPlaces
type OsmPlace = { name: string; lat: number; lng: number; kind?: string };

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
	/** Slot identity for menu `updatedAt` / titles (`vigilante:save:…`), separate from `saveKey` game blob. */
	saveSlot?: SaveSlotId;
	/** When set, game state is upserted to Supabase once per minute while you play, plus on tab close. */
	cloudSync?: {
		userId: string;
		slotIndex: 1 | 2 | 3;
	};
};

type IncidentStatus = "active" | "resolving" | "resolved";

type IncidentResolution = {
	success: boolean;
	adjustedPercent: number;
	beforeLuckPercent: number;
	rolled: number;
} & Partial<DispatchRollBreakdown>;

type Incident = {
	id: string;
	category: IncidentArchetype;
	typeLabel: string;
	status: IncidentStatus;
	lat: number;
	lng: number;
	title: string;
	summary: string;
	createdAt: number;
	expiresAt: number;
	successChance: number;
	/** Units out on this incident until recalled */
	deployedResourceIds?: string[];
	/** Roster sent on this dispatch (success heuristic) */
	deployedVigilanteIds?: string[];
	resolution?: IncidentResolution | null;
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
	showMinigamePanel: boolean;
	showInventoryPanel: boolean;
	ownedVigilanteIds: string[];
	recruitLeads: RecruitLead[];
	/** r1–r10 + b1–b3: total owned vs out on incidents */
	resourcePool: Record<string, ResourcePoolEntry>;
	/** Vigilante id → timestamp (ms) when injury recovery completes */
	vigilanteInjuryUntil: Record<string, number>;
	/** Lifetime counters (persisted with save). */
	careerStats: CareerStats;
	/** Buff upgrades unlocked; stock qty still in `resourcePool` (b1–b3). */
	purchasedBuffIds: string[];
};

const CENTER: LatLngTuple = [40.7128, -74.006];
const BASE: LatLngTuple = [40.7139, -74.0038];

const OWNED_VIG_MARKER_OFFSETS: { dLat: number; dLng: number }[] = [
	{ dLat: 0.0028, dLng: -0.0022 },
	{ dLat: -0.0019, dLng: 0.0026 },
	{ dLat: 0.0012, dLng: 0.0029 },
	{ dLat: -0.0025, dLng: -0.0014 },
	{ dLat: 0.0021, dLng: 0.001 },
	{ dLat: -0.0012, dLng: -0.0028 },
];

/** Owned roster also shown in inventory — omit duplicate map markers */
const VIGILANTE_IDS_HIDDEN_ON_MAP = new Set(["bruce", "parya"]);

const LEVELS = [
	{ id: 1, label: "L1", zoomOut: 15, zoomIn: 15 },
	{ id: 2, label: "L2", zoomOut: 14, zoomIn: 14 },
	{ id: 3, label: "L3", zoomOut: 13, zoomIn: 13 },
];

type MinigameId = "inventory-sorter";

type MinigameOption = {
	id: MinigameId;
	title: string;
	description: string;
	status?: string;
};

const MINIGAME_OPTIONS: MinigameOption[] = [
	{
		id: "inventory-sorter",
		title: "Inventory Sorter",
		description: "Reorganize emergency supplies to earn extra resources.",
		status: "Available",
	},
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATIC_CHARACTER_BASES: CharacterPin[] = [
	{
		id: "cit-oldman",
		name: "Old Man",
		initial: "O",
		kind: "citizen",
		lat: 40.713,
		lng: -74.0112,
	},
	{
		id: "cit-girl",
		name: "Girl",
		initial: "G",
		kind: "citizen",
		lat: 40.7178,
		lng: -74.0014,
	},
	{
		id: "cit-woman",
		name: "Woman",
		initial: "W",
		kind: "citizen",
		lat: 40.7102,
		lng: -74.0005,
	},
	{
		id: "cit-helper",
		name: "Helper",
		initial: "H",
		kind: "citizen",
		lat: 40.7185,
		lng: -74.0072,
	},
	{
		id: "cop-diaz",
		name: "Officer Diaz",
		initial: "D",
		kind: "police",
		lat: 40.7129,
		lng: -73.9998,
	},
	{
		id: "cop-kim",
		name: "Detective Kim",
		initial: "K",
		kind: "police",
		lat: 40.7166,
		lng: -74.01,
	},
	{
		id: "chief-williams",
		name: "Chief Williams",
		initial: "C",
		kind: "police",
		lat: 40.7095,
		lng: -74.0069,
	},
];

type DialogueRole = "Citizen" | "Police" | "Chief";

type DialogueState = {
	name: string;
	role: DialogueRole;
	portrait: string;
	text: string;
	/** TTS / voice map key — matches `CharacterPin.id` */
	speakerId: string;
} | null;

const NPC_DIALOGUE = {
	citizens: [
		{
			name: "Old Man",
			role: "Citizen" as const,
			portrait: NPC_PORTRAIT.citizenOldMan,
			lines: [
				"I've lived on this block thirty years. Something's wrong tonight.",
				"I heard boots in the alley and then everything went quiet.",
				"You vigilantes are the only ones keeping this city together.",
				"Back in my day the beat cop knew every stoop. Now it's radios and cameras — and still the trouble finds us.",
				"I don't trust half what I read online. I trust what I hear through these walls — and it isn't good.",
				"If your crew needs a witness who actually shows up, you come find me before the reporters do.",
				"The kids play closer to home lately. That tells you everything about how safe they feel.",
			],
		},
		{
			name: "Girl",
			role: "Citizen" as const,
			portrait: NPC_PORTRAIT.citizenGirl,
			lines: [
				"I saw them run past the subway entrance. They looked armed.",
				"If your crew is taking this job, don't be late.",
				"People are scared. Nobody's waiting for the cops anymore.",
				"My phone's full of videos nobody should have to film. Somebody has to actually do something.",
				"I heard the sirens before I saw the lights — same pattern as last week. That's not random.",
				"If you're recruiting, fine — just don't treat the block like a backdrop for your recruitment video.",
				"Tell whoever's dispatching that we need fewer speeches and more people on the ground.",
			],
		},
		{
			name: "Woman",
			role: "Citizen" as const,
			portrait: NPC_PORTRAIT.citizenWoman,
			lines: [
				"The whole street feels wrong tonight. Like everyone's waiting for something.",
				"I'm not asking questions. I just need this handled.",
				"They moved fast. Professional fast.",
				"I don't care about politics — I care that my kid gets home from school in one piece.",
				"The bodega owner says he's paying 'protection' twice — to the city and to whoever knocks after dark.",
				"If your vigilantes are going to be loud, be loud where it helps — not outside my window at three a.m.",
				"I've got no love for grandstanding. I have love for results.",
			],
		},
		{
			name: "Helper",
			role: "Citizen" as const,
			portrait: NPC_PORTRAIT.citizenHelper,
			lines: [
				"I can point your people to the exact building if they move now.",
				"I've got eyes on the block. Tell me where you want me.",
				"Your vigilantes aren't subtle, but they're faster than dispatch.",
				"I coordinate the block chat — we share groceries, babysitting, and who's sketchy on which corner.",
				"If you need someone to calm a crowd before it turns into a riot, I've done it before.",
				"Don't ask me to lie for you. I will not burn trust with my neighbors for your optics.",
				"Bad information spreads faster than a fire. Check your sources before you send someone running.",
			],
		},
	],
	police: [
		{
			name: "Officer Diaz",
			role: "Police" as const,
			portrait: NPC_PORTRAIT.officerDiaz,
			lines: [
				"You better hope I don't catch any of your people at my crime scenes.",
				"Civilian intervention is punishable, don't test me.",
				"HEY! STOP RIGHT THERE!",
				"I don't have time for cosplay — if you're on scene, you're in my line of sight and my report.",
				"Your vigilantes aren't sworn, aren't insured, and aren't walking away when I say freeze.",
				"Paperwork doesn't care how noble you felt when you threw that punch.",
				"Next time you 'help,' try not to trample evidence I need to convict someone.",
				"I sleep four hours and answer for every call on this block — don't lecture me about dedication.",
			],
		},
		{
			name: "Detective Kim",
			role: "Police" as const,
			portrait: NPC_PORTRAIT.detectiveKim,
			lines: [
				"This city makes vigilantes out of everyone eventually.",
				"When your people make messes for us to clean up, we don't get the chance to focus on what's really important...",
				"There's a pattern here. I know what you've been up to… I just need to prove it.",
				"I follow threads — money, phones, witnesses. If your crew crosses a line, I'll find the knot.",
				"Don't mistake my patience for approval. I'm building a file, not a fan club.",
				"Some nights I agree with you more than I admit. Other nights you make my job impossible.",
				"If you have real intel, bring it through proper channels. I can't act on rumors in a group chat.",
				"The badge isn't a halo — but neither is a mask. We're all accountable eventually.",
			],
		},
	],
	chief: {
		name: "Chief Williams",
		role: "Chief" as const,
		portrait: NPC_PORTRAIT.chiefWilliams,
		lines: [
			"The city is slipping faster than my officers can hold it together.",
			"Damn vigilantes running around the city thinking they're helping us. We don't need them.",
			"If you're going to play guardian, then act like professionals.",
			"I don't run a theater — I run a department. Keep your stunts off the evening news.",
			"Every headline about you is a headline that isn't about the victims we failed to reach in time.",
			"Coordination isn't optional. Chaos gets people killed — uniform or not.",
			"You want respect? Show up when the cameras are off and the paperwork is brutal.",
			"If you cross from helper to vigilante justice, you'll meet me across a table with lawyers.",
		],
	},
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function levelConfig(level: number) {
	return LEVELS[Math.max(0, Math.min(level - 1, LEVELS.length - 1))];
}

function randomFrom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function sampleInBounds(bounds: LatLngBounds): { lat: number; lng: number } {
	const south = bounds.getSouth();
	const north = bounds.getNorth();
	const west = bounds.getWest();
	const east = bounds.getEast();
	const inset = 0.04;
	const latSpan = (north - south) * (1 - inset * 2);
	const lngSpan = (east - west) * (1 - inset * 2);
	return {
		lat: south + (north - south) * inset + Math.random() * latSpan,
		lng: west + (east - west) * inset + Math.random() * lngSpan,
	};
}

function nudgeNearPoint(lat: number, lng: number, maxOffset = 0.00085) {
	return {
		lat: lat + (Math.random() - 0.5) * maxOffset,
		lng: lng + (Math.random() - 0.5) * maxOffset,
	};
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
	if (dist < 1e-9) return { lat: center.lat + minDistance, lng: center.lng };
	const scale = minDistance / dist;
	return {
		lat: center.lat + dLat * scale,
		lng: center.lng + dLng * scale,
	};
}

function isLikelyWaterOnlyPoi(p: OsmPlace): boolean {
	const k = (p.kind ?? "").toLowerCase();
	if (k === "ferry_terminal") return true;
	const n = p.name.toLowerCase();
	if (n.includes("ferry terminal")) return true;
	return false;
}

function computeSuccessChance(
	archetype: IncidentArchetype,
	lifetimeMs: number,
) {
	const base = archetypeSuccessBase(archetype);
	const t = Math.min(lifetimeMs / (5 * 60_000), 1);
	const noise = (Math.random() - 0.5) * 0.1;
	return Math.round(
		Math.max(0.05, Math.min(0.95, base - 0.25 * t + noise)) * 100,
	);
}

function makeIncident(lat: number, lng: number, place: OsmPlace): Incident {
	const now = Date.now();
	const lifetimeMs = 30_000;
	const template = pickIncidentTemplate();
	const filled = fillIncidentTemplate(template, shortenPlaceName(place.name));
	return {
		id: `incident_${Math.random().toString(16).slice(2)}_${now.toString(16)}`,
		category: filled.archetype,
		typeLabel: filled.typeLabel,
		status: "active",
		lat,
		lng,
		title: filled.title,
		summary: filled.summary,
		createdAt: now,
		expiresAt: now + lifetimeMs,
		successChance: computeSuccessChance(filled.archetype, lifetimeMs),
	};
}

function makeRecruitLead(
	vigilanteId: string,
	bounds: LatLngBounds,
): RecruitLead {
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

/**
 * Spatially uniform POI picker.
 *
 * Divides the bounding box into a COLS×ROWS grid, shuffles the cells, then
 * walks them until it finds one containing at least one POI — and returns a
 * random POI from that cell. Every cell has equal probability of being chosen
 * first, so incidents spread evenly across the map regardless of how densely
 * OSM has tagged any given neighbourhood.
 *
 * Falls back to a plain random pick if somehow all cells are empty.
 */
const SPAWN_GRID_COLS = 8;
const SPAWN_GRID_ROWS = 5;

function pickSpatiallyUniformPoi(
	places: OsmPlace[],
	bounds: LatLngBounds,
): OsmPlace | null {
	if (places.length === 0) return null;

	const land = places.filter((p) => !isLikelyWaterOnlyPoi(p));
	const pool = land.length > 0 ? land : places;

	const s = bounds.getSouth();
	const n = bounds.getNorth();
	const w = bounds.getWest();
	const e = bounds.getEast();

	// Shuffle cell indices so every spawn picks a fresh random cell order
	const cellCount = SPAWN_GRID_COLS * SPAWN_GRID_ROWS;
	const cellOrder = Array.from({ length: cellCount }, (_, i) => i);
	for (let i = cellOrder.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cellOrder[i], cellOrder[j]] = [cellOrder[j]!, cellOrder[i]!];
	}

	for (const idx of cellOrder) {
		const row = Math.floor(idx / SPAWN_GRID_COLS);
		const col = idx % SPAWN_GRID_COLS;
		const cellS = s + (row / SPAWN_GRID_ROWS) * (n - s);
		const cellN = s + ((row + 1) / SPAWN_GRID_ROWS) * (n - s);
		const cellW = w + (col / SPAWN_GRID_COLS) * (e - w);
		const cellE = w + ((col + 1) / SPAWN_GRID_COLS) * (e - w);
		const pad = 1e-4;
		const inCell = pool.filter(
			(p) =>
				p.lat >= cellS - pad &&
				p.lat <= cellN + pad &&
				p.lng >= cellW - pad &&
				p.lng <= cellE + pad,
		);
		if (inCell.length > 0) return randomFrom(inCell);
	}

	return randomFrom(pool); // fallback: all cells were empty
}

// ── Icon factories ────────────────────────────────────────────────────────────

function makeIncidentIcon(
	_category: IncidentArchetype,
	isSelected: boolean,
	isResolved: boolean,
) {
	const border = isSelected ? "#b91c1c" : "#7f1d1d";
	const baseColor = "#f97373";
	const bg = "rgba(127,29,29,0.6)";
	const resolvedBg = "rgba(24,24,27,0.9)";
	const resolvedBorder = "#52525b";
	const pulse = !isResolved && isSelected;

	const html = `<div style="
		width:28px;height:28px;border-radius:999px;
		border:2px solid ${isResolved ? resolvedBorder : border};background:${isResolved ? resolvedBg : bg};
		display:flex;align-items:center;justify-content:center;
		color:${isResolved ? "#a1a1aa" : baseColor};font-weight:800;font-size:16px;
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
			? { border: "#1d4ed8", bg: "rgba(30,64,175,0.78)", text: "#dbeafe" }
			: kind === "vigilante"
				? {
						border: "#b45309",
						bg: "rgba(120,53,15,0.82)",
						text: "#fde68a",
					}
				: {
						border: "#4b5563",
						bg: "rgba(55,65,81,0.8)",
						text: "#f3f4f6",
					};

	const html = `<div style="
		width:30px;height:30px;border-radius:999px;
		border:2px solid ${palette.border};background:${palette.bg};
		display:flex;align-items:center;justify-content:center;
		color:${palette.text};font-weight:800;font-size:14px;
		text-shadow:0 0 4px rgba(0,0,0,0.8);
		box-shadow:0 0 14px rgba(0,0,0,0.85);cursor:pointer;
	">${initial}</div>`;

	return L.divIcon({
		html,
		className: "vigilante-character-icon",
		iconSize: [30, 30],
		iconAnchor: [15, 15],
	});
}

/** Same layout as `makeIncidentIcon` (28px circle + !), amber/yellow recruit styling */
function makeRecruitIcon(isSelected: boolean) {
	const border = isSelected ? "#f59e0b" : "#92400e";
	const baseColor = "#fde68a";
	const bg = "rgba(120,53,15,0.6)";
	const pulse = isSelected;

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
			? "vigilante-recruit-icon vigilante-recruit-icon-pulse"
			: "vigilante-recruit-icon",
		iconSize: [28, 28],
		iconAnchor: [14, 14],
	});
}

// ── Map sub-components ────────────────────────────────────────────────────────

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
		let cancelled = false;
		let layoutTries = 0;
		const MAX_LAYOUT_TRIES = 30;

		const finishWhenReady = () => {
			if (cancelled) return;
			const pane = map.getPane("mapPane");
			if (!pane) {
				if (layoutTries >= MAX_LAYOUT_TRIES) return;
				layoutTries++;
				map.invalidateSize({ animate: false });
				window.setTimeout(finishWhenReady, 100);
				return;
			}
			layoutTries = 0;

			map.setMinZoom(lvl.zoomOut);
			map.setMaxZoom(lvl.zoomIn);
			map.setMaxBounds(undefined as unknown as LatLngBounds);
			map.invalidateSize({ animate: false });

			requestAnimationFrame(() => {
				if (cancelled) return;
				const safePane = map.getPane("mapPane");
				if (!safePane) {
					if (layoutTries < MAX_LAYOUT_TRIES) {
						layoutTries++;
						window.setTimeout(finishWhenReady, 100);
					}
					return;
				}
				map.setView(BASE, lvl.zoomOut, { animate: false });

				requestAnimationFrame(() => {
					if (cancelled) return;
					const finalPane = map.getPane("mapPane");
					if (!finalPane) {
						if (layoutTries < MAX_LAYOUT_TRIES) {
							layoutTries++;
							window.setTimeout(finishWhenReady, 100);
						}
						return;
					}
					try {
						const b = map.getBounds();
						map.setMaxBounds(b);
						onBoundsReady(lvl.id, b);
					} catch {
						//
					}
				});
			});
		};

		finishWhenReady();
		return () => {
			cancelled = true;
		};
	}, [level, map, onBoundsReady]);

	return null;
}

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
						zIndexOffset={pin.kind === "vigilante" ? 11000 : 0}
						interactive
						riseOnHover
						eventHandlers={{ click: () => onSelect(pin) }}
					/>
				);
			})}
		</Pane>
	);
}

function RecruitMarkers({
	leads,
	selectedLeadId,
	onSelect,
}: {
	leads: RecruitLead[];
	selectedLeadId: string | null;
	onSelect: (lead: RecruitLead) => void;
}) {
	return (
		<Pane name="recruitPane" style={{ zIndex: 860 }}>
			{leads.map((lead) => {
				const v = vigilantes.find((vv) => vv.id === lead.vigilanteId);
				if (!v) return null;
				const isSelected = lead.id === selectedLeadId;
				return (
					<Marker
						key={lead.id}
						position={[lead.lat, lead.lng]}
						icon={makeRecruitIcon(isSelected)}
						zIndexOffset={15000}
						interactive
						riseOnHover
						eventHandlers={{ click: () => onSelect(lead) }}
					/>
				);
			})}
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
	const iconCacheRef = useRef<
		Map<string, { selected: boolean; icon: L.DivIcon }>
	>(new Map());

	useEffect(() => {
		const activeIds = new Set(
			incidents.filter(isOngoingIncident).map((i) => i.id),
		);
		for (const key of iconCacheRef.current.keys()) {
			if (!activeIds.has(key)) iconCacheRef.current.delete(key);
		}
	}, [incidents]);

	return (
		<Pane name="incidentPane" style={{ zIndex: 820 }}>
			{incidents
				.filter((inc) => isOngoingIncident(inc))
				.map((inc) => (
					<Marker
						key={inc.id}
						position={[inc.lat, inc.lng]}
						icon={(() => {
							const isSelected = inc.id === selectedId;
							const cached = iconCacheRef.current.get(inc.id);
							if (cached && cached.selected === isSelected)
								return cached.icon;
							const icon = makeIncidentIcon(
								inc.category,
								isSelected,
								false,
							);
							iconCacheRef.current.set(inc.id, {
								selected: isSelected,
								icon,
							});
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

// ── Persistence ───────────────────────────────────────────────────────────────

const INCIDENT_ARCHETYPES: IncidentArchetype[] = [
	"crime",
	"fire_rescue",
	"medical",
	"disaster",
	"traffic",
];

function normalizeIncidentArchetype(c: unknown): IncidentArchetype {
	if (c === "fire" || c === "fire_rescue") return "fire_rescue";
	if (c === "robbery" || c === "crime") return "crime";
	if (c === "medical") return "medical";
	if (
		typeof c === "string" &&
		INCIDENT_ARCHETYPES.includes(c as IncidentArchetype)
	) {
		return c as IncidentArchetype;
	}
	return "crime";
}

function fallbackTypeLabel(archetype: IncidentArchetype): string {
	switch (archetype) {
		case "crime":
			return "Police call";
		case "fire_rescue":
			return "Fire / Rescue";
		case "medical":
			return "Medical";
		case "disaster":
			return "Disaster";
		case "traffic":
			return "Traffic";
		default:
			return "Incident";
	}
}

function normalizeIncidentStatus(raw: unknown): IncidentStatus {
	if (raw === "resolving" || raw === "resolved" || raw === "active")
		return raw;
	return "active";
}

function parseIncidentResolution(raw: unknown): IncidentResolution | null {
	if (!raw || typeof raw !== "object") return null;
	const o = raw as Record<string, unknown>;
	if (typeof o.success !== "boolean") return null;
	if (typeof o.adjustedPercent !== "number") return null;
	if (typeof o.beforeLuckPercent !== "number") return null;
	if (typeof o.rolled !== "number") return null;
	const base: IncidentResolution = {
		success: o.success,
		adjustedPercent: o.adjustedPercent,
		beforeLuckPercent: o.beforeLuckPercent,
		rolled: o.rolled,
	};
	if (typeof o.baseChancePercent === "number")
		base.baseChancePercent = o.baseChancePercent;
	if (typeof o.resourceMultiplier === "number")
		base.resourceMultiplier = o.resourceMultiplier;
	if (typeof o.buffMultiplier === "number")
		base.buffMultiplier = o.buffMultiplier;
	if (typeof o.vigilanteMultiplier === "number")
		base.vigilanteMultiplier = o.vigilanteMultiplier;
	if (typeof o.avgArchetypeFit === "number")
		base.avgArchetypeFit = o.avgArchetypeFit;
	if (typeof o.luckDeltaPercent === "number")
		base.luckDeltaPercent = o.luckDeltaPercent;
	return base;
}

function parseStoredIncident(raw: unknown): Incident | null {
	if (!raw || typeof raw !== "object") return null;
	const o = raw as Record<string, unknown>;
	if (typeof o.id !== "string") return null;
	if (typeof o.lat !== "number" || typeof o.lng !== "number") return null;
	const status = normalizeIncidentStatus(o.status);
	if (status !== "active" && status !== "resolving" && status !== "resolved")
		return null;
	if (typeof o.title !== "string" || typeof o.summary !== "string")
		return null;
	if (typeof o.createdAt !== "number" || typeof o.expiresAt !== "number")
		return null;
	if (typeof o.successChance !== "number") return null;
	const category = normalizeIncidentArchetype(o.category);
	const typeLabel =
		typeof o.typeLabel === "string" && o.typeLabel.length > 0
			? o.typeLabel
			: fallbackTypeLabel(category);
	const deployedResourceIds = Array.isArray(o.deployedResourceIds)
		? (o.deployedResourceIds as unknown[]).filter(
				(x): x is string => typeof x === "string",
			)
		: undefined;
	const deployedVigilanteIds = Array.isArray(o.deployedVigilanteIds)
		? (o.deployedVigilanteIds as unknown[]).filter(
				(x): x is string => typeof x === "string",
			)
		: undefined;
	const resolution = parseIncidentResolution(o.resolution);
	return {
		id: o.id,
		category,
		typeLabel,
		status,
		lat: o.lat,
		lng: o.lng,
		title: o.title,
		summary: o.summary,
		createdAt: o.createdAt,
		expiresAt: o.expiresAt,
		successChance: o.successChance,
		deployedResourceIds:
			deployedResourceIds && deployedResourceIds.length > 0
				? deployedResourceIds
				: undefined,
		deployedVigilanteIds:
			deployedVigilanteIds && deployedVigilanteIds.length > 0
				? deployedVigilanteIds
				: undefined,
		resolution: resolution ?? undefined,
	};
}

function mergeResourcePool(
	partial: unknown,
): Record<string, ResourcePoolEntry> {
	const merged: Record<string, ResourcePoolEntry> = {
		...DEFAULT_RESOURCE_POOL,
	};
	if (!partial || typeof partial !== "object") return merged;
	for (const [k, v] of Object.entries(partial)) {
		if (!v || typeof v !== "object") continue;
		const e = v as Record<string, unknown>;
		if (typeof e.qty !== "number" || typeof e.deployed !== "number")
			continue;
		const qty = Math.max(0, e.qty);
		merged[k] = {
			qty,
			deployed: Math.max(0, Math.min(e.deployed, qty)),
		};
	}
	return merged;
}

function isOngoingIncident(i: Incident): boolean {
	return i.status === "active" || i.status === "resolving";
}

function initialState(): GameState {
	return {
		level: 1,
		selectedIncidentId: null,
		incidents: [],
		showIncidentPanel: true,
		showMinigamePanel: false,
		showInventoryPanel: true,
		ownedVigilanteIds: ["bruce", "parya"],
		recruitLeads: [],
		resourcePool: { ...DEFAULT_RESOURCE_POOL },
		vigilanteInjuryUntil: {},
		careerStats: { ...DEFAULT_CAREER_STATS },
		purchasedBuffIds: mergePurchasedBuffIds(undefined),
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
			incidents: Array.isArray(p.incidents)
				? p.incidents
						.map(parseStoredIncident)
						.filter((x): x is Incident => x !== null)
				: [],
			showIncidentPanel:
				typeof p.showIncidentPanel === "boolean"
					? p.showIncidentPanel
					: true,
			showMinigamePanel:
				typeof p.showMinigamePanel === "boolean"
					? p.showMinigamePanel
					: false,
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
			resourcePool: mergeResourcePool(p.resourcePool),
			vigilanteInjuryUntil: pruneExpiredInjuries(
				p.vigilanteInjuryUntil as Record<string, number> | undefined,
				Date.now(),
			),
			careerStats: mergeCareerStats(p.careerStats),
			purchasedBuffIds: mergePurchasedBuffIds(p.purchasedBuffIds),
		};
	} catch {
		return initialState();
	}
}

function saveState(saveKey: string, state: GameState) {
	localStorage.setItem(saveKey, JSON.stringify(state));
}

/** Cloud slot: Supabase upsert while playing (plus `pagehide` / unmount). */
const CLOUD_SAVE_INTERVAL_MS = 60_000;

// ── Main component ────────────────────────────────────────────────────────────

export default function StreetMapScene({ saveKey, saveSlot, cloudSync }: Props) {
	// Must hydrate from localStorage synchronously; otherwise the save effect below
	// runs once with `initialState()` and overwrites the real save before load runs.
	const [state, setState] = useState<GameState>(() => loadState(saveKey));
	const stateRef = useRef(state);
	stateRef.current = state;
	const cloudPushInFlightRef = useRef(false);
	const [selectedRecruitLeadId, setSelectedRecruitLeadId] = useState<
		string | null
	>(null);
	const [selectedOwnedVigilanteId, setSelectedOwnedVigilanteId] = useState<
		string | null
	>(null);
	const [inventorySorterOpen, setInventorySorterOpen] = useState(false);
	/** r1–r10 counts staged for deploy to selected incident */
	const [deployModalOpen, setDeployModalOpen] = useState(false);
	/** Full-screen 3D + strip while a dispatch resolves (predetermined roll). */
	const [chanceRollOverlay, setChanceRollOverlay] = useState<{
		incidentId: string;
		rolled: number;
		adjustedPercent: number;
		beforeLuckPercent: number;
		success: boolean;
		phase: "rolling" | "outcome";
		hadDeployedGear: boolean;
		breakdown: DispatchRollBreakdown;
		contextLabel: string;
	} | null>(null);
	const resolveIncidentTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const [overlayMode, setOverlayMode] = useState<OverlayMode>("recruit");
	const [dialogue, setDialogue] = useState<DialogueState>(null);
	const [showVettingModal, setShowVettingModal] = useState(false);
	const { play } = useSfx();
	const playSfxRef = useRef(play);
	playSfxRef.current = play;

	// ── TTS + incident dialogue ───────────────────────────────────────────────
	const { speak, stop: stopTTS, isBusy } = useElevenLabsTTS();
	const [incidentDialogue, setIncidentDialogue] =
		useState<IncidentDialogueLine | null>(null);

	const levelBoundsRef = useRef<Map<number, LatLngBounds>>(new Map());
	const spawnPlacesByLevelRef = useRef<Map<number, OsmPlace[]>>(new Map());
	/** Incremented per level on each new bounds+fetch so stale responses are ignored. */
	const placesFetchGenRef = useRef<Map<number, number>>(new Map());
	const placesAbortByLevelRef = useRef<Map<number, AbortController>>(
		new Map(),
	);

	useEffect(() => {
		setState(loadState(saveKey));
	}, [saveKey]);
	useEffect(() => {
		saveState(saveKey, state);
		// Game JSON lives at `saveKey`; slot meta (incl. menu "last updated") lives at `keyForSlot(saveSlot)`.
		if (saveSlot) touchSave(saveSlot);
	}, [saveKey, saveSlot, state]);

	const pushCloudToServer = useCallback(async () => {
		if (!cloudSync) return;
		if (cloudPushInFlightRef.current) return;
		cloudPushInFlightRef.current = true;
		const slot: SaveSlotId = {
			scope: "cloud",
			index: cloudSync.slotIndex,
			userId: cloudSync.userId,
		};
		try {
			const meta = readSave(slot);
			const title = meta?.meta.title ?? `Cloud Slot ${cloudSync.slotIndex}`;
			const ok = await upsertGameSave({
				userId: cloudSync.userId,
				slotIndex: cloudSync.slotIndex,
				title,
				state: stateRef.current as unknown as Record<string, unknown>,
			});
			if (ok) {
				markCloudFlush(cloudSync.userId, cloudSync.slotIndex);
				touchSave(slot);
			}
		} finally {
			cloudPushInFlightRef.current = false;
		}
	}, [cloudSync]);

	useEffect(() => {
		if (!cloudSync) return;
		const id = window.setInterval(() => {
			void pushCloudToServer();
		}, CLOUD_SAVE_INTERVAL_MS);
		return () => clearInterval(id);
	}, [cloudSync, pushCloudToServer]);

	useEffect(() => {
		if (!cloudSync) return;
		const onPageHide = () => {
			void pushCloudToServer();
		};
		window.addEventListener("pagehide", onPageHide);
		return () => {
			window.removeEventListener("pagehide", onPageHide);
			void pushCloudToServer();
		};
	}, [cloudSync, pushCloudToServer]);

	useEffect(() => {
		setDeployModalOpen(false);
		setChanceRollOverlay(null);
		// Clear any pending incident dialogue when selection changes
		setIncidentDialogue(null);
	}, [state.selectedIncidentId]);

	useEffect(() => {
		return () => {
			if (resolveIncidentTimeoutRef.current) {
				clearTimeout(resolveIncidentTimeoutRef.current);
			}
		};
	}, []);

	// Called by ZoomController each time the active level settles.
	// Aborts any in-flight fetch for that tier and only applies the latest result.
	const handleBoundsReady = useCallback(
		(level: number, bounds: LatLngBounds) => {
			levelBoundsRef.current.set(level, bounds);

			const prevAbort = placesAbortByLevelRef.current.get(level);
			prevAbort?.abort();
			const ac = new AbortController();
			placesAbortByLevelRef.current.set(level, ac);

			const gen = (placesFetchGenRef.current.get(level) ?? 0) + 1;
			placesFetchGenRef.current.set(level, gen);

			const south = bounds.getSouth();
			const west = bounds.getWest();
			const north = bounds.getNorth();
			const east = bounds.getEast();
			const params = new URLSearchParams({
				south: String(south),
				west: String(west),
				north: String(north),
				east: String(east),
			});

			void fetch(`/api/osm/places?${params.toString()}`, {
				signal: ac.signal,
			})
				.then(async (r) => {
					if (placesFetchGenRef.current.get(level) !== gen) return;
					const data = (r.ok ? await r.json() : { places: [] }) as {
						places?: OsmPlace[];
					};
					if (placesFetchGenRef.current.get(level) !== gen) return;
					spawnPlacesByLevelRef.current.set(
						level,
						Array.isArray(data.places) ? data.places : [],
					);
				})
				.catch((err: unknown) => {
					if (
						err &&
						typeof err === "object" &&
						"name" in err &&
						(err as { name?: string }).name === "AbortError"
					) {
						return;
					}
					if (placesFetchGenRef.current.get(level) !== gen) return;
					spawnPlacesByLevelRef.current.set(level, []);
				});
		},
		[],
	);

	// ── Incident helpers ──────────────────────────────────────────────────────

	const expireIncident = (id: string) => {
		play("incidentExpire");
		setState((s) => ({
			...s,
			careerStats: {
				...s.careerStats,
				incidentsExpired: s.careerStats.incidentsExpired + 1,
			},
			selectedIncidentId:
				s.selectedIncidentId === id ? null : s.selectedIncidentId,
			incidents: s.incidents.filter((i) => i.id !== id),
		}));
	};

	const handleIncidentSelect = (id: string) => {
		play("incidentSelect");
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setDialogue(null);
		setShowVettingModal(false);
		setState((s) => {
			if (s.selectedIncidentId === id && s.showIncidentPanel) {
				return {
					...s,
					selectedIncidentId: null,
					showIncidentPanel: false,
				};
			}
			const incident = s.incidents.find((i) => i.id === id);
			if (incident) {
				queueMicrotask(() => {
					const line = pickIncidentDialogueLine(incident.category, {
						chance: INCIDENT_SELECT_DIALOGUE_CHANCE,
					});
					if (line) {
						setDialogue(null);
						setIncidentDialogue(line);
					}
				});
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
		setShowVettingModal(false);
		setState((s) => ({ ...s, selectedIncidentId: null }));
		setOverlayMode("recruit");
		setSelectedOwnedVigilanteId(null);
		setSelectedRecruitLeadId(lead.id);
	};

	const handleOwnedVigilanteSelect = (vigilanteId: string) => {
		setDialogue(null);
		setShowVettingModal(false);
		setState((s) => ({ ...s, selectedIncidentId: null }));
		setOverlayMode("owned");
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(vigilanteId);
	};

	const handleCharacterSelect = (pin: CharacterPin) => {
		setState((s) => ({ ...s, selectedIncidentId: null }));
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowVettingModal(false);

		if (pin.kind === "vigilante") {
			handleOwnedVigilanteSelect(pin.id);
			return;
		}

		if (pin.kind === "citizen") {
			const citizen =
				NPC_DIALOGUE.citizens.find((c) => c.name === pin.name) ??
				NPC_DIALOGUE.citizens[0];
			setDialogue({
				name: citizen.name,
				role: citizen.role,
				portrait: citizen.portrait,
				text: randomFrom(citizen.lines),
				speakerId: pin.id,
			});
			return;
		}

		if (pin.name === "Chief Williams") {
			setDialogue({
				name: NPC_DIALOGUE.chief.name,
				role: NPC_DIALOGUE.chief.role,
				portrait: NPC_DIALOGUE.chief.portrait,
				text: randomFrom(NPC_DIALOGUE.chief.lines),
				speakerId: pin.id,
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
			speakerId: pin.id,
		});
	};

	const handleHireSelected = () => {
		const lead = state.recruitLeads.find(
			(r) => r.id === selectedRecruitLeadId,
		);
		if (!lead) return;
		setState((s) => {
			const alreadyOwned = s.ownedVigilanteIds.includes(lead.vigilanteId);
			return {
				...s,
				ownedVigilanteIds: alreadyOwned
					? s.ownedVigilanteIds
					: [...s.ownedVigilanteIds, lead.vigilanteId],
				recruitLeads: s.recruitLeads.filter((r) => r.id !== lead.id),
				careerStats: alreadyOwned
					? s.careerStats
					: {
							...s.careerStats,
							vigilantesRecruited:
								s.careerStats.vigilantesRecruited + 1,
						},
			};
		});
		setSelectedRecruitLeadId(null);
		setShowVettingModal(false);
	};

	// ── TTS handlers ─────────────────────────────────────────────────────────

	const handleDialogueSpeak = useCallback(
		(text: string, speakerId: string) => {
			void speak(text, speakerId);
		},
		[speak],
	);

	const handleDialogueStopSpeak = useCallback(() => {
		stopTTS();
	}, [stopTTS]);

	const handleDialogueClose = useCallback(() => {
		stopTTS();
		setIncidentDialogue(null);
	}, [stopTTS]);

	const handleDeployConfirm = (payload: {
		vigilanteIds: string[];
		resourceIds: string[];
	}) => {
		const id = state.selectedIncidentId;
		if (!id) return;
		const inc = state.incidents.find((i) => i.id === id);
		if (!inc || inc.status !== "active") return;
		if (payload.vigilanteIds.length < 1) return;
		if (
			!payload.vigilanteIds.every((vid) =>
				state.ownedVigilanteIds.includes(vid),
			)
		) {
			return;
		}
		if (!canStageDeployment(state.resourcePool, payload.resourceIds))
			return;

		const nowCheck = Date.now();
		if (
			!payload.vigilanteIds.every(
				(vid) =>
					!isVigilanteRecovering(
						nowCheck,
						state.vigilanteInjuryUntil,
						vid,
					),
			)
		) {
			return;
		}

		const assignedVigs = vigilantes.filter((v) =>
			payload.vigilanteIds.includes(v.id),
		);
		const rollOutcome = computeIncidentRollOutcome({
			baseChancePercent: inc.successChance,
			archetype: inc.category,
			vigilantes: assignedVigs.map((v) => ({ stats: v.stats })),
			resourceIds: payload.resourceIds,
			buffIds: [],
		});

		if (resolveIncidentTimeoutRef.current) {
			clearTimeout(resolveIncidentTimeoutRef.current);
		}
		setDeployModalOpen(false);
		setChanceRollOverlay({
			incidentId: id,
			rolled: rollOutcome.rolled,
			adjustedPercent: rollOutcome.adjustedPercent,
			beforeLuckPercent: rollOutcome.beforeLuckPercent,
			success: rollOutcome.success,
			phase: "rolling",
			hadDeployedGear: payload.resourceIds.length > 0,
			breakdown: {
				baseChancePercent: rollOutcome.baseChancePercent,
				resourceMultiplier: rollOutcome.resourceMultiplier,
				buffMultiplier: rollOutcome.buffMultiplier,
				vigilanteMultiplier: rollOutcome.vigilanteMultiplier,
				avgArchetypeFit: rollOutcome.avgArchetypeFit,
				staffingSupportMultiplier:
					rollOutcome.staffingSupportMultiplier,
				gearPresenceMultiplier: rollOutcome.gearPresenceMultiplier,
				luckDeltaPercent: rollOutcome.luckDeltaPercent,
			},
			contextLabel: `${inc.typeLabel} · ${fallbackTypeLabel(inc.category)}`,
		});
		setState((s) => {
			const i = s.incidents.find((x) => x.id === id);
			if (!i || i.status !== "active") return s;
			const pool = applyDeployment(s.resourcePool, payload.resourceIds);
			return {
				...s,
				resourcePool: pool,
				incidents: s.incidents.map((x) =>
					x.id === id
						? {
								...x,
								status: "resolving" as const,
								deployedResourceIds: [...payload.resourceIds],
								deployedVigilanteIds: [...payload.vigilanteIds],
							}
						: x,
				),
			};
		});
		const RESOLVE_MS = 2600;
		resolveIncidentTimeoutRef.current = setTimeout(() => {
			setState((s) => {
				const cur = s.incidents.find((x) => x.id === id);
				if (!cur || cur.status !== "resolving") return s;
				const deployed = cur.deployedResourceIds ?? [];
				const deployedVigs = cur.deployedVigilanteIds ?? [];
				const now = Date.now();
				const vigilanteInjuryUntil = rollInjuryUpdatesAfterResolve(
					now,
					deployedVigs,
					s.vigilanteInjuryUntil,
				);
				let pool = s.resourcePool;
				if (deployed.length > 0) {
					if (rollOutcome.success) {
						pool = returnDeployment(pool, deployed);
					} else {
						pool = forfeitDeployment(pool, deployed);
					}
				}
				return {
					...s,
					vigilanteInjuryUntil,
					resourcePool: pool,
					careerStats: {
						...s.careerStats,
						dispatchesCompleted:
							s.careerStats.dispatchesCompleted + 1,
						incidentsResolvedSuccess:
							s.careerStats.incidentsResolvedSuccess +
							(rollOutcome.success ? 1 : 0),
						incidentsResolvedFailure:
							s.careerStats.incidentsResolvedFailure +
							(rollOutcome.success ? 0 : 1),
					},
					incidents: s.incidents.map((x) =>
						x.id === id
							? {
									...x,
									status: "resolved" as const,
									deployedResourceIds: [],
									resolution: {
										success: rollOutcome.success,
										adjustedPercent:
											rollOutcome.adjustedPercent,
										beforeLuckPercent:
											rollOutcome.beforeLuckPercent,
										rolled: rollOutcome.rolled,
										baseChancePercent:
											rollOutcome.baseChancePercent,
										resourceMultiplier:
											rollOutcome.resourceMultiplier,
										buffMultiplier:
											rollOutcome.buffMultiplier,
										vigilanteMultiplier:
											rollOutcome.vigilanteMultiplier,
										avgArchetypeFit:
											rollOutcome.avgArchetypeFit,
										luckDeltaPercent:
											rollOutcome.luckDeltaPercent,
									},
								}
							: x,
					),
				};
			});
			setChanceRollOverlay((prev) =>
				prev && prev.incidentId === id
					? { ...prev, phase: "outcome" }
					: prev,
			);
		}, RESOLVE_MS);
	};

	const dismissResolvedIncident = (incidentId: string) => {
		setState((s) => {
			const inc = s.incidents.find((i) => i.id === incidentId);
			let pool = s.resourcePool;
			if (inc?.deployedResourceIds?.length) {
				pool = returnDeployment(pool, inc.deployedResourceIds);
			}
			return {
				...s,
				resourcePool: pool,
				selectedIncidentId:
					s.selectedIncidentId === incidentId
						? null
						: s.selectedIncidentId,
				incidents: s.incidents.filter((i) => i.id !== incidentId),
			};
		});
	};

	// ── Incident spawner — random POI, no grid ────────────────────────────────
	useEffect(() => {
		if (inventorySorterOpen) return;

		let alive = true;
		const MAX_ACTIVE = 100;
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

					const bounds = levelBoundsRef.current.get(s.level);
					if (!bounds) return s;

					const places =
						spawnPlacesByLevelRef.current.get(s.level) ?? [];
					const place = pickSpatiallyUniformPoi(places, bounds);
					if (!place) return s;

					const newIncident = makeIncident(
						place.lat,
						place.lng,
						place,
					);

					// 20% chance to trigger a voiced dialogue line for this incident.
					// Delay slightly so the map marker renders first.
					const dialogueLine = pickIncidentDialogueLine(
						newIncident.category,
					);
					if (dialogueLine) {
						setTimeout(() => {
							setDialogue(null);
							setIncidentDialogue(dialogueLine);
						}, 600);
					}

					queueMicrotask(() => playSfxRef.current("incidentAlert"));

					return {
						...s,
						incidents: [...s.incidents, newIncident],
					};
				});
				scheduleNext();
			}, SPAWN_INTERVAL_MS);
		};

		scheduleNext();
		return () => {
			alive = false;
		};
	}, [inventorySorterOpen]);

	// ── Recruit lead spawner ──────────────────────────────────────────────────
	useEffect(() => {
		let alive = true;
		const MAX_RECRUITS = 3;
		/** ~1 recruit lead per minute */
		const SPAWN_INTERVAL_MS = 60_000;

		const scheduleNext = () => {
			if (!alive) return;
			window.setTimeout(() => {
				if (!alive) return;
				setState((s) => {
					if (s.recruitLeads.length >= MAX_RECRUITS) return s;

					const bounds = levelBoundsRef.current.get(s.level);
					if (!bounds) return s;

					const unavailable = new Set([
						...s.ownedVigilanteIds,
						...s.recruitLeads.map((r) => r.vigilanteId),
					]);
					const available = vigilantes.filter(
						(v) => !unavailable.has(v.id),
					);
					if (available.length === 0) return s;

					const undercoverAvailable = available.filter(
						(v) => v.isUndercover,
					);
					const normalAvailable = available.filter(
						(v) => !v.isUndercover,
					);
					const undercoverAlreadyOnMap = s.recruitLeads.some(
						(lead) => {
							const match = vigilantes.find(
								(v) => v.id === lead.vigilanteId,
							);
							return match?.isUndercover;
						},
					);

					let chosen;
					if (
						!undercoverAlreadyOnMap &&
						undercoverAvailable.length > 0
					) {
						chosen =
							Math.random() < 0.45
								? randomFrom(undercoverAvailable)
								: randomFrom(
										normalAvailable.length > 0
											? normalAvailable
											: available,
									);
					} else {
						chosen = randomFrom(
							normalAvailable.length > 0
								? normalAvailable
								: available,
						);
					}

					queueMicrotask(() => {
						const line = pickRecruitDialogueLine(chosen.id);
						if (line) {
							setDialogue(null);
							setIncidentDialogue(line);
						}
					});
					return {
						...s,
						recruitLeads: [
							...s.recruitLeads,
							makeRecruitLead(chosen.id, bounds),
						],
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

	// ── Expiry ticker ─────────────────────────────────────────────────────────
	useEffect(() => {
		if (inventorySorterOpen) return;

		const id = window.setInterval(() => {
			setState((s) => {
				const now = Date.now();
				const expiredIncidentIds = new Set(
					s.incidents
						.filter(
							(i) => i.status === "active" && now >= i.expiresAt,
						)
						.map((i) => i.id),
				);
				const expiredRecruitIds = new Set(
					s.recruitLeads
						.filter((r) => now >= r.expiresAt)
						.map((r) => r.id),
				);
				if (
					expiredIncidentIds.size === 0 &&
					expiredRecruitIds.size === 0
				)
					return s;
				return {
					...s,
					selectedIncidentId: expiredIncidentIds.has(
						s.selectedIncidentId ?? "",
					)
						? null
						: s.selectedIncidentId,
					incidents: s.incidents.filter(
						(i) => !expiredIncidentIds.has(i.id),
					),
					recruitLeads: s.recruitLeads.filter(
						(r) => !expiredRecruitIds.has(r.id),
					),
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
	}, [inventorySorterOpen, selectedRecruitLeadId, state.recruitLeads]);

	// ── Derived pin list ──────────────────────────────────────────────────────
	const visibleDynamicPins = useMemo(() => {
		const activeIncidents = state.incidents.filter(isOngoingIncident);

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
				return { ...tpl, lat: safe.lat, lng: safe.lng };
			});

		const ownedRoster = vigilantes.filter(
			(v) =>
				state.ownedVigilanteIds.includes(v.id) &&
				!VIGILANTE_IDS_HIDDEN_ON_MAP.has(v.id),
		);
		const ownedPins: CharacterPin[] = ownedRoster.map((v, i) => {
			const off =
				OWNED_VIG_MARKER_OFFSETS[i % OWNED_VIG_MARKER_OFFSETS.length];
			return {
				id: v.id,
				name: v.alias,
				initial: v.name[0]?.toUpperCase() ?? "V",
				kind: "vigilante",
				lat: BASE[0] + off.dLat,
				lng: BASE[1] + off.dLng,
			};
		});

		return [...incidentCitizens, ...ownedPins];
	}, [state.incidents, state.ownedVigilanteIds]);

	const zoomConfig = useMemo(
		() => ({
			minZoom: LEVELS[LEVELS.length - 1].zoomOut,
			maxZoom: LEVELS[0].zoomIn,
			initialZoom: levelConfig(state.level).zoomOut,
		}),
		[state.level],
	);

	const selectedRecruitLead = useMemo(
		() =>
			state.recruitLeads.find((r) => r.id === selectedRecruitLeadId) ??
			null,
		[state.recruitLeads, selectedRecruitLeadId],
	);

	const selectedRecruitVigilante = useMemo(
		() =>
			selectedRecruitLead
				? (vigilantes.find(
						(v) => v.id === selectedRecruitLead.vigilanteId,
					) ?? null)
				: null,
		[selectedRecruitLead],
	);

	const selectedOwnedVigilante = useMemo(
		() =>
			selectedOwnedVigilanteId
				? (vigilantes.find((v) => v.id === selectedOwnedVigilanteId) ??
					null)
				: null,
		[selectedOwnedVigilanteId],
	);

	const activeDossier =
		overlayMode === "recruit"
			? selectedRecruitVigilante
			: selectedOwnedVigilante;

	const closeDossier = () => {
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowVettingModal(false);
	};

	const selectedIncident = useMemo(
		() =>
			state.incidents.find((i) => i.id === state.selectedIncidentId) ??
			null,
		[state.incidents, state.selectedIncidentId],
	);

	const incidentPanelRows = useMemo(() => {
		return [...state.incidents].sort((a, b) => {
			const rk = (i: Incident) =>
				i.status === "active" ? 0 : i.status === "resolving" ? 1 : 2;
			const d = rk(a) - rk(b);
			if (d !== 0) return d;
			if (a.id === state.selectedIncidentId) return -1;
			if (b.id === state.selectedIncidentId) return 1;
			return a.expiresAt - b.expiresAt;
		});
	}, [state.incidents, state.selectedIncidentId]);

	// ── Render ────────────────────────────────────────────────────────────────
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
				.vigilante-recruit-icon { background: none; border: none; }
				.vigilante-hide-scrollbar::-webkit-scrollbar { display: none; }
				.vigilante-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
				.leaflet-pane.characterPane { z-index: 700 !important; }
				.leaflet-pane.incidentPane { z-index: 820 !important; }
				.leaflet-pane.recruitPane { z-index: 860 !important; }
				.vigilante-character-icon > div,
				.vigilante-recruit-icon > div {
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
				@keyframes vigilante-pulse-recruit {
					0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
					60%  { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
					100% { box-shadow: 0 0 0 12px rgba(245,158,11,0); }
				}
				.vigilante-recruit-icon-pulse > div {
					animation-name: vigilante-pulse-recruit;
					animation-duration: 2.2s;
					animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
					animation-iteration-count: infinite;
					will-change: box-shadow;
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
				<ZoomController
					level={state.level}
					onBoundsReady={handleBoundsReady}
				/>
				<TileLayer
					url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
					keepBuffer={8}
					updateWhenZooming
					updateWhenIdle={false}
				/>
				<CharacterMarkers
					pins={visibleDynamicPins}
					onSelect={handleCharacterSelect}
				/>
				<RecruitMarkers
					leads={state.recruitLeads}
					selectedLeadId={selectedRecruitLeadId}
					onSelect={handleRecruitSelect}
				/>
				<IncidentMarkers
					incidents={state.incidents}
					selectedId={state.selectedIncidentId}
					onSelect={handleIncidentSelect}
				/>
			</MapContainer>

			{/* ── Dossier overlay ── */}
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
							initial={{
								opacity: 0,
								x: overlayMode === "owned" ? 30 : -30,
								scale: 0.98,
							}}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{
								opacity: 0,
								x: overlayMode === "owned" ? 24 : -24,
								scale: 0.98,
							}}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className={`absolute top-6 bottom-6 z-[2010] w-[min(34vw,460px)] min-w-[340px] overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md ${
								overlayMode === "owned" ? "right-6" : "left-6"
							}`}
						>
							<div className="flex h-full flex-col">
								<div className="flex items-start justify-between border-b border-amber-900/30 px-5 py-4">
									<div>
										<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
											{overlayMode === "owned"
												? "Vigilante dossier"
												: "Recruit lead"}
										</div>
										<h2 className="mt-2 text-2xl font-bold text-amber-100">
											{activeDossier.alias}
										</h2>
										<div className="mt-1 text-sm text-amber-200/60">
											{activeDossier.name} •{" "}
											{activeDossier.role}
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
												{typeof activeDossier.heat ===
												"number" ? (
													<span className="rounded-full border border-red-900/35 bg-red-950/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-red-300/75">
														Heat{" "}
														{activeDossier.heat}
													</span>
												) : null}
											</div>
											<p className="text-sm leading-6 text-amber-100/75">
												{activeDossier.bio ??
													"Backstory TBD."}
											</p>
										</div>
									</div>

									<div className="mt-6 grid grid-cols-2 gap-3">
										{(
											[
												"combat",
												"stealth",
												"tactics",
												"nerve",
											] as const
										).map((stat) => (
											<div
												key={stat}
												className="rounded-xl border border-amber-900/30 bg-black/25 p-3"
											>
												<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">
													{stat}
												</div>
												<div className="mt-2 text-lg font-bold">
													{activeDossier.stats[stat]}
												</div>
											</div>
										))}
									</div>

									<div className="mt-6 rounded-xl border border-amber-900/30 bg-black/25 p-4">
										<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
											Traits
										</div>
										<div className="mt-3 flex flex-wrap gap-2">
											{(activeDossier.traits ?? []).map(
												(trait: string) => (
													<span
														key={trait}
														className="rounded-full border border-amber-900/30 bg-black/30 px-3 py-1 text-xs text-amber-100/80"
													>
														{trait}
													</span>
												),
											)}
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
											Close file
										</button>
										{overlayMode === "recruit" ? (
											<button
												type="button"
												onClick={() =>
													setShowVettingModal(true)
												}
												className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
											>
												Hire vigilante
											</button>
										) : null}
									</div>
								</div>
							</div>
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>

			<VettingMinigameModal
				open={
					showVettingModal &&
					overlayMode === "recruit" &&
					!!selectedRecruitVigilante
				}
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
								onClick={() => {
									play("zoomTier");
									setState((s) => ({ ...s, level: lvl.id }));
								}}
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

			{/* ── Left incident panel ── */}
			<div className="pointer-events-none absolute inset-y-16 left-0 z-[950] flex items-start">
				<div className="pointer-events-auto mt-4">
					<button
						type="button"
						onClick={() => {
							play("panelToggle");
							setState((s) => ({
								...s,
								showIncidentPanel: !s.showIncidentPanel,
							}));
						}}
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
							className="pointer-events-auto ml-2 mt-0 mb-4 flex max-h-[min(85vh,820px)] w-80 max-w-[80vw] flex-col rounded-xl border border-amber-900/40 bg-black/55 shadow-xl shadow-black/60 backdrop-blur-md"
						>
							<div className="flex items-center justify-between px-4 py-3 border-b border-amber-900/40">
								<div className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-300/80">
									Incidents
								</div>
							</div>

							<div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-2 space-y-2 vigilante-hide-scrollbar">
								{incidentPanelRows.map((inc) => {
									const isSelected =
										state.selectedIncidentId === inc.id;
									const statusBadge =
										inc.status === "resolving"
											? "Resolving"
											: inc.status === "resolved"
												? "Resolved"
												: null;
									return (
										<button
											key={inc.id}
											type="button"
											onClick={() =>
												handleIncidentSelect(inc.id)
											}
											className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
												isSelected
													? "border-amber-500/80 bg-amber-900/50 text-amber-100"
													: "border-amber-900/50 bg-black/40 text-amber-200/70 hover:border-amber-700/70 hover:text-amber-100"
											}`}
										>
											<div className="flex items-start gap-3">
												<div
													className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
														inc.status ===
														"resolved"
															? "border-amber-800/50 bg-amber-950/35 text-amber-200/70"
															: inc.status ===
																  "resolving"
																? "border-amber-700/60 bg-amber-950/40 text-amber-200"
																: "border-red-900 bg-red-900/30 text-red-300"
													}`}
												>
													{inc.status === "active"
														? "!"
														: inc.status ===
															  "resolving"
															? "…"
															: "·"}
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2">
														<div className="font-semibold text-[12px] leading-snug tracking-tight text-amber-50/95">
															{formatIncidentTypeLabel(
																inc.typeLabel,
															)}
														</div>
														{statusBadge !=
															null && (
															<span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-amber-400/70">
																{statusBadge}
															</span>
														)}
													</div>
													<div className="mt-1 text-[11px] text-amber-200/70 leading-snug">
														{inc.summary}
													</div>
													{inc.status ===
														"active" && (
														<IncidentTimerBar
															createdAt={
																inc.createdAt
															}
															expiresAt={
																inc.expiresAt
															}
															onExpire={() =>
																expireIncident(
																	inc.id,
																)
															}
														/>
													)}
												</div>
											</div>
										</button>
									);
								})}

								{state.incidents.length === 0 && (
									<div className="text-[11px] text-amber-200/40 px-1 py-2">
										No incidents. The city is quiet… for
										now.
									</div>
								)}

								<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-black/70 to-transparent" />
							</div>

							<div className="shrink-0 border-t border-amber-900/40 px-3 py-2">
								<div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-400/75">
									Career
								</div>
								<div className="mt-1 text-[10px] tabular-nums text-amber-200/70 leading-snug">
									<span className="text-emerald-400/90">
										{state.careerStats.incidentsResolvedSuccess}
										W
									</span>
									{" · "}
									<span className="text-rose-400/90">
										{state.careerStats.incidentsResolvedFailure}
										L
									</span>
									{" · "}
									{state.careerStats.incidentsExpired} expired
									{" · "}
									{state.careerStats.dispatchesCompleted} dispatches
									{" · "}
									{state.careerStats.vigilantesRecruited} recruited
								</div>
							</div>

							{selectedIncident?.status === "active" && (
								<div className="shrink-0 border-t border-amber-900/40 px-3 py-2.5">
									<button
										type="button"
										onClick={() => setDeployModalOpen(true)}
										className="w-full cursor-pointer rounded-lg border border-amber-700/45 bg-amber-950/25 py-2.5 text-[12px] font-medium text-amber-100/95 transition hover:border-amber-500/40 hover:bg-amber-950/40"
									>
										Deploy
									</button>
								</div>
							)}

							{selectedIncident?.status === "resolving" && (
								<div className="shrink-0 border-t border-amber-900/40 px-3 py-3 text-center text-[11px] text-amber-200/75">
									Resolving…
								</div>
							)}

							{selectedIncident?.status === "resolved" && (
								<div className="shrink-0 border-t border-amber-900/40 bg-black/30 px-3 py-2.5">
									<button
										type="button"
										onClick={() =>
											dismissResolvedIncident(
												selectedIncident.id,
											)
										}
										className="w-full rounded-lg border border-amber-900/50 py-2 text-[11px] text-amber-200/70 hover:border-amber-700/60 hover:text-amber-100"
									>
										Dismiss
									</button>
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* ── Left minigame panel + toggle ── */}
			<div
				className="fixed left-0 flex items-start"
				style={{ top: 160, zIndex: 2000 }}
			>
				<div className="pointer-events-auto">
					<button
						type="button"
						onClick={() =>
							setState((s) => ({
								...s,
								showMinigamePanel: !s.showMinigamePanel,
							}))
						}
						className="cursor-pointer rounded-r-full rounded-l-none border border-amber-900/60 bg-black/75 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-amber-200/80 hover:border-amber-500/80 hover:text-amber-100 transition-colors flex items-center gap-1"
					>
						<span>Minigames</span>
						<span className="text-[11px] flex items-center">
							{state.showMinigamePanel ? (
								<ChevronLeft className="w-3 h-3" aria-hidden />
							) : (
								<ChevronRight className="w-3 h-3" aria-hidden />
							)}
						</span>
					</button>
				</div>

				<AnimatePresence initial={false}>
					{state.showMinigamePanel && (
						<motion.div
							key="minigame-panel"
							initial={{ x: -320, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -320, opacity: 0 }}
							transition={{
								type: "tween",
								duration: 0.22,
								ease: "easeOut",
							}}
							className="pointer-events-auto ml-2 w-80 max-w-[80vw] rounded-xl border border-amber-900/40 bg-black/55 backdrop-blur-md shadow-xl shadow-black/60 flex flex-col"
						>
							<div className="flex items-center justify-between px-4 py-3 border-b border-amber-900/40">
								<div className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-300/80">
									Minigames
								</div>
							</div>

							<div className="px-3 py-2 space-y-2">
								{MINIGAME_OPTIONS.map((game) => (
									<button
										key={game.id}
										type="button"
										onClick={() => {
											if (
												game.id === "inventory-sorter"
											) {
												setInventorySorterOpen(true);
											}
										}}
										className="w-full text-left rounded-lg border border-amber-900/50 bg-black/40 px-3 py-3 text-xs text-amber-200/70 hover:border-amber-700/70 hover:text-amber-100 transition-colors cursor-pointer"
									>
										<div className="flex items-start gap-3">
											<div className="mt-0.5 h-8 w-8 rounded-lg border border-amber-800/60 bg-amber-950/30 flex items-center justify-center text-amber-300">
												<Package2
													className="w-4 h-4"
													aria-hidden
												/>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between gap-2">
													<div className="font-semibold text-[11px] uppercase tracking-[0.16em]">
														{game.title}
													</div>
													{game.status && (
														<div className="text-[10px] uppercase tracking-[0.16em] text-amber-400/60">
															{game.status}
														</div>
													)}
												</div>
												<div className="mt-1 text-[11px] text-amber-200/60 line-clamp-2">
													{game.description}
												</div>
											</div>
										</div>
									</button>
								))}

								<div className="rounded-lg border border-dashed border-amber-900/40 bg-black/20 px-3 py-3 text-[11px] text-amber-200/35">
									More minigames can be added here later.
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{chanceRollOverlay && (
				<IncidentChanceRollOverlay
					rolled={chanceRollOverlay.rolled}
					adjustedPercent={chanceRollOverlay.adjustedPercent}
					beforeLuckPercent={chanceRollOverlay.beforeLuckPercent}
					breakdown={chanceRollOverlay.breakdown}
					contextLabel={chanceRollOverlay.contextLabel}
					success={chanceRollOverlay.success}
					phase={chanceRollOverlay.phase}
					hadDeployedGear={chanceRollOverlay.hadDeployedGear}
					onContinue={() => setChanceRollOverlay(null)}
				/>
			)}

			<IncidentDeployModal
				open={
					deployModalOpen &&
					!!selectedIncident &&
					selectedIncident.status === "active"
				}
				incident={
					selectedIncident && selectedIncident.status === "active"
						? {
								id: selectedIncident.id,
								category: selectedIncident.category,
								typeLabel: selectedIncident.typeLabel,
								summary: selectedIncident.summary,
								createdAt: selectedIncident.createdAt,
								expiresAt: selectedIncident.expiresAt,
							}
						: null
				}
				ownedVigilanteIds={state.ownedVigilanteIds}
				vigilanteInjuryUntil={state.vigilanteInjuryUntil}
				vigilanteSheets={vigilantes}
				resourcePool={state.resourcePool}
				onClose={() => setDeployModalOpen(false)}
				onIncidentExpire={() => {
					if (selectedIncident?.status === "active") {
						expireIncident(selectedIncident.id);
					}
					setDeployModalOpen(false);
				}}
				onConfirm={handleDeployConfirm}
			/>

			<InventorySorterModal
				open={inventorySorterOpen}
				onClose={() => setInventorySorterOpen(false)}
				onWin={() => {
					setInventorySorterOpen(false);
				}}
			/>

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
								resourcePool={state.resourcePool}
								ownedVigilanteIds={state.ownedVigilanteIds}
								vigilanteInjuryUntil={state.vigilanteInjuryUntil}
								purchasedBuffIds={state.purchasedBuffIds}
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

			{/* ── Dialogue: viewport bottom-right (may overlap inventory strip) ── */}
			<div className="pointer-events-none absolute bottom-2 left-4 z-[2500] w-[min(92vw,720px)] min-w-[300px]">
				<div className="pointer-events-auto">
					<NPCDialogueBox
						docked
						open={!!dialogue && !incidentDialogue}
						speaker={
							dialogue
								? {
										id: dialogue.speakerId,
										name: dialogue.name,
										role: dialogue.role,
										portrait: dialogue.portrait,
									}
								: null
						}
						text={dialogue?.text ?? ""}
						onClose={() => setDialogue(null)}
						onNext={() => setDialogue(null)}
					/>
					<NPCDialogueBox
						docked
						open={!!incidentDialogue}
						speaker={
							incidentDialogue
								? {
										id: incidentDialogue.speakerId,
										name: incidentDialogue.speakerName,
										role: incidentDialogue.speakerRole,
										portrait: incidentDialogue.portrait,
									}
								: null
						}
						text={incidentDialogue?.text ?? ""}
						onClose={handleDialogueClose}
						onNext={handleDialogueClose}
						onSpeak={handleDialogueSpeak}
						onStopSpeak={handleDialogueStopSpeak}
						isSpeaking={isBusy}
					/>
				</div>
			</div>
		</div>
	);
}
