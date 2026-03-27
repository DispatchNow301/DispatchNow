import type { LatLngTuple } from "leaflet";

export type PoliceCharacterPinId =
	| "cop-diaz"
	| "cop-kim"
	| "chief-williams";

export type PatrolRouteId = "diaz" | "kim" | "chief";

export type PoliceMode =
	| "patrolling"
	| "responding"
	| "holding"
	| "rejoining";

export type PoliceIncident = {
	id: string;
	lat: number;
	lng: number;
	status: "active" | "resolving" | "resolved" | "failed";
	expiresAt: number;
};

export type PoliceSpeedProfile = {
	patrolMps: number;
	responseMps: number;
	rejoinMps: number;
};

export type PoliceCharacterConfig = {
	pinId: PoliceCharacterPinId;
	displayName: string;
	initial: string;
	patrolRouteId: PatrolRouteId;
	anchors: LatLngTuple[];
	speeds: PoliceSpeedProfile;
	holdMs: number;
};

export type PoliceUnit = {
	pinId: PoliceCharacterPinId;
	displayName: string;
	initial: string;
	patrolRouteId: PatrolRouteId;
	speeds: PoliceSpeedProfile;
	holdMs: number;
	mode: PoliceMode;
	path: LatLngTuple[];
	segmentIndex: number;
	segmentStartedAt: number;
	segmentDurationMs: number;
	assignedIncidentId: string | null;
	isLooping: boolean;
	nextLoopPath: LatLngTuple[] | null;
	holdUntilTs: number | null;
	cooldownUntilTs: number | null;
	responseOverrideMps: number | null;
};

export type PoliceRenderItem = {
	pinId: PoliceCharacterPinId;
	name: string;
	initial: string;
	lat: number;
	lng: number;
	mode: PoliceMode;
	visiblePath: LatLngTuple[];
	assignedIncidentId: string | null;
};

export type PoliceEtaItem = {
	unitId: PoliceCharacterPinId;
	name: string;
	incidentId: string;
	etaMs: number;
};