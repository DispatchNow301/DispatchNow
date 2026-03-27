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
import FireMinigame from "./FireMinigame";
import HackMinigame from "./HackMinigame";
import type { LatLngBounds, LatLngTuple } from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, useMap } from "react-leaflet";
import * as L from "leaflet";
import Inventory from "./Inventory";
import PoliceSystem from "./police/policeSystem";
import PoliceCaptureModal from "./police/PoliceCaptureModal";
import type { PoliceEtaItem, PoliceRenderItem } from "./police/policeTypes";
import IncidentChanceRollOverlay from "./IncidentChanceRollOverlay";
import IncidentDeployModal from "./IncidentDeployModal";
import { IncidentTimerBar } from "./IncidentTimerBar";
import { vigilantes } from "@/app/components/data/vigilante";
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
import { DEFAULT_ACHIEVEMENT_PROGRESS } from "@/lib/achievements";
import type { UnlockedAchievement } from "@/lib/gameTypes";
import {
	computeIncidentRollOutcome,
	type DispatchRollBreakdown,
} from "@/lib/incidentRoll";
import VettingMinigameModal from "@/components/game/VettingMinigameModal";
import {
	getSessionMarkers,
	insertSessionMarker,
	deleteSessionMarkerByMarkerId,
	subscribeToSessionMarkers,
	getSessionById,
} from "../../lib/multiplayer";
import type {
	AssignedResource,
	AchievementProgress,
} from "../../lib/gameTypes";
import { getSupabaseBrowserClient } from "../../lib/supabaseClient";

import {
	INCIDENT_TEMPLATES,
	shortenPlaceName,
	type IncidentArchetype,
	type IncidentTemplate,
} from "@/lib/incidentTemplates";
import { generateAIDialogue, type AIDialogueContext } from "@/lib/aiDialogue";
import { getNPCProfile } from "@/lib/npcDialogueData";
import { NPC_PORTRAIT } from "@/lib/characterPortraitUrls";
import { GAME_STORY } from "@/lib/gameStory";
import { formatIncidentTypeLabel } from "@/lib/formatIncidentTitle";
import { useAchievements } from "./useAchievements";
import { AchievementNotification } from "./AchievementNotification";
import { useInWorldTTS } from "@/hooks/useInWorldTTS";
import { getVoiceForCharacter } from "@/lib/ttsCharacterVoices";

// ── Inline helpers (not exported by incidentTemplates) ───────────────────────
function archetypeSuccessBase(archetype: IncidentArchetype): number {
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

	return INCIDENT_TEMPLATES[INCIDENT_TEMPLATES.length - 1];
}

/** Player-facing incident blurbs: no semicolons or em dashes (periods instead). */
function normalizeIncidentDescription(text: string): string {
	return text
		.replace(/\s*;\s*/g, ". ")
		.replace(/\u2014/g, ". ")
		.trim();
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
	const filled = normalizeIncidentDescription(
		template.summary.replace(/\{place\}/g, placeName),
	);
	const typeLabel = formatIncidentTypeLabel(template.typeLabel);
	return {
		archetype: template.archetype,
		typeLabel,
		title: `${typeLabel} at ${placeName}`,
		summary: filled,
	};
}

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
	saveKey?: string;
	/** slot identity for menu `updatedAt` / titles (`vigilante:save:*`), separate from `saveKey` game blob. */
	saveSlot?: SaveSlotId;
	/** When set, game state is upserted to Supabase once per minute while you play, plus on tab close. */
	cloudSync?: {
		userId: string;
		slotIndex: 1 | 2 | 3;
	};
	mode?: "singleplayer" | "multiplayer";
	sessionId?: number;
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
	assignedResources: AssignedResource[];
	/** Units out on this incident until recalled */
	deployedResourceIds?: string[];
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
	showPolicePanel: boolean;
	showInventoryPanel: boolean;
	inventoryTab: "vigilantes" | "resources" | "buffs";
	ownedVigilanteIds: string[];
	recruitLeads: RecruitLead[];
	consumedTheftSiteIds: string[];
	resourcePool: Record<string, ResourcePoolEntry>;
	credits: number;
	purchasedUpgradeIds: string[];
	vigilanteInjuryUntil: Record<string, number>;
	careerStats: CareerStats;
	purchasedBuffIds: string[];
	/** Achievement tracking */
	unlockedAchievementIds: UnlockedAchievement[];
	achievementProgress: AchievementProgress;
	activeMinigame: {
		type: "fire" | "hack" | null;
		incidentId: string;
		difficulty: number;
	} | null;
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

const LEVELS = [
	{ id: 1, label: "L1", zoomOut: 15, zoomIn: 15 },
	{ id: 2, label: "L2", zoomOut: 14, zoomIn: 14 },
	{ id: 3, label: "L3", zoomOut: 13, zoomIn: 13 },
];

/**
 * Get past incidents for AI context.
 * Returns a mix of the last 5 resolved incidents + 5 random resolved incidents from earlier,
 * shuffled together for better variety while keeping token count reasonable (~10 incidents max).
 */
function getPastIncidentsForAI(
	incidents: Incident[],
	totalCount: number = 10,
): Array<{ type: string; resolution: string; outcome: string }> {
	const resolved = incidents.filter((inc) => inc.status === "resolved");
	if (resolved.length === 0) return [];

	// Always include the most recent 5
	const lastFive = resolved.slice(-5);

	// If we have more than 5, pick random ones from the earlier pool
	const selected = new Set(lastFive.map((inc) => inc.id));
	const randomPool = resolved.filter((inc) => !selected.has(inc.id));

	// Shuffle and take up to 5 random ones
	const shuffled = randomPool.sort(() => Math.random() - 0.5);
	const randomFive = shuffled.slice(
		0,
		Math.min(5, totalCount - lastFive.length),
	);

	// Combine and shuffle so order isn't just "last 5 then random 5"
	const combined = [...lastFive, ...randomFive].sort(
		() => Math.random() - 0.5,
	);

	return combined.map((inc) => ({
		type: inc.category,
		resolution: inc.title,
		outcome: inc.status,
	}));
}

type MinigameId = "inventory-sorter" | "resource-theft";
type InventorySorterMode = "supply-recovery" | "resource-theft" | null;

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

type TheftSite = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	rewardIds: string[];
	description: string;
};

const THEFT_SITES: TheftSite[] = [
	{
		id: "theft-pharmacy",
		name: "Corner Pharmacy",
		lat: 40.7192,
		lng: -74.0111,
		rewardIds: ["r1", "r1", "r8"],
		description:
			"Medical stock, sealed drawers, and emergency kits. Good haul if you move fast.",
	},
	{
		id: "theft-hardware",
		name: "Utility Hardware Yard",
		lat: 40.7094,
		lng: -74.0102,
		rewardIds: ["r2", "r7", "r9"],
		description:
			"Maintenance gear, barricade equipment, and industrial tools locked in a side cage.",
	},
	{
		id: "theft-transit",
		name: "Transit Supply Cage",
		lat: 40.7176,
		lng: -73.9988,
		rewardIds: ["r3", "r4", "r6"],
		description:
			"Communications gear and protection equipment staged for city crews.",
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
	// helper used to live here ;-;
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

type DialogueRole = "Citizen" | "Police" | "Chief" | "Dispatcher" | "Vigilante";

type DialogueType = "past" | "current" | "story" | "unknown";

type DialogueState = {
	id: string;
	name: string;
	role: DialogueRole;
	portrait: string;
	text: string;
	dialogueType?: DialogueType;
	characterId: string;
};

// Allow null separately
type DialogueStateOrNull = DialogueState | null;

const NPC_DIALOGUE = {
	citizens: [
		{
			id: "cit-oldman",
			name: "Old Man",
			role: "Citizen" as const,
			portrait: "/npcs/OldMan.png",
			personality:
				"Grizzled, experienced, community-focused with deep local knowledge.",
			lines: [
				"I've lived on this block thirty years. Something's wrong tonight.",
				"I heard boots in the alley and then everything went quiet.",
				"You vigilantes are the only ones keeping this city together.",
			],
		},
		{
			id: "cit-girl",
			name: "Girl",
			role: "Citizen" as const,
			portrait: "/npcs/Girl.png",
			personality:
				"Young, observant, street-smart. Knows what she saw and isn't afraid to share.",
			lines: [
				"I saw them run past the subway entrance. They looked armed.",
				"If your crew is taking this job, don't be late.",
				"People are scared. Nobody's waiting for the cops anymore.",
			],
		},
		{
			id: "cit-woman",
			name: "Woman",
			role: "Citizen" as const,
			portrait: "/npcs/Woman.png",
			personality:
				"Worried but practical. Keeps her head down but notices everything.",
			lines: [
				"The whole street feels wrong tonight. Like everyone's waiting for something.",
				"I'm not asking questions. I just need this handled.",
				"They moved fast. Professional fast.",
			],
		},
		{
			id: "cit-helper",
			name: "Helper",
			role: "Citizen" as const,
			portrait: "/npcs/Helper.png",
			personality:
				"Eager to assist, knows the neighborhood intimately, wants to help the vigilantes succeed.",
			lines: [
				"I can point your people to the exact building if they move now.",
				"I've got eyes on the block. Tell me where you want me.",
				"Your vigilantes aren't subtle, but they're faster than dispatch.",
			],
		},
	],
	police: [
		{
			id: "cop-diaz",
			name: "Officer Diaz",
			role: "Police" as const,
			portrait: "/npcs/OfficerDiaz.png",
			personality:
				"Hard-nosed, by-the-book, suspicious of vigilantes but professional.",
			lines: [
				"You better hope I don't catch any of your people at my crime scenes.",
				"Civilian intervention is punishable, don't test me.",
				"HEY! STOP RIGHT THERE!",
			],
		},
		{
			id: "cop-kim",
			name: "Detective Kim",
			role: "Police" as const,
			portrait: "/npcs/DetectiveKim.png",
			personality:
				"Intelligent, observant, aware of vigilante activities but constrained by procedure.",
			lines: [
				"This city makes vigilantes out of everyone eventually.",
				"When your people make messes for us to clean up, we don't get the chance to focus on what's really important...",
				"There's a pattern here. I know what you've been up to… I just need to prove it.",
			],
		},
	],
	chief: {
		id: "chief-williams",
		name: "Chief Williams",
		role: "Chief" as const,
		portrait: "/npcs/ChiefWilliams.png",
		personality:
			"Stressed but pragmatic. Officially opposes vigilantes but unofficially acknowledges they're necessary.",
		lines: [
			"The city is slipping faster than my officers can hold it together.",
			"Damn vigilantes running around the city thinking they're helping us. We don't need them.",
			"If you're going to play guardian, then act like professionals.",
		],
	},
};

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
	if (dist < 1e-9) return { lat: center.lat + minDistance, lng: center.lng };
	const scale = minDistance / dist;
	return {
		lat: center.lat + dLat * scale,
		lng: center.lng + dLng * scale,
	};
}

function stableCitizenPositionAroundIncident(
	incidentId: string,
	center: { lat: number; lng: number },
	slot: number,
) {
	let seed = slot * 97;
	for (let i = 0; i < incidentId.length; i += 1) {
		seed = (seed * 31 + incidentId.charCodeAt(i)) % 100000;
	}

	const angle = ((seed % 360) * Math.PI) / 180;
	const radius = 0.00105 + (seed % 5) * 0.00012;

	return {
		lat: center.lat + Math.cos(angle) * radius,
		lng: center.lng + Math.sin(angle) * radius,
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
		assignedResources: [],
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

	return randomFrom(pool);
}

function applyInventorySorterRewardToPool(
	pool: Record<string, ResourcePoolEntry>,
	items: Array<{ type: string; quantity: number }>,
) {
	const next: Record<string, ResourcePoolEntry> = { ...pool };

	for (const item of items) {
		if (typeof item.type !== "string" || item.type.length === 0) continue;

		const quantity = Number.isFinite(item.quantity)
			? Math.max(0, Math.floor(item.quantity))
			: 0;

		if (quantity <= 0) continue;

		const entry = next[item.type] ?? { qty: 0, deployed: 0 };
		next[item.type] = {
			...entry,
			qty: entry.qty + quantity,
		};
	}

	return next;
}

function makeTheftIncident(site: TheftSite): Incident {
	const now = Date.now();
	const lifetimeMs = 45_000;
	const pos = nudgeNearPoint(site.lat, site.lng, 0.00035);

	const placeShort = shortenPlaceName(site.name);
	const theftSummary = `Theft opportunity at ${site.name}. Move fast before the window closes.`;
	return {
		id: `theft-${site.id}-${now}`,
		category: "crime",
		typeLabel: site.name,
		status: "active",
		lat: pos.lat,
		lng: pos.lng,
		title: `Theft at ${placeShort}`,
		summary: theftSummary,
		createdAt: now,
		expiresAt: now + lifetimeMs,
		successChance: 75,
		assignedResources: [],
	};
}

// ── Icon factories ────────────────────────────────────────────────────────────

/** Fade-in / fade-out duration for map incident markers (JS timeout + CSS). */
const INCIDENT_MAP_FADE_MS = 500;
const INCIDENT_MAP_FADE_S = `${INCIDENT_MAP_FADE_MS / 1000}s`;

/** Wait for map bounds to settle before fetching OSM POIs (avoids abort churn). */
const PLACES_FETCH_DEBOUNCE_MS = 400;

function makeIncidentIcon(
	_category: IncidentArchetype,
	isSelected: boolean,
	isResolved: boolean,
	animateEntrance = false,
	fadeOut = false,
) {
	const resolvedBg = "rgba(24,24,27,0.9)";
	const resolvedBorder = "#52525b";
	const pulse = !fadeOut && !isResolved && isSelected;

	const size = isResolved ? 28 : isSelected ? 36 : 28;
	const half = size / 2;
	const border = isResolved
		? resolvedBorder
		: isSelected
			? "#9a3232"
			: "#7f1d1d";
	const borderW = 2;
	const baseColor = isResolved
		? "#a1a1aa"
		: isSelected
			? "#fca3a6"
			: "#f97373";
	const bg = isResolved
		? resolvedBg
		: isSelected
			? "rgba(158,58,58,0.64)"
			: "rgba(127,29,29,0.6)";
	const glow = "0 0 16px rgba(0,0,0,0.9)";
	/** Match unselected 16px @ 28px; scale with diameter so the bang stays balanced. */
	const fontSize = isResolved ? 16 : Math.round((16 * size) / 28);

	const html = `<div style="
		width:${size}px;height:${size}px;border-radius:999px;
		border:${borderW}px solid ${border};background:${bg};
		display:flex;align-items:center;justify-content:center;
		color:${baseColor};font-weight:800;font-size:${fontSize};
		text-shadow:0 0 4px rgba(0,0,0,0.9);
		box-shadow:${glow};">!</div>`;

	const classes = ["vigilante-incident-icon"];
	if (pulse) classes.push("vigilante-incident-icon-pulse");
	if (isSelected && !isResolved)
		classes.push("vigilante-incident-icon-selected");
	if (animateEntrance) classes.push("vigilante-incident-icon-fade-in");
	if (fadeOut) classes.push("vigilante-incident-icon-fade-out");

	return L.divIcon({
		html,
		className: classes.join(" "),
		iconSize: [size, size],
		iconAnchor: [half, half],
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
		width:44px;
		height:44px;
		display:flex;
		align-items:center;
		justify-content:center;
		border-radius:999px;
		background:transparent;
		cursor:pointer;
		pointer-events:auto;
	">
		<div style="
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
			pointer-events:none;
		">${initial}</div>
	</div>`;

	return L.divIcon({
		html,
		className: "vigilante-character-icon",
		iconSize: [44, 44],
		iconAnchor: [22, 22],
	});
}

function makeRecruitIcon(initial: string) {
	const html = `<div style="
		width:44px;
		height:44px;
		display:flex;
		align-items:center;
		justify-content:center;
		border-radius:999px;
		background:transparent;
		pointer-events:none;
	">
		<div style="
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
			pointer-events:none;
		">${initial}</div>
	</div>`;

	return L.divIcon({
		html,
		className: "vigilante-recruit-icon",
		iconSize: [44, 44],
		iconAnchor: [22, 22],
	});
}

function makeTheftSiteIcon() {
	const html = `<div style="
		width:36px;
		height:36px;
		border-radius:12px;
		border:2px solid #7c3aed;
		background:rgba(76,29,149,0.9);
		display:flex;
		align-items:center;
		justify-content:center;
		color:#f5d0fe;
		font-weight:800;
		font-size:17px;
		text-shadow:0 0 4px rgba(0,0,0,0.85);
		box-shadow:0 0 18px rgba(124,58,237,0.45);
		cursor:pointer;
	">▣</div>`;

	return L.divIcon({
		html,
		className: "vigilante-theftsite-icon",
		iconSize: [36, 36],
		iconAnchor: [18, 18],
	});
}

function formatEta(ms: number) {
	const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	}
	return `${seconds}s`;
}

function formatCountdown(ms: number) {
	const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes > 0) {
		return `${minutes}:${String(seconds).padStart(2, "0")}`;
	}
	return `${seconds}s`;
}

const POLICE_BAR_MAX_MS = 60_000;

function PoliceEtaBar({ etaMs }: { etaMs: number }) {
	const ratio = Math.max(0, Math.min(1, etaMs / POLICE_BAR_MAX_MS));
	const visibleWidth = etaMs > 0 ? Math.max(ratio * 100, 6) : 0;

	return (
		<div className="mt-2">
			<div className="h-[5px] w-full rounded-full bg-amber-950/70 overflow-hidden border border-amber-900/40">
				<div
					className="h-full rounded-full transition-[width] duration-300 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.55)]"
					style={{
						width: `${visibleWidth}%`,
						background:
							"linear-gradient(90deg, rgba(251,191,36,0.95) 0%, rgba(245,158,11,0.9) 100%)",
					}}
				/>
			</div>
		</div>
	);
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

function CharacterMarkerItem({
	pin,
	onSelect,
}: {
	pin: CharacterPin;
	onSelect: (pin: CharacterPin) => void;
}) {
	const markerRef = useRef<L.Marker | null>(null);

	const icon = useMemo(
		() => makeCharacterIcon(pin.initial, pin.kind),
		[pin.initial, pin.kind],
	);

	useEffect(() => {
		if (!markerRef.current) return;
		markerRef.current.setLatLng([pin.lat, pin.lng]);
	}, [pin.lat, pin.lng]);

	return (
		<Marker
			ref={(instance) => {
				markerRef.current = instance;
			}}
			position={[pin.lat, pin.lng]}
			icon={icon}
			zIndexOffset={
				pin.kind === "vigilante"
					? 11000
					: pin.kind === "police"
						? 9000
						: 4000
			}
			interactive
			bubblingMouseEvents={false}
			riseOnHover
			eventHandlers={{
				mousedown: (e) => {
					e.originalEvent?.preventDefault?.();
					e.originalEvent?.stopPropagation?.();
				},
				click: (e) => {
					e.originalEvent?.preventDefault?.();
					e.originalEvent?.stopPropagation?.();
					onSelect(pin);
				},
			}}
		/>
	);
}

function CharacterMarkers({
	pins,
	onSelect,
}: {
	pins: CharacterPin[];
	onSelect: (pin: CharacterPin) => void;
}) {
	return (
		<Pane name="characterPane" style={{ zIndex: 820 }}>
			{pins.map((pin) => (
				<CharacterMarkerItem
					key={pin.id}
					pin={pin}
					onSelect={onSelect}
				/>
			))}
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
						eventHandlers={{ click: () => onSelect(lead) }}
					/>
				);
			})}
		</Pane>
	);
}

function TheftSiteMarkers({
	//working as intended on master branch Thursday March 26 3:00AM EDT
	sites,
	onSelect,
}: {
	sites: TheftSite[];
	onSelect: (site: TheftSite) => void;
}) {
	return (
		<Pane name="theftSitePane" style={{ zIndex: 900 }}>
			{sites.map((site) => (
				<Marker
					key={site.id}
					position={[site.lat, site.lng]}
					icon={makeTheftSiteIcon()}
					zIndexOffset={13000}
					interactive
					riseOnHover
					eventHandlers={{
						click: () => onSelect(site),
					}}
				/>
			))}
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
		Map<string, { selected: boolean; fadeOut: boolean; icon: L.DivIcon }>
	>(new Map());
	const incidentFadeSeenIdsRef = useRef<Set<string>>(new Set());
	const [fadingOut, setFadingOut] = useState<Map<string, Incident>>(
		() => new Map(),
	);
	const prevIncidentsRef = useRef<Incident[]>([]);
	const fadeOutTimeoutsRef = useRef<Map<string, number>>(new Map());

	useEffect(() => {
		const prev = prevIncidentsRef.current;
		const prevOngoing = prev.filter(isOngoingIncident);
		const currOngoingIds = new Set(
			incidents.filter(isOngoingIncident).map((i) => i.id),
		);
		for (const p of prevOngoing) {
			if (!currOngoingIds.has(p.id)) {
				setFadingOut((prevMap) => {
					const next = new Map(prevMap);
					next.set(p.id, p);
					return next;
				});
				const existing = fadeOutTimeoutsRef.current.get(p.id);
				if (existing) clearTimeout(existing);
				const tid = window.setTimeout(() => {
					fadeOutTimeoutsRef.current.delete(p.id);
					setFadingOut((prevMap) => {
						const next = new Map(prevMap);
						next.delete(p.id);
						return next;
					});
					iconCacheRef.current.delete(p.id);
					incidentFadeSeenIdsRef.current.delete(p.id);
				}, INCIDENT_MAP_FADE_MS);
				fadeOutTimeoutsRef.current.set(p.id, tid);
			}
		}
		prevIncidentsRef.current = incidents;
	}, [incidents]);

	useEffect(() => {
		return () => {
			for (const t of fadeOutTimeoutsRef.current.values()) {
				clearTimeout(t);
			}
			fadeOutTimeoutsRef.current.clear();
		};
	}, []);

	useEffect(() => {
		const ongoingIds = new Set(
			incidents.filter(isOngoingIncident).map((i) => i.id),
		);
		for (const key of iconCacheRef.current.keys()) {
			if (!ongoingIds.has(key) && !fadingOut.has(key)) {
				iconCacheRef.current.delete(key);
			}
		}
	}, [incidents, fadingOut]);

	const ongoingList = incidents.filter(isOngoingIncident);
	const ongoingIds = new Set(ongoingList.map((i) => i.id));
	const fadeRows = [...fadingOut.entries()]
		.filter(([id]) => !ongoingIds.has(id))
		.map(([, snap]) => snap);
	const rows: { inc: Incident; fadingOut: boolean }[] = [
		...ongoingList.map((inc) => ({ inc, fadingOut: false })),
		...fadeRows.map((inc) => ({ inc, fadingOut: true })),
	];

	return (
		<Pane name="incidentPane" style={{ zIndex: 940 }}>
			{rows.map(({ inc, fadingOut: isFadingOut }) => {
				const isSelected = inc.id === selectedId;
				const isFirstMapAppearance =
					!isFadingOut && !incidentFadeSeenIdsRef.current.has(inc.id);
				if (isFirstMapAppearance) {
					incidentFadeSeenIdsRef.current.add(inc.id);
				}
				return (
					<Marker
						key={inc.id}
						position={[inc.lat, inc.lng]}
						icon={(() => {
							const cached = iconCacheRef.current.get(inc.id);
							if (
								cached &&
								cached.selected === isSelected &&
								cached.fadeOut === isFadingOut
							) {
								return cached.icon;
							}
							const icon = makeIncidentIcon(
								inc.category,
								isSelected,
								false,
								isFirstMapAppearance,
								isFadingOut,
							);
							iconCacheRef.current.set(inc.id, {
								selected: isSelected,
								fadeOut: isFadingOut,
								icon,
							});
							return icon;
						})()}
						zIndexOffset={isSelected ? 15000 : 10000}
						interactive={!isFadingOut}
						riseOnHover={!isFadingOut}
						eventHandlers={
							isFadingOut ? {} : { click: () => onSelect(inc.id) }
						}
					/>
				);
			})}
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
	if (typeof o.staffingSupportMultiplier === "number")
		base.staffingSupportMultiplier = o.staffingSupportMultiplier;
	if (typeof o.gearPresenceMultiplier === "number")
		base.gearPresenceMultiplier = o.gearPresenceMultiplier;
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
		summary: normalizeIncidentDescription(o.summary),
		createdAt: o.createdAt,
		expiresAt: o.expiresAt,
		successChance: o.successChance,
		assignedResources: Array.isArray(o.assignedResources)
			? o.assignedResources
			: [],
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

function pruneExpiredInjuries(
	map: Record<string, number> | undefined,
	now: number,
): Record<string, number> {
	if (!map) return {};
	const next: Record<string, number> = {};
	for (const [id, until] of Object.entries(map)) {
		if (typeof until === "number" && until > now) next[id] = until;
	}
	return next;
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
		showPolicePanel: false,
		showInventoryPanel: true,
		inventoryTab: "vigilantes",
		ownedVigilanteIds: ["bruce", "parya"],
		recruitLeads: [],
		consumedTheftSiteIds: [],
		resourcePool: { ...DEFAULT_RESOURCE_POOL },
		credits: 500,
		purchasedUpgradeIds: [],
		vigilanteInjuryUntil: {},
		careerStats: { ...DEFAULT_CAREER_STATS },
		purchasedBuffIds: mergePurchasedBuffIds(undefined),
		unlockedAchievementIds: [],
		achievementProgress: {
			...DEFAULT_ACHIEVEMENT_PROGRESS,
			uniqueVigilantesOwned: new Set(["bruce", "parya"]),
			sessionStartTime: Date.now(),
		},
		activeMinigame: null,
	};
}

function loadState(saveKey: string): GameState {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return initialState();
		const p = JSON.parse(raw) as Partial<GameState>;
		const rawShowIncidentPanel =
			typeof p.showIncidentPanel === "boolean"
				? p.showIncidentPanel
				: true;
		const rawShowMinigamePanel =
			typeof p.showMinigamePanel === "boolean"
				? p.showMinigamePanel
				: false;
		const rawShowPolicePanel =
			typeof p.showPolicePanel === "boolean" ? p.showPolicePanel : false;

		const activeLeftTab = rawShowMinigamePanel
			? "minigame"
			: rawShowPolicePanel
				? "police"
				: rawShowIncidentPanel
					? "incident"
					: null;

		const selectedFromSave =
			typeof p.selectedIncidentId === "string"
				? p.selectedIncidentId
				: null;

		// Load achievement progress
		let achievementProgress: AchievementProgress = {
			...DEFAULT_ACHIEVEMENT_PROGRESS,
		};
		if (p.achievementProgress) {
			const ap = p.achievementProgress;
			achievementProgress = {
				totalCreditsEarned:
					typeof ap.totalCreditsEarned === "number"
						? Math.max(0, ap.totalCreditsEarned)
						: 0,
				highestSinglePayout:
					typeof ap.highestSinglePayout === "number"
						? Math.max(0, ap.highestSinglePayout)
						: 0,
				currentStreak:
					typeof ap.currentStreak === "number"
						? Math.max(0, ap.currentStreak)
						: 0,
				bestStreak:
					typeof ap.bestStreak === "number"
						? Math.max(0, ap.bestStreak)
						: 0,
				recentResolutions: Array.isArray(ap.recentResolutions)
					? ap.recentResolutions
					: [],
				dispatchesStarted:
					typeof ap.dispatchesStarted === "number"
						? Math.max(0, ap.dispatchesStarted)
						: 0,
				incidentsByArchetype:
					typeof ap.incidentsByArchetype === "object"
						? ap.incidentsByArchetype
						: {},
				maxResourceInventory:
					typeof ap.maxResourceInventory === "object"
						? ap.maxResourceInventory
						: {},
				uniqueVigilantesOwned:
					p.ownedVigilanteIds && Array.isArray(p.ownedVigilanteIds)
						? new Set(p.ownedVigilanteIds as string[])
						: new Set(["bruce", "parya"]),
				vigilanteInjuries:
					typeof ap.vigilanteInjuries === "number"
						? Math.max(0, ap.vigilanteInjuries)
						: 0,
				totalPlaytimeMs:
					typeof ap.totalPlaytimeMs === "number"
						? Math.max(0, ap.totalPlaytimeMs)
						: 0,
				sessionStartTime:
					typeof ap.sessionStartTime === "number"
						? ap.sessionStartTime
						: Date.now(),
			};
		}

		return {
			level:
				typeof p.level === "number" && p.level >= 1 && p.level <= 3
					? p.level
					: 1,
			selectedIncidentId:
				activeLeftTab === "incident" ? selectedFromSave : null,
			incidents: Array.isArray(p.incidents)
				? p.incidents
						.map(parseStoredIncident)
						.filter((x): x is Incident => x !== null)
				: [],
			showIncidentPanel: activeLeftTab === "incident",
			showMinigamePanel: activeLeftTab === "minigame",
			showPolicePanel: activeLeftTab === "police",
				showInventoryPanel:
					typeof p.showInventoryPanel === "boolean"
						? p.showInventoryPanel
						: true,
				inventoryTab:
				p.inventoryTab === "vigilantes" ||
				p.inventoryTab === "resources" ||
				p.inventoryTab === "buffs"
						? p.inventoryTab
						: "vigilantes",
			ownedVigilanteIds: Array.isArray(p.ownedVigilanteIds)
				? (p.ownedVigilanteIds as string[])
				: ["bruce", "parya"],
			recruitLeads: Array.isArray(p.recruitLeads)
				? (p.recruitLeads as RecruitLead[])
				: [],
			consumedTheftSiteIds: Array.isArray(p.consumedTheftSiteIds)
				? (p.consumedTheftSiteIds as string[]).filter(
					(id): id is string => typeof id === "string",
				)
				: [],
			resourcePool: mergeResourcePool(p.resourcePool),
			credits:
				typeof p.credits === "number" && Number.isFinite(p.credits)
					? Math.max(0, Math.floor(p.credits))
					: 500,
			vigilanteInjuryUntil: pruneExpiredInjuries(
				p.vigilanteInjuryUntil as Record<string, number> | undefined,
				Date.now(),
			),
			careerStats: mergeCareerStats(p.careerStats),
			purchasedUpgradeIds: Array.isArray(p.purchasedUpgradeIds)
				? (p.purchasedUpgradeIds as string[])
				: [],
			purchasedBuffIds: mergePurchasedBuffIds(p.purchasedBuffIds),
			unlockedAchievementIds: Array.isArray(p.unlockedAchievementIds)
				? (
						p.unlockedAchievementIds as
							| string[]
							| UnlockedAchievement[]
					).map((a) =>
						typeof a === "string"
							? { achievementId: a, unlockedAt: Date.now() }
							: a,
					)
				: [],
			achievementProgress,
			activeMinigame: null,
		};
	} catch {
		return initialState();
	}
}

function saveState(saveKey: string, state: GameState) {
	localStorage.setItem(saveKey, JSON.stringify(state));
}

export default function StreetMapScene({
	saveKey,
	saveSlot,
	cloudSync,
	mode = "singleplayer",
	sessionId,
}: Props) {
	const [state, setState] = useState<GameState>(() =>
		mode === "singleplayer" && saveKey
			? loadState(saveKey)
			: initialState(),
	);
	const stateRef = useRef(state);
	stateRef.current = state;

	const [isHost, setIsHost] = useState(false);

	const [selectedOwnedVigilanteId, setSelectedOwnedVigilanteId] = useState<
		string | null
	>(null);
	const [selectedRecruitLeadId, setSelectedRecruitLeadId] = useState<
		string | null
	>(null);
	const [selectedTheftSiteId, setSelectedTheftSiteId] = useState<
		string | null
	>(null);

	const [inventorySorterMode, setInventorySorterMode] =
		useState<InventorySorterMode>(null);

	const [policeCaptureState, setPoliceCaptureState] = useState<{
		open: boolean;
		capturedIds: string[];
	}>({
		open: false,
		capturedIds: [],
	});

	// Achievement tracking
	const achievements = useAchievements(state, setState);

	const [pendingHackMinigame, setPendingHackMinigame] = useState<{
		incidentId: string;
	} | null>(null);

	const isGameplayPausedByMinigame = inventorySorterMode !== null || state.activeMinigame !== null;

	// ── Pause tracking refs ───────────────────────────────────────────────────
	// pauseStartedAtRef: wall-clock time when the current pause began.
	//   atomically inside the expiry interval's setState. This is the key fix —
	//   the old code applied the stretch in a separate setState which could race
	//   against the expiry check and delete incidents that still had time left.
	const pauseStartedAtRef = useRef<number | null>(null);

	const resolveIncidentDueAtRef = useRef<number | null>(null);
	const resolveIncidentResumeFnRef = useRef<(() => void) | null>(null);
	const pausedResolveRemainingMsRef = useRef<number | null>(null);

	const [showExitingModal, setShowExitingModal] = useState(false);
	const [deployModalOpen, setDeployModalOpen] = useState(false);
	const [showVettingModal, setShowVettingModal] = useState(false);
	const [dialogue, setDialogue] = useState<DialogueStateOrNull>(null);
	const [overlayMode, setOverlayMode] = useState<OverlayMode>("recruit");
	/** Tracks whether inventory was open before dialogue appeared (for auto-restore) */
	const inventoryWasOpenRef = useRef(false);
	/** Stores dialogue data while waiting for inventory to close before showing it */
	const pendingDialogueRef = useRef<DialogueStateOrNull>(null);
	/** Tracks if inventory is currently animating closed */
	const inventoryIsClosingRef = useRef(false);

	// TTS for NPC dialogue
	const tts = useInWorldTTS();
	const lastSpokenTextRef = useRef<string | null>(null);
	const dialogueOpenRef = useRef<boolean>(false);
	const currentDialogueIdRef = useRef<string | null>(null);

	// AI Dialogue on incident spawn: track which incidents we've announced
	const announcedIncidentIdsRef = useRef<Set<string>>(new Set());
	const incidentCounterRef = useRef<number>(0); // Counter for every 5 incidents

	// Inventory close animation helper: returns a promise that resolves when inventory is fully closed
	const waitForInventoryClose = (): Promise<void> => {
		return new Promise((resolve) => {
			if (!state.showInventoryPanel) {
				// Already closed
				resolve();
				return;
			}
			// Set flag and close inventory
			inventoryIsClosingRef.current = true;
			setState((s) => ({
				...s,
				showInventoryPanel: false,
			}));
			// Wait for exit animation: AnimatePresence delay is 0.48s (see Inventory container)
			// We add a small buffer to ensure animation is complete
			setTimeout(() => {
				inventoryIsClosingRef.current = false;
				resolve();
			}, 500); // 0.48s animation + buffer
		});
	};

	/**
	 * Get a random character for incident spawn dialogue.
	 * Can be: Dispatcher, Police officer, or Vigilante from roster.
	 */
	function getRandomSpawnCharacter() {
		const roll = Math.random();
		const ownedVigilantes = vigilantes.filter((v) =>
			state.ownedVigilanteIds.includes(v.id),
		);

		if (roll < 0.33 && ownedVigilantes.length > 0) {
			// Pick random owned vigilante
			const vigilante =
				ownedVigilantes[
					Math.floor(Math.random() * ownedVigilantes.length)
				];
			return {
				type: "vigilante" as const,
				profile: {
					id: vigilante.id,
					name: vigilante.alias || vigilante.name,
					role: "Vigilante" as const,
					portrait: vigilante.portrait,
					personality:
						vigilante.bio ||
						`A skilled operative with ${vigilante.role} responsibilities.`,
				},
				situation:
					"Vigilante reporting to their handler about the new incident or rallying the crew.",
			};
		} else if (roll < 0.66) {
			// Pick random police officer
			const officer =
				NPC_DIALOGUE.police[
					Math.floor(Math.random() * NPC_DIALOGUE.police.length)
				];
			return {
				type: "police" as const,
				profile: {
					id: officer.id,
					name: officer.name,
					role: officer.role,
					portrait: officer.portrait,
					personality: officer.personality,
				},
				situation:
					"Police officer discussing the new incident, possibly giving orders or warnings.",
			};
		} else {
			// Dispatcher
			const dispatcherProfile = getNPCProfile(
				"dispatcher",
				"Dispatcher",
			) || {
				id: "dispatcher",
				name: "Dispatcher",
				role: "Dispatcher" as const,
				portrait: NPC_PORTRAIT.dispatcher,
				personality:
					"Professional, urgent, information-focused. The voice of authority and coordination.",
			};
			return {
				type: "dispatcher" as const,
				profile: dispatcherProfile,
				situation:
					"Dispatcher announcing a new incident to the vigilante crew.",
			};
		}
	}

	// Handle opening dialogue with sequencing
	const openDialogue = async (dialogueData: Omit<DialogueState, "id">) => {
		// ← id not required
		if (!dialogueData) return;

		// Prevent opening the same dialogue again while it’s already open
		if (dialogueOpenRef.current) {
			return;
		}

		// Generate a unique id for this dialogue instance
		const dialogueWithId = {
			...dialogueData,
			id: `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
		};

		// If inventory is visible, close it first then show dialogue
		if (state.showInventoryPanel) {
			inventoryWasOpenRef.current = true;
			pendingDialogueRef.current = dialogueWithId; // ← store with id
			await waitForInventoryClose();
			if (pendingDialogueRef.current) {
				dialogueOpenRef.current = true;
				setDialogue(pendingDialogueRef.current);
				pendingDialogueRef.current = null;
			}
		} else {
			dialogueOpenRef.current = true;
			setDialogue(dialogueWithId);
		}
	};

	const handlePoliceResolveIncident = useCallback((incidentId: string) => {
		const current = stateRef.current;
		const targetIncident =
			current.incidents.find((incident) => incident.id === incidentId) ?? null;

		const capturedIds = (targetIncident?.deployedVigilanteIds ?? []).filter(
			(id) => current.ownedVigilanteIds.includes(id),
		);

		const capturedSet = new Set(capturedIds);

		setState((s) => ({
			...s,
			selectedIncidentId:
				s.selectedIncidentId === incidentId
					? null
					: s.selectedIncidentId,
			ownedVigilanteIds:
				capturedIds.length > 0
					? s.ownedVigilanteIds.filter((id) => !capturedSet.has(id))
					: s.ownedVigilanteIds,
			incidents: s.incidents.filter(
				(incident) => incident.id !== incidentId,
			),
		}));

		if (capturedIds.length > 0) {
			setPoliceCaptureState({
				open: true,
				capturedIds,
			});
		}
	}, []);

	const toggleExclusiveLeftPanel = useCallback(
		(panel: "incident" | "minigame" | "police") => {
			setState((s) => {
				const isSamePanelOpen =
					(panel === "incident" && s.showIncidentPanel) ||
					(panel === "minigame" && s.showMinigamePanel) ||
					(panel === "police" && s.showPolicePanel);

				if (isSamePanelOpen) {
					return {
						...s,
						showIncidentPanel: false,
						showMinigamePanel: false,
						showPolicePanel: false,
						selectedIncidentId:
							panel === "incident" ? null : s.selectedIncidentId,
					};
				}

				return {
					...s,
					showIncidentPanel: panel === "incident",
					showMinigamePanel: panel === "minigame",
					showPolicePanel: panel === "police",
					selectedIncidentId:
						panel === "incident" ? s.selectedIncidentId : null,
				};
			});
		},
		[],
	);

	// Dialogue-Inventory Interaction: auto-close inventory when dialogue opens,
	// and restore it when dialogue closes only if it was open before.
	// Note: `inventoryWasOpenRef` is set by `openDialogue` before dialogue appears.
	useEffect(() => {
		if (dialogue) {
			// Dialogue opened: close inventory if it's still open
			if (state.showInventoryPanel) {
				setState((s) => ({
					...s,
					showInventoryPanel: false,
				}));
			}
		} else {
			// Dialogue closed: restore inventory only if it was previously open
			if (inventoryWasOpenRef.current) {
				setState((s) => ({
					...s,
					showInventoryPanel: true,
				}));
			}
			// Reset the ref for next time
			inventoryWasOpenRef.current = false;
			// Also reset dialogue open flag when dialogue closes
			dialogueOpenRef.current = false;
		}
		// Only run when dialogue opens/closes; intentionally depend on `dialogue`
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dialogue]);

	// TTS: speak dialogue text when it changes, but only once per unique text
	useEffect(() => {
		if (dialogue && dialogue.text) {
			if (lastSpokenTextRef.current !== dialogue.text) {
				lastSpokenTextRef.current = dialogue.text;
				currentDialogueIdRef.current = dialogue.id; // ← store current id

				const voiceId = getVoiceForCharacter(dialogue.characterId);
				tts.speak(dialogue.text, voiceId)
					.then(() => {
						// Only close if the dialogue that finished is still the active one
						if (currentDialogueIdRef.current === dialogue.id) {
							setDialogue(null);
						}
					})
					.catch((err) => {
						console.warn("[TTS] failed to speak dialogue:", err);
					});
			}
		} else {
			tts.stop();
			lastSpokenTextRef.current = null;
			currentDialogueIdRef.current = null; // ← clear ref when no dialogue
		}
	}, [dialogue, tts]);

	// AI Dialogue on incident spawn: track which incidents we've announced
	useEffect(() => {
		// Find incidents that haven't been announced yet
		const unannouncedIncidents = state.incidents.filter(
			(inc) => !announcedIncidentIdsRef.current.has(inc.id),
		);

		unannouncedIncidents.forEach(async (incident) => {
			// Mark as announced immediately to prevent re-entry
			announcedIncidentIdsRef.current.add(incident.id);
			incidentCounterRef.current += 1;

			// Only try AI every 5th incident (5, 10, 15, ...)
			if (incidentCounterRef.current % 5 !== 0) {
				return; // Skip dialogue for this incident
			}

			// Get random character for this incident
			const { profile, situation } = getRandomSpawnCharacter();

			// Build past incidents context (mix of last 5 and random 5 resolved)
			const pastIncidents = getPastIncidentsForAI(state.incidents, 10);

			const aiContext: AIDialogueContext = {
				characterId: profile.id,
				characterRole: profile.role,
				overallStory: GAME_STORY,
				pastIncidents: pastIncidents,
				currentIncident: {
					type: incident.category,
					description: incident.summary,
					location: incident.title,
				},
				situation: situation,
				customProfile: {
					name: profile.name,
					portrait: profile.portrait,
					personality: profile.personality,
				},
			};

			// Try AI dialogue - if it fails, show nothing (no fallback)
			const result = await generateAIDialogue(aiContext);
			if (result) {
				// Check if the incident still exists in current state (not expired/removed)
				const stillExists = state.incidents.some(
					(inc) => inc.id === incident.id,
				);
				if (stillExists) {
					openDialogue({
						name: result.speakerName,
						role: result.speakerRole,
						portrait: result.portrait,
						text: result.text,
						dialogueType: result.type,
						characterId: result.speakerId,
					});
				}
			}
			// If AI fails (null) or incident no longer exists, do nothing - no dialogue shown
		});
	}, [state.incidents]); // Run when incidents array changes

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

	const resolveIncidentTimeoutRef = useRef<number | null>(null);
	const cloudPushInFlightRef = useRef(false);

	// Cloud sync: Supabase upsert while playing (plus pagehide / unmount).
	const CLOUD_SYNC_INTERVAL_MS = 60_000;

	const [policeRenderItems, setPoliceRenderItems] = useState<
		PoliceRenderItem[]
	>(() =>
		STATIC_CHARACTER_BASES.filter((pin) => pin.kind === "police").map(
			(pin) => ({
				pinId: pin.id as PoliceRenderItem["pinId"],
				name: pin.name,
				initial: pin.initial,
				lat: pin.lat,
				lng: pin.lng,
				mode: "patrolling",
				visiblePath: [],
				assignedIncidentId: null,
			}),
		),
	);

	const [policeEtaItems, setPoliceEtaItems] = useState<PoliceEtaItem[]>([]);

	const levelBoundsRef = useRef<Map<number, LatLngBounds>>(new Map());
	const spawnPlacesByLevelRef = useRef<Map<number, OsmPlace[]>>(new Map());
	const placesFetchGenRef = useRef<Map<number, number>>(new Map());
	const placesAbortByLevelRef = useRef<Map<number, AbortController>>(
		new Map(),
	);
	/** Debounce so rapid map/bounds updates don't abort every in-flight Overpass fetch. */
	const placesFetchDebounceByLevelRef = useRef<Map<number, number>>(
		new Map(),
	);
	/** True while a /api/osm/places request is in flight for that level (spawn retries must not abort it). */
	const placesFetchInFlightRef = useRef<Map<number, boolean>>(new Map());

	useEffect(() => {
		if (mode !== "multiplayer" || !sessionId) return;

		let active = true;

		const loadMarkers = async () => {
			try {
				const rows = await getSessionMarkers(sessionId);
				if (!active) return;

				const incidents = rows.map(
					(row): Incident => ({
						id: row.marker_id,
						category:
							row.kind === "theft"
								? "crime"
								: row.kind === "hire"
									? "medical"
									: "fire_rescue",
						typeLabel: row.title,
						status: row.status === "active" ? "active" : "resolved",
						lat: row.x,
						lng: row.y,
						title: row.title,
						summary: normalizeIncidentDescription(row.details),
						createdAt: new Date(row.created_at).getTime(),
						expiresAt: row.expires_at
							? new Date(row.expires_at).getTime()
							: Date.now() + 30000,
						successChance: 75,
						assignedResources: row.assigned_resources ?? [],
					}),
				);

				setState((prev) => ({
					...prev,
					incidents,
				}));
			} catch (error) {
				console.error("Failed to load multiplayer markers:", error);
			}
		};

		loadMarkers();

		const unsubscribe = subscribeToSessionMarkers(sessionId, loadMarkers);

		return () => {
			active = false;
			unsubscribe();
		};
	}, [mode, sessionId]);

	useEffect(() => {
		if (mode !== "multiplayer" || !sessionId) return;

		const checkHost = async () => {
			try {
				const session = await getSessionById(sessionId);
				const supabase = getSupabaseBrowserClient();
				const { data } = await supabase.auth.getUser();
				const user = data?.user;

				if (session && user && session.host_user_id === user.id) {
					setIsHost(true);
				} else {
					setIsHost(false);
				}
			} catch (error) {
				console.error("Failed to determine host:", error);
				setIsHost(false);
			}
		};

		void checkHost();
	}, [mode, sessionId]);

	useEffect(() => {
		if (mode !== "singleplayer" || !saveKey) return;
		setState(loadState(saveKey));
	}, [mode, saveKey]);

	useEffect(() => {
		if (mode !== "singleplayer" || !saveKey) return;
		saveState(saveKey, state);
		// Game JSON lives at `saveKey`; slot meta (incl. menu "last updated") lives at `keyForSlot(saveSlot)`.
		if (saveSlot) touchSave(saveSlot);
	}, [mode, saveKey, saveSlot, state]);

	// Re-sync the three market fields (credits, resourcePool, purchasedUpgradeIds)
	// when an external page (black market test, game-over screen) writes to the
	// same localStorage key. The `storage` event fires in the same tab on
	// same-origin writes, so this works when navigating between Next.js routes.
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== saveKey) return;
			const saved = loadState(saveKey);
			setState((s) => ({
				...s,
				credits: saved.credits,
				resourcePool: saved.resourcePool,
				purchasedUpgradeIds: saved.purchasedUpgradeIds,
			}));
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [saveKey]);

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
			const title =
				meta?.meta.title ?? `Cloud Slot ${cloudSync.slotIndex}`;
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
		}, CLOUD_SYNC_INTERVAL_MS);
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
	}, [state.selectedIncidentId]);

	useEffect(() => {
		return () => {
			if (resolveIncidentTimeoutRef.current) {
				clearTimeout(resolveIncidentTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isGameplayPausedByMinigame) {
			if (pauseStartedAtRef.current === null) {
				pauseStartedAtRef.current = Date.now();
			}

			if (
				resolveIncidentTimeoutRef.current &&
				resolveIncidentResumeFnRef.current &&
				resolveIncidentDueAtRef.current !== null
			) {
				window.clearTimeout(resolveIncidentTimeoutRef.current);
				resolveIncidentTimeoutRef.current = null;

				pausedResolveRemainingMsRef.current = Math.max(
					0,
					resolveIncidentDueAtRef.current - Date.now(),
				);
				resolveIncidentDueAtRef.current = null;
			}

			return;
		}

		// Unpausing: accumulate elapsed ms for the expiry interval to consume.
		if (pauseStartedAtRef.current !== null) {
			const pausedMs = Date.now() - pauseStartedAtRef.current;
			pauseStartedAtRef.current = null;

		if (pausedMs > 0) {
			setState((s) => ({
				...s,
				incidents: s.incidents.map((incident) =>
					incident.status === "resolved"
						? incident
						: {
								...incident,
								createdAt: incident.createdAt + pausedMs,
								expiresAt: incident.expiresAt + pausedMs,
							},
				),
				recruitLeads: s.recruitLeads.map((lead) => ({
					...lead,
					createdAt: lead.createdAt + pausedMs,
					expiresAt: lead.expiresAt + pausedMs,
				})),
			}));
		}

		if (
			pausedResolveRemainingMsRef.current !== null &&
			resolveIncidentResumeFnRef.current
		) {
			const remaining = pausedResolveRemainingMsRef.current;
			pausedResolveRemainingMsRef.current = null;
			resolveIncidentDueAtRef.current = Date.now() + remaining;

			resolveIncidentTimeoutRef.current = window.setTimeout(() => {
				resolveIncidentDueAtRef.current = null;
				const fn = resolveIncidentResumeFnRef.current;
				resolveIncidentResumeFnRef.current = null;
				if (fn) fn();
			}, remaining);
		}
	}
	}, [isGameplayPausedByMinigame]);

	useEffect(() => {
		return () => {
			for (const t of placesFetchDebounceByLevelRef.current.values()) {
				clearTimeout(t);
			}
			placesFetchDebounceByLevelRef.current.clear();
		};
	}, []);

	const startPlacesFetchForLevel = useCallback(
		(level: number, options?: { force?: boolean }) => {
			const force = options?.force ?? false;
			// Spawn-driven retries must never abort a slow in-flight fetch (L2 bbox can take ~10s+).
			if (!force && placesFetchInFlightRef.current.get(level)) return;

			const bounds = levelBoundsRef.current.get(level);
			if (!bounds) return;

			const prevAbort = placesAbortByLevelRef.current.get(level);
			prevAbort?.abort();
			const ac = new AbortController();
			placesAbortByLevelRef.current.set(level, ac);

			const gen = (placesFetchGenRef.current.get(level) ?? 0) + 1;
			placesFetchGenRef.current.set(level, gen);

			placesFetchInFlightRef.current.set(level, true);

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
				cache: "no-store",
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
				})
				.finally(() => {
					if (placesAbortByLevelRef.current.get(level) === ac) {
						placesFetchInFlightRef.current.set(level, false);
					}
				});
		},
		[],
	);

	const handleBoundsReady = useCallback(
		(level: number, bounds: LatLngBounds) => {
			levelBoundsRef.current.set(level, bounds);

			const prevTimer = placesFetchDebounceByLevelRef.current.get(level);
			if (prevTimer !== undefined) clearTimeout(prevTimer);

			const tid = window.setTimeout(() => {
				placesFetchDebounceByLevelRef.current.delete(level);
				startPlacesFetchForLevel(level, { force: true });
			}, PLACES_FETCH_DEBOUNCE_MS);

			placesFetchDebounceByLevelRef.current.set(level, tid);
		},
		[startPlacesFetchForLevel],
	);

	// ── Incident helpers ──────────────────────────────────────────────────────

	const expireIncident = async (id: string) => {
		if (mode === "multiplayer" && sessionId) {
			await deleteSessionMarkerByMarkerId(sessionId, id);
			return;
		}
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
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setDialogue(null);
		setShowVettingModal(false);
		setSelectedTheftSiteId(null);
		setState((s) => {
			if (s.selectedIncidentId === id && s.showIncidentPanel) {
				return {
					...s,
					selectedIncidentId: null,
					showIncidentPanel: false,
					showMinigamePanel: false,
					showPolicePanel: false,
				};
			}
			return {
				...s,
				selectedIncidentId: id,
				showIncidentPanel: true,
				showMinigamePanel: false,
				showPolicePanel: false,
			};
		});
	};

	/** List rows only select and keep the panel open — no toggle-to-close (avoids double-click closing). */
	const handleIncidentPanelRowClick = (id: string) => {
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setDialogue(null);
		setShowVettingModal(false);
		setSelectedTheftSiteId(null);
		setState((s) => ({
			...s,
			selectedIncidentId: id,
			showIncidentPanel: true,
			showMinigamePanel: false,
			showPolicePanel: false,
		}));
	};

	const handleRecruitSelect = (lead: RecruitLead) => {
		setDialogue(null);
		setShowVettingModal(false);
		setSelectedTheftSiteId(null);
		setState((s) => ({ ...s, selectedIncidentId: null }));
		setOverlayMode("recruit");
		setSelectedOwnedVigilanteId(null);
		setSelectedRecruitLeadId(lead.id);
	};

	const handleOwnedVigilanteSelect = (vigilanteId: string) => {
		setDialogue(null);
		setShowVettingModal(false);
		setSelectedTheftSiteId(null);
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
		setSelectedTheftSiteId(null);

		if (pin.kind === "vigilante") {
			// Find vigilante data
			const vigilante = vigilantes.find((v) => v.id === pin.id);
			if (!vigilante) return;

			// Build AI context for Vigilante
			const aiContext: AIDialogueContext = {
				characterId: vigilante.id,
				characterRole: "Vigilante",
				overallStory: GAME_STORY,
				pastIncidents: getPastIncidentsForAI(state.incidents, 10),
				currentIncident: state.selectedIncidentId
					? {
							type:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.category || "unknown",
							description:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.summary || "",
						}
					: undefined,
				situation:
					"Vigilante reporting to their handler or discussing the mission.",
				customProfile: {
					name: vigilante.alias || vigilante.name,
					portrait: vigilante.portrait,
					personality:
						vigilante.bio ||
						`A skilled operative with ${vigilante.role} responsibilities.`,
				},
			};

			// Use AI dialogue only - no fallback
			void (async () => {
				const result = await generateAIDialogue(aiContext);
				if (result) {
					openDialogue({
						name: result.speakerName,
						role: result.speakerRole,
						portrait: result.portrait,
						text: result.text,
						dialogueType: result.type,
						characterId: result.speakerId,
					});
				}
				// If AI fails, show nothing
			})();

			// Still open the owned overlay to show vigilante details
			handleOwnedVigilanteSelect(pin.id);
			return;
		}

		if (pin.kind === "citizen") {
			const citizen =
				NPC_DIALOGUE.citizens.find((c) => c.name === pin.name) ??
				NPC_DIALOGUE.citizens[0];

			// First show a fallback line so user sees something immediately
			openDialogue({
				name: citizen.name,
				role: citizen.role,
				portrait: citizen.portrait,
				text: randomFrom(citizen.lines),
				characterId: citizen.id,
			});

			// Gather context for AI dialogue generation
			const aiContext: AIDialogueContext = {
				characterId:
					citizen.id || pin.name.toLowerCase().replace(/\s+/g, "-"),
				characterRole: "Citizen",
				overallStory: GAME_STORY,
				pastIncidents: getPastIncidentsForAI(state.incidents, 10),
				currentIncident: state.selectedIncidentId
					? {
							type:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.category || "unknown",
							description:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.summary || "",
						}
					: undefined,
				situation:
					"Citizen reporting information or reacting to ongoing events in the neighborhood.",
				customProfile: {
					name: citizen.name,
					portrait: citizen.portrait,
					personality: citizen.personality,
				},
			};

			// Use AI dialogue only - no fallback
			void (async () => {
				const result = await generateAIDialogue(aiContext);
				if (result) {
					openDialogue({
						name: result.speakerName,
						role: result.speakerRole,
						portrait: result.portrait,
						text: result.text,
						dialogueType: result.type,
						characterId: result.speakerId,
					});
				}
				// If AI fails, show nothing
			})();
			return;
		}

		if (pin.name === "Chief Williams") {
			openDialogue({
				name: NPC_DIALOGUE.chief.name,
				role: NPC_DIALOGUE.chief.role,
				portrait: NPC_DIALOGUE.chief.portrait,
				text: randomFrom(NPC_DIALOGUE.chief.lines),
				characterId: NPC_DIALOGUE.chief.id,
			});
			const chiefProfile = NPC_DIALOGUE.chief;

			// Build AI context for Chief
			const aiContext: AIDialogueContext = {
				characterId: chiefProfile.id,
				characterRole: chiefProfile.role,
				overallStory: GAME_STORY,
				pastIncidents: getPastIncidentsForAI(state.incidents, 10),
				currentIncident: state.selectedIncidentId
					? {
							type:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.category || "unknown",
							description:
								state.incidents.find(
									(i) => i.id === state.selectedIncidentId,
								)?.summary || "",
						}
					: undefined,
				situation:
					"Chief Williams discussing the state of the city and vigilante operations.",
				customProfile: {
					name: chiefProfile.name,
					portrait: chiefProfile.portrait,
					personality: chiefProfile.personality,
				},
			};

			// Use AI dialogue only - no fallback
			void (async () => {
				const result = await generateAIDialogue(aiContext);
				if (result) {
					openDialogue({
						name: result.speakerName,
						role: result.speakerRole,
						portrait: result.portrait,
						text: result.text,
						dialogueType: result.type,
						characterId: result.speakerId,
					});
				}
				// If AI fails, show nothing
			})();
			return;
		}

		const officer =
			NPC_DIALOGUE.police.find((p) => p.name === pin.name) ??
			NPC_DIALOGUE.police[0];

		// First show fallback line so user sees something immediately
		openDialogue({
			name: officer.name,
			role: officer.role,
			portrait: officer.portrait,
			text: randomFrom(officer.lines),
			characterId: officer.id,
		});

		// Build AI context for Police Officer
		const aiContext: AIDialogueContext = {
			characterId: officer.id,
			characterRole: officer.role,
			overallStory: GAME_STORY,
			pastIncidents: getPastIncidentsForAI(state.incidents, 10),
			currentIncident: state.selectedIncidentId
				? {
						type:
							state.incidents.find(
								(i) => i.id === state.selectedIncidentId,
							)?.category || "unknown",
						description:
							state.incidents.find(
								(i) => i.id === state.selectedIncidentId,
							)?.summary || "",
					}
				: undefined,
			situation:
				"Police officer discussing the incident or giving orders to vigilantes.",
			customProfile: {
				name: officer.name,
				portrait: officer.portrait,
				personality: officer.personality,
			},
		};

		// Use AI dialogue only - no fallback
		void (async () => {
			const result = await generateAIDialogue(aiContext);
			if (result) {
				openDialogue({
					name: result.speakerName,
					role: result.speakerRole,
					portrait: result.portrait,
					text: result.text,
					dialogueType: result.type,
					characterId: result.speakerId,
				});
			}
			// If AI fails, show nothing
		})();
	};

	const handleTheftSiteSelect = (site: TheftSite) => {
		setDialogue(null);
		setSelectedRecruitLeadId(null);
		setSelectedOwnedVigilanteId(null);
		setShowVettingModal(false);
		setState((s) => ({ ...s, selectedIncidentId: null }));
		setSelectedTheftSiteId(site.id);
	};

	const handleStartTheft = () => {
		if (!selectedTheftSite) return;
		setInventorySorterMode("resource-theft");
	};

	const handleTheftSuccess = (
		site: TheftSite,
		reward: {
			credits: number;
			items: Array<{ type: string; quantity: number }>;
		},
	) => {
		const theftIncident = makeTheftIncident(site);

		setState((s) => ({
			...s,
			credits: Math.max(0, s.credits + Math.max(0, reward.credits)),
			resourcePool: applyInventorySorterRewardToPool(
				s.resourcePool,
				reward.items,
			),
			consumedTheftSiteIds: s.consumedTheftSiteIds.includes(site.id)
				? s.consumedTheftSiteIds
				: [...s.consumedTheftSiteIds, site.id],
			incidents: [theftIncident, ...s.incidents],
			selectedIncidentId: theftIncident.id,
			showIncidentPanel: true,
			showMinigamePanel: false,
			showPolicePanel: false,
		}));

		if (mode === "multiplayer" && sessionId) {
			void insertSessionMarker({
				sessionId,
				markerId: theftIncident.id,
				kind: "theft",
				x: theftIncident.lat,
				y: theftIncident.lng,
				title: theftIncident.title,
				details: theftIncident.summary,
				createdAt: new Date(theftIncident.createdAt).toISOString(),
				expiresAt: new Date(theftIncident.expiresAt).toISOString(),
				status: "active",
			});
		}

		setInventorySorterMode(null);
		setSelectedTheftSiteId(null);
	};

	const handleHireSelected = () => {
		const lead = state.recruitLeads.find(
			(r) => r.id === selectedRecruitLeadId,
		);
		if (!lead) return;
		const isNewRecruit = !state.ownedVigilanteIds.includes(
			lead.vigilanteId,
		);

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

		// Track achievement progress
		if (isNewRecruit) {
			achievements.trackVigilanteRecruitment(lead.vigilanteId);
		}

		setSelectedRecruitLeadId(null);
		setShowVettingModal(false);
	};

	const expireRecruitLead = useCallback((leadId: string) => {
		setState((s) => ({
			...s,
			recruitLeads: s.recruitLeads.filter((r) => r.id !== leadId),
		}));

		setSelectedRecruitLeadId((current) =>
			current === leadId ? null : current,
		);
		setShowVettingModal(false);
	}, []);

	// ── Minigame helpers ──────────────────────────────────────────────────────

	const getMinigameForIncident = (
		incident: Incident,
	): { type: "fire"; difficulty: number } | null => {
		if (incident.category === "fire_rescue" && Math.random() <= 1) {
			return { type: "fire", difficulty: 0 };
		}
		return null;
	};

	const finishIncidentResolutionForId = (
		incidentId: string,
		rollOutcome: {
			success: boolean;
			adjustedPercent: number;
			beforeLuckPercent: number;
			rolled: number;
			baseChancePercent: number;
			resourceMultiplier: number;
			buffMultiplier: number;
			vigilanteMultiplier: number;
			avgArchetypeFit: number;
			staffingSupportMultiplier: number;
			gearPresenceMultiplier: number;
			luckDeltaPercent: number;
		},
	) => {
		if (mode === "multiplayer" && sessionId) {
			void deleteSessionMarkerByMarkerId(sessionId, incidentId);
			return;
		}

		setState((s) => {
			const cur = s.incidents.find((x) => x.id === incidentId);
			if (!cur || cur.status !== "resolving") return s;
			const deployed = cur.deployedResourceIds ?? [];
			let pool = s.resourcePool;
			if (deployed.length > 0) {
				if (rollOutcome.success) {
					pool = returnDeployment(pool, deployed);
				} else {
					pool = forfeitDeployment(pool, deployed);
				}
			}
			const missionCredits = rollOutcome.success ? 80 : 20;
			return {
				...s,
				resourcePool: pool,
				credits: Math.max(0, s.credits + missionCredits),
				careerStats: {
					...s.careerStats,
					dispatchesCompleted: s.careerStats.dispatchesCompleted + 1,
					incidentsResolvedSuccess:
						s.careerStats.incidentsResolvedSuccess +
						(rollOutcome.success ? 1 : 0),
					incidentsResolvedFailure:
						s.careerStats.incidentsResolvedFailure +
						(rollOutcome.success ? 0 : 1),
				},
				incidents: s.incidents.map((x) =>
					x.id === incidentId
						? {
							...x,
							status: "resolved" as const,
							deployedResourceIds: [],
							resolution: {
								success: rollOutcome.success,
								adjustedPercent: rollOutcome.adjustedPercent,
								beforeLuckPercent: rollOutcome.beforeLuckPercent,
								rolled: rollOutcome.rolled,
								baseChancePercent: rollOutcome.baseChancePercent,
								resourceMultiplier: rollOutcome.resourceMultiplier,
								buffMultiplier: rollOutcome.buffMultiplier,
								vigilanteMultiplier: rollOutcome.vigilanteMultiplier,
								avgArchetypeFit: rollOutcome.avgArchetypeFit,
								staffingSupportMultiplier: rollOutcome.staffingSupportMultiplier,
								gearPresenceMultiplier: rollOutcome.gearPresenceMultiplier,
								luckDeltaPercent: rollOutcome.luckDeltaPercent,
							},
						}
						: x,
				),
			};
		});
	};

	const handleMinigameSuccess = () => {
		if (!state.activeMinigame) return;
		const { type, incidentId } = state.activeMinigame;

		if (type === "hack") {
			setState((s) => ({ ...s, activeMinigame: null }));
			return;
		}

		const inc = state.incidents.find((i) => i.id === incidentId);
		setState((s) => ({ ...s, activeMinigame: null }));
		if (!inc) return;

		finishIncidentResolutionForId(incidentId, {
			success: true,
			adjustedPercent: 100,
			beforeLuckPercent: 100,
			rolled: 1,
			baseChancePercent: inc.successChance,
			resourceMultiplier: 1,
			buffMultiplier: 1,
			vigilanteMultiplier: 1,
			avgArchetypeFit: 1,
			staffingSupportMultiplier: 1,
			gearPresenceMultiplier: 1,
			luckDeltaPercent: 0,
		});
	};

	const handleMinigameFailure = () => {
		if (!state.activeMinigame) return;
		const { type, incidentId } = state.activeMinigame;

		if (type === "hack") {
			setState((s) => ({ ...s, activeMinigame: null }));
			return;
		}

		const inc = state.incidents.find((i) => i.id === incidentId);
		setState((s) => ({ ...s, activeMinigame: null }));
		if (!inc) return;

		finishIncidentResolutionForId(incidentId, {
			success: false,
			adjustedPercent: 0,
			beforeLuckPercent: 0,
			rolled: 100,
			baseChancePercent: inc.successChance,
			resourceMultiplier: 1,
			buffMultiplier: 1,
			vigilanteMultiplier: 1,
			avgArchetypeFit: 1,
			staffingSupportMultiplier: 1,
			gearPresenceMultiplier: 1,
			luckDeltaPercent: 0,
		});
	};

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

		// Track quick response: time from spawn to deployment (incident expires at timestamp)
		const deploymentTimeMs = inc.expiresAt
			? inc.expiresAt - Date.now() - 30000
			: 0;
		if (deploymentTimeMs > 0) {
			// achievements.trackDeployment(deploymentTimeMs);
			// Disabled - need better tracking of spawn-to-deploy timing
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

		const minigame = getMinigameForIncident(inc);
		if (minigame) {
			if (resolveIncidentTimeoutRef.current) {
				clearTimeout(resolveIncidentTimeoutRef.current);
			}
			setDeployModalOpen(false);
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
					activeMinigame: {
						type: minigame.type,
						incidentId: id,
						difficulty: minigame.difficulty,
					},
				};
			});
			return;
		}

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
		const finishIncidentResolution = () => {
			resolveIncidentTimeoutRef.current = null;
			resolveIncidentDueAtRef.current = null;
			resolveIncidentResumeFnRef.current = null;
			pausedResolveRemainingMsRef.current = null;

			if (mode === "multiplayer" && sessionId) {
				void deleteSessionMarkerByMarkerId(sessionId, id);
				return;
			}

			setState((s) => {
				const cur = s.incidents.find((x) => x.id === id);
				if (!cur || cur.status !== "resolving") return s;
				const deployed = cur.deployedResourceIds ?? [];
				let pool = s.resourcePool;
				if (deployed.length > 0) {
					if (rollOutcome.success) {
						pool = returnDeployment(pool, deployed);
					} else {
						pool = forfeitDeployment(pool, deployed);
					}
				}
				const missionCredits = rollOutcome.success ? 80 : 20;

				// Get achievement progress updates
				const achievementUpdates = achievements.trackIncidentResolution(
					inc.category,
					rollOutcome.success,
					missionCredits,
				);

				return {
					...s,
					resourcePool: pool,
					credits: Math.max(0, s.credits + missionCredits),
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
					achievementProgress: {
						...s.achievementProgress,
						...achievementUpdates,
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
										staffingSupportMultiplier:
											rollOutcome.staffingSupportMultiplier,
										gearPresenceMultiplier:
											rollOutcome.gearPresenceMultiplier,
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

			if (inc.category === "disaster" && rollOutcome.success && Math.random() <= 1) {
				setPendingHackMinigame({ incidentId: id });
			}
		};
		resolveIncidentResumeFnRef.current = finishIncidentResolution;
		resolveIncidentDueAtRef.current = Date.now() + RESOLVE_MS;

		resolveIncidentTimeoutRef.current = window.setTimeout(
			finishIncidentResolution,
			RESOLVE_MS,
		);
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

	useEffect(() => {
		if (isGameplayPausedByMinigame) return;

		let alive = true;
		const MAX_ACTIVE = 100;
		const SPAWN_INTERVAL_MS = 5_000;

		const scheduleNext = () => {
			if (!alive) return;
			window.setTimeout(() => {
				if (!alive) return;

				if (mode === "multiplayer" && !isHost) {
					scheduleNext();
					return;
				}

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

					// No POIs yet (Overpass still loading / failed) or empty bbox:
					// skip this tick — never random sampleInBounds (water, etc.) or
					// placeholder names. Soft refetch if idle (never aborts in-flight).
					if (!place) {
						if (places.length === 0) {
							queueMicrotask(() =>
								startPlacesFetchForLevel(s.level, {
									force: false,
								}),
							);
						}
						return s;
					}

					const newIncident = makeIncident(
						place.lat,
						place.lng,
						place,
					);

					if (mode === "multiplayer" && sessionId) {
						void insertSessionMarker({
							sessionId,
							markerId: newIncident.id,
							kind: "incident",
							x: newIncident.lat,
							y: newIncident.lng,
							title: newIncident.title,
							details: newIncident.summary,
							createdAt: new Date(
								newIncident.createdAt,
							).toISOString(),
							expiresAt: new Date(
								newIncident.expiresAt,
							).toISOString(),
							status: "active",
						});
						return s;
					}

					// Track incident spawn for quick response achievement
					const spawnUpdates = achievements.trackIncidentSpawn();

					return {
						...s,
						achievementProgress: {
							...s.achievementProgress,
							...spawnUpdates,
						},
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
	}, [
		isGameplayPausedByMinigame,
		mode,
		isHost,
		sessionId,
		startPlacesFetchForLevel,
	]);

	useEffect(() => {
		if (isGameplayPausedByMinigame) return;

		let alive = true;

		const MAX_RECRUITS = 3;
		const SPAWN_INTERVAL_MS = 260_000;

		const scheduleNext = () => {
			if (!alive) return;

			window.setTimeout(() => {
				if (!alive) return;

				setState((s) => {
					if (s.recruitLeads.length >= MAX_RECRUITS) return s;

					if (s.ownedVigilanteIds.length >= 5) return s;

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
	}, [isGameplayPausedByMinigame]);

	// ── Expiry interval ───────────────────────────────────────────────────────────
	// Keep a ref so the interval callback always reads the latest state without
	// needing to be recreated (which was causing stale-closure bugs where stretched
	// timestamps weren't visible to an already-running interval).
	const stateForExpiryRef = useRef(state);
	stateForExpiryRef.current = state;

	useEffect(() => {
		if (isGameplayPausedByMinigame) return;

		const id = window.setInterval(() => {
			const now = Date.now();
			const s = stateForExpiryRef.current;

			if (mode === "multiplayer" && sessionId) {
				const expiredIds = s.incidents
					.filter((i) => i.status === "active" && now >= i.expiresAt)
					.map((i) => i.id);

				expiredIds.forEach((incidentId) => {
					void deleteSessionMarkerByMarkerId(sessionId, incidentId);
				});

				if (
					selectedRecruitLeadId &&
					!s.recruitLeads.some((r) => r.id === selectedRecruitLeadId)
				) {
					setSelectedRecruitLeadId(null);
				}
				return;
			}

			setState((prev) => {
				// No stretch needed here — already applied synchronously on unpause.
				const expiredIncidentIds = new Set(
					prev.incidents
						.filter((i) => i.status === "active" && now >= i.expiresAt)
						.map((i) => i.id),
				);
				const expiredRecruitIds = new Set(
					prev.recruitLeads
						.filter((r) => now >= r.expiresAt)
						.map((r) => r.id),
				);

				if (expiredIncidentIds.size === 0 && expiredRecruitIds.size === 0) {
					return prev;
				}

				return {
					...prev,
					selectedIncidentId: expiredIncidentIds.has(prev.selectedIncidentId ?? "")
						? null
						: prev.selectedIncidentId,
					incidents: prev.incidents.filter((i) => !expiredIncidentIds.has(i.id)),
					recruitLeads: prev.recruitLeads.filter((r) => !expiredRecruitIds.has(r.id)),
					careerStats: expiredIncidentIds.size > 0
						? {
							...prev.careerStats,
							incidentsExpired: prev.careerStats.incidentsExpired + expiredIncidentIds.size,
						}
						: prev.careerStats,
				};
			});
			if (
				selectedRecruitLeadId &&
				!stateForExpiryRef.current.recruitLeads.some(
					(r) => r.id === selectedRecruitLeadId,
				)
			) {
				setSelectedRecruitLeadId(null);
			}
		}, 1_000);
		return () => window.clearInterval(id);
	}, [
		isGameplayPausedByMinigame,
		mode,
		sessionId,
		selectedRecruitLeadId,
	]);

	const incidentCitizenPins = useMemo(() => {
		const activeIncidents = state.incidents.filter(isOngoingIncident);

		const citizenTemplates = [
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-oldman"),
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-girl"),
			STATIC_CHARACTER_BASES.find((p) => p.id === "cit-woman"),
		].filter(Boolean) as CharacterPin[];

		return activeIncidents
			.slice(0, citizenTemplates.length)
			.map((incident, idx) => {
				const tpl = citizenTemplates[idx];
				const stable = stableCitizenPositionAroundIncident(
					incident.id,
					{ lat: incident.lat, lng: incident.lng },
					idx,
				);

				return {
					...tpl,
					lat: stable.lat,
					lng: stable.lng,
				};
			});
	}, [state.incidents]);

	const visibleDynamicPins = useMemo(() => {
		const policePins: CharacterPin[] = policeRenderItems.map((item) => ({
			id: item.pinId,
			name: item.name,
			initial: item.initial,
			kind: "police",
			lat: item.lat,
			lng: item.lng,
		}));

		const ownedRoster = vigilantes.filter((v) =>
			state.ownedVigilanteIds.includes(v.id),
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

		return [...incidentCitizenPins, ...policePins, ...ownedPins];
	}, [state.ownedVigilanteIds, incidentCitizenPins, policeRenderItems]);

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

	const [nowTick, setNowTick] = useState(() => Date.now());

	useEffect(() => {
		if (isGameplayPausedByMinigame) return;

		const id = window.setInterval(() => {
			setNowTick(Date.now());
		}, 250);

		return () => window.clearInterval(id);
	}, [isGameplayPausedByMinigame]);

	const selectedRecruitMsLeft = selectedRecruitLead
		? Math.max(0, selectedRecruitLead.expiresAt - nowTick)
		: 0;

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

	const availableTheftSites = useMemo(
		() =>
			THEFT_SITES.filter(
				(site) => !state.consumedTheftSiteIds.includes(site.id),
			),
		[state.consumedTheftSiteIds],
	);

	const selectedTheftSite = useMemo(
		() =>
			availableTheftSites.find((site) => site.id === selectedTheftSiteId) ??
			null,
		[availableTheftSites, selectedTheftSiteId],
	);

	const incidentPanelRows = useMemo(() => {
		return [...state.incidents].sort((a, b) => {
			const rk = (i: Incident) =>
				i.status === "active" ? 0 : i.status === "resolving" ? 1 : 2;
			const d = rk(a) - rk(b);
			if (d !== 0) return d;
			return a.expiresAt - b.expiresAt;
		});
	}, [state.incidents]);

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
				.vigilante-theftsite-icon { background: none; border: none; }
				.vigilante-hide-scrollbar::-webkit-scrollbar { display: none; }
				.vigilante-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
				.leaflet-pane.characterPane { z-index: 820 !important; }
				.leaflet-pane.incidentPane { z-index: 940 !important; }
				.leaflet-pane.recruitPane { z-index: 960 !important; }
				.leaflet-pane.theftSitePane { z-index: 900 !important; }
				.leaflet-marker-icon.vigilante-character-icon,
				.leaflet-marker-icon.vigilante-recruit-icon,
				.leaflet-marker-icon.vigilante-theftsite-icon {
					pointer-events: auto !important;
				}

				.vigilante-character-icon > div,
				.vigilante-character-icon > div > div,
				.vigilante-recruit-icon > div,
				.vigilante-recruit-icon > div > div,
				.vigilante-theftsite-icon > div,
				.vigilante-theftsite-icon > div > div {
					cursor: pointer !important;
					pointer-events: none !important;
				}
				@keyframes vigilante-pulse-soft {
					0%   { box-shadow: 0 0 0 0 rgba(185,28,28,0.35); }
					60%  { box-shadow: 0 0 0 10px rgba(185,28,28,0); }
					100% { box-shadow: 0 0 0 12px rgba(185,28,28,0); }
				}
				@keyframes vigilante-pulse-selected {
					0%   { box-shadow: 0 0 0 0 rgba(185,28,28,0.35), 0 0 16px rgba(0,0,0,0.9); }
					60%  { box-shadow: 0 0 0 14px rgba(185,28,28,0), 0 0 16px rgba(0,0,0,0.9); }
					100% { box-shadow: 0 0 0 16px rgba(185,28,28,0), 0 0 16px rgba(0,0,0,0.9); }
				}
				.vigilante-incident-icon-pulse > div {
					animation-name: vigilante-pulse-soft;
					animation-duration: 2.2s;
					animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
					animation-iteration-count: infinite;
					will-change: box-shadow;
				}
				.vigilante-incident-icon-pulse.vigilante-incident-icon-selected > div {
					animation-name: vigilante-pulse-selected;
					animation-duration: 2s;
					animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
					animation-iteration-count: infinite;
					will-change: box-shadow;
				}
				@keyframes vigilante-incident-fade-in {
					from { opacity: 0; transform: scale(0.88); }
					to { opacity: 1; transform: scale(1); }
				}
				.vigilante-incident-icon-fade-in > div {
					animation: vigilante-incident-fade-in ${INCIDENT_MAP_FADE_S} cubic-bezier(0.2, 0.85, 0.2, 1) forwards;
					will-change: opacity, transform;
				}
				.vigilante-incident-icon-fade-in.vigilante-incident-icon-pulse.vigilante-incident-icon-selected > div {
					animation:
						vigilante-incident-fade-in ${INCIDENT_MAP_FADE_S} cubic-bezier(0.2, 0.85, 0.2, 1) forwards,
						vigilante-pulse-selected 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
					animation-delay: 0s, ${INCIDENT_MAP_FADE_S};
					will-change: opacity, transform, box-shadow;
				}
				@keyframes vigilante-incident-fade-out {
					from { opacity: 1; transform: scale(1); }
					to { opacity: 0; transform: scale(0.86); }
				}
				.vigilante-incident-icon-fade-out > div {
					animation: vigilante-incident-fade-out ${INCIDENT_MAP_FADE_S} cubic-bezier(0.2, 0.85, 0.2, 1) forwards;
					pointer-events: none;
					will-change: opacity, transform;
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
				<PoliceSystem
					incidents={state.incidents.map((incident) => ({
						id: incident.id,
						lat: incident.lat,
						lng: incident.lng,
						status:
							incident.status === "active"
								? "active"
								: incident.status === "resolved"
									? "resolved"
									: "resolving",
						expiresAt: incident.expiresAt,
					}))}
					onPoliceRenderUpdate={setPoliceRenderItems}
					onPoliceEtaUpdate={setPoliceEtaItems}
					onPoliceResolveIncident={handlePoliceResolveIncident}
					paused={isGameplayPausedByMinigame}
				/>
				<CharacterMarkers
					pins={visibleDynamicPins}
					onSelect={handleCharacterSelect}
				/>
				<TheftSiteMarkers
					sites={availableTheftSites}
					onSelect={handleTheftSiteSelect}
				/>
				<RecruitMarkers
					leads={state.recruitLeads}
					onSelect={handleRecruitSelect}
				/>
				<IncidentMarkers
					incidents={state.incidents}
					selectedId={state.selectedIncidentId}
					onSelect={handleIncidentSelect}
				/>
			</MapContainer>

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
								y: 18,
								scale: 0.98,
							}}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{
								opacity: 0,
								y: 10,
								scale: 0.98,
							}}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="absolute left-1/2 top-1/2 z-[2010] flex h-[88vh] w-[min(34vw,460px)] min-w-[340px] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md"
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
										{overlayMode === "recruit" &&
										selectedRecruitLead ? (
											<div className="mt-3 rounded-xl border border-red-900/35 bg-red-950/15 px-3 py-2">
												<div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-red-200/80">
													<span>
														Applicant availability
													</span>
													<span>
														{formatCountdown(
															selectedRecruitMsLeft,
														)}
													</span>
												</div>
												<IncidentTimerBar
													createdAt={
														selectedRecruitLead.createdAt
													}
													expiresAt={
														selectedRecruitLead.expiresAt
													}
													onExpire={isGameplayPausedByMinigame ? () => {} : () =>
														expireRecruitLead(
															selectedRecruitLead.id,
														)
													}
													paused={isGameplayPausedByMinigame}
												/>
											</div>
										) : null}
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
											</div>
											<p className="text-sm leading-6 text-amber-100/75">
												{activeDossier.bio ?? "Backstory TBD."}
											</p>
										</div>
									</div>

									<div className="mt-6 grid grid-cols-2 gap-3">
										{(["combat", "stealth", "tactics", "nerve"] as const).map((stat) => (
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
												onClick={() => {
													setShowVettingModal(true);
												}}
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

			<AnimatePresence>
				{dialogue ? (
					<>
						{/* Backdrop – closes dialogue when clicked outside */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-[2015] bg-black/30"
							onClick={() => setDialogue(null)}
						/>
						{/* Dialogue container – stop propagation to prevent backdrop click from closing */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2020] w-[min(52vw,720px)] min-w-[320px]"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="overflow-hidden rounded-xl border border-amber-900/40 bg-black/75 shadow-lg backdrop-blur-md relative">
								{dialogue.dialogueType && (
									<div className="absolute top-3 right-4 flex items-center justify-center rounded-full py-1 px-3 text-[9px] leading-none font-bold uppercase tracking-wider bg-transparent text-amber-400 border border-amber-900/40">
										{dialogue.dialogueType === "past"
											? "reminiscing"
											: dialogue.dialogueType ===
												  "current"
												? "responding"
												: dialogue.dialogueType ===
													  "story"
													? "story"
													: ""}
									</div>
								)}
								<div className="flex items-start">
									<div className="shrink-0 border-r border-amber-900/30">
										<div className="relative h-[160px] w-[120px] overflow-hidden rounded-none pt-10">
											<Image
												src={dialogue.portrait}
												alt={dialogue.name}
												fill
												className="object-cover object-top"
												sizes="132px"
											/>
										</div>
									</div>
									<div className="flex h-[160px] flex-1 flex-col justify-between px-4 py-3">
										<div>
											<div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/70">
												{dialogue.role}
											</div>
											<div className="flex items-center gap-2 mt-1">
												<div className="text-base font-bold text-amber-100">
													{dialogue.name}
												</div>
											</div>

											{/* Spectrogram animation */}
											<div className="mt-3 h-5 overflow-hidden">
												<div className="flex h-full items-end gap-[3px]">
													{Array.from({
														length: 20,
													}).map((_, i) => (
														<div
															key={i}
															className="flex h-4 items-end"
														>
															<motion.div
																className="w-[2px] rounded-full bg-amber-400/70"
																animate={{
																	height: [
																		3, 12,
																		5, 16,
																		4,
																	],
																}}
																transition={{
																	duration: 0.8,
																	repeat: Infinity,
																	repeatType:
																		"loop",
																	delay:
																		i *
																		0.05,
																	ease: "easeInOut",
																}}
																style={{
																	height: 4,
																}}
															/>
														</div>
													))}
												</div>
											</div>

											<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-amber-100/80">
												{dialogue.text}
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{selectedTheftSite ? (
					<>
						<motion.div
							className="absolute inset-0 z-[2025] bg-black/25"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedTheftSiteId(null)}
						/>

						<motion.aside
							initial={{ opacity: 0, y: 16, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.98 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="absolute right-6 top-24 z-[2030] w-[min(32vw,420px)] min-w-[320px] overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md"
						>
							<div className="border-b border-amber-900/30 px-5 py-4">
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
											Resource Theft
										</div>
										<h2 className="mt-2 text-2xl font-bold text-amber-100">
											{selectedTheftSite.name}
										</h2>
									</div>

									<button
										type="button"
										onClick={() =>
											setSelectedTheftSiteId(null)
										}
										className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 hover:bg-amber-950/20 hover:text-amber-100 transition"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>

							<div className="px-5 py-4 space-y-4">
								<p className="text-sm leading-6 text-amber-100/75">
									{selectedTheftSite.description}
								</p>

								<div className="rounded-xl border border-amber-900/30 bg-black/25 p-4">
									<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
										Potential haul
									</div>
									<div className="mt-3 flex flex-wrap gap-2">
										{selectedTheftSite.rewardIds.map(
											(id, idx) => (
											<span
												key={`${id}-${idx}`}
												className="rounded-full border border-amber-900/30 bg-black/30 px-3 py-1 text-xs text-amber-100/80"
											>
												{id.toUpperCase()}
											</span>
											),
										)}
									</div>
								</div>

								<div className="rounded-xl border border-red-900/30 bg-red-950/10 p-4">
									<div className="text-[11px] uppercase tracking-[0.24em] text-red-300/70">
										Risk
									</div>
									<p className="mt-2 text-sm leading-6 text-amber-100/70">
										If the theft succeeds, it still creates
										a fresh incident on the map and can draw
										police attention to the area.
									</p>
								</div>
							</div>

							<div className="flex items-center justify-between gap-3 border-t border-amber-900/30 px-5 py-4">
								<button
									type="button"
									onClick={() => setSelectedTheftSiteId(null)}
									className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 hover:bg-amber-950/20 transition"
								>
									Back
								</button>

								<button
									type="button"
									onClick={handleStartTheft}
									className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
								>
									Start Theft
								</button>
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
				createdAt={selectedRecruitLead?.createdAt ?? null}
				expiresAt={selectedRecruitLead?.expiresAt ?? null}
				timeLeftMs={selectedRecruitMsLeft}
				onExpire={() => {
					if (selectedRecruitLead) {
						expireRecruitLead(selectedRecruitLead.id);
					}
				}}
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

			<div className="pointer-events-none absolute inset-y-16 left-0 z-[950] flex items-start pt-4">
				<div className="pointer-events-auto">
					<button
						type="button"
						onClick={() => {
							const wasOpen = state.showIncidentPanel;
							toggleExclusiveLeftPanel("incident");
							if (wasOpen) setDeployModalOpen(false);
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
									return (
										<button
											key={inc.id}
											type="button"
											onClick={() =>
												handleIncidentPanelRowClick(
													inc.id,
												)
											}
											className={`flex h-[92px] flex-col px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
												isSelected
													? "border-amber-500/80 bg-amber-900/50 text-amber-100"
													: "border-amber-900/50 bg-black/40 text-amber-200/70 hover:border-amber-700/70 hover:text-amber-100"
											} w-full rounded-lg border`}
										>
											<div className="flex min-h-0 flex-1 flex-col justify-center">
												<div className="flex h-[64px] w-full shrink-0 items-center gap-3">
													<div
														className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
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
													<div className="flex h-[64px] min-w-0 flex-1 flex-col justify-center gap-1 overflow-hidden">
														<div className="max-h-[26px] overflow-hidden font-semibold text-[12px] leading-[13px] tracking-tight text-amber-50/95">
															{inc.title}
														</div>
														<div
															className="max-h-[26px] overflow-hidden text-[11px] leading-[13px] text-amber-200/70"
															title={inc.summary}
														>
															{inc.summary}
														</div>
													</div>
												</div>
											</div>
											{inc.status === "active" ? (
												<IncidentTimerBar
													createdAt={inc.createdAt}
													expiresAt={inc.expiresAt}
													onExpire={isGameplayPausedByMinigame ? () => {} : () => expireIncident(inc.id)}
													paused={isGameplayPausedByMinigame}
												/>
											) : (
												<div
													className="mt-2 h-[3px] w-full shrink-0"
													aria-hidden
												/>
											)}
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

			<div
				className="fixed left-0 flex items-start"
				style={{ top: 160, zIndex: 2000 }}
			>
				<div className="pointer-events-auto">
					<button
						type="button"
						onClick={() => toggleExclusiveLeftPanel("minigame")}
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
											if (chanceRollOverlay) return;
											if (deployModalOpen) return;
											if (showVettingModal) return;

											if (
												game.id === "inventory-sorter"
											) {
												setInventorySorterMode(
													"supply-recovery",
												);
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

			<div
				className="fixed left-0 flex items-start"
				style={{ top: 270, zIndex: 2000 }}
			>
				<div className="pointer-events-auto">
					<button
						type="button"
						onClick={() => toggleExclusiveLeftPanel("police")}
						className="cursor-pointer rounded-r-full rounded-l-none border border-amber-900/60 bg-black/75 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-amber-200/80 hover:border-amber-500/80 hover:text-amber-100 transition-colors flex items-center gap-1 shadow-[0_0_18px_rgba(120,53,15,0.18)]"
					>
						<span>Police</span>
						<span className="text-[11px] flex items-center">
							{state.showPolicePanel ? (
								<ChevronLeft className="w-3 h-3" aria-hidden />
							) : (
								<ChevronRight className="w-3 h-3" aria-hidden />
							)}
						</span>
					</button>
				</div>

				<AnimatePresence initial={false}>
					{state.showPolicePanel && (
						<motion.div
							key="police-panel"
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
									Police
								</div>
							</div>

							<div className="relative flex-1 max-h-72 overflow-y-auto px-3 py-2 space-y-2 vigilante-hide-scrollbar">
								{[...policeEtaItems]
									.sort((a, b) => a.etaMs - b.etaMs)
									.map((item) => (
										<div
											key={`${item.unitId}_${item.incidentId}`}
											className="w-full text-left rounded-lg border px-3 py-2 text-xs border-amber-900/50 bg-black/40 text-amber-200/80 shadow-[inset_0_1px_0_rgba(251,191,36,0.03)]"
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 h-5 w-5 rounded-full border border-red-900 bg-red-900/30 flex items-center justify-center text-[11px] text-red-300">
													P
												</div>
												<div className="flex-1">
													<div className="font-semibold text-[11px] uppercase tracking-[0.16em] text-amber-100/95">
														{item.name}
													</div>
													<div className="mt-1 text-[11px] text-amber-200/70 line-clamp-2">
														Responding to{" "}
														{item.incidentId.slice(
															0,
															12,
														)}
														...
													</div>
													<div className="mt-1 text-[11px] text-amber-100/90">
														ETA:{" "}
														{formatEta(item.etaMs)}
													</div>
													<PoliceEtaBar
														etaMs={item.etaMs}
													/>
												</div>
											</div>
										</div>
									))}

								{policeEtaItems.length === 0 && (
									<div className="text-[11px] text-amber-200/50 px-1 py-2">
										No police currently en route.
									</div>
								)}

								<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-black/70 to-transparent" />
							</div>

							{policeEtaItems.length > 3 && (
								<div className="px-3 pt-2 pb-3 text-[10px] text-amber-200/50">
									More police responses below – scroll to
									view.
								</div>
							)}
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
					onContinue={() => {
						const pending = pendingHackMinigame;
						setChanceRollOverlay(null);
						if (pending) {
							setPendingHackMinigame(null);
							setState((s) => ({
								...s,
								activeMinigame: {
									type: "hack",
									incidentId: pending.incidentId,
									difficulty: 0,
								},
							}));
						}
					}}
				/>
			)}

			{state.activeMinigame && (
				<>
					{state.activeMinigame.type === "fire" && (
						<FireMinigame
							difficulty={state.activeMinigame.difficulty}
							onSuccess={handleMinigameSuccess}
							onFailure={handleMinigameFailure}
						/>
					)}
					{state.activeMinigame.type === "hack" && (
						<HackMinigame
							difficulty={state.activeMinigame.difficulty}
							onSuccess={handleMinigameSuccess}
							onFailure={handleMinigameFailure}
						/>
					)}
				</>
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
								title: selectedIncident.title,
								summary: selectedIncident.summary,
								createdAt: selectedIncident.createdAt,
								expiresAt: selectedIncident.expiresAt,
							}
						: null
				}
				ownedVigilanteIds={state.ownedVigilanteIds}
				vigilanteSheets={vigilantes}
				resourcePool={state.resourcePool}
				onClose={() => setDeployModalOpen(false)}
				onIncidentExpire={isGameplayPausedByMinigame ? () => {} : () => {
					if (selectedIncident?.status === "active") expireIncident(selectedIncident.id);
					setDeployModalOpen(false);
				}}
				onConfirm={handleDeployConfirm}
			/>

			<InventorySorterModal
				open={inventorySorterMode !== null}
				onClose={() => setInventorySorterMode(null)}
				onWin={(reward) => {
					if (
						inventorySorterMode === "resource-theft" &&
						selectedTheftSite
					) {
						handleTheftSuccess(selectedTheftSite, reward);
						return;
					}
					setInventorySorterMode(null);
				}}
				title={
					inventorySorterMode === "resource-theft"
						? "Resource Theft"
						: "Inventory Sorter"
				}
				subtitle={
					inventorySorterMode === "resource-theft"
						? "Move the stolen goods fast, keep the layout clean, and get out before the area locks down."
						: "Organize the emergency locker to recover extra supplies before time runs out."
				}
				rewardMode={
					inventorySorterMode === "resource-theft"
						? "random-resource"
						: "none"
				}
			/>
			<PoliceCaptureModal
				open={policeCaptureState.open}
				capturedIds={policeCaptureState.capturedIds}
				vigilanteSheets={vigilantes}
				onClose={() =>
					setPoliceCaptureState({
						open: false,
						capturedIds: [],
					})
				}
			/>
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
								vigilanteInjuryUntil={
									state.vigilanteInjuryUntil
								}
								purchasedUpgradeIds={state.purchasedUpgradeIds}
								tab={state.inventoryTab}
								onTabChange={(nextTab) =>
									setState((s) => ({
										...s,
										inventoryTab: nextTab,
									}))
								}
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

				{/* Achievement notifications */}
				<AchievementNotification
					queue={achievements.notificationQueue}
					onDismiss={achievements.dismissNotification}
				/>
			</div>
		</div>
	);
}
